import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check, CornerDownLeft, MessageSquareText, Orbit, Pencil, Play, Plus, RotateCcw, Square, X } from "lucide-react";
import clsx from "clsx";
import { AGENT, GOAL, PLAN, TICK, TOOLS, estimate, linesAt, seconds, type StepDef, type ToolId } from "./plan-data";
import "./agent-plan.css";

/* Timing read off the reference (see .reanimate/agent-plan/spec.md). */
const EXPO = [0.16, 1, 0.3, 1] as const;
const T = { duration: 0.3, ease: EXPO };
const AUTO_RUN_MS = 700; // the draft holds this long, then the plan starts by itself
const HANDOFF_MS = 25; // a finished step hands over to the next one just after its last tick

const C = {
  fg: "var(--ap-fg)",
  muted: "var(--ap-fg-muted)",
  border: "var(--ap-border)",
  surface: "var(--ap-muted)",
  card: "var(--ap-card)",
  accent: "var(--ap-accent)",
  danger: "var(--ap-danger)",
};

/* ------------------------------------------------------------------ run clock */

type ClockValue = { total: number; step: number };

function createClock() {
  let value: ClockValue = { total: 0, step: 0 };
  const subs = new Set<() => void>();
  return {
    get: () => value,
    set(next: ClockValue) {
      value = next;
      subs.forEach((fn) => fn());
    },
    subscribe(fn: () => void) {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
  };
}
type Clock = ReturnType<typeof createClock>;

/** Only the leaves that show time subscribe, so a tick never re-renders the step rows (and their layout). */
function useClock<T extends number>(clock: Clock, pick: (v: ClockValue) => T): T {
  return useSyncExternalStore(clock.subscribe, () => pick(clock.get()));
}

/* ------------------------------------------------------------------ plan state */

type Phase = "draft" | "running" | "paused" | "failed" | "done";
type StepStatus = "draft" | "pending" | "running" | "paused" | "done" | "failed";

interface PlanState {
  phase: Phase;
  steps: StepDef[];
  current: number;
  shown: number;
  /** Duration each finished step took. */
  took: Record<string, number>;
  /** Steps whose failure was retried away. */
  retried: string[];
  /** Tool calls of finished steps. */
  calls: number;
  /** Steps the person added while the plan ran (steering notes). */
  added: string[];
}

type Action =
  | { type: "run" }
  | { type: "lines"; shown: number }
  | { type: "complete" }
  | { type: "fail" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "retry" }
  | { type: "edit" }
  | { type: "add"; title: string }
  | { type: "steer"; title: string }
  | { type: "remove"; id: string };

const initialState: PlanState = {
  phase: "draft",
  steps: PLAN,
  current: 0,
  shown: 0,
  took: {},
  retried: [],
  calls: 0,
  added: [],
};

let uid = 0;
const newStep = (title: string, tool: ToolId = "write"): StepDef => ({
  id: `step-${++uid}`,
  title,
  tool,
  ms: 1600,
  lines: [`apply: ${title.toLowerCase()}`, "update the plan notes"],
});

function reducer(s: PlanState, a: Action): PlanState {
  const step = s.steps[s.current];
  switch (a.type) {
    case "run":
      return s.steps.length ? { ...initialState, steps: s.steps, phase: "running", shown: 1 } : s;
    case "lines":
      return { ...s, shown: a.shown };
    case "complete": {
      const took = { ...s.took, [step.id]: step.ms };
      const calls = s.calls + step.lines.length;
      if (s.current + 1 >= s.steps.length) return { ...s, phase: "done", took, calls, shown: 0 };
      return { ...s, current: s.current + 1, shown: 1, took, calls };
    }
    case "fail":
      return { ...s, phase: "failed" };
    case "pause":
      return s.phase === "running" ? { ...s, phase: "paused" } : s;
    case "resume":
      return s.phase === "paused" ? { ...s, phase: "running" } : s;
    case "retry":
      return { ...s, phase: "running", shown: 1, retried: [...s.retried, step.id] };
    case "edit":
      return { ...initialState, steps: s.steps.filter((x) => !s.added.includes(x.id)).concat(s.steps.filter((x) => s.added.includes(x.id))) };
    case "add":
      return { ...s, steps: [...s.steps, newStep(a.title)] };
    case "steer": {
      const note = newStep(a.title);
      const steps = [...s.steps];
      steps.splice(s.current + 1, 0, note);
      return { ...s, steps, added: [...s.added, note.id] };
    }
    case "remove":
      return { ...s, steps: s.steps.filter((x) => x.id !== a.id) };
  }
}

function usePlanRun() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [clock] = useState(createClock);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Auto-run after the draft has been on screen for AUTO_RUN_MS, unless the person starts editing.
  const autoRun = useRef<number | null>(null);
  useEffect(() => {
    autoRun.current = window.setTimeout(() => {
      autoRun.current = null;
      clock.set({ total: 0, step: 0 });
      dispatch({ type: "run" });
    }, AUTO_RUN_MS);
    return () => {
      if (autoRun.current) window.clearTimeout(autoRun.current);
    };
  }, [clock]);
  const cancelAutoRun = useCallback(() => {
    if (autoRun.current) window.clearTimeout(autoRun.current);
    autoRun.current = null;
  }, []);

  // The run clock: one tick every 100 ms while running.
  useEffect(() => {
    if (state.phase !== "running") return;
    let handoff: number | null = null;
    const id = window.setInterval(() => {
      const s = stateRef.current;
      if (handoff !== null || s.phase !== "running") return;
      const step = s.steps[s.current];
      const c = clock.get();
      const next = { total: c.total + TICK, step: Math.min(c.step + TICK, step.ms) };
      clock.set(next);
      if (next.step >= step.ms) {
        if (step.failure && !s.retried.includes(step.id)) {
          dispatch({ type: "fail" });
          return;
        }
        handoff = window.setTimeout(() => {
          handoff = null;
          clock.set({ total: clock.get().total, step: 0 });
          dispatch({ type: "complete" });
        }, HANDOFF_MS);
        return;
      }
      const shown = linesAt(step, next.step);
      if (shown !== s.shown) dispatch({ type: "lines", shown });
    }, TICK);
    return () => {
      window.clearInterval(id);
      if (handoff !== null) window.clearTimeout(handoff);
    };
  }, [state.phase, state.current, clock]);

  const act = useCallback(
    (a: Action) => {
      if (a.type === "run" || a.type === "edit") clock.set({ total: 0, step: 0 });
      if (a.type === "retry") clock.set({ total: clock.get().total, step: 0 });
      cancelAutoRun();
      dispatch(a);
    },
    [clock, cancelAutoRun],
  );

  return { state, clock, act, cancelAutoRun };
}

