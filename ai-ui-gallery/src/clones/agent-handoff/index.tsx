import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ChevronRight, CircleCheck, LoaderCircle } from "lucide-react";
import "./agent-handoff.css";

/*
 * Subagent delegation, pixel-faithful to the AI Elements "Subagent" demo (shadcn/ui, MIT).
 * The agent hands the question to a research subagent. The subagent's line spins and shimmers, then opens into a
 * nested trace whose commands run one after another; when the last one returns, the line settles into
 * "Ran the research subagent" with the subagent's report under it, and the parent agent streams its answer.
 * Every change is a state swap on a timer (as in the reference's scripted transport); the spinner and the shimmer
 * are CSS keyframes, so they keep time on a frame-stepped capture clock too.
 */

// ms from the start of a run (measured on the reference, see .reanimate/agent-handoff/spec.md)
const T = { step: [600, 1600, 2600], done: 3600, answer: 4018, word: 20 };

const QUESTION = "Why does image optimization rerun on every deploy?";
const AGENT = "the research subagent";
const STEPS = [
  { command: "grep -rn cacheKey scripts", stdout: "scripts/optimize-images.ts:14:  const cacheKey = process.env.COMMIT_SHA" },
  {
    command: "sed -n 13,15p scripts/optimize-images.ts",
    stdout:
      'const cacheDir = ".next/cache/images"\nconst cacheKey = process.env.COMMIT_SHA\nconst cached = await restoreCache(cacheDir, cacheKey)',
  },
  { command: "ls public/images | wc -l", stdout: "1240" },
];
const REPORT = "The cache is keyed on the commit SHA, so every deploy misses it and optimizes all 1,240 images again.";
const ANSWER = (
  "Image optimization reruns because its cache is keyed on the commit SHA, which changes on every deploy. " +
  "Key the cache on a hash of public/images instead, and unchanged images will be skipped."
).split(" ");

/** phase 0: delegated, 1–3: running step 1–3, 4: subagent finished. words: streamed answer words. */
interface RunState {
  phase: number;
  words: number;
  ready: boolean;
}
const START: RunState = { phase: 0, words: 0, ready: false };
const FINISHED: RunState = { phase: 4, words: ANSWER.length, ready: true };

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

// ---------- trace pieces ----------

function Spinner() {
  return <LoaderCircle className="ah-spin" aria-hidden="true" />;
}

function TraceLine({ running, children }: { running?: boolean; children: ReactNode }) {
  return (
    <span data-slot="trace-line" data-status={running ? "running" : undefined} className="ah-line">
      {children}
    </span>
  );
}

function TraceIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-slot="trace-icon" aria-hidden="true" className={className ? `ah-icon ${className}` : "ah-icon"}>
      {children}
    </span>
  );
}

/** Collapsible panel: height 0 ↔ content height over 200 ms, auto while open so streamed content grows it in place. */
function Panel({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const openRef = useRef(open);
  openRef.current = open;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      el.style.height = open ? "auto" : "0px";
      return;
    }
    const from = el.getBoundingClientRect().height;
    el.style.height = `${from}px`;
    void el.offsetHeight; // commit the start height before the transition
    el.style.height = open ? `${el.scrollHeight}px` : "0px";
    const end = (e: TransitionEvent) => {
      if (e.propertyName !== "height" || e.target !== el) return;
      el.removeEventListener("transitionend", end);
      if (openRef.current) el.style.height = "auto";
    };
    el.addEventListener("transitionend", end);
    return () => el.removeEventListener("transitionend", end);
  }, [open]);

  return (
    <div ref={ref} data-slot="trace-collapsible-content" className="ah-panel" inert={!open}>
      <div data-slot="trace-collapsible-content-inner" className="ah-panel-inner">
        {children}
      </div>
    </div>
  );
}

function Collapsible({
  line,
  defaultOpen = false,
  children,
}: {
  line: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-slot="trace-collapsible" className="ah-collapsible">
      <button
        type="button"
        data-slot="trace-collapsible-trigger"
        className="ah-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {line}
        <TraceIcon className="ah-chevron">
          <ChevronRight />
        </TraceIcon>
      </button>
      <Panel open={open}>{children}</Panel>
    </div>
  );
}

