import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Circle, CircleCheck, RotateCcw } from "lucide-react";
import "./thinking-indicator.css";

/*
 * Thinking status line, motion-faithful to UIStacks "Thinking state".
 * A phase label shimmers while a seconds counter runs. Every 1.6 s the label steps to the next phase. At 4.8 s it
 * settles into "Thought for 5s": the dot mark fades out (320 ms) while a check springs in (0.4 → 1, overshoot ≈ 21 %).
 * Reasoning steps tick to done with the phases, and the header collapses or expands the reasoning panel.
 * All sizes are the reference's at its 0.92 preview scale (13.8 px text, 14.72 px icons).
 */

const PHASE_MS = 1600;
const PHASES = ["Thinking…", "Searching…", "Reviewing…"];
const DONE_MS = PHASE_MS * PHASES.length; // 4800
const DONE_SECONDS = Math.ceil(DONE_MS / 1000); // 5

const REASONING =
  "The trip has to stay under $1,800 for four nights. Check fares for both dates, then rank the options by total cost so the cheapest fits come first.";

const STEPS: { label: string; meta?: string; doneAt: number }[] = [
  { label: "Searched 4 fare sites", meta: "9 results", doneAt: PHASE_MS * 2 },
  { label: "Reviewed 3 itineraries", meta: "Aster Air, Brindle +1", doneAt: DONE_MS },
  { label: "Compared total cost", doneAt: DONE_MS },
];

// Reference geometry at the preview's 0.92 scale.
const S = 0.92;
const px = (n: number) => +(n * S).toFixed(2);
const ICON = px(16);

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * An underdamped spring from 0 to 1 (mass 1), sampled into a CSS linear() easing that runs until the overshoot
 * envelope drops below 0.1 %. Plain CSS keeps the pop identical on the real clock and under frame-stepped capture.
 */
function springEasing(stiffness: number, damping: number, samples = 60) {
  const w0 = Math.sqrt(stiffness);
  const zeta = damping / (2 * w0);
  const wd = w0 * Math.sqrt(1 - zeta * zeta);
  const seconds = Math.log(1000) / (zeta * w0);
  const at = (t: number) => 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  const stops = Array.from({ length: samples + 1 }, (_, i) => (i === samples ? 1 : +at((i / samples) * seconds).toFixed(4)));
  return { easing: `linear(${stops.join(", ")})`, durationMs: Math.round(seconds * 1000) };
}

// Reference check: scale 0.4 → 1, peak 1.128 at ~160 ms, settled by ~700 ms (fit: stiffness 500, damping 20).
const CHECK_SPRING = springEasing(500, 20);

/** Static 5×5 dot mark: a dim grid with an X of lit dots in an amber → rose gradient. */
function DotMark() {
  const gradient = `ti-dots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const pos = [2, 6, 10, 14, 18];
  const lit = (r: number, c: number) => r === c || r + c === 4;
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: "var(--ti-dot-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--ti-dot-b)" }} />
        </linearGradient>
      </defs>
      {pos.map((cy, r) =>
        pos.map((cx, c) => (
          <circle
            key={`${r}-${c}`}
            cx={cx}
            cy={cy}
            r={1.6}
            style={lit(r, c) ? { fill: `url(#${gradient})` } : { fill: "var(--ti-ink)", opacity: 0.12 }}
          />
        )),
      )}
    </svg>
  );
}

