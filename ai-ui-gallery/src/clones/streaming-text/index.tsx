import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { BookOpen, Copy, Download, RotateCcw, SquareTerminal } from "lucide-react";
import { REPLY, buildTimeline, type TimedBlock, type Word } from "./reply";
import "./streaming.css";

/*
 * Streaming response text. The motion follows .reanimate/streaming-text/spec.md:
 * - after START_DELAY_MS the reply streams one word per animation frame once WORD_MS have passed (16 ms → 60/s at 60 Hz);
 * - every word fades in over 180 ms through a three-stop colour trail into ink (CSS keyframes, streaming.css);
 * - the source pill rides in with its word; the code card fades in (300 ms) while the stream holds CODE_HOLD_MS;
 * - when the last word lands, Replay rises in. Replay blurs the reply out (spring), resets and streams again.
 * An invisible copy of the whole reply shares the grid cell, so the box keeps its final height from the start.
 */
const WORD_MS = 16;
const START_DELAY_MS = 900;
const CODE_HOLD_MS = 100;
const LEAVE_MS = 430; // the blur-out settles, then the reply resets (the reference clears 436 ms after the click)
const EPS = 0.5; // frame times are floats; 6 × 16.667 must count as 100

const TIMELINE = buildTimeline(REPLY);

type Phase = "streaming" | "done" | "leaving";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export interface StreamingTextProps {
  /** Minimum time per word. Words still land on animation frames, so 16 ms means one word per frame at 60 Hz. */
  wordMs?: number;
  /** Pause between mount (or a replay) and the first word. */
  startDelayMs?: number;
}

