# message: reanimate report

**What was cloned:** Arc UI "Response feedback" (https://uiarc.dev/components/response-feedback). It is one assistant reply with an action row: copy, thumbs up and thumbs down.
- Copy turns into a green check and turns back after 1.8 s.
- Each thumb fills and opens an inline panel on a spring:
  - Thumbs down asks "What missed the mark?", with reasons, a note, and Cancel / Submit.
  - Thumbs up asks "What worked?", with reasons and Skip, which becomes Send once a reason is picked.
- Submit shows a spinner for 700 ms. The form then cross-fades to a thank-you whose check draws itself, and the height snaps to fit. 1.6 s later the panel folds away and focus returns to the thumb, which shows its tooltip.
- Tooltips appear after 250 ms of hover.
- A "Simulate a send error" switch gives a Couldn't-send / Try again path.

**Fidelity:** motion-faithful. The component is Arc Pro (paid) and states no license. The clone uses:
- its own palette and Geist / Geist Mono;
- its own copy, model name ("Nova 2") and reason labels;
- a lucide sparkle mark and lucide icons, plus a hand-drawn check.

No Arc CSS, JS, copy or assets were used.

**Code:** `src/clones/message/index.tsx`, `message.css`, `meta.ts`. The stage is 632 × 690 on #f3f1ec.

**Triggers:** `/c/message` runs an autoplay demo on load (copy, thumbs down with a reason and Submit, then thumbs up with a reason and Send, looping every 13 s); any real pointer or key input stops it. `?autoplay=0` is the capture mode. `reanimate:replay` remounts the message.

**How the motion was built:**
- Panel height uses `SpringPanel`: a critically damped spring (ω = 26 rad/s) stepped on rAF, whose first frame only anchors the clock, as in the reference.
- Fades, pops and draws are CSS keyframes and transitions. The springs are sampled into `linear()`.
- Timers commit through `flushSync`, so each state lands in the frame its timer fires in.

**Captures:** reference and clone use the same commands: viewport 1440x1200, crop 632×690, virtual clock, 200 ms pre-roll.
- hover on thumbs down: 700 ms at 30 fps
- click thumbs down: 1000 ms at 60 fps
- click copy: 2300 ms at 30 fps
- click Submit after opening the panel and picking a reason: 2900 ms at 30 fps

WAAPI rows were taken from a real-clock `getAnimations()` probe of the reference. The clone's own animation durations, delays and easing curves were checked against it. Probes and capture scripts stay out of git.

## Verification (round 3 of 3)

compare.ts was run with `--offset 0`; the triggers are deterministic on the virtual clock.

| capture | mean mismatch | timing error from compare.ts | frames with visible change, ref / clone |
|---|---|---|---|
| hover | 3.34 % | 0 / 0 / 0 s, pass | 8–9, 15–19 / 8–9, 15–18 |
| down | 3.72 % | end +0.183 s (artifact, see residual 3) | 14–31, 34 / 14–31, 34 (identical) |
| copy | 3.25 % | 0 s, pass | 8–14, 62–68 / 8–15, 18, 62–69, 72 |
| submit | 3.83 % | end +0.233 s (artifact plus one frame) | 7–36, 76–84 / 7–36, 77–85 |

Sheets: `compare-3-{hover,down,copy,submit}/sheets/compare-01.webp`.

Per row, from easing.ts with the clone track mapped onto the reference selectors:

| row | element / property | ref → clone | diff | result |
|---|---|---|---|---|
| 1 | hover tint (CSS 150 ms quint-out) | same transition | n/a | pass |
| 2 | tooltip: 250 ms delay, then opacity, translateY and scale | expo-out 150 → expo-out 150; delay 250 → 250 | max 0 | pass |
| 3 | press: scale 0.94; tooltip exits in 100 ms quint-out | implemented to the probe's numbers | not exercised by the captures | pass (by construction) |
| 4 | filled thumb opacity | quint-out 150 → quint-out 150, from 0 ms | max 0 | pass |
| 5 | panel height 0 → 222 (card 380 → 602) | spring: delay 17 → 17 ms, 1 % at 267 → 267 ms, no overshoot | max 1.39 px, mean 0.16 px | pass |
| 6 | panel opacity 150 ms quint-out | real probe → CSS (WAAPI snaps under the virtual clock) | ≤ 1 frame | pass |
| 7 | focus moves to the first reason | same (focus ring in submit frame 0 on both) | n/a | pass |
| 8 | copy glyph out: opacity and scale 1 → 0.7, 100 ms quint-out, one frame late | same | scale max 0.01 | pass |
| 9 | check in: scale spring 0.7 → 1 (ω = 26), plus a stroke draw-on | scale matches; draw-on missing | scale max 0.0008 (133–420 ms) | partial fail, residual 1 |
| 10 | copy colour → green, 150 ms, one frame late | same | first change frame 8 → 8 | pass |
| 11 | revert at +1800 ms | 1817 → 1817 | first change frame 62 → 62 | pass |
| 12 | Submit label → spinner, 700 ms | same | frames 7–26 → 7–26 | pass |
| 13 | swap to thanks at +700 ms, height snaps 222 → 66 | same frame (27) | n/a | pass |
| 14 | thanks view fades in and settles translateY 2 → 0 | 1.44 / 0.74 / 0.37 → 1.45 / 0.78 / 0.37 px at +17 / 33 / 50 ms | mean 0.11 px | pass |
| 15 | thanks check draws on (~800 ms, 250 ms quint-out) | frames 29–36 → 29–36 | n/a | pass |
| 16 | focus returns at +2300 ms and the tooltip shows | 2300 → 2300 (track) | one sample 0.53, mean 0.01 | pass |
| 17 | fold: height 66 → 0, spring | delay and duration identical (267 ms to 1 %) | max 0.43 px, mean 0.08 px | pass |

## Residual deviations

1. **Copy check draw-on is missing (row 9).**
   - The reference draws its check stroke from about 0.05 s to 0.27 s; visible change ends at frame 14.
   - The clone fades and pops the whole check in. It is fully visible by 0.13 s, and its spring tail keeps changing below a pixel until frame 18 (0.40 s).
   - Frames 8–12 of the copy capture therefore show a partly drawn check in the reference and a whole one in the clone.
   - It was found after round 3 and left unfixed because of the 3-round cap. The fix is to reuse the thanks-check path-draw on the copy check.
2. **The fold shows one 30-fps frame later in the pixels.**
   - First change is at frame 76 in the reference and 77 in the clone (+33 ms); the end is 84 vs 85.
   - The tracks agree (tooltip at 2300 ms on both, height within 0.43 px), so this is ordering inside the virtual-clock frame, and it is within ±80 ms.
3. **compare.ts reports end errors of +0.183 s (down) and +0.233 s (submit).**
   - The reference's panel and content fades are WAAPI, and they snap under the virtual clock.
   - The clone fades for the measured 150 ms (real-clock probe). That shifts the activity threshold, which is relative to the reference's peak.
   - The lists of frames with visible change match frame for frame (down) or within one frame (submit).
4. **Mean mismatch of 3.3–3.8 % is palette, font and copy.** It is present at rest too, which is expected for motion-faithful work.
5. **Round 2 was captured twice.** The first attempt ran against a stale dev server (the file-watcher limit had been hit). It was discarded and captured again on a fresh server.
