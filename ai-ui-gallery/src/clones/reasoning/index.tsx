import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Check, ChevronDown, CircleAlert, Copy, Sparkle, Square } from "lucide-react";
import { INTERRUPTED_STEPS, MODEL, STEPS, paragraph } from "./data";
import "./reasoning.css";

/*
 * Reasoning block, motion-faithful to Arc UI "Reasoning block" (Pro).
 * Live run: a shimmering "Thinking" label with a seconds counter and a Stop button. At 0.9 s a two-line window
 * springs open and the newest reasoning streams into it chunk by chunk; when a chunk wraps onto a third line the
 * window scrolls up one line. Each step's paragraph replaces the last with a cross-fade. At 4.23 s thinking ends:
 * the window folds away, the label cross-fades to "Thought for 4s", and 1.1 s later the card opens into the full
 * chain of thought as headed steps on a timeline. It folds again at 9.95 s and the run restarts at 10.87 s.
 * All heights and the line scroll use one critically damped spring (visual duration 0.2 s, no bounce); fades and
 * the label shimmer are CSS animations, so they run the same on a real or a frame-stepped clock.
 */

// Timeline of a live run in ms, read off the reference's virtual-clock track (60 Hz rAF samples) and its 25 fps
// frames. Each value sits inside the window where the reference's change first shows on both, so the clone's
// changes land on the same rAF tick and the same captured frame. F() moves a tick time 2 ms early for that.
const F = (ms: number) => ms - 2;
const STREAM_AT = F(900);
const CHUNK_AT = [
  [900, 950, 1000, 1033, 1067, 1100, 1150].map(F),
  [1955, ...[1983, 2033, 2083, 2117, 2167, 2200, 2250].map(F)],
  [3037, ...[3067, 3100, 3150, 3200, 3233].map(F)],
  [4037, ...[4083, 4117, 4167, 4200].map(F)],
];
const TICK_AT = [1037, 2118, 3197];
const DONE_AT = F(4233);
const OPEN_AT = F(5350);
const CLOSE_AT = F(9950);
const LOOP_AT = F(10867);
const DONE_SECONDS = TICK_AT.length + 1;
const EVENTS = [...new Set([STREAM_AT, ...CHUNK_AT.flat(), ...TICK_AT, DONE_AT, OPEN_AT, CLOSE_AT])].sort((a, b) => a - b);

const LINE = 20;
const WINDOW = LINE * 2;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Critically damped spring from `from` to `to`. The default is stiffness 685, damping 52.4, mass 1 (motion's
 * { visualDuration: 0.2, bounce: 0 }). It starts on the next animation frame, like the reference's.
 */
const springW = (visualDuration: number) => (2 * Math.PI) / (visualDuration * 1.2);
const SPRING_W = springW(0.2);
const THUMB_W = springW(0.3);
function spring(from: number, to: number, apply: (v: number) => void, done?: () => void, w = SPRING_W, rest = 0.1) {
  if (from === to || reducedMotion()) {
    apply(to);
    done?.();
    return () => {};
  }
  let start: number | null = null;
  let raf = requestAnimationFrame(function tick(now) {
    if (start === null) start = now;
    const s = (now - start) / 1000;
    const v = to + (from - to) * (1 + w * s) * Math.exp(-w * s);
    if (Math.abs(to - v) < rest) {
      apply(to);
      done?.();
      return;
    }
    apply(v);
    raf = requestAnimationFrame(tick);
  });
  return () => cancelAnimationFrame(raf);
}

/** A height clip that springs open or shut and fades (in 150 ms, out 100 ms); unmounts its content once shut. */
function Clip({ name, open, appear = true, children }: { name: string; open: boolean; appear?: boolean; children: ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const [animated, setAnimated] = useState(appear);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  if (open && !mounted) {
    setMounted(true);
    setAnimated(true);
  }

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el || !inner.current) return;
    if (first.current && !appear) {
      first.current = false;
      el.style.height = "auto";
      return;
    }
    first.current = false;
    const from = el.getBoundingClientRect().height;
    const to = open ? inner.current.offsetHeight : 0;
    el.style.height = `${from}px`;
    return spring(
      from,
      to,
      (v) => (el.style.height = `${v}px`),
      () => (open ? (el.style.height = "auto") : setMounted(false)),
    );
  }, [open, mounted, appear]);

  if (!mounted) return null;
  return (
    <div ref={outer} data-rb-clip={name} className={open ? (animated ? "rb-clip-in" : undefined) : "rb-clip-out"} style={{ overflow: "hidden", height: 0 }}>
      <div ref={inner} style={{ display: "flow-root" }}>
        {children}
      </div>
    </div>
  );
}

