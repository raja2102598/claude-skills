import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  usePresence,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Database,
  GitMerge,
  Globe,
  Mail,
  OctagonX,
  Rocket,
  TriangleExclamationPoint,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { REQUESTS, RESOLVED_AT_START, RISK_LABEL, RULES_AT_START, type Agent, type Request, type Risk, type ToolIcon } from "./data";
import "./approval.css";

/*
 * Agent approval queue, motion-faithful to Arc UI "Agent approvals" (see .reanimate/approval/spec.md).
 * Approve on the focused request: the decision row cross-fades to "Sending…" and grows 4px, the pending
 * count rolls down at ≈485 ms as the row turns into "Approved", and at ≈1100 ms the next request takes
 * focus: the old one fades out, the new one fades in and rises 14px, its queue row collapses and the resolved
 * count rolls up. Deny runs the same steps ~185 ms sooner. Heights, rises and digit rolls are one critically
 * damped spring (ω = 18 rad/s).
 */

// Every spring in the reference fits x(t) = 1 - (1 + ωt)e^(-ωt) with ω = 18 rad/s: stiffness ω², damping 2ω.
const OMEGA = 18;
const SPRING = { type: "spring", stiffness: OMEGA * OMEGA, damping: 2 * OMEGA, mass: 1 } as const;
// While the decision row's own height springs, the focus card's outer height chases it more slowly (ω ≈ 9).
const CHASE_OMEGA = 9;

// Measured from the click; each commit lands one frame before the springs it starts, hence ~15-20 ms early.
// decided: "Sending…" → "Approved" / "Denied" and the pending count drops (approve: roll starts ≈ 485 ms).
// advance: the next request takes focus (approve: springs start ≈ 1098 ms). A denial is ~185 ms quicker.
type Kind = "approve" | "deny" | "allow";
const TIMING: Record<Kind, { decided: number; advance: number }> = {
  approve: { decided: 467, advance: 1080 },
  allow: { decided: 467, advance: 1080 },
  deny: { decided: 281, advance: 899 },
};
const OUT_MS = 100; // leaving content fades out over 100 ms (quint-out), new content fades in over 150-200 ms
const ROW_H = 48;
const RISE = 14;

const TOOL_ICONS: Record<ToolIcon, LucideIcon> = {
  release: Rocket,
  mail: Mail,
  database: Database,
  globe: Globe,
  merge: GitMerge,
};
const RISK_ICONS: Record<Risk, LucideIcon> = { high: OctagonX, medium: TriangleExclamationPoint, low: CircleCheck };

type Decision = { kind: Kind; stage: "sending" | "done" };

const byId = (id: string) => REQUESTS.find((r) => r.id === id)!;

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

/* ------------------------------------------------------------------ helpers */

/**
 * Keeps the last content of a keyed slot on screen for `ms` after the key changes, so it can fade out on top of
 * the new content without taking space.
 */
function useLeaving(key: string, node: ReactNode, ms: number) {
  const prev = useRef({ key, node });
  const [leaving, setLeaving] = useState<{ key: string; node: ReactNode }[]>([]);
  const timers = useRef<number[]>([]);
  useLayoutEffect(() => {
    if (prev.current.key !== key) {
      const old = prev.current;
      setLeaving((list) => [...list.filter((x) => x.key !== old.key), old]);
      timers.current.push(window.setTimeout(() => setLeaving((list) => list.filter((x) => x !== old)), ms));
    }
    prev.current = { key, node };
  });
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return leaving;
}

/**
 * Height follows the content with a critically damped spring, stepped analytically on requestAnimationFrame and
 * written straight to the element. Re-targeting keeps the current velocity, so a wrapper whose content is itself
 * springing chases it smoothly (the reference's nested auto-height lag). rAF runs the same on the real clock and
 * on reanimate's virtual capture clock.
 */
