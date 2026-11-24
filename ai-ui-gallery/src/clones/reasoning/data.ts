/** Placeholder reasoning for a fictional model ("Nova 2") chasing stale search results. */

export const MODEL = "Nova 2";

export interface Step {
  title: string;
  /**
   * The paragraph, pre-split into the chunks the live stream reveals one at a time. The splits are placed so the
   * chunk that wraps onto a third line (and scrolls the two-line window) lands where it does in the reference.
   */
  chunks: string[];
}

export const STEPS: Step[] = [
  {
    title: "Reading the cache layer",
    chunks: [
      "The lookup in src/search/cache.ts keys each entry by the raw",
      " query string and keeps",
      " the ranked results for an hour. Nothing",
      " normalises case or spacing, so one search",
      " can sit in the cache under several keys,",
      " each aging out on",
      " its own clock.",
    ],
  },
  {
    title: "Checking when entries expire",
    chunks: [
      "Entries expire on a fixed",
      " timer, not when the index",
      " changes. The rebuild on Nov 12",
      " finished at 09:40, but results cached",
      " at 09:10 kept serving",
      " the old ranking until 10:10,",
      " which lines up with every report filed",
      " that morning.",
    ],
  },
  {
    title: "Tracing the stale results",
    chunks: [
      "All 52 stale reports fall inside that window.",
      " Each one hit a key written before the rebuild,",
      " so readers saw rankings from an index",
      " that no longer existed, while the fresh results sat unused until the old",
      " entries timed",
      " out.",
    ],
  },
  {
    title: "Choosing a fix",
    chunks: [
      "Normalise the query before hashing it, tag every entry with the index",
      " version, and drop the old tag once",
      " a rebuild completes.",
      " That way a fresh index never serves results",
      " computed against the one it replaced.",
    ],
  },
];

export const paragraph = (step: Step) => step.chunks.join("");

/** What an interrupted run got through: the first step and the opening of the second. */
export const INTERRUPTED_STEPS: { title: string; text: string }[] = [
  { title: STEPS[0].title, text: paragraph(STEPS[0]) },
  { title: STEPS[1].title, text: "Entries expire on a fixed timer, not when the index changes." },
];
