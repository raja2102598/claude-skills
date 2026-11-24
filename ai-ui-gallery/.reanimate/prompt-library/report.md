# prompt-library: reanimate report

**Cloned:** Arc UI "Prompt studio" card (https://uiarc.dev/components/blocks/prompt-studio), the Run interaction. Fidelity is motion-faithful: Arc Pro is paid and its license could not be verified. The clone uses its own warm palette, Geist from Google Fonts, lucide icons and fictional copy (Larkspur Home, Nova 2, Mateo Silva). Selection is in `selection.md`.

**Code:** `src/clones/prompt-library/` (`index.tsx`, `prompt-studio.css`, `meta.ts`). Stage is 540x960 on #f6f4f0. The finished card is 877 px tall and fits inside the stage. The demo plays about 0.9 s after mount; `?autoplay=0` skips it and then Run (or Ctrl+Enter) triggers it.

**Contents:**
- Header with a version chip (popover, promote action) and a model chip (popover, effort picker).
- System/User tabs with a sliding highlight and a token odometer.
- Variable chips and variable inputs.
- Three test cases.
- Run/Stop button.
- Output panel that shows a shimmering "Thinking", then "Writing" as words stream, then "Reply" with a check, a copy button and a stats footer.

**Additions (not verified against the reference):**
- The version and model popovers were not captured on the reference.
- Case switching refills the variable inputs.
- Ctrl+Enter runs and stops.
- Autoplay demo on mount.

## Verification

Reference and clone were captured the same way: viewport 1280x1500, 540x960 crop, click on Run, `--clock virtual`, 25 fps, 4.5 s. The virtual clock drives the reference's simulated run exactly. The reference captured on the real clock under machine load ran about 2x slower, so real-clock numbers are not used.

compare.ts (compare-5): mean mismatch 5.53%, 118/119 frames compared, clone offset +1. Palette, font and copy differ by design, so this number is not a pass or fail signal for a motion-faithful clone.

Sheet: `compare-5/sheets/compare-01.webp`.

**compare.ts timing is invalid here.** It reported a motion window of reference frames 7-33 against clone frames 30-49 (start error 0.92 s, duration -0.28 s). Its pixel-activity detector does not register the clone's small height and shimmer changes against the warm background, so it picks different frames on the two sides. Timing was measured from the tracked `outframe` and `body` heights instead, with t from click, the same way on both sides:

| row | reference | clone | error | result |
|---|---|---|---|---|
| 1 Run to Stop label swap | at click | at click | not measured numerically | visual match on sheets |
| 2 output frame grows 52 to 84 px, footer slides in | 90% at 250 ms, plateau 84 px | 90% at 267 ms, plateau 84 px | +17 ms | PASS |
| 3 "Thinking" shimmer, no spinner | shimmering letters, 0-800 ms | shimmering letters, 0-800 ms | not measured numerically | visual match |
| 4 status flips to Writing, body starts | 800 ms | 833 ms | +33 ms | PASS |
| 5 words stream, frame follows to 95% of its growth | 1700 ms | 1800 ms | +100 ms | FAIL (limit 80 ms) |
| 6 last height change (done state settled) | 1833 ms | 1850 ms | +17 ms | PASS |
| 7 final output frame / card height | 285 / 871 px | 293 / 877 px | +8 / +6 px | close |

The easing family (ease-out) matches on row 2. The reference's growth during streaming is continuous and near-linear; the clone follows with a 140 ms ease-out per word step, which is why row 5 reaches 95% 100 ms later (the clone's frame lags its last word).

**Activity curve.** The reference's bursts, all reproduced in the clone:
- Run to Stop swap at about 0.2 s.
- Frame growth and footer slide-in over 0.2-0.6 s.
- "Thinking" shimmer over 0.2-1.0 s.
- Status flip to Writing at about 1.0 s.
- Word streaming and growth over 0.96-1.9 s.
- Done state at about 1.9 s, then nothing.

## Rounds
Five clone captures, two over the speed-mode cap of three (the last granted to apply known fixes). Round 4 left rows 2, 5 and 6 off by 117–133 ms; round 5 changed the output-frame growth to 340 ms ease-out with a 29 px footer line (84 px thinking plateau), set paragraph margins to 7 px (none on the last), and timed streaming from 800 to 1700 ms with the done state at 1780 ms. A first try with the last word at 1833 ms put the last height change at +134 ms: the reference's 1833 ms is its frame settle, not its last word.

## Residual deviations
1. Row 5 is +100 ms (above), because the clone's frame follows each word with a 140 ms ease-out instead of the reference's continuous growth.
2. The final output frame is 293 px against 285 px and the card 877 px against 871 px, from the clone's own reply copy.
3. Idle card height is 636 px against 638 px.
4. The reference's streaming is chunky (line by line). The clone streams word by word with a blur fade over 220 ms.
5. Palette, font and copy differ by design, so the 5.53% mismatch is mostly that.
6. The popovers, tab switch and case switch were not captured on the reference. Their motion (160 ms scale-fade, 220 ms sliding highlight, 420 ms odometer) is the clone's own.
7. The reference's editor is a contenteditable with `{{` insertion. The clone's editor is read-only text with chips.
8. Row 1 (label swap) and row 3 (shimmer) were matched by reading the sheets, not by numbers.
