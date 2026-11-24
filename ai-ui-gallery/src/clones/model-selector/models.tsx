/* Fictional models, vendors and marks for the model selector clone. All names, copy, prices and marks are our own. */

export type VendorId = "nova" | "atlas" | "orbit" | "kite";

export interface Model {
  id: string;
  name: string;
  vendor: VendorId;
  /** One line under the name in the menu. */
  blurb: string;
  /** Two-line summary under the pill. */
  description: string;
  context: string;
  input: string;
  output: string;
  /** Small muted tag in the "More models" list. */
  tag?: string;
}

export const VENDORS: Record<VendorId, string> = {
  nova: "Nova Labs",
  atlas: "Atlas",
  orbit: "Orbit",
  kite: "Kite (open weights)",
};

/** The four featured models, in menu order. */
export const FEATURED: Model[] = [
  {
    id: "nova-2-reasoner",
    name: "Nova 2 Reasoner",
    vendor: "nova",
    blurb: "Deep thinking for code and long agent runs",
    description:
      "The flagship for hard coding problems, long agent sessions and careful review. Effort sets how long it reasons.",
    context: "1M tokens",
    input: "$3.00",
    output: "$15.00",
  },
  {
    id: "nova-2-lite",
    name: "Nova 2 Lite",
    vendor: "nova",
    blurb: "Quick and capable for day-to-day work",
    description: "Everyday writing, coding and agents at a lower price, with dependable tool use over the full context.",
    context: "1M tokens",
    input: "$1.00",
    output: "$5.00",
  },
  {
    id: "atlas-3-mini",
    name: "Atlas 3 Mini",
    vendor: "atlas",
    blurb: "Balanced reasoning over text and images",
    description: "A compact reasoning model for writing, analysis and image input, tuned for long chains of tool calls.",
    context: "1M tokens",
    input: "$1.20",
    output: "$6.00",
  },
  {
    id: "orbit-5-flash",
    name: "Orbit 5 Flash",
    vendor: "orbit",
    blurb: "Huge context, reads entire codebases",
    description: "Built for very long inputs: whole repositories, contracts and transcripts in one pass, at a fast clip.",
    context: "2M tokens",
    input: "$0.80",
    output: "$3.20",
  },
];

/** Everything else, grouped by vendor on the "More models" page. */
export const MORE: Model[] = [
  {
    id: "nova-2-nano",
    name: "Nova 2 Nano",
    vendor: "nova",
    blurb: "Tiny and instant",
    description: "The smallest Nova, for autocomplete, routing and short replies where speed matters most.",
    context: "256K tokens",
    input: "$0.20",
    output: "$0.80",
  },
  {
    id: "nova-1-5",
    name: "Nova 1.5",
    vendor: "nova",
    tag: "Legacy",
    blurb: "Previous generation",
    description: "The previous Nova generation, kept for teams that pinned their prompts to it.",
    context: "500K tokens",
    input: "$2.00",
    output: "$10.00",
  },
  {
    id: "atlas-3",
    name: "Atlas 3",
    vendor: "atlas",
    blurb: "Full-size Atlas",
    description: "The full Atlas model, strongest on charts, screenshots and documents with mixed media.",
    context: "1M tokens",
    input: "$4.00",
    output: "$16.00",
  },
  {
    id: "atlas-2-vision",
    name: "Atlas 2 Vision",
    vendor: "atlas",
    tag: "Legacy",
    blurb: "Image-first",
    description: "An earlier image-first model, still handy for batch captioning and alt text.",
    context: "256K tokens",
    input: "$0.90",
    output: "$3.60",
  },
  {
    id: "orbit-5-pro",
    name: "Orbit 5 Pro",
    vendor: "orbit",
    blurb: "Long context, more depth",
    description: "Orbit's deeper model for long documents that need careful cross-referencing.",
    context: "2M tokens",
    input: "$2.50",
    output: "$12.00",
  },
  {
    id: "orbit-4",
    name: "Orbit 4",
    vendor: "orbit",
    tag: "Legacy",
    blurb: "Previous generation",
    description: "The previous Orbit release, with a shorter window and lower prices.",
    context: "1M tokens",
    input: "$0.60",
    output: "$2.40",
  },
  {
    id: "kite-70b",
    name: "Kite 70B",
    vendor: "kite",
    tag: "Open",
    blurb: "Open weights",
    description: "An open-weights model you can also run yourself, here on shared hosting.",
    context: "128K tokens",
    input: "$0.40",
    output: "$0.40",
  },
  {
    id: "kite-8b",
    name: "Kite 8B",
    vendor: "kite",
    tag: "Open",
    blurb: "Open weights, small",
    description: "The small open-weights Kite, cheap enough for bulk classification and tagging.",
    context: "128K tokens",
    input: "$0.05",
    output: "$0.05",
  },
];

export const ALL_MODELS: Model[] = [...FEATURED, ...MORE];
export const modelById = (id: string) => ALL_MODELS.find((m) => m.id === id) ?? FEATURED[0];

export type EffortId = "low" | "medium" | "high" | "xhigh" | "max";
export const EFFORTS: { id: EffortId; label: string; blurb: string; isDefault?: boolean }[] = [
  { id: "low", label: "Low", blurb: "Quick, light reasoning" },
  { id: "medium", label: "Medium", blurb: "A balance of speed and depth", isDefault: true },
  { id: "high", label: "High", blurb: "Spends longer on each step" },
  { id: "xhigh", label: "Extra high", blurb: "Works through harder problems" },
  { id: "max", label: "Max", blurb: "Most thorough, slowest" },
];
export const effortLabel = (id: EffortId) => EFFORTS.find((e) => e.id === id)?.label ?? "Medium";

/** Simple original marks, one per vendor. */
export function VendorMark({ vendor, size, className }: { vendor: VendorId; size: number; className?: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", className, "aria-hidden": true as const };
  switch (vendor) {
    case "nova":
      return (
        <svg {...common}>
          <path
            d="M12 1.8c.75 5.6 3.85 8.7 9.6 9.45v1.5c-5.75.75-8.85 3.85-9.6 9.45h-.1c-.75-5.6-3.85-8.7-9.6-9.45v-1.5C8 10.5 11.1 7.4 11.9 1.8Z"
            fill="#e0683f"
          />
        </svg>
      );
    case "atlas":
      return (
        <svg {...common} fill="none" stroke="#2b2824" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3.5 12h17" />
        </svg>
      );
    case "orbit":
      return (
        <svg {...common} fill="none">
          <circle cx="12" cy="12" r="5" fill="#4b67d6" />
          <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(-28 12 12)" stroke="#4b67d6" strokeWidth={1.8} opacity={0.55} />
        </svg>
      );
    case "kite":
      return (
        <svg {...common}>
          <path d="M12 2.5 19.5 10 12 21.5 4.5 10Z" fill="#2f9468" />
          <path d="M4.5 10h15M12 2.5v19" stroke="#fff" strokeWidth={1.2} opacity={0.6} />
        </svg>
      );
  }
}
