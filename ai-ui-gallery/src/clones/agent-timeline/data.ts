import type { LucideIcon } from "lucide-react";
import { Atom, Feather, Hexagon, Orbit, Sparkle } from "lucide-react";

/** Length of the run on the time axis, in seconds. */
export const AXIS = 26.4;
/** Grid lines and tick labels, every 5 s. */
export const TICKS = [0, 5, 10, 15, 20, 25];
/** Horizontal run of a handoff link before it turns, in seconds. */
export const HOP = 0.3;

export type SpanKind = "thinking" | "tool" | "waiting";

export interface RunSpan {
  /** Start, in seconds on the axis. */
  s: number;
  /** Length, in seconds. */
  d: number;
  kind: SpanKind;
  label: string;
  tool?: string;
  tokens?: number;
  failed?: boolean;
  retry?: boolean;
}

export interface Agent {
  name: string;
  model: string;
  mark: LucideIcon;
  markColor: string;
  /** CSS colour of the row (dot, bars, links). */
  color: string;
  /** Price per 1K tokens, in dollars. */
  rate: number;
  spans: RunSpan[];
}

const think = (s: number, e: number, label: string, tokens: number): RunSpan => ({
  s,
  d: +(e - s).toFixed(2),
  kind: "thinking",
  label,
  tokens,
});
const tool = (s: number, e: number, tool: string, label: string, tokens: number, extra: Partial<RunSpan> = {}): RunSpan => ({
  s,
  d: +(e - s).toFixed(2),
  kind: "tool",
  tool,
  label,
  tokens,
  ...extra,
});
const wait = (s: number, e: number, label: string): RunSpan => ({ s, d: +(e - s).toFixed(2), kind: "waiting", label });

export const TITLE = "Signup drop after the 3.2 release";

export const AGENTS: Agent[] = [
  {
    name: "Planner",
    model: "Nova 2 Pro",
    mark: Sparkle,
    markColor: "#6a5cf0",
    color: "var(--at-lead)",
    rate: 0.004,
    spans: [
      think(0, 2, "Split the question into three lines of inquiry", 1840),
      wait(2, 14.6, "Waiting on Quant, Scout and Verifier"),
      think(14.6, 16.8, "Merged findings: the new consent step drops mobile signups", 4210),
      wait(16.8, 23, "Waiting on Scribe"),
      think(23, 25.2, "Tightened the write-up for the team", 3020),
      tool(25.2, 26.4, "Docs", "Posted the summary to the release notes", 300),
    ],
  },
  {
    name: "Verifier",
    model: "Atlas Mini",
    mark: Hexagon,
    markColor: "#0f8fa3",
    color: "var(--at-s1)",
    rate: 0.0015,
    spans: [
      think(3.5, 4.1, "Listed outside causes to rule out", 460),
      tool(4.1, 5.6, "Web search", "Checked the auth provider's status page", 3780),
      think(5.6, 6.3, "Moved on to app store reviews", 590),
      tool(6.3, 7.7, "Web search", "Read reviews that mention sign-up since 3.2", 4310),
      think(7.7, 9.1, "Ruled out causes outside the app", 1120),
    ],
  },
  {
    name: "Scout",
    model: "Orion 4",
    mark: Orbit,
    markColor: "#e0702e",
    color: "var(--at-s2)",
    rate: 0.003,
    spans: [
      think(2.9, 3.5, "Planned the code search", 600),
      tool(3.5, 4.8, "Code search", "Listed 11 changes to the signup flow since 3.1", 2080),
      think(4.8, 5.5, "Narrowed it to 2 changes shipped in 3.2", 940),
      tool(5.5, 7.5, "Code search", "Read the change that added a consent step", 6620),
      think(7.5, 8.5, "Matched the change to the mobile layout", 1370),
      tool(8.5, 9.7, "Code search", "Checked when 3.2 reached the stores", 1690),
      think(9.7, 11.9, "Wrote up the likely cause with evidence", 2160),
    ],
  },
  {
    name: "Quant",
    model: "Vega Lite",
    mark: Atom,
    markColor: "#2a9d62",
    color: "var(--at-s3)",
    rate: 0.0012,
    spans: [
      think(2.3, 3, "Wrote a funnel query for the last 14 days", 520),
      tool(3, 5.1, "SQL", "Funnel query timed out", 400, { failed: true }),
      think(5.1, 5.7, "Added a date filter so the query uses the index", 360),
      tool(5.7, 7.3, "SQL", "Retried: signups by day and platform", 1900, { retry: true }),
      think(7.3, 8.3, "Found the drop is mobile only, down 11%", 700),
      tool(8.3, 9.9, "SQL", "Pulled drop-off by funnel step", 2240),
      think(9.9, 11.8, "Located the drop at the consent step", 830),
      tool(11.8, 13, "SQL", "Counted lost signups: 2,140", 1100),
      think(13, 14.3, "Summarised the numbers", 620),
    ],
  },
  {
    name: "Scribe",
    model: "Lumen 3 Flash",
    mark: Feather,
    markColor: "#d1435b",
    color: "var(--at-s4)",
    rate: 0.0008,
    spans: [
      think(17.1, 17.9, "Read the merged findings", 1790),
      tool(17.9, 18.8, "Code search", "Pulled the 3.2 changelog for context", 1080),
      think(18.8, 22.7, "Drafted the write-up, 380 words", 2850),
    ],
  },
];

export interface Link {
  /** Agent row (1…4) the link connects to the planner. */
  row: number;
  /** "out": planner hands work to the agent; "in": the agent hands results back. */
  dir: "out" | "in";
  /** Where the link leaves, in seconds. The link and its port mount when the playhead reaches `at`. */
  from: number;
  /** When the link appears (out: on handoff; in: when the line reaches the planner). */
  at: number;
  /** Port position on the planner row, in seconds. */
  port: number;
}

/** Handoffs: out at the planner's time, back when the agent's last span ends (drawn once the line can reach). */
export const LINKS: Link[] = AGENTS.slice(1).flatMap((agent, i) => {
  const row = i + 1;
  const first = agent.spans[0].s;
  const last = agent.spans[agent.spans.length - 1];
  const end = +(last.s + last.d).toFixed(2);
  return [
    { row, dir: "out" as const, from: +(first - HOP).toFixed(2), at: +(first - HOP).toFixed(2), port: +(first - HOP).toFixed(2) },
    { row, dir: "in" as const, from: end, at: +(end + HOP).toFixed(2), port: +(end + HOP).toFixed(2) },
  ];
});

/** Sum of every agent's busy time over the wall time: how much faster than running the work in series. */
export const SPEEDUP = (() => {
  let busy = 0;
  for (const a of AGENTS) for (const sp of a.spans) if (sp.kind !== "waiting") busy += sp.d;
  return busy / AXIS;
})();

export const TOTAL_TOKENS = AGENTS.reduce((n, a) => n + a.spans.reduce((m, sp) => m + (sp.tokens ?? 0), 0), 0);