function AutoHeight({
  className,
  innerClassName,
  omega,
  children,
  ...rest
}: {
  className: string;
  innerClassName: string;
  /** Spring angular frequency in rad/s, read at each re-target. */
  omega: MutableRefObject<number>;
  children: ReactNode;
  "data-ap"?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useLayoutEffect(() => {
    const box = outer.current!;
    const el = inner.current!;
    const s = { x: el.getBoundingClientRect().height, v: 0, target: 0, w: omega.current, raf: 0, last: 0 };
    s.target = s.x;
    box.style.height = `${s.x}px`;
    const step = (now: number) => {
      const dt = Math.min(0.064, Math.max(0, (now - s.last) / 1000));
      s.last = now;
      // x(t) - target = (e0 + (v0 + w e0) t) e^(-w t) for a critically damped spring
      const e0 = s.x - s.target;
      const c = s.v + s.w * e0;
      const k = Math.exp(-s.w * dt);
      s.x = s.target + (e0 + c * dt) * k;
      s.v = (c - s.w * (e0 + c * dt)) * k;
      if (Math.abs(s.x - s.target) < 0.01 && Math.abs(s.v) < 0.5) {
        s.x = s.target;
        s.v = 0;
        s.raf = 0;
      } else s.raf = requestAnimationFrame(step);
      box.style.height = `${s.x}px`;
    };
    const ro = new ResizeObserver((entries) => {
      const size = entries[0].borderBoxSize?.[0];
      const next = size ? size.blockSize : el.getBoundingClientRect().height;
      if (Math.abs(next - s.target) < 0.01) return;
      s.target = next;
      s.w = omega.current;
      if (reduce) {
        s.x = next;
        s.v = 0;
        box.style.height = `${next}px`;
        return;
      }
      if (!s.raf) {
        s.last = performance.now();
        s.raf = requestAnimationFrame(step);
      }
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
    };
  }, [omega, reduce]);
  return (
    <div ref={outer} className={className} {...rest}>
      <div ref={inner} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}

/**
 * One digit of a rolling number: the glyphs 0-9 on a wheel, 13px apart, each fading and blurring with its distance
 * from the value. A count that goes up rolls the wheel up (9 → 0 wraps forward), a count that goes down rolls it down.
 */
function Digit({ digit, dir }: { digit: number; dir: 1 | -1 }) {
  const pos = useMotionValue(digit);
  const reduce = useReducedMotion();
  useEffect(() => {
    const from = pos.get();
    if (((from % 10) + 10) % 10 === digit) return;
    if (reduce) {
      pos.jump(digit);
      return;
    }
    // continue from the wheel's current angle to the nearest copy of `digit` in the direction of the count
    let to = digit + 10 * Math.floor(from / 10);
    if (dir > 0) while (to <= from) to += 10;
    else while (to >= from) to -= 10;
    const run = animate(pos, to, SPRING);
    run.then(() => pos.jump(digit));
    return () => run.stop();
  }, [digit, dir, pos, reduce]);
  return (
    <span className="ap-digit" aria-hidden="true">
      <span className="ap-digit-sizer">{digit}</span>
      {Array.from({ length: 10 }, (_, d) => (
        <Glyph key={d} d={d} pos={pos} />
      ))}
    </span>
  );
}

/** Signed distance from the wheel position to glyph d, wrapped into [-5, 5). */
const wheel = (d: number, p: number) => ((((d - p + 5) % 10) + 10) % 10) - 5;

function Glyph({ d, pos }: { d: number; pos: MotionValue<number> }) {
  const y = useTransform(pos, (p) => wheel(d, p) * 13);
  const opacity = useTransform(pos, (p) => Math.max(0, 1 - Math.abs(wheel(d, p))));
  const filter = useTransform(pos, (p) => {
    const k = Math.min(1, Math.abs(wheel(d, p)));
    return k < 0.01 ? "none" : `blur(${(k * 1.2).toFixed(2)}px)`;
  });
  return (
    <motion.span className="ap-glyph" data-glyph={d} style={{ y, opacity, filter }}>
      {d}
    </motion.span>
  );
}

function RollingNumber({ value }: { value: number }) {
  const prev = useRef(value);
  const dir = useRef<1 | -1>(1);
  if (value !== prev.current) {
    dir.current = value > prev.current ? 1 : -1;
    prev.current = value;
  }
  const digits = String(value).split("").map(Number);
  return (
    <span className="ap-digits">
      <span className="ap-sr">{value}</span>
      {digits.map((d, i) => (
        <Digit key={digits.length - i} digit={d} dir={dir.current} />
      ))}
    </span>
  );
}

function AgentMark({ agent }: { agent: Agent }) {
  return (
    <span className="ap-mark" style={{ background: agent.color }} aria-hidden="true">
      {agent.name[0]}
    </span>
  );
}

function RiskBadge({ risk, suffix }: { risk: Risk; suffix?: string }) {
  const Icon = RISK_ICONS[risk];
  return (
    <span className="ap-risk" data-risk={risk}>
      <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
      <span>
        {RISK_LABEL[risk]}
        {suffix}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ decision row */

function DecisionRow({
  req,
  decision,
  onDecide,
}: {
  req: Request;
  decision: Decision | undefined;
  onDecide: (kind: Kind) => void;
}) {
  const omega = useRef(OMEGA);
  const key = decision ? `${decision.kind}-${decision.stage}` : "idle";
  const changed = useRef(false);
  if (key !== "idle") changed.current = true;

  let node: ReactNode;
  if (!decision) {
    node = (
      <div className="ap-actions">
        <button type="button" className="ap-btn ap-btn-ghost" data-ap="deny" onClick={() => onDecide("deny")}>
          Deny
        </button>
        <span className="ap-actions-end">
          <button type="button" className="ap-btn ap-btn-allow" data-ap="allow" onClick={() => onDecide("allow")}>
            Always allow
            <ChevronDown size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button type="button" className="ap-btn ap-btn-primary" data-ap="approve" onClick={() => onDecide("approve")}>
            Approve
            <kbd className="ap-kbd">Enter</kbd>
          </button>
        </span>
      </div>
    );
  } else if (decision.stage === "sending") {
    const text =
      decision.kind === "deny"
        ? `Telling ${req.agent.name} no`
        : decision.kind === "allow"
          ? `Saving a rule for ${req.agent.name}`
          : `Sending your approval to ${req.agent.name}`;
    node = <div className="ap-status">{text}</div>;
  } else if (decision.kind === "deny") {
    node = (
      <div className="ap-status">
        <X size={15} strokeWidth={2} className="is-no" aria-hidden="true" />
        <strong>Denied</strong>
        <span>·</span>
        <span>{req.agent.name} will not run it</span>
      </div>
    );
  } else {
    node = (
      <div className="ap-status">
        <Check size={15} strokeWidth={2} className="is-ok" aria-hidden="true" />
        <strong>Approved</strong>
        <span>·</span>
        <span>{decision.kind === "allow" ? "Rule saved, ran as a dry run" : "Dry run, nothing executed"}</span>
      </div>
    );
  }

  const leaving = useLeaving(key, node, OUT_MS);
  return (
    <AutoHeight className="ap-decision-slot" innerClassName="ap-decision-inner" omega={omega} data-ap="decision-slot">
      <div key={key} className={clsx("ap-decision", changed.current && "ap-in-150")} aria-live="polite">
        {node}
      </div>
      {leaving.map((l) => (
        <div key={`${l.key}-out`} className="ap-decision is-leaving ap-out-100" aria-hidden="true" inert>
          {l.node}
        </div>
      ))}
    </AutoHeight>
  );
}

/* ------------------------------------------------------------------ focused request */

function Slide({
  req,
  decision,
  leaving,
  enter,
  onDecide,
}: {
  req: Request;
  decision: Decision | undefined;
  leaving: boolean;
  enter: boolean;
  onDecide: (kind: Kind) => void;
}) {
  const reduce = useReducedMotion();
  const y = useMotionValue(enter && !reduce ? RISE : 0);
  useEffect(() => {
    if (enter && !reduce) animate(y, 0, SPRING);
  }, [enter, reduce, y]);
  const Tool = TOOL_ICONS[req.tool];
  return (
    <motion.div
      className={clsx("ap-slide", leaving ? "is-leaving ap-out-100" : enter && "ap-in-200")}
      style={{ y }}
      data-ap="slide"
      aria-hidden={leaving || undefined}
      inert={leaving || undefined}
    >
      <div className="ap-meta">
        <span className="ap-agent">
          <AgentMark agent={req.agent} />
          <span className="ap-agent-name">{req.agent.name}</span>
          <span>{req.agent.model}</span>
          <span>·</span>
          <span>{req.ago}</span>
        </span>
        <RiskBadge risk={req.risk} suffix=" risk" />
      </div>
      <h3 className="ap-focus-title">
        <Tool size={20} strokeWidth={1.75} aria-hidden="true" />
        <span>
          {req.verb}
          {req.command && <span className="ap-mono"> {req.command}</span>}
        </span>
      </h3>
      <p className="ap-reason">{req.reason}</p>
      <dl className="ap-args">
        {req.args.map((a) => (
          <div className="ap-arg" key={a.key}>
            <dt>{a.key}</dt>
            <dd className={a.mono ? "ap-mono" : undefined}>{a.value}</dd>
          </div>
        ))}
      </dl>
      <DecisionRow req={req} decision={decision} onDecide={onDecide} />
    </motion.div>
  );
}

function EmptySlide() {
  return (
    <div className="ap-slide ap-in-200" data-ap="slide">
      <div className="ap-empty">
        <strong>
          <CircleCheck size={16} strokeWidth={1.75} aria-hidden="true" />
          All caught up
        </strong>
        <span>Agents will ask here before they act.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ queue */

function QueueRow({ req, enter, onFocus }: { req: Request; enter: boolean; onFocus: () => void }) {
  const [isPresent, safeToRemove] = usePresence();
  const reduce = useReducedMotion();
  const entering = useRef(enter && !reduce).current; // rows present at mount do not animate in
  const height = useMotionValue(entering ? 0 : ROW_H);
  useEffect(() => {
    if (entering) animate(height, ROW_H, SPRING);
  }, [entering, height]);
  useEffect(() => {
    if (isPresent) return;
    if (reduce) {
      safeToRemove?.();
      return;
    }
    const a = animate(height, 0, SPRING);
    a.then(() => safeToRemove?.());
    return () => a.stop();
  }, [isPresent, height, reduce, safeToRemove]);
  const Tool = TOOL_ICONS[req.tool];
  return (
    <motion.li
      className={clsx("ap-queue-item", !isPresent ? "ap-out-150" : entering && "ap-in-150")}
      style={{ height }}
      data-id={req.id}
    >
      <button type="button" className="ap-row" onClick={onFocus} tabIndex={isPresent ? 0 : -1}>
        <span className="ap-row-marks">
          <AgentMark agent={req.agent} />
          <Tool size={15} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="ap-row-text">
          <span>{req.summary}</span>
          <span className="ap-row-agent">{req.agent.name}</span>
        </span>
        <RiskBadge risk={req.risk} />
      </button>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ the queue card */

const DEMO: Kind[] = ["approve", "deny", "allow", "approve", "deny"];

function ApprovalQueue({ onRestart }: { onRestart: () => void }) {
  const [pending, setPending] = useState<string[]>(() => REQUESTS.map((r) => r.id));
  const [focusId, setFocusId] = useState<string | null>(REQUESTS[0].id);
  const [leavingSlides, setLeavingSlides] = useState<string[]>([]);
  const [entered, setEntered] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [pendingCount, setPendingCount] = useState(REQUESTS.length);
  const [resolved, setResolved] = useState(RESOLVED_AT_START);
  const [rules, setRules] = useState(RULES_AT_START);
  const [busy, setBusy] = useState(false);

  const focusOmega = useRef(OMEGA);
  const timers = useRef<number[]>([]);
  const mounted = useRef(false);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const demo = useRef({ on: autoplayEnabled(), step: 0 });

  useEffect(() => {
    mounted.current = true;
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const swapFocus = useCallback((next: string | null, prev: string | null) => {
    focusOmega.current = OMEGA;
    setFocusId(next);
    setEntered(next ?? "empty");
    if (prev) {
      setLeavingSlides((l) => [...l.filter((x) => x !== prev), prev]);
      timers.current.push(window.setTimeout(() => setLeavingSlides((l) => l.filter((x) => x !== prev)), OUT_MS));
    }
  }, []);

  const decide = (kind: Kind) => {
    if (busy || !focusId) return;
    const id = focusId;
    focusOmega.current = CHASE_OMEGA;
    setBusy(true);
    setDecisions((d) => ({ ...d, [id]: { kind, stage: "sending" } }));
    later(TIMING[kind].decided, () => {
      setDecisions((d) => ({ ...d, [id]: { kind, stage: "done" } }));
      setPendingCount((c) => c - 1);
      if (kind === "allow") setRules((r) => r + 1);
    });
    later(TIMING[kind].advance, () => {
      const rest = pendingRef.current.filter((x) => x !== id);
      setPending(rest);
      swapFocus(rest[0] ?? null, id);
      setResolved((r) => r + 1);
      setBusy(false);
    });
  };

  const focusOn = (id: string) => {
    if (busy || id === focusId) return;
    // The focused request goes back to its place in the queue; the chosen one leaves the queue for the focus.
    swapFocus(id, focusId);
  };

  const move = (step: 1 | -1) => {
    if (!focusId) return;
    const i = pending.indexOf(focusId);
    const next = pending[(i + step + pending.length) % pending.length];
    if (next) focusOn(next);
  };

  const stopDemo = () => {
    demo.current.on = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "enter" || k === "a") decide("approve");
    else if (k === "d") decide("deny");
    else if (k === "j") move(1);
    else if (k === "k") move(-1);
    else return;
    e.preventDefault();
  };

  // Gallery autoplay: work through the queue (approve, deny, always allow, …), then start over. Any input ends it.
  useEffect(() => {
    if (!demo.current.on || busy) return;
    if (!focusId) {
      const t = window.setTimeout(() => demo.current.on && onRestart(), 2600);
      return () => clearTimeout(t);
    }
    const kind = DEMO[demo.current.step % DEMO.length];
    const t = window.setTimeout(() => {
      if (!demo.current.on) return;
      demo.current.step += 1;
      decide(kind);
    }, demo.current.step === 0 ? 1400 : 1500);
    return () => clearTimeout(t);
    // decide is recreated every render; the effect only needs to re-run when the queue settles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, focusId]);

  const queue = pending.filter((id) => id !== focusId);
  const slides = [
    ...(focusId ? [focusId] : ["empty"]),
    ...leavingSlides.filter((id) => id !== focusId),
  ];

  return (
    <section
      className="ap-card"
      data-ap="card"
      aria-labelledby="ap-title"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => e.isTrusted && stopDemo()}
      onKeyDownCapture={(e) => e.isTrusted && stopDemo()}
    >
      <header className="ap-header">
        <div className="ap-heading">
          <h2 className="ap-title" id="ap-title">
            Approvals
          </h2>
          <span className="ap-count" data-ap="pending">
            <RollingNumber value={pendingCount} /> pending
          </span>
        </div>
        <button type="button" className="ap-rules">
          Rules <span className="ap-dot">·</span> <RollingNumber value={rules} />
        </button>
      </header>

      <div className="ap-focus-area" data-ap="focus-area">
        <AutoHeight className="ap-auto" innerClassName="ap-auto-inner" omega={focusOmega}>
          {slides.map((id) => {
            const leaving = id !== (focusId ?? "empty");
            if (id === "empty") return <EmptySlide key="empty" />;
            return (
              <Slide
                key={id}
                req={byId(id)}
                decision={decisions[id]}
                leaving={leaving}
                enter={entered === id}
                onDecide={decide}
              />
            );
          })}
        </AutoHeight>
      </div>

      <ul className="ap-queue" data-ap="queue" aria-label="Waiting requests">
        <AnimatePresence initial={false}>
          {queue.map((id) => (
            <QueueRow key={id} req={byId(id)} enter={mounted.current} onFocus={() => focusOn(id)} />
          ))}
        </AnimatePresence>
      </ul>

      <footer className="ap-footer">
        <span className="ap-resolved" data-ap="resolved">
          <ChevronRight size={15} strokeWidth={1.75} aria-hidden="true" />
          Resolved <span className="ap-dot">·</span> <RollingNumber value={resolved} />
        </span>
        <span className="ap-keys" aria-hidden="true">
          <span>
            <kbd className="ap-kbd">J</kbd>
            <kbd className="ap-kbd">K</kbd>
            Move
          </span>
          <span>
            <kbd className="ap-kbd">A</kbd>
            Approve
          </span>
          <span>
            <kbd className="ap-kbd">D</kbd>
            Deny
          </span>
        </span>
      </footer>
    </section>
  );
}

/**
 * Plays a demo on load (approve, deny, always allow… until the queue is clear, then starts over); the first pointer
 * or key input hands control to the person. `?autoplay=0` turns the demo off, and
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts the card (both used by the capture).
 */
export default function Approval() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="ap-root">
      <ApprovalQueue key={run} onRestart={() => setRun((r) => r + 1)} />
    </div>
  );
}
