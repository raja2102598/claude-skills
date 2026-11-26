import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Prompt studio",
  concept: "prompt-library",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/blocks/prompt-studio",
  license: "Arc UI Pro (paid, license not verifiable); motion-faithful with original styling",
  fidelity: "motion-faithful",
  stage: { width: 540, height: 960, background: "#f6f4f0" },
  pickedBecause:
    "The only candidate that covers the whole prompt workflow in one card: a system/user editor with variable chips, a live token counter, variable fields with test cases, a simulated run that thinks, streams and settles, and version and model pickers. The others show a list or a history, not a place to edit and test.",
};
