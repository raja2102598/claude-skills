/*
 * The simulated call: a fixed script on one clock, so the demo (and every capture of it) is deterministic.
 * No microphone or audio is involved. Times are ms from the start of a cycle and follow
 * .reanimate/voice-conversation/spec.md (measured on the reference with a real-clock probe).
 */

export type Speaker = "callee" | "agent";

export interface Line {
  speaker: Speaker;
  /** When the row mounts. Its first word lands FIRST_WORD_MS later, then one word every WORD_MS. */
  at: number;
  text: string;
}

export const CALLEE = { name: "Juniper Vet Clinic", detail: "(212) 555-0147" };
export const GOAL = "Vet visit Thu 9:15";
export const OUTCOME = { title: "Visit booked for Biscuit", detail: "Thu 9:15 AM · Dr. Kim" };

export const LINES: Line[] = [
  { speaker: "callee", at: 1700, text: "Juniper Vet Clinic, Priya speaking." },
  { speaker: "agent", at: 2583, text: "Hi Priya, I'm an AI assistant for Sam Ortiz. Can Biscuit see a vet this Thursday at 9:15, please?" },
  { speaker: "callee", at: 4650, text: "We have 9:15 with Dr. Kim, or 11:00 otherwise." },
  { speaker: "agent", at: 5867, text: "9:15 with Dr. Kim works, thanks." },
  { speaker: "callee", at: 6833, text: "You're all set, Thursday at 9:15. See you!" },
];

export const T = {
  ringing: 810,
  pickup: 1700,
  /** The call timer runs fast, like the reference: one "second" every 250 ms, the first tick 300 ms after pickup. */
  timerStart: 1750,
  timerStep: 250,
  confirmed: 7800,
  ended: 8410,
  cycle: 11950,
} as const;

export const FIRST_WORD_MS = 100;
export const WORD_MS = 1000 / 12; // 83.3 ms: five 60 Hz frames per word

/** Frame times are floats; a word due at 1883.33 ms must land on the frame stamped 1883.33. */
const EPS = 0.5;

export const WORDS = LINES.map((l) => l.text.split(" "));

export type Phase = "dialing" | "ringing" | "incall" | "ended";
export type GoalState = "pending" | "asking" | "confirmed";

export interface Snapshot {
  phase: Phase;
  seconds: number;
  /** Rows mounted so far. */
  rows: number;
  /** Words shown per mounted row. */
  words: number[];
  speaking: Speaker | null;
  goal: GoalState;
}

export function snapshotAt(t: number): Snapshot {
  const phase: Phase = t < T.ringing ? "dialing" : t < T.pickup ? "ringing" : t < T.ended ? "incall" : "ended";
  const seconds = Math.max(0, Math.min(Math.floor((Math.min(t, T.ended) - T.timerStart) / T.timerStep), 26));
  const words: number[] = [];
  let speaking: Speaker | null = null;
  LINES.forEach((line, i) => {
    if (t < line.at) return;
    const n = WORDS[i].length;
    const shown = Math.max(0, Math.min(n, Math.floor((t - line.at - FIRST_WORD_MS + EPS) / WORD_MS) + 1));
    words.push(shown);
    if (shown < n) speaking = line.speaker;
  });
  const goal: GoalState = t < T.pickup ? "pending" : t < T.confirmed ? "asking" : "confirmed";
  return { phase, seconds, rows: words.length, words, speaking, goal };
}

export const snapshotKey = (s: Snapshot) =>
  `${s.phase}|${s.seconds}|${s.words.join(",")}|${s.speaking}|${s.goal}`;
