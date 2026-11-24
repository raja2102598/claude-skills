import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Reasoning tree",
  concept: "reasoning-tree",
  source: "Arc UI",
  sourceUrl: "https://uiarc.dev/components/reasoning-tree",
  license: "Paid (Arc UI Pro; the page carries a Pro badge). Rebuilt from captures only, no source used.",
  fidelity: "motion-faithful",
  stage: { width: 667, height: 539, background: "#ffffff" },
  pickedBecause:
    "The only candidate, and a complete one: beam search drawn as a tree. Thoughts are proposed, scored, pruned to a beam of 1–3, and the winning path lights up, with play/pause, step, reset and a beam-width control.",
};
