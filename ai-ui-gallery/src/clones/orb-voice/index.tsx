import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { animate, useMotionValue, motion } from "motion/react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { createOrbRenderer, type OrbPalette } from "./orb-gl";
import {
  LEVEL_ATTACK,
  LEVEL_RELEASE,
  MUTED_SHAPE,
  SHAPES,
  SHAPE_KEYS,
  SHAPE_SPRING,
  TIMING,
  TURNS,
  easeOutExpoLike,
  syntheticLevel,
  wordGapMs,
  type OrbShape,
  type VoiceState,
} from "./voice-model";
import "./orb-voice.css";

/* Palette (our own): indigo ink, violet bloom, apricot pearl. */
const PALETTE: OrbPalette = {
  ink: [0.153, 0.137, 0.361],
  bloom: [0.427, 0.353, 0.902],
  pearl: [1.0, 0.86, 0.78],
};
const ORB_PX = 200;

const STATUS: Record<VoiceState, string> = { idle: "Ready", listening: "Listening", thinking: "Thinking", speaking: "Speaking" };
const ORB_LABEL: Record<VoiceState, string> = {
  idle: "Start voice chat",
  listening: "Send now",
  thinking: "Cancel and keep talking",
  speaking: "Interrupt",
};
const HINT = "Tap the orb and ask about your trip.";

/* Critically damped springs (bounce 0), sampled into CSS linear() so they run the same on any clock. */
function springLinear(visualDuration: number, points = 24) {
  const w = (2 * Math.PI) / (visualDuration * 1.2);
  const end = 9.2 / w; // 99.9 % settled
  const stops: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * end;
    const v = i === points ? 1 : 1 - (1 + w * t) * Math.exp(-w * t);
    stops.push(v.toFixed(4));
  }
  return { easing: `linear(${stops.join(", ")})`, ms: Math.round(end * 1000) };
}
const SMOOTH = springLinear(0.3);
const SNAPPY = springLinear(0.2);
const TOKENS = {
  "--ov-smooth": SMOOTH.easing,
  "--ov-smooth-ms": `${SMOOTH.ms}ms`,
  "--ov-snappy": SNAPPY.easing,
  "--ov-snappy-ms": `${SNAPPY.ms}ms`,
} as CSSProperties;

type LevelSource = "demo" | "microphone";

/* ------------------------------------------------------------------------------------------------ */
/* Orb                                                                                              */
/* ------------------------------------------------------------------------------------------------ */

interface OrbFeed {
  state: VoiceState;
  muted: boolean;
  /** performance.now() when the chat started: the demo voice runs from there */
  chatStart: number;
  /** microphone level 0..1 when the real microphone is on */
  mic: number | null;
  /** bumped each time the assistant speaks a word */
  spokenWords: number;
}

