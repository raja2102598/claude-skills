# thinking-indicator: reanimate report

**Fidelity: motion-faithful.** The reference is UIStacks "Thinking state" (Pro, paid). The clone covers the full
run: the shimmering phase label with a live seconds counter, Thinking → Searching → Reviewing every 1.6 s, the
settle into "Thought for 5s" (the dot mark fades out while a check springs in), steps ticking to done, and the
header collapsing the reasoning panel. The clone uses its own palette (stone ink, an amber→rose dot mark, a teal
check), Geist, lucide icons, its own 5×5 dot pattern and placeholder copy.
**Added:** a Replay control in the stage's top-right corner (static; the capture trigger) and a reduced-motion path.

## Code
- `src/clones/thinking-indicator/index.tsx` is the component. The run starts on mount, and Replay remounts it.
  The timeline is a set of timeouts at 1000/1600/2000/3000/3200/4000/4800 ms. The shimmer and the icon swap are
  plain CSS animations. The spring is sampled into a CSS `linear()` easing by `springEasing(500, 20)`. The panel
  collapse uses `motion/react` (height spring 360/34, opacity ease 300 ms).
- `src/clones/thinking-indicator/thinking-indicator.css` holds the Geist import, tokens, the shimmer, the fade-out and pop keyframes, and the reduced-motion rules.
- `src/clones/thinking-indicator/meta.ts` sets the stage to 490x240 on #f4f4f5.
- Trigger: mount, or click `[data-ti-replay]`. Clicking the header (`[data-ti-header]`) collapses or expands the panel.

## Method
- Main timeline: `ref/` vs `clone-3/`, both `--clock virtual`, 20 fps, 1440x900, 490x240 crop, Replay click after 9 s, 7.5 s window (`compare-3`, `--offset 0`).
- The reference's icon swap and panel opacity are motion WAAPI animations. Under reanimate's virtual clock they
  finish within 1–2 frames, so the reference frames show the swap as a cut. Those rows were measured from
  real-clock rAF probes of the reference (opacity, transform and rect every frame) and compared with the clone's
  track (virtual and real clock). In round 1 the clone used motion for the swap too. Under the virtual clock
  motion 14's WAAPI animations stayed frozen (dots at opacity 1, check stuck at scale 0.4; `clone-1`). The swap
  was therefore moved to CSS keyframes, which behave the same on both clocks (`clone-2` and later).
- Collapse: height from `ref-collapse-v` vs `clone-collapse-v` (virtual, 50 fps; height is JS-driven on both
  sides). Opacity from `ref-collapse` vs `clone-collapse` (real clock, 25 fps tracks).

## Verification (round 3 of 3)

compare-3: timing error start 0.00 s, end 0.00 s, duration 0.00 s → PASS. Mean mismatch 4.96 %, worst 5.1 % at
5.00 s. That is copy, font and palette, as expected for motion-faithful work: rest frames sit at the same ~5 %
as moving frames. compare.ts reports "peak −4.8 s" because the reference's busiest frame is #100, where the virtual
clock cuts its WAAPI icon swap into one frame. The clone's busiest frame is the trigger, #4. Both sets change at
the same frames.