export default function StreamingText({ wordMs = WORD_MS, startDelayMs = START_DELAY_MS }: StreamingTextProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>("streaming");
  const [run, setRun] = useState(0);
  const replayRef = useRef<HTMLButtonElement>(null);
  const focusReplay = useRef(false);
  const leaveTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  // The stream clock: one rAF loop per run, so a word can only land on a frame.
  useEffect(() => {
    const { total, holds } = TIMELINE;
    const t0 = performance.now();
    let n = 0;
    let last = 0;
    let raf = 0;
    const frame = (now: number) => {
      if (n === 0) {
        if (now - t0 < startDelayMs - EPS) {
          raf = requestAnimationFrame(frame);
          return;
        }
      } else {
        const hold = holds.has(n - 1) ? CODE_HOLD_MS : wordMs;
        if (now - last < hold - EPS) {
          raf = requestAnimationFrame(frame);
          return;
        }
      }
      n += 1;
      last = now;
      // Commit inside this frame, so the new word paints (and its fade starts) on the frame it was revealed.
      flushSync(() => {
        setShown(n);
        if (n >= total) setPhase("done");
      });
      if (n >= total) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [run, wordMs, startDelayMs]);

  // Keyboard users who pressed Replay get focus back on it when it returns.
  useEffect(() => {
    if (phase === "done" && focusReplay.current) {
      focusReplay.current = false;
      replayRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  const replay = useCallback(
    (fromKeyboard: boolean) => {
      if (phase !== "done") return;
      focusReplay.current = fromKeyboard;
      setPhase("leaving");
      leaveTimer.current = window.setTimeout(
        () => {
          setShown(0);
          setPhase("streaming");
          setRun((r) => r + 1);
        },
        reduced ? 0 : LEAVE_MS,
      );
    },
    [phase, reduced],
  );

  const streaming = phase === "streaming";
  const live = useMemo(() => renderReply(TIMELINE.blocks, shown, run), [shown, run]);
  const ghost = useMemo(() => renderReply(TIMELINE.blocks, Infinity, -1), []);

  return (
    <div className="stx" data-reduced={reduced || undefined}>
      <div className="stx-grid">
        {/* Reserves the final height so nothing below the reply moves while it streams. */}
        <div className="stx-layer stx-ghost" aria-hidden="true" inert>
          {ghost}
        </div>
        <div
          className={phase === "leaving" ? "stx-layer stx-live stx-leaving" : "stx-layer stx-live"}
          data-layer="live"
          aria-busy={streaming}
        >
          {live}
        </div>
      </div>
      <div className="stx-replay-row">
        {phase !== "streaming" && (
          <div className={phase === "leaving" ? "stx-replay stx-replay-out" : "stx-replay"} data-replay>
            <button
              ref={replayRef}
              type="button"
              className="stx-replay-btn"
              disabled={phase === "leaving"}
              onClick={(e) => replay(e.detail === 0)}
            >
              <RotateCcw aria-hidden="true" />
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- rendering ---------- */

/** Renders every block that has started by `shown` ticks. `run` < 0 renders the static ghost copy. */
function renderReply(blocks: TimedBlock[], shown: number, run: number): ReactNode {
  const ghost = run < 0;
  const words = (list: Word[]) => {
    const visible = list.filter((w) => w.tick < shown);
    return visible.map((w, i) => (
      <Fragment key={w.tick}>
        <span className={ghost ? undefined : "stx-w"} data-word={ghost ? undefined : ""}>
          {w.text}
        </span>
        {i < list.length - 1 ? " " : null}
      </Fragment>
    ));
  };

  return blocks
    .filter((b) => b.tick < shown)
    .map((b) => {
      const key = `${run}-${b.tick}`;
      switch (b.kind) {
        case "heading":
          return (
            <h4 key={key} className="stx-h">
              {words(b.words)}
            </h4>
          );
        case "paragraph":
          return (
            <p key={key} className="stx-p">
              {words(b.words)}
              {b.cite && b.cite.tick < shown && (
                <span className={ghost ? "stx-pill-slot" : "stx-pill-slot stx-w"} data-word={ghost ? undefined : ""}>
                  <button
                    type="button"
                    className="stx-pill"
                    tabIndex={ghost ? -1 : undefined}
                    aria-label={`${b.cite.sources.length} sources: ${b.cite.sources.join(", ")}`}
                  >
                    <span className="stx-pill-mark" aria-hidden="true">
                      <BookOpen />
                    </span>
                    <span className="stx-pill-label">{b.cite.label}</span>
                    <span className="stx-pill-more">+{b.cite.more}</span>
                  </button>
                </span>
              )}
            </p>
          );
        case "list":
          return (
            <ul key={key} className="stx-ul">
              {b.items
                .filter((it) => it.tick < shown)
                .map((it) => (
                  <li key={it.tick}>
                    <strong>{words(it.lead)}</strong>
                    {it.words[0].tick < shown ? " " : null}
                    {words(it.words)}
                  </li>
                ))}
            </ul>
          );
        case "code":
          return <CodeCard key={key} label={b.label} code={b.code} ghost={ghost} />;
      }
    });
}

function CodeCard({ label, code, ghost }: { label: string; code: string; ghost: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      },
      () => {},
    );
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([code + "\n"], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${label}.sh` });
    a.click();
    URL.revokeObjectURL(url);
  };
  const tab = ghost ? -1 : undefined;
  return (
    <figure className={ghost ? "stx-card" : "stx-card stx-card-in"} data-block={ghost ? undefined : "code"}>
      <figcaption className="stx-card-head">
        <SquareTerminal className="stx-card-icon" aria-hidden="true" />
        <span className="stx-card-label">{label}</span>
        <span className="stx-card-tools">
          <button type="button" className="stx-icon-btn" aria-label={`Download ${label}`} tabIndex={tab} onClick={download}>
            <Download aria-hidden="true" />
          </button>
          <button type="button" className="stx-icon-btn" aria-label={copied ? "Copied" : `Copy ${label}`} tabIndex={tab} onClick={copy}>
            <Copy aria-hidden="true" />
          </button>
        </span>
      </figcaption>
      <pre className="stx-code">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
