import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Trace waterfall",
  concept: "trace-waterfall",
  source: "beUI Pro",
  sourceUrl: "https://pro.beui.dev/components/agent-traces",
  license:
    "beUI Pro (paid; the page sells plans and the block's code sits behind a login), no open-source license, so motion-faithful with original styling. Rebuilt from captures only.",
  fidelity: "motion-faithful",
  stage: { width: 1070, height: 881, background: "#12141a", dark: true },
  pickedBecause:
    "The most polished and complete waterfall of the set: a run header with rolling stat odometers, kind legend, a playhead that replays the run while bars fill in real order and unreached rows stay dim, an inline failed span with its retry, collapsible subtrees and a detail panel with timing, tokens, input and output.",
};
