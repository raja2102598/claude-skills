import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Mention picker",
  concept: "prompt-mention",
  source: "UIStacks",
  sourceUrl: "https://uistacks.dev/components/mention-prompt",
  license: "UIStacks Pro (paid component, source behind a Pro license key); no open-source license, so motion-faithful with original styling",
  fidelity: "motion-faithful",
  stage: { width: 560, height: 352, background: "#f4f3f0" },
  pickedBecause:
    "The only candidate that plays the whole picker: '/' and '@' open a grouped list at the caret that narrows as you type, closes on a space and reopens for a two-word name, and drops each pick into the text as a chip, with a spring pop, an exit shrink and a caption that steps aside.",
};
