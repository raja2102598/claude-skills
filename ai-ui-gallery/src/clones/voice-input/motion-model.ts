/**
 * Everything that moves in the voice prompt, as pure functions of time, so one rAF clock can render
 * any frame exactly (reanimate's virtual clock and a real clock give the same picture).
 *
 * Measured from the reference (see .reanimate/voice-input/spec.md):
 * - one spring for every enter, exit and swap: stiffness 420, damping 34, mass 1 (ζ ≈ 0.83, a hair of overshoot),
 *   fitted to the reference's sampled opacity curve (rmse 0.0001); opacity/scale run 450 ms, the 10 px label slide 245 ms;
 * - the demo loop: 12 000 ms, speaking 5083 ms and reset 7483 ms after the mic opens, one word every 250 ms,
 *   the reply stays in the hint for 3750 ms;
 * - the waveform: 13 bars, each looping 0.18 → peak → 0.45·peak → 0.85·peak → 0.18 with ease-in-out segments,
 *   loop length 1100 + 130·(i mod 4) ms, start staggered 80 ms by (i mod 5).
 */

export type Phase = "idle" | "listening" | "speaking";

export const LOOP_MS = 12000;
export const FIRST_LISTEN_MS = 1000;
export const SPEAK_AFTER_MS = 5083;
export const RESET_AFTER_MS = 7483;
export const WORD_EVERY_MS = 250;
export const REPLY_HOLD_MS = 3750;
export const BEAM_DELAY_MS = 70;
export const BEAM_TURN_MS = 3000;
export const BEAM_FADE_MS = 300;
export const COLOR_MS = 150;
export const WORD_MS = 320;
export const SWAP_MS = 450;
export const SLIDE_MS = 245;
/** Presence (width/height) springs are let run a little longer than the opacity before they snap. */
export const PRESENCE_MS = 600;

export const TRANSCRIPT = "Push the quarterly planning review to Friday and remind Priya to bring the onboarding drafts".split(" ");
export const REPLY = "Nova: Moved to Friday at 9:30, and Priya is bringing the drafts.";
export const HINT = "Talk, then tap the arrow to send or the X to discard.";

const K = 420;
const C = 34;
const W0 = Math.sqrt(K);
const ZETA = C / (2 * W0);
const WD = W0 * Math.sqrt(1 - ZETA * ZETA);
const DECAY = ZETA * W0;

/** Step response of the measured spring, from 0 to 1, starting at rest. `ms` since the change. */
export function spring(ms: number, endMs = PRESENCE_MS): number {
  if (ms <= 0) return 0;
  if (ms >= endMs) return 1;
  const t = ms / 1000;
  return 1 - Math.exp(-DECAY * t) * (Math.cos(WD * t) + (DECAY / WD) * Math.sin(WD * t));
}

/** CSS cubic-bezier(x1, y1, x2, y2) evaluated at progress x in [0, 1]. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bx = (t: number) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
  const by = (t: number) => 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (bx(mid) < x) lo = mid;
      else hi = mid;
    }
    return by((lo + hi) / 2);
  };
}

export const easeOut = cubicBezier(0, 0, 0.58, 1);
export const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
export const easeColor = cubicBezier(0.4, 0, 0.2, 1);
export const easeBeam = cubicBezier(0.25, 0.1, 0.35, 1);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const progress = (ms: number, dur: number) => clamp01(ms / dur);

/* ----------------------------------------------------------------------------------------------- */
/* Waveform: a deterministic simulated level per bar                                               */
/* ----------------------------------------------------------------------------------------------- */

export const BAR_PEAKS = [0.35, 0.55, 0.45, 0.8, 0.6, 1, 0.7, 0.95, 0.5, 0.75, 0.4, 0.6, 0.3];
const BAR_REST = 0.18;
const BAR_BEFORE = 0.15;

/** scaleY of bar `i`, `ms` after the mic opened. */
export function barScale(i: number, ms: number): number {
  const local = ms - 80 * (i % 5);
  if (local < 0) return BAR_BEFORE;
  const period = 1100 + 130 * (i % 4);
  const p = BAR_PEAKS[i];
  const stops = [BAR_REST, p, 0.45 * p, 0.85 * p, BAR_REST];
  const f = (local % period) / period;
  const seg = Math.min(3, Math.floor(f * 4));
  const e = easeInOut(f * 4 - seg);
  return stops[seg] + (stops[seg + 1] - stops[seg]) * e;
}

/* ----------------------------------------------------------------------------------------------- */
/* Colour helpers                                                                                   */
/* ----------------------------------------------------------------------------------------------- */

export function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((o) => parseInt(a.slice(o, o + 2), 16));
  const pb = [1, 3, 5].map((o) => parseInt(b.slice(o, o + 2), 16));
  return `rgb(${pa.map((v, k) => Math.round(v + (pb[k] - v) * t)).join(", ")})`;
}

export const formatElapsed = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
