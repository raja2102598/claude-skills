# tool-call: reanimate report

**Fidelity: motion-faithful.** The reference is Arc UI "Tool call" (Pro, paid), the live preview at https://uiarc.dev/components/tool-call, cropped to 685x430.

The clone reproduces the whole preview turn:
- The user bubble, then a lead-in sentence streamed in 2 chunks.
- A grouped tool-call card whose calls run one after another. Each running call has a spinner and a shimmering label, and settles into a check with its result and timing.
- The third call fails inline with a reason and Retry.
- The card header shows stacked tool marks, "Using N tools" → "Used 3 tools", and "1 failed".

It also reproduces the reference's own follow-ups:
- **Retry:** the call re-runs and succeeds, then an approval row appears with Deny and Allow.
- **Allow / Deny:** the last call finishes or is denied, the card collapses, the answer streams in, and "Run again" restarts the turn.
- Rows open their input/output details, and the header collapses the list.

Styling is original: a warm palette, Geist / Geist Mono, lucide icons instead of the GitHub/Linear/PostgreSQL/Slack marks, and placeholder copy (nova/app, launch board, db-primary, #launch, "Atlas").

**Added:**
- `?autoplay=0` capture mode: an invisible 24 px start button in the empty top-left corner.
- A reduced-motion path.
- The auto-collapse at the end is skipped if the reader toggled the card by hand. The reference appeared to behave this way.

## Code
- **`src/clones/tool-call/index.tsx`**
  - The turn runs on a timeline of timeouts with `flushSync`:
    - Main run, ms from mount: chunks at 180/230, card at 600, call 1 done at 1800, call 2 at 2017 (done 2777), call 3 at 3000 (fails 4385).
    - Retry: done +700, approval row +960.
    - Allow: done +620, collapse +1100, answer +1580, Run again +2280.
    - Deny: collapse +470, answer +950, Run again +1650.
  - Heights use `AutoHeight`: a motion spring (stiffness 300, damping 35, critically damped, ω ≈ 17.3) when its own content changes, and `height: auto` otherwise. Nested AutoHeights report when they are springing, so ancestors follow at auto instead of chasing with springs of their own. (Round 1 found that chain lag.)
  - Opacity, blur and scale are CSS keyframes. The springs are sampled into `linear()` easings: status icon ω 25, header marks ω 17, chevron 440 ms ω 18.3.
- **`tool-call.css`**
  - Geist import and tokens.
  - The shimmer: a 4.4em band in the label's own colour, image size `calc(200% + 4.4em)`, background-position 100% → 0% in 1800 ms, then 600 ms of rest. It starts 280 ms after a row mounts, or 200 ms after the card mounts for the header, which keeps its phase across label swaps.
  - The label blur-swap, the icon swap and the entrances.
- **`meta.ts`:** stage 685x430 on #f6f4f0.
- **Trigger:** mount. With `?autoplay=0`, click `[data-tc-start]`. Follow-ups: `[data-tc-retry]`, `[data-tc-allow]`, `[data-tc-deny]`, `[data-tc-run-again]`.

## Method
- **Main run.** All captures use the virtual clock at 25 fps, 1440x900, a 685x430 crop, and 200 ms of pre-roll.
  - The reference has no replay control and does not wait for visibility. Its demo restarts when the docs tabs switch Code → Preview, so pre-js clicks Code and the trigger clicks Preview.
  - Reference frames 0–8 show that page transition, so the compare starts at frame 9.
- **Follow-ups.** `ref-retry/`, `ref-allow/` and `ref-deny/` are captured against `clone-5-*`. For Allow and Deny, the pre-js clicks Retry, then advances the virtual clock 1.6 s.
- **Real-clock probes.** The reference runs opacity, blur and scale through motion's WAAPI, which collapses under the virtual clock. Those rows were measured with real-clock rAF probes on both sides (kept out of git). Heights and the shimmer position are JS-driven, so they are exact on the virtual clock and were compared from `track.json` with `easing.ts --compare-track`.

## Verification (round 5 of 5)

| sequence | mean mismatch | timing error (start / end / duration) | result |
|---|---|---|---|
| main, frames 9–180 | 1.82 % | 0.4 s start: the reference's page-chrome frames count as motion; see residual 1 | (see from-13 row) |
| main, frames 13–180 | 1.85 % | 0.00 / +0.04 / +0.04 s | PASS |
| Retry | 2.85 % | 0.00 / +0.04 / +0.04 s | PASS |
| Allow | 2.26 % | 0.00 / 0.00 / 0.00 s | PASS |
| Deny | 2.26 % | 0.00 / 0.00 / 0.00 s | PASS |

| # | element / property | timing (ref → clone) | easing (ref → clone) | curve diff | result |
|---|---|---|---|---|---|
| 1 | bubble | present from mount, both | static | – | pass |
| 2 | lead-in chunks, opacity | frames 10–12 on both (180 / 230 ms) | 150 ms cubic-bezier(.22,1,.36,1) on both | – | pass |
| 3 | card slot height 0 → 99 | delay 17 → 17 ms; within 1 % at 383 → 383 ms | spring, no overshoot → k300 / c35 | max 0.81 px (0.8 %), mean 0.30 px | pass |
| 3b | slot opacity | with mount | 150 ms ease-out → same | about 1 frame of probe phase | pass |
| 4 | running-row shimmer band | first visible at frame 28 on both | linear, 0.32 px/ms → 0.32 px/ms | band centre frames 28–45: mean 4.9 px (≈15 ms), max 15 px | pass |
| 4b | header shimmer | +200 ms after the card mounts, keeps its phase across label swaps | linear 1800 ms + rest | not measured frame by frame (low-contrast band) | pass (by model) |
| 5 | spinner | 800 ms per turn | linear → CSS 800 ms linear | – | pass |
| 6 | call 1 done: label blur-swap, icon swap, meta | frames 50–52 on both (1800 ms) | label out 150 ms (.22,1,.36,1), in 200 ms (.16,1,.3,1); icon opacity 100 ms ease-out, scale spring ω ≈ 25 | icon scale every 16 ms: .627/.681/.742/.799/.846/.885/.915 vs .612/.660/.724/.783/.836/.877/.911, max 0.021 (5 % of travel) | pass |
| 7 | call 2 enters: row height 0 → 40, opacity, header mark | frames 56–63 on both; height starts 1 sample (17 ms) late | spring → spring; opacity 150 ms ease-out + 60 ms delay | height max 4.5 px, mean 1.0 px (a 17 ms shift); opacity within ≈4 ms; mark scale within 0.02 | pass |
| 8 | call 2 done | frames 75–76 on both (2777 ms) | as 6 | – | pass |
| 9 | call 3 enters | frames 80–86 on both (3000 ms) | as 7 | max 4.5 px, mean 1.0 px | pass |
| 10 | call 3 fails: label, error icon, note line, row 40 → 58, Retry fade-in | frames 115–121 on both (4385 ms) | spring; fades 150 ms | mean 1.05 px (the 18 px max is a one-frame measurement glitch in the reference at 4383 ms) | pass |
| 10b | header "Used 3 tools" + "1 failed" | same frame | 150 ms ease-out | – | pass |
| 11 | column re-centring | follows every height change | layout | demo height mean 0.65 px | pass |
| R1–R3 | Retry: note collapse, success, approval row | frames 5–11 / 23 / 30–31 on both | spring | note max 0.16 px; approval row max 0.48 px, mean 0.20 px | pass |
| A1–A5 | Allow: note collapse, done, card collapse, answer stream, Run again | frames 5–11 / 21–23 / 33–43 / 45–51 / 62 on both | spring; chevron 440 ms spring curve | collapse is the same curve 17 ms late (max 19 px of 169, mean 5.3 px) | pass |
| D1–D4 | Deny: denied, collapse, answer, Run again | frames 5–11 / 17–26 / 29–35 / 47 on both | spring | collapse ≈25 ms late (max 22 px of 169, mean 6.4 px) | pass |

**Sheet:** `compare-5/sheets/compare-01.webp` (main run). The rest of the main-run sheets and the Retry, Allow and Deny sheets stay out of git with the raw captures.

## Residual deviations
1. **Main full-window start of 0.4 s.** Reference frames 0–12 include the docs page's own tab transition: the code panel leaves and the preview panel fades in and slides 6 px. compare.ts counts this as motion, but it is not the component. From frame 13 the timing error is 0.00 / +0.04 / +0.04 s.
2. **Height springs start 17 ms late (≈25 ms on Deny).** This applies to rows added after mount and to the end-of-turn collapse: the timer fires, then motion starts on the next frame. The curve shape is identical. It is well inside the ±80 ms limit, and fixing it would have needed a 6th round.
3. **Sub-pixel text snapping.** The centred column moves by fractions of a pixel. Text snaps to whole pixels at different moments than in the reference because the fractional offsets differ. This gives one-frame activity spikes of about 1 % mismatch (clone frames 33, 67, 91). It is rendering, not motion.
4. **WAAPI rows measured on the real clock.** In the reference, opacity, blur and scale collapse to one frame under the virtual clock, so those rows come from real-clock probes. They carry about one frame of probe phase noise. The declared durations and easings match exactly (read from the reference's `getAnimations()`).
5. **Row hover fill in the follow-up captures.** After the clone clicks Retry, Allow or Deny, the pointer rests over the row, so the clone shows its hover fill (#f7f4ef). The reference frames show none. It costs about 0.3 % mismatch in those frames and is cosmetic.
6. **Intentional differences behind the 1.8–2.9 % mismatch.** Copy, Geist instead of Inter, the warm palette, the visible bubble fill (the reference's bubble matches its background), and lucide icons instead of brand marks.
7. **Header shimmer timing is an estimate.** The +200 ms lead and the 600 ms rest after each 1800 ms pass come from one real-clock probe and one observed wrap.
8. **Not captured against the reference.** Row details (expand) and the manual header toggle use the same verified spring and chevron curve, but were not captured against the reference.
