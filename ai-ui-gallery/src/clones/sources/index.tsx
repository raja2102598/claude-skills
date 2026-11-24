import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, ChevronRight, Globe } from "lucide-react";
import "./sources.css";

/*
 * Sources under a streamed reply, pixel-faithful to the AI Elements "Sources" demo (shadcn/ui, MIT).
 * Replay clears the thread to the question, the answer streams in one word per 20 ms, and with its last word a
 * "Used 3 sources" line lands open under it, listing each cited page (duplicates dropped) with an outbound arrow.
 * Clicking the line folds the list: its height runs to 0 over 200 ms (ease-in-out, starting one frame after the
 * click, as Base UI's collapsible does) while the chevron turns from down to right over 150 ms.
 * Every timed change is a state swap on a timer or a CSS transition, so it keeps time on a frame-stepped clock too.
 */

// ms from the Replay click (measured on the reference, see .reanimate/sources/spec.md)
const T = { first: 20, word: 20, panel: 200 };

const QUESTION = "How do I start an Astro project with pnpm?";
const ANSWER =
  "Run pnpm create astro@latest and follow the prompts. It scaffolds the project and installs the dependencies.".split(
    " ",
  );

interface Source {
  url: string;
  title: string;
}
// Placeholder sites (the reserved .example domain), in the order the stream cites them; the repeat is dropped.
const CITED: Source[] = [
  { url: "https://guides.example/astro/install", title: "Install Astro | guides.example" },
  { url: "https://packages.example/create-astro", title: "create-astro | packages.example" },
  { url: "https://guides.example/astro/install", title: "Install Astro | guides.example" },
  { url: "https://cli-notes.example/pnpm/create", title: "pnpm create | cli-notes.example" },
];
const SOURCES = CITED.filter((s, i, all) => all.findIndex((o) => o.url === s.url) === i);

/** words: streamed answer words; done: the stream finished (sources and Replay shown). */
interface RunState {
  words: number;
  done: boolean;
}
const START: RunState = { words: 0, done: false };
const FINISHED: RunState = { words: ANSWER.length, done: true };

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

// ---------- trace pieces ----------

function TraceLine({ children }: { children: ReactNode }) {
  return (
    <span data-slot="trace-line" className="src-line">
      {children}
    </span>
  );
}

function TraceIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-slot="trace-icon" aria-hidden="true" className={className ? `src-icon ${className}` : "src-icon"}>
      {children}
    </span>
  );
}

function TraceTitle({ children }: { children: ReactNode }) {
  return (
    <span data-slot="trace-title" className="src-title">
      {children}
    </span>
  );
}

/**
 * Collapsible panel. Closing: the height is pinned, then one frame later runs to 0 over 200 ms and the panel is
 * hidden; opening runs 0 → content height the same way and then lets go to auto.
 */
function Panel({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      el.hidden = !open;
      el.style.height = open ? "auto" : "0px";
      return;
    }
    let timer = 0;
    el.hidden = false;
    el.style.height = open ? "0px" : `${el.getBoundingClientRect().height}px`;
    const raf = requestAnimationFrame(() => {
      el.style.height = open ? `${el.scrollHeight}px` : "0px";
      timer = window.setTimeout(() => {
        if (open) el.style.height = "auto";
        else el.hidden = true;
      }, T.panel);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [open]);

  return (
    <div ref={ref} data-slot="trace-collapsible-content" className="src-panel" inert={!open}>
      <div data-slot="trace-collapsible-content-inner" className="src-panel-inner">
        {children}
      </div>
    </div>
  );
}

function Sources({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div data-slot="trace" className="src-trace">
      <div data-slot="trace-collapsible" className="src-collapsible">
        <button
          type="button"
          data-slot="trace-collapsible-trigger"
          className="src-trigger"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <TraceLine>
            <TraceIcon>
              <Globe />
            </TraceIcon>
            <TraceTitle>Used {sources.length} sources</TraceTitle>
          </TraceLine>
          <TraceIcon className="src-chevron">
            <ChevronRight />
          </TraceIcon>
        </button>
        <Panel open={open}>
          <div data-slot="trace" className="src-trace">
            {sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="src-link">
                <TraceLine>
                  <TraceTitle>
                    {source.title}
                    <span className="src-sr"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRight />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ---------- the demo ----------

function SourcesDemo({ autoplay }: { autoplay: boolean }) {
  const [state, setState] = useState<RunState>(autoplay ? START : FINISHED);
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  // From the Replay click the reset commits synchronously (same frame as the click); on mount it already is START.
  const play = useCallback((fromClick: boolean) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (fromClick) flushSync(() => setState(START));
    setRun((r) => r + 1);
    const t0 = performance.now();
    ANSWER.forEach((_, k) => {
      const last = k === ANSWER.length - 1;
      const ms = T.first + k * T.word;
      timers.current.push(
        window.setTimeout(
          () => flushSync(() => setState({ words: k + 1, done: last })),
          Math.max(0, ms - (performance.now() - t0)),
        ),
      );
    });
  }, []);

  useEffect(() => {
    if (autoplay) play(false);
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, [autoplay, play]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const answer = ANSWER.slice(0, state.words).join(" ");

  return (
    <div className="src-root" data-src="root">
      <div data-slot="message" data-align="end" className="src-message">
        <div data-slot="message-content" className="src-message-content">
          <div data-slot="bubble-content" className="src-bubble">
            {QUESTION}
          </div>
        </div>
      </div>
      {answer && (
        <div data-slot="message" className="src-message">
          <div data-slot="message-content" data-role="assistant" className="src-message-content" aria-live="polite">
            <p>{answer}</p>
            {state.done && <Sources key={run} sources={SOURCES} />}
          </div>
        </div>
      )}
      {state.done && (
        <button type="button" data-slot="button" data-src="replay" className="src-replay" onClick={() => play(true)}>
          Replay
        </button>
      )}
    </div>
  );
}

/**
 * Plays on mount. `?autoplay=0` starts on the finished thread instead (the capture then clicks Replay), and
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts and plays again.
 */
export default function SourcesClone() {
  const [run, setRun] = useState(0);
  const [autoplay] = useState(autoplayEnabled);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="src-stage">
      <SourcesDemo key={run} autoplay={autoplay || run > 0} />
    </div>
  );
}
