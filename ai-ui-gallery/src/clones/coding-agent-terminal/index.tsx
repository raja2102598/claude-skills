import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ChevronRight, Terminal } from "lucide-react";
import "./coding-agent.css";

/*
 * Coding-agent terminal output, pixel-faithful to the AI Elements "Terminal" demo (shadcn/ui + AI Elements).
 * Three shell commands run in turn. Each line shimmers while it runs; its stdout streams into a code block one line
 * per 200 ms, the block opens on the first line and folds shut when the command ends. Then the answer streams.
 * Every change is a state swap on a timer (as in the reference's scripted transport); the shimmer is a CSS keyframe.
 */

const COMMANDS = [
  { command: "pnpm lint", output: ["> acme-chat@0.1.0 lint", "> eslint ."] },
  {
    command: "pnpm test",
    output: [
      "> acme-chat@0.1.0 test",
      "> vitest run",
      "",
      " ✓ lib/ai.test.ts (6 tests) 41ms",
      " ✓ components/chat.test.tsx (9 tests) 212ms",
      "",
      " Test Files  2 passed (2)",
      "      Tests  15 passed (15)",
    ],
  },
  {
    command: "pnpm build",
    output: [
      "> acme-chat@0.1.0 build",
      "> next build",
      "",
      "   ▲ Next.js 16.3.0",
      "   Creating an optimized production build ...",
      " ✓ Compiled successfully in 4.2s",
      " ✓ Generating static pages (12/12)",
      "",
      "Route (app)                Size  First Load JS",
      "┌ ○ /                     1.9 kB       112 kB",
      "└ ƒ /api/chat              141 B       102 kB",
    ],
  },
];
const QUESTION = "Run the checks, then build the app.";
const ANSWER = "Lint and tests pass, and the build compiled both routes.".split(" ");

// ms after the click (measured on the reference): one output line per 200 ms from the click, each command ends 33 ms after its last line's slot
const T = { first: 33, line: 200, word: 20 };

interface RunState {
  /** per command: lines of output received; -1 = not started, done = tool finished */
  lines: number[];
  done: boolean[];
  words: number;
  ready: boolean;
}
const START: RunState = { lines: [0, -1, -1], done: [false, false, false], words: 0, ready: false };
const FINISHED: RunState = {
  lines: COMMANDS.map((c) => c.output.length),
  done: [true, true, true],
  words: ANSWER.length,
  ready: true,
};

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

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
 * Not kept mounted: it mounts at height 0 on open and unmounts when the closing transition ends.
 */
function Panel({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [present, setPresent] = useState(open);
  const first = useRef(true);
  const initiallyOpen = useRef(open);
  const openRef = useRef(open);
  openRef.current = open;
  if (open && !present) setPresent(true);

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
      else setPresent(false);
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
    <div ref={ref} data-slot="trace-collapsible-content" className="ca-panel" style={{ height: 0 }} inert={!open}>
      <div data-slot="trace-collapsible-content-inner" className="ca-panel-inner">
        {children}
      </div>
    </div>
  );
}

function CommandRow({
  command,
  output,
  running,
  defaultOpen,
}: {
  command: string;
  output: string;
  running: boolean;
  defaultOpen?: boolean;
}) {
  const [userOpen, setUserOpen] = useState<boolean | undefined>(defaultOpen);
  const open = userOpen ?? (running && output.length > 0);
  return (
    <div data-slot="trace-collapsible" className="ca-collapsible">
      <button
        type="button"
        data-slot="trace-collapsible-trigger"
        className="ca-trigger"
        aria-expanded={open}
        onClick={() => setUserOpen(!open)}
      >
        <TraceLine status={running ? "running" : undefined}>
          <TraceIcon>
            <Terminal />
          </TraceIcon>
          <span data-slot="trace-title" className="ca-title">
            {running ? "Running" : "Ran"} {command}
          </span>
        </TraceLine>
        <TraceIcon className="ca-chevron">
          <ChevronRight />
        </TraceIcon>
      </button>
      <Panel open={open}>
        <pre data-slot="code-block" className="ca-code" data-scroll>
          {output}
        </pre>
      </Panel>
    </div>
  );
}

function Demo({ autoplay }: { autoplay: boolean }) {
  const [state, setState] = useState<RunState>(autoplay ? START : FINISHED);
  const [busy, setBusy] = useState(autoplay);
  const [runId, setRunId] = useState(0);
  const timers = useRef<number[]>([]);

  const play = useCallback((fromClick: boolean) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (fromClick)
      flushSync(() => {
        setState(START);
        setBusy(true);
        setRunId((r) => r + 1); // the reference empties the transcript, so every row remounts with fresh state
      });
    const t0 = performance.now();
    const at = (ms: number, next: (s: RunState) => RunState, finish = false) => {
      timers.current.push(
        window.setTimeout(
          () =>
            flushSync(() => {
              setState(next);
              if (finish) setBusy(false);
            }),
          Math.max(0, ms - (performance.now() - t0)),
        ),
      );
    };
    let before = 0;
    COMMANDS.forEach((c, ci) => {
      const start = ci === 0 ? 0 : T.first + T.line * before;
      if (ci > 0) at(start, (s) => ({ ...s, lines: s.lines.map((n, i) => (i === ci && n < 0 ? 0 : n)) }));
      c.output.forEach((_, k) => {
        at(T.line * (before + k), (s) => ({ ...s, lines: s.lines.map((n, i) => (i === ci ? k + 1 : n)) }));
      });
      before += c.output.length;
      at(T.first + T.line * before, (s) => ({ ...s, done: s.done.map((d, i) => d || i === ci) }));
    });
    const textAt = T.first + T.line * before;
    ANSWER.forEach((_, k) => {
      const last = k === ANSWER.length - 1;
      at(textAt + k * T.word, (s) => ({ ...s, words: k + 1, ready: last }), last);
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
            {COMMANDS.map((c, i) =>
              state.lines[i] < 0 ? null : (
                <CommandRow
                  key={`${runId}-${c.command}`}
                  command={c.command}
                  output={c.output.slice(0, state.lines[i]).join("\n")}
                  running={busy && !state.done[i]}
                  defaultOpen={busy ? undefined : i === COMMANDS.length - 1}
                />
              ),
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
export default function CodingAgentTerminal() {
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
