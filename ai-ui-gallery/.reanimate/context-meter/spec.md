# context-meter motion spec

Target: Arc UI "Context window" preview, https://uiarc.dev/components/context-window. The crop is the preview's `[data-fit-layer]` (684.8 × 838.3 at a 1440 × 1400 viewport): the card (`section[class*=context-window_root]`, 668.8 × 822.3) plus 8 px on every side. Three triggers are verified: click Send message (`ref/`), click Compact now (`ref-compact/`), hover the Messages legend row (`ref-hover/`).
Destination: `ai-ui-gallery/src/clones/context-meter/` (React 19 + TS, plain clone-local CSS, lucide-react; no motion library needed: CSS transitions/keyframes for the cells, rows and status, and a rAF tween for the numbers).
Fidelity: motion-faithful. The Arc UI component carries the Pro badge (paid; source behind the Pro plan) and states no open-source license. The clone uses its own palette (warm paper, vermilion / marigold / pine / indigo categories), Manrope from Google Fonts, its own copy, fictional models ("Nova 2", "Atlas Mini", "Lumen 4"), lucide icons and no brand marks.

Reference captures (all `--viewport 1440x1400 --selector "[data-fit-layer]" --wait-before 6000 --pre-roll 100 --clock virtual --network-wait 300 --pre-js prejs-ref.js --track "<4 selectors>"`):
- `ref/`: `--trigger click --target '[data-t="send-message"]' --duration 900 --fps 60`
- `ref-compact/`: `--trigger click --target '[data-t="compact-now"]' --duration 1400 --fps 30`
- `ref-hover/`: `--trigger hover --target '[class*=legendRow][data-kind=messages]' --hover-at 0.2,0.5 --duration 500 --fps 60`
- Track selectors: `[data-kind=messages][class*=cell]`, `[data-kind=system][class*=cell]`, `[class*=legendRow][data-kind=system]`, `[class*=legendRow][data-kind=messages]`.
Real-clock probes (`probes/`): `send-real.json`, `compact-real.json`, `hover-real.json`, `attach-real.json` list every Animation/CSSTransition under the card with timing and keyframes; `send-num1/2.json`, `compact-num1.json` time every readout value from the pointerdown.
Clone captures: the same commands with `--url "http://127.0.0.1:5173/c/context-meter?autoplay=0" --selector "[data-stage]"` and the clone's own `[data-t=…]` targets.

## Structure (static, card-relative px)

| element | box | notes |
|---|---|---|
| stage | 685 × 839, bg #f8f8f8 → clone #f4f3ee | card inset 8 px |
| card | 668.8 × 822.3, 1 px border, radius 24, padding 20, row gap 20 | header 53 · body 604.3 · footer 83 |
| header | readout (28/30.8 number, tabular; "of 1M tokens" 13 px muted; meta line 13/18.2 "43% used · 509K free") + model pill 200 × 36 (radius full) at the right | |
| grid | 20 columns × 10 rows of 29.44 px cells, 2 px gap, radius 2; a 1 px dashed threshold line spans the grid after row 8 (margin 2 px 0) → grid 626.8 × 319.5 | 200 cells × 5K = 1M; cells are filled by cumulative rounding of each category's end; last 13 cells = reserved (inset 1 px ring); free cells after the threshold are a lighter tint |
| grid note | 12/16.8, gap 12 below the grid: "Each cell is 5K tokens" ··· "--- Compacts at 80%" | |
| legend | 7 rows × 34 (gap 18 below the grid note), border-bottom 1 px; columns 10 px swatch (radius 3), name 1fr, tokens, percent 44 px; gap 10 | |
| footer | border-top 1 px, padding-top 18, gap 12: actions row 32 (primary 148, secondary 120, ghost 143 pushed right; radius 12) + status row 20 (15 px icon, 13 px text) | |

## Timeline

t = 0 is the click (or hover). Cell colours are sampled at cell centres from the frames (`tools/cells.py`); numbers are from the real-clock probes; opacities from `track.json` + `easing.ts`.

### A. Send message (`ref/`, 60 fps)

| # | element | property | from → to | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| A1 | cells 85–91 (7 new message cells) | background-color | free → messages | 0, +9 ms per cell (0…54) | 200 | cubic-bezier(0.22,1,0.36,1) (quint-out) | probe (CSSTransition) + frames: cell 85 33 % at 17 ms, 95 % at 117 ms; cell 91 5 % at 67 ms |
| A2 | header number | count 427K → 459K | cubic-out, 1-(1-x)^3 | commit +6…14 ms (≈ 1 frame) | 420 | cubic-out (poly) | `send-num1/2` fit (err 0.02); frames: 431 at 33 ms, 442 at 100, 453 at 200, 457 at 283 |
| A3 | "% used" | 43 → 46 % | same tween as A2 | | | | derived |
| A4 | header "free" | 509K → 478K | jumps at commit | 0 | 0 | — | frames 6–8 |
| A5 | legend Messages tokens / % | 291K → 322K, 29 → 32 % | same tween as A2 | | | | frames |
| A6 | legend Free tokens / % | 509K → 478K, 51 → 48 % | same tween as A2 | | | | frames |
| A7 | status line | cross-fade "auto-compacts" → "Sent … · +31K" | out 1→0, in 0→1 | 0 | out 100, in 150 | quint-out | probe (WAAPI Animation); the outgoing line is stacked, not in flow |

