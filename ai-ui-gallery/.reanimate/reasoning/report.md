# reasoning: reanimate report

**Fidelity: motion-faithful.** The reference is Arc UI's "Reasoning block" (Pro, paid), https://uiarc.dev/components/reasoning-block. The clone covers the whole demo:
- **State switch:** Live / Finished / Interrupted, with a spring-sliding pill.
- **Live run:**
  - A shimmering "Thinking" label with a seconds counter that cross-fades (0s→3s), and a Stop button.
  - At 0.9 s a two-line window springs open. Four steps of reasoning stream into it in fading chunks, and the window scrolls up one line (20 px spring) whenever a chunk wraps onto a third line. Each step's paragraph cross-fades into the next.
  - At 4.23 s it folds away and the label cross-fades to "Thought for 4s". At 5.35 s the card opens into four headed steps on a dotted timeline, with a "Done" footer and a copy button. It folds again at 9.95 s and loops at 10.87 s.
- **Other states:**
  - Stop gives "Stopped after Ns"; opening the card then shows the steps so far and "Stopped before finishing".
  - Finished is open with "Thought for 7s".
  - Interrupted shows an alert, Retry, partial steps and an error footer.
  - The header toggles the card. Reduced motion turns off the shimmer and the fades, and the springs jump to their end values.

Own styling throughout: blue-black ink, an indigo lucide Sparkle mark in place of the reference's vendor logo, a teal check, Geist from Google Fonts, lucide icons, and placeholder copy ("Nova 2" tracing stale search-cache results). No source, CSS, SVG or text from the site is used.
**Added:** nothing.

## Code
- `src/clones/reasoning/index.tsx`: the component.
  - Each live-run step is a timer that commits with `flushSync`, so it lands on the next frame.
  - Heights and the line scroll use a critically damped rAF spring: visualDuration 0.2 s, bounce 0, k 685, c 52.4. The pill uses a softer spring (visualDuration 0.3 s).
  - The swaps use a small `Swap` cross-fade, and `Clip` handles the height and fade.
- `src/clones/reasoning/reasoning.css`: the Geist import, tokens, and the shimmer, which is a 300 % background with a band, on a 2.4 s cycle. It also holds the fade and rise keyframes (exit 100 ms (.22,1,.36,1); enter 150 ms (.16,1,.3,1); the label rise has a 17 ms delay), the mask, the chevron transition and the reduced-motion rules.
- `src/clones/reasoning/data.ts`: the steps, pre-split into chunks. The split points were measured in the page with the real font, so the chunk that wraps onto line 3 lands at the reference's times.
- `src/clones/reasoning/meta.ts`: stage 618x565 on #f4f5f8.
- **Triggers:** the run starts on mount. Tabs are `[data-rb-tab]`, the Stop button is `[data-rb-stop]` and the header toggle is `.rb-toggle`.

## Method
- **Capture:** reference and clone share every setting: viewport 1440x1100, a 618x565 crop (the reference clip `404,425,618,565`, the clone `[data-stage]`), and `--clock virtual`, 25 fps, 11.8 s. `--pre-js` clicks "Finished" and the trigger is a click on "Live". The comparison uses `--offset 0`.
- **Opacity:** the reference runs its opacity through WAAPI (motion), and the virtual clock collapses those animations to 1–2 frames. The opacity rows were therefore measured with real-clock rAF probes plus a hook on `Element.animate` (durations and easings). The clone uses CSS keyframes for opacity, so it behaves the same on both clocks.
- **Event timing:** a 25 fps frame shows any timer change made at or before its time, and the track samples at 60 Hz. Each event was placed inside the overlap of the reference's rAF window and its first visible frame. For example, the step swaps are about 1955 / 3037 / 4037 ms and the counter ticks about 1037 / 2118 / 3197 ms.
- **Rounds:**
  1. A collapsed margin left the window springing to 40 px and then snapping to 44. Events landed one frame late.
  2. Times moved 2 ms early; the window got `flow-root`; the shimmer and the label delay were tuned. React batching still raced the frame.
  3. `flushSync` fixed the ticks. The swaps were still one 25 fps frame late.
  4. Swaps and ticks moved into the reference's frame windows. The reference's sliding pill was found.
  5. The pill spring was added.

## Verification (round 5 of 5)
compare-5: 301/301 frames at offset 0. Mean mismatch is 2.80%: 0.2–0.3 % on collapsed-card frames and 6.3 % on open-card frames, from copy, font and palette, as expected for motion-faithful work. Timing error is start 0.00 s, end +0.04 s, duration +0.04 s → **PASS**.

Curve differences are `easing.ts --compare-track` on the virtual tracks unless marked "real".