function statusOf(s: PlanState, i: number): StepStatus {
  if (s.phase === "draft") return "draft";
  if (s.phase === "done" || i < s.current) return "done";
  if (i > s.current) return "pending";
  if (s.phase === "failed") return "failed";
  return s.phase === "paused" ? "paused" : "running";
}

/* ------------------------------------------------------------------ pieces */

const TONES = {
  neutral: { color: C.muted, borderColor: C.border, background: "transparent" },
  accent: {
    color: "var(--ap-accent-soft)",
    borderColor: "color-mix(in srgb, var(--ap-accent) 28%, transparent)",
    background: "color-mix(in srgb, var(--ap-accent) 11%, transparent)",
  },
  danger: {
    color: "var(--ap-danger-soft)",
    borderColor: "color-mix(in srgb, var(--ap-danger) 30%, transparent)",
    background: "color-mix(in srgb, var(--ap-danger) 12%, transparent)",
  },
  success: {
    color: "var(--ap-success)",
    borderColor: "color-mix(in srgb, var(--ap-success) 28%, transparent)",
    background: "color-mix(in srgb, var(--ap-success) 10%, transparent)",
  },
} satisfies Record<string, CSSProperties>;

const PILL: Record<Phase, { label: string; tone: keyof typeof TONES }> = {
  draft: { label: "Draft", tone: "neutral" },
  running: { label: "Running", tone: "accent" },
  paused: { label: "Paused", tone: "neutral" },
  failed: { label: "Needs attention", tone: "danger" },
  done: { label: "Done", tone: "success" },
};

function StatusPill({ phase }: { phase: Phase }) {
  const { label, tone } = PILL[phase];
  return (
    <p
      data-part="status"
      className="ap-tone inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border px-2 text-xs font-medium"
      style={TONES[tone]}
    >
      <span className="relative flex size-1.5">
        {phase === "running" && <span className="ap-ping absolute inset-0 rounded-full bg-current opacity-60" />}
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      {label}
    </p>
  );
}

function SegmentFill({ clock, status, ms }: { clock: Clock; status: StepStatus; ms: number }) {
  const live = status === "running" || status === "paused";
  const elapsed = useClock(clock, (v) => (live ? v.step : 0));
  const scale = status === "done" || status === "failed" ? 1 : live ? Math.min(1, elapsed / ms) : 0;
  const background = status === "failed" ? C.danger : live ? C.accent : C.fg;
  return (
    <span
      className="ap-seg-fill block h-full rounded-full"
      style={{ transform: `scaleX(${scale})`, background }}
    />
  );
}

