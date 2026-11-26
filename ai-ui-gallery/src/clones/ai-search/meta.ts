import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "AI search bar",
  concept: "ai-search",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/blocks/ai-search-bar",
  license: "Arc UI Pro (paid block, source behind the Pro plan); no open-source license, so motion-faithful with original styling",
  fidelity: "motion-faithful",
  stage: { width: 640, height: 502, background: "#ece7dd" },
  pickedBecause:
    "A full search-to-answer loop in one card: typing lists grouped results, Tab asks the AI, a thinking skeleton turns into a streamed answer whose numbered citations light up the matching results, then the card resets and a suggested question runs the same way.",
};