| # | element / property | timing err (start / end / dur) | easing (ref → clone) | curve diff | result |
|---|---|---|---|---|---|
| 1 | label text Thinking→Searching→Reading/Reviewing→Thought | 0.00 / 0.00 / 0.00 s (frames 36, 68, 100 on both) | instant → instant | – | pass |
| 1b | label colour to muted at done | 0.00 s (frame 100) | instant → instant | – | pass |
| 2 | shimmer sweep, per phase | peak +750/+750/+700 ms → +750/+700/+700 ms; active 30/28/29 → 30/30/30 frames | linear 1600 ms → linear 1600 ms | activity-curve corr 0.98 / 0.97 / 0.98 | pass |
| 3 | timer 1s→5s, hidden at done | 0.00 s (frames 24, 44, 64, 84, 100) | instant → instant | – | pass |
| 4 | dot mark opacity 1→0 | start 0 ms; reaches 0 at +300 → +317 ms | ease ~317 ms → ease 320 ms | mean 1.0 % / max 2.7 % of travel | pass |
| 5 | check scale 0.4→1 (spring) | start 0 ms; peak +161 → +150 ms; trough +311 → +317 ms; settled ~700 → 690 ms | spring, overshoot 21.3 % (peak 1.128) → spring k500/d20, peak 1.123 | mean 1.5 % / max 6.7 % of travel | pass |
| 6 | step 1 icon → check | 0.00 s (frame 68) | instant → instant | – | pass |
| 7 | steps 2–3 icons → check | 0.00 s (frame 100) | instant → instant | – | pass |
| 8 | panel, paragraph and step text static while running | no change in either set (frames 5–99) | – | – | pass |
| 8b | dot mark static while running | no change in either set (frames 5–99) | – | – | pass |
| 9 | header width / chevron x jump with the label | same frames, no tween on either side | instant → instant | – | pass |
| 10a | collapse: panel height 158.2→0 | start +33 → +33 ms; <1 % at +300 → +283 ms | ease ~283 ms → ease ~280 ms (spring 360/34) | mean 0.27 % / max 0.73 % of travel | pass |
| 10b | collapse: panel opacity 1→0 (real clock) | delay 101 → 101 ms; 99 % at 282 → 266 ms | ease ~310 ms → ease ~293 ms | – | pass |
| 10c | collapse: chevron flip | instant on both (ref-collapse / clone-collapse frames) | – | – | pass |

Real-clock cross-check of rows 4–5 (rAF probe of the clone): opacity 0.965 / 0.801 / 0.463 / 0.099 at
+16 / +49 / +99 / +201 ms against the reference's 0.962 / 0.806 / 0.489 / 0.096. Scale 0.53 / 0.99 / 1.123 /
0.974 at +33 / +99 / +149 / +317 ms against 0.498 / 0.974 / 1.126 / 0.972.

Static layout (DOM rects, crop px; ref → clone): header 24,24 h 20.7 → 24,24 h 20.69 · mark 24,27.3 → 24,26.98 ·
panel 31.56,52.36 434.2x158.2 → 31.36,52.05 434.2x158.2 · paragraph 418.5x71.8 → 418.5x71.8 · steps
y 131.5 / 159.1 / 186.7 → 131.2 / 158.8 / 186.4.

Sheet: `compare-3/sheets/compare-01.webp` (start of the main run). The full PNG sets for the main run
(`compare-3`, the done transition on sheet 4), the collapse (`compare-collapse`) and the earlier rounds stay
out of git with the other raw captures.

## Residual deviations
1. **Exit position of the dot mark: 0 px vs 1.9 px left / 9.8 px up.** The reference pops the exiting mark out
   of flow (popLayout). Inside the docs preview's `zoom: 0.92` that lands it about 8 % off its offset, so a ghost
   of the grid fades out above-left of the check. This is an artifact of the preview's zoom, not of the
   component, so the clone fades the mark out in place.
2. **Collapse frames on the real clock (`compare-collapse`): timing error reads +0.04 s start, +0.64 s end, FAIL.**
   Screencast frames under CPU load drop and shift by 1–2 frames, and the clone's window includes an encoder
   keyframe at 0.96 s (every region changes at once, no DOM change). The per-rAF tracks above are the measurement
   for rows 10a–10c. They agree to within 17 ms.
3. **Reference frames 100–101 in the virtual capture** show the icon swap as a cut. This is the virtual clock's
   effect on the reference's WAAPI animations (see Method). The clone's swap spans frames 100–114, matching the
   reference's real-clock curves (rows 4–5).
4. **Reference chevron re-rasterises at 5.75 s (virtual) or 5.84 s (real),** when the reference's WAAPI
   compositing layer is removed. Its rect, colour and transform never change (rAF probe), so it is not motion
   and is not cloned.
5. **Mean mismatch 4.96 %**, from original copy, font (Geist vs Inter), palette and dot pattern, all by design
   for motion-faithful work.
6. **Expand (re-open) is not separately captured.** It uses the same transition as the collapse, in reverse.

## Candidates
Winner: UIStacks Thinking state, the most complete thinking line (phase label with shimmer, live timer, settle
into "Thought for 5s", steps ticking to done, collapsible reasoning panel). Runner-up: Arc UI Agent status (most
polished motion, but an agent-run pill rather than a thinking line). Rare UI Inline AI Status did not load
(Vercel Security Checkpoint). Details in `selection.md`.
