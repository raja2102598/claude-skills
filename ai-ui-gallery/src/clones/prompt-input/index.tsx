import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  Bug,
  ChevronDown,
  Copy,
  FileText,
  Globe,
  Lightbulb,
  Mail,
  Mic,
  Plus,
  RotateCcw,
  Sparkle,
  SquarePen,
} from "lucide-react";
import "./prompt-input.css";

/*
 * Motion constants, all measured from the reference trace (.reanimate/prompt-input/spec.md).
 * t = 0 is the click on Send.
 */
const DOCK_TOP_NEW = 294.4; // centred group: greeting 239.6, dock 294.4, suggestions 406.4 (card padding box)
const DOCK_TOP_THREAD = 558; // foot of the thread, 24px above the card's bottom edge
const GLIDE = { type: "spring", stiffness: 300, damping: 35, mass: 1 } as const; // critically damped, ω ≈ 17.5/s
const MORPH = { type: "spring", stiffness: 550, damping: 47, mass: 1 } as const; // critically damped, ω ≈ 23.5/s
const THINK_END_MS = 680;
const CHUNK_AT_MS = [700, 750, 800, 850, 900, 950, 1000, 1033];
const DONE_MS = 1045;
const ARC_START = 0.1; // the ring shows a 10% stub while thinking
const ARC_VMAX = 2.25; // per second, reached after ARC_RAMP_S
const ARC_RAMP_S = 0.18;

const PROMPT = "Summarize the latest sales report";
const REPLY = [
  "Here's the short version: revenue ",
  "rose 12% on the quarter, ",
  "led by the north region, while ",
  "returns held flat. Two gaps stand ",
  "out: churn in small accounts ",
  "and a slow March. Attach ",
  "the full report with the plus ",
  "button and I can break it down by team.",
];
const REPLY_CHARS = REPLY.join("").length;
const SUGGESTIONS = [
  { icon: FileText, label: "Outline the Q3 planning doc", prompt: "Outline the Q3 planning doc for the leads meeting" },
  { icon: Mail, label: "Reply to the vendor email", prompt: "Draft a friendly reply to the vendor email about pricing" },
  { icon: Bug, label: "Debug the failing upload", prompt: "Help me debug why the file upload test fails on CI" },
];

type Turn = { prompt: string; chunks: number; pending: boolean; done: boolean };

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

