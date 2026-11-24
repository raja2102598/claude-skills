import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArrowUp, AudioLines, Mic, X } from "lucide-react";
import {
  BAR_PEAKS,
  BEAM_DELAY_MS,
  BEAM_FADE_MS,
  BEAM_TURN_MS,
  COLOR_MS,
  FIRST_LISTEN_MS,
  HINT,
  LOOP_MS,
  REPLY,
  REPLY_HOLD_MS,
  RESET_AFTER_MS,
  SLIDE_MS,
  SPEAK_AFTER_MS,
  SWAP_MS,
  TRANSCRIPT,
  WORD_EVERY_MS,
  WORD_MS,
  barScale,
  easeBeam,
  easeColor,
  easeOut,
  formatElapsed,
  mixHex,
  progress,
  spring,
  type Phase,
} from "./motion-model";
import "./voice-input.css";

/*
 * Voice prompt: a talk bar that listens (live waveform, timer, words written into a bubble above),
 * then cancels or sends; the assistant answers and its reply lands in the hint line.
 *
 * On mount it plays the demo loop measured from the reference (12 s: listen, transcribe, send, reply).
 * Any tap takes over: the mic starts / sends / interrupts, X discards, the arrow sends.
 * The level is simulated (deterministic per-bar loops); no microphone is opened.
 *
 * One rAF clock drives every value from the time since the event that started it, so a frame is a pure
 * function of time and runs the same on reanimate's virtual clock as on a real one.
 */

const COLORS = { soft: "#ebe8e1", dark: "#2b2823", ink: "#1e1c19", white: "#ffffff" };

const TITLE: Record<Phase, string> = { idle: "Tap to speak", listening: "Listening…", speaking: "Nova is replying…" };
const MIC_LABEL: Record<Phase, string> = { idle: "Start talking", listening: "Stop and send", speaking: "Interrupt and talk" };

interface Model {
  auto: boolean;
  phase: Phase;
  prevPhase: Phase | null;
  phaseAt: number;
  /** when the mic button last flipped between muted (idle) and dark (active) */
  activeAt: number;
  listenAt: number;
  /** listening ended (speaking or discarded): the transcript freezes, Send leaves, the beam fades */
  leaveListenAt: number | null;
  wordsAtLeave: number;
  /** back to idle: bubble and Cancel leave, bars turn back into dots */
  resetAt: number | null;
  cancelAt: number | null;
  replyAt: number | null;
  next: { kind: "listen" | "speak" | "reset"; at: number; reply: boolean } | null;
}

const freshModel = (): Model => ({
  auto: true,
  phase: "idle",
  prevPhase: null,
  phaseAt: 0,
  activeAt: -1e9,
  listenAt: -1e9,
  leaveListenAt: null,
  wordsAtLeave: 0,
  resetAt: null,
  cancelAt: null,
  replyAt: null,
  next: { kind: "listen", at: FIRST_LISTEN_MS, reply: false },
});

const wordsHeard = (m: Model, t: number) => {
  if (m.phase === "idle" && m.leaveListenAt === null) return 0;
  const until = m.leaveListenAt ?? t;
  return Math.min(TRANSCRIPT.length, Math.max(0, Math.floor((until - m.listenAt) / WORD_EVERY_MS)));
};

function setPhase(m: Model, phase: Phase, at: number) {
  if ((m.phase === "idle") !== (phase === "idle")) m.activeAt = at;
  m.prevPhase = m.phase;
  m.phase = phase;
  m.phaseAt = at;
}

function listen(m: Model, at: number) {
  const wasIdle = m.phase === "idle";
  setPhase(m, "listening", at);
  m.listenAt = at;
  m.leaveListenAt = null;
  m.resetAt = null;
  m.replyAt = null;
  if (wasIdle) m.cancelAt = at;
  m.next = m.auto ? { kind: "speak", at: at + SPEAK_AFTER_MS, reply: true } : null;
}

function speak(m: Model, at: number) {
  m.wordsAtLeave = wordsHeard(m, at);
  m.leaveListenAt = at;
  setPhase(m, "speaking", at);
  m.next = { kind: "reset", at: m.auto ? m.listenAt + RESET_AFTER_MS : at + (RESET_AFTER_MS - SPEAK_AFTER_MS), reply: true };
}

function reset(m: Model, at: number, reply: boolean) {
  if (m.leaveListenAt === null) {
    m.wordsAtLeave = wordsHeard(m, at);
    m.leaveListenAt = at;
  }
  setPhase(m, "idle", at);
  m.resetAt = at;
  m.replyAt = reply ? at : null;
  m.next = m.auto ? { kind: "listen", at: m.listenAt + LOOP_MS, reply: false } : null;
}

function advance(m: Model, t: number) {
  // Apply scheduled events at their exact time, not the frame's, so every capture lands on the same frame.
  while (m.next && t >= m.next.at) {
    const { kind, at, reply } = m.next;
    if (kind === "listen") listen(m, at);
    else if (kind === "speak") speak(m, at);
    else reset(m, at, reply);
  }
}

