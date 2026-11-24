import type { ComponentType } from "react";

export type Fidelity = "pixel-faithful" | "motion-faithful";

export interface CloneMeta {
  /** Display name, e.g. "Thinking indicator". */
  title: string;
  /** Concept id from concepts.json, e.g. "thinking-indicator". */
  concept: string;
  /** Catalog the chosen reference came from, e.g. "assistant-ui". */
  source: string;
  /** Exact page that was captured. */
  sourceUrl: string;
  /** License of the reference as far as it could be verified, e.g. "MIT" or "paid preview". */
  license: string;
  fidelity: Fidelity;
  /**
   * The capture stage. Width and height equal the reference crop so reanimate compares like with like.
   * background is the colour behind the component in the reference preview.
   */
  stage: { width: number; height: number; background: string; dark?: boolean };
  /** One line on why this candidate beat the others in its concept. */
  pickedBecause?: string;
}

export type CloneComponent = ComponentType;
