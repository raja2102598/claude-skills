# prompt-library: reanimate report

**Cloned:** Arc UI "Prompt studio" card (https://uiarc.dev/components/blocks/prompt-studio), the Run interaction. Fidelity is motion-faithful: Arc Pro is paid and its license could not be verified. The clone uses its own warm palette, Geist from Google Fonts, lucide icons and fictional copy (Larkspur Home, Nova 2, Mateo Silva). Selection is in `selection.md`.

**Code:** `src/clones/prompt-library/` (`index.tsx`, `prompt-studio.css`, `meta.ts`). Stage is 540x960 on #f6f4f0. The finished card is 877 px tall and fits inside the stage. The demo plays about 0.9 s after mount; `?autoplay=0` skips it and then Run (or Ctrl+Enter) triggers it.

**Contents:**
- Header with a version chip (popover, promote action) and a model chip (popover, effort picker).
- System/User tabs with a sliding highlight and a token odometer.
- Variable chips and variable inputs.
- Three test cases.
- Run/Stop button.
- Output panel that shows a shimmering "Thinking", then "Writing" as the reply streams line by line, then "Reply" with a check, a copy button and a stats footer.

**Additions (not verified against the reference):**
- The version and model popovers were not captured on the reference.
- Case switching refills the variable inputs.
- Ctrl+Enter runs and stops.
- Autoplay demo on mount.

## Verification

Reference and clone were captured the same way: viewport 1280x1500, 540x960 crop, click on Run, `--clock virtual`, 25 fps, 4.5 s. The virtual clock drives the reference's simulated run exactly. The reference captured on the real clock under machine load ran about 2x slower, so real-clock numbers are not used.

compare.ts (compare-8): mean mismatch 5.53%, 118/119 frames compared, clone offset +1. Palette, font and copy differ by design, so this number is not a pass or fail signal for a motion-faithful clone.

Sheet: `compare-8/sheets/compare-01.webp`.

**compare.ts timing is invalid here.** It reported a motion window of reference frames 7-33 against clone frames 28-36 (start error 0.84 s, duration -0.72 s). Its pixel-activity detector does not register the clone's small height and shimmer changes against the warm background, so it picks different frames on the two sides. Timing was measured from the tracked `outframe` and `body` heights instead, with t from click, the same way on both sides:

| row | reference | clone | error | result |
|---|---|---|---|---|
| 1 Run to Stop label swap | at click | at click | not measured numerically | visual match on sheets |
| 2 output frame grows 52 to 84 px, footer slides in | 90% at 250 ms, plateau 84 px | 90% at 267 ms, plateau 84 px | +17 ms | PASS |
| 3 "Thinking" shimmer, no spinner | shimmering letters, 0-800 ms | shimmering letters, 0-800 ms | not measured numerically | visual match |
| 4 status flips to Writing, body starts | 800 ms | 817 ms | +17 ms | PASS |
| 5a lines stream, frame follows: 50% of growth | 1267 ms | 1267 ms | 0 ms | PASS |
| 5b 95% of growth | 1700 ms | 1717 ms | +17 ms | PASS |
| 5c 100% (99%) of growth | 1817 ms | 1800 ms | -17 ms | PASS |
| 6 last height change >= 0.5 px (done state settled) | 1800 ms | 1817 ms | +17 ms | PASS |
| 7 final output frame / card height | 285 / 871 px | 293 / 877 px | +8 / +6 px | close |

The easing family (ease-out) matches on rows 2 and 5. Row 5 growth is measured as a fraction of each side's own 84 px to final height, since the clone's final frame is 8 px taller.

**Streaming (row 5).** The reference streams 7 line chunks at 800, 917, 1000, 1167, 1200, 1350 and 1500 ms (body height 56.6, 78.1, 99.5, 120.9, 152.1, 173.6, 204.8 px). The first chunk is the greeting plus the first body line. The output frame follows the body target continuously: a retargeting height transition of about 340 ms ease-out fits the reference curve within 6 px. The clone now does the same. A hidden measuring copy of the reply counts words per rendered line, the lines become chunks (greeting and first line merged), and the chunks are scheduled at the reference times. Each chunk fades in over 260 ms with no blur, and the frame height uses a 340 ms ease-out transition. The frame height is set in a layout effect in the same commit as the chunk, so it does not lag a frame behind the ResizeObserver.

**Activity curve.** The reference's bursts, all reproduced in the clone:
- Run to Stop swap at about 0.2 s.
- Frame growth and footer slide-in over 0.2-0.6 s.
- "Thinking" shimmer over 0.2-1.0 s.
- Status flip to Writing at about 0.8-1.0 s.
- Line streaming and growth over 0.8-1.8 s.
- Done state at about 1.8 s, then nothing.

## Rounds
Five earlier clone captures, two over the speed-mode cap of three. Round 4 left rows 2, 5 and 6 off by 117-133 ms. Round 5 changed the output-frame growth to 340 ms ease-out with a 29 px footer line (84 px thinking plateau), set paragraph margins to 7 px (none on the last), and timed streaming from 800 to 1700 ms with the done state at 1780 ms. It left only row 5 failing at +100 ms.

Row 5 fix round (clone-6 to clone-8, same settings): word-by-word streaming replaced by 7 line chunks at the reference times, frame transition changed from 140 ms to 340 ms ease-out while writing, and the frame height committed in a layout effect. clone-6 had rows 5 at 50% +66 ms and 95% +50 ms. clone-7 had 8 chunks, because the greeting got its own chunk. clone-8 merges the greeting with the first body line and passes.

## Residual deviations
1. The final output frame is 293 px against 285 px and the card 877 px against 871 px, from the clone's own reply copy.
2. Idle card height is 636 px against 638 px.
3. The clone is consistently 17 ms late on rows 2, 4, 5b and 6. That is under one frame at 25 fps (40 ms) and comes from timer and render order.
4. The reference's newest line fades in with a partial gradient across the line. The clone fades the whole word span for 260 ms with the same line chunking, so the intra-line look is close but not identical.
5. Palette, font and copy differ by design, so the 5.53% mismatch is mostly that.
6. The popovers, tab switch and case switch were not captured on the reference. Their motion (160 ms scale-fade, 220 ms sliding highlight, 420 ms odometer) is the clone's own.
7. The reference's editor is a contenteditable with `{{` insertion. The clone's editor is read-only text with chips.
8. Row 1 (label swap) and row 3 (shimmer) were matched by reading the sheets, not by numbers.
9. compare.ts timing is invalid for this clone (see above), so timing numbers come from the tracked frame and body heights.