/** Enter/exit progress of something that appears at `enterAt` and leaves at `exitAt`; null when not mounted. */
function presence(t: number, enterAt: number | null, exitAt: number | null, reduced: boolean) {
  if (enterAt === null || t < enterAt) return null;
  if (exitAt !== null && exitAt <= enterAt) return null;
  const s = (ms: number, end?: number) => (reduced ? (ms > 0 ? 1 : 0) : spring(ms, end));
  if (exitAt === null || t < exitAt) {
    const dt = t - enterAt;
    return { size: s(dt), opacity: Math.min(1, s(dt, SWAP_MS)), scale: 0.6 + 0.4 * s(dt, SWAP_MS), settled: dt >= 600 };
  }
  const dt = t - exitAt;
  if (dt >= SWAP_MS) return null;
  const from = s(exitAt - enterAt);
  return {
    size: Math.max(0, from * (1 - s(dt))),
    opacity: Math.max(0, 1 - s(dt, SWAP_MS)),
    scale: 1 - 0.4 * s(dt, SWAP_MS),
    settled: false,
  };
}

/** Two layers that swap with the measured spring: the old one leaves upward/shrinks, the new one arrives. */
interface Layer<T> {
  key: string;
  value: T;
  /** opacity / scale progress (0 → 1 arriving, 1 → 0 leaving) */
  k: number;
  /** slide progress, undefined when at rest */
  ky?: number;
  out: boolean;
}

