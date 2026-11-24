import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Subagent run",
  concept: "agent-handoff",
  source: "AI Elements",
  sourceUrl: "https://ui.shadcn.com/docs/ai-elements/base/subagent",
  license:
    "MIT (shadcn/ui, LICENSE.md: Copyright (c) 2023 shadcn; demo at apps/v4/examples/base/subagent-demo.tsx in shadcn-ui/ui). Pixel-faithful: same Geist font, colours, spacing, radii and sample copy, with this attribution.",
  fidelity: "pixel-faithful",
  stage: { width: 638, height: 517, background: "#ffffff" },
  pickedBecause:
    "The clearest agent-to-agent handoff of the set: the agent delegates to a research subagent whose own tool calls stream in nested under it with spinners and a shimmering live label, then the subagent reports back and the parent streams its answer.",
};
