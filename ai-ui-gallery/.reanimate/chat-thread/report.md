# chat-thread: reanimate report

**Clone**: `src/clones/chat-thread/` (`index.tsx`, `script.ts`, `chat-thread.css`, `meta.ts`), rendered alone at `/c/chat-thread`. It autoplays a looping demo; `?autoplay=0` is the capture mode, triggered by a click on the hidden `[data-ct-start]` button.

**Reference**: Arc UI "AI chat" block, https://uiarc.dev/components/blocks/ai-chat. The crop is `section[class*="chat_root"]` with `--chat-height: 720px`, at clip 341,147 and size 745x720.

**Fidelity**: motion-faithful. Arc UI Pro is a paid block with no open-source license. The clone uses:
- its own warm palette;
- Geist / Geist Mono (Google Fonts) and lucide icons;
- an original spark mark and the model "Nova 2";
- placeholder copy about a slow nightly import, with an 8-worker follow-up.

No Arc source, CSS, SVG or text was copied. Arc's CSS and `getAnimations()` were read only for durations and easings.

**What was cloned**: the whole thread surface, playing the reference's scripted two-turn demo.
- **Turn 1:** the user bubble and reply fade in (150 ms). "Thinking" shimmers. The chevron fades in. A tool chip pops in with a spinner while the label swaps to "Thought for 4s", the swap box springing to its new width.
- **Tool result:** the chip swaps to "Searched the docs · 3 sources" and springs wider.
- **Answer:** markdown streams in 51 ticks of 50 ms (paragraph, numbered list, SQL code block line by line, paragraph). Each chunk fades in over 150 ms. The thread follows the live edge with a per-frame lerp (k = 0.22).
- **End of turn:** Stop turns back into the send arrow and the reply actions fade in.
- **Turn 2:** a follow-up is sent automatically at 6.48 s and runs the same phases (37 ticks, bash block).
- **Shell:** header (chat title, model chip, new chat) and a docked pill composer.

**Additions**: none to the compared motion. These interactions exist in the reference and are wired in the clone, but are not in the capture:
- typing plus Enter sends a short scripted turn; Stop ends a stream;
- the "scroll to latest" button appears when the reader scrolls up and glides back to the live edge;
- hovering a user turn shows copy/edit;
- new chat clears the thread.

**Rounds**: 3, the speed-mode cap.
- Round 1: build and first compare.
- Round 2: frame-tolerance fix, state probe and geometry probe.
- Round 3: width springs actually animating, with a one-frame head start; chevron and Stop shifted one frame; inline-code token fix.

## Verification, final round (3)

**Whole-frame compare** (virtual clock, 10 fps, 118 frames, offset 0, `compare-3/`):

| metric | value | result |
|---|---|---|
| mean mismatch | 3.42 % (max 5.8 % at 6.7 s) | trend only (palette, font and copy differ on purpose) |
| motion window, raw compare.ts | ref 1–102, clone 3–102 → start +0.2 s | artifact: reference frames 1–5 are the docs page's own Code→Preview switch and its 6 px panel slide, not the component |
| motion window from 0.6 s (activity > 0.001) | ref 0.7–10.2 s, peak 6.7 s; clone 0.7–10.2 s, peak 6.7 s | start / end / duration / peak error 0.00 / 0.00 / 0.00 / 0.00 s: pass |
| activity curve | same bars frame by frame (stream 2.7–4.2 s, follow 4.3–5.3 s, turn 2 at 6.7–7.5 s and 8.3–10.2 s) | pass, except frame 50 (residual 4) |

Sheet: `compare-3/sheets/compare-01.webp` (reference │ clone │ diff, every 4th frame). The other sheets stay out of git.

**Spec rows.** Times are ms from the trigger. Sources:
- "probe" = rAF state probes; both sides carry the same sampling lag, so values compare directly.
- "track" = 60 Hz geometry. Clone samples there sit uniformly +16.7 ms late because the clone commits inside rAF after the tracker samples. Frames confirm these land on the same painted frame.

