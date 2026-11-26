# sources: reanimate report

**Fidelity: pixel-faithful** to the AI Elements "Sources" demo (https://ui.shadcn.com/docs/ai-elements/base/sources; shadcn/ui, MIT; `apps/v4/examples/base/sources-demo.tsx`, attribution in `meta`).

What was cloned:
- the whole demo: a question bubble, a streamed answer, and a "Used 3 sources" trace line with three outbound source rows, collapsible;
- the Replay button.

Nothing was added except two testing hooks:
- `?autoplay=0` opens on the finished thread for captures;
- `reanimate:replay` restarts the demo.

Code:
- `src/clones/sources/index.tsx`
- `src/clones/sources/sources.css` (Geist 400/500 from Google Fonts)
- `src/clones/sources/meta.ts`

Trigger: the demo plays on mount. Replay replays it, and clicking "Used 3 sources" folds or unfolds the list.

Implementation:
- the stream is timed state swaps, committed with `flushSync`;
- fold and unfold is a CSS height transition, started one frame after the click as in Base UI, and the panel is hidden on `transitionend`;
- the chevron rotation and the hover colours are CSS transitions;
- no `motion`/WAAPI, so it keeps exact time on the virtual clock.

## Captures

- Settings: `--viewport 1440x901 --clock virtual --fps 60 --pre-roll 200 --wait-before 5000`.
- Reference: `--clip 401,267,638,397` with a pre-js that hides the code panel. Clone: `--selector [data-stage]`.
- Two interactions:
  - **replay**: click Replay, 1.8 s;
  - **close**: click the "Used 3 sources" trigger, 0.6 s.
- `compare.ts --offset 0 --threshold 0.02`.

## Last round (3)

| Interaction | Timing error | Mean mismatch | Mismatch outside the placeholder-domain rows | Result |
|---|---|---|---|---|
| replay | 0 ms (start, end, duration and peak) | 0.36 % | 0 px in all 121 frames | PASS |
| close | 0 ms | 0.16 % | 0 px in all 49 frames | PASS |

Sheets: `compare-3-replay/sheets/compare-01.webp`, `compare-3-close/sheets/compare-01.webp`.

| # | Spec row | Ref | Clone | Easing | Result |
|---|---|---|---|---|---|
| 1 | Replay resets to question only; container 316.75 → 288 | t 0 | t 0 | step | PASS |
| 2 | Answer streams 20 ms per word (first word visible at 33 ms, one per frame, every 6th frame skipped) | p h 20 @ 33 ms, 40 @ 200 ms | identical per frame | linear steps | PASS |
| 3 | Last word, sources (open) and Replay appear together | 333 ms | 333 ms | step | PASS |
| 4 | Replay appears under the pointer and takes the hover fill | frame 36 onward | identical pixels | 150 ms standard | PASS |
| 5 | Panel height 88 → 0, starts one frame late, hidden at the end | 86.47 / 80.5 / 31.13 / 6.97 / 0.33 @ 33 / 50 / 100 / 150 / 200 ms, gone at 217 | identical at every frame | cubic-bezier(0.4, 0, 0.2, 1) over 202 ms; fit rmse 0.004, max abs diff 0.33 px | PASS |
| 6 | Chevron rotates 90° → 0 over 150 ms | box 16.8 / 19.75 / 22.58 / 21.57 … @ 17 / 33 / 50 / 67 ms | identical | standard | PASS |
| 7 | Trigger colour #737373 → #000 on hover, 150 ms | | 0 px diff | standard | PASS |
| 8 | Replay follows the panel up (y 304.75 → 216.75) | | identical | as row 5 | PASS |

Rounds:
- **Round 1:** 0.5 px vertical shift. The 397 px stage was centred in a 900 px viewport, so it sat at y 251.5. Fixed by capturing both sides at 1440×901.
- **Round 2:** the panel was hidden one frame early (200 ms against 217 ms). Fixed by hiding it on `transitionend`, as Base UI does.

## Residual deviations

- **Source-row domain text: 0.36 % mean mismatch (replay), 0.16 % (close).** All of it sits in the three source rows (x 195–445, y 200–290 of the crop). The cited domains are deliberately placeholders: `guides.example`, `packages.example`, `cli-notes.example` instead of the reference's real sites. The arrows after them shift by the width difference. Every other pixel matches in every frame.
- **Open animation:** the unfold direction was not captured separately. It uses the same 200 ms transition and was checked only by construction.