function ThinkingState() {
  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = useState(0); // ms, advanced only at the moments something changes
  const [open, setOpen] = useState(true);
  const [dotsMounted, setDotsMounted] = useState(true);

  useEffect(() => {
    const marks = new Set<number>([1000, 2000, 3000, 4000]);
    for (let i = 1; i <= PHASES.length; i++) marks.add(PHASE_MS * i);
    const ids = [...marks].map((t) => setTimeout(() => setElapsed((e) => Math.max(e, t)), t));
    return () => ids.forEach(clearTimeout);
  }, []);

  const done = elapsed >= DONE_MS;
  const phase = Math.min(Math.floor(elapsed / PHASE_MS), PHASES.length - 1);
  const seconds = done ? DONE_SECONDS : Math.floor(elapsed / 1000) + 1;
  const status = done ? `Thought for ${seconds}s` : PHASES[phase];

  return (
    <div data-ti-root className="absolute" style={{ left: 24, top: 24, width: px(480) }}>
      <button
        data-ti-header
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
        style={{ gap: px(8), fontSize: px(15), lineHeight: 1.5 }}
      >
        <span data-ti-mark className="relative shrink-0" style={{ width: ICON, height: ICON }}>
          {dotsMounted && (
            <span
              data-ti-dots
              className={`absolute inset-0 grid place-items-center ${done ? "ti-fade-out" : ""}`}
              onAnimationEnd={() => setDotsMounted(false)}
            >
              <DotMark />
            </span>
          )}
          {done && (
            <span
              data-ti-check
              className="ti-pop absolute inset-0 grid place-items-center"
              style={{ animationDuration: `${CHECK_SPRING.durationMs}ms`, animationTimingFunction: CHECK_SPRING.easing }}
            >
              <CircleCheck size={ICON} strokeWidth={2} style={{ color: "var(--ti-done)" }} aria-hidden="true" />
            </span>
          )}
        </span>

        {done ? (
          <span
            data-ti-label
            className="text-[color:var(--ti-muted)] transition-colors group-hover:text-[color:var(--ti-ink)]"
          >
            {status}
          </span>
        ) : (
          <span data-ti-label key={phase} className="ti-shimmer">
            {status}
          </span>
        )}

        {!done && (
          <span data-ti-timer aria-hidden="true" className="tabular-nums" style={{ fontSize: px(13), color: "var(--ti-muted)" }}>
            {seconds}s
          </span>
        )}

        <ChevronDown
          data-ti-chevron
          aria-hidden="true"
          size={ICON}
          strokeWidth={1.5}
          className="shrink-0 text-[color:var(--ti-muted)] transition-colors group-hover:text-[color:var(--ti-ink)]"
          style={{ rotate: open ? "180deg" : "0deg" }}
        />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            data-ti-panel
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { height: { type: "spring", stiffness: 360, damping: 34 }, opacity: { duration: 0.3, ease: EASE } }
            }
            style={{ marginLeft: px(8), marginTop: px(8), paddingLeft: px(16), borderLeft: `${px(1)}px solid transparent` }}
          >
            <p style={{ fontSize: px(15), lineHeight: `${px(26)}px`, color: "var(--ti-muted)" }}>{REASONING}</p>
            <ul className="flex flex-col" style={{ marginTop: px(8), gap: px(4) }}>
              {STEPS.map((step) => {
                const stepDone = elapsed >= step.doneAt;
                return (
                  <li
                    key={step.label}
                    data-ti-step
                    className="flex min-w-0 items-center"
                    style={{ gap: px(10), fontSize: px(15), lineHeight: `${px(26)}px` }}
                  >
                    <span className="grid shrink-0 place-items-center" style={{ width: ICON, height: ICON }}>
                      {stepDone ? (
                        <CircleCheck size={ICON} strokeWidth={2} style={{ color: "var(--ti-done)" }} aria-hidden="true" />
                      ) : (
                        <Circle size={px(13)} strokeWidth={2} style={{ color: "var(--ti-pending)" }} aria-hidden="true" />
                      )}
                      <span className="sr-only">{stepDone ? "Done: " : "Pending: "}</span>
                    </span>
                    <span className="min-w-0 truncate">
                      {step.label}
                      {step.meta && (
                        <span style={{ marginLeft: px(8), fontSize: px(13), lineHeight: 1, color: "var(--ti-muted)" }}>{step.meta}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ThinkingIndicatorClone() {
  const [run, setRun] = useState(0);
  return (
    <div className="ti-root absolute inset-0">
      <ThinkingState key={run} />
      <button
        data-ti-replay
        type="button"
        aria-label="Replay"
        onClick={() => setRun((r) => r + 1)}
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-stone-400 outline-none transition-colors hover:text-stone-600 focus-visible:ring-2 focus-visible:ring-stone-400"
      >
        <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
