import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { animate, useReducedMotion } from "motion/react";
import {
  Ban,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  Database,
  LoaderCircle,
  MessagesSquare,
  RotateCcw,
  ShieldAlert,
  SquareKanban,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import "./tool-call.css";

/*
 * Grouped tool-call card, motion-faithful to Arc UI "Tool call" (Pro).
 * One agent turn: the user's question, a streamed lead-in, then a card whose calls run one after another. A running
 * call shows a spinner and a shimmering label; it settles into a check with its result and timing, or fails inline
 * with a reason and Retry. Retry re-runs it and a fourth call asks for approval; Allow / Deny finish the turn, the
 * card collapses and the answer streams in under it with Run again.
 * Heights run on motion springs (JS, so they keep time on a frame-stepped clock); opacity, blur and scale are CSS
 * keyframes, springs sampled into linear() easings.
 */

// ---------- motion constants (measured on the reference, see .reanimate/tool-call/spec.md) ----------

/** A critically damped spring from 0 to 1, sampled into a CSS linear() easing. */
function criticalSpring(omega: number, ms?: number, samples = 40) {
  const seconds = ms ? ms / 1000 : 9.23 / omega; // 9.23/ω: 99.9 % settled
  const at = (t: number) => 1 - (1 + omega * t) * Math.exp(-omega * t);
  const stops = Array.from({ length: samples + 1 }, (_, i) => (i === samples ? 1 : +at((i / samples) * seconds).toFixed(4)));
  return { easing: `linear(${stops.join(", ")})`, ms: `${Math.round(seconds * 1000)}ms` };
}
const ICON_SPRING = criticalSpring(25); // status icon scale .6 ↔ 1
const STACK_SPRING = criticalSpring(17); // header mark scale .6 → 1
const CHEVRON_SPRING = criticalSpring(18.3, 440); // chevron rotation, 440 ms
const HEIGHT_SPRING = { type: "spring", stiffness: 300, damping: 35, mass: 1, restDelta: 0.02, restSpeed: 0.2 } as const; // ω ≈ 17.3, no overshoot

// ms from a call's / the card's mount to the start of its label's first sweep
const SHIMMER_LEAD = { row: 280, header: 200 };

// Main run, ms from mount.
const T = { chunk1: 180, chunk2: 230, group: 600, done1: 1800, row2: 2017, done2: 2777, row3: 3000, fail3: 4385 };
// Follow-ups, ms from the click.
const RETRY = { done: 700, approval: 975 };
const ALLOW = { done: 620, collapse: 1100, answer: 1580, chunkGap: 45, runAgain: 2280 };
const DENY = { answer: 480, runAgain: 1180 };

// ---------- copy (placeholder) ----------

type ToolId = "tracker" | "board" | "db" | "chat";
type Status = "running" | "success" | "error" | "approval" | "denied";

const TOOL: Record<ToolId, { icon: LucideIcon; name: string }> = {
  tracker: { icon: Ticket, name: "Tracker" },
  board: { icon: SquareKanban, name: "Board" },
  db: { icon: Database, name: "Database" },
  chat: { icon: MessagesSquare, name: "Chat" },
};

const USER = "Is anything blocking the 3.4 launch?";
const LEAD = ["Let me look into", " what is holding it up."];
const COPY = {
  tracker: { running: "Searching open tickets in nova/app", done: "Searched open tickets in nova/app", meta: ["5 results", "1.2s"] },
  board: { running: "Reading the 3.4 launch board", done: "Read the 3.4 launch board", meta: ["2 blocked", "760ms"] },
  db: {
    running: "Checking pending schema changes",
    failed: "Could not check pending schema changes",
    note: "Connection to db-primary timed out after 5s",
    done: "Checked pending schema changes",
    meta: ["1 pending", "420ms"],
  },
  chat: {
    ask: "Post a summary to #launch",
    note: "Sends as Atlas to 32 people in #launch",
    running: "Posting to #launch",
    done: "Posted to #launch",
    meta: ["1 message", "610ms"],
  },
} as const;
const ANSWER_HEAD = ["Two items block 3.4:", " the export stall in #812", " and schema change 0031,", " which is still pending on db-primary."];
const ANSWER = {
  allow: [...ANSWER_HEAD, " I posted a summary in #launch."],
  deny: [...ANSWER_HEAD, " I did not post to #launch."],
};

type Detail = { input: [string, string][]; output?: [string, string, string][]; error?: string };
const DETAIL: Record<ToolId, Detail> = {
  tracker: {
    input: [["repo", "nova/app"], ["query", "is:open label:launch-blocker milestone:3.4"], ["sort", "updated"]],
    output: [
      ["#812", "Export stalls on files over 2 GB", "export"],
      ["#827", "Invite links expire after one hour", "auth"],
      ["#833", "Chart legend overlaps on narrow screens", "ui"],
      ["#840", "Menus lose focus rings in dark mode", "ui"],
      ["#846", "CSV import skips the last row", "import"],
    ],
  },
  board: {
    input: [["board", "Launch 3.4"], ["columns", "blocked, in review"]],
    output: [
      ["#812", "Export stalls on files over 2 GB", "blocked"],
      ["0031", "Schema change: add usage_events", "blocked"],
    ],
  },
  db: {
    input: [["database", "db-primary"], ["sql", "select id, name from schema_changes where applied_at is null order by id"]],
    output: [["0031", "add usage_events", "pending"]],
    error: "ETIMEDOUT after 5000ms",
  },
  chat: {
    input: [["channel", "#launch"], ["message", "3.4 is blocked by #812 and schema change 0031."]],
    output: [["ok", "Message posted to #launch", "12:04"]],
  },
};

// ---------- state ----------

interface Call {
  id: number;
  tool: ToolId;
  status: Status;
  title: string;
  note?: string;
  meta?: readonly string[];
  enter: boolean; // added after the card mounted: grows in
  at: number; // when its running label mounted (shimmer phase)
}

interface TurnState {
  chunks: number;
  group: boolean;
  groupAt: number;
  calls: Call[];
  header: string;
  headerAt: number | null; // shimmer origin while calls run, null when idle
  flag: string | null; // "1 failed" / total time
  failed: boolean;
  open: boolean;
  answer: "allow" | "deny" | null;
  answerChunks: number;
  runAgain: boolean;
}

const INITIAL: TurnState = {
  chunks: 0,
  group: false,
  groupAt: 0,
  calls: [],
  header: "",
  headerAt: null,
  flag: null,
  failed: false,
  open: true,
  answer: null,
  answerChunks: 0,
  runAgain: false,
};

type Step = [number, (s: TurnState, now: number) => TurnState];

const setCall = (s: TurnState, id: number, patch: Partial<Call>): TurnState => ({
  ...s,
  calls: s.calls.map((c) => (c.id === id ? { ...c, ...patch } : c)),
});
const using = (n: number) => `Using ${n} tool${n === 1 ? "" : "s"}`;
const addRunning = (s: TurnState, now: number, id: number, tool: "board" | "db"): TurnState => ({
  ...s,
  calls: [...s.calls, { id, tool, status: "running", title: COPY[tool].running, enter: true, at: now }],
  header: using(id),
});

const MAIN: Step[] = [
  [T.chunk1, (s) => ({ ...s, chunks: 1 })],
  [T.chunk2, (s) => ({ ...s, chunks: 2 })],
  [
    T.group,
    (s, now) => ({
      ...s,
      group: true,
      groupAt: now,
      header: using(1),
      headerAt: now,
      calls: [{ id: 1, tool: "tracker", status: "running", title: COPY.tracker.running, enter: false, at: now }],
    }),
  ],
  [T.done1, (s) => setCall(s, 1, { status: "success", title: COPY.tracker.done, meta: COPY.tracker.meta })],
  [T.row2, (s, now) => addRunning(s, now, 2, "board")],
  [T.done2, (s) => setCall(s, 2, { status: "success", title: COPY.board.done, meta: COPY.board.meta })],
  [T.row3, (s, now) => addRunning(s, now, 3, "db")],
  [
    T.fail3,
    (s) => ({
      ...setCall(s, 3, { status: "error", title: COPY.db.failed, note: COPY.db.note }),
      header: "Used 3 tools",
      headerAt: null,
      flag: "1 failed",
      failed: true,
    }),
  ],
];

const RETRY_STEPS: Step[] = [
  [
    0,
    (s, now) => ({
      ...setCall(s, 3, { status: "running", title: COPY.db.running, note: undefined, at: now }),
      header: using(3),
      headerAt: now,
      flag: null,
      failed: false,
    }),
  ],
  [RETRY.done, (s) => setCall(s, 3, { status: "success", title: COPY.db.done, meta: COPY.db.meta })],
  [
    RETRY.approval,
    (s, now) => ({
      ...s,
      calls: [...s.calls, { id: 4, tool: "chat", status: "approval", title: COPY.chat.ask, note: COPY.chat.note, enter: true, at: now }],
      header: "Waiting for approval",
      headerAt: null,
    }),
  ],
];

const answerSteps = (kind: "allow" | "deny", from: number): Step[] =>
  ANSWER[kind].map((_, i): Step => [from + i * ALLOW.chunkGap, (s) => ({ ...s, answer: kind, answerChunks: i + 1 })]);

const ALLOW_STEPS: Step[] = [
  [0, (s, now) => ({ ...setCall(s, 4, { status: "running", title: COPY.chat.running, note: undefined, at: now }), header: using(4), headerAt: now })],
  [ALLOW.done, (s) => ({ ...setCall(s, 4, { status: "success", title: COPY.chat.done, meta: COPY.chat.meta }), header: "Used 4 tools", headerAt: null, flag: "3.0s" })],
  [ALLOW.collapse, (s) => ({ ...s, open: false })],
  ...answerSteps("allow", ALLOW.answer),
  [ALLOW.runAgain, (s) => ({ ...s, runAgain: true })],
];

const DENY_STEPS: Step[] = [
  [0, (s) => ({ ...setCall(s, 4, { status: "denied", note: undefined, meta: ["Denied"] }), header: "Used 4 tools", headerAt: null, flag: "2.4s" })],
  ...answerSteps("deny", DENY.answer),
  [DENY.runAgain, (s) => ({ ...s, runAgain: true })],
];

// ---------- building blocks ----------

/** Lets a nested AutoHeight tell its ancestors that it is running its own height spring. */
const HeightBusy = createContext<((delta: number) => void) | null>(null);

/**
 * Height that springs when its own content changes size (a row growing in, a note line appearing, details opening,
 * `collapsed` toggling) and otherwise sits at `height: auto`. While a nested AutoHeight is animating, ancestors stay
 * at auto and follow it in the same frame instead of chasing it with springs of their own. `from0` grows it in on mount.
 */
function AutoHeight({
  children,
  from0 = false,
  collapsed = false,
  className,
  style,
  ...rest
}: { children: ReactNode; from0?: boolean; collapsed?: boolean; className?: string; style?: CSSProperties } & {
  [data: `data-${string}`]: string | number | boolean | undefined;
}) {
  const reduce = useReducedMotion();
  const notifyParent = useContext(HeightBusy);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const st = useRef({ anim: null as { stop(): void } | null, own: false, kids: 0, last: 0, collapsed });
  st.current.collapsed = collapsed;

  const report = useCallback(
    (d: number) => {
      st.current.kids += d;
      notifyParent?.(d);
    },
    [notifyParent],
  );
  const setOwn = (on: boolean) => {
    if (st.current.own === on) return;
    st.current.own = on;
    notifyParent?.(on ? 1 : -1);
  };
  const settle = () => {
    const o = outer.current;
    if (o) o.style.height = st.current.collapsed ? "0px" : "auto";
    setOwn(false);
  };
  const springTo = (to: number) => {
    const s = st.current;
    s.anim?.stop();
    s.anim = null;
    if (reduce || !outer.current) return settle();
    setOwn(true);
    const a = animate(outer.current, { height: to }, {
      ...HEIGHT_SPRING,
      onComplete: () => {
        if (s.anim !== a) return;
        s.anim = null;
        settle();
      },
    });
    s.anim = a;
  };

  useLayoutEffect(() => {
    const o = outer.current!;
    const i = inner.current!;
    const s = st.current;
    s.last = i.offsetHeight;
    if (s.collapsed) o.style.height = "0px";
    else if (from0) {
      o.style.height = "0px";
      springTo(s.last);
    } else o.style.height = "auto";
    const ro = new ResizeObserver(() => {
      const h = i.offsetHeight;
      const prev = s.last;
      s.last = h;
      if (h === prev || s.collapsed) return;
      if (s.kids > 0) {
        // a nested AutoHeight is springing: follow it at auto
        if (s.anim) {
          s.anim.stop();
          s.anim = null;
          settle();
        }
        return;
      }
      if (!s.anim) o.style.height = `${prev}px`;
      springTo(h);
    });
    ro.observe(i);
    return () => {
      ro.disconnect();
      s.anim?.stop();
      setOwn(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const o = outer.current!;
    if (!st.current.anim) o.style.height = `${o.offsetHeight}px`;
    springTo(collapsed ? 0 : inner.current!.offsetHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  return (
    <HeightBusy.Provider value={report}>
      <div ref={outer} className={className} style={{ overflow: "hidden", ...style }} {...rest}>
        <div ref={inner} style={{ display: "flow-root" }}>
          {children}
        </div>
      </div>
    </HeightBusy.Provider>
  );
}

/** A label that shimmers while `shimmerFrom` is set; it keeps its phase from that origin across re-renders. */
function ShimmerLabel({ text, shimmerFrom, className }: { text: string; shimmerFrom: number | null; className?: string }) {
  const [delay] = useState(() => (shimmerFrom === null ? 0 : shimmerFrom - performance.now()));
  const on = shimmerFrom !== null;
  return (
    <span className={[className, on ? "tc-shimmer" : ""].join(" ")} style={on ? { animationDelay: `${Math.round(delay)}ms` } : undefined}>
      {text}
    </span>
  );
}

/** Text that blurs out and the next text blurs in over it whenever `text` changes. */
function SwapText({ text, shimmerFrom, className }: { text: string; shimmerFrom: number | null; className?: string }) {
  const last = useRef({ text, shimmer: shimmerFrom !== null });
  const [out, setOut] = useState<{ text: string; shimmer: boolean; id: number } | null>(null);
  const [entered, setEntered] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (last.current.text !== text) {
      setOut({ text: last.current.text, shimmer: last.current.shimmer, id: performance.now() });
      setEntered(text);
    }
    last.current = { text, shimmer: shimmerFrom !== null };
  }, [text, shimmerFrom]);

  return (
    <span className={`tc-swap ${className ?? ""}`}>
      {out && (
        <span
          key={`out-${out.id}`}
          aria-hidden="true"
          className="tc-swap-out"
          style={out.shimmer ? { color: "color-mix(in oklab, var(--tc-ink) 12%, var(--tc-muted))" } : undefined}
          onAnimationEnd={() => setOut((o) => (o && o.id === out.id ? null : o))}
        >
          {out.text}
        </span>
      )}
      <ShimmerLabel key={text} text={text} shimmerFrom={shimmerFrom} className={entered === text ? "tc-swap-in" : undefined} />
    </span>
  );
}

function StatusGlyph({ status }: { status: Status }) {
  switch (status) {
    case "running":
      return <LoaderCircle size={14} strokeWidth={1.75} className="tc-spin" aria-hidden="true" />;
    case "success":
      return <Check size={16} strokeWidth={1.75} aria-hidden="true" />;
    case "error":
      return <CircleAlert size={15} strokeWidth={1.75} aria-hidden="true" />;
    case "approval":
      return <ShieldAlert size={15} strokeWidth={1.75} aria-hidden="true" />;
    case "denied":
      return <Ban size={14} strokeWidth={1.75} aria-hidden="true" />;
  }
}

/** Status icon: the old one fades (100 ms) and shrinks to .6 while the new one fades in and springs from .6 to 1. */
function StatusIcon({ status }: { status: Status }) {
  const last = useRef(status);
  const [out, setOut] = useState<{ status: Status; id: number } | null>(null);
  const [entered, setEntered] = useState<Status | null>(null);
  useLayoutEffect(() => {
    if (last.current !== status) {
      setOut({ status: last.current, id: performance.now() });
      setEntered(status);
    }
    last.current = status;
  }, [status]);
  return (
    <span className="tc-status" data-tc-status={status}>
      {out && (
        <span key={`out-${out.id}`} data-s={out.status} className="tc-icon-out" onAnimationEnd={(e) => e.animationName === "tc-scale-out" && setOut(null)}>
          <StatusGlyph status={out.status} />
        </span>
      )}
      <span key={status} data-s={status} className={entered === status ? "tc-icon-in" : undefined}>
        <StatusGlyph status={status} />
      </span>
    </span>
  );
}

/**
 * Keeps the last child mounted while it plays its exit class, then drops it. The child gets the class through
 * `render(kind, className)`; a leaving child is laid over the slot (absolute) so it frees its space at once.
 */
function Presence<K extends string>({
  show,
  kind,
  render,
  enter,
  exit,
}: {
  show: boolean;
  kind: K;
  render: (k: K, className: string, style: CSSProperties | undefined, onEnd: (() => void) | undefined) => ReactNode;
  enter: string;
  exit: string;
}) {
  const [shown, setShown] = useState<{ kind: K; leaving: boolean; animate: boolean } | null>(show ? { kind, leaving: false, animate: false } : null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (show) setShown((cur) => (cur && !cur.leaving && cur.kind === kind ? cur : { kind, leaving: false, animate: true }));
    else setShown((cur) => (cur ? { ...cur, leaving: true } : cur));
  }, [show, kind]);
  if (!shown) return null;
  if (shown.leaving)
    return render(shown.kind, exit, { position: "absolute", right: 0, top: "50%", translate: "0 -50%", pointerEvents: "none" }, () => setShown(null));
  return render(shown.kind, shown.animate ? enter : "", undefined, undefined);
}

function Details({ tool, status }: { tool: ToolId; status: Status }) {
  const d = DETAIL[tool];
  const failed = status === "error";
  return (
    <div className="tc-body">
      <div>
        <div className="tc-body-label">
          Input <Copy size={13} aria-hidden="true" />
        </div>
        <dl className="tc-box tc-kv">
          {d.input.map(([k, v]) => (
            <div key={k} style={{ display: "contents" }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {status !== "running" && status !== "approval" && status !== "denied" && (
        <div>
          <div className="tc-body-label">
            {failed ? "Error" : "Output"} <Copy size={13} aria-hidden="true" />
          </div>
          {failed ? (
            <div className="tc-box tc-error-box">{d.error}</div>
          ) : (
            <div className="tc-box tc-rows">
              {d.output?.map((r) => (
                <div key={r[0] + r[1]}>
                  <span>{r[0]}</span>
                  <span>{r[1]}</span>
                  <span>{r[2]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CallRow({
  call,
  onRetry,
  onAllow,
  onDeny,
}: {
  call: Call;
  onRetry: () => void;
  onAllow: () => void;
  onDeny: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = TOOL[call.tool].icon;
  const aside: "meta" | "retry" | "approval" | "none" =
    call.status === "error" ? "retry" : call.status === "approval" ? "approval" : call.meta ? "meta" : "none";

  return (
    <AutoHeight from0={call.enter} className={call.enter ? "tc-row-in" : undefined} data-tc-row={call.id}>
      <div className="tc-call" data-status={call.status} data-open={open ? "" : undefined}>
        <div className="tc-head">
          <button
            type="button"
            className="tc-toggle"
            aria-expanded={open}
            aria-label={`${TOOL[call.tool].name}: ${call.title}`}
            onClick={() => setOpen((o) => !o)}
          />
          <span className="tc-mark">
            <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <SwapText
            className="tc-title"
            text={call.title}
            shimmerFrom={call.status === "running" ? call.at + SHIMMER_LEAD.row : null}
          />
          <span className="tc-aside" style={{ position: "relative" }}>
            <Presence
              show={aside !== "none"}
              kind={aside}
              enter="tc-meta-in"
              exit="tc-meta-out"
              render={(k, cls, style, onEnd) =>
                k === "meta" ? (
                  <span className={`tc-meta ${cls}`} style={style} onAnimationEnd={onEnd} data-tc-meta>
                    {call.meta?.[0]}
                    {call.meta?.[1] && (
                      <>
                        <i>·</i>
                        {call.meta[1]}
                      </>
                    )}
                  </span>
                ) : k === "retry" ? (
                  <button
                    type="button"
                    data-tc-retry
                    className={`tc-btn tc-btn-outline ${cls}`}
                    style={style}
                    onAnimationEnd={onEnd}
                    onClick={onRetry}
                    aria-label={`Retry: ${call.title}`}
                  >
                    <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" />
                    Retry
                  </button>
                ) : k === "approval" ? (
                  <span className={cls} style={{ display: "inline-flex", gap: 6, ...style }} onAnimationEnd={onEnd}>
                    <button type="button" data-tc-deny className="tc-btn tc-btn-outline" onClick={onDeny}>
                      Deny
                    </button>
                    <button type="button" data-tc-allow className="tc-btn tc-btn-solid" onClick={onAllow}>
                      Allow
                    </button>
                  </span>
                ) : null
              }
            />
          </span>
          <StatusIcon status={call.status} />
          <ChevronDown size={16} strokeWidth={1.75} className="tc-chevron" aria-hidden="true" />
          {call.note && <span className="tc-note">{call.note}</span>}
        </div>
        <AutoHeight collapsed={!open}>
          <Details tool={call.tool} status={call.status} />
        </AutoHeight>
      </div>
    </AutoHeight>
  );
}

// ---------- the turn ----------

function Turn({ onRunAgain }: { onRunAgain: () => void }) {
  const [s, setS] = useState<TurnState>(INITIAL);
  const timers = useRef<number[]>([]);

  const play = (steps: Step[]) => {
    for (const [ms, fn] of steps) {
      timers.current.push(window.setTimeout(() => flushSync(() => setS((cur) => fn(cur, performance.now()))), ms));
    }
  };
  const playNow = (steps: Step[]) => {
    const [first, ...rest] = steps;
    if (first && first[0] === 0) setS((cur) => first[1](cur, performance.now()));
    play(first && first[0] === 0 ? rest : steps);
  };

  useEffect(() => {
    play(MAIN);
    const list = timers.current;
    return () => list.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toolIds = s.calls.map((c) => c.tool);
  const running = s.headerAt !== null;

  return (
    <div className="grid w-full min-w-0" style={{ maxWidth: 640, gap: 20 }} data-tc-demo>
      <p
        data-tc-bubble
        className="m-0 justify-self-end"
        style={{ maxWidth: "min(84%, 440px)", borderRadius: 14, padding: "8px 16px", background: "var(--tc-fill)", fontSize: 15, lineHeight: 1.5 }}
      >
        {USER}
      </p>
      <div className="grid min-w-0" style={{ gap: 12 }} data-tc-turn>
        <p data-tc-prose className="m-0" style={{ minHeight: "1.55em", fontSize: 15, lineHeight: 1.55 }}>
          {LEAD.slice(0, s.chunks).map((c, i) => (
            <span key={i} className="tc-chunk">
              {c}
            </span>
          ))}
        </p>

        {s.group && (
          <AutoHeight from0 className="tc-slot-in" data-tc-slot>
            <div className="tc-card" data-tc-card>
              <div className="tc-card-head">
                <button
                  type="button"
                  className={`tc-card-toggle ${s.open ? "tc-open" : ""}`}
                  aria-expanded={s.open}
                  onClick={() => setS((cur) => ({ ...cur, open: !cur.open }))}
                  data-tc-header
                >
                  <span className="tc-stack" style={{ "--tc-spring": STACK_SPRING.easing, "--tc-spring-ms": STACK_SPRING.ms } as CSSProperties}>
                    {toolIds.map((t, i) => {
                      const Icon = TOOL[t].icon;
                      return (
                        <span key={t} className={i > 0 ? "tc-stack-in" : undefined}>
                          <Icon size={12} strokeWidth={2} aria-hidden="true" />
                        </span>
                      );
                    })}
                  </span>
                  <SwapText className="min-w-0 flex-1" text={s.header} shimmerFrom={running ? s.headerAt! + SHIMMER_LEAD.header : null} />
                  <span style={{ position: "relative", display: "flex", flex: "none" }}>
                    <Presence
                      show={s.flag !== null}
                      kind={s.flag ?? ""}
                      enter="tc-flag-in"
                      exit="tc-flag-out"
                      render={(f, cls, style, onEnd) => (
                        <span
                          className={`tc-card-meta ${cls}`}
                          style={style}
                          onAnimationEnd={onEnd}
                          data-failed={f === "1 failed" ? "" : undefined}
                          data-tc-flag
                        >
                          {f}
                        </span>
                      )}
                    />
                  </span>
                  <ChevronDown size={16} strokeWidth={1.75} className="tc-chevron" aria-hidden="true" />
                </button>
              </div>
              <AutoHeight collapsed={!s.open} data-tc-list style={{ opacity: s.open ? 1 : 0, transition: "opacity 150ms var(--tc-ease-standard)" }}>
                <div className="tc-list">
                  {s.calls.map((c) => (
                    <CallRow
                      key={c.id}
                      call={c}
                      onRetry={() => playNow(RETRY_STEPS)}
                      onAllow={() => playNow(ALLOW_STEPS)}
                      onDeny={() => playNow(DENY_STEPS)}
                    />
                  ))}
                </div>
              </AutoHeight>
            </div>
          </AutoHeight>
        )}

        {s.answer && (
          <p data-tc-answer className="m-0" style={{ fontSize: 15, lineHeight: 1.55 }}>
            {ANSWER[s.answer].slice(0, s.answerChunks).map((c, i) => (
              <span key={i} className="tc-chunk">
                {c}
              </span>
            ))}
          </p>
        )}
        {s.runAgain && (
          <div>
            <button type="button" className="tc-btn tc-btn-ghost tc-flag-in" onClick={onRunAgain} data-tc-run-again>
              <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
              Run again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

export default function ToolCallCard() {
  const [run, setRun] = useState(() => (autoplayEnabled() ? 1 : 0));
  const rootVars = {
    "--tc-spring": ICON_SPRING.easing,
    "--tc-spring-ms": ICON_SPRING.ms,
    "--tc-chevron-spring": CHEVRON_SPRING.easing,
  } as CSSProperties;

  return (
    <div className="tc-root absolute inset-0 grid place-items-center overflow-hidden p-2" style={rootVars} data-tc-root>
      {run > 0 ? (
        <Turn key={run} onRunAgain={() => setRun((r) => r + 1)} />
      ) : (
        // Capture mode (?autoplay=0): nothing runs until this invisible full-stage button is clicked.
        <button type="button" data-tc-start aria-label="Play the demo" className="absolute inset-0 cursor-pointer opacity-0" onClick={() => setRun(1)} />
      )}
    </div>
  );
}
