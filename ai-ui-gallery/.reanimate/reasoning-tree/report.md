# reasoning-tree: reanimate report

**Fidelity: motion-faithful.** The reference is Arc UI "Reasoning tree" (https://uiarc.dev/components/reasoning-tree, Pro, paid). Cloned the whole preview card (667x539), with nothing added. **Status: pass** — every event, including the end-of-run tail, is within ±80 ms of the reference.

**Behaviour:**
- **Run:** it starts on mount and plays the full sequence. Ready (play icon, a card taller than the stage, controls below the fold, card 10 px lower) is painted for one frame. Then the stage shrinks 360 ms, the controls slide in, the play icon crossfades to pause and the status becomes "Reading the question", all in the same tick. The reference's own Ready is its pre-hydration state, and autoplay starts at hydration.
- **Reading:** reading lasts 550 ms.
- **Per depth:**
  - **Propose:** edges draw in (200 ms, `cubic-bezier(.22,1,.36,1)`, 20 ms per sibling) while nodes fade in (opacity only, 200 ms, delay 100 ms + 20 ms per sibling). The previous column label dims and the new one darkens (200 ms).
  - **Score:** bars scale 0 to the final value in 640 ms (same easing, 20 ms per sibling) and numbers count up via an `@property --rt-n` integer counter on the same tween. There is no rough interim value.
  - **Keep:** the top N stay and turn blue. The rest fade to 0.4 (200 ms), their fill goes pale grey and their edges retract (200 ms, `cubic-bezier(.65,0,.35,1)`). A "k of n kept" label fades in (150 ms).
- **Answer and tail (1.26 s):** at depth 3 the non-best nodes fade to 0.4 and their edges retract. A "Best of n" label and a green check in the status line appear. The winning path draws as one line (760 ms after a 160 ms delay, `cubic-bezier(.65,0,.35,1)`) with a short sheen travelling along it that fades out over 220 ms from 920 ms. The path nodes' borders highlight in turn (question, depth 1, depth 2, best, at 160, 413, 667 and 920 ms, 200 ms each). The best node turns green with a settle pulse (scale 0.965, 380 ms, at 880 ms) and a check (200 ms, at 920 ms).
- **Status text:** the old line fades out (100 ms) and the new one fades in (150 ms, after 115 ms). The shimmer is 1800 ms linear.
- **Controls:**
  - **Play/pause, Step, Reset:** these work and use a rAF-driven clock that can pause and step. The play and pause icons crossfade (100 ms out, 150 ms in). At the answer the play icon returns and Step greys out.
  - **Beam width 1/2/3:** it restarts the run with a spring-sliding pill. The tree data has 3 depth-1 nodes with 2 children each, so every beam width works.
- **Layout:** columns at x 20/167/337/506, widths 119/140/140/140, and a 62 px pitch with children centred on their parent.
- **Reduced motion:** transitions, the shimmer and the tail animations are turned off.

Own palette, copy, Geist, lucide icons and a fictional model name ("Nova 2"). No source, CSS, SVG or text from the site was used.

**Code:** `src/clones/reasoning-tree/` (`index.tsx`, `data.ts`, `reasoning-tree.css`, `meta.ts`).

**Triggers:** plays on load. Play is `[data-rt-play]`, beam buttons are `[data-rt-beam=N]`, and the status text is `[data-rt-status]`.

**Method:**
- **Capture settings:** reference and clone were both captured on the virtual clock (`--clock virtual --network-wait 150`, viewport 1440x1100, 20 fps, 15 s). The reference used `--clip 380,412,667,539` and the clone used `--selector [data-stage]`. The compare used `--offset 0`, with t=0 at navigation.
- **Probes:** the reference was probed on the real clock first with a `getAnimations()` and status log, to learn which rows are WAAPI. Only the status-text crossfade is. Everything else is CSS transitions and CSS animations, which the virtual clock drives. It was then probed on the virtual clock with the same script, and the clone was probed the same way.
- **Easings:** they come from the reference's declared transition and animation timing (`getAnimations()`), not by eye: node opacity, edge draw and undraw, bar, counter, column colour, path draw, sheen, settle and check.
- **Step times:** the ms offsets from Reading are propose 550, score 1184, keep 2084, propose 2867, score 3484, keep 4384, propose 5150, score 5784 and answer 6684. The clone subtracts 40 ms from every step after Reading to offset its rAF-clock lag.

**Rounds** (3, new folders ref-1, clone-5/6/7, compare-5/6/7):
1. Clone-5: the new Ready state, step machine, tail, undraw edges and measured easings were added, and the old two-stage scoring was removed. All events ran about 90 ms late, because the clone's Reading started about 85 ms after the reference's. Timing error: start 0.05 s, end 0.25 s.
2. Clone-6: the Ready dwell was removed so Reading starts at the next tick. The path-node highlight delay was fixed to 160/413/667/920 ms, and the status-line check was added. Events were +1 frame, end +0.10 s.
3. Clone-7: 40 ms was taken off the steps after Reading. Timing error: start 0 s, end +0.05 s, pass.

**Final compare (compare-7, 301 frames at 20 fps, offset 0):**

| item | ref to clone | result |
|---|---|---|
| mean frame mismatch | 3.13 % (limit 5 %; from copy, font, palette) | pass |
| start timing | 0.00 s | pass |
| end of motion | +0.05 s (ref last burst at frame 159, clone 160) | pass |
| peak timing | -0.1 s | not a motion event: the peak is the biggest-burst frame during the collapse |
| burst onsets (frames) | ref 2, 25, 43, 58, 71, 89, 104, 117, 134; clone 2, 25, 43, 58, 71, 89, 104, 117, 135 | pass (≤ 1 frame, 50 ms) |
| step starts (probe, ms from Reading) | clone -50 ms against the reference at every step (propose 500 vs 550 ... answer 6633 vs 6684) | pass |
| tail: draw 760 ms with 160 ms delay, sheen, border highlights, settle, check | the same animations start at the same step as the reference | pass |
| node fade 200 ms, edge draw 200 ms, bar and counter 640 ms, collapse 360 ms | same durations and easings as the reference's getAnimations | pass |
| status shimmer | 1800 ms linear, matched | pass |

Sheet: `compare-7/sheets/compare-01.webp` (sheets 02 to 07 are not committed).

**Residual deviations:**
- **Step times -50 ms:** the clone is 50 ms early at every step after Reading (500 against 550 at propose 1), which is the 40 ms trim plus rAF quantisation. The ±80 ms limit still holds, and the frame onsets are within one frame.
- **Peak:** the compare peak differs by -0.1 s. The reference's largest burst is the collapse and card appearance, and the clone's is at a neighbouring frame. This is an artifact of the burst size and not a timing error.
- **Frame 0:** the reference's first frame is blank (the card is not yet painted) while the clone paints Ready. Frame 1 and later match.
- **Interim values and run variance:** the reference's depth-3 scores vary between runs (Ship Thursday 0.90 or 0.78), and the clone uses fixed scores. The old "wobble" interim value was not reproduced, because the declared transition is a single 0 to final tween.
- **Best-node check:** the reference's check fades in over 150 ms and scales over 200 ms. The clone uses one 200 ms animation for both.
- **Not measured:** pause, step, reset and beam widths 1 and 3 were not captured or compared.
- **Copy and palette:** the pixel mismatch (3.1 %) comes from own copy, font rendering, palette and the card's corner radius.
