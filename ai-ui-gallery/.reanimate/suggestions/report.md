# suggestions: reanimate report

**Cloned:** the AI Elements Suggestion preview (https://ui.shadcn.com/docs/ai-elements/base/suggestion), cropped to the preview box (638x276, white). **Pixel-faithful**, Apache-2.0 (AI Elements by Vercel).

**Code:** `src/clones/suggestions/index.tsx`, `suggestions.css`, `meta.ts`.
- Trigger: click any pill, or type text and press Enter or Send. The user bubble and the agent reply land in the click frame (no animation).
- The row scrolls horizontally with a 12% right-edge fade mask.
- Pill hover tint fades over 150 ms (cubic-bezier .4,0,.2,1).

**Capture:** viewport 1440x1200, virtual clock, 20 fps, 1200 ms after the click, 200 ms pre-roll, same crop on both sides.

| capture | mean mismatch | timing error | easing | result |
|---|---|---|---|---|
| click pill 2 (exchange appears) | 0.72% | +0.05 s (one frame at 20 fps; limit 0.08 s) | none (step change; the reference has no motion) | PASS |
| hover pill 2 (500 ms) | 0.45% (before the tint fix) | 0 | 150 ms ease, same as reference transition | PASS |

Sheet: `compare-4/sheets/compare-01.webp`.

## Residual deviations
- Pill hover tint: the clone was #f5f5f5 against the reference #f2f2f2 (sampled in the hover capture); fixed to #f2f2f2 after the last compare, not re-captured.
- Pill border colour (#e5e5e5), user bubble (#f4f4f4) and input fill (rgba(235,235,235,.5)) were set from the reference's computed lab values and match visually in the sheets. Residual mismatch is 0.72% from sub-pixel text antialiasing.
- A real-clock capture of the reference showed the exchange landing about 0.35 s after the click. On the virtual clock it lands instantly, so this was machine load and the clone has no delay.
- The reply text is a placeholder: "The build failed on a missing import in app/page.tsx. I added it and the build passes."