function swapLayers<T>(t: number, at: number, prev: T | null, cur: T, reduced: boolean): Layer<T>[] {
  const dt = t - at;
  if (prev === null || prev === cur || reduced || dt >= SWAP_MS) return [{ key: "cur", value: cur, k: 1, out: false }];
  const k = spring(dt, SWAP_MS);
  const ky = spring(dt, SLIDE_MS);
  return [
    { key: `out-${at}`, value: prev, k: Math.max(0, 1 - k), ky: 1 - ky, out: true },
    { key: `in-${at}`, value: cur, k, ky, out: false },
  ];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export default function VoiceInput() {
  const reduced = useReducedMotion();
  const model = useRef<Model>(freshModel());
  const origin = useRef(0);
  const bubbleInner = useRef<HTMLDivElement>(null);
  const bubbleHeight = useRef(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    model.current = freshModel();
    origin.current = performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now() - origin.current;
      advance(model.current, now);
      if (bubbleInner.current) bubbleHeight.current = bubbleInner.current.offsetHeight + 32;
      flushSync(() => setT(now));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const act = useCallback((what: "mic" | "cancel" | "send") => {
    const m = model.current;
    const now = performance.now() - origin.current;
    advance(m, now);
    m.auto = false;
    m.next = m.next?.kind === "reset" && m.phase === "speaking" ? m.next : null;
    if (what === "cancel") return reset(m, now, false);
    if (what === "send") return m.phase === "listening" ? speak(m, now) : undefined;
    if (m.phase === "idle") return listen(m, now);
    if (m.phase === "speaking") return listen(m, now);
    return wordsHeard(m, now) > 0 ? speak(m, now) : reset(m, now, false);
  }, []);

  const m = model.current;
  const active = m.phase !== "idle";
  const words = wordsHeard(m, t);
  const firstWordAt = m.listenAt + WORD_EVERY_MS;
  const leftAt = m.leaveListenAt;

  // Mic button: muted ↔ dark in 150 ms.
  const c = reduced ? 1 : easeColor(progress(t - m.activeAt, COLOR_MS));
  const micBg = active ? mixHex(COLORS.soft, COLORS.dark, c) : mixHex(COLORS.dark, COLORS.soft, c);
  const micFg = active ? mixHex(COLORS.ink, COLORS.white, c) : mixHex(COLORS.white, COLORS.ink, c);

  // Beam around the bar while listening.
  const fadeIn = easeBeam(progress(t - m.listenAt, BEAM_FADE_MS));
  const beamOpacity =
    leftAt === null ? (active ? fadeIn : 0) : easeBeam(progress(leftAt - m.listenAt, BEAM_FADE_MS)) * (1 - easeBeam(progress(t - leftAt, BEAM_FADE_MS)));
  const beamTurn = reduced ? 0.12 : (t - m.listenAt - BEAM_DELAY_MS) / BEAM_TURN_MS;

  // Bubble, Cancel and Send come and go with the measured spring.
  const bubble = presence(t, words > 0 || (leftAt !== null && m.wordsAtLeave > 0) ? firstWordAt : null, m.resetAt, reduced);
  const cancel = presence(t, m.cancelAt, m.resetAt, reduced);
  const send = presence(t, words > 0 || (leftAt !== null && m.wordsAtLeave > 0) ? firstWordAt : null, leftAt, reduced);

  const barsOn = active || (m.resetAt !== null && t < m.resetAt);
  const hint = m.phase === "idle" && m.replyAt !== null && t - m.replyAt < REPLY_HOLD_MS ? REPLY : HINT;
  const shownWords = bubble ? (leftAt === null ? words : m.wordsAtLeave) : 0;

  const icons = swapLayers(t, m.phaseAt, m.prevPhase, m.phase, reduced);
  const titles = swapLayers(t, m.phaseAt, m.prevPhase, m.phase, reduced);

  return (
    <div className="vi-place">
      <div className="vi-root">
        <div className="vi-group">
          {bubble && (
            <div
              className="vi-bubble-wrap -mx-4"
              style={{
                opacity: bubble.opacity,
                height: bubble.settled ? "auto" : bubble.size * (bubbleHeight.current || 80),
                transform: `translateY(${reduced ? 0 : 6 * (1 - spring(t - firstWordAt, SLIDE_MS))}px)`,
              }}
            >
              <div className="vi-bubble" ref={bubbleInner}>
                <p>
                  {TRANSCRIPT.slice(0, shownWords).map((w, i) => (
                    <Fragment key={i}>
                      {i > 0 && " "}
                      <Word ms={t - (m.listenAt + WORD_EVERY_MS * (i + 1))} reduced={reduced}>
                        {w}
                      </Word>
                    </Fragment>
                  ))}
                </p>
              </div>
            </div>
          )}

          <div className="vi-pill" aria-label="Voice prompt" role="group">
            <span className="vi-ring" aria-hidden="true">
              <span className="vi-ring-fade" style={{ opacity: beamOpacity }}>
                <span
                  className="vi-ring-cone"
                  style={{ transform: `translate(-50%, -50%) rotate(${(beamTurn * 360).toFixed(2)}deg)` }}
                />
              </span>
            </span>

            <button
              type="button"
              className="vi-mic"
              aria-label={MIC_LABEL[m.phase]}
              onClick={() => act("mic")}
              style={{
                background: micBg,
                color: micFg,
                boxShadow: active
                  ? "inset 0 1px 0 rgb(255 255 255 / 0.1), 0 1px 2px rgb(30 24 14 / 0.14), 0 4px 10px -4px rgb(30 24 14 / 0.22)"
                  : "none",
              }}
            >
              {icons.map((l) => (
                <span
                  key={l.key}
                  className="vi-icon"
                  style={{ opacity: Math.min(1, l.k), transform: `scale(${(0.5 + 0.5 * l.k).toFixed(4)})` }}
                >
                  {l.value === "speaking" ? <AudioLines size={20} strokeWidth={1.5} /> : <Mic size={20} strokeWidth={1.5} />}
                </span>
              ))}
            </button>

            <div className="vi-text">
              <div className="vi-title h-5" aria-live="polite">
                {titles.map((l) => (
                  <span
                    key={l.key}
                    style={{
                      opacity: Math.min(1, l.k),
                      transform: l.ky === undefined ? undefined : `translateY(${(l.out ? -10 * (1 - l.ky) : 10 * (1 - l.ky)).toFixed(3)}px)`,
                    }}
                  >
                    {TITLE[l.value]}
                  </span>
                ))}
              </div>
              <span className="vi-sub">
                {active ? (
                  <>
                    <span className="vi-sr">Elapsed </span>
                    {formatElapsed(t - m.listenAt)}
                  </>
                ) : (
                  "Voice input"
                )}
              </span>
            </div>

            <span className="vi-wave items-center h-6" aria-hidden="true">
              {BAR_PEAKS.map((_, i) =>
                barsOn ? (
                  <span
                    key={i}
                    className="vi-bar"
                    style={{ transform: `scaleY(${(reduced ? 0.55 * BAR_PEAKS[i] + 0.1 : barScale(i, t - m.listenAt)).toFixed(4)})` }}
                  />
                ) : (
                  <span key={i} className="vi-dot" />
                ),
              )}
            </span>

            <div className="vi-actions">
              {cancel && (
                <PresenceButton label="Cancel" className="vi-btn-cancel" p={cancel} onClick={() => act("cancel")}>
                  <X size={16} strokeWidth={1.75} />
                </PresenceButton>
              )}
              {send && (
                <PresenceButton label="Send" className="vi-btn-send" p={send} onClick={() => act("send")}>
                  <ArrowUp size={16} strokeWidth={1.75} />
                </PresenceButton>
              )}
            </div>
          </div>
        </div>

        <div className="vi-hint">
          <p className="text-center" aria-live="polite">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}

function Word({ ms, reduced, children }: { ms: number; reduced: boolean; children: ReactNode }) {
  const e = reduced ? 1 : easeOut(progress(ms, WORD_MS));
  const style: CSSProperties =
    e >= 1
      ? {}
      : { opacity: e, filter: `blur(${(3 * (1 - e)).toFixed(3)}px)`, transform: `translateY(${(3 * (1 - e)).toFixed(3)}px)` };
  return (
    <span className="inline-block" style={style}>
      {children}
    </span>
  );
}

function PresenceButton({
  label,
  className,
  p,
  onClick,
  children,
}: {
  label: string;
  className: string;
  p: { size: number; opacity: number; scale: number };
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`vi-btn ${className}`}
      onClick={onClick}
      style={{ width: 32 * p.size, opacity: p.opacity, transform: `scale(${p.scale.toFixed(4)})` }}
    >
      {children}
    </button>
  );
}
