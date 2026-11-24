# agent-handoff: motion spec

- **Target**: AI Elements "Subagent" demo preview, https://ui.shadcn.com/docs/ai-elements/base/subagent (`[data-slot=preview]`, 638×517 at 1440×900, the code panel under it hidden by `hide-code.js`). One replay of the demo, triggered by its Replay button.
- **Destination**: `ai-ui-gallery/src/clones/agent-handoff/` (React 19 + TS, clone-local CSS, lucide-react; no motion library needed: every change is a state swap plus CSS keyframes).
- **Fidelity**: pixel-faithful. shadcn/ui is MIT (LICENSE.md in shadcn-ui/ui, "Copyright (c) 2023 shadcn"); the demo lives at `apps/v4/examples/base/subagent-demo.tsx` in that repo. Same font (Geist from Google Fonts), colours, spacing, radii and sample copy, with attribution in `meta`.

## Capture

`capture.ts --viewport 1440x901 --trigger click --wait-before 5000 --pre-roll 200 --duration 5600 --fps 60 --clock virtual --network-wait 300`

- reference: `--url https://ui.shadcn.com/docs/ai-elements/base/subagent --target 'button:has-text("Replay")' --pre-js hide-code.js --clip 401,267,638,517`
- clone: `--url http://127.0.0.1:<port>/c/agent-handoff?autoplay=0 --target '[data-ah=replay]' --selector '[data-stage]'`
- track: `[data-slot=preview] > div > div:first-child` (ref) / `[data-ah=root]` (clone), `[data-slot=trace-collapsible-content]`, `[data-slot=trace-line]`, `p`
- click lands at (162, 439) in the crop; the pointer stays there, so the Replay button that returns at the end is hovered (bg #f5f5f5).

Times are ms after the click on the track clock (frame = 13 + t/16.67).

## Rows

| # | element | trigger | t (ms) | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | whole demo | click | 0 | instant | finished transcript → user bubble + "Running the research subagent" line (spinner, shimmer, no chevron) | step | container 437 → 288 (min-h-72) |
| 2 | spinner (every running line) | mount | 0 | 1000 / rev, infinite | rotate 0 → 360° | linear | lucide LoaderCircle 16 px, CSS `spin` |
| 3 | shimmer (every running title) | mount | 0 | 2000, infinite | background-position-x 100 % → 0 | linear | gradient 110deg, band ±33.9 / ±67.8 px, size calc(200% + 135.69px); base #737373, band #737373 at 0.6 / 0.2 alpha |
| 4 | header line | step 1 | 600 | instant | plain line → collapsible trigger with chevron (down, rotate 90°) | step | the line remounts, so its spinner and shimmer restart at 600 |
| 5 | subagent panel | step 1 | 600 | instant | none → 32 px (mt 8 + row 20 + mb 4) | step | border-l #e5e5e5 at x+7, rows at x+24; no height transition |
| 6 | child 1 grep | step 1 / 2 | 600 / 1600 | instant | running (spinner, shimmer) → "Ran …" check + chevron right | step | panel 32 → 60 |
| 7 | child 2 sed | step 2 / 3 | 1600 / 2600 | instant | as 6 | step | panel 60 → 88 |
| 8 | child 3 ls | step 3 / done | 2600 / 3600 | instant | as 6 | step | |
| 9 | header + report | done | 3600 | instant | header → "Ran the research subagent" check; report paragraph (2 lines, 22.75 px leading) | step | panel 88 → 145.5, container 288 → 297 |
| 10 | answer stream | done + 433 | 4033 | 20 ms per word, 32 words | words appended | linear steps | 4 lines (wraps at 4200 / 4417 / 4583) |
| 11 | Replay button | last word | 4650 | instant | appears, hovered | step | container → 437 |
| 12 | rest | | > 4650 | | no change | | |

## Static facts

- Stage 638×517, white. Demo column 384 wide at x 127, y 40; py 24, gap 16, min-height 288.
- Geist 400/500, 14 px, line-height 20; colour #000 for answer and Replay, #737373 for the trace.
- User bubble: right aligned, max-width 80 % (307.2), radius 22, padding 10/12, line-height 22.75, bg #f5f5f5, 1 px transparent border.
- Trace rows 20 px tall with gap 8; icon 16 px, gap 8 to title; trigger gap 4 to chevron.
- Panel inner: margin 8 0 4 7, border-left 1 px #e5e5e5, padding 0 4 0 16, gap 12, line-height 22.75.
- Replay: h 28, px 12, radius 18, border 1 px #e5e5e5, Geist 500 14 px, bg white, hover #f5f5f5.

## Additions (not in the verified run)

- Clicking the header folds and unfolds the subagent panel (height transition 200 ms, Base UI's `duration-200`), and clicking a finished step opens its stdout.
- `?autoplay=0` starts in the finished state for captures; `reanimate:replay` restarts.
