import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Agent run timeline",
  concept: "agent-timeline",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/agent-timeline",
  license:
    "Paid (Arc UI Pro; the page carries a Pro badge and a Get Pro link). Rebuilt from captures and rAF probes only, no source used.",
  fidelity: "motion-faithful",
  stage: { width: 669, height: 403, background: "#f8f8f8" },
  pickedBecause:
    "The run itself on one time axis: a planner and four agents as rows, a playhead that grows every bar, handoff links that draw out and back, live seconds, tokens and cost, a failed and retried tool call, then a summary; with hover details, click-to-trace, pause, restart, 2x and scrubbing.",
};
