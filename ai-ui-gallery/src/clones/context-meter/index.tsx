import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Check, ChevronDown, CircleCheck, FilePlus2, Info, Orbit, Send, Shrink, type LucideIcon } from "lucide-react";
import {
  CELLS,
  COMPACT_AT,
  FILES,
  FILL_KINDS,
  INITIAL_FILL,
  LABELS,
  LEGEND_ORDER,
  MODELS,
  SENDS,
  THRESHOLD_CELL,
  layout,
  pct,
  perCell,
  stagger,
  tokens,
  used,
  type Fill,
  type Kind,
  type Model,
} from "./model";
import "./context-meter.css";

/*
 * Context window meter, motion-faithful to Arc UI "Context window" (see .reanimate/context-meter/spec.md).
 * A 200-cell grid fills by category in order. Sending a message colours the new cells one after another
 * (200 ms quint-out, 9 ms apart) while every readout counts up on a 420 ms cubic-out tween that starts on the
 * next frame. Compacting folds the conversation cells (opacity 1 → .35 → .5, 6 ms apart), and after 700 ms
 * swaps them for a short summary and free space (3 ms apart) while the numbers count down. Hovering a legend
 * row dims every other category (cells to .28, rows to .45, 150 ms quint-out).
 */

const TWEEN_MS = 420; // readouts: 1 - (1 - x)^3 over 420 ms
const SUMMARIZE_MS = 717; // fold phase; the reference collapses between its 700 and 733 ms frames
const FOLD_STEP_MS = 6;
const AUTO_COMPACT_DELAY = 600;

type Phase = "idle" | "summarizing";
type Tone = "info" | "busy" | "done";
interface Status {
  id: number;
  tone: Tone;
  text: string;
}

/* ---------- number tween ---------- */

type Vec = number[]; // [system, tools, files, summary, messages, window, reserve]
const toVec = (f: Fill, m: Model): Vec => [...FILL_KINDS.map((k) => f[k]), m.window, m.reserve];

