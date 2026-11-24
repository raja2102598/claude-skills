import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowUp, AudioLines, Check, Mic, Plus, X } from "lucide-react";
import "./prompt-mini.css";

/*
 * A phone composer: a one-line pill that opens into a card for an attachment, a voice note and a model chip, then
 * folds back into the pill on send. Timings are measured from the reference video (.reanimate/prompt-mini/spec.md);
 * demo time T = video time − 400 ms. Heights run on a motion value (JS frame loop); every opacity/transform change is a
 * CSS transition or keyframe, so both behave the same on a real and a virtual clock.
 */
const EXPO_MS = 215; // ease-out-expo: remaining = 2^(−10 t / 215 ms)
const expoOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
const DEMO = {
  expand: 2484,
  ring: [
    [2878, 0.35],
    [3280, 0.65],
    [3765, 1],
  ] as const,
  image: 2910,
  settle: 4005,
  press: 4385,
  record: 4640,
  bar0: 4742,
  barStep: 1000 / 12,
  ticks: [5660, 6675],
  transcript: 6925,
  send: 8454,
  done: 10675,
  loop: 12280,
};
const COLS = 36;
const LEVELS = [16, 17, 15, 11, 11, 15, 20, 23, 20, 14, 10, 8]; // px, the twelve bars of the reference note
const TRANSCRIPT = "Find a quiet trail near this lake for a sunrise hike";
const EFFORTS = ["Medium", "High", "Low"];

type Mode = "pill" | "compose" | "record";
type Attachment = { id: number; progress: number; loaded: boolean; settled: boolean };
type State = {
  mode: Mode;
  running: boolean;
  attach: Attachment | null;
  leaving: Attachment | null;
  pressed: boolean;
  text: string;
  bars: number[];
  barCount: number;
  secs: number;
  fade: number; // ms for the cross-fades this change starts (0 = cut)
  effort: number;
};

const initial = (): State => ({
  mode: "pill",
  running: false,
  attach: null,
  leaving: null,
  pressed: false,
  text: "",
  bars: Array(COLS).fill(0),
  barCount: 0,
  secs: 0,
  fade: 0,
  effort: 0,
});

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

/** Our own artwork for the attached photo: a lake under a dusk sky. */
function Landscape() {
  return (
    <svg className="pm-art" viewBox="0 0 58 58" width="58" height="58" aria-hidden>
      <defs>
        <linearGradient id="pm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d7fd8" />
          <stop offset="0.55" stopColor="#c99bd0" />
          <stop offset="1" stopColor="#f6c49a" />
        </linearGradient>
        <linearGradient id="pm-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f5fc2" />
          <stop offset="1" stopColor="#1d2a66" />
        </linearGradient>
      </defs>
      <rect width="58" height="58" fill="url(#pm-sky)" />
      <circle cx="40" cy="20" r="5" fill="#ffe2b8" opacity="0.9" />
      <path d="M0 33 L11 19 L19 27 L28 14 L41 30 L49 23 L58 31 L58 40 L0 40 Z" fill="#4a4a86" />
      <path d="M0 37 L9 30 L18 35 L26 28 L37 36 L47 31 L58 37 L58 42 L0 42 Z" fill="#2e3166" />
      <rect y="40" width="58" height="18" fill="url(#pm-lake)" />
      <path d="M33 45 h14 M37 49 h9 M30 53 h12" stroke="#9fb3ff" strokeWidth="1" opacity="0.55" />
      <path d="M0 58 L0 46 Q8 43 14 47 Q20 51 24 58 Z" fill="#c7b59a" />
      <path d="M0 58 L0 50 Q7 48 11 52 Q14 55 15 58 Z" fill="#8f7b62" />
    </svg>
  );
}

