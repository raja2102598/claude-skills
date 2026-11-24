import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Tool approval",
  concept: "approval",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/blocks/agent-approvals",
  license: "Arc UI Pro (paid block, source behind the Pro plan); no open-source license, so motion-faithful with original styling, copy and marks",
  fidelity: "motion-faithful",
  stage: { width: 672, height: 650, background: "#f5f4f1" },
  pickedBecause:
    "The fullest approval lifecycle of the set: a queue of agent tool calls with risk, reason and arguments, and a decision that reads back (sending, then approved or denied) before the next request rises into focus while the counts roll.",
};
