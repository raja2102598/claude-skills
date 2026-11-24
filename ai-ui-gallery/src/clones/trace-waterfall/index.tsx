import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import {
  BadgeCheck,
  ChevronRight,
  CircleAlert,
  FileSearch,
  Network,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { KINDS, KIND_LABEL, RUN, SPANS, TICKS, type Kind, type Span } from "./data";
import "./trace-waterfall.css";

/*
 * Trace waterfall, motion-faithful to beUI Pro "Agent Traces · Trace waterfall".
 * A nested span waterfall for one agent run. A playhead sweeps the run's time axis at a constant rate; each bar fills
 * from its left edge as the playhead crosses it and each row lights up (0.4 → 1) when the playhead reaches its start.
 * On mount the card plays a fast intro sweep (2.4 s) while the stat odometers roll; Replay plays the run again over 6 s,
 * with Pause / Resume. Rows select into the detail panel, parents collapse their subtree, legend chips dim a kind.
 * The playhead is a rAF loop committed with flushSync (frame-exact on a virtual clock); odometers and panel swaps are
 * CSS keyframes.
 */

// ---------- motion constants (measured on the reference, see .reanimate/trace-waterfall/spec.md) ----------

const TOTAL = RUN.total; // 9180 ms of trace
const INTRO_MS = 2400; // in-view intro sweep, linear
const REPLAY_MS = 6000; // Replay sweep, linear
const DIM = 0.4; // rows the playhead has not reached
const LABEL_FLIP = 0.72; // bars ending past this fraction carry their duration label on the left

/** Exponential ease-out (tau ms) sampled into a CSS linear() easing over `ms`. */
function expoEase(tau: number, ms: number, samples = 30) {
  const end = 1 - Math.exp(-ms / tau);
  const stops = Array.from({ length: samples + 1 }, (_, i) => +((1 - Math.exp(-((i / samples) * ms) / tau)) / end).toFixed(4));
  return `linear(${stops.join(", ")})`;
}
const ODO = { ms: 900, ease: expoEase(130, 900) };

const KIND_ICON: Record<Kind, LucideIcon> = { agent: Network, model: Sparkles, tool: Terminal, retrieval: FileSearch, check: BadgeCheck };

// ---------- helpers ----------

const pct = (ms: number) => (ms / TOTAL) * 100;
const fmt = (ms: number) => (ms < 1000 ? `${Math.round(ms / 10) * 10}ms` : `${(ms / 1000).toFixed(2)}s`);

const BY_ID = new Map(SPANS.map((s) => [s.id, s]));
const depthOf = (s: Span): number => (s.parent ? depthOf(BY_ID.get(s.parent)!) + 1 : 0);
const hasChildren = (id: string) => SPANS.some((s) => s.parent === id);
const ROWS = SPANS.map((s) => ({ span: s, depth: depthOf(s), parent: hasChildren(s.id) }));

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};
const reducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

// ---------- odometer ----------

