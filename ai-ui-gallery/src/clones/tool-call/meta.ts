import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Tool call card",
  concept: "tool-call",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/tool-call",
  license:
    "Arc UI Pro (paid component, Pro badge, code behind the Pro plan); no open-source license, so motion-faithful with original styling. Rebuilt from captures only.",
  fidelity: "motion-faithful",
  stage: { width: 685, height: 430, background: "#f6f4f0" },
  pickedBecause:
    "The most complete tool-call pattern of the set: a grouped card whose calls stream in one by one with a shimmering live label and spinner, settle into results with timings, fail inline with a reason and Retry, ask for approval, then collapse under a streamed answer with Run again.",
};
