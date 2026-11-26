# ai-button: reanimate report

**Fidelity: motion-faithful.** Reference: the Gradient cell of Wensity "AI Button" (https://ui.wensity.com/components/ai-button). Wensity marks it Pro and no open-source license was found. The clone uses its own teal gradient (#2bc4b4 to #0b6b73), DM Sans, an own-drawn sparkle SVG and lucide Check. The code is written fresh.
**Scope:** the gradient button only. The other five variants and the page chrome are out of scope.
**Added:** aria-label, a reduced-motion path, a `?gap=` query parameter (see Method), and click-to-stop while running (not checked against the reference).
**Trigger:** click the button. It runs idle sparkle "Write with AI", then stop square + shimmering "Reading the page" (2.2 s), "Writing" (2.0 s), check + "Done" (1.8 s), and back to idle.

## Code
- `src/clones/ai-button/index.tsx`: a state machine idle → reading → writing → done → idle.
  - Phase timers are 2200 / 2000 / 1800 ms, on a rAF + performance.now timer (setTimeout did not advance under the capture's virtual clock).
  - Each swap renders an exit layer and an enter layer. The exit layer blurs, fades and moves (110 ms ease-in). The enter layer blurs in with a rise or scale (180 ms ease-out).
  - The width of the clip span is set from measured label widths, 330 ms after each swap (`GAP`), with a 300 ms cubic-bezier(.23,1,.32,1) transition; the label is clipped by the shrinking or growing width.
- `ai-button.css`: loading shimmer (1.8 s linear band across the label, 260 % background), sheen band (2.4 s ease-in-out, 105 deg, 300 % background), hover brightness 1.12, sparkle rotate 90 deg and scale 1.07 on hover (600 ms), and the reduced-motion rules.
- `meta.ts`: stage 260x110 on #000.

## Method
- Both captures: 1440x900, `--clock virtual`, `--trigger click`, 25 fps, 7600 ms, `--wait-before 3000`, crop 260x110 centred on the button. Reference `--clip 713,244,260,110` after `scrollTo(0,300)`; clone `--selector "[data-stage]"`.
- **Virtual-clock trap.** The reference's blur swaps run on WAAPI and collapse to about one frame under the virtual clock; its width runs on JS and is exact. So that the clone matches the reference's width timing, the compare capture uses `?gap=0`, which removes the 330 ms exit wait (default 330 ms).
- **Real-clock measurement.** The reference's real-clock swap-to-width gap, measured with a MutationObserver under load, was 335 / 313 / 408 / 471 ms; 330 ms was chosen. Not re-measured on the clone.
- **Verification palette.** For the compare capture only, a `--pre-js` overrides the clone's gradient CSS variables to the reference's colours and drops the clone's ring shadow, so pixel comparison measures motion rather than palette. The shipped clone keeps its own teal palette.
- **Rounds.** Round 1 real clock; round 2 virtual clock and the rAF timer; round 3 palette, text dim level, icon and enter speed; then one palette-only verification capture (clone-7) with no change to shipped code. Real-clock compare was unusable under load (duplicate frames, 0.3 s click jitter).

## Verification (final, compare-7)
Mean mismatch 4.22 % over 196 frames, worst frame 10.1 % (threshold 5 %). **PASS.**
Timing error vs reference: start 0 s, end -0.04 s, duration -0.04 s, peak +0.04 s (limit 0.08 s). **PASS.**

Sheet: `compare-7/sheets/compare-01.webp`.

Activity bursts (reference vs clone), covering every burst of motion in the activity curve:
- label swap + width grow to 195: 0.20-0.48 s vs 0.24-0.48 s
- reading to writing: 2.40-2.68 s vs 2.44-2.64 s
- writing to done: 4.40-4.60 s vs 4.44-4.60 s
- done to idle: 6.20-6.48 s vs 6.28-6.44 s
The shimmer and sheen produce small activity in both captures and are not separate bursts.

| # | element / property | reference | clone | result |
|---|---|---|---|---|
| 1 | width reading (starts 33 ms, 195 px at 233 ms) | 161 to 195, fast ease-out | 161 to 195, starts 50 ms, 195 at 217 ms | pass (+17 ms start; end 16 ms earlier) |
| 2 | width writing (starts 2233 ms, 121 px at 2467 ms) | 195 to 121 | starts 2250 ms, 121 px at 2467 ms | pass (+17 ms start, 0 ms end) |
| 3 | width done (starts 4233 ms, 107 px at 4400 ms) | 121 to 107 | starts 4250 ms, 107 px at 4350 ms | pass (+17 ms start, -50 ms end) |
| 4 | width idle (starts 6033 ms, 161 px at 6250 ms) | 107 to 161 | starts 6050 ms, 161 px at 6200 ms | pass (+17 ms start, -50 ms end) |
| 5 | label and icon blur swap | blur, fade, rise or scale, about 120-150 ms visible (real clock) | blur, fade, translateY 0.4em or scale .5, 110 ms out, 180 ms in | pass by eye on sheets; the virtual clock cannot measure the reference's WAAPI motion |
| 6 | shimmer on loading label (1.8 s) and sheen band (2.4 s) | present | present, same periods | pass by period only; phase not matched |
| 7 | hover (brightness, sparkle rotation) | brightness 1.12, star rotates 90 deg | same values | not captured as a separate hover row |

## Residual deviations
1. Mean mismatch 4.22 %, all static: DM Sans vs the reference's font, the own sparkle drawing, and gradient and shadow details. A region-only compare of the button interior is 15.2 %, because the text and icon dominate the box.
2. Start offset +17 ms, within one frame, from click latency in the virtual clock.
3. The real-clock gap of 330 ms is a single value; the measured values ranged from 313 to 471 ms under load.
4. The reference crop includes the top of the "Gradient" caption below the button; the clone stage has none.
5. Shimmer phase is not aligned, and the shimmer dim alpha (0.78) was estimated from frames.
6. Hover was not compared frame by frame.
