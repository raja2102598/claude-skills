export type Tone = "good" | "bad";
export interface Driver { label: string; delta: string; value: number; tone: Tone; point: number }
/** A chunk is one stream tick. `m` marks the first chunk of a mention (a driver). */
export interface Chunk { t: string; m?: number }
export interface Insight { id: string; chunks: Chunk[]; drivers: Driver[]; source: string }

/** chart y values (px in a 112 px tall plot) for Mon..Sun */
export const CURRENT = [38, 60, 74, 50, 56, 86, 68];
export const PREVIOUS = [46, 36, 40, 47, 52, 72, 76];

export const INSIGHTS: Record<string, Insight> = {
  explain: {
    id: "explain",
    source: "Harbor ledger, 912 orders",
    chunks: [
      { t: "Wholesale reorders fell ", m: 0 },
      { t: "from 38 to 21 " },
      { t: "on Tuesday, when two large accounts paused." },
      { t: " " },
      { t: "Delayed courier pickups ", m: 1 },
      { t: "cost another $9.4k " },
      { t: "on Thursday, while " },
      { t: "Seasonal bundles ", m: 2 },
      { t: "added back $2.9k on Sunday, the one clear gain." },
    ],
    drivers: [
      { label: "Wholesale reorders", delta: "−$21.7k", value: 21.7, tone: "bad", point: 2 },
      { label: "Delayed courier pickups", delta: "−$9.4k", value: 9.4, tone: "bad", point: 5 },
      { label: "Seasonal bundles", delta: "+$2.9k", value: 2.9, tone: "good", point: 6 },
    ],
  },
  quarter: {
    id: "quarter",
    source: "Harbor ledger, 912 orders",
    chunks: [
      { t: "This week is $11.6k " },
      { t: "above the Q3 weekly average of " },
      { t: "$306.8k. " },
      { t: "New wholesale accounts ", m: 0 },
      { t: "ran ahead " },
      { t: "from Monday, " },
      { t: "and " },
      { t: "Gift bundles landed on Sunday. ", m: 1 },
      { t: "Only " },
      { t: "late courier pickups ", m: 2 },
      { t: "on Thursday fell below " },
      { t: "the Q3 pace, and only by a little." },
    ],
    drivers: [
      { label: "New wholesale accounts", delta: "+$8.2k", value: 8.2, tone: "good", point: 0 },
      { label: "Gift bundles", delta: "+$5.1k", value: 5.1, tone: "good", point: 6 },
      { label: "Late courier pickups", delta: "−$3.7k", value: 3.7, tone: "bad", point: 5 },
    ],
  },
  plan: {
    id: "plan",
    source: "Harbor ledger, 912 orders",
    chunks: [
      { t: "Retail carried the dip, ", m: 0 },
      { t: "down $18.3k as reorders lapsed " },
      { t: "on Tuesday, when two large accounts paused." },
      { t: " " },
      { t: "Online ", m: 1 },
      { t: "slipped $7.9k, mostly from late " },
      { t: "pickups on Thursday." },
      { t: " " },
      { t: "Trade desk grew $2.9k on ", m: 2 },
      { t: "bundle orders billed Sunday, the one clear gain." },
    ],
    drivers: [
      { label: "Retail", delta: "−$18.3k", value: 18.3, tone: "bad", point: 2 },
      { label: "Online", delta: "−$7.9k", value: 7.9, tone: "bad", point: 5 },
      { label: "Trade desk", delta: "+$2.9k", value: 2.9, tone: "good", point: 6 },
    ],
  },
};

export const FOLLOW_UPS = [
  { id: "quarter", label: "Compare to last quarter" },
  { id: "plan", label: "Break down by channel" },
];

export const W = 598;
export const H = 112;
export const px = (i: number) => 6 + (i * (W - 12)) / 6;

/** monotone cubic path through (px(i), ys[i]) */
export function smoothPath(ys: number[]): string {
  const n = ys.length;
  const xs = ys.map((_, i) => px(i));
  const dx = xs[1] - xs[0];
  const sl = ys.slice(1).map((y, i) => (y - ys[i]) / dx);
  const m = ys.map((_, i) => (i === 0 ? sl[0] : i === n - 1 ? sl[n - 2] : sl[i - 1] * sl[i] <= 0 ? 0 : (sl[i - 1] + sl[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (sl[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / sl[i], b = m[i + 1] / sl[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * sl[i]; m[i + 1] = t * b * sl[i]; }
  }
  let d = `M${xs[0].toFixed(2)},${ys[0].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    d += `C${(xs[i] + dx / 3).toFixed(2)},${(ys[i] + (m[i] * dx) / 3).toFixed(2)} ${(xs[i + 1] - dx / 3).toFixed(2)},${(ys[i + 1] - (m[i + 1] * dx) / 3).toFixed(2)} ${xs[i + 1].toFixed(2)},${ys[i + 1].toFixed(2)}`;
  }
  return d;
}