/** Keeps the previous child for its exit (100 ms) while the next one enters; both share the same box. */
function Swap({
  id,
  children,
  enter,
  exit = "rb-exit",
  box = { display: "inline-flex", gridArea: "1 / 1", minWidth: 0 },
}: {
  id: string;
  children: ReactNode;
  enter: string;
  exit?: string;
  box?: CSSProperties;
}) {
  const [state, setState] = useState<{ id: string; entered: boolean; leaving: { id: string; node: ReactNode } | null }>({
    id,
    entered: false,
    leaving: null,
  });
  const lastNode = useRef<ReactNode>(children);
  if (state.id !== id) setState({ id, entered: true, leaving: { id: state.id, node: lastNode.current } });
  const current = state.id === id ? children : lastNode.current;
  lastNode.current = current;

  useEffect(() => {
    if (!state.leaving) return;
    const timer = setTimeout(() => setState((s) => ({ ...s, leaving: null })), 100);
    return () => clearTimeout(timer);
  }, [state.leaving]);

  return (
    <>
      <span key={state.id} className={state.entered ? enter : undefined} style={box}>
        {current}
      </span>
      {state.leaving && (
        <span key={state.leaving.id} className={exit} aria-hidden style={box}>
          {state.leaving.node}
        </span>
      )}
    </>
  );
}

/** One step's paragraph in the live window. New lines push the text up; the overflow scrolls back with the spring. */
function StreamLayer({ step, shown, className }: { step: number; shown: number; className?: string }) {
  const slot = useRef<HTMLDivElement>(null);
  const tail = useRef<HTMLDivElement>(null);
  const lastHeight = useRef(0);
  const offset = useRef(0);
  const stop = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const el = tail.current!;
    const h = el.offsetHeight;
    const grew = lastHeight.current ? h - lastHeight.current : 0;
    lastHeight.current = h;
    slot.current!.toggleAttribute("data-overflow", h > WINDOW);
    if (grew <= 0) return;
    stop.current();
    const from = offset.current + grew;
    offset.current = from;
    el.style.transform = `translateY(${from}px)`;
    stop.current = spring(from, 0, (v) => {
      offset.current = v;
      el.style.transform = v ? `translateY(${v}px)` : "";
    });
  }, [shown]);
  useEffect(() => () => stop.current(), []);

  return (
    <div data-rb-layer className={className} style={{ position: "absolute", inset: 0 }}>
      <div
        ref={slot}
        className="rb-slot"
        style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}
      >
        <div ref={tail} data-rb-tail style={{ flex: "0 0 auto", minHeight: "100%", overflowWrap: "anywhere" }}>
          {STEPS[step].chunks.slice(0, shown).map((chunk, i) => (
            <span key={i} className={i ? "rb-chunk" : undefined}>
              {chunk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveWindow({ step, shown }: { step: number; shown: number }) {
  return (
    <div data-rb-live style={{ position: "relative", height: WINDOW, margin: "4px 16px 0 46px", fontSize: 13, lineHeight: `${LINE}px`, color: "var(--rb-muted)" }}>
      <Swap id={String(step)} enter="rb-enter" box={{ position: "absolute", inset: 0 }}>
        <StreamLayer step={step} shown={shown} />
      </Swap>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy reasoning"}
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
      }}
      className="rb-btn rb-btn-ghost grid place-items-center rounded-md"
      style={{ width: 24, height: 32, margin: "-4px -8px -4px 0", color: "var(--rb-muted)" }}
    >
      {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={1.75} />}
    </button>
  );
}

type Foot = { icon: ReactNode; text: string; tone?: string };

function Steps({ steps, foot }: { steps: { title: string; text: string }[]; foot: Foot }) {
  return (
    <div data-rb-panel style={{ padding: "4px 16px 16px" }}>
      <ol style={{ display: "grid", gap: 16, margin: 0, padding: 0, listStyle: "none" }}>
        {steps.map((s) => (
          <li key={s.title} data-rb-step className="rb-step" style={{ position: "relative", paddingLeft: 30, minWidth: 0 }}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                zIndex: 1,
                top: 7,
                left: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--rb-surface)",
                boxShadow: "inset 0 0 0 1.5px var(--rb-muted)",
              }}
            />
            <h4 style={{ margin: 0, fontSize: 13, lineHeight: "14.3px", fontWeight: 500, color: "var(--rb-ink)" }}>{s.title}</h4>
            <p style={{ margin: "2px 0 0", fontSize: 13, lineHeight: "22px", color: "var(--rb-secondary)", overflowWrap: "anywhere" }}>{s.text}</p>
          </li>
        ))}
      </ol>
      <div
        data-rb-foot
        style={{
          display: "grid",
          gridTemplateColumns: "20px minmax(0, 1fr) auto",
          alignItems: "center",
          columnGap: 10,
          minHeight: 28,
          marginTop: 12,
          fontSize: 12,
          lineHeight: "20px",
          color: "var(--rb-secondary)",
        }}
      >
        <span className="grid place-items-center" style={{ color: foot.tone ?? "var(--rb-muted)" }}>
          {foot.icon}
        </span>
        <span style={{ minWidth: 0 }}>{foot.text}</span>
        <CopyButton text={steps.map((s) => `${s.title}\n${s.text}`).join("\n\n")} />
      </div>
    </div>
  );
}

