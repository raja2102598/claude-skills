export type Bench = "swe" | "gpqa" | "term";
export interface Model {
  id: string;
  name: string;
  maker: string;
  hue: string;
  glyph: 0 | 1 | 2 | 3;
  summary: string;
  caps: Record<string, boolean>;
  context: number; // K tokens
  maxOut: number; // K tokens
  cutoff: string;
  priceIn: number;
  priceOut: number;
  priceCache: number;
  bench: Record<Bench, number>;
  slug: string;
}

export const CAPS = ["Text", "Image", "PDF", "Audio", "Video", "Tools", "Reasoning"] as const;
export const BENCH_LABEL: Record<Bench, string> = { swe: "Code tasks", gpqa: "Science QA", term: "Shell tasks" };
export const BENCH_NOTE: Record<Bench, string> = {
  swe: "Code tasks: real repository issues resolved. Prices and scores are invented samples.",
  gpqa: "Science QA: graduate-level multiple choice. Prices and scores are invented samples.",
  term: "Shell tasks: multi-step terminal jobs finished. Prices and scores are invented samples.",
};

export const MODELS: Model[] = [
  {
    id: "nova",
    name: "Nova 2",
    maker: "Lumen Labs",
    hue: "#d9602b",
    glyph: 0,
    summary: "The most capable Lumen model for long running agents, large refactors and deep research.",
    caps: { Text: true, Image: true, PDF: true, Audio: false, Video: false, Tools: true, Reasoning: true },
    context: 1000,
    maxOut: 128,
    cutoff: "Mar 2026",
    priceIn: 5,
    priceOut: 25,
    priceCache: 0.5,
    bench: { swe: 86.4, gpqa: 79.2, term: 71.8 },
    slug: "nova-2-0326",
  },
  {
    id: "atlas",
    name: "Atlas Mini",
    maker: "Lumen Labs",
    hue: "#2f7f6f",
    glyph: 1,
    summary: "A balanced, fast model for everyday chat, light coding and analysis at scale.",
    caps: { Text: true, Image: true, PDF: true, Audio: false, Video: false, Tools: true, Reasoning: true },
    context: 400,
    maxOut: 64,
    cutoff: "Jan 2026",
    priceIn: 1.5,
    priceOut: 8,
    priceCache: 0.15,
    bench: { swe: 78.1, gpqa: 72.6, term: 63.4 },
    slug: "atlas-mini-0126",
  },
  {
    id: "orbit",
    name: "Orbit 3 Sol",
    maker: "Vantage AI",
    hue: "#3b5bdb",
    glyph: 2,
    summary: "A multimodal generalist with strong speech and video input and steady tool use.",
    caps: { Text: true, Image: true, PDF: true, Audio: true, Video: true, Tools: true, Reasoning: false },
    context: 512,
    maxOut: 96,
    cutoff: "Feb 2026",
    priceIn: 4,
    priceOut: 20,
    priceCache: 0.4,
    bench: { swe: 84.1, gpqa: 81.4, term: 66.9 },
    slug: "orbit-3-sol",
  },
  {
    id: "quill",
    name: "Quill 1 Argon",
    maker: "Halo Systems",
    hue: "#8a4fc7",
    glyph: 3,
    summary: "A low-cost reasoning model tuned for extraction, classification and batch jobs.",
    caps: { Text: true, Image: true, PDF: false, Audio: false, Video: false, Tools: true, Reasoning: true },
    context: 256,
    maxOut: 32,
    cutoff: "Nov 2025",
    priceIn: 0.4,
    priceOut: 1.8,
    priceCache: 0.04,
    bench: { swe: 82.7, gpqa: 74.9, term: 69.2 },
    slug: "quill-1-argon",
  },
];

export const fmtK = (k: number) => (k >= 1000 ? `${k / 1000}M` : `${k}K`);
export const money = (n: number) => `$${n < 1 ? n.toFixed(2) : Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")}`;
export const pages = (k: number) => Math.round((k * 1000 * 0.75) / 500 / 10) * 10; // ~500 words a page
export const monthly = (m: Model, volM: number) => volM * (0.75 * m.priceIn + 0.25 * m.priceOut);
export const VOL_MIN = 10;
export const VOL_MAX = 500;
