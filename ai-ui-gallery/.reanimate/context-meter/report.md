# context-meter: reanimate report

**Cloned:** the Arc UI "Context window" preview (https://uiarc.dev/components/context-window). It is a 200-cell context grid with an 80 % line, a reply reserve, a seven-row breakdown, a model pill, Send / Attach / Compact actions and a status line.

**Fidelity:** motion-faithful. The reference is a paid Pro component, so the clone uses its own palette, Manrope, its own copy, fictional models and lucide icons. Layout proportions match the reference to within 0.5 px: card 668.8 × 822.3, grid 626.8 × 319.5 with 29.44 px cells, legend rows at 468.7, footer at 726.7.

**Code:** `src/clones/context-meter/`
- `index.tsx`: component, number tween, status cross-fade, autoplay
- `model.ts`: categories, cumulative-rounding layout, stagger rule, formatting
- `context-meter.css`: Manrope import, transitions, fold keyframes
- `meta.ts`

**Triggers:**
- Click "Send message" (`[data-t=send]`).
- Click "Compact now" (`[data-t=compact]`).
- Hover a legend row (`.cm-legendRow`).
- In the gallery, an autoplay runs on mount: send, send, hover, attach, compact, send, model switch and back, reset, then it loops.
- `?autoplay=0` turns the demo off; any pointer, key or wheel input stops it.
- `reanimate:replay` remounts the card.

**Captures:** the reference and the clone were captured the same way:
- viewport 1440×1400, crop 685×839, `--clock virtual`, pre-roll 100 ms
- Send: 60 fps, 900 ms. Compact: 30 fps, 1400 ms. Hover: 60 fps, 500 ms.
- Real-clock `getAnimations()` probes cover the WAAPI and CSS rows on both sides (kept out of git).
- Rounds used: 3 (speed mode).

## Last compare round (round 3)

| run | frames | timing error (start / end / peak) | mean mismatch | result |
|---|---|---|---|---|
| Send (`compare-3`) | 61/61 @ 60 fps, offset 0 | 0 / +17 / 0 ms | 12.01 % | timing PASS; pixels differ by design |
| Compact (`compare-3-compact`) | 45/46 @ 30 fps, auto offset 1 | −33 / −33 / −33 ms | 6.51 % | timing PASS (see note) |
| Hover (`compare-3-hover`) | 37/37 @ 60 fps, offset 0 | 0 / 0 / 0 ms | 10.91 % | timing PASS; pixels differ by design |

**Note on the compact run:** compare.ts picked a one-frame offset because, in the reference, Compact's hover tint (730 px) shows in the trigger frame. Measured per element there is no offset: the fold opacity track has max |Δ| 0, the snap is at 733 ms on both sides, and the collapse cells reach 95 % at 867 / 933 / 1000 ms on both.

**Mismatch:** 6.5–12 % is palette, font and copy (motion-faithful). It is flat across each run.

Sheets: `compare-3/sheets/compare-01.webp` (send), `compare-3-compact/sheets/compare-01.webp`, `compare-3-hover/sheets/compare-01.webp`.

## Spec rows

| # | row | reference | clone (round 3) | easing match | result |
|---|---|---|---|---|---|
| A1 | send: new cells colour in, 9 ms stagger, 200 ms | cell 85: 5 / 50 / 95 % at 17 / 33 / 117 ms; cell 91 at 67 / 83 / 167 | cell 85 at 17 / 33 / 100; cell 91 at 67 / 83 / 150 | quint-out (0.22,1,0.36,1); probe: 7 transitions, delays 0…54 step 9, on both | PASS (≤17 ms) |
| A2–A6 | readouts count, cubic-out 420 ms, from the next frame | 427, 427, 431, 434, 437, 440, 442, 445, 447K (frames 6–14) | identical values in frames 6–14 | cubic-out polynomial (fit err 0.02) | PASS |
| A4 | header "free" jumps | 478K at the trigger frame | 478K at the trigger frame | — | PASS |
| A7 | status cross-fade, out 100 / in 150 quint-out | real-clock probe: WAAPI 100 / 150, quint-out | real-clock probe: CSS animations 100 / 150, quint-out | same | PASS (see residual 1) |
| B1–B2 | buttons and pill dim, 150 ms quint-out | primary opacity → 0.52; secondary and ghost greyed | primary → 0.52, pill → 0.5, secondary and ghost greyed; all 150 ms quint-out | same | PASS |
| B3 | fold: opacity 1 → .35 (55 %) → .5, 720 ms, 6 ms stagger | track: 0.775 / 0.5 / 0.35 / 0.5 at 33 / 100 / 333 / 667 ms; 58 cells, delays 0…342 | track identical (max \|Δ\| 0); 58 cells, delays 0…342 | per-keyframe quint-out | PASS |
| B5 | phase end: cells snap back to full opacity | 733 ms (30 fps frame) | 733 ms | — | PASS |
| B6 | collapse: summary and free, 3 ms stagger, 200 ms | cells 40 / 60 / 84 reach 95 % at 867 / 933 / 1000 ms; 53 transitions, delays 0, 3, 6, 24…171 | 867 / 933 / 1000 ms; 53 transitions, delays 0, 3, 6, 24…171 | quint-out | PASS |
| B7 | count-down 427 → 177K, cubic-out 420 ms | 427, 398, 348, 306, 271, 243, 221, 205K (frames 25–32) | 427, 398, 348, 306, 271, 243, 222, 205K | cubic-out (fit err 1.5) | PASS (±1K rounding) |
| B8–B10 | free jumps; status → done; buttons re-enable | at the collapse commit | at the collapse commit | quint-out | PASS |
| C1 | hover: other cells → 0.28, 150 ms | easeOutQuint 150 ms, rmse 0.0006 | identical track, max \|Δ\| 0 | quint-out | PASS |
| C2 | hover: other rows → 0.45, 150 ms | easeOutQuint 150 ms | identical track, max \|Δ\| 0 | quint-out | PASS |

## Residual deviations

1. **Status cross-fade on the virtual clock (A7, B4, B9).** The reference runs it through WAAPI, which collapses under `--clock virtual`: the line jumps fully in by +33 ms. The clone uses CSS keyframes, so it plays its 150 ms fade-in there (status-line ink reaches 99 % at about +100 ms). The real-clock probes match: 100 ms out and 150 ms in, quint-out, on both sides. This is the known WAAPI capture trap, not a clone error.
2. **Send cell 95 % point is ~17 ms earlier (A1).** The reference interpolates its oklch colours in oklab; the clone's hex colours interpolate in sRGB, so the RGB-distance metric peaks a frame sooner. Durations, delays and easing are identical in the probe.
3. **Readout values can differ by 1K (B7).** Frame 31 shows 222K against 221K, and the header reads 399K against 398K in one sheet frame. This is rounding: the clone's compaction keeps 25K and makes a 16K summary, and the reference's exact token amounts are not exposed.
4. **Pixel mismatch of 6.5–12 %.** This is by design (motion-faithful): own palette, Manrope instead of Inter / Geist, own copy, a narrower model pill ("Nova 2 1M") and 18 px icons instead of 24 px.
5. **The compare tool's −33 ms on compact is an alignment artefact.** The reference's pre-click hover tint on Compact (730 px) pulls the auto-alignment. Every per-element measurement shows 0 ms.

## Additions (not in the verified runs)
- Gallery autoplay with a reset step.
- Model menu (Nova 2 1M / Atlas Mini 512K / Lumen 4 400K). Switching rescales the grid with the 3 ms stagger.
- Compaction runs on its own once usage passes 80 %.
- Guards for "nothing to compact" and "no room left".
- Hovering a cell highlights its category.
- Reduced-motion support.
