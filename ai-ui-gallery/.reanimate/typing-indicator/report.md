# typing-indicator: reanimate report

**Fidelity: motion-faithful.** The reference is the **Typing** cell of Wensity "AI Typing Indicator" (https://ui.wensity.com/components/ai-typing-indicator): a dark chat bubble whose three dots rise and brighten one after another, in a loop. Wensity marks the component Pro, so the clone uses its own styling: a slate bubble (#1b2130) with a faint inner outline, slate-grey dots (#a9b4c8), its own corner radii and its own markup and CSS. It keeps the reference's black stage. The preview's other cells (Thinking step label, "Writing a reply" letter wave, Working matrix) are out of scope: the concept is typing dots, and the thinking line is its own concept in this gallery.
**Added:** a reduced-motion path (dots still at 0.55 opacity), `role="status"` with the label "Assistant is typing", and `animation-fill-mode: backwards`. On mount, the reference shows dots 2 and 3 at full opacity for 160 / 320 ms. With backwards fill, the clone shows them at rest instead.

## Code
- `src/clones/typing-indicator/index.tsx` is the component: a bubble holding a row of three dots. It plays on mount, with no JS timing.
- `src/clones/typing-indicator/typing-indicator.css` holds the loop: 1320 ms, keyframes at 0 / 28 / 56–100 %, a lift of −0.28 em (4.48 px) and opacity 0.32 → 1 → 0.32. Each segment uses cubic-bezier(0.45, 0, 0.55, 1). Dot delays are 0 / 160 / 320 ms. The file also holds the reduced-motion rule.
- `src/clones/typing-indicator/meta.ts`: the stage is 160x95 on #000 (dark).
- Trigger: mount. Plain CSS keyframes run the same on the real clock and the virtual clock.

## Method
- Reference vs clone: both at 1440x901, `--trigger none`, `--clock virtual`, 25 fps, 4000 ms (three loops), 160x95 crop.
- Both captures use a `--pre-js` that sets every `*dot*` animation to `currentTime = 2640` (two periods) and resumes it. Frame 0 is then the same loop phase on both sides: dot 1 starting its rise.
- Reference crop is `--clip 595,548,160,95`. The clone crop is `--clip 640,403,160,95`, which is exactly the `[data-stage]` rect, instead of `--selector "[data-stage]"`.
  - The selector path scrolls the element into view and spends about 300 ms more virtual time after the phase seek, which shifted the clone's loop by 300 ms.
  - The 901 px viewport puts the 95 px stage on a whole pixel, so the bubble sits at the same 46.1 / 25.1 px offset as in the reference crop.
- Numbers come from `inspect.json` (the dot CSS animations) and per-frame tracks of the three dots, compared over 249 shared samples (−150 to 3983 ms).
- A real-clock check (trigger load) confirmed the loop plays on load:
  - Dot peaks came 381 / 525 / 705 ms after mount (expected 370 / 530 / 690; real-clock jitter under load).
  - The next dot-1 peak came 1311 ms later.
  - No dot flashed to full opacity during its start delay.

## Verification (round 1 of 3)

compare-1 (whole crop): mean mismatch 0.79 %, worst 0.9 %. Timing error is 0 s at start, end and duration → PASS. The "peak −0.04 s" note comes from the activity curve's biggest frame being frame 12 vs 13, because the two palettes have different contrast. The per-frame tracks match exactly.

compare-1r (dot region 56,30 48x28): mean 0.73 %, worst 1.8 %. The motion window is frames 4–105 on both sides, and the activity curves move together frame by frame. The mismatch is colour only: a slate palette and an inner outline on the bubble edge, against the reference's zinc.

| # | element / property | timing err | easing ref → clone (fit, RMSE) | curve diff (whole window) | result |
|---|---|---|---|---|---|
| 1 | dot 1 translateY 0 → −4.48 → 0 px | peaks 167 / 1483 / 2808 ms on both (0 ms) | in-out, ~368 ms rise / ~350 ms fall, no overshoot, both sides (cubic-bezier(.45,0,.55,1) / ease-in-out fits, 0.014–0.03) | max 0.000 px, mean 0.000 | pass |
| 2 | dot 1 opacity 0.32 → 1 → 0.32 | same frames as row 1 | same | max 0.000 | pass |
| 3 | dot 2 translateY + opacity (+160 ms) | peaks 333 / 1650 / 2967 ms on both | in-out, no overshoot, both | max 0.000 / 0.000 | pass |
| 4 | dot 3 translateY + opacity (+320 ms) | peaks 483 / 1808 / 3133 ms on both | in-out, no overshoot, both | max 0.000 / 0.000 | pass |
| 5 | loop period 1320 ms, all three dots at rest for 261 ms | peak spacing 1316 / 1325 ms on both (16.7 ms sampling); activity resumes at frame 37 on both (33 frames = 1320 ms) | – | – | pass |
| 6 | bubble geometry | – | – | ref 67.81x44.78 at 46.1,25.1 → clone 67.84x44.8 at 46,25 (rounded rect); padding 14.4 / 16.8 on both | pass |
| 7 | dot geometry | – | – | 8 px dots, pitch 13.11 px; dot x identical, y 0.05 px apart in the crop | pass |

Sheet: `compare-1/sheets/compare-01.webp`, frames 0–14: the first wave, rows aligned, with red only on the bubble outline and the dot colour.

## Residual deviations
1. **Bubble colour and edge: about 0.8 % of crop pixels per frame.** This is the clone's own palette (slate #1b2130 with a 7 % outline vs zinc rgb(24,24,27)), as motion-faithful work requires. It is constant across frames, not motion.
2. **Bottom-left corner radius 6.4 px vs 7.2 px, other corners 22 px vs 22.4 px.** These are the clone's own radii. Size and position match to under 0.1 px.
3. **Mount state.** The reference shows dots 2–3 at full opacity for their first 160 / 320 ms after mount (no fill mode). The clone holds them at rest (0.32) through the delay. This happens once on mount and is outside the captured loop.
