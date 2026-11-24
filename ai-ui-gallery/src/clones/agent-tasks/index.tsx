import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowUp, Bot, Check, ChevronDown, GitPullRequest, RotateCcw, Square, X } from "lucide-react";
import clsx from "clsx";
import {
  MAX_RUNNING,
  RING_LAG_MS,
  START_DELAY_MS,
  STEP_MS,
  clockText,
  initialAgents,
  newAgent,
  ringAt,
  type Agent,
  type PlanKind,
  type Ring,
  type Status,
} from "./data";
import "./agent-tasks.css";

/* Timing read off the reference (see .reanimate/agent-tasks/spec.md). */
const EXPO = [0.16, 1, 0.3, 1] as const;
const PANEL = { duration: 0.3, ease: EXPO };
const RING_C = 2 * Math.PI * 8;

/* ------------------------------------------------------------------ run clock */

/** Milliseconds since the demo mounted, advanced once per animation frame. */
function createClock() {
  let value = 0;
  const subs = new Set<() => void>();
  return {
    get: () => value,
    set(next: number) {
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

/* ------------------------------------------------------------------ state */

interface State {
  agents: Agent[];
  open: string | null;
  nextPr: number;
}

type Action =
  | { type: "advance"; t: number }
  | { type: "toggle"; id: string }
  | { type: "answer"; id: string; t: number }
  | { type: "retry"; id: string; t: number }
  | { type: "stop"; id: string; t: number }
  | { type: "add"; title: string; t: number };

/** Steps from `from` onward, one every STEP_MS, then done. */
function planFrom(agent: Agent, from: number, at: number): Agent["plan"] {
  const n = agent.steps.length;
  const plan: Agent["plan"] = [];
  for (let k = 1; k < n - from; k++) plan.push({ at: at + k * STEP_MS, kind: "step" });
  plan.push({ at: at + (n - from) * STEP_MS, kind: "done" });
  return plan;
}

function start(agent: Agent, at: number): Agent {
  const s = agent.schedule;
  const plan: Agent["plan"] = s
    ? s.map((t, i) => ({ at: t, kind: i === s.length - 1 ? ("done" as const) : ("step" as const) }))
    : planFrom(agent, 0, at);
  const total = plan[plan.length - 1].at - at;
  return {
    ...agent,
    status: "running",
    step: 0,
    timerFrom: at,
    ring: { p0: 0, t0: at + RING_LAG_MS, rate: 1 / total },
    plan,
    schedule: undefined,
  };
}

/** Needs you / failed → running again from the current step; the ring fills the rest of the way. */
function resume(agent: Agent, t: number): Agent {
  const n = agent.steps.length;
  const p0 = agent.status === "needs" ? agent.step / n : ringAt(agent.ring, t);
  const left = (n - agent.step) * STEP_MS;
  return {
    ...agent,
    status: "running",
    error: undefined,
    question: undefined,
    timerFrom: t - (agent.heldSeconds ?? 0) * 1000,
    ring: { p0, t0: t, rate: (0.99 - p0) / left },
    plan: planFrom(agent, agent.step, t),
  };
}

function hold(agent: Agent, at: number, status: Status, error?: string): Agent {
  return {
    ...agent,
    status,
    error: error ?? agent.error,
    heldSeconds: Math.floor((at - agent.timerFrom) / 1000),
    ring: { p0: ringAt(agent.ring, at), t0: at, rate: 0 },
    plan: [],
  };
}

function applyEvent(agent: Agent, kind: PlanKind, at: number): Agent {
  switch (kind) {
    case "start":
      return start(agent, at);
    case "step":
      return { ...agent, step: Math.min(agent.step + 1, agent.steps.length - 1) };
    case "fail":
      return hold(agent, at, "failed");
    case "done":
      return { ...agent, status: "done", step: agent.steps.length, plan: [] };
  }
}

/** Queued agents (oldest first, i.e. from the bottom) start once fewer than MAX_RUNNING are busy. */
function fillSlots(agents: Agent[], at: number): Agent[] {
  let busy = agents.filter((a) => a.status === "running" || a.plan.some((p) => p.kind === "start")).length;
  if (busy >= MAX_RUNNING) return agents;
  const next = [...agents];
  for (let i = next.length - 1; i >= 0 && busy < MAX_RUNNING; i--) {
    const a = next[i];
    if (a.status === "queued" && a.plan.length === 0) {
      next[i] = { ...a, plan: [{ at: at + START_DELAY_MS, kind: "start" }] };
      busy++;
    }
  }
  return next;
}

function nextDue(agents: Agent[]) {
  let min = Infinity;
  for (const a of agents) for (const p of a.plan) min = Math.min(min, p.at);
  return min;
}

function advance(agents: Agent[], t: number): Agent[] {
  let list = agents;
  // Apply due events in time order, so queue decisions see the right number of busy agents.
  for (;;) {
    let best: { i: number; at: number; kind: PlanKind } | null = null;
    list.forEach((a, i) => {
      const p = a.plan[0];
      if (p && p.at <= t && (!best || p.at < best.at)) best = { i, at: p.at, kind: p.kind };
    });
    if (!best) return list;
    const { i, at, kind } = best as { i: number; at: number; kind: PlanKind };
    const a = list[i];
    const rest = { ...a, plan: a.plan.slice(1) };
    list = list.map((x, j) => (j === i ? applyEvent(rest, kind, at) : x));
    list = fillSlots(list, at);
  }
}

function reducer(state: State, action: Action): State {
  const patch = (id: string, fn: (a: Agent) => Agent) => state.agents.map((a) => (a.id === id ? fn(a) : a));
  switch (action.type) {
    case "advance":
      return { ...state, agents: advance(state.agents, action.t) };
    case "toggle":
      return { ...state, open: state.open === action.id ? null : action.id };
    case "answer":
    case "retry":
      return { ...state, agents: patch(action.id, (a) => resume(a, action.t)) };
    case "stop":
      return { ...state, agents: fillSlots(patch(action.id, (a) => hold(a, action.t, "failed", "Stopped by you")), action.t) };
    case "add": {
      const agent = newAgent(action.title, state.nextPr);
      return { ...state, nextPr: state.nextPr + 1, agents: fillSlots([agent, ...state.agents], action.t) };
    }
  }
}

function init(): State {
  return { agents: fillSlots(initialAgents(), 0), open: "a2", nextPr: 222 };
}

function summary(agents: Agent[]) {
  const n = (s: Status) => agents.filter((a) => a.status === s).length;
  return [
    [n("running"), "running"],
    [n("needs"), "needs you"],
    [n("failed"), "failed"],
    [n("done"), "done"],
  ]
    .filter(([c]) => (c as number) > 0)
    .map(([c, label]) => `${c} ${label}`)
    .join(" · ");
}

/* ------------------------------------------------------------------ swap: keyed cross-fade in one cell */

interface SwapItem {
  uid: number;
  k: string;
  className: string;
  node: ReactNode;
  phase: "idle" | "in" | "out";
}

/**
 * Keeps the leaving child mounted next to the entering one until its exit keyframes end (CSS `animationend`),
 * like AnimatePresence in sync mode. The first child renders settled, without an entrance.
 */
function Swap({ k, className, enter, exit, children }: { k: string; className: string; enter: string; exit: string; children: ReactNode }) {
  const uid = useRef(0);
  const [items, setItems] = useState<SwapItem[]>(() => [{ uid: 0, k, className, node: children, phase: "idle" }]);
  let list = items;
  if (list[list.length - 1].k !== k) {
    uid.current += 1;
    list = [
      ...list.map((it) => (it.phase === "out" ? it : { ...it, phase: "out" as const })),
      { uid: uid.current, k, className, node: children, phase: "in" },
    ];
    setItems(list);
  }
  return (
    <>
      {list.map((it, i) => {
        const current = i === list.length - 1;
        return (
          <span
            key={it.uid}
            className={clsx(current ? className : it.className, it.phase === "in" && enter, it.phase === "out" && exit)}
            onAnimationEnd={
              it.phase === "out"
                ? (e) => {
                    if (e.target === e.currentTarget) setItems((prev) => prev.filter((x) => x.uid !== it.uid));
                  }
                : undefined
            }
          >
            {current ? children : it.node}
          </span>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ markers */

/** Progress ring: stroke-dashoffset is written straight to the DOM every frame, no React render. */
function RingMarker({ ring, clock }: { ring: Ring; clock: Clock }) {
  const arc = useRef<SVGCircleElement>(null);
  const offset = (t: number) => String(RING_C * (1 - ringAt(ring, t)));
  useLayoutEffect(() => {
    const paint = () => arc.current?.setAttribute("stroke-dashoffset", offset(clock.get()));
    paint();
    return clock.subscribe(paint);
  });
  return (
    <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="none" stroke="var(--at-track)" strokeWidth="2" />
      <circle
        ref={arc}
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="var(--at-run)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={offset(clock.get())}
      />
    </svg>
  );
}

const MARKER_CLASS: Record<Status, string> = {
  running: "rounded-full",
  queued: "rounded-full",
  needs: "rounded-full",
  failed: "rounded-full bg-[var(--at-fail)] text-[#1b1a18]",
  done: "rounded-full bg-[var(--at-done)] text-[#10241c]",
};

function MarkerBody({ agent, clock }: { agent: Agent; clock: Clock }) {
  switch (agent.status) {
    case "running":
      return <RingMarker ring={agent.ring} clock={clock} />;
    case "queued":
      return (
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--at-faint)" strokeWidth="1.5" strokeDasharray="2.2 2.8" />
        </svg>
      );
    case "needs":
      return (
        <span className="relative flex size-2.5">
          <span className="at-ping absolute inset-0 rounded-full bg-[var(--at-needs)] opacity-60" />
          <span className="relative size-2.5 rounded-full bg-[var(--at-needs)]" />
        </span>
      );
    case "failed":
      return <X className="size-3" strokeWidth={3} aria-hidden="true" />;
    case "done":
      return <Check className="size-3" strokeWidth={3} aria-hidden="true" />;
  }
}

/* ------------------------------------------------------------------ row pieces */

function Timer({ from, clock }: { from: number; clock: Clock }) {
  const seconds = useSyncExternalStore(clock.subscribe, () => Math.floor((clock.get() - from) / 1000));
  return <span className="text-[var(--at-muted)]">{clockText(seconds)}</span>;
}

function RightLabel({ agent, clock }: { agent: Agent; clock: Clock }) {
  switch (agent.status) {
    case "running":
      return <Timer from={agent.timerFrom} clock={clock} />;
    case "queued":
      return <span className="font-sans text-[var(--at-muted)]">Queued</span>;
    case "needs":
      return <span className="font-sans text-[var(--at-needs-fg)]">Needs you</span>;
    case "failed":
      return <span className="font-sans text-[var(--at-fail-fg)]">Failed</span>;
    case "done":
      return (
        <span>
          <span className="text-[var(--at-add)]">+{agent.diff.add}</span>{" "}
          <span className="text-[var(--at-del)]">−{agent.diff.del}</span>
        </span>
      );
  }
}

function subtitle(agent: Agent): { k: string; text: string; className: string } {
  const base = "absolute inset-x-0 top-0 truncate";
  switch (agent.status) {
    case "running":
      return { k: `run:${agent.step}`, text: agent.steps[agent.step].line, className: clsx(base, "text-[var(--at-muted)]") };
    case "needs":
      return { k: "needs", text: agent.question?.text ?? "", className: clsx(base, "text-[var(--at-needs-fg)]") };
    case "failed":
      return { k: `fail:${agent.error}`, text: agent.error ?? "Failed", className: clsx(base, "text-[var(--at-fail-fg)]") };
    case "queued":
    case "done":
      return {
        k: `repo:${agent.status === "done" ? "done" : "queued"}`,
        text: `${agent.repo} · ${agent.branch}`,
        className: clsx(base, "at-mono text-[var(--at-muted)]"),
      };
  }
}

type StepState = "done" | "current" | "failed" | "pending";

function stepState(agent: Agent, i: number): StepState {
  if (agent.status === "done" || i < agent.step) return "done";
  if (agent.status === "queued" || i > agent.step) return "pending";
  return agent.status === "failed" ? "failed" : "current";
}

function StepDot({ state, status }: { state: StepState; status: Status }) {
  if (state === "done")
    return (
      <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[var(--at-fg)] text-[var(--at-bg)]">
        <Check className="size-2" strokeWidth={4} aria-hidden="true" />
      </span>
    );
  if (state === "failed")
    return (
      <span className="grid size-3.5 shrink-0 place-items-center rounded-full bg-[var(--at-fail)] text-[#1b1a18]">
        <X className="size-2" strokeWidth={4} aria-hidden="true" />
      </span>
    );
  if (state === "current")
    return <span className={clsx("size-3.5 shrink-0 rounded-full", status === "needs" ? "bg-[var(--at-needs)]" : "bg-[var(--at-run)]")} />;
  return <span className="size-3.5 shrink-0 rounded-full border border-[var(--at-card-border)]" />;
}

const btn = "inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium select-none at-tone";
const primaryBtn = clsx(btn, "bg-[var(--at-primary)] text-white hover:bg-[var(--at-primary-hover)]");
const outlineBtn = clsx(btn, "border border-[var(--at-card-border)] bg-[var(--at-card)] text-[var(--at-fg)] hover:border-[var(--at-faint)]");

interface Actions {
  toggle: (id: string) => void;
  answer: (id: string) => void;
  retry: (id: string) => void;
  stop: (id: string) => void;
}

function Panel({ agent, actions }: { agent: Agent; actions: Actions }) {
  return (
    <div className="space-y-3 px-3 pt-0.5 pb-3 pl-11">
      <ol aria-label="Steps" className="space-y-1.5">
        {agent.steps.map((s, i) => {
          const st = stepState(agent, i);
          return (
            <li key={s.label} className="flex items-center gap-2 text-xs">
              <StepDot state={st} status={agent.status} />
              <span className={clsx("truncate", st === "pending" ? "text-[var(--at-muted)]" : "text-[var(--at-fg)]")}>{s.label}</span>
            </li>
          );
        })}
      </ol>
      <div className="space-y-2">
        {agent.status === "needs" && agent.question && (
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={primaryBtn} onClick={() => actions.answer(agent.id)}>
              {agent.question.options[0]}
            </button>
            <button type="button" className={outlineBtn} onClick={() => actions.answer(agent.id)}>
              {agent.question.options[1]}
            </button>
          </div>
        )}
        {agent.status === "failed" && (
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={primaryBtn} onClick={() => actions.retry(agent.id)}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}
        {agent.status === "done" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className={primaryBtn}>
              <GitPullRequest className="size-3.5" aria-hidden="true" />
              Open PR #{agent.diff.pr}
            </button>
            <button type="button" className={outlineBtn}>
              View diff
            </button>
            <span className="ml-auto text-xs text-[var(--at-muted)]">
              {agent.diff.files} {agent.diff.files === 1 ? "file" : "files"}
            </span>
          </div>
        )}
        {agent.status === "running" && (
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={outlineBtn} onClick={() => actions.stop(agent.id)}>
              <Square className="size-3" aria-hidden="true" />
              Stop
            </button>
          </div>
        )}
        {agent.status === "queued" && <p className="text-xs text-[var(--at-muted)]">Starts when an agent is free</p>}
      </div>
    </div>
  );
}

const AgentRow = memo(function AgentRow({ agent, open, clock, actions }: { agent: Agent; open: boolean; clock: Clock; actions: Actions }) {
  const panelId = useId();
  const sub = subtitle(agent);
  return (
    <motion.li
      className="overflow-clip"
      initial={agent.isNew ? { height: 0, opacity: 0, filter: "blur(4px)" } : false}
      animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
      transition={PANEL}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => actions.toggle(agent.id)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--at-run)] focus-visible:ring-inset"
      >
        <span className="relative grid size-5 shrink-0 place-items-center">
          <Swap
            k={agent.status}
            className={clsx("col-start-1 row-start-1 grid size-5 place-items-center", MARKER_CLASS[agent.status])}
            enter="at-mk-in"
            exit="at-mk-out"
          >
            <MarkerBody agent={agent} clock={clock} />
          </Swap>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{agent.title}</span>
          <span className="relative block h-4 overflow-hidden text-xs leading-4">
            <Swap k={sub.k} className={sub.className} enter="at-sub-in" exit="at-sub-out">
              {sub.text}
            </Swap>
          </span>
        </span>
        <span className="at-mono shrink-0 text-right text-xs">
          <RightLabel agent={agent} clock={clock} />
        </span>
        <span className="at-chevron shrink-0 text-[var(--at-muted)]" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            className="overflow-clip"
            initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
            animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
            exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
            transition={PANEL}
          >
            <Panel agent={agent} actions={actions} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
});

/* ------------------------------------------------------------------ the card */

function AgentTasks({ startedAt }: { startedAt: number }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [clock] = useState(createClock);
  const [draft, setDraft] = useState("");
  const titleId = useId();
  const due = useRef(nextDue(state.agents));
  useLayoutEffect(() => {
    due.current = nextDue(state.agents);
  }, [state.agents]);

  // One frame loop drives the clock (rings, timers) and fires scheduled transitions on the frame they fall due.
  useEffect(() => {
    let id = 0;
    const loop = () => {
      // +0.5 ms: a frame that lands on a scheduled time (on the capture's virtual clock) can read 999.99 ms.
      const t = performance.now() - startedAt + 0.5;
      flushSync(() => {
        clock.set(t);
        if (t >= due.current) {
          due.current = Infinity;
          dispatch({ type: "advance", t });
        }
      });
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [clock, startedAt]);

  const now = useCallback(() => performance.now() - startedAt, [startedAt]);
  const actionsRef = useRef<Actions>(null as unknown as Actions);
  if (!actionsRef.current)
    actionsRef.current = {
      toggle: (id) => dispatch({ type: "toggle", id }),
      answer: (id) => dispatch({ type: "answer", id, t: now() }),
      retry: (id) => dispatch({ type: "retry", id, t: now() }),
      stop: (id) => dispatch({ type: "stop", id, t: now() }),
    };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    dispatch({ type: "add", title, t: now() });
    setDraft("");
  };

  return (
    <section
      aria-labelledby={titleId}
      className="w-full max-w-md rounded-3xl border border-[var(--at-card-border)] bg-[var(--at-card)] p-1.5 text-[var(--at-fg)]"
    >
      <header className="flex items-center gap-2.5 px-3 pt-2 pb-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--at-chip)]">
          <Bot className="size-3.5 text-[var(--at-muted)]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="truncate text-sm font-medium">
            Background agents
          </h2>
          <p aria-live="polite" className="truncate text-xs text-[var(--at-muted)]">
            {summary(state.agents)}
          </p>
        </div>
      </header>
      <ul className="divide-y divide-[var(--at-line)] overflow-clip rounded-2xl border border-[var(--at-line)] bg-[var(--at-list)]">
        {state.agents.map((a) => (
          <AgentRow key={a.id} agent={a} open={state.open === a.id} clock={clock} actions={actionsRef.current} />
        ))}
      </ul>
      <div className="px-0.5 pt-1.5">
        <form onSubmit={submit}>
          <div
            data-state={draft ? "typing" : "idle"}
            className={clsx(
              "at-tone relative h-10 overflow-hidden rounded-full border bg-[var(--at-list)]",
              draft ? "border-[var(--at-faint)]" : "border-[var(--at-line)]",
            )}
          >
            <input
              aria-label="New background task"
              placeholder="Hand an agent a new task"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-full w-full bg-transparent pr-10 pl-3.5 text-sm text-[var(--at-fg)] caret-[var(--at-run)] outline-none placeholder:text-[var(--at-faint)]"
            />
            <span className="absolute top-0 right-1 flex h-full items-center">
              <button
                type="submit"
                aria-label="Start"
                disabled={!draft.trim()}
                className="at-tone grid size-8 place-items-center rounded-full bg-[var(--at-primary)] text-white disabled:bg-[var(--at-chip)] disabled:text-[var(--at-muted)]"
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </button>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

/**
 * Agent tasks: background agents running in parallel. Plays on mount;
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts it (used by the capture).
 */
export default function AgentTasksClone() {
  const [run, setRun] = useState(() => ({ n: 0, at: performance.now() }));
  useEffect(() => {
    const replay = () => {
      const at = performance.now();
      setRun((r) => ({ n: r.n + 1, at }));
    };
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="at-root h-full w-full p-6" style={{ background: "var(--at-bg)" }}>
        <AgentTasks key={run.n} startedAt={run.at} />
      </div>
    </MotionConfig>
  );
}
