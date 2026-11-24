/*
 * The scripted conversation (placeholder copy). One string per stream tick. Inline marks: **bold**, `code`, [n] cite.
 * The bold and code state carries across tokens. Token counts and line breaks follow the reference's tick map
 * (see .reanimate/chat-thread/spec.md rows 12 and 20), so the thread grows and scrolls on the same ticks.
 */

export type Block =
  | { kind: "p"; tokens: string[] }
  | { kind: "ol" | "ul"; items: string[][] }
  | { kind: "code"; lang: string; tokens: string[] };

export interface Timing {
  /** ms from the turn's start */
  chevron: number;
  tool: number;
  toolDone: number;
  stream: number;
  tick: number;
  /** when the send button turns into Stop */
  stop: number;
}

export interface Script {
  user: string;
  thought: string;
  tool?: { kind: "search" | "query"; running: string; done: string; meta: string; sources?: string[] };
  blocks: Block[];
  timing: Timing;
}

export const TITLE = "Speed up the nightly import";
export const MODEL = "Nova 2";

export const TURN_A: Script = {
  user: "Our nightly import loads 12M rows into the events table and now runs past 6am. How can we get it to finish sooner?",
  thought: "Thought for 4s",
  tool: { kind: "search", running: "Searching the docs", done: "Searched the docs", meta: "3 sources", sources: ["#0f766e", "#c2733b", "#6b6fd6"] },
  blocks: [
    { kind: "p", tokens: ["Most of the time", " goes into index upkeep", " and one long", " transaction, so split", " the load into stages."] },
    {
      kind: "ol",
      items: [
        ["**Load into", " a staging table.**", " It has no indexes,", " so every insert stays cheap."],
        ["**Commit in", " batches**", " of about 50,000 rows, so each", " transaction stays small and the", " write-ahead log never backs up."],
        ["**Use `COPY`", " instead of inserts.**", " It streams every row", " through one connection, which", " is several times faster than", " batched `INSERT` calls. [1][2]"],
        ["**Index at", " the end**", " with `CREATE INDEX", " CONCURRENTLY`,", " then swap", " the tables", " in one quick rename. [1][3]"],
      ],
    },
    {
      kind: "code",
      lang: "sql",
      tokens: [
        "CREATE TABLE events_staging",
        " (LIKE events INCLUDING DEFAULTS);",
        "\n\nCOPY events_staging",
        " FROM '/data/events.csv'",
        "\n  WITH (FORMAT csv,",
        " HEADER",
        " true);",
        "\n\nCREATE INDEX CONCURRENTLY",
        " events_ts ON events_staging (ts);",
        "\nALTER TABLE events",
        " RENAME TO",
        " events_old;",
        "\nALTER TABLE events_staging",
        " RENAME TO events;",
      ],
    },
    {
      kind: "p",
      tokens: [
        "Raise `work_mem`",
        " to `256MB`",
        " for the import",
        " session only,",
        " so sorts stay",
        " in memory without",
        " changing the setting",
        " for every other",
        " connection on the",
        " server. [4]",
      ],
    },
  ],
  // t = 0 is the send; rows 2–15 of the spec
  timing: { chevron: 567, tool: 1450, toolDone: 2300, stream: 2433, tick: 50, stop: 467 },
};

export const TURN_B: Script = {
  user: "How long would 8 parallel workers take?",
  thought: "Thought for 2s",
  tool: { kind: "query", running: "Querying import_runs", done: "Queried import_runs", meta: "1,204 runs" },
  blocks: [
    { kind: "p", tokens: ["About 25 minutes.", " The last 30 runs", " averaged 3 h 10 min", " on a single", " worker."] },
    {
      kind: "ul",
      items: [
        ["**Per worker:**", " about 1.5M rows", " at roughly", " 1,000 rows", " per second", " each"],
        ["**Total:**", " 190 min ÷ 8", " ≈ 24 min,", " plus a minute", " for the indexes"],
        ["**Limit:**", " past 8 workers", " the disk, not", " the CPU, becomes", " the bottleneck"],
      ],
    },
    { kind: "p", tokens: ["Split the file", " by line ranges", " so each worker", " copies its", " own slice", " of it:"] },
    {
      kind: "code",
      lang: "bash",
      tokens: [
        "split -n l/8 events.csv part_",
        "\nfor f in part_*; do",
        '\n  psql "$DB" -c "\\copy events_staging FROM \'$f\' CSV" &',
        "\ndone;",
        " wait",
        '\npsql "$DB"',
        ' -c "ANALYZE',
        ' events_staging"',
        '\npsql "$DB" -f',
        " build_indexes.sql",
      ],
    },
  ],
  // relative to its own send (6483 ms after turn A's); rows 16–21 of the spec
  timing: { chevron: 550, tool: 550, toolDone: 1434, stream: 1567, tick: 50, stop: 0 },
};

/** When the demo sends turn B, in ms after turn A's send. */
export const TURN_B_AT = 6483;

/** A short reply for prompts the reader types in. */
export const FOLLOW_UP = (prompt: string): Script => ({
  user: prompt,
  thought: "Thought for 1s",
  blocks: [
    { kind: "p", tokens: ["Good question.", " This demo replies", " from a fixed script,", " so here is", " the short version:"] },
    {
      kind: "ul",
      items: [
        ["**Measure first:**", " time each stage", " of the import"],
        ["**Then tune:**", " start with the slowest", " stage and re-run"],
      ],
    },
  ],
  timing: { chevron: 300, tool: 600, toolDone: 600, stream: 700, tick: 50, stop: 0 },
});

export const tokenCount = (s: Script) =>
  s.blocks.reduce((n, b) => n + (b.kind === "p" || b.kind === "code" ? b.tokens.length : b.items.reduce((m, it) => m + it.length, 0)), 0);