function VoiceOrb({ feed, label, onClick, disabled }: { feed: React.RefObject<OrbFeed>; label: string; onClick: () => void; disabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createOrbRenderer(canvas, PALETTE);
    if (!renderer) {
      setFallback(true);
      return;
    }
    renderer.resize(ORB_PX);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The orb has been idling since the page opened: start every accumulator at its idle value.
    let last = performance.now();
    let clock = last / 1000;
    const shape: OrbShape = { ...SHAPES.idle };
    const vel = Object.fromEntries(SHAPE_KEYS.map((k) => [k, 0])) as Record<keyof OrbShape, number>;
    let level = 0;
    let flow = SHAPES.idle.flow * clock;
    let twist = SHAPES.idle.swirl * clock;
    let ringPhase = (0.42 * clock) % 1;
    let sheenAngle = -2.3 * clock;
    // Spoken-word pulse: kicks to 0.95 on each word and eases to 0.12 in 320 ms.
    let pulseWords = 0;
    let pulseStart: number | null = null;
    let spoken = 0;
    let raf = 0;

    const frame = (now: number) => {
      const f = feed.current!;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const target = f.state === "listening" && f.muted ? MUTED_SHAPE : SHAPES[f.state];
      for (const k of SHAPE_KEYS) {
        vel[k] += (SHAPE_SPRING.stiffness * (target[k] - shape[k]) - SHAPE_SPRING.damping * vel[k]) * dt;
        shape[k] += vel[k] * dt;
      }

      if (f.spokenWords !== pulseWords) {
        pulseWords = f.spokenWords;
        pulseStart = f.spokenWords > 0 ? now : pulseStart;
      }
      if (pulseStart !== null) {
        const { from, to, ms } = TIMING.spokenPulse;
        spoken = from + (to - from) * easeOutExpoLike((now - pulseStart) / ms);
      }

      let raw = 0;
      if (f.state === "listening" && !f.muted) raw = f.mic ?? 0.8 * syntheticLevel((now - f.chatStart) / 1000, 3);
      else if (f.state === "speaking") raw = spoken;
      raw = Math.min(1, Math.max(0, raw));
      level += (raw - level) * (1 - Math.exp(-dt * (raw > level ? LEVEL_ATTACK : LEVEL_RELEASE)));

      flow += dt * (shape.flow + level * shape.gain * 3);
      twist += dt * shape.swirl;
      ringPhase = (ringPhase + dt * (0.42 + 0.5 * level)) % 1;
      sheenAngle -= 2.3 * dt;

      const still = reduce.matches;
      const u = level * shape.gain;
      renderer.draw({
        flow: still ? 1.2 : flow,
        twist: still ? 0.6 : twist,
        radius: 1 + shape.grow + (still ? 0 : shape.breath * Math.sin(1.25 * clock)) + 0.9 * u,
        wobble: shape.wobble,
        voice: 2.6 * u,
        rings: shape.rings * (0.35 + 0.9 * level),
        ringPhase: still ? 0.35 : ringPhase,
        sheen: shape.sheen,
        sheenAngle: still ? 2.2 : sheenAngle,
        glow: shape.glow * (0.2 + 1.6 * u) + 0.08 * shape.sheen,
        mute: shape.mute,
        lift: 2.2 * u,
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, [feed]);

  return (
    <button type="button" className="ov-orb" aria-label={label} onClick={onClick} disabled={disabled}>
      <canvas ref={canvasRef} className="ov-canvas" role="img" aria-hidden="true" style={{ display: fallback ? "none" : undefined }} />
      {fallback && <span className="ov-fallback" aria-hidden="true" />}
    </button>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Text with enter / exit                                                                           */
/* ------------------------------------------------------------------------------------------------ */

/** A keyed label that crossfades: the old one pops out of layout and leaves in 100 ms. */
function SwapLabel({ text, className }: { text: string; className: string }) {
  const [items, setItems] = useState([{ text, key: 0, mode: "rest" as "rest" | "in" | "out" }]);
  const prev = useRef(text);
  useLayoutEffect(() => {
    if (prev.current === text) return;
    prev.current = text;
    setItems((list) => {
      const key = list[list.length - 1].key + 1;
      return [...list.filter((i) => i.mode !== "out").map((i) => ({ ...i, mode: "out" as const })), { text, key, mode: "in" as const }];
    });
  }, [text]);
  return (
    <>
      {items.map((i) => (
        <span
          key={i.key}
          className={`${className} ${i.mode === "in" ? "ov-swap-in" : i.mode === "out" ? "ov-swap-out" : ""}`}
          aria-hidden={i.mode === "out" || undefined}
          onAnimationEnd={(e) => {
            if (i.mode === "out" && e.target === e.currentTarget) setItems((list) => list.filter((x) => x.key !== i.key));
          }}
        >
          {i.text}
        </span>
      ))}
    </>
  );
}

interface LineSpec {
  key: string;
  text: string;
  speaker: "user" | "assistant" | "system";
}

/** One transcript line. Words fade up as they arrive; when the line grows, it rises into place. */
function Line({ spec, mode, onExited }: { spec: LineSpec; mode: "rest" | "in" | "out"; onExited: () => void }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const height = useRef<number | null>(null);
  const [rise, setRise] = useState<{ px: number; n: number }>({ px: 0, n: 0 });
  const words = spec.text ? spec.text.split(/\s+/) : [];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || mode === "out") return;
    const h = el.offsetHeight;
    if (height.current !== null && h !== height.current) {
      const grew = h - height.current;
      setRise((r) => ({ px: grew, n: r.n + 1 }));
    }
    height.current = h;
  }, [spec.text, mode]);

  const cls = ["ov-line", mode === "in" && "ov-line-in", mode === "out" && "ov-line-out", rise.n > 0 && (rise.n % 2 ? "ov-rise-a" : "ov-rise-b")]
    .filter(Boolean)
    .join(" ");
  return (
    <p
      ref={ref}
      className={cls}
      data-speaker={spec.speaker}
      aria-hidden="true"
      style={{ "--ov-rise": `${rise.px}px` } as CSSProperties}
      onAnimationEnd={(e) => {
        if (mode === "out" && e.animationName === "ov-line-out") onExited();
      }}
    >
      {words.map((w, i) => (
        <span key={i} className={mode === "rest" ? "ov-word" : "ov-word ov-word-in"}>
          {w}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

function Transcript({ spec, complete }: { spec: LineSpec; complete: boolean }) {
  const [lines, setLines] = useState([{ spec, mode: "rest" as "rest" | "in" | "out" }]);
  useLayoutEffect(() => {
    setLines((list) => {
      const current = list[list.length - 1];
      if (current.spec.key === spec.key) {
        return [...list.slice(0, -1), { ...current, spec }];
      }
      return [...list.filter((l) => l.mode !== "out").map((l) => ({ ...l, mode: "out" as const })), { spec, mode: "in" as const }];
    });
  }, [spec.key, spec.text, spec.speaker]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ov-transcript">
      {lines.map((l) => (
        <Line
          key={l.spec.key}
          spec={l.spec}
          mode={l.mode}
          onExited={() => setLines((list) => list.filter((x) => x.spec.key !== l.spec.key))}
        />
      ))}
      <p className="ov-sr" aria-live="polite">
        {complete ? spec.text : ""}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Controls                                                                                         */
/* ------------------------------------------------------------------------------------------------ */

function Controls({
  active,
  muted,
  elapsed,
  onStart,
  onMute,
  onEnd,
}: {
  active: boolean;
  muted: boolean;
  elapsed: number;
  onStart: () => void;
  onMute: (m: boolean) => void;
  onEnd: () => void;
}) {
  const width = useMotionValue<number | "auto">("auto");
  const innerRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [panels, setPanels] = useState([{ live: active, key: 0, mode: "rest" as "rest" | "in" | "out" }]);
  const prevActive = useRef(active);
  const startRef = useRef<HTMLButtonElement>(null);
  const muteRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  useLayoutEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    setPanels((list) => [
      ...list.filter((p) => p.mode !== "out").map((p) => ({ ...p, mode: "out" as const })),
      { live: active, key: list[list.length - 1].key + 1, mode: "in" as const },
    ]);
  }, [active]);

  // The pill's width follows the incoming panel's width with a critically damped spring.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const w = el.offsetWidth + 2;
    if (first.current) {
      first.current = false;
      width.set(w);
      return;
    }
    animate(width, w, { type: "spring", visualDuration: 0.3, bounce: 0 });
  }, [panels, width]);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (active ? muteRef.current : startRef.current)?.focus();
  }, [active]);

  const current = panels[panels.length - 1];
  const clock = `${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, "0")}`;

  return (
    <motion.div className="ov-controls" style={{ width }} data-active={active ? "" : undefined}>
      {panels.map((p) => {
        const cls = `${p.live ? "ov-live" : "ov-idle"} ${p.mode === "in" ? "ov-pop-in" : p.mode === "out" ? "ov-pop-out" : ""}`;
        const exitDone = (e: React.AnimationEvent) => {
          if (p.mode === "out" && e.target === e.currentTarget) setPanels((list) => list.filter((x) => x.key !== p.key));
        };
        const ref = p === current ? innerRef : undefined;
        return p.live ? (
          <div key={p.key} ref={ref} className={cls} onAnimationEnd={exitDone} aria-hidden={p.mode === "out" || undefined}>
            <button
              ref={p === current ? muteRef : undefined}
              type="button"
              className="ov-round"
              aria-pressed={muted}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              onClick={() => onMute(!muted)}
            >
              <span key={muted ? "off" : "on"} className="ov-glyph">
                {muted ? <MicOff size={18} strokeWidth={1.75} aria-hidden="true" /> : <Mic size={18} strokeWidth={1.75} aria-hidden="true" />}
              </span>
            </button>
            <span className="ov-clock" role="timer" aria-label={`${Math.floor(elapsed / 60)} minutes ${Math.floor(elapsed % 60)} seconds`}>
              {clock}
            </span>
            <button
              type="button"
              className="ov-end"
              aria-label="End voice chat"
              onClick={() => {
                moveFocus.current = true;
                onEnd();
              }}
            >
              <PhoneOff size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div key={p.key} ref={ref} className={cls} onAnimationEnd={exitDone} aria-hidden={p.mode === "out" || undefined}>
            <button
              ref={p === current ? startRef : undefined}
              type="button"
              className="ov-start"
              onClick={() => {
                moveFocus.current = true;
                onStart();
              }}
            >
              <Mic size={18} strokeWidth={1.75} aria-hidden="true" />
              Start voice chat
            </button>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Microphone (optional, only after the user asks for it)                                           */
/* ------------------------------------------------------------------------------------------------ */

async function openMicrophone(onLevel: (v: number) => void): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const ctx = new AudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  ctx.createMediaStreamSource(stream).connect(analyser);
  const buf = new Float32Array(analyser.fftSize);
  let raf = 0;
  const tick = () => {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const db = 20 * Math.log10(Math.sqrt(sum / buf.length) + 1e-6);
    onLevel(Math.min(1, Math.max(0, (db + 56) / 36)));
    raf = requestAnimationFrame(tick);
  };
  tick();
  return () => {
    cancelAnimationFrame(raf);
    stream.getTracks().forEach((t) => t.stop());
    void ctx.close();
  };
}

/* ------------------------------------------------------------------------------------------------ */
/* Demo                                                                                             */
/* ------------------------------------------------------------------------------------------------ */

export default function VoiceOrbDemo() {
  const [phase, setPhase] = useState<VoiceState>("idle");
  const [turn, setTurn] = useState(0);
  const [words, setWords] = useState(0);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [endedAfter, setEndedAfter] = useState<number | null>(null);
  const [source, setSource] = useState<LevelSource>("demo");
  const [micError, setMicError] = useState(false);
  const orbButton = useRef<HTMLDivElement>(null);
  const closeMic = useRef<(() => void) | null>(null);
  const active = phase !== "idle";
  const t = TURNS[turn % TURNS.length];

  const feed = useRef<OrbFeed>({ state: "idle", muted: false, chatStart: 0, mic: null, spokenWords: 0 });
  useLayoutEffect(() => {
    feed.current.state = phase;
    feed.current.muted = muted;
  });
  useEffect(() => {
    if (active) feed.current.chatStart = performance.now();
  }, [active]);
  // Every spoken word (after the first is counted) pulses the orb.
  useEffect(() => {
    if (phase !== "speaking" || words === 0) return;
    feed.current.spokenWords += 1;
  }, [phase, words]);

  const start = useCallback(() => {
    setEndedAfter(null);
    setElapsed(0);
    setTurn(0);
    setWords(0);
    setMuted(false);
    setPhase("listening");
  }, []);

  const end = useCallback(() => {
    setEndedAfter(elapsed);
    setPhase("idle");
    setWords(0);
    setMuted(false);
    closeMic.current?.();
    closeMic.current = null;
    feed.current.mic = null;
    setSource("demo");
  }, [elapsed]);

  const startWithMic = useCallback(async () => {
    setMicError(false);
    try {
      closeMic.current = await openMicrophone((v) => {
        feed.current.mic = v;
      });
      setSource("microphone");
      start();
    } catch {
      setMicError(true);
    }
  }, [start]);

  useEffect(() => () => closeMic.current?.(), []);

  // The scripted conversation: one timeout per step, like a stream of recogniser events.
  useEffect(() => {
    if (phase === "idle") return;
    let id = 0;
    if (phase === "listening") {
      if (muted) return;
      const heard = t.you.split(" ");
      id = window.setTimeout(
        () => (words < heard.length ? setWords(words + 1) : setPhase("thinking")),
        words === 0 ? TIMING.firstHeardWordMs : words < heard.length ? wordGapMs(heard[words - 1]) : TIMING.afterHeardMs,
      );
    } else if (phase === "thinking") {
      id = window.setTimeout(() => {
        setWords(0);
        setPhase("speaking");
      }, TIMING.thinkingMs);
    } else {
      const said = t.reply.split(" ");
      id = window.setTimeout(
        () => {
          if (words < said.length) setWords(words + 1);
          else {
            setTurn((n) => n + 1);
            setWords(0);
            setPhase("listening");
          }
        },
        words === 0 ? TIMING.firstSpokenWordMs : words < said.length ? wordGapMs(said[words - 1]) : TIMING.afterSpokenMs,
      );
    }
    return () => window.clearTimeout(id);
  }, [phase, words, muted, t]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  const onOrb = () => {
    if (phase === "idle") start();
    else if (phase === "listening") {
      if (words > 0) {
        setWords(t.you.split(" ").length);
        setPhase("thinking");
      }
    } else {
      if (phase === "thinking") setWords(t.you.split(" ").length);
      else {
        setTurn((n) => n + 1);
        setWords(0);
      }
      setPhase("listening");
    }
  };

  const line: LineSpec =
    phase === "idle"
      ? {
          key: `idle-${endedAfter ?? "new"}`,
          text: endedAfter === null ? HINT : `Call ended after ${Math.floor(endedAfter / 60)}:${String(endedAfter % 60).padStart(2, "0")}.`,
          speaker: "system",
        }
      : phase === "speaking"
        ? { key: `reply-${turn}`, text: t.reply.split(" ").slice(0, words).join(" "), speaker: "assistant" }
        : { key: `you-${turn}`, text: t.you.split(" ").slice(0, words).join(" "), speaker: "user" };
  const complete = phase === "idle" || phase === "thinking" || (phase === "speaking" && words >= t.reply.split(" ").length);
  const status = phase === "listening" && muted ? "Muted" : STATUS[phase];

  return (
    <div
      className="ov-card"
      style={TOKENS}
      ref={orbButton}
      onKeyDown={(e) => {
        if (e.key === "Escape" && active) {
          e.preventDefault();
          end();
        }
      }}
    >
      <p className="ov-status" aria-live="polite">
        <SwapLabel text={status} className="ov-status-text" />
      </p>
      <VoiceOrb
        feed={feed}
        label={ORB_LABEL[phase]}
        onClick={onOrb}
        disabled={phase === "listening" && words === 0}
      />
      <Transcript spec={line} complete={complete} />
      <Controls active={active} muted={muted} elapsed={elapsed} onStart={start} onMute={setMuted} onEnd={end} />
      <p className="ov-note" aria-live="polite">
        {active ? (
          source === "microphone" ? "Listening to your microphone level." : ""
        ) : (
          <>
            {micError ? "Microphone unavailable, so the demo voice drives the orb." : "A demo voice drives the orb."}{" "}
            <button type="button" className="ov-link" onClick={startWithMic}>
              Use my microphone
            </button>
          </>
        )}
      </p>
    </div>
  );
}
