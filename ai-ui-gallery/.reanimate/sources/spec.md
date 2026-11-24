# sources: motion spec

- **Target**: AI Elements "Sources" demo preview, https://ui.shadcn.com/docs/ai-elements/base/sources (`[data-slot=preview]`, 638×397 at 1440×900, crop `--clip 401,267,638,397`, the code panel under it hidden by `hide-code.js`). Two interactions: one replay of the demo (its Replay button) and folding the "Used 3 sources" list (its trigger).
- **Destination**: `ai-ui-gallery/src/clones/sources/` (React 19 + TS, clone-local CSS, lucide-react; no motion library: every change is a state swap, a CSS height transition and CSS transitions for colour and rotation, which keep time on the virtual clock too).
- **Fidelity**: pixel-faithful. shadcn/ui is MIT (LICENSE.md in shadcn-ui/ui, "Copyright (c) 2023 shadcn"); the demo is `apps/v4/examples/base/sources-demo.tsx` (copy in `src-ref/`), built on the AI Elements `Trace` (`src-ref/trace.tsx`), `Message`, `Bubble` and `Button`. Same font (Geist 400/500 from Google Fonts), colours, spacing, radii and layout, with attribution in `meta`. Copy text: fictional question, answer and source sites (placeholder titles and domains, no real publications).

## Capture

`capture.sh` / `capclone.sh`: `--viewport 1440x900 --wait-before 5000 --pre-roll 200 --clock virtual --network-wait 300 --fps 60`

- reference: `--url https://ui.shadcn.com/docs/ai-elements/base/sources --pre-js hide-code.js --clip 401,267,638,397`
- clone: `--url http://127.0.0.1:<port>/c/sources?autoplay=0 --selector "[data-stage]"`
- replay: `--trigger click --target 'button:has-text("Replay")' --duration 1800`
- close: `--trigger click --target '[data-slot=trace-collapsible-trigger]' --duration 600`
- t = ms after the click; frame = 12 + t / 16.67.

## Rows

| # | element | trigger | t (ms) | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | whole demo | Replay click | 0 | instant | finished transcript → user bubble only; Replay gone | step | container 316.75 → 288 (min-h-72) |
| 2 | answer paragraph | stream | 20 + 20·k (k = 0…14) | 20 ms per word, 16 words | words appended (first visible on frame 14 = 33 ms, then one per frame with every 6th frame skipped) | linear steps | wraps to line 2 at "scaffolds" (k = 9) |
| 3 | last word + sources + Replay | stream end | 320 (visible 333) | instant | 15 words → full text; "Used 3 sources" trace (open) and the Replay button appear together | step | container → 316.75; no height animation on mount |
| 4 | Replay button | appears under the pointer | 333 | 150 | bg white → #f5f5f5 (hover) | cubic-bezier(0.4, 0, 0.2, 1) | the pointer stays where the click landed |
| 5 | source panel | trigger click | starts ~17 (one frame late) | 200 | height 88 → 0, then unmounted (hidden) | cubic-bezier(0.4, 0, 0.2, 1) | 33 ms: 86.5, 50: 80.5, 100: 31.1, 150: 7.0, 200: 0.3, 217: gone |
| 6 | chevron | trigger click | 0 | 150 | rotate 90° → 0 (down → right) | cubic-bezier(0.4, 0, 0.2, 1) | Tailwind `rotate` property |
| 7 | trigger colour | pointer enters (click) | 0 | 150 | #737373 → #000 | cubic-bezier(0.4, 0, 0.2, 1) | `hover:text-foreground` |
| 8 | Replay button | follows panel | 17–217 | 200 | y 304.75 → 216.75 (crop) | as row 5 | layout |
| 9 | rest | | > 333 / > 217 | | no change | | |

Open (not captured, symmetric by construction in Base UI): height 0 → 88 over 200 ms, chevron 0 → 90°.
Hover a source row: colour #737373 → #000 over 150 ms.

## Static facts (crop coordinates, from `ref-styles.txt`)

- Stage 638×397, white (`lab(100 0 0)`). Demo column 384 wide at x 127, y 40 (preview `p-10`, centred); `py-6`, `gap-4`, `min-h-72`, `text-sm` (14/20).
- Geist 400 (500 for Replay), colour #000; muted `lab(48.496 0 0)` = #737373; border `lab(90.952 0 0)` = #e5e5e5; bubble fill `lab(96.52 0 0)` = #f5f5f5.
- User bubble: right aligned, w-fit, max-width 80 %, radius 22, padding 10/12, line-height 22.75, 1 px transparent border; box 299.41×44.75 at x 211.59, y 64.
- Answer `<p>` at y 124.75, 384×40; message-content gap 16.
- Trace trigger at y 180.75, h 20: globe 16 px, gap 8, title "Used 3 sources" (98.67), gap 4, chevron 16 px (x 253.67). Trigger radius 10.
- Panel at y 200.75, h 88: inner margin 8 0 4 7, border-left 1 px #e5e5e5, padding 0 4 0 16, line-height 22.75; rows 20 px with gap 8 at x 151; arrow-up-right 16 px with `-ml-1` (gap 4 after title).
- Replay at y 304.75: h 28, px 12, radius 18, border 1 px #e5e5e5, Geist 500, bg white, hover #f5f5f5, `transition: all 150ms`.
- Duplicate source URLs are dropped (the stream sends 4 sources, 3 rows show).

## Additions

- `?autoplay=0` starts on the finished transcript for captures; without it the demo plays once on mount. `window.dispatchEvent(new Event("reanimate:replay"))` replays.
- Placeholder copy: a fictional "Fernkit" CLI and three fictional doc sites (same character counts as close as practical so the layout and line breaks hold).