export default function PromptComposer() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"new" | "thread">("new");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [tools, setTools] = useState({ search: false, think: false });
  const [growH, setGrowH] = useState(26);

  const dockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const dockY = useMotionValue(0);
  const flipFrom = useRef<number | null>(null);
  const run = useRef<{ raf: number; stop: boolean } | null>(null);
  const demo = useRef<{ timers: number[]; on: boolean }>({ timers: [], on: autoplayEnabled() });

  const setArc = (frac: number) => arcRef.current?.setAttribute("stroke-dashoffset", String(1 - frac));

  // The reply: a simulated stream on one rAF clock, so the sequence is the same on every run and under a virtual clock.
  const startStream = useCallback(() => {
    if (run.current) cancelAnimationFrame(run.current.raf);
    const state = { raf: 0, stop: false };
    run.current = state;
    const t0 = performance.now();
    let last = t0;
    let arc = ARC_START;
    let v = 0;
    let shownChunks = 0;
    let pending = true;
    setArc(ARC_START);
    const tick = (now: number) => {
      const t = now - t0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const stopped = state.stop;
      const chunks = stopped ? shownChunks : CHUNK_AT_MS.filter((at) => t >= at).length;
      const nextPending = !stopped && t < THINK_END_MS;
      const done = stopped || t >= DONE_MS;
      if (chunks !== shownChunks || nextPending !== pending || done) {
        shownChunks = chunks;
        pending = nextPending;
        setTurn((cur) => (cur ? { ...cur, chunks, pending, done } : cur));
      }
      // Arc: chases the reply's progress at a capped speed (it accelerates for ~180 ms, then runs at ~2.2/s).
      const revealed = REPLY.slice(0, chunks).join("").length;
      const target = done ? 1 : ARC_START + (1 - ARC_START) * (revealed / REPLY_CHARS);
      if (arc < target) {
        v = Math.min(ARC_VMAX, v + (ARC_VMAX / ARC_RAMP_S) * dt);
        arc = Math.min(target, arc + v * dt);
      } else v = 0;
      setArc(arc);
      if (done) {
        setBusy(false);
        run.current = null;
        return;
      }
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
  }, []);

  const send = useCallback(
    (value?: string) => {
      const prompt = (value ?? text).trim();
      if (!prompt || busy) return;
      flipFrom.current = dockRef.current?.getBoundingClientRect().top ?? null;
      setMode("thread");
      setTurn({ prompt, chunks: 0, pending: true, done: false });
      setText("");
      setGrowH(26);
      setBusy(true);
      startStream();
    },
    [text, busy, startStream],
  );

  const stop = () => {
    if (run.current) run.current.stop = true;
  };

  const reset = useCallback(() => {
    if (run.current) cancelAnimationFrame(run.current.raf);
    run.current = null;
    dockY.jump(0);
    setBusy(false);
    setTurn(null);
    setMode("new");
  }, [dockY]);

  // FLIP: the dock is laid out at its new top in the same commit; play the move back from the old top.
  useLayoutEffect(() => {
    if (flipFrom.current === null || !dockRef.current) return;
    const delta = flipFrom.current - dockRef.current.getBoundingClientRect().top;
    flipFrom.current = null;
    if (!delta) return;
    if (reduce) return void dockY.jump(0);
    dockY.jump(delta);
    const controls = animate(dockY, 0, GLIDE);
    return () => controls.stop();
  }, [mode, dockY, reduce]);

  // The reply body animates its height to the content (one line at a time), so a new line stays clipped until it opens.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setGrowH(Math.max(26, el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [turn !== null]);

  const sendRef = useRef(send);
  sendRef.current = send;

  // Gallery autoplay: type the prompt, send, read the reply, start a new chat, repeat. Any real input ends it.
  useEffect(() => {
    const d = demo.current;
    if (!d.on) return;
    const later = (ms: number, fn: () => void) => d.timers.push(window.setTimeout(fn, ms));
    const play = () => {
      later(700, () => {
        PROMPT.split("").forEach((_, i) => later(i * 38, () => setText(PROMPT.slice(0, i + 1))));
        later(PROMPT.length * 38 + 450, () => {
          sendRef.current(PROMPT);
          later(4200, () => {
            reset();
            play();
          });
        });
      });
    };
    play();
    return () => {
      d.timers.forEach(clearTimeout);
      d.timers = [];
    };
  }, [reset]);
  const endDemo = () => {
    const d = demo.current;
    if (!d.on) return;
    d.on = false;
    d.timers.forEach(clearTimeout);
    d.timers = [];
  };

  useEffect(() => () => {
    if (run.current) cancelAnimationFrame(run.current.raf);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const sendState = busy ? "busy" : text.trim() ? "ready" : "empty";
  const reply = turn ? REPLY.slice(0, turn.chunks) : [];

  return (
    <div className="pi-root" onPointerDownCapture={endDemo} onKeyDownCapture={endDemo}>
      <div className="pi-card" data-pi-card>
        {mode === "new" ? (
          <>
            <h2 className="pi-greeting" data-pi-intro>
              Where should we start today?
            </h2>
            <ul className="pi-suggestions" data-pi-suggestions aria-label="Suggestions">
              {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="pi-suggestion"
                    onClick={() => {
                      setText(prompt);
                      inputRef.current?.focus();
                    }}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <button type="button" className="pi-topbar" data-pi-topbar aria-label="New chat" onClick={reset}>
              <SquarePen size={17} strokeWidth={1.75} aria-hidden />
            </button>
            <div className="pi-thread" data-pi-thread>
              {turn && (
                <div>
                  <div className="pi-sent">
                    <p className="pi-bubble" data-pi-bubble>
                      {turn.prompt}
                    </p>
                  </div>
                  <div className="pi-reply">
                    <div className="pi-head" data-pi-replyhead>
                      <Sparkle size={16} strokeWidth={1.75} className="pi-mark" fill="currentColor" aria-hidden />
                      <span>Nova 2</span>
                    </div>
                    <div className="pi-grow" data-pi-grow style={{ height: growH }}>
                      <div ref={innerRef}>
                        {turn.pending ? (
                          <span className="pi-pending" data-pi-pending>
                            Thinking
                          </span>
                        ) : reply.length ? (
                          <p className="pi-text">
                            {reply.map((c, i) => (
                              <span key={i} className={reduce ? undefined : "pi-chunk"}>
                                {c}
                              </span>
                            ))}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {turn.done && (
                      <div className="pi-foot" data-pi-foot>
                        <button type="button" aria-label="Copy reply">
                          <Copy size={15} strokeWidth={1.75} aria-hidden />
                        </button>
                        <button type="button" onClick={() => send(turn.prompt)}>
                          <RotateCcw size={15} strokeWidth={1.75} aria-hidden />
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <motion.div
          ref={dockRef}
          className="pi-dock"
          data-pi-dock
          style={{ top: mode === "new" ? DOCK_TOP_NEW : DOCK_TOP_THREAD, y: dockY }}
        >
          <div className="pi-surface" data-pi-surface>
            <textarea
              ref={inputRef}
              data-pi-input
              className="pi-input"
              rows={1}
              value={text}
              placeholder="Message Nova, / for commands, @ for files"
              aria-label="Message"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <div className="pi-toolbar">
              <div className="pi-group">
                <button type="button" className="pi-icon" aria-label="Add files and context">
                  <Plus size={18} strokeWidth={1.75} aria-hidden />
                </button>
                <button
                  type="button"
                  className="pi-chip"
                  aria-pressed={tools.search}
                  onClick={() => setTools((s) => ({ ...s, search: !s.search }))}
                >
                  <Globe size={16} strokeWidth={1.75} aria-hidden />
                  Search the web
                </button>
                <button
                  type="button"
                  className="pi-chip"
                  aria-pressed={tools.think}
                  onClick={() => setTools((s) => ({ ...s, think: !s.think }))}
                >
                  <Lightbulb size={16} strokeWidth={1.75} aria-hidden />
                  Think it through
                </button>
              </div>
              <div className="pi-group">
                <button type="button" className="pi-model" aria-label="Model: Nova 2, balanced effort">
                  <Sparkle size={16} strokeWidth={1.75} className="pi-mark" fill="currentColor" aria-hidden />
                  <b>Nova 2</b>
                  <span>Balanced</span>
                  <ChevronDown size={14} strokeWidth={1.75} aria-hidden />
                </button>
                <button type="button" className="pi-icon" aria-label="Dictate" data-dim={busy} disabled={busy}>
                  <Mic size={18} strokeWidth={1.75} aria-hidden />
                </button>
                <button
                  type="button"
                  className="pi-send"
                  data-pi-send
                  data-state={sendState}
                  aria-label={busy ? "Stop generating" : "Send message"}
                  aria-disabled={sendState === "empty"}
                  onClick={() => (busy ? stop() : send())}
                >
                  <svg className="pi-ring" viewBox="0 0 40 40" aria-hidden>
                    <circle className="pi-track" cx="20" cy="20" r="18.5" />
                    <circle
                      ref={arcRef}
                      className="pi-arc"
                      cx="20"
                      cy="20"
                      r="18.5"
                      pathLength={1}
                      strokeDasharray="1 1"
                      strokeDashoffset={1 - ARC_START}
                    />
                  </svg>
                  <AnimatePresence initial={false}>
                    {busy ? (
                      <motion.span
                        key="stop"
                        className="pi-glyph"
                        data-pi-glyph="stop"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { scale: MORPH, opacity: { duration: 0.07, ease: "linear" } } }}
                        exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.016 } }}
                      >
                        <span className="pi-stop" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="arrow"
                        className="pi-glyph"
                        data-pi-glyph="arrow"
                        initial={{ y: 2.5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { y: MORPH, opacity: { duration: 0.03, ease: "linear" } } }}
                        exit={{
                          y: -8,
                          opacity: 0,
                          transition: { y: { duration: 0.16, ease: [0.7, 0, 0.84, 0] }, opacity: { duration: 0.02 } },
                        }}
                      >
                        <ArrowUp size={18} strokeWidth={2} aria-hidden />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="pi-sr" role="status">
          {busy ? (turn?.pending ? "Thinking" : "Writing reply") : turn?.done ? "Reply finished" : ""}
        </p>
      </div>
    </div>
  );
}