| # | element / property | timing (ref → clone) | easing (ref → clone) | curve diff | result |
|---|---|---|---|---|---|
| 0 | state pill slide Finished→Live | same start; 96 % → 94 % at +280 ms | spring, ω≈17.5 → same | progress −10 pts at +40 ms, mean ≈4 % of travel | pass |
| 1 | Finished → Thinking 0s | frame 5 / frame 5 | instant | – | pass |
| 2 | label shimmer | first visible 0.28 s / 0.28; gone 1.92 / 1.92; next sweep 2.68 / 2.68 | linear sweep, 2.4 s cycle | centroid ≤2.6 px apart | pass |
| 3 | counter 0→3s (tick) | rAF 1050/2133/3217 → 1050/2133/3200; frames 1040/2120/3200 on both | fade 100/150 ms + y ∓4 px | real: new .53/.79/.90, old .40/.13/.04 | pass |
| 4 | chevron appears | 900 / 900 | instant | – | pass |
| 5 | live window open 0→44 (+fade) | 933 / 933 | spring vd 0.2 → same | max 0.14 px, mean 0.02 px | pass |
| 6 | stream chunks (25 appends, 4 steps) | all on the same ticks (e.g. 950 / 950) | 150 ms fade (.22,1,.36,1) | 0 / .44 / .72 / .87 on both | pass |
| 7 | line scroll +20→0 at wraps | 1067 / 2200 / 3200 / 4200 on both | spring vd 0.2 → same | max 0.06 px | pass |
| 8 | step swap cross-fade | rAF 1967 / 3050 / 4050 on both | 100 out / 150 in | real: as #3 | pass |
| 9 | Stop removed | 4233 / 4233 | instant | – | pass |
| 10 | label → "Thought for 4s" (rise 2→0) | rise visible on the same ticks | 150 ms (.16,1,.3,1) → same | max 0.03 px | pass |
| 11 | window fold 44→0 (+fade) | 4267 / 4267 | spring → same | max 0.28 px, mean 0.04 px | pass |
| 12 | panel open 0→437.2 (+fade) | 5383 / 5383 | spring → same | max 1.35 px (0.3 %), mean 0.25 px; real fade .438/.717/.867 vs .466/.734/.875 | pass |
| 12c / 13c | chevron 0↔180° | 5350 / 5350; 9967 / 9967 | CSS 200 ms (.22,1,.36,1) | identical | pass |
| 13 | panel close (+fade) | 9983 / 9983 | spring → same | max 1.39 px, mean 0.2 px; real fade .403/.134/.038 vs .417/.140/.041 | pass |
| 14 | loop restart | 10867 / 10867; second stream 11783 / 11767 | as #10 | – | pass |
| 15 | holds 4.6–5.35 s and 5.8–9.95 s | no change on either side | – | – | pass |

Sheet: `compare-5/sheets/compare-01.webp` (one frame every 0.8 s across the first part of the run). The second overview sheet and the 0.16 s detail sheets stay out of git with the raw captures.

## Residual deviations
1. **One extra frame of activity on the clone's fades (frames 54/81/106, 113, 141, 255–256, 279).** Under the virtual clock the reference's WAAPI opacity cuts in one frame. The clone fades for 100–150 ms, which is the reference's real-clock behaviour. The real-clock probes match within one frame.
2. **Line-scroll glitch not copied (20 px, one 60 Hz tick).** At each wrap (1067 / 2200 / 3200 / 4200) the reference paints the text already jumped up for one tick before its offset applies. The clone sets the offset in the layout pass, so the text never jumps.
3. **Counter tick 3 lifts 17 ms early (3200 vs 3217).** The clone's CSS animation starts at the tick, while the reference's JS animation starts one rAF later. The visible frame is the same on both.
4. **The second loop's stream opens 16 ms early (11767 vs 11783).** The reference's loop clock starts one tick after its restart paints.
5. **State pill trails 10 points at +40 ms (12/32 % vs 22/40 % at +40/+80 ms).** In the pre-roll the reference's pill is still sliding from the pre-js "Finished" click and carries that motion into the reversal. The clone's pill is already at rest. Both reach 92 % at +240 ms.
6. **Shimmer centroid up to 2.6 px behind mid-sweep.** "Thinking" is about 2 px wider in Geist than in Inter. Start, end and period are identical.
7. **Mismatch 2.8 % mean, 6.3 % on open-card frames.** This is copy, font and palette, by design for motion-faithful work. Layout proportions match: the card is 46 / 90 / 483.2 px tall in both, the window 516x40 and steps 82.3 px.

## Candidates
Winner: Arc UI Reasoning block (live label, timer and Stop; reasoning streams through a two-line scrolling window; folds to "Thought for Ns" and opens into headed steps; stopped and interrupted states). Runner-up: AI Elements Chain of Thought (as polished, but an agent tool trace rather than reasoning, overlapping the agent-plan and tool-call concepts). All candidates loaded; Nuxt UI's preview stays blank for about 6 s, and assistant-ui's reasoning page has no replay control. Details in `selection.md`.
