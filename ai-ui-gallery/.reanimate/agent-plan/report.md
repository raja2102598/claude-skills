# agent-plan: reanimate report

**Cloned:** the beUI Pro "Agent Plan → Plan runner" preview (https://pro.beui.dev/components/agent-plan). One full demo run: draft (700 ms) → auto-run → steps 1-4 stream tool-call lines and finish → step 5 fails with an error line and Retry → "Needs attention".

**Fidelity:** motion-faithful (paid catalog, source locked). Everything visible is ours:
- copy: a CSV-export plan by the fictional agent "Atlas" on model "nova-2"
- palette: cool near-black with an indigo accent; a different tool-colour mapping
- fonts: Inter + JetBrains Mono
- icons: lucide

**Added beyond the reference demo** (they don't affect the cloned motion):
- Stop/Resume
- Retry (re-runs the step, which then passes; the run ends in "Done")
- edit (pencil) back to draft
- add or remove a step in the draft
- steering notes that insert an "added" step after the current one

**Code:** `src/clones/agent-plan/index.tsx` (component), `plan-data.ts` (steps and timing), `agent-plan.css` (fonts, palette, spin/ping/pulse keyframes), `meta.ts`.
- **Trigger:** plays on mount.
- **Replay:** `window.dispatchEvent(new Event("reanimate:replay"))` remounts it; the capture uses this.

## Capture

Both sides use the same settings:
- `--viewport 1440x1199 --trigger none --wait-before 3000 --pre-roll 0 --duration 12000 --fps 20 --clock virtual`
- crop 496x549 (`--clip`: 592,481 on the reference, which is the card plus 24 px; 472,325 on the clone, which is the `[data-stage]` rect)
- `--pre-js` remounts the demo:
  - reference: clicks the preview's "Refresh preview" button
  - clone: dispatches `reanimate:replay`

The reference is deterministic: two captures differed by 0 px on every 20th frame.

**WAAPI rows** (opacity fades, cross-fades) collapse to one frame under the virtual clock. I measured them on both sides with real-clock rAF probes (`ref-realclock*/`, `clone-6-realclock/`). Rounds 6 and 7 only changed the failure timing and the connector, so the round-6 real-clock probe of the clone still covers the final code for these rows.

## Verification (round 7 of 7)

compare.ts (offset 0):
- mean mismatch **3.40%** (at rest about 2.9%: copy, colours, fonts)
- worst frame 4.4% at 0.75 s
- motion window: ref frames 14–215, clone 14–215
- timing error: start 0 s, end 0 s, duration 0 s, peak 0 s → **PASS**

Card-height events: 14 of 14 at the same time, the same direction and the same size (±0.1 px). Two of them are one rAF off: 1300 → 1317 ms and 5817 → 5800 ms. Max |error| is 17 ms.

| # | spec row | timing err | easing (ref → clone) | numbers | result |
|---|---|---|---|---|---|
| 1 | draft hold 700 ms, no entrance | 0 | — | frames 0–13 static on both sides | pass |
| 2 | status pill label + colour | 0 (frame 14) | CSS 300 ms (0.4,0,0.2,1) on both | | pass |
| 3 | pill ping while running | 0 | 1 s (0,0,0.2,1) loop on both | | pass |
| 4 | draft remove-slot drop (badge/time shift 28 px) | 0 | instant | | pass |
| 5 | markers + spinner | 0 | 1 turn/s linear | | pass |
| 6 | title colours | 0 | CSS 300 ms | | pass |
| 7 | input + footer text at run start | 0 | instant | | pass |
| 8 | footer Run plan → Stop | 0 | old fade: ~110 ms in the ref probe vs ~115 ms in the clone; new: expo-out 300 | Stop at 0.8 scale at 0.75 s on both; first real-clock sample 0.95 (ref) / 0.97 (clone) | pass |
| 9 | output block enters (card h +22) | 0 | easeOutExpo 275 → easeOutExpo 300 | meanAbsDiff 0.19 px (0.9% of travel) | pass |
| 10 | output line x -4 → 0 (+opacity) | 0 | easeOutExpo 293 → 300 | x meanAbsDiff 0.01 px (0.2%); opacity expo-out on both (real clock) | pass |
| 11 | line schedule (100 ms tick grid) | ≤17 ms on 7 insertions | — | 1317/1900/3300/4900/5800/7517/9517 vs 1300/1900/3300/4900/5817/7517/9517 | pass |
| 12 | layout slide after a line | ≤17 ms | easeOutExpo 218 → easeOutExpo 218 | row 2 meanAbsDiff 0.02 px (0.1%) | pass |
| 13 | step handoff (collapse, marker swap, next output) | 0 (2533/4033/6633/8333 on both) | card h: easeOutExpo 275 → out-family 200 (Material emphasized) | card h meanAbsDiff 1.07 px (3.0%); row slide 1.73 px (3.0%); marker fade ~105 ms (ref) vs ~117 ms (clone) | pass |
| 14 | connector fill scaleY | 0 | expo-out 300 | white px at frames 51–56: ref 19/15/14/13/11/11, clone 17/21/17/16/13/13 | pass |
| 15 | segment fill (linear, 100 ms tick, ~100 ms lag) | ≤1 frame | linear | width diff max 2 px, mean 0.06 px over 241 frames | pass |
| 16 | segment colour accent → fg / red | 0 | CSS 300 ms | | pass |
| 17 | timers (0.1 s per tick, totals 1.8/1.5/2.6/1.7/2.3/9.9 s, 12 calls) | 0 | step | same text in every sheet frame | pass |
| 18 | failure at 10.6 s (+54 px, X pop, red, Retry, pencil) | 0 (10617 on both) | footer jump meanAbsDiff 0.00 | | pass |
| 19 | rest after ~11 s | 0 | — | no activity after frame 215 on either side | pass |

Sheet: `compare-7/sheets/compare-01.webp` (whole run, every 1.2 s). The frame-by-frame key-moment sheets (run start, insert, handoff, fail) stay out of git with the raw captures.

## Residual deviations

1. **Cross-fades show as ghosts in the virtual-clock sheets** (frames 15, 51, 213; mismatch 4.1–4.4% vs 2.9% at rest). This affects the marker swaps, the footer button swaps and the output exit fade. The reference's WAAPI opacity does not run under the virtual clock, so `ref/` shows those swaps instantly. The clone follows the reference's real-clock probe instead: old element fades over ~110 ms, new one pops in over 300 ms.
2. **Two of seven line insertions land one rAF (17 ms) off** (1300 vs 1317 ms; 5817 vs 5800 ms). Both sides run on the same 100 ms tick grid; the difference is how timers and frames are ordered on the virtual clock. This is within ±80 ms.
3. **The footer's "Step N of 6 · calls" text changes one frame (≤50 ms at 20 fps) earlier in the reference** at each handoff. The reference updates the footer on the tick and the rows ~33 ms later; the clone updates both at the handoff.
4. **Handoff collapse curve** fits Material-emphasized 200 ms in the clone vs easeOutExpo 275 ms in the reference. Both are ease-out. Mean difference is 3.0% of travel, with a maximum of 11 px on the first frame. In the clone, the exit and enter height tweens start in the same commit.
5. **About 2.9% static mismatch** comes from our copy, palette and fonts (Inter/JetBrains Mono vs Geist), plus two page rules below the reference card (crop y 471/492) that are not part of the component.

## Rounds

1. Motion's WAAPI opacity was frozen under the virtual clock; fixed by giving motion an `onUpdate` listener, which keeps the tween on the JS frameloop.
2. Tick drift at each handoff.
3. Rows below did not slide on line inserts; fixed with a `LayoutGroup`.
4. Cross-fades taken from the real-clock probe, run start aligned to the remount, layout timing set to 220 ms.
5. Tick grid anchored to the run start.
6. Failure and line-commit timing.
7. Connector fill was stuck under the virtual clock; same JS-frameloop fix.

Rounds 6 and 7 went past the 5-round guideline. Every row already passed after round 5; the agent continued to fix a stuck connector that round 6's verification uncovered.

## Candidates
Winner: beUI Pro Agent Plan (Plan runner), the most complete run of the six: draft, auto-run, streamed tool calls with timers, then a failed step that waits for Retry. Runner-up: Arc UI Agent plan. All six candidates loaded (Arc's preview takes about 5 s to render, beUI's about 3.5 s). Details in `selection.md`.