function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="absolute inset-0 size-5" aria-hidden>
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
      <g className={spinning ? "ap-spin" : undefined} style={{ transformOrigin: "10px 10px" }}>
        <circle
          cx="10"
          cy="10"
          r="8.25"
          fill="none"
          stroke={C.accent}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="13 52"
          transform="rotate(10 10 10)"
        />
      </g>
      <circle cx="10" cy="10" r="3" fill={C.accent} />
    </svg>
  );
}

const pop = { initial: { scale: 0.4, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: T };

function Marker({ status, index }: { status: StepStatus; index: number }) {
  if (status === "draft")
    return (
      <span className="grid size-5 shrink-0 place-items-center text-xs font-medium" style={{ color: C.muted }}>
        {index + 1}
      </span>
    );
  return (
    <span className="relative grid size-5 shrink-0 place-items-center">
      {status === "pending" && (
        <span
          className="ap-mono absolute inset-0 grid place-items-center rounded-full border text-xs"
          style={{ borderColor: C.border, color: C.muted }}
        >
          {index + 1}
        </span>
      )}
      {(status === "running" || status === "paused") && <Spinner spinning={status === "running"} />}
      {status === "done" && (
        <motion.span key="done" {...pop} className="absolute inset-0 grid place-items-center rounded-full" style={{ background: C.fg }}>
          <Check size={12} strokeWidth={3.25} color="var(--ap-card)" />
        </motion.span>
      )}
      {status === "failed" && (
        <motion.span key="failed" {...pop} className="absolute inset-0 grid place-items-center rounded-full" style={{ background: C.danger }}>
          <X size={12} strokeWidth={3.25} color="#fff" />
        </motion.span>
      )}
    </span>
  );
}

function ToolBadge({ tool }: { tool: ToolId }) {
  const { label, Icon, color } = TOOLS[tool];
  return (
    <span
      className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full border px-1.5 text-xs font-medium"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 24%, transparent)`,
        background: `color-mix(in srgb, ${color} 9%, transparent)`,
      }}
    >
      <Icon size={12} strokeWidth={2} />
      {label}
    </span>
  );
}

function StepTime({ clock, status, ms }: { clock: Clock; status: StepStatus; ms: number }) {
  return (
    <span className="ap-mono w-9 shrink-0 text-right text-xs" style={{ color: C.muted }}>
      {status === "running" || status === "paused" ? <LiveSeconds clock={clock} pick="step" /> : status === "done" || status === "failed" ? seconds(ms) : estimate(ms)}
    </span>
  );
}

function LiveSeconds({ clock, pick }: { clock: Clock; pick: keyof ClockValue }) {
  const ms = useClock(clock, (v) => v[pick]);
  return <>{seconds(ms)}</>;
}

function Output({ step, shown, status, onRetry }: { step: StepDef; shown: number; status: StepStatus; onRetry: () => void }) {
  const live = status === "running";
  const failed = status === "failed";
  const lines = step.lines.slice(0, Math.max(1, shown));
  return (
    <motion.div
      data-part="output"
      className="overflow-hidden"
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0, opacity: 0, transition: { height: T, opacity: { duration: 0 } } }}
      transition={T}
    >
      <ol className="ap-mono mt-1.5 space-y-0.5 text-xs" style={{ color: C.muted }}>
        {lines.map((line, i) => {
          const newest = live && i === lines.length - 1;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={T}
              className="flex h-4 min-w-0 items-center gap-2"
              style={newest ? { color: C.fg } : undefined}
            >
              <span style={{ color: "rgba(255,255,255,0.16)" }}>›</span>
              <span className="truncate">{line}</span>
              {newest && <span className="ap-pulse h-3 w-1.5 shrink-0 rounded-full" style={{ background: "color-mix(in srgb, var(--ap-fg) 60%, transparent)" }} />}
            </motion.li>
          );
        })}
        {failed && step.failure && (
          <motion.li
            key="failure"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={T}
            className="flex h-4 min-w-0 items-center gap-2"
            style={{ color: "var(--ap-danger-soft)" }}
          >
            <span>›</span>
            <span className="truncate">{step.failure}</span>
          </motion.li>
        )}
      </ol>
      {failed && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors hover:brightness-125"
            style={{ borderColor: C.border, background: C.surface, color: C.fg }}
          >
            <RotateCcw size={12} strokeWidth={2.25} />
            Retry
          </button>
        </div>
      )}
    </motion.div>
  );
}

