# agent-handoff: reanimate report

**Cloned:** the AI Elements "Subagent" demo preview (https://ui.shadcn.com/docs/ai-elements/base/subagent), one run triggered by its Replay button.
1. The user asks a question.
2. "Running the research subagent" appears with a spinner and a shimmering label.
3. The line becomes a collapsible trigger, and the subagent's three tool calls (grep, sed, ls) run one after another nested under it.
4. The line settles into "Ran the research subagent" with the subagent's report under it.
5. The parent agent streams its answer at 20 ms per word, then Replay appears.

**Fidelity:** pixel-faithful. shadcn/ui is MIT ("Copyright (c) 2023 shadcn", LICENSE.md in shadcn-ui/ui). The clone uses the same Geist font, colours, spacing, radii and sample copy, with attribution in `meta.license`.

**Code:** `src/clones/agent-handoff/index.tsx`, `agent-handoff.css`, `meta.ts`. Every change is a state swap on a timer. The spinner (1 s per turn, linear) and the shimmer (2 s, linear) are CSS keyframes, so they behave the same on the virtual and the real clock. No motion library is used.

**Trigger:** the run plays on mount at `/c/agent-handoff`. `?autoplay=0` starts on the finished transcript, and clicking Replay (`[data-ah=replay]`) plays it again. `window.dispatchEvent(new Event("reanimate:replay"))` also restarts it.

**Capture (both sides):** `--viewport 1440x901 --trigger click --wait-before 5000 --pre-roll 200 --duration 5600 --fps 60 --clock virtual --network-wait 300`. The crop is 638×517: `--clip 401,267,638,517` on the reference (with a pre-js that hides the code panel) and `--selector "[data-stage]"` on the clone.

## Round 3 (final): compare-3

- Frames compared: 349/349 at 60 fps, clone offset 0.
- Mean mismatch: **0.00 %** (threshold 2 %). Worst frame: #48 at 0.01 %. Every other frame is 0.00 %.
- Motion window: reference frames 12–228, clone frames 12–228.
- Timing error (clone − ref): start 0 s, end 0 s, duration 0 s, peak 0 s (limit 0.08 s).

Sheet: `compare-3/sheets/compare-01.webp`.

Below, ref and clone times come from `track.json`, in ms after the click.

| # | element | ref t (ms) | clone t (ms) | error | easing | result |
|---|---|---|---|---|---|---|
| 1 | Reset to the user bubble plus the running line (container 437 → 288) | 0 | 0 | 0 | step = step | pass |
| 2 | Spinner rotation, 1000 ms per turn | continuous | continuous | 0 (frames identical) | linear = linear | pass |
| 3 | Title shimmer, 2000 ms | continuous | continuous | 0 (frames identical) | linear = linear | pass |
| 4 | Header becomes a trigger with a chevron (spinner and shimmer restart) | 600 | 600 | 0 | step = step | pass |
| 5 | Subagent panel 0 → 32 | 600 | 600 | 0 | step = step | pass |
| 6 | grep step done, panel 32 → 60 | 1600 | 1600 | 0 | step = step | pass |
| 7 | sed step done, panel 60 → 88 | 2600 | 2600 | 0 | step = step | pass |
| 8 | ls step done | 3600 | 3600 | 0 | step = step | pass |
| 9 | Header shows "Ran…" plus the report (panel 145.5, container 297) | 3600 | 3600 | 0 | step = step | pass |
| 10 | Answer stream, 20 ms per word; line wraps at 4200 / 4417 / 4583 (ref) and 4200 / 4400 / 4583 (clone) | 4033 | 4033 | 0 / 0 / −17 / 0 (frames identical) | linear steps = linear steps | pass |
| 11 | Replay button appears (container 437) | 4650 | 4650 | 0 | step = step | pass |
| 12 | Rest, no change | > 4650 | > 4650 | 0 | — | pass |

The spinner and the shimmer advance on every frame on both sides under the virtual clock: the pixels in their boxes change from frame 20 to frame 45, and the clone matches the reference pixel for pixel in those boxes.

## Residual deviations

- **Frame 48 (t = 600 ms): 0.01 % mismatch.** At the step-1 remount, a few anti-aliased pixels in the two restarted spinners differ. This lasts one frame and is invisible.
- **Row 10, third wrap: track sample 17 ms early (4400 vs 4417 ms).** This is one frame of track sampling; the rendered frames at that time are identical (frame 277: 0.00 %). It is well inside ±80 ms.
- **Answer stream start in the code is 4018 ms.** The timer fires at 4018 ms, so the first word lands on the 4033 ms frame, the same frame as in the reference (frame grid of 16.7 ms). On a real 60 Hz display the difference is under one frame.
- **Additions not compared against the reference.** Clicking the header folds and unfolds the subagent panel (height over 200 ms, ease 0.4/0/0.2/1, as Base UI's `duration-200`). Clicking a finished step opens its stdout. Neither is part of the replay, and the replay frames are unaffected (0.00 %).

## Rounds

- Round 1 (compare-1): 0.46 % mean, timing 0 s; layout and pixel details off.
- Round 2 (compare-2): 0.00 % mean, timing 0 s; pass.
- Round 3 (compare-3, final, recaptured after a container restart): 0.00 % mean (max 0.01 %), timing 0 s; pass. No code change after the capture.
