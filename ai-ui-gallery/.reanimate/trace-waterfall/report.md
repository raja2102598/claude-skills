# trace-waterfall: reanimate report

**Fidelity: motion-faithful.** The reference is beUI Pro "Agent Traces → Trace waterfall" (paid), https://pro.beui.dev/components/agent-traces. The live preview card is cropped to 1070x881 at a 1440 px wide viewport.

**Cloned:** the run card.
- **Header:** run id, title, status pill, and four stat odometers that roll on mount.
- **Toolbar:** legend chips per span kind, a time readout, Pause / Resume, and Replay.
- **Waterfall:**
  - 15 nested spans on a 9.18 s axis, with tick labels and grid lines.
  - Duration labels that switch sides near the end of the axis.
  - A striped failed span (name and label in the error colour, alert icon) followed by its retry.
  - A selected row: a pill behind the row and a ring on its bar.
- **Detail panel:** kind pill, timing bar with Start / End, four facts, an error line for failed spans, Input, Output, and Attributes.
- **Motion:** on mount, a fast intro sweep. Replay plays a 6 s sweep in which each bar fills as the playhead crosses it and each row lights up from 0.4 to 1 when the playhead reaches its start.

**Interactions carried over** (present in the reference, not frame-compared):
- Pause / Resume.
- Selecting a row swaps the detail panel (220 ms opacity + blur + 4 px rise).
- Chevrons collapse and expand subtrees; revealed rows fade and drop in over 200 ms.
- Legend chips dim a kind's rows to 0.2 over 200 ms, and the chip's dot shrinks.

**Added:** `?autoplay=0` capture mode, which shows the finished state and waits for Replay; a reduced-motion path with no intro and no odometer roll; and an empty-panel hint when the selection is cleared.

## Code
- **`src/clones/trace-waterfall/index.tsx`**
  - The playhead is a rAF loop that commits each frame with `flushSync`.
  - Each sweep is anchored at the press (`performance.now()`), and the end is taken at `p ≥ total − 0.5 ms`.
  - Fill = clamp((p − start) / duration) as `scaleX` from the left edge. Row opacity is a step: 0.4 until the playhead reaches the span's start, then 1.
  - Intro: 2400 ms linear. Replay: 6000 ms linear.
  - Odometers: CSS keyframes per digit column. The easing is an exponential ease-out (τ = 130 ms) sampled into `linear()` over 900 ms.
- **`data.ts`:** spans with the reference's schedule and our own names, facts and texts.
- **`trace-waterfall.css`:** Plex fonts, tokens, kind colours, error stripes, and the odometer, panel and row keyframes.
- **`meta.ts`:** stage 1070x881 on #12141a, dark.
- **Trigger:** mount (intro). With `?autoplay=0`, click `[data-tw-replay]`. Pause is `[data-tw-pause]`.

## Method
- **Replay captures:** virtual clock, 25 fps, 1440x1000, 200 ms pre-roll, Replay clicked as the trigger.
  - Reference crop: `section.max-w-6xl`. Clone crop: `[data-stage]`.
  - Every motion is JS-driven (rAF and motion values) or an instant style switch, so the virtual clock is exact and there are no WAAPI rows.
  - The playhead, 4 bar fills and 2 row opacities were tracked every 16.7 ms and compared sample by sample. The playhead x was also read from the frames.
- **Intro:** the reference with the card scrolled into view against the clone on load, compared from the tracks.

## Verification (round 3 of 3)

| sequence | mean mismatch | timing error (start / end / duration) | result |
|---|---|---|---|
| Replay, whole card, 181 frames | 3.27 % (palette, font and copy differ by design) | 0 / 0 / 0 s | PASS |
| Replay, bars region (450x628) | 2.55 % | motion frames 5–155 on both: 0 / 0 / 0 s | PASS |

| # | element / property | timing ref → clone | easing ref → clone | curve diff | result |
|---|---|---|---|---|---|
| 1 | playhead x, 0 → 428 px | first visible 33.3 → 33.3 ms; same frames (7–155) | linear 0.0713 px/ms → same | mean 0.00 px, max 0.04 px over 359 samples; frame-read x equal in every checked frame | pass |
| 2 | playhead visibility | on 33.3 → 33.3 ms, off 6016.7 → 6016.7 ms | step | – | pass |
| 3 | bar fills, scaleX 0 → 1 | root 83→83 / 6017→6017; row 2 50→50 / 183→183; failed span 1300→1300 / 1917→1917; row 9 2467→2467 / 4050→4050; row 10 4083→4100 / 5517→5517 ms | linear clamp → same | row 10 starts one sample late because its first value (0.00995) sits on the detection threshold | pass |
| 4 | row content opacity 0.4 → 1 | row 2 at 50 → 50 ms; row 9 at 2450 → 2450 ms | step → step | – | pass |
| 5 | readout | "0ms", "50ms", "4.51s", "9.10s", "9.18s" at frames 6 / 7 / 80 / 155 / 156 on both | – | identical text, including the reference's ≈35 ms lag | pass |
| 6 | pause button presence | from the click until frame 155 on both | step | – | pass |
| 7 | end state | 6017 ms on both | – | – | pass |
| I1 | intro sweep | 2400.4 → 2410 ms | linear 0.1783 px/ms → same (residual ≤ 0.14 → 0.01 px) | 10 ms longer | pass |
| I2 | stat odometer digit, translateY to digit × 1.1em | on mount | exp ease-out τ 130 ms → same | fraction of travel ≈0.71 → 0.71 at 159 ms, ≈0.855 → 0.865 at 259 ms, 0.94 → 0.94 at 359 ms, 0.99 → 0.99 at 559 ms (≤ 0.02 off) | pass |

**Sheet:** `compare-3/sheets/compare-01.webp`. The other sheets and the raw captures stay out of git.

## Rounds
1. **Round 1:** the layout matched. Every row ran 1 frame (16.7 ms) late: playhead +1 px behind, hidden at 6033 ms.
2. **Round 2:** starting on pointerdown did not change the timing and was reverted.
3. **Round 3:** anchoring the sweep at the press, plus a 0.5 ms end slack, put every row on the reference's frame. Round 3 was captured twice: once for the anchor, and once more after the end-slack edit.

## Residual deviations
1. **Fill start on row 10 is one 16.7 ms sample late in the track check.** It is threshold rounding (0.00995 vs 0.01 at 4083 ms); the curves are identical after that sample.
2. **Intro sweep is 10 ms longer (2410 vs 2400 ms).** The clone anchors the intro at its mount effect, while the reference starts on the frame after the card enters view. This is far inside ±80 ms.
3. **Odometer start is relative to mount.** The reference rolls its odometers on page load and starts the intro sweep when the card enters view. The clone does both on mount, because the gallery stage is always in view.
4. **Odometer blur not reproduced.** The reference's digit columns declare `will-change: transform, filter`, so a blur probably accompanies the roll. It was not measurable (the roll happens before the recorded window), so only the translate curve is cloned.
5. **Interaction transitions are modelled, not frame-measured.** This covers the panel swap, subtree expand and legend dimming. Their durations follow the reference's class names (200 ms opacity and transform), and the panel swap's 220 ms blur-fade is our own.
6. **Toolbar sits ≈1 px lower than in the reference.** This comes from font metrics; positions are otherwise within 1 px.
