/*
 * Data and layout for the context window meter. Token amounts are in thousands (K).
 * The grid has 200 cells; each category ends at the cell nearest its cumulative total
 * (cumulative rounding), the last cells hold the reply reserve, and row 8 carries the 80 % line.
 */

export type FillKind = "system" | "tools" | "files" | "summary" | "messages";
export type Kind = FillKind | "free" | "reserve";
export type Fill = Record<FillKind, number>;

export const FILL_KINDS: FillKind[] = ["system", "tools", "files", "summary", "messages"];
export const CELLS = 200;
export const COLS = 20;
export const THRESHOLD_CELL = 160; // the 80 % line sits after row 8
export const COMPACT_AT = 0.8;

export interface Model {
  id: string;
  name: string;
  /** Context window in K tokens. */
  window: number;
  label: string;
  /** Tokens held back for the reply, in K. */
  reserve: number;
}

export const MODELS: Model[] = [
  { id: "nova", name: "Nova 2", window: 1000, label: "1M", reserve: 63.6 },
  { id: "atlas", name: "Atlas Mini", window: 512, label: "512K", reserve: 48 },
  { id: "lumen", name: "Lumen 4", window: 400, label: "400K", reserve: 32 },
];

export const INITIAL_FILL: Fill = { system: 4.1, tools: 32, files: 100, summary: 0, messages: 291 };

export const LABELS: Record<Kind, string> = {
  system: "Instructions",
  tools: "Tool schemas",
  files: "Files & memory",
  summary: "Summary",
  messages: "Conversation",
  free: "Free space",
  reserve: "Held for the reply",
};

export const LEGEND_ORDER: Kind[] = ["system", "tools", "files", "summary", "messages", "free", "reserve"];

/** Sample turns the Send button cycles through: prompt and the tokens it adds. */
export const SENDS: { prompt: string; k: number }[] = [
  { prompt: "Draft the release notes for v3.2", k: 31.4 },
  { prompt: "Why did the nightly import stall?", k: 18.2 },
  { prompt: "Tighten the onboarding email copy", k: 24.8 },
  { prompt: "Compare the two caching plans", k: 41.6 },
  { prompt: "Summarize yesterday's standup", k: 12.9 },
];

export const FILES: { name: string; k: number }[] = [
  { name: "specs/billing-api.yaml", k: 64 },
  { name: "notes/q3-roadmap.md", k: 22 },
  { name: "data/churn-sample.csv", k: 38 },
];

export const used = (f: Fill) => FILL_KINDS.reduce((s, k) => s + f[k], 0);

export function layout(fill: Fill, model: Model): Kind[] {
  const per = model.window / CELLS;
  const reserveStart = Math.max(0, Math.min(CELLS, Math.round((model.window - model.reserve) / per)));
  const kinds: Kind[] = [];
  let cum = 0;
  let at = 0;
  for (const k of FILL_KINDS) {
    cum += fill[k];
    const end = Math.min(reserveStart, Math.round(cum / per));
    while (at < end) kinds[at++] = k;
  }
  while (at < reserveStart) kinds[at++] = "free";
  while (at < CELLS) kinds[at++] = "reserve";
  return kinds;
}

/**
 * Per-cell transition delays for a change of layout: changed cells start in index order,
 * 9 ms apart for a short run (a sent message) and 3 ms apart for a long one (a file, a compaction, a model switch).
 */
export function stagger(prev: Kind[], next: Kind[]): number[] {
  let first = -1;
  let last = -1;
  for (let i = 0; i < CELLS; i++) {
    if (prev[i] !== next[i]) {
      if (first < 0) first = i;
      last = i;
    }
  }
  const step = last - first + 1 <= 24 ? 9 : 3;
  return next.map((k, i) => (first >= 0 && k !== prev[i] ? (i - first) * step : 0));
}

/** 46 → "46", 4.1 → "4.1K", 291.4 → "291K", 1000 → "1M". */
export function tokens(k: number): string {
  if (k <= 0) return "0";
  if (k < 1) return String(Math.round(k * 1000));
  if (k < 9.95) return `${k.toFixed(1)}K`;
  if (k < 999.5) return `${Math.round(k)}K`;
  return `${+(k / 1000).toFixed(2)}M`;
}

export function pct(p: number): string {
  if (p <= 0) return "0%";
  if (p < 9.95) return `${p.toFixed(1)}%`;
  return `${Math.round(p)}%`;
}

export const perCell = (model: Model) => {
  const k = model.window / CELLS;
  return Number.isInteger(k) ? `${k}K` : `${k.toFixed(2).replace(/0+$/, "")}K`;
};
