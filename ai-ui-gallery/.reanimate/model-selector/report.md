# model-selector — reanimate report

**Cloned:** Arc UI "Model picker" (https://uiarc.dev/components/blocks/model-picker), the live preview. A click on the pill opens the menu. The pointer rests on row 2, glides to row 3 and picks it. The menu closes, and the pill, its mark, the description and the changed prices cross-fade in place while the pill's width springs to the new label. A "Switched from …" note fades in.
**Fidelity:** motion-faithful (Arc UI Pro, paid; no open-source license). Own palette, Geist (Google Fonts), lucide icons, own marks, fictional models (Nova, Atlas, Orbit, Kite) and copy.
**Code:** `src/clones/model-selector/` (`index.tsx`, `models.tsx`, `model-selector.css`, `meta.ts`).
**Trigger:** in the gallery the demo plays once on mount (open, row 2, row 3, pick), then the picker is live. With `?autoplay=0`, a click on the pill opens it.
**Additions:** the Effort page (5 levels) and the More models page (grouped by vendor, scrolls) open inside the menu with a height spring. This copies the reference's own narrow-layout page mode; the 745 px stage would clip side submenus. Keyboard support: arrows, Home/End, Enter, Esc/ArrowLeft to go back. Outside click closes the menu. Focus returns to the pill on close.

## Final compare (round 4: `compare-4/`, virtual clock, 25 fps, 76 frames, crop 745×620)

| metric | value | result |
|---|---|---|
| timing error (start / end / duration / peak) | 0 / 0 / 0 / 0 s | PASS (limit 0.08 s) |
| mean mismatch | 1.33 % (palette, font and copy differ by design) | PASS |
| worst frame | #43 (1.72 s, 2.0 %): reference WAAPI fades collapse on the virtual clock, see residual 1 | expected |

Per spec row. Virtual-clock rows compare the reference and clone `track.json`; WAAPI rows compare real-clock rAF probes of both sides. The probe scripts and their JSON stay out of git with the raw captures.

| # | row | reference | clone | easing match | result |
|---|---|---|---|---|---|
| 1 | menu mounts on click | frame 0 | frame 0 | – | PASS |
| 2 | menu opacity 0→1 | 0→133 ms | 0→133 ms, max diff 0.000 | cubic-bezier(.16,1,.3,1), easing.ts rmse 0.0003 | PASS |
| 3 | menu translate(0,-6) scale(.97)→none | 0→450 ms | 0→450 ms, max diff 0.5 % of travel | critically damped spring (own sampled linear()) | PASS |
| 4 | chevron 0→180° | 17→450 ms | 17→450 ms, max 0.8° (0.5 %) | same spring | PASS |
| 5 | pill border/fill open↔hover | 100/150 ms (.22,1,.36,1) | same CSS transitions | same | PASS (masked: the pointer stays on the pill) |
| 6 | highlight appears on row 2 | 716.7 ms | positioned at 700 ms (opacity 0), visible from 716.7 ms | – | PASS |
| 7 | highlight opacity 0→1 (WAAPI) | 100 ms ease-out | 100 ms ease-out; real clock within 0.01 at every offset | same | PASS |
| 8 | highlight glide row 2→3 (60→114 px) | 1117→1450 ms | 1133→1467 ms, max 0.67 px (1.2 %) | spring k676/c52; easing.ts both "material emphasized ~293 ms", visible 267 ms, 0 % overshoot | PASS |
| 9–10 | menu close: opacity 1→0, translate(0,-3) scale(.985) | 1517→1583 ms | 1517→1583 ms, max diff 0.000 | (.22,1,.36,1) 100 ms | PASS |
| 11 | menu removed | 1616.7 ms | 1616.7 ms | – | PASS |
| 12 | highlight fade-out on pick (WAAPI) | 100 ms ease-out | 100 ms ease-out | same | PASS (inside a menu already ≤ 0.02 opacity) |
| 13 | chevron 180→0° | 1517→1950 ms | 1517→1950 ms, max 0.8° | spring | PASS |
| 14 | pill open→hover colours | 100/150 ms | same | same | PASS |
| 15–16 | swap: old layer 1→0 in 100 ms, new 0→1 in 150 ms (WAAPI) | from getAnimations() | CSS keyframes with the same durations and easing | (.22,1,.36,1) | PASS (see residual 1) |
| 17–19 | new pill text and fact values lift 3→0, description and note lift 4→0, mark scale .9→1 | start 1516.7 ms, 150 ms | start 1516.7 ms (one-frame delay); change note max 0.034 px | (.22,1,.36,1), fit error < 0.01 | PASS |
| 20 | change note appears | 1500 ms | 1500 ms | – | PASS |
| 21 | pill text width spring (pill re-centres) | 157→125, 1533→1833 ms | 156→124, 1533→1833 ms, max 0.7 % of travel | spring k676/c52; easing.ts identical verdicts | PASS |

Sheet: `compare-4/sheets/compare-01.webp`. The other four sheets of the final round stay out of git.

## Residual deviations

1. **WAAPI rows on the virtual clock (rows 7, 12, 15, 16, 20).** The reference runs these fades through motion's WAAPI, which the virtual clock does not advance. In `ref/` the new layers show at full opacity on the pick's first frame. The clone shows its measured 150 ms curve: 0.44 at 1.52 s and 0.72 at 1.53 s. This makes frame #43 (2.0 %) and #44 the largest diffs. The durations and easings come from `document.getAnimations()`.
   - **Hover fade, real clock:** matches within 0.01 at every offset.
   - **Swap, real clock:** the reference reads up to ~30 ms ahead of the clone. That is one to two probe frames of jitter on a loaded machine, within ±80 ms.
2. **Highlight on hover.** The clone places the highlight on row 2 one frame earlier (700 ms vs 716.7 ms) while it is still at opacity 0. Nothing is visible. The first visible frame is the same.
3. **Pill text width.** 156→124 px against the reference's 157→125 px, because the fictional names measure 1 px narrower. The travel is 32 px on both, and the curve matches within 0.7 %.
4. **Chevron and menu spring curve.** The clone uses its own critically damped spring (ω 18.25/s, fitted to the reference curve with rms 0.001), sampled into `linear()`. The largest difference is 0.8° (0.5 %).
5. **Description lift in the row comparison.** The table shows a 4 px difference at 1500 ms. This is a tracking artefact: the tracker picks the old layer in the reference and the new layer in the clone. The change note, which has a single layer, matches within 0.034 px.
6. **Effort and More models pages are not frame-verified.** One real-clock probe at 390 px showed an instant page swap and a height spring of about 360 ms. The clone uses the same swap and the row-8 spring.
7. **Scripted events.** The scripted events fire 0.5 ms before each frame boundary (699.5, 1099.5 and 1499.5 ms) on both sides. At exactly 1500 ms, sub-ms jitter in the pointerdown time put the clone's pick one frame after the reference's. This was fixed in round 2.
8. **Palette, font, copy and marks differ by design.** Geist replaces Inter, warm tones replace the reference's greys, and fictional models replace the real ones. This is the motion-faithful level.

Rounds:
- **Round 1:** layout and every CSS row matched. The pick landed a frame late, and the pill width was measured with the fallback font.
- **Round 2:** event timing aligned; the pill width now follows the web font.
- **Round 3:** the lift and pop are delayed one frame to match the reference's JS start, and the focus ring shows only after keyboard use.
- **Round 4:** shorter row blurbs so the check never truncates them. Final.
