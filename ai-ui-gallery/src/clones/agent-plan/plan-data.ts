import { BookOpen, FlaskConical, GitPullRequestArrow, PenLine, Search, type LucideIcon } from "lucide-react";

export type ToolId = "search" | "read" | "write" | "test" | "review";

export const TOOLS: Record<ToolId, { label: string; Icon: LucideIcon; color: string }> = {
  search: { label: "Search", Icon: Search, color: "#c4b5fd" },
  read: { label: "Read", Icon: BookOpen, color: "#67e8f9" },
  write: { label: "Write", Icon: PenLine, color: "#f9a8d4" },
  test: { label: "Test", Icon: FlaskConical, color: "#bef264" },
  review: { label: "Review", Icon: GitPullRequestArrow, color: "#fcd34d" },
};

export interface StepDef {
  id: string;
  title: string;
  tool: ToolId;
  /** How long the step runs, in ms. The estimate shown before it runs is this rounded to seconds. */
  ms: number;
  /** Tool-call lines streamed under the step while it runs, spread over its duration. */
  lines: string[];
  /** When set, the first attempt fails at the end with this line; Retry runs it again and it passes. */
  failure?: string;
}

export const AGENT = { name: "Atlas", model: "nova-2" };
export const GOAL = "Add CSV export to the invoices page";

export const PLAN: StepDef[] = [
  {
    id: "locate",
    title: "Find the invoice table view",
    tool: "search",
    ms: 1800,
    lines: ['rg "InvoiceTable" src/invoices', "9 matches across 4 files", "open invoices/table.tsx"],
  },
  {
    id: "model",
    title: "Read the invoice data model",
    tool: "read",
    ms: 1500,
    lines: ["read models/invoice.schema.ts", "fields: id, total, currency, issued_at"],
  },
  {
    id: "serializer",
    title: "Write the CSV serializer",
    tool: "write",
    ms: 2600,
    lines: ["create export/invoices-csv.ts", "map invoice → csv row", "register route GET /invoices/export"],
  },
  {
    id: "stream",
    title: "Stream large exports in chunks",
    tool: "write",
    ms: 1700,
    lines: ["add chunked stream writer", "flush every 500 rows to the socket"],
  },
  {
    id: "tests",
    title: "Run the invoices test suite",
    tool: "test",
    ms: 2300,
    lines: ["pnpm test invoices/export", "31 passed, 1 failed"],
    failure: "invoices-csv.test.ts: totals drop the cents",
  },
  {
    id: "review",
    title: "Open a draft pull request",
    tool: "review",
    ms: 1900,
    lines: ["git push -u origin feat/invoice-csv", "draft PR opened for review"],
  },
];

/** Run-clock granularity: the plan advances on a 100 ms tick, like the reference. */
export const TICK = 100;

/** When line k of a step appears, in ms into the step: spread evenly, snapped up to the tick grid. */
export function lineAt(step: StepDef, k: number): number {
  if (k <= 0) return 0;
  return Math.ceil((k * step.ms) / step.lines.length / TICK) * TICK;
}

export function linesAt(step: StepDef, elapsed: number): number {
  let n = 0;
  for (let k = 0; k < step.lines.length; k++) if (lineAt(step, k) <= elapsed) n = k + 1;
  return n;
}

export const estimate = (ms: number) => `~${Math.max(1, Math.round(ms / 1000))}s`;
export const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
