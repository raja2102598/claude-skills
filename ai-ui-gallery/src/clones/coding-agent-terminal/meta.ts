import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Terminal output",
  concept: "coding-agent",
  source: "AI Elements",
  sourceUrl: "https://ui.shadcn.com/docs/ai-elements/base/terminal",
  license:
    "Apache-2.0 (github.com/vercel/ai-elements LICENSE, Copyright 2023 Vercel, Inc., verified) and MIT (shadcn/ui, demo at apps/v4/examples/base/terminal-demo.tsx). Pixel-faithful: same Geist fonts, colours, spacing, radii and sample copy, attribution: AI Elements by Vercel.",
  fidelity: "pixel-faithful",
  stage: { width: 638, height: 517, background: "#ffffff" },
  pickedBecause:
    "Shell commands the agent runs, one after another: each line shimmers while it runs, its output streams into an expanding code block line by line, then the block folds shut as the next command starts.",
};
