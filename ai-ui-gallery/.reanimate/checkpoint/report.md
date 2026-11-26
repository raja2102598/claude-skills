# checkpoint: reanimate report

**Cloned:** the AI Elements Checkpoint preview (https://ui.shadcn.com/docs/ai-elements/base/checkpoint), `div.preview` cropped to 638x368, white. **Pixel-faithful**, Apache-2.0 (AI Elements by Vercel; license verified at raw.githubusercontent.com/vercel/ai-elements/main/LICENSE).

**Code:** `src/clones/checkpoint/index.tsx`, `checkpoint.css`, `meta.ts`.
- Initial state: user bubble "Rename the button component to action.", agent line, separator marker "Button renamed" with a Restore button, user bubble "Update the docs to match.", agent line.
- Trigger: click Restore. The later turn (second bubble and reply) disappears in the same frame, the Restore button disappears, and a Continue button appears at the bottom-left. Click Continue to restore the original thread. The reference has no animation on either click.
- Buttons have a 150 ms hover transition (cubic-bezier .4,0,.2,1). Geist font from Google Fonts. Bubbles 22px radius, buttons 18px radius.

**Capture:** viewport 1440x1200, virtual clock, 10 fps, 800 ms after the click on Restore, same crop size (638x368) on both sides.

| capture | mean mismatch | max mismatch | timing error | easing | result |
|---|---|---|---|---|---|
| click Restore (11 frames) | 0.00% | 0.00% | 0 s (change lands in frame 2 on both) | none (step change; the reference has no motion) | PASS |

Passed in round 1 of 3. Sheet: `compare-1/sheets/compare-01.webp` (frames at 0.0 s, 0.4 s and 0.8 s with all-white diffs).

## Residual deviations
- None measured. Not captured on either side: the Continue-click transition and hover tint (hover colour #f5f5f5 approximates the reference's `hover:bg-muted`; computed values were not sampled in a hover capture).
- The reference preview sits inside a rounded bordered docs card. The clone stage is the inner 638x368 area only.

## Candidates
AI Elements Checkpoint was the only candidate; it loaded fine. No runner-up. Details in `selection.md`.
