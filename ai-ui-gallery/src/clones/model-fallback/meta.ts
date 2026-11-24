import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Model fallback",
  concept: "model-fallback",
  source: "UIStacks",
  sourceUrl: "https://uistacks.dev/components/model-fallback",
  license: "Paid (UIStacks Pro, $159; code gated behind a license key). Rebuilt from captures only, no source used.",
  fidelity: "motion-faithful",
  stage: { width: 490, height: 500, background: "#f4f4f5" },
  pickedBecause:
    "Only candidate, and a complete one: an ordered chain of models, each stopping for a stated reason (timed out, rate limited) with the time it cost, a live header that follows the attempt, rolling latency totals, and a settled “Answered by” state.",
};