function Tile({ a, className, onRemove, onEnd }: { a: Attachment; className: string; onRemove?: () => void; onEnd?: () => void }) {
  return (
    <div className={`pm-tile ${className}`} onAnimationEnd={onEnd}>
      {a.loaded && <Landscape />}
      <div className="pm-veil" data-blank={!a.loaded} style={{ opacity: a.settled ? 0 : 1 }} />
      <svg className="pm-ring" viewBox="0 0 58 58" style={{ opacity: a.settled ? 0 : 1 }} aria-hidden>
        <circle cx="29" cy="29" r="10.7" stroke="rgba(255,255,255,0.28)" />
        <circle
          className="pm-arc"
          cx="29"
          cy="29"
          r="10.7"
          pathLength={100}
          strokeDasharray="100 100"
          strokeDashoffset={100 - a.progress * 100}
          transform="rotate(-90 29 29)"
        />
      </svg>
      {onRemove && (
        <button type="button" className="pm-badge" aria-label="Remove photo" onClick={onRemove}>
          <X />
        </button>
      )}
    </div>
  );
}

export default function PromptMini() {
  const reduce = useReducedMotion();
  const [s, setS] = useState<State>(initial);
  const patch = useCallback((p: Partial<State> | ((cur: State) => Partial<State>)) => {
    setS((cur) => ({ ...cur, ...(typeof p === "function" ? p(cur) : p) }));
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const height = useMotionValue(57);
  const target = useRef<number | null>(null);
  const demo = useRef<{ on: boolean; raf: number }>({ on: autoplayEnabled(), raf: 0 });
  const timers = useRef<number[]>([]);
  const voice = useRef<number[]>([]);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const stopVoice = useCallback(() => {
    voice.current.forEach((id) => window.clearInterval(id));
    voice.current = [];
  }, []);
  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      stopVoice();
    },
    [stopVoice],
  );

  // The card's height follows its content: measured after every commit, tweened with the reference's expo ease-out.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const next = el.offsetHeight + 2;
    if (next === target.current) return;
    const first = target.current === null;
    target.current = next;
    if (first || reduce) return void height.jump(next);
    const controls = animate(height, next, { duration: EXPO_MS / 1000, ease: expoOut });
    return () => controls.stop();
  });

  // ---------- the scripted demo: one rAF clock, so every run (and a virtual-clock capture) is identical ----------
  useEffect(() => {
    if (!demo.current.on) return;
    const steps: { at: number; run: () => void }[] = [
      { at: 0, run: () => setS(initial()) },
      { at: DEMO.expand, run: () => patch({ mode: "compose", fade: 0, attach: { id: 1, progress: 0.08, loaded: false, settled: false } }) },
      ...DEMO.ring.map(([at, progress]) => ({
        at,
        run: () => patch((c) => ({ attach: c.attach && { ...c.attach, progress } })),
      })),
      { at: DEMO.image, run: () => patch((c) => ({ attach: c.attach && { ...c.attach, loaded: true } })) },
      { at: DEMO.settle, run: () => patch((c) => ({ attach: c.attach && { ...c.attach, settled: true } })) },
      { at: DEMO.press, run: () => patch({ pressed: true }) },
      { at: DEMO.record, run: () => patch({ mode: "record", fade: 200, secs: 0, bars: Array(COLS).fill(0), barCount: 0 }) },
      ...LEVELS.map((lv, k) => ({
        at: DEMO.bar0 + k * DEMO.barStep,
        run: () => patch((c) => ({ bars: [...c.bars.slice(1), lv], barCount: c.barCount + 1 })),
      })),
      ...DEMO.ticks.map((at, k) => ({ at, run: () => patch({ secs: k + 1 }) })),
      { at: DEMO.transcript, run: () => patch({ mode: "compose", fade: 200, pressed: false, text: TRANSCRIPT }) },
      {
        at: DEMO.send,
        run: () => patch((c) => ({ mode: "pill", fade: 0, running: true, leaving: c.attach, attach: null, text: "" })),
      },
      { at: DEMO.done, run: () => patch({ running: false, fade: 150 }) },
    ].sort((a, b) => a.at - b.at);
    let t0 = performance.now();
    let i = 0;
    const tick = (now: number) => {
      if (now - t0 >= DEMO.loop) {
        t0 += DEMO.loop * Math.floor((now - t0) / DEMO.loop);
        i = 0;
      }
      const t = now - t0;
      while (i < steps.length && t >= steps[i].at) {
        const step = steps[i++];
        flushSync(step.run); // commit in this frame; a scheduled render can land a frame late
      }
      demo.current.raf = requestAnimationFrame(tick);
    };
    demo.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(demo.current.raf);
  }, [patch]);

  // ---------- real interaction (any pointer or key input ends the demo) ----------
  const startVoice = useCallback(() => {
    stopVoice();
    let k = 0;
    voice.current.push(
      window.setInterval(() => {
        const lv = Math.max(6, Math.round(LEVELS[k % LEVELS.length] * (0.75 + 0.5 * Math.abs(Math.sin(k * 1.7)))));
        k += 1;
        patch((c) => (c.mode === "record" ? { bars: [...c.bars.slice(1), lv], barCount: c.barCount + 1 } : {}));
      }, DEMO.barStep),
      window.setInterval(() => patch((c) => (c.mode === "record" ? { secs: c.secs + 1 } : {})), 1000),
    );
  }, [patch, stopVoice]);

  const upload = useCallback(
    (id: number) => {
      const set = (p: Partial<Attachment>) => patch((c) => (c.attach?.id === id ? { attach: { ...c.attach, ...p } } : {}));
      later(400, () => set({ progress: 0.35, loaded: true }));
      later(800, () => set({ progress: 0.65 }));
      later(1250, () => set({ progress: 1 }));
      later(1500, () => set({ settled: true }));
    },
    [later, patch],
  );

  const takeOver = useCallback(
    (e: { isTrusted: boolean }) => {
      if (!e.isTrusted || !demo.current.on) return;
      demo.current.on = false;
      cancelAnimationFrame(demo.current.raf);
      // Finish whatever the script left half-way.
      if (s.attach && !s.attach.settled) upload(s.attach.id);
      if (s.mode === "record") startVoice();
      if (s.running) later(1500, () => patch({ running: false, fade: 150 }));
    },
    [s, upload, startVoice, later, patch],
  );

  const expand = () => {
    if (s.mode !== "pill") return;
    patch({ mode: "compose", fade: 0 });
    requestAnimationFrame(() => textRef.current?.focus());
  };
  const addPhoto = () => {
    if (s.attach) return expand();
    const id = Date.now();
    patch({ mode: s.mode === "record" ? "record" : "compose", fade: 0, attach: { id, progress: 0.08, loaded: false, settled: false } });
    upload(id);
  };
  const record = () => {
    patch({ mode: "record", fade: 200, pressed: true, secs: 0, bars: Array(COLS).fill(0), barCount: 0 });
    startVoice();
  };
  const endRecord = (keep: boolean) => {
    stopVoice();
    patch((c) => ({
      mode: "compose",
      fade: 200,
      pressed: false,
      text: keep ? (c.text ? `${c.text} ${TRANSCRIPT}` : TRANSCRIPT) : c.text,
    }));
  };
  const ready = s.text.trim().length > 0 || (s.attach !== null && s.attach.progress >= 1);
  const send = () => {
    if (!ready) return;
    textRef.current?.blur();
    patch((c) => ({ mode: "pill", fade: 0, running: true, leaving: c.attach, attach: null, text: "" }));
    later(2200, () => patch((c) => (c.running ? { running: false, fade: 150 } : {})));
  };
  const onPrimary = () => {
    if (s.mode === "record") return endRecord(true);
    if (s.mode === "compose") return send();
    if (s.running) return patch({ running: false, fade: 150 });
    record();
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  const collapseIfEmpty = (e: { target: EventTarget; currentTarget: EventTarget }) => {
    if (e.target === e.currentTarget && s.mode === "compose" && !s.text.trim() && !s.attach) patch({ mode: "pill", fade: 0 });
  };

  const icon = s.mode === "record" ? "check" : s.mode === "compose" ? "arrow" : s.running ? "stop" : "voice";
  const fadeStyle = { transitionDuration: `${reduce ? 0 : s.fade}ms` };
  const show = (on: boolean) => ({ ...fadeStyle, opacity: on ? 1 : 0 });
  const micScale = s.pressed || s.mode === "record";
  const micStyle = {
    transform: micScale ? "scale(0.9)" : "none",
    transition: reduce ? "none" : micScale ? "transform 150ms ease" : "transform 200ms ease-out",
  };
  const primaryLabel = { check: "Use voice note", arrow: "Send", stop: "Stop reply", voice: "Talk" }[icon];

  return (
    <div className="pm-root" onPointerDownCapture={takeOver} onKeyDownCapture={takeOver} onClick={collapseIfEmpty}>
      <motion.div className={`pm-card ${s.mode === "pill" ? "pm-pill" : ""}`} style={{ height }} data-mode={s.mode}>
        {s.leaving && (
          <Tile
            key={`out-${s.leaving.id}`}
            a={s.leaving}
            className="pm-tile-out"
            onEnd={() => patch({ leaving: null })}
          />
        )}
        <div className="pm-content" ref={contentRef}>
          {s.mode !== "pill" && (
            <>
              {s.attach && (
                <div className="pm-attach">
                  <Tile key={s.attach.id} a={s.attach} className="pm-tile-in" onRemove={() => patch({ attach: null })} />
                </div>
              )}
              <div className="pm-zone">
                <div className="pm-layer pm-text" style={show(s.mode === "compose")}>
                  <div className="pm-mirror" aria-hidden>
                    {s.text || " "}
                    {"​"}
                  </div>
                  <textarea
                    ref={textRef}
                    rows={1}
                    value={s.text}
                    placeholder="Ask Nova anything"
                    aria-label="Message"
                    onChange={(e) => patch({ text: e.target.value })}
                    onKeyDown={onKey}
                    disabled={s.mode === "record"}
                  />
                </div>
                <div className="pm-layer pm-voice" style={show(s.mode === "record")} aria-hidden={s.mode !== "record"}>
                  <span className="pm-dot" key={`dot-${s.mode}`} />
                  <span className="pm-time">0:{String(s.secs).padStart(2, "0")}</span>
                  <span className="pm-wave">
                    {s.bars.map((h, k) => (
                      <i
                        key={k === COLS - 1 && h ? `new-${s.barCount}` : k}
                        className={k === COLS - 1 && h ? "pm-new" : undefined}
                        style={h ? { height: h } : undefined}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="pm-row">
            {s.mode === "record" ? (
              <button type="button" className="pm-btn pm-btn-x" aria-label="Discard voice note" onClick={() => endRecord(false)}>
                <X />
              </button>
            ) : (
              <button type="button" className="pm-btn" aria-label="Add photo" onClick={addPhoto}>
                <Plus />
              </button>
            )}
            {s.mode === "pill" && (
              <input
                className="pm-pill-input"
                placeholder="Write or hold to speak"
                aria-label="Message"
                readOnly
                onFocus={expand}
                onClick={expand}
              />
            )}
            {s.mode === "compose" && (
              <button type="button" className="pm-chip" onClick={() => patch((c) => ({ effort: (c.effort + 1) % EFFORTS.length }))}>
                Nova 2<em>{EFFORTS[s.effort]}</em>
              </button>
            )}
            {!(s.mode === "pill" && s.running) && (
              <button
                type="button"
                className="pm-btn pm-mic"
                data-rec={s.mode === "record"}
                style={micStyle}
                aria-label="Hold to talk"
                onPointerDown={() => s.mode !== "record" && patch({ pressed: true })}
                onPointerLeave={() => s.mode !== "record" && s.pressed && patch({ pressed: false })}
                onClick={() => (s.mode === "record" ? undefined : record())}
              >
                <Mic />
              </button>
            )}
            {s.mode === "pill" && s.running && <span className="pm-mic" />}
            <button
              type="button"
              className="pm-btn pm-primary"
              data-dim={s.mode === "compose" && !ready}
              aria-label={primaryLabel}
              onClick={onPrimary}
            >
              <span style={show(icon === "voice")}>
                <AudioLines />
              </span>
              <span style={show(icon === "stop")}>
                <i className="pm-stop" />
              </span>
              <span style={show(icon === "arrow")}>
                <ArrowUp />
              </span>
              <span style={show(icon === "check")}>
                <Check />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
