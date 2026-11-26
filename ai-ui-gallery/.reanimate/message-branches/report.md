# message-branches: reanimate report

**Cloned:** assistant-ui "Edit a sent message" (https://www.assistant-ui.com/elements/edit-message), **pixel-faithful** (assistant-ui is MIT; attribution to the assistant-ui authors in `meta.ts` and `selection.md`).

**Behaviour:** the page opens in the editor state, as the reference does: an in-place editor with the amber line "sending starts a new branch; N replies stay on the old one" and Cancel / Send. Cancel or Send gives the right-aligned sent bubble, and clicking the bubble re-opens the editor. The reference has no transitions beyond a 150 ms hover tint and a 0.96 press squeeze, so the clone has none either.

**Code:** `src/clones/message-branches/` (`index.tsx`, `message-branches.css`, `meta.ts`). View it at `/c/message-branches`.

**Spec rows measured from the reference** (computed styles, oklch colours, Public Sans and JetBrains Mono):
- Card: 20 px radius, 14 px padding, 12 px gap.
- Textarea: 12 px radius, 13.5 px text.
- Warning line: 11 px mono in amber-700.
- Buttons: pill, 32 px high.
- Sent bubble: 16 px radius, max-width 85%.

## Verification (1 round)

Setup: 1440x1000 viewport, clip 352,307,784,360 on the reference; `[data-stage]` on the clone; real clock, static capture (there is no motion to track).

| Row | Result | Verdict |
|---|---|---|
| Edit state, 3 frames at 0.0 / 0.2 / 0.4 s | mean mismatch 0.6% (threshold 2% for pixel-faithful), timing error 0 s | PASS |
| Sent state (after clicking Send in both) | mean mismatch 0.95% | PASS |
| Sent-state timing | start −0.3 s: the reference's pre-js click lands at a different moment from the clone's, and the frames are static | artefact, not a real deviation |
| Easing | no easing rows; the reference swaps states instantly | n/a |

Sheet: `compare-1/sheets/compare-01.webp`.

## Residual deviations
- The clone has no 1 px figure border or 6 px radius around the stage, so a faint ring differs. That accounts for most of the 0.6%.
- The page background has a faint gradient in the reference that the clone does not reproduce (the clone is flat #fdfcfa).
- The amber text and the Send label show anti-aliasing and sub-pixel differences in the diff, well under 1%.
- Keyboard focus behaviour was not tested.

## Candidates
Winner: assistant-ui Edit a sent message (complete edit flow with an honest branch warning). Runner-up: assistant-ui Message branches (the ‹ 1/3 › switcher with a 300 ms fade/slide-in per version; only the switcher, so not cloned). Both loaded. Details in `selection.md`.
