import type { ComponentType } from "react";
import type { CloneMeta } from "../src/gallery/types";

// Finished clones only, imported by name, so a clone still being built can't break the showcase build.
// Numbers come from each clone's .reanimate/<slug>/report.md and selection.md.
export interface ShowcaseEntry {
  slug: string;
  load: () => Promise<{ default: ComponentType }>;
  meta: () => Promise<{ meta: CloneMeta }>;
  candidates: number;
  rounds: number;
  timing: string;
  reference: string;
  runnerUp: string;
}

export const entries: ShowcaseEntry[] = [
  {
    slug: "prompt-input",
    load: () => import("../src/clones/prompt-input/index.tsx"),
    meta: () => import("../src/clones/prompt-input/meta.ts"),
    reference: "Arc UI · AI composer", candidates: 13, rounds: 6, timing: "every fade within 28 ms", runnerUp: "UIStacks Prompt input",
  },
  {
    slug: "thinking-indicator",
    load: () => import("../src/clones/thinking-indicator/index.tsx"),
    meta: () => import("../src/clones/thinking-indicator/meta.ts"),
    reference: "UIStacks · Thinking state", candidates: 7, rounds: 3, timing: "0.00 s timing error", runnerUp: "Arc UI Agent status",
  },
  {
    slug: "reasoning",
    load: () => import("../src/clones/reasoning/index.tsx"),
    meta: () => import("../src/clones/reasoning/meta.ts"),
    reference: "Arc UI · Reasoning block", candidates: 6, rounds: 5, timing: "every event within 17 ms", runnerUp: "AI Elements Chain of Thought",
  },
  {
    slug: "streaming-text",
    load: () => import("../src/clones/streaming-text/index.tsx"),
    meta: () => import("../src/clones/streaming-text/meta.ts"),
    reference: "Kobra · Streaming Text", candidates: 7, rounds: 3, timing: "same word on 360 of 360 frames", runnerUp: "assistant-ui Streaming text",
  },
  {
    slug: "tool-call",
    load: () => import("../src/clones/tool-call/index.tsx"),
    meta: () => import("../src/clones/tool-call/meta.ts"),
    reference: "Arc UI · Tool call", candidates: 9, rounds: 5, timing: "within 0.04 s on 4 sequences", runnerUp: "UIStacks Tool call",
  },
  {
    slug: "agent-plan",
    load: () => import("../src/clones/agent-plan/index.tsx"),
    meta: () => import("../src/clones/agent-plan/meta.ts"),
    reference: "beUI Pro · Agent Plan", candidates: 6, rounds: 7, timing: "0 s timing error", runnerUp: "Arc UI Agent plan",
  },
  {
    slug: "approval",
    load: () => import("../src/clones/approval/index.tsx"),
    meta: () => import("../src/clones/approval/meta.ts"),
    reference: "Arc UI · Agent approvals", candidates: 8, rounds: 5, timing: "within 0.04 s, approve and deny", runnerUp: "beUI Pro Tool Approval",
  },
  {
    slug: "model-selector",
    load: () => import("../src/clones/model-selector/index.tsx"),
    meta: () => import("../src/clones/model-selector/meta.ts"),
    reference: "Arc UI · Model picker", candidates: 8, rounds: 4, timing: "0 s timing error", runnerUp: "beUI Pro Model Picker",
  },
  {
    slug: "orb-presence",
    load: () => import("../src/clones/orb-presence/index.tsx"),
    meta: () => import("../src/clones/orb-presence/meta.ts"),
    reference: "Wensity · ChatGPT Orb", candidates: 7, rounds: 3, timing: "clock within 15 ms, sway within 1.1 %", runnerUp: "Wensity AI Orb",
  },
];
