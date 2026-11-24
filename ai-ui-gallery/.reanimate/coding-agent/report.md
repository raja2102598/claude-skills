# coding-agent: reanimate reports

This concept has two winners, cloned as `coding-agent-terminal` and `coding-agent-tests`. Both are **pixel-faithful**: Apache-2.0 (AI Elements by Vercel, license verified), demo sources MIT (shadcn/ui). Several captures crashed under memory pressure and were re-run; the final captures were taken on a re-warmed dev server.

---

## coding-agent-terminal

**Cloned:** the AI Elements Terminal demo (https://ui.shadcn.com/docs/ai-elements/base/terminal), cropped to the preview (638x517, white). One Replay run.

**Code:** `src/clones/coding-agent-terminal/index.tsx`, `coding-agent.css`, `meta.ts`.
- **Trigger:** the run plays on mount at `/c/coding-agent-terminal`. `?autoplay=0` starts on the finished transcript, and clicking Replay (`[data-ca=replay]`) plays it again. `window.dispatchEvent(new Event("reanimate:replay"))` also restarts it.
- **Sequence:** three commands run in turn. Each shows a shimmering "Running <cmd>" line. Its output code block opens on the first stdout line and gains one line every 200 ms. The block folds shut (height over 200 ms, ease 0.4/0/0.2/1) when the command ends, and the panel unmounts after the fold. Then the answer streams at 20 ms per word and Replay appears.
- **Implementation:** the shimmer is a CSS keyframe, and the height transitions use a JS-measured panel on the CSS transition.
- **Replay:** it remounts every row (keyed by a run id), as the reference does when it empties the transcript.

**Capture (both sides):** viewport 1440x901, click on Replay, wait-before 5000, pre-roll 200, duration 6500, 30 fps, virtual clock, network-wait 300. Reference crop `--clip 401,267,638,517` with a pre-js that hides the code panel; clone crop `--selector [data-stage]`.

### Final compare (round 5, `compare-terminal-5`)
- Frames compared: 202/202 at 30 fps, clone offset 0.
- Mean mismatch: **0.18 %** (threshold 2 % for pixel-faithful).
- Worst frames: #66 at 0.6 % (2.2 s), #132 at 0.6 % (4.4 s).
- Timing error (clone − ref): start 0 s, end 0 s, duration 0 s, peak 0 s (limit 0.08 s).
- Sheet: `compare-terminal-5/sheets/compare-01.webp`.

| # | element | ref t (ms, after click) | clone | error | easing | result |
|---|---|---|---|---|---|---|
| 1 | Reset to bubble plus "Running pnpm lint" line | 0 | 0 | 0 | step = step | pass |
| 2 | Title shimmer on every running line, 2000 ms | continuous | continuous | 0 | linear = linear | pass |
| 3 | lint block opens on first stdout line (0 → 55 px, 200 ms) | 33 | 33 | 0 | ease = ease | pass |
| 4 | Output lines every 200 ms (lint 2, test 8, build 11) | 33 + 200n | 200n (see deviations) | at most 1 frame | step = step | pass |
| 5 | lint block folds shut and unmounts | 433 to 633 | 433 to 633 | 0 | ease = ease | pass |
| 6 | test block opens, streams 8 lines, folds | 433, closes 2033 to 2233 | same | 0 | ease = ease | pass |
| 7 | build block opens, streams 11 lines, folds | 2033, closes 4233 to 4433 | same | 0 | ease = ease | pass |
| 8 | Answer stream, 20 ms per word | 4233 | 4233 | 0 | linear steps | pass |
| 9 | Replay button appears | after the last word | same frame | 0 | step | pass |

### Residual deviations
- **Line-append timing:** in rounds 1–3 the clone's output lines landed one frame (33 ms) after the reference's. They were moved 33 ms earlier; the shift was confirmed through the mean and timing numbers above (0.18 %, 0 s), but the per-frame line-count check was not re-run after it.
- **Residual mismatch:** at most 0.6 % per frame, from sub-pixel anti-aliasing of the monospace stdout and the box-drawing glyphs in the build output (┌ └ ▲ ○ ƒ), which fall back to a system font.
- **Reference timing source:** the reference's `track.json` is sparse under the virtual clock, so the line cadence (200 ms) and command boundaries come from the demo source (`sleep(200)`) and frame reading, not from a dense track.
- **Unrecorded interactions:** clicking a row toggles its block, and rows hover to black. Neither is part of the replay and neither was compared.

---

## coding-agent-tests

**Cloned:** the AI Elements Test Results demo (https://ui.shadcn.com/docs/ai-elements/base/test-results), cropped to the preview (638x517, white). One Replay run.

**Code:** `src/clones/coding-agent-tests/index.tsx`, `coding-agent.css`, `meta.ts`.
- **Trigger:** the run plays on mount at `/c/coding-agent-tests`. `?autoplay=0` starts on the finished transcript, and clicking Replay (`[data-ca=replay]`) plays it again. `window.dispatchEvent(new Event("reanimate:replay"))` also restarts it.
- **Sequence:**
  1. The user bubble and a shimmering "Running pnpm test checkout" line appear.
  2. At 1500 ms the line is replaced by the result, "Ran 5 tests, 1 failed" in red. It mounts already open: cart.test.ts is folded, payment.test.ts is open, and the failing test is open with its error block.
  3. The answer streams at 20 ms per word, then Replay appears.
- **Panels:** they are kept mounted and use the same measured-height collapsible (200 ms) when a user toggles them. They mount open with no animation on the replay.

**Capture (both sides):** viewport 1440x901, click on Replay, wait-before 5000, pre-roll 200, duration 6500, 30 fps, virtual clock. Same crop as the terminal clone.

### Final compare (round 2, `compare-tests-2`)
- Frames compared: 202/202 at 30 fps, clone offset 0.
- Mean mismatch: **0.00 %**.
- Timing error (clone − ref): start 0 s, end 0 s, duration 0 s, peak 0 s (limit 0.08 s).
- Sheet: `compare-tests-2/sheets/compare-01.webp`.
- A side-by-side of the finished state (frame 71) matches the reference.

| # | element | ref t (ms) | clone | error | easing | result |
|---|---|---|---|---|---|---|
| 1 | Reset to bubble plus running line, container 462.75 → 288 | 0 | 0 | 0 | step = step | pass |
| 2 | Running title shimmer, 2000 ms | continuous | continuous | 0 | linear = linear | pass |
| 3 | Result lands, all nested panels open, container 288 → 362.75, no height tween | 1500 | 1500 | 0 | step = step | pass |
| 4 | Answer stream, 20 ms per word (21 words, wraps at ~1750 and ~1883 in the reference) | about 1520 | about 1520 | 0 | linear steps | pass |
| 5 | Replay button appears | after the last word | same frame | 0 | step | pass |
| 6 | Rest, no change | after Replay appears | same | 0 | none | pass |

### Rounds
- **Round 1 (`compare-tests-1`):** 1.08 % mean, timing end +0.033 s. The result's nested panels rendered collapsed because the panel's inline `height: 0` was re-applied on every render; fixed by making the style constant per mount.
- **Round 2 (final):** 0.00 %, timing 0 s. A later type-only widening of `TraceLine`'s `status` prop (no rendering change) was not re-captured.

### Residual deviations
- **0.00 % mean mismatch:** confirmed as a real capture: the clone frames are 638x517, the capture URL is the clone's, and a side-by-side of frame 71 matches the reference.
- **Unrecorded interactions:** toggling a suite or test, and hover colours. They are not part of the replay and were not compared.