function StepRow({ index, done }: { index: number; done: boolean }) {
  const { command, stdout } = STEPS[index];
  if (!done) {
    return (
      <TraceLine running>
        <TraceIcon>
          <Spinner />
        </TraceIcon>
        <span data-slot="trace-title" className="ah-title">
          Running {command}
        </span>
      </TraceLine>
    );
  }
  return (
    <Collapsible
      line={
        <TraceLine>
          <TraceIcon>
            <CircleCheck />
          </TraceIcon>
          <span data-slot="trace-title" className="ah-title">
            Ran {command}
          </span>
        </TraceLine>
      }
    >
      <pre data-slot="code-block" className="ah-code">
        {stdout}
      </pre>
    </Collapsible>
  );
}

function SubagentRow({ phase }: { phase: number }) {
  const done = phase >= 4;
  const line = (
    <TraceLine running={!done}>
      <TraceIcon>{done ? <CircleCheck /> : <Spinner />}</TraceIcon>
      <span data-slot="trace-title" className="ah-title">
        {done ? "Ran" : "Running"} {AGENT}
      </span>
    </TraceLine>
  );
  // Before the subagent reports any step there is nothing to open: a plain line. Afterwards the line moves into a
  // trigger, which remounts it (its spinner and shimmer restart, as in the reference).
  if (phase === 0) return line;

  const finished = done ? STEPS.length : phase - 1;
  return (
    <Collapsible line={line} defaultOpen>
      <div data-slot="trace" className="ah-trace">
        {STEPS.slice(0, Math.min(STEPS.length, finished + 1)).map((_, i) => (
          <StepRow key={`step-${i}`} index={i} done={i < finished} />
        ))}
      </div>
      {done && <p>{REPORT}</p>}
    </Collapsible>
  );
}

// ---------- the demo ----------

function SubagentDemo({ autoplay }: { autoplay: boolean }) {
  const [state, setState] = useState<RunState>(autoplay ? START : FINISHED);
  const timers = useRef<number[]>([]);

  const play = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    flushSync(() => setState(START));
    const t0 = performance.now();
    const at = (ms: number, next: (s: RunState) => RunState) => {
      timers.current.push(
        window.setTimeout(() => flushSync(() => setState(next)), Math.max(0, ms - (performance.now() - t0))),
      );
    };
    T.step.forEach((ms, i) => at(ms, (s) => ({ ...s, phase: i + 1 })));
    at(T.done, (s) => ({ ...s, phase: 4 }));
    ANSWER.forEach((_, k) => {
      const last = k === ANSWER.length - 1;
      at(T.answer + k * T.word, (s) => ({ ...s, words: k + 1, ready: last }));
    });
  }, []);

  useEffect(() => {
    if (autoplay) play();
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, [autoplay, play]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const answer = ANSWER.slice(0, state.words).join(" ");

  return (
    <div className="ah-root" data-ah="root">
      <div data-slot="message" className="ah-message">
        <div data-slot="message-content" className="ah-message-content">
          <div data-slot="bubble-content" className="ah-bubble">
            {QUESTION}
          </div>
        </div>
      </div>
      <div data-slot="message" className="ah-message">
        <div data-slot="message-content" className="ah-message-content" aria-live="polite">
          <div data-slot="trace" className="ah-trace">
            <SubagentRow phase={state.phase} />
          </div>
          {answer && <p>{answer}</p>}
        </div>
      </div>
      {state.ready && (
        <button type="button" data-slot="button" data-ah="replay" className="ah-replay" onClick={play}>
          Replay
        </button>
      )}
    </div>
  );
}

/**
 * Plays on mount. `?autoplay=0` starts on the finished transcript instead (the capture then clicks Replay), and
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts and plays again.
 */
export default function AgentHandoff() {
  const [run, setRun] = useState(0);
  const [autoplay] = useState(autoplayEnabled);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="ah-stage">
      <SubagentDemo key={run} autoplay={autoplay || run > 0} />
    </div>
  );
}
