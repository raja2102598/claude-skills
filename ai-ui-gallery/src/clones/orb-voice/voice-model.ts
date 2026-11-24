/**
 * The voice model behind the orb: conversation states, the orb's per-state shape parameters, the
 * spring that carries the orb between states, and a deterministic synthetic voice level.
 *
 * Every timing and response law here was measured from the reference (see .reanimate/orb-voice/spec.md):
 * the per-state parameter set, the critically damped spring (k 40, c 12.6), the level follower
 * (attack 18/s, release 5/s), the syllable-and-phrase voice curve, the word cadence and the state holds.
 */

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export interface OrbShape {
  /** idle breathing amplitude (fraction of the radius) */
  breath: number;
  /** slow edge deformation amplitude */
  wobble: number;
  /** speed of the inner ink flow */
  flow: number;
  /** twist rate of the inner swirl, rad/s */
  swirl: number;
  /** how strongly the voice level swells the orb */
  gain: number;
  /** ripple rings outside the orb (listening) */
  rings: number;
  /** orbiting sheen band (thinking) */
  sheen: number;
  /** soft glow outside the orb */
  glow: number;
  /** resting size offset (fraction of the radius) */
  grow: number;
  /** desaturation while muted */
  mute: number;
}

export const SHAPES: Record<VoiceState, OrbShape> = {
  idle: { breath: 0.028, wobble: 0.014, flow: 0.32, swirl: 0.1, gain: 0, rings: 0, sheen: 0, glow: 0.55, grow: 0, mute: 0 },
  listening: { breath: 0.01, wobble: 0.022, flow: 0.7, swirl: 0.22, gain: 0.15, rings: 1, sheen: 0, glow: 0.75, grow: 0.03, mute: 0 },
  thinking: { breath: 0.012, wobble: 0.03, flow: 0.55, swirl: 1.25, gain: 0, rings: 0, sheen: 1, glow: 0.6, grow: -0.08, mute: 0 },
  speaking: { breath: 0.006, wobble: 0.026, flow: 0.95, swirl: 0.3, gain: 0.19, rings: 0, sheen: 0, glow: 0.9, grow: 0.02, mute: 0 },
};

/** Listening with the microphone muted: the orb dims, stops swelling and greys out. */
export const MUTED_SHAPE: OrbShape = { ...SHAPES.listening, gain: 0, rings: 0, flow: 0.25, wobble: 0.01, glow: 0.3, grow: -0.02, mute: 1 };

export const SHAPE_KEYS = Object.keys(SHAPES.idle) as (keyof OrbShape)[];

/** Spring that carries every shape parameter to its new target: x'' = K (target - x) - C x'. */
export const SHAPE_SPRING = { stiffness: 40, damping: 12.6 };

/** Level follower: rises fast (18/s) and falls slowly (5/s), so syllables read as swells, not flicker. */
export const LEVEL_ATTACK = 18;
export const LEVEL_RELEASE = 5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Synthetic voice: two beating sines make syllables (about 1.1 and 1.8 per second) and a slow
 * sine makes phrases with pauses. `voice` shifts the phrase so the user and the assistant differ.
 */
export function syntheticLevel(seconds: number, voice = 0): number {
  const s = seconds + 7.3 * voice;
  const syllables = Math.max(0, 0.5 * Math.sin(7.2 * s) + 0.5 * Math.sin(11.3 * s + 1.2)) ** 1.4;
  const phrase = clamp01(0.7 * Math.sin(1.15 * s) + 0.55);
  return clamp01(syllables * phrase * 1.1);
}

/* ----------------------------------------------------------------------------------------------------
 * The scripted conversation. Each word is revealed after 150 ms + 22 ms per character of the word
 * before it, the first word after 900 ms (listening) or 260 ms (speaking); 700 ms after the last
 * heard word the orb thinks for 1500 ms, and 1300 ms after the reply it listens again. The first
 * turn's words have the same lengths as the reference's, so every word lands on the same frame.
 * ------------------------------------------------------------------------------------------------- */

export interface Turn {
  you: string;
  reply: string;
}

export const TURNS: Turn[] = [
  {
    you: "Can you book me seats tonight from Oxford to Brighton station?",
    reply: "Sure. You're booked. Leaves at 6:40 sharpish, and I set one alarm.",
  },
  {
    you: "Which platform should I head for after work?",
    reply: "Platform four. Leave ten minutes to cross the footbridge.",
  },
  {
    you: "Set a reminder to grab coffee before boarding.",
    reply: "Done. You'll get a nudge at 9:15 by the kiosk.",
  },
];

export const TIMING = {
  firstHeardWordMs: 900,
  afterHeardMs: 700,
  thinkingMs: 1500,
  firstSpokenWordMs: 260,
  afterSpokenMs: 1300,
  wordBaseMs: 150,
  wordPerCharMs: 22,
  /** each scripted step lands about 6.5 ms after its timer (measured: render, commit, then the next timer) */
  stepLatencyMs: 6.5,
  /** each spoken word kicks the output level to 0.95 and lets it fall to 0.12 */
  spokenPulse: { from: 0.95, to: 0.12, ms: 320 },
};

export const wordGapMs = (previousWord: string) => TIMING.wordBaseMs + TIMING.wordPerCharMs * previousWord.length;

/** A scripted hold plus the measured per-step latency. */
export const stepMs = (holdMs: number) => holdMs + TIMING.stepLatencyMs;

/** cubic-bezier(0.16, 1, 0.3, 1) evaluated by Newton iterations; used for the spoken-word pulse. */
export function easeOutExpoLike(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const x1 = 0.16, y1 = 1, x2 = 0.3, y2 = 1;
  const bez = (u: number, a: number, b: number) => 3 * a * u * (1 - u) ** 2 + 3 * b * u * u * (1 - u) + u ** 3;
  const dBez = (u: number, a: number, b: number) => 3 * a * (1 - u) ** 2 + 6 * (b - a) * u * (1 - u) + 3 * (1 - b) * u * u;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const err = bez(u, x1, x2) - t;
    const d = dBez(u, x1, x2);
    if (Math.abs(err) < 1e-6 || d === 0) break;
    u -= err / d;
  }
  return bez(Math.min(1, Math.max(0, u)), y1, y2);
}
