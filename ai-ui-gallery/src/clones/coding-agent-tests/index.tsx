import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Check, ChevronRight, CircleDashed, FileCode, FlaskConical, X } from "lucide-react";
import "./coding-agent.css";

/*
 * Coding-agent test results, pixel-faithful to the AI Elements "Test Results" demo (shadcn/ui + AI Elements).
 * The agent runs the checkout tests: a shimmering "Running" line for 1.5 s, then the run lands as a summary line that
 * opens into suites and tests, the failing suite and test already open with their error, and the answer streams in.
 * Every change is a state swap on a timer (as in the reference's scripted transport); the shimmer is a CSS keyframe.
 */

function TraceLine({ status, children }: { status?: "running"; children: ReactNode }) {
  return (
    <span data-slot="trace-line" data-status={status} className="ca-line">
      {children}
    </span>
  );
}

function TraceIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-slot="trace-icon" aria-hidden="true" className={className ? `ca-icon ${className}` : "ca-icon"}>
      {children}
    </span>
  );
}

/**
 * Collapsible panel: height 0 ↔ content height over 200 ms, auto while open so streamed lines grow it in place.
 * Unless kept mounted, it mounts at height 0 on open and unmounts when the closing transition ends.
 */
function Panel({ open, keepMounted, children }: { open: boolean; keepMounted?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [present, setPresent] = useState(open || !!keepMounted);
  const first = useRef(true);
  const initiallyOpen = useRef(open);
  const openRef = useRef(open);
  openRef.current = open;
  if (open && !present) setPresent(true);
  const keepRef = useRef(keepMounted);
  keepRef.current = keepMounted;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      if (initiallyOpen.current) {
        el.style.height = "auto";
        return;
      }
    }
    let fallback = 0;
    const end = (e?: TransitionEvent) => {
      if (e && (e.propertyName !== "height" || e.target !== el)) return;
      el.removeEventListener("transitionend", end);
      window.clearTimeout(fallback);
      if (openRef.current) el.style.height = "auto";
      else if (!keepMounted) setPresent(false);
    };
    if (open) {
      // freshly mounted at height 0 (or re-opened while closing): grow to the content height
      const from = el.getBoundingClientRect().height;
      el.style.height = `${from}px`;
      void el.offsetHeight;
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = `${el.getBoundingClientRect().height}px`;
      void el.offsetHeight;
      el.style.height = "0px";
    }
    el.addEventListener("transitionend", end);
    fallback = window.setTimeout(() => end(), 260);
    return () => {
      el.removeEventListener("transitionend", end);
      window.clearTimeout(fallback);
    };
  }, [open, present]);

  if (!present) return null;
  return (
    <div ref={ref} data-slot="trace-collapsible-content" className="ca-panel" style={open && initiallyOpen.current && first.current ? undefined : { height: 0 }} inert={!open}>
      <div data-slot="trace-collapsible-content-inner" className="ca-panel-inner">
        {children}
      </div>
    </div>
  );
}

type Test = { name: string; status: "passed" | "failed"; error?: string };
const SUITES: { name: string; tests: Test[] }[] = [
  {
    name: "cart.test.ts",
    tests: [
      { name: "adds an item", status: "passed" },
      { name: "removes an item", status: "passed" },
      { name: "applies a discount code", status: "passed" },
    ],
  },
  {
    name: "payment.test.ts",
    tests: [
      { name: "charges the saved card", status: "passed" },
      {
        name: "retries a declined card",
        status: "failed",
        error: "Expected 2 charge attempts, received 1\n\n  at Object.<anonymous> (src/payment.test.ts:58:22)",
      },
    ],
  },
];
const COMMAND = "pnpm test checkout";
const QUESTION = "Run the checkout tests.";
const ANSWER =
  "One test failed. The payment client does not retry a declined card, so the second charge attempt never happens.".split(
    " ",
  );

// ms after the click (measured on the reference): the run lands at 1500, the answer streams at 20 ms per word
const T = { result: 1500, answer: 1520, word: 20 };

interface RunState {
  result: boolean;
  words: number;
  ready: boolean;
}
const START: RunState = { result: false, words: 0, ready: false };
const FINISHED: RunState = { result: true, words: ANSWER.length, ready: true };

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