interface CardProps {
  labelId: string;
  label: ReactNode;
  actions?: ReactNode;
  chevron: boolean;
  open: boolean;
  onToggle: () => void;
  live?: { open: boolean; step: number; shown: number };
  steps: { title: string; text: string }[];
  foot: Foot;
  appearPanel?: boolean;
  status: string;
}

/** The card: header (mark, label, actions, chevron), the live window inside the header, the steps panel below. */
function ReasoningCard({ labelId, label, actions, chevron, open, onToggle, live, steps, foot, appearPanel = true, status }: CardProps) {
  return (
    <div
      data-rb-card
      data-open={open || undefined}
      className="rb-card"
      style={{ position: "relative", width: "100%", border: "1px solid var(--rb-border)", borderRadius: 14, background: "var(--rb-surface)", fontSize: 13, lineHeight: "20px" }}
    >
      <div data-rb-top style={{ position: "relative", paddingBottom: 12, borderRadius: open ? "13px 13px 8px 8px" : 13 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Hide reasoning" : "Show reasoning"}
          onClick={onToggle}
          className="rb-toggle"
          style={{ position: "absolute", inset: 0, zIndex: 0, border: 0, padding: 0, margin: 0, borderRadius: "inherit", background: "transparent", cursor: "pointer" }}
        />
        <div
          className="rb-head"
          style={{
            position: "relative",
            zIndex: 1,
            pointerEvents: "none",
            display: "grid",
            gridTemplateColumns: "20px minmax(0, 1fr) auto 16px",
            alignItems: "center",
            columnGap: 10,
            height: 32,
            padding: "12px 16px 0",
          }}
        >
          <span data-rb-mark className="grid place-items-center" style={{ width: 20, height: 20 }} aria-hidden>
            <Sparkle size={18} strokeWidth={1.5} style={{ color: "var(--rb-accent)", fill: "var(--rb-accent)" }} />
          </span>
          <span data-rb-label style={{ position: "relative", display: "grid", alignItems: "center", height: 20, minWidth: 0 }}>
            <Swap id={labelId} enter="rb-label-enter">
              {label}
            </Swap>
          </span>
          <span data-rb-actions style={{ display: "inline-flex", height: 20, alignItems: "center", justifyContent: "flex-end", pointerEvents: "auto" }}>
            {actions}
          </span>
          {chevron ? (
            <ChevronDown data-rb-chevron className="rb-chevron" size={16} strokeWidth={2} style={{ color: "var(--rb-muted)" }} aria-hidden />
          ) : (
            <span />
          )}
        </div>
        {live && (
          <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
            <Clip name="live" open={live.open}>
              <LiveWindow step={live.step} shown={live.shown} />
            </Clip>
          </div>
        )}
      </div>
      <Clip name="panel" open={open} appear={appearPanel}>
        <Steps steps={steps} foot={foot} />
      </Clip>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {status}
      </span>
    </div>
  );
}

function Counter({ seconds }: { seconds: number }) {
  return (
    <span data-rb-counter style={{ display: "inline-grid", minWidth: "3.4ch", color: "var(--rb-muted)", fontVariantNumeric: "tabular-nums" }}>
      <Swap id={String(seconds)} enter="rb-count-enter" exit="rb-count-exit">
        {seconds}s
      </Swap>
    </span>
  );
}

const ghostButton = {
  height: 28,
  gap: 6,
  padding: "0 10px",
  borderRadius: 9,
  fontSize: 12,
  lineHeight: "16.8px",
  fontWeight: 500,
} as const;

/** The live run: everything on screen is a function of the time since the run (or its last loop) started. */
function LiveRun() {
  const [t, setT] = useState(0);
  const [loop, setLoop] = useState(0);
  const [stopped, setStopped] = useState<{ seconds: number; step: number; shown: number } | null>(null);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [streamHidden, setStreamHidden] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const halt = () => timers.current.forEach(clearTimeout);

  useEffect(() => {
    // flushSync commits each step inside its timer, so it lands on the next frame rather than after it.
    timers.current = EVENTS.map((at) => setTimeout(() => flushSync(() => setT(at)), at));
    timers.current.push(
      setTimeout(() => {
        flushSync(() => {
          setT(0);
          setStreamHidden(false);
          setLoop((l) => l + 1);
        });
      }, LOOP_AT),
    );
    return halt;
  }, [loop]);

  const seconds = TICK_AT.filter((at) => t >= at).length;
  let step = -1;
  let shown = 0;
  CHUNK_AT.forEach((times, i) => {
    if (t >= times[0]) {
      step = i;
      shown = times.filter((at) => t >= at).length;
    }
  });
  const phase = stopped ? "stopped" : t >= DONE_AT ? "done" : "thinking";
  const open = manualOpen ?? (phase === "done" && t >= OPEN_AT && t < CLOSE_AT);

  const toggle = () => {
    if (phase === "thinking") return setStreamHidden((h) => !h);
    halt();
    setManualOpen(!open);
  };

  const stop = () => {
    halt();
    setStopped({ seconds, step, shown });
    setManualOpen(false);
  };

  if (phase === "stopped" && stopped) {
    const steps = STEPS.slice(0, stopped.step + 1).map((s, i) => ({
      title: s.title,
      text: i < stopped.step ? paragraph(s) : s.chunks.slice(0, stopped.shown).join(""),
    }));
    return (
      <ReasoningCard
        labelId="stopped"
        label={<span style={{ color: "var(--rb-secondary)", whiteSpace: "nowrap" }}>Stopped after {stopped.seconds}s</span>}
        chevron={steps.length > 0}
        open={open && steps.length > 0}
        onToggle={toggle}
        live={{ open: false, step: Math.max(stopped.step, 0), shown: stopped.shown }}
        steps={steps}
        foot={{ icon: <Square size={8} fill="currentColor" strokeWidth={0} />, text: "Stopped before finishing" }}
        status="Stopped thinking."
      />
    );
  }

  return (
    <ReasoningCard
      labelId={phase}
      label={
        phase === "thinking" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <span className="rb-shimmer">
              Thinking
            </span>
            <Counter seconds={seconds} />
          </span>
        ) : (
          <span style={{ color: "var(--rb-secondary)", whiteSpace: "nowrap" }}>Thought for {DONE_SECONDS}s</span>
        )
      }
      actions={
        phase === "thinking" && (
          <button
            type="button"
            onClick={stop}
            data-rb-stop
            className="rb-btn rb-btn-ghost inline-flex items-center"
            style={{ ...ghostButton, color: "var(--rb-secondary)" }}
          >
            <Square size={10} fill="currentColor" strokeWidth={0} aria-hidden />
            Stop
          </button>
        )
      }
      chevron={phase !== "thinking" || t >= STREAM_AT}
      open={phase === "done" && open}
      onToggle={toggle}
      live={{ open: phase === "thinking" && step >= 0 && !streamHidden, step: Math.max(step, 0), shown }}
      steps={STEPS.map((s) => ({ title: s.title, text: paragraph(s) }))}
      foot={{ icon: <Check size={14} strokeWidth={2.25} />, text: "Done", tone: "var(--rb-success)" }}
      status={phase === "thinking" ? `${MODEL} is thinking. Simulated; nothing is sent to a model.` : `Thought for ${DONE_SECONDS} seconds.`}
    />
  );
}

function FinishedCard() {
  const [open, setOpen] = useState(true);
  return (
    <ReasoningCard
      labelId="finished"
      label={<span style={{ color: "var(--rb-secondary)", whiteSpace: "nowrap" }}>Thought for 7s</span>}
      chevron
      open={open}
      onToggle={() => setOpen((o) => !o)}
      steps={STEPS.map((s) => ({ title: s.title, text: paragraph(s) }))}
      foot={{ icon: <Check size={14} strokeWidth={2.25} />, text: "Done", tone: "var(--rb-success)" }}
      appearPanel={false}
      status="Thought for 7 seconds."
    />
  );
}

function InterruptedCard({ onRetry }: { onRetry: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <ReasoningCard
      labelId="interrupted"
      label={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          <CircleAlert size={16} strokeWidth={2} style={{ color: "var(--rb-danger)" }} aria-hidden />
          Thinking interrupted
        </span>
      }
      actions={
        <button
          type="button"
          onClick={onRetry}
          className="rb-btn rb-btn-outline inline-flex items-center"
          style={{ ...ghostButton, borderRadius: 12, border: "1px solid var(--rb-border)", background: "var(--rb-surface)", color: "var(--rb-ink)" }}
        >
          Retry
        </button>
      }
      chevron
      open={open}
      onToggle={() => setOpen((o) => !o)}
      steps={INTERRUPTED_STEPS}
      foot={{
        icon: <CircleAlert size={14} strokeWidth={2} />,
        text: `The connection dropped before ${MODEL} finished. Retry to think again.`,
        tone: "var(--rb-danger)",
      }}
      status="Thinking interrupted."
    />
  );
}

const TABS = [
  ["live", "Live"],
  ["finished", "Finished"],
  ["interrupted", "Interrupted"],
] as const;
type Tab = (typeof TABS)[number][0];

/** The demo's state switch. The pill slides to the chosen tab on a softer spring (visual duration 0.3 s). */
function StateTabs({ tab, onSelect }: { tab: Tab; onSelect: (t: Tab) => void }) {
  const buttons = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  const thumb = useRef<HTMLSpanElement>(null);
  const box = useRef<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const el = thumb.current;
    const target = buttons.current[tab];
    if (!el || !target) return;
    const to = { x: target.offsetLeft, w: target.offsetWidth };
    const from = box.current ?? to;
    const place = (p: number) => {
      const x = from.x + (to.x - from.x) * p;
      const w = from.w + (to.w - from.w) * p;
      box.current = { x, w };
      el.style.transform = `translateX(${x}px)`;
      el.style.width = `${w}px`;
    };
    place(0);
    return spring(0, 1, place, undefined, THUMB_W, 0.002);
  }, [tab]);

  return (
    <div
      role="tablist"
      aria-label="Reasoning state"
      style={{ position: "relative", display: "inline-flex", gap: 2, padding: 3, border: "1px solid var(--rb-border)", borderRadius: 14, background: "var(--rb-surface-muted)" }}
    >
      <span
        ref={thumb}
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          left: 0,
          height: 32,
          borderRadius: 10,
          background: "var(--rb-surface)",
          boxShadow: "0 1px 2px rgb(18 20 28 / 0.08), 0 0 0 1px rgb(18 20 28 / 0.04)",
        }}
      />
      {TABS.map(([id, name]) => {
        const active = id === tab;
        return (
          <button
            key={id}
            ref={(el) => {
              buttons.current[id] = el;
            }}
            type="button"
            role="tab"
            data-rb-tab={id}
            aria-selected={active}
            onClick={() => onSelect(id)}
            className="rb-btn"
            style={{
              position: "relative",
              height: 32,
              padding: "0 12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: active ? "var(--rb-ink)" : "var(--rb-muted)",
              background: "transparent",
            }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

export default function ReasoningBlock() {
  const [tab, setTab] = useState<Tab>("live");
  const [run, setRun] = useState(0);
  const select = (next: Tab) => {
    setTab(next);
    if (next === "live") setRun((r) => r + 1);
  };

  return (
    <div className="rb-demo" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 10 }}>
      <StateTabs tab={tab} onSelect={select} />
      <div style={{ width: 580 }}>
        {tab === "live" && <LiveRun key={run} />}
        {tab === "finished" && <FinishedCard />}
        {tab === "interrupted" && <InterruptedCard onRetry={() => select("live")} />}
      </div>
    </div>
  );
}