### B. Compact now (`ref-compact/`, 30 fps)

| # | element | property | from → to | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| B1 | Send (primary) | opacity | 1 → 0.52 | 0 | 150 | quint-out | probe (CSSTransition) |
| B2 | Attach (secondary), Compact (ghost), model pill | colour / bg (disabled look); pill dims | | 0 | 150 | quint-out | probe + frames |
| B3 | message cells 27–84 ("fold") | opacity keyframes 1 → 0.35 (55 %) → 0.5 (100 %), each segment quint-out | | 0, +6 ms per cell (0…342) | 720, fill both | linear timing, quint-out per keyframe | probe (CSSAnimation `fold`) + frames (cell 27 37 % at 33 ms) |
| B4 | status line | cross-fade → "Summarizing 22 older messages" (shrink icon) | | 0 | 100 / 150 | quint-out | probe |
| B5 | phase end ("summarizing" → "idle") | the fold animation is removed: every message cell snaps back to full opacity | | 700 (frame 24 → 25 at 30 fps: 700–733) | 0 | — | probe (phase 704 ms after the fold commit) + frames 24–25 |
| B6 | cells 27–29 → summary, 35–84 → free (30–34 stay messages) | background-color | | 700, +3 ms per cell index from 27 (0…171) | 200 | quint-out | probe (CSSTransition delays 0,3,6,24,27…171) + frames 26–33 |
| B7 | header number + % + legend Summary / Messages / Free | 427K → 177K | cubic-out | 700 (+0…1 frame) | 420 | cubic-out (poly) | `compact-num1` fit (err 1.5); frames: 398K at 767, 348K at 800, 243K at 900, 193K at 1000, 177K at 1133 |
| B8 | header "free" | 509K → 759K | jumps | 700 | 0 | — | probe |
| B9 | status line | cross-fade → "Compacted 267K … into a 16K summary" (check icon, green) | | 700 | 100 / 150 | quint-out | probe |
| B10 | buttons, pill | back to enabled | | 700 | 150 | quint-out | probe |

### C. Hover a legend row (`ref-hover/`, 60 fps)

| # | element | property | from → to | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| C1 | cells of every other kind | opacity | 1 → 0.28 | 0 | 150 | quint-out (rmse 0.0006) | track + easing.ts, probe |
| C2 | other legend rows | opacity | 1 → 0.45 | 0 | 150 | quint-out | track + easing.ts, probe |
| C3 | hovered row and its cells | — | unchanged | | | | |

## Other reference behaviour (implemented, not in the verified runs)
- Attach file: files grow by 13 cells, messages shift down; cells change colour with a 3 ms/index stagger (0…210 ms), 200 ms quint-out; the readout counts the same cubic-out 420 ms; status "Attached … · +64K".
- Stagger rule that reproduces all probes: 9 ms per cell index when the changed span is ≤ 24 cells (send), 3 ms when it is longer (attach, compaction), 6 ms for the fold.
- Model pill opens a menu of three models (1M / 512K / 400K); a switch re-buckets the grid (each cell = window/200) and compacts on its own when usage is over 80 %.
- Crossing 80 % compacts on its own; "Nothing to compact yet" when there is too little conversation.

## Clone mapping
- A1, B6: inline `transition-delay` per changed cell, set in the same commit as the new `background-color`; CSS transition 200 ms quint-out. Works on the virtual clock (CSS transitions advance with it; checked on the reference).
- B3: CSS keyframes `cm-fold` with per-keyframe quint-out, `animation-delay` per cell; removed at B5.
- A2–A6, B7: one JS tween of the category vector (cubic-out 420 ms) stepped on rAF, committed with `flushSync`; it starts on the frame after the commit like the reference.
- A7, B4, B9: CSS keyframes (out 100 ms, in 150 ms quint-out) on a keyed status line; the leaving line is absolutely stacked.
- C1, C2, B1, B2, B10: CSS transitions 150 ms quint-out.

## Additions (outside the verified runs; they don't change its motion)
- Gallery autoplay: sends, a legend hover, an attach, a compaction, a model switch, then a reset; `?autoplay=0` turns it off and any real input stops it. `reanimate:replay` remounts the card.