const count = (tests: Test[]) => ({
  total: tests.length,
  failed: tests.filter((t) => t.status === "failed").length,
});
const format = ({ total, failed }: { total: number; failed: number }) =>
  [`${total} tests`, failed > 0 && `${failed} failed`].filter(Boolean).join(", ");

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
    <div data-slot="trace-collapsible" className="ca-collapsible">
      <button
        type="button"
        data-slot="trace-collapsible-trigger"
        className="ca-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {line}
        <TraceIcon className="ca-chevron">
          <ChevronRight />
        </TraceIcon>
      </button>
      <Panel open={open} keepMounted>
        {children}
      </Panel>
    </div>
  );
}

function Line({ icon, status, children }: { icon: ReactNode; status?: "running" | "error"; children: ReactNode }) {
  return (
    <TraceLine status={status}>
      <TraceIcon>{icon}</TraceIcon>
      <span data-slot="trace-title" className="ca-title">
        {children}
      </span>
    </TraceLine>
  );
}

function TestRow({ test }: { test: Test }) {
  if (test.status === "failed") {
    return (
      <Collapsible
        defaultOpen
        line={
          <Line icon={<X />} status="error">
            {test.name}
          </Line>
        }
      >
        <pre data-slot="code-block" className="ca-code" data-scroll>
          {test.error}
        </pre>
      </Collapsible>
    );
  }
  return <Line icon={<Check />}>{test.name}</Line>;
}

function Result() {
  const all = count(SUITES.flatMap((s) => s.tests));
  return (
    <Collapsible
      defaultOpen={all.failed > 0}
      line={
        <Line icon={<FlaskConical />} status={all.failed > 0 ? "error" : undefined}>
          Ran {format(all)}
        </Line>
      }
    >
      <div data-slot="trace" className="ca-trace">
        {SUITES.map((suite) => {
          const c = count(suite.tests);
          return (
            <Collapsible
              key={suite.name}
              defaultOpen={c.failed > 0}
              line={
                <Line icon={<FileCode />} status={c.failed > 0 ? "error" : undefined}>
                  {suite.name}, {format(c)}
                </Line>
              }
            >
              <div data-slot="trace" className="ca-trace">
                {suite.tests.map((t) => (
                  <TestRow key={t.name} test={t} />
                ))}
              </div>
            </Collapsible>
          );
        })}
      </div>
    </Collapsible>
  );
}

function Demo({ autoplay }: { autoplay: boolean }) {
  const [state, setState] = useState<RunState>(autoplay ? START : FINISHED);
  const [runId, setRunId] = useState(0);
  const timers = useRef<number[]>([]);

  const play = useCallback((fromClick: boolean) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (fromClick)
      flushSync(() => {
        setState(START);
        setRunId((r) => r + 1); // the reference empties the transcript, so the rows remount with fresh state
      });
    const t0 = performance.now();
    const at = (ms: number, next: (s: RunState) => RunState) => {
      timers.current.push(
        window.setTimeout(() => flushSync(() => setState(next)), Math.max(0, ms - (performance.now() - t0))),
      );
    };
    at(T.result, (s) => ({ ...s, result: true }));
    ANSWER.forEach((_, k) => {
      const last = k === ANSWER.length - 1;
      at(T.answer + k * T.word, (s) => ({ ...s, words: k + 1, ready: last }));
    });
  }, []);

  useEffect(() => {
    if (autoplay) play(false);
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, [autoplay, play]);

  const answer = ANSWER.slice(0, state.words).join(" ");

  return (
    <div className="ca-root" data-ca="root">
      <div data-slot="message" className="ca-message">
        <div data-slot="message-content" className="ca-message-content">
          <div data-slot="bubble-content" className="ca-bubble">
            {QUESTION}
          </div>
        </div>
      </div>
      <div data-slot="message" className="ca-message">
        <div data-slot="message-content" className="ca-message-content" aria-live="polite">
          <div data-slot="trace" className="ca-trace">
            {state.result ? (
              <Result key={runId} />
            ) : (
              <Line icon={<FlaskConical />} status="running">
                Running {COMMAND}
              </Line>
            )}
          </div>
          {answer && <p>{answer}</p>}
        </div>
      </div>
      {state.ready && (
        <button type="button" data-slot="button" data-ca="replay" className="ca-replay" onClick={() => play(true)}>
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
export default function CodingAgentTests() {
  const [run, setRun] = useState(0);
  const [autoplay] = useState(autoplayEnabled);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="ca-stage">
      <Demo key={run} autoplay={autoplay || run > 0} />
    </div>
  );
}
