// One image's run as a function of time. All numbers were measured on the reference with the virtual clock
// (see .reanimate/image-generation/spec.md, timeline rows 5-13); t is in ms on the reference's clock, where the
// run starts at RUN_AT. `slot` is the image's place in the strip: later slots colour 250 ms and resolve 400 ms later.

import { bezier, smoothstep, type FieldFrame } from "./field";

export const RUN_AT = 533; // the auto-submit fires this long after mount
export const RESOLVE_AT = 3910;
export const RESOLVE_MS = 1290;
export const DONE_AT = 5270;
export const COLOUR_STAGGER = 250;
export const RESOLVE_STAGGER = 400;
const PERCENT_MS = 4650;

/** Wave and colour state of the dot field for an n x n field `px` wide (the stage is 440). */
export function fieldAt(t: number, slot: number, px: number): FieldFrame {
  const s = t / 1000;
  const theta = 0.59 * s + 2.409;
  const k = px / 440;
  const lag = COLOUR_STAGGER * slot;
  return {
    mode: "run",
    bx: (180.5 - 163.3 * Math.sin(theta)) * k,
    by: (189.8 + 58 * Math.cos(theta)) * k,
    sigma: (90 + 0.028 * Math.max(0, t - RUN_AT)) * k,
    fade: smoothstep(1400 + lag, 3600 + lag, t),
    c: smoothstep(1300 + lag, 3550 + lag, t),
  };
}

/** Resolve progress 0 → 1: dots blur out while the image sharpens in. cubic-bezier(.30, 0, .55, 1). */
export const resolveAt = (t: number, slot: number) =>
  bezier(0.3, 0.55, (t - RESOLVE_AT - RESOLVE_STAGGER * slot) / RESOLVE_MS);

export const doneAt = (slot: number) => DONE_AT + RESOLVE_STAGGER * slot;

/** The "Generating n%" read-out: an ease-out power curve that lands on 100 as the image resolves. */
export function percentAt(t: number, slot: number) {
  const u = Math.min(1, Math.max(0, (t - RUN_AT) / (PERCENT_MS + RESOLVE_STAGGER * slot)));
  return Math.max(1, Math.round(100 * (1 - (1 - u) ** 1.27)));
}