| # | row | ref | clone | err | result |
|---|---|---|---|---|---|
| 1 | turn 1 mount + 150 ms fade (same declared CSS) | 17 | 17 | 0 | pass |
| 2–3 | send → Stop (probe) | 467 | 450 | −17 | pass |
| 4 | "Thinking" shimmer, band darkness per 10 px band | band peaks 0.65 / 0.8 / 1.05 / 1.2 s, +32 levels | 0.6 / 0.8 / 1.0 / 1.1 s, +70 levels | −50…−100 | borderline, see residual 1 |
| 5 | chevron fade (opacity 0.44 one frame in) | 583 | 583 | 0 | pass |
| 6 | tool chip mount (probe) | 1467 | 1467 | 0 | pass |
| 7 | label swap, y +2 → 0 | 1.109 / 0.573 / 0.267 / 0.117 at 1483–1533 | 1.124 / 0.565 / 0.267 / 0.119 | 0 | pass |
| 8 | thought-button width spring (ω 25.75, critically damped) | t50 1533, t90 1617 | t50 1533, t90 1617 | 0; mean \|Δ\| 0.6 % of travel (max 1.5 %) | pass |
| 9 | tool-chip width spring | t50 2383, t90 2467 | t50 2383, t90 2467 | 0; mean 0.5 % (max 0.8 %) | pass |
| 10–11 | turn 1 stream, 50 ms ticks (probe) | first 2450, last 4950 | first 2450, last 4950 | 0 | pass |
| 12 | turn 1 block growth: md height steps (16) and code lines 1→8 (probe 3800, 3900, 4000, 4150, 4250, 4400) | 16 steps | 16 steps, same spacing; code lines identical | 0 | pass |
| 13 | follow live edge (thread y) | – | turn 1 mean \|Δ\| 1.7 px over 157 px travel; turn 2 jump 5.4 px over 151 px, the curve identical shifted one frame; turn 2 follow 0.9 px over 407 px; final scrollTop 715 = 715 | +17 visual | pass, see residual 2 |
| 14 | Stop → arrow (probe) | 5000 | 5000 | 0 | pass |
| 15 | actions turn 1 fade (0.44 / 0.72 / 0.87 / 0.94 / 0.98 per frame) | 5000 (probe) | 5000 | 0, identical curve | pass |
| 16–17 | turn 2 append + Stop (probe) | 6500 / 6500 | 6500 / 6500 | 0 | pass |
| 18 | turn 2 tool chip (probe) | 7050 | 7050 | 0 | pass |
| 19 | turn 2 tool done (probe) | 7950 | 7933 | −17 | pass |
| 20 | turn 2 stream: first / last tick, 37 steps, code lines 1→6 | 8067 / 9867 | 8067 / 9867, lines identical | 0 | pass |
| 21 | turn 2 done: arrow + actions (probe) | 9917 | 9917 | 0 | pass |
| 22 | chunk spans flattened 250 ms after the end | – | not cloned (no visual change) | – | n/a |

21 of 22 rows pass; row 4 is borderline.

## Residual deviations

1. **"Thinking" shimmer** (row 4):
   - The band crosses the label 50–100 ms early (band 3 peaks at 1.1 s vs 1.2 s).
   - It darkens the text by +70 grey levels against the reference's +32.
   - Cause: it was tuned from 10 fps frame darkness before round 1, and no round was left to retune it.
   - Fix: a mid-grey shine (about #5c564e) and ~50 px/s instead of 57.
2. **Scroll follow one frame (16.7 ms) behind** (row 13):
   - The reference applies its first scroll step in the frame where the content grows (likely a ResizeObserver). The clone applies it on the next rAF.
   - Evidence: the turn-2 jump curve matches exactly when shifted one frame (mean \|Δ\| 0.00 px shifted vs 5.4 px unshifted). In frames, the bubble top is at 543 vs 537 px at 6.6 s and equal from 6.8 s.
   - This is within ±80 ms. Fix: run the follow step after the commit, in the same rAF.
3. **Send → Stop 17 ms early.** Round 3 shifted it by a frame after comparing the clone's CSS icon fade with the reference's WAAPI icon swap, which collapses under the virtual clock. A schedule of 450 ms instead of 433 would match the probe exactly. Within tolerance.
4. **Frame 50** (activity 0.0013 ref vs 0.0255 clone). Only there, the reference waits one extra frame before scrolling after the growth at 4783 ms.
5. **Mean mismatch 3.4 %** across the sequence (2.6 % at the start, ~3.5 % at rest). Causes: the own palette, Geist vs Inter, copy and mark, as motion-faithful requires. Layout boxes match:
   - header 52, scroller 598, dock 0,650 745x70;
   - bubble 173,76 544x65;
   - reasoning 155, chip 193, markdown 233;
   - turn heights 719 / 529;
   - final scrollTop 715.

   Label widths differ with the font and copy: thought button 128 vs 117, chip 269 vs 256.
6. **Frames 0–5 of the reference** show the docs page's Code→Preview tab switch: a code-panel flash and a 6 px panel slide over 267 ms. At frames 0–2 the clone shows its empty state.
7. **Not measured:** the reference's scroll-to-latest button entrance, and real-clock (WAAPI) fades. The block's own animations are all CSS (`fadeIn` / `chunkIn` 150 ms cubic-bezier(.22,1,.36,1), `spin` 0.9 s, 150 ms transitions). Its label swap and widths run on JS. So the virtual clock drives every compared row, and real-clock probes were skipped as speed mode allows.

## Implementation notes

- One rAF loop does two things each frame: it steps the scroll follow, then commits the timeline with `flushSync`. Events use a 12 ms frame tolerance because the reference fires steps from timers.
- Fades are CSS keyframes and transitions. Label widths use `animate(motionValue)` with a spring (k 663, c 51.5), measured from the leaving label, with a one-frame head start computed from the spring's own position and velocity.
- `prefers-reduced-motion`: no fades or shimmer; the scroll and widths jump.
