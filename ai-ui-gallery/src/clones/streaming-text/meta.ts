import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Streaming reply",
  concept: "streaming-text",
  source: "Kobra",
  sourceUrl: "https://kobra.systems/components/streaming-text",
  license:
    "Kobra Pro (paid: Generative UI section, 'Buy component ($19)', code behind the Pro upgrade); no open-source license, so motion-faithful with original styling",
  fidelity: "motion-faithful",
  stage: { width: 607, height: 548, background: "#f7f5f0" },
  pickedBecause:
    "The most complete streaming reply of the set: a whole markdown answer (heading, source pill, list, code card) streams one word per frame through a colour trail into ink, keeps its final height from the start, and ends with a Replay that blurs it out and streams it again.",
};