function Odometer({ value }: { value: string }) {
  return (
    <span className="inline-flex items-baseline tw-mono text-lg tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {value.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="relative inline-block text-center [clip-path:inset(0)]" style={{ height: "1.1em", lineHeight: "1.1em", width: "1ch" }}>
              <span className="invisible">{ch}</span>
              <span className="tw-odo-col absolute inset-x-0 top-0 flex flex-col items-center" style={{ "--d": +ch } as CSSProperties}>
                {"0123456789".split("").map((d) => (
                  <span key={d} className="flex h-[1.1em] items-center justify-center leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="inline-block">
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

// ---------- detail panel ----------

function Detail({ span, onClear }: { span: Span; onClear: () => void }) {
  const Icon = KIND_ICON[span.kind];
  return (
    <div key={span.id} className="tw-panel-in space-y-6 p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--tw-muted)] text-[var(--tw-dim)]">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <span
            className={clsx("inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium", `tw-k-${span.kind}`)}
            style={{ color: "var(--k)", borderColor: "color-mix(in oklab, var(--k) 30%, transparent)", background: "color-mix(in oklab, var(--k) 12%, transparent)" }}
          >
            {KIND_LABEL[span.kind]}
          </span>
          <h3 className="mt-1.5 break-all tw-mono text-sm font-medium">{span.name}</h3>
        </div>
        <button
          type="button"
          aria-label="Clear selection"
          onClick={onClear}
          className="-mr-2 -mt-1 grid size-9 place-items-center rounded-full text-[var(--tw-dim)] transition-colors hover:bg-[var(--tw-muted)] hover:text-[var(--tw-ink)]"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="tw-mono text-xs uppercase tracking-widest text-[var(--tw-dim)]">Timing</h4>
          <span className="tw-mono text-sm tabular-nums">{fmt(span.dur)}</span>
        </div>
        <div className="relative mt-3 h-2 rounded-full bg-[var(--tw-muted)]">
          <span
            className={clsx("absolute inset-y-0 rounded-full", `tw-k-${span.kind}`)}
            style={{ left: `${pct(span.start)}%`, width: `${pct(span.dur)}%`, background: span.error ? "var(--tw-error)" : "var(--k)" }}
          />
        </div>
        <div className="mt-2 flex justify-between tw-mono text-xs tabular-nums text-[var(--tw-dim)]">
          <span>Start {fmt(span.start)}</span>
          <span>End {fmt(span.start + span.dur)}</span>
        </div>
      </section>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {span.facts.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-xs text-[var(--tw-dim)]">{k}</dt>
            <dd className="mt-0.5 truncate tw-mono text-sm tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {span.error && (
        <p className="flex items-center gap-2 rounded-2xl border px-3 py-2 tw-mono text-xs text-[var(--tw-error)]" style={{ borderColor: "color-mix(in oklab, var(--tw-error) 30%, transparent)" }}>
          <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
          {span.error}
        </p>
      )}
      {(["Input", "Output"] as const).map((h) => (
        <section key={h}>
          <h4 className="tw-mono text-xs uppercase tracking-widest text-[var(--tw-dim)]">{h}</h4>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-[var(--tw-border)] p-3 tw-mono text-xs leading-5">
            {h === "Input" ? span.input : span.output}
          </pre>
        </section>
      ))}
      <section>
        <h4 className="tw-mono text-xs uppercase tracking-widest text-[var(--tw-dim)]">Attributes</h4>
        <dl className="mt-2 divide-y divide-[var(--tw-border)] rounded-2xl border border-[var(--tw-border)]">
          {span.attrs.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 px-3 py-2 tw-mono text-xs">
              <dt className="truncate text-[var(--tw-dim)]">{k}</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

// ---------- waterfall row ----------

interface RowProps {
  span: Span;
  depth: number;
  parent: boolean;
  open: boolean;
  p: number; // playhead, ms of trace
  selected: boolean;
  hiddenKind: boolean;
  entering: boolean;
  index: number;
  onSelect: () => void;
  onToggle: () => void;
}

function Row({ span, depth, parent, open, p, selected, hiddenKind, entering, index, onSelect, onToggle }: RowProps) {
  const Icon = KIND_ICON[span.kind];
  const fill = Math.min(1, Math.max(0, (p - span.start) / span.dur));
  const reached = p >= span.start;
  const end = (span.start + span.dur) / TOTAL;
  const isRoot = depth === 0;
  const err = !!span.error;
  const label = !isRoot && (
    <span
      className={clsx("absolute top-1/2 -translate-y-1/2 whitespace-nowrap tw-mono text-xs tabular-nums", err ? "text-[var(--tw-error)]" : "text-[var(--tw-dim)]")}
      style={end > LABEL_FLIP ? { right: `calc(${100 - pct(span.start)}% + 8px)` } : { left: `calc(${pct(span.start + span.dur)}% + 8px)` }}
    >
      {fmt(span.dur)}
    </span>
  );
  return (
    <div role="none" className={entering ? "tw-row-in" : undefined}>
      <button
        type="button"
        role="treeitem"
        aria-level={depth + 1}
        aria-expanded={parent ? open : undefined}
        aria-selected={selected}
        aria-label={`${span.name}, ${KIND_LABEL[span.kind]}, ${fmt(span.dur)}${err ? ", error" : ""}`}
        data-tw-row={index}
        onClick={onSelect}
        className={clsx(
          "relative flex h-10 w-full items-center rounded-full text-left transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--tw-ink)]",
          selected ? "bg-[var(--tw-muted)]" : "hover:bg-[var(--tw-hover)]",
        )}
      >
        <span className="flex h-full w-full transition-opacity duration-200" style={{ opacity: hiddenKind ? 0.2 : 1 }}>
          <span data-tw-content className="flex h-full w-full items-center" style={{ opacity: reached ? 1 : DIM }}>
            <span className="flex w-[240px] min-w-0 shrink-0 items-center gap-1.5 pr-3" style={{ paddingLeft: 8 + depth * 14 }}>
              <span
                aria-hidden="true"
                onClick={
                  parent
                    ? (e) => {
                        e.stopPropagation();
                        onToggle();
                      }
                    : undefined
                }
                className={clsx("grid size-5 shrink-0 place-items-center rounded-full text-[var(--tw-dim)]", parent && "hover:bg-[var(--tw-muted)] hover:text-[var(--tw-ink)]")}
              >
                {parent && <ChevronRight className={clsx("size-3.5 transition-transform duration-200", open && "rotate-90")} strokeWidth={2} />}
              </span>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--tw-muted)] text-[var(--tw-dim)]">
                <Icon className="size-3.5" strokeWidth={1.75} />
              </span>
              <span className={clsx("truncate tw-mono text-xs", err && "text-[var(--tw-error)]")}>{span.name}</span>
              {err && <TriangleAlert className="size-3.5 shrink-0 text-[var(--tw-error)]" strokeWidth={2} />}
              {isRoot && <span className="ml-auto shrink-0 whitespace-nowrap pl-2 tw-mono text-xs tabular-nums text-[var(--tw-dim)]">{fmt(span.dur)}</span>}
            </span>
            <span className="relative mx-3 h-full flex-1">
              <span className="absolute top-1/2 h-3 -translate-y-1/2" style={{ left: `${pct(span.start)}%`, width: `${pct(span.dur)}%` }}>
                <span className={clsx("absolute inset-0 overflow-hidden rounded-full bg-[var(--tw-muted)]", selected && "ring-2 ring-white/20")}>
                  <span
                    data-tw-fill
                    className={clsx("tw-fill absolute inset-0 rounded-full", `tw-k-${span.kind}`, err && "tw-fill-error")}
                    style={{ transform: `scaleX(${fill})` }}
                  />
                </span>
              </span>
              {label}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

// ---------- card ----------

interface Playback {
  rate: number; // ms of trace per ms of wall time
  t0: number | null; // rAF timestamp of the first frame
  base: number; // playhead at t0
}

export default function TraceWaterfall() {
  const [autoplay] = useState(() => autoplayEnabled() && !reducedMotion());
  const [p, setP] = useState(() => (autoplay ? 0 : TOTAL));
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>("outline");
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [hiddenKinds, setHiddenKinds] = useState<Set<Kind>>(() => new Set());
  const [entering, setEntering] = useState<Set<string>>(() => new Set());

  const play = useRef<Playback | null>(null);
  const raf = useRef(0);
  const pRef = useRef(p);
  pRef.current = p;

  const tick = useCallback((ts: number) => {
    const pb = play.current;
    if (!pb) return;
    if (pb.t0 === null) pb.t0 = ts;
    const next = Math.min(TOTAL, pb.base + Math.max(0, ts - pb.t0) * pb.rate);
    if (next >= TOTAL - 0.5) {
      // done (the half-ms slack absorbs float error so the end lands on the same frame as the reference)
      play.current = null;
      flushSync(() => {
        setP(TOTAL);
        setPlaying(false);
        setPaused(false);
      });
      return;
    }
    flushSync(() => setP(next));
    raf.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(
    (sweepMs: number) => {
      cancelAnimationFrame(raf.current);
      // Anchored at the press, not at the first frame: the reference's first visible frame already shows one frame of
      // progress (measured: playhead +1.2 px at 33 ms, hidden again at 6017 ms).
      play.current = { rate: TOTAL / sweepMs, t0: performance.now(), base: 0 };
      setP(0);
      setPlaying(true);
      setPaused(false);
      raf.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const togglePause = () => {
    if (!playing) return;
    if (paused) {
      play.current = { rate: TOTAL / REPLAY_MS, t0: null, base: pRef.current };
      setPaused(false);
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
      play.current = null;
      setPaused(true);
    }
  };

  useEffect(() => {
    if (autoplay) start(INTRO_MS);
    return () => cancelAnimationFrame(raf.current);
  }, [autoplay, start]);

  const visible = useMemo(
    () =>
      ROWS.filter(({ span }) => {
        let up = span.parent;
        while (up) {
          if (collapsed.has(up)) return false;
          up = BY_ID.get(up)!.parent;
        }
        return true;
      }),
    [collapsed],
  );

  const toggleCollapse = (id: string) => {
    const next = new Set(collapsed);
    if (next.has(id)) {
      next.delete(id);
      setEntering(new Set(SPANS.filter((s) => s.parent === id).map((s) => s.id)));
    } else {
      next.add(id);
      setEntering(new Set());
    }
    setCollapsed(next);
  };

  const toggleKind = (k: Kind) => {
    const next = new Set(hiddenKinds);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setHiddenKinds(next);
  };

  const sel = selected ? BY_ID.get(selected)! : null;
  const showHead = playing && (p > 0 || paused);
  const headLeft = `${pct(p)}%`;

  return (
    <section
      aria-labelledby="tw-title"
      className="tw-root absolute inset-0 overflow-hidden rounded-3xl border border-[var(--tw-border)]"
      style={{ "--tw-odo-ms": `${ODO.ms}ms`, "--tw-odo-ease": ODO.ease } as CSSProperties}
    >
      {/* header */}
      <header className="flex h-[110px] items-end justify-between gap-5 px-6 pt-6">
        <div className="min-w-0">
          <div className="flex h-[18px] items-center gap-2 text-xs text-[var(--tw-dim)]">
            <span className="tw-mono">{RUN.id}</span>
            <span aria-hidden="true">·</span>
            <span>{RUN.when}</span>
          </div>
          <h2 id="tw-title" className="mt-2 truncate text-xl leading-7 font-medium">
            {RUN.title}
          </h2>
          <p
            className="mt-2 inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium text-[var(--tw-warn)]"
            style={{ borderColor: "color-mix(in oklab, var(--tw-warn) 28%, transparent)", background: "color-mix(in oklab, var(--tw-warn) 10%, transparent)" }}
          >
            <CircleAlert className="size-3.5" strokeWidth={2} />
            {RUN.status}
          </p>
        </div>
        <dl className={clsx("grid grid-cols-4 gap-x-8", autoplay && "tw-odo-roll")}>
          {RUN.stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs leading-4 text-[var(--tw-dim)]">{s.label}</dt>
              <dd className="mt-1 h-7 leading-7">
                <Odometer value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* toolbar */}
      <div className="mt-5 flex items-center justify-between gap-3 border-b border-[var(--tw-border)] px-6 py-3">
        <fieldset className="min-w-0">
          <legend className="sr-only">Show span kinds</legend>
          <div className="flex gap-2">
            {KINDS.map((k) => {
              const on = !hiddenKinds.has(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleKind(k.id)}
                  className={clsx(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--tw-border)] px-3 text-xs font-medium transition-opacity hover:bg-[var(--tw-muted)]",
                    `tw-k-${k.id}`,
                    !on && "opacity-50",
                  )}
                >
                  <span className={clsx("size-2 rounded-full transition-transform duration-200", !on && "scale-50")} style={{ background: "var(--k)" }} />
                  {k.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex shrink-0 items-center gap-2">
          <span className="min-w-16 text-right tw-mono text-xs tabular-nums text-[var(--tw-dim)]" data-tw-readout>
            <span className="text-[var(--tw-ink)]">{fmt(p)}</span> / {fmt(TOTAL)}
          </span>
          {playing && (
            <button
              type="button"
              aria-label={paused ? "Resume" : "Pause"}
              onClick={togglePause}
              data-tw-pause
              className="grid size-9 place-items-center rounded-full border border-[var(--tw-border)] transition-colors hover:bg-[var(--tw-muted)]"
            >
              {paused ? <Play className="size-4" strokeWidth={1.75} /> : <Pause className="size-4" strokeWidth={1.75} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => start(REPLAY_MS)}
            data-tw-replay
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--tw-border)] bg-[var(--tw-hover)] px-4 text-sm font-medium transition-colors hover:bg-[var(--tw-muted)]"
          >
            <RotateCcw className="size-4" strokeWidth={1.75} />
            Replay
          </button>
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-[minmax(0,1fr)_352px]">
        <div className="px-3 py-3">
          <figure aria-label={`Trace: ${RUN.title}`} className="m-0 w-full">
            <div className="relative flex h-8 items-center tw-mono text-xs text-[var(--tw-dim)]">
              <span className="w-[240px] truncate px-3">Span</span>
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[240px] right-0">
                <div className="relative mx-3 h-full">
                  {TICKS.map((t) => (
                    <span key={t} className={clsx("absolute top-1/2 -translate-y-1/2 whitespace-nowrap tabular-nums", t ? "-translate-x-1/2" : "")} style={{ left: `${pct(t)}%` }}>
                      {t ? `${t / 1000}s` : "0ms"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[240px] right-0">
                <div className="relative mx-3 h-full">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute inset-y-0 w-px bg-[var(--tw-grid)]" style={{ left: `${pct(t)}%` }} />
                  ))}
                </div>
              </div>
              <div role="tree" aria-label={`Trace: ${RUN.title}`} className="relative space-y-0.5">
                {visible.map(({ span, depth, parent }) => (
                  <Row
                    key={span.id}
                    span={span}
                    depth={depth}
                    parent={parent}
                    open={!collapsed.has(span.id)}
                    p={p}
                    selected={selected === span.id}
                    hiddenKind={hiddenKinds.has(span.kind)}
                    entering={entering.has(span.id)}
                    index={SPANS.indexOf(span)}
                    onSelect={() => setSelected(span.id)}
                    onToggle={() => toggleCollapse(span.id)}
                  />
                ))}
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[240px] right-0 z-10">
                <div className="relative mx-3 h-full">
                  <span data-tw-playhead className="absolute inset-y-0 w-px bg-[var(--tw-ink)]" style={{ left: headLeft, opacity: showHead ? 1 : 0 }}>
                    <span className="absolute -left-1 -top-1 size-2 rounded-full bg-[var(--tw-ink)]" />
                  </span>
                </div>
              </div>
            </div>
          </figure>
        </div>
        <aside className="border-l border-[var(--tw-border)]">
          <div aria-live="polite">
            {sel ? (
              <Detail span={sel} onClear={() => setSelected(null)} />
            ) : (
              <p className="tw-panel-in p-6 text-sm text-[var(--tw-dim)]">Select a span to see its timing, inputs and outputs.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