function useTween(target: Vec): Vec {
  const [display, setDisplay] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    if (from.every((v, i) => v === target[i])) return;
    let raf = 0;
    let start = -1;
    const step = (ts: number) => {
      if (start < 0) start = ts; // the first frame after the commit still shows the old values
      const x = Math.min(1, (ts - start) / TWEEN_MS);
      const e = 1 - (1 - x) ** 3;
      const v = from.map((a, i) => a + (target[i] - a) * e);
      current.current = v;
      flushSync(() => setDisplay(v));
      if (x < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return display;
}

/* ---------- grid ---------- */

interface GridProps {
  kinds: Kind[];
  delays: number[];
  dim: Kind | null;
  foldFrom: number; // first conversation cell when the fold started, or -1
  onHover: (k: Kind | null) => void;
}

const Grid = memo(function Grid({ kinds, delays, dim, foldFrom, onHover }: GridProps) {
  const out: ReactNode[] = [];
  for (let i = 0; i < CELLS; i++) {
    if (i === THRESHOLD_CELL) out.push(<div key="line" className="cm-threshold" aria-hidden />);
    const k = kinds[i];
    const d = delays[i];
    const folding = foldFrom >= 0 && k === "messages";
    out.push(
      <span
        key={i}
        className={folding ? "cm-cell is-folding" : "cm-cell"}
        data-kind={k}
        data-after={i >= THRESHOLD_CELL ? "" : undefined}
        data-dim={dim && dim !== k ? "" : undefined}
        style={{
          transitionDelay: `${d}ms, ${d}ms, 0ms`,
          animationDelay: folding ? `${(i - foldFrom) * FOLD_STEP_MS}ms` : undefined,
        }}
        onPointerEnter={() => onHover(k)}
        onPointerLeave={() => onHover(null)}
      />,
    );
  }
  return (
    <div className="cm-grid" role="img" aria-label="Context window usage by category">
      {out}
    </div>
  );
});

/* ---------- status line ---------- */

const ICONS: Record<Tone, LucideIcon> = { info: Info, busy: Shrink, done: CircleCheck };

function StatusLine({ status, leaving }: { status: Status; leaving: Status | null }) {
  const line = (s: Status, cls: string) => {
    const Icon = ICONS[s.tone];
    return (
      <p key={s.id} className={`cm-status-line ${cls}`} data-tone={s.tone}>
        <Icon className="cm-status-icon" size={15} strokeWidth={2} aria-hidden />
        <span>{s.text}</span>
      </p>
    );
  };
  return (
    <div className="cm-status" role="status" aria-live="polite">
      {leaving && line(leaving, "is-out")}
      {line(status, status.id > 0 ? "is-in" : "")}
    </div>
  );
}

/* ---------- the meter ---------- */

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

function ContextMeter() {
  const [model, setModel] = useState<Model>(MODELS[0]);
  const [fill, setFill] = useState<Fill>(INITIAL_FILL);
  const [grid, setGrid] = useState(() => {
    const kinds = layout(INITIAL_FILL, MODELS[0]);
    return { kinds, delays: kinds.map(() => 0) };
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const [foldFrom, setFoldFrom] = useState(-1);
  const [hover, setHover] = useState<Kind | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ id: 0, tone: "info", text: "Compacts by itself past 80%" });
  const [leaving, setLeaving] = useState<Status | null>(null);
  const [everSummarized, setEverSummarized] = useState(false);

  const state = useRef({ fill, model, kinds: grid.kinds, phase, send: 0, file: 0, statusId: 0, status });
  state.current.fill = fill;
  state.current.model = model;
  state.current.kinds = grid.kinds;
  state.current.phase = phase;
  state.current.status = status;
  const timers = useRef<number[]>([]);
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const say = useCallback((tone: Tone, text: string) => {
    const s = state.current;
    const next = { id: ++s.statusId, tone, text };
    setLeaving(s.status);
    setStatus(next);
    s.status = next;
  }, []);

  /** Commit a new fill (and model): the grid gets its new kinds and per-cell delays in the same render. */
  const commit = useCallback((nextFill: Fill, nextModel: Model) => {
    const s = state.current;
    const kinds = layout(nextFill, nextModel);
    const delays = stagger(s.kinds, kinds);
    s.fill = nextFill;
    s.model = nextModel;
    s.kinds = kinds;
    setFill(nextFill);
    setModel(nextModel);
    setGrid({ kinds, delays });
  }, []);

  const compact = useCallback(() => {
    const s = state.current;
    if (s.phase !== "idle") return;
    const f = s.fill;
    if (f.messages < 30) {
      say("info", "Nothing to compact yet");
      return;
    }
    const keep = Math.min(25, Math.round(f.messages * 4) / 10);
    const folded = f.messages - keep;
    const summary = Math.max(2, Math.round(folded * 0.6) / 10);
    s.phase = "summarizing";
    setPhase("summarizing");
    setFoldFrom(s.kinds.indexOf("messages"));
    setMenuOpen(false);
    say("busy", `Condensing ${Math.max(2, Math.round(folded / 12))} earlier turns`);
    later(SUMMARIZE_MS, () => {
      flushSync(() => {
        s.phase = "idle";
        setPhase("idle");
        setFoldFrom(-1);
        setEverSummarized(true);
        commit({ ...s.fill, summary: s.fill.summary + summary, messages: keep }, s.model);
        say("done", `Folded ${Math.round(folded)}K of history into a ${Math.round(summary)}K summary`);
      });
    });
  }, [commit, later, say]);

  const maybeAutoCompact = useCallback(() => {
    const s = state.current;
    if (used(s.fill) >= COMPACT_AT * s.model.window) later(AUTO_COMPACT_DELAY, compact);
  }, [compact, later]);

  const room = (f: Fill, m: Model) => m.window - m.reserve - used(f);

  const send = useCallback(() => {
    const s = state.current;
    if (s.phase !== "idle") return;
    const turn = SENDS[s.send++ % SENDS.length];
    if (room(s.fill, s.model) < turn.k) {
      say("info", "No room left for that turn");
      return;
    }
    commit({ ...s.fill, messages: Math.round((s.fill.messages + turn.k) * 10) / 10 }, s.model);
    say("info", `Sent “${turn.prompt}” · +${Math.round(turn.k)}K`);
    maybeAutoCompact();
  }, [commit, maybeAutoCompact, say]);

  const attach = useCallback(() => {
    const s = state.current;
    if (s.phase !== "idle") return;
    const file = FILES[s.file++ % FILES.length];
    if (room(s.fill, s.model) < file.k) {
      say("info", `No room left for ${file.name}`);
      return;
    }
    commit({ ...s.fill, files: s.fill.files + file.k }, s.model);
    say("info", `Attached ${file.name} · +${file.k}K`);
    maybeAutoCompact();
  }, [commit, maybeAutoCompact, say]);

  const switchModel = useCallback(
    (m: Model) => {
      const s = state.current;
      setMenuOpen(false);
      if (s.phase !== "idle" || m.id === s.model.id) return;
      commit(s.fill, m);
      say("info", `Switched to ${m.name} · ${m.label} window`);
      maybeAutoCompact();
    },
    [commit, maybeAutoCompact, say],
  );

  const reset = useCallback(() => {
    const s = state.current;
    if (s.phase !== "idle") return;
    s.send = 0;
    s.file = 0;
    setEverSummarized(false);
    commit(INITIAL_FILL, MODELS[0]);
    say("info", "New session · history restored");
  }, [commit, say]);

  /* readouts */
  const target = useMemo(() => toVec(fill, model), [fill, model]);
  const shown = useTween(target);
  const shownFill: Fill = { system: shown[0], tools: shown[1], files: shown[2], summary: shown[3], messages: shown[4] };
  const [win, reserve] = [shown[5], shown[6]];
  const shownUsed = used(shownFill);
  const freeNow = Math.max(0, model.window - model.reserve - used(fill)); // the header's free figure jumps
  const legendValue = (k: Kind) =>
    k === "free" ? Math.max(0, win - reserve - shownUsed) : k === "reserve" ? reserve : shownFill[k];

  /* menu: close on outside press and Escape */
  const pillRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const down = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [menuOpen]);

  /* gallery autoplay: send, hover, attach, compact, switch models, reset; any real input ends it */
  const demo = useRef({ on: autoplayEnabled(), userHover: false });
  useEffect(() => {
    if (!demo.current.on) return;
    const d = demo.current;
    const steps: [number, () => void][] = [
      [1200, send],
      [1700, send],
      [1700, () => !d.userHover && setHover("messages")],
      [1300, () => !d.userHover && setHover(null)],
      [500, attach],
      [1800, compact],
      [2300, send],
      [1800, () => switchModel(MODELS[2])],
      [2000, () => switchModel(MODELS[0])],
      [2000, reset],
      [800, () => undefined],
    ];
    let i = 0;
    let t = 0;
    const run = () => {
      if (!d.on) return;
      const [wait, fn] = steps[i];
      t = window.setTimeout(() => {
        if (!d.on) return;
        fn();
        i = (i + 1) % steps.length;
        run();
      }, wait);
    };
    run();
    return () => clearTimeout(t);
  }, [attach, compact, reset, send, switchModel]);
  const stopDemo = () => {
    demo.current.on = false;
  };

  const onRowHover = useCallback((k: Kind | null) => {
    demo.current.userHover = k !== null;
    setHover(k);
  }, []);

  const busy = phase !== "idle";
  const percentUsed = win > 0 ? (shownUsed / win) * 100 : 0;

  return (
    <section
      className="cm-root"
      data-phase={phase}
      aria-label="Context window"
      onPointerDown={stopDemo}
      onKeyDown={stopDemo}
      onWheel={stopDemo}
    >
      <header className="cm-header">
        <div className="cm-readout">
          <p className="cm-used">
            <span className="cm-used-value" data-num>
              {tokens(shownUsed)}
            </span>
            <span className="cm-used-of">of {model.label} tokens</span>
          </p>
          <p className="cm-meta">
            <span className="cm-tab" data-num>
              {Math.round(percentUsed)}%
            </span>
            <span>used</span>
            <span className="cm-dot" aria-hidden />
            <span className="cm-tab">{tokens(freeNow)} free</span>
          </p>
        </div>
        <div className="cm-pill-wrap" ref={pillRef}>
          <button
            type="button"
            className="cm-pill"
            data-t="model"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={busy}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Orbit className="cm-pill-mark" size={16} strokeWidth={2} aria-hidden />
            <span className="cm-pill-name">{model.name}</span>
            <span className="cm-pill-window">{model.label}</span>
            <ChevronDown className="cm-pill-chevron" size={15} strokeWidth={2} aria-hidden />
          </button>
          {menuOpen && (
            <div className="cm-menu" role="menu" aria-label="Model">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={m.id === model.id}
                  className="cm-menu-item"
                  onClick={() => switchModel(m)}
                >
                  <Orbit size={15} strokeWidth={2} aria-hidden className="cm-menu-mark" data-model={m.id} />
                  <span className="cm-menu-name">{m.name}</span>
                  <span className="cm-menu-window">{m.label}</span>
                  <Check size={15} strokeWidth={2} aria-hidden className="cm-menu-check" />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="cm-body">
        <div className="cm-grid-wrap">
          <Grid kinds={grid.kinds} delays={grid.delays} dim={hover} foldFrom={foldFrom} onHover={onRowHover} />
          <p className="cm-grid-note">
            <span>One cell holds {perCell(model)} tokens</span>
            <span className="cm-threshold-key">
              <span className="cm-threshold-swatch" aria-hidden />
              Auto-compact line · 80%
            </span>
          </p>
        </div>

        <ul className="cm-legend" aria-label="What is in the window">
          {LEGEND_ORDER.map((k) => {
            const v = legendValue(k);
            const empty = k === "summary" && !everSummarized && fill.summary === 0 && v === 0;
            return (
              <li
                key={k}
                className="cm-legendRow"
                data-kind={k}
                data-empty={empty ? "" : undefined}
                data-dim={hover && hover !== k ? "" : undefined}
                onPointerEnter={() => onRowHover(k)}
                onPointerLeave={() => onRowHover(null)}
              >
                <span className="cm-swatch" data-kind={k} aria-hidden />
                <span className="cm-legend-name">{LABELS[k]}</span>
                <span className="cm-legend-tokens">{empty ? "Nothing yet" : tokens(v)}</span>
                <span className="cm-legend-pct">{empty ? "" : pct(win > 0 ? (v / win) * 100 : 0)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="cm-footer">
        <div className="cm-actions">
          <button type="button" className="cm-btn cm-btn--primary" data-t="send" disabled={busy} onClick={send}>
            <Send size={18} strokeWidth={1.8} aria-hidden />
            Send message
          </button>
          <button type="button" className="cm-btn cm-btn--secondary" data-t="attach" disabled={busy} onClick={attach}>
            <FilePlus2 size={18} strokeWidth={1.8} aria-hidden />
            Add a file
          </button>
          <button type="button" className="cm-btn cm-btn--ghost" data-t="compact" disabled={busy} onClick={compact}>
            <Shrink size={18} strokeWidth={1.8} aria-hidden />
            Compact now
          </button>
        </div>
        <StatusLine status={status} leaving={leaving} />
      </footer>
    </section>
  );
}

/**
 * The meter on a full-stage wrapper. `?autoplay=0` turns the gallery demo off (used by the capture), and
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts it.
 */
export default function ContextMeterClone() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="cm-stage">
      <ContextMeter key={run} />
    </div>
  );
}
