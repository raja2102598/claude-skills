/*
 * Damped springs sampled into CSS linear() easings, so entrances run as CSS keyframes (the same on the real clock and
 * on a capture's virtual clock). Parameters were fitted to the reference's measured curves (see spec.md):
 *   ENTER   ω 20.8, ζ 0.84: status / transcript-row / outcome fades (450 ms) and their slides (cut at 250 ms)
 *   ICON    ω 22.8, ζ 0.57: goal icon pop (500 ms, ~11 % overshoot)
 *   BADGE   ω 23,   ζ 0.48: outcome check badge, after an 80 ms hold (680 ms, ~18 % overshoot)
 */

function spring(tSec: number, w: number, z: number) {
  if (tSec <= 0) return 0;
  if (z >= 1) return 1 - Math.exp(-w * tSec) * (1 + w * tSec);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tSec) * (Math.cos(wd * tSec) + ((z * w) / wd) * Math.sin(wd * tSec));
}

/** Sample the spring over `ms` (plus an optional hold at 0) into a linear() easing that ends exactly at 1. */
function springEasing(w: number, z: number, ms: number, holdMs = 0, steps = 40) {
  const total = ms + holdMs;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const tMs = (i / steps) * total;
    const v = i === steps ? 1 : spring((tMs - holdMs) / 1000, w, z);
    pts.push(`${v.toFixed(4)} ${((i / steps) * 100).toFixed(2)}%`);
  }
  return `linear(${pts.join(", ")})`;
}

export const EASE = {
  enter: springEasing(20.8, 0.84, 450),
  enterSlide: springEasing(20.8, 0.84, 250, 0, 25),
  icon: springEasing(22.8, 0.57, 500),
  badge: springEasing(23, 0.48, 600, 80, 50),
};
