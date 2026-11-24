import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Agent map",
  concept: "agent-map",
  source: "UIStacks",
  sourceUrl: "https://uistacks.dev/components/agent-map",
  license:
    "Not verifiable as open source (UIStacks component catalog, no license file or page found for the component). Rebuilt from captures and rAF probes only, no source used.",
  fidelity: "motion-faithful",
  stage: { width: 870, height: 533, background: "#f4f4f5" },
  pickedBecause:
    "A real orchestration graph rather than a list: lead, agents and tools in columns, a path that draws on from the lead to the tools a node uses, call dots paced by calls per minute, a details panel, a needs-you approval that pauses one agent, keyboard navigation and a 12 s auto-tour.",
};