interface RowProps {
  step: StepDef;
  index: number;
  status: StepStatus;
  shown: number;
  last: boolean;
  clock: Clock;
  added: boolean;
  onRemove: (id: string) => void;
  onRetry: () => void;
}

const StepRow = memo(function StepRow({ step, index, status, shown, last, clock, added, onRemove, onRetry }: RowProps) {
  const active = status === "running" || status === "paused" || status === "failed";
  const titleColor = status === "failed" ? "var(--ap-danger-soft)" : status === "pending" ? C.muted : C.fg;
  return (
    <motion.li
      layout
      transition={T}
      data-part="step"
      data-status={status}
      className="group/step relative flex list-none gap-3"
      style={{ background: C.card }}
    >
      <div className="flex flex-col items-center pt-px">
        <Marker status={status} index={index} />
        {!last && (
          <span className="relative my-1 w-px flex-1 overflow-hidden rounded-full" style={{ background: C.border }}>
            <motion.span
              className="absolute inset-0 origin-top"
              style={{ background: C.fg }}
              initial={false}
              animate={{ scaleY: status === "done" ? 1 : 0 }}
              transition={T}
            />
          </span>
        )}
      </div>
      <div className={clsx("min-w-0 flex-1", last ? "pb-0.5" : "pb-4")}>
        <div className="flex min-h-5 items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="ap-tone truncate text-sm" style={{ color: titleColor }}>
              {step.title}
              {added && (
                <span className="ml-2 text-xs" style={{ color: "var(--ap-accent-soft)" }}>
                  added
                </span>
              )}
            </p>
          </div>
          <ToolBadge tool={step.tool} />
          <StepTime clock={clock} status={status} ms={step.ms} />
          {status === "draft" && (
            <button
              type="button"
              aria-label={`Remove step: ${step.title}`}
              onClick={() => onRemove(step.id)}
              className="-mr-1 grid size-6 shrink-0 place-items-center rounded-full opacity-0 transition-opacity group-hover/step:opacity-100 focus-visible:opacity-100"
              style={{ color: C.muted }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <AnimatePresence initial={false}>
          {active && <Output key="output" step={step} shown={shown} status={status} onRetry={onRetry} />}
        </AnimatePresence>
      </div>
    </motion.li>
  );
});

function FooterText({ state, clock }: { state: PlanState; clock: Clock }) {
  const n = state.steps.length;
  if (state.phase === "draft") {
    const total = state.steps.reduce((sum, x) => sum + x.ms, 0);
    return (
      <span style={{ color: C.fg }}>
        {n} steps · {estimate(total)}
      </span>
    );
  }
  const calls = state.calls + (state.phase === "done" ? 0 : state.shown);
  const lead =
    state.phase === "failed"
      ? `Step ${state.current + 1} failed`
      : state.phase === "done"
        ? `All ${n} steps done`
        : state.phase === "paused"
          ? `Paused at step ${state.current + 1}`
          : `Step ${state.current + 1} of ${n}`;
  return (
    <>
      <span style={{ color: C.fg }}>{lead}</span>
      <span className="ap-mono">
        {" · "}
        <LiveSeconds clock={clock} pick="total" />
        {` · ${calls} ${calls === 1 ? "call" : "calls"}`}
      </span>
    </>
  );
}

function FooterAction({ phase, act }: { phase: Phase; act: (a: Action) => void }) {
  let node: ReactNode;
  if (phase === "draft" || phase === "paused")
    node = (
      <motion.button
        key={phase}
        type="button"
        {...pop}
        initial={{ scale: 0.5, opacity: 0 }}
        onClick={() => act({ type: phase === "draft" ? "run" : "resume" })}
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-white"
        style={{ background: "var(--ap-primary)" }}
      >
        <Play size={12} strokeWidth={2.25} />
        {phase === "draft" ? "Run plan" : "Resume"}
      </motion.button>
    );
  else if (phase === "running")
    node = (
      <motion.button
        key="stop"
        type="button"
        {...pop}
        initial={{ scale: 0.5, opacity: 0 }}
        onClick={() => act({ type: "pause" })}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium"
        style={{ borderColor: C.border, background: C.surface, color: C.fg }}
      >
        <Square size={11} strokeWidth={2.25} />
        Stop
      </motion.button>
    );
  else
    node = (
      <motion.button
        key="edit"
        type="button"
        {...pop}
        initial={{ scale: 0.5, opacity: 0 }}
        aria-label="Edit the plan"
        onClick={() => act({ type: "edit" })}
        className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/5"
        style={{ color: C.muted }}
      >
        <Pencil size={14} />
      </motion.button>
    );
  return (
    <div className="flex shrink-0 items-center gap-1">
      <AnimatePresence initial={false} mode="popLayout">
        {node}
      </AnimatePresence>
    </div>
  );
}

function Composer({ phase, act }: { phase: Phase; act: (a: Action) => void }) {
  const [text, setText] = useState("");
  const draft = phase === "draft";
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    act(draft ? { type: "add", title } : { type: "steer", title });
    setText("");
  };
  const steerable = draft || phase === "running" || phase === "paused";
  return (
    <div className="px-4 pb-3">
      <form className="flex items-center gap-1.5" onSubmit={submit}>
        <div className="relative h-9 min-w-0 flex-1 overflow-hidden rounded-full border" style={{ borderColor: C.border, background: C.card }}>
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center" style={{ color: C.muted }}>
            {draft ? <Plus size={16} strokeWidth={1.75} /> : <MessageSquareText size={16} strokeWidth={1.75} />}
          </span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!steerable}
            aria-label={draft ? "Add a step" : "Steer the next step"}
            placeholder={draft ? "Add a step" : "Steer the next step"}
            className="ap-input h-full w-full bg-transparent pl-10 pr-3.5 text-sm outline-none"
            style={{ color: C.fg }}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || !steerable}
          aria-label={draft ? "Add step" : "Queue note"}
          className="grid size-9 shrink-0 place-items-center rounded-full border disabled:opacity-50"
          style={{ borderColor: C.border, background: C.surface, color: C.fg }}
        >
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ the card */

function AgentPlan() {
  const { state, clock, act, cancelAutoRun } = usePlanRun();
  const onRemove = useCallback((id: string) => act({ type: "remove", id }), [act]);
  const onRetry = useCallback(() => act({ type: "retry" }), [act]);

  return (
    <section
      aria-label={`${AGENT.name} plan: ${GOAL}`}
      data-part="card"
      className="w-full overflow-clip rounded-2xl border"
      style={{ background: C.card, borderColor: C.border }}
      onPointerDown={state.phase === "draft" ? cancelAutoRun : undefined}
      onKeyDown={state.phase === "draft" ? cancelAutoRun : undefined}
    >
      <header className="px-4 pt-3.5">
        <div className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full" style={{ background: C.surface }}>
            <Orbit size={12} style={{ color: C.muted }} />
          </span>
          <p className="min-w-0 flex-1 truncate text-xs" style={{ color: C.muted }}>
            <span className="font-medium" style={{ color: C.fg }}>
              {AGENT.name}
            </span>
            <span className="ap-mono ml-1.5">{AGENT.model}</span>
          </p>
          <StatusPill phase={state.phase} />
        </div>
        <h2 className="mt-2 text-sm font-medium">{GOAL}</h2>
        <div className="mt-3 flex gap-1" aria-hidden>
          {state.steps.map((step, i) => (
            <span key={step.id} className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: C.surface }}>
              <SegmentFill clock={clock} status={statusOf(state, i)} ms={step.ms} />
            </span>
          ))}
        </div>
      </header>

      <div className="px-4 pb-3 pt-4">
        <ul className="flex flex-col">
          {state.steps.map((step, i) => {
            const status = statusOf(state, i);
            return (
              <StepRow
                key={step.id}
                step={step}
                index={i}
                status={status}
                shown={i === state.current ? state.shown : 0}
                last={i === state.steps.length - 1}
                clock={clock}
                added={state.added.includes(step.id)}
                onRemove={onRemove}
                onRetry={onRetry}
              />
            );
          })}
        </ul>
      </div>

      <Composer phase={state.phase} act={act} />

      <footer className="flex min-h-12 items-center justify-between gap-3 border-t px-4 py-2" style={{ borderColor: C.border }}>
        <p className="min-w-0 truncate text-xs" style={{ color: C.muted }}>
          <FooterText state={state} clock={clock} />
        </p>
        <FooterAction phase={state.phase} act={act} />
      </footer>
    </section>
  );
}

/**
 * Agent plan (motion-faithful clone of beUI Pro's "Plan runner").
 * Plays on mount: the draft holds 700 ms, then the plan runs; step 5 fails and waits for Retry.
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts it (used by the capture).
 */
export default function AgentPlanClone() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((n) => n + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="ap-root h-full w-full p-6" style={{ background: "var(--ap-bg)" }}>
        <AgentPlan key={run} />
      </div>
    </MotionConfig>
  );
}
