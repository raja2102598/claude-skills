/*
 * The sample reply and its stream timeline.
 *
 * The copy is our own. Each block keeps the reference's word count, so every stream tick lands on the same
 * frame: h4 6 · p 20 (+ source pill) · p 42 · list 14 / 23 / 14 / 15 · code card · p 36.
 * That is 170 words, 1 pill and 1 card on 176 ticks (.reanimate/streaming-text/spec.md).
 */

export interface Cite {
  label: string;
  more: number;
  sources: string[];
}

export type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string; cite?: Cite }
  | { kind: "list"; items: { lead: string; text: string }[] }
  | { kind: "code"; label: string; code: string };

export const REPLY: Block[] = [
  { kind: "heading", text: "Why the first run is slow" },
  {
    kind: "paragraph",
    text: "On a cold start the runner has to compile every module, fill its cache and boot a pool of workers.",
    cite: { label: "Handbook", more: 1, sources: ["Runner handbook", "Team wiki"] },
  },
  {
    kind: "paragraph",
    text:
      "Later runs skip most of that work. The cache keeps compiled output on disk, keyed by a hash of each file, " +
      "so only the modules you touched since the last run are rebuilt, and only the tests that import them are queued.",
  },
  {
    kind: "list",
    items: [
      { lead: "Warm runs win:", text: "the cache turns a full build into a few small ones." },
      { lead: "Watch mode helps:", text: "it keeps the workers alive between runs, so the next change only pays for the files that it actually touched." },
      { lead: "Resets undo it:", text: "a fresh clone or an empty cache will start from cold." },
      { lead: "CI starts cold:", text: "every job gets a new box, so save the cache dir too." },
    ],
  },
  { kind: "code", label: "shell", code: "runner test --watch --cache .runner" },
  {
    kind: "paragraph",
    text:
      "The first run will always cost something, and that is fine. Once the cache is warm, most changes come back " +
      "in a second or two, which is fast enough to keep you in a steady flow.",
  },
];

/* ---------- timeline ---------- */

export interface Word {
  text: string;
  tick: number;
}

export type TimedBlock =
  | { kind: "heading"; tick: number; words: Word[] }
  | { kind: "paragraph"; tick: number; words: Word[]; cite?: Cite & { tick: number } }
  | { kind: "list"; tick: number; items: { tick: number; lead: Word[]; words: Word[] }[] }
  | { kind: "code"; tick: number; label: string; code: string };

export interface Timeline {
  blocks: TimedBlock[];
  /** Number of ticks; the stream is done once this many are shown. */
  total: number;
  /** Ticks that hold the stream longer than one word (the code card). */
  holds: Map<number, "code">;
}

const split = (s: string) => s.split(/\s+/).filter(Boolean);

export function buildTimeline(reply: Block[]): Timeline {
  let tick = 0;
  const words = (s: string): Word[] => split(s).map((text) => ({ text, tick: tick++ }));
  const holds = new Map<number, "code">();
  const blocks: TimedBlock[] = reply.map((b) => {
    switch (b.kind) {
      case "heading": {
        const w = words(b.text);
        return { kind: "heading", tick: w[0].tick, words: w };
      }
      case "paragraph": {
        const w = words(b.text);
        // The pill rides in on the paragraph's last word: the same tick, so no extra frame.
        const cite = b.cite ? { ...b.cite, tick: w[w.length - 1].tick } : undefined;
        return { kind: "paragraph", tick: w[0].tick, words: w, cite };
      }
      case "list": {
        const items = b.items.map((it) => {
          const lead = words(it.lead);
          return { tick: lead[0].tick, lead, words: words(it.text) };
        });
        return { kind: "list", tick: items[0].tick, items };
      }
      case "code": {
        holds.set(tick, "code");
        return { kind: "code", tick: tick++, label: b.label, code: b.code };
      }
    }
  });
  return { blocks, total: tick, holds };
}
