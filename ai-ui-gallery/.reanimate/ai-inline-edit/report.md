# ai-inline-edit: reanimate report

**Status: FAILS verification — needs a re-check on a quieter machine, with a virtual-clock pass.**

**Cloned:** Arc UI "AI inline edit" (https://uiarc.dev/components/blocks/ai-inline-edit), motion-faithful (paid Pro block, no open-source license; own palette, Inter, lucide icons, fictional copy). A selected paragraph, a Ctrl K command menu that morphs into a status pill, a word-level diff that streams in, and a review bar with Accept all / Reject all.

**Code:** `src/clones/ai-inline-edit/` (`index.tsx`, `doc.ts`, `editor.css`, `meta.ts`). No `motion`: only CSS transitions and one rAF clock.
- Autoplays on mount: selected paragraph, menu, Shorten, streamed diff, review bar, then an auto-accept and restart.
- By hand: arrows, Enter, Esc, Ctrl K, the Accept all / Reject all buttons, and Enter or Backspace in review.
- `window.__replay(lead)` restarts the sequence (used from `--pre-js` to line up captures).
- All five menu commands run the same canned diff; only the status label differs ("Shortening", "Clarifying", and so on).

## Verification

Same capture settings on both sides: 1440x900, selector crop of the editor, **real clock**, 10 fps, `--trigger none` with a pre-js. Final compare: `compare-5`. No virtual-clock pass was run (the reference's WAAPI motion would collapse under it; the brief's alternative of virtual clock plus real-clock probes for WAAPI rows was not used).

| Measure | Result |
|---|---|
| Mean mismatch | 13.24 % (threshold 5 %) — FAIL; driven by the fictional copy, so text pixels differ in every frame |
| Timing error | start −0.1 s, end +0.5 s, duration +0.6 s (limit 0.08 s) — FAIL; load of about 24 made real-clock start offsets drift by up to about 0.4 s per run, and `track.json` samples were sparse (gaps near 1 s) |
| Capture settings warning | reference 9.0 s vs clone 9.5 s duration |

Sheet: `compare-5/sheets/compare-01.webp`.

**Spec rows from the reference `track.json`:**

| Row | Reference | Clone | Result |
|---|---|---|---|
| Menu (322x286) | opacity 0 to 1 over about 0.4 s with a 4 px rise | same, 420 ms CSS keyframe | built to spec, not independently measured |
| Pick to pill (213x44) | menu shrinks from about 0.28 s, 95 % done in about 350 ms, tail to 0.86 s | 520 ms `cubic-bezier(.16,1,.3,1)` | in `clone-2`, the first shrink sample was +59 ms from the reference's (inside ±80 ms); later runs drifted with load |
| Review bar | morph to 320x44 at 6.61 s | `clone-2`: 6.60 s | pass in `clone-2` only; `clone-4` showed about +140 ms after the click with sparse samples; `clone-5` was not tracked |
| Diff stream | first token about 2.7 s, uneven bursts to about 6.5 s | non-linear token schedule (30 % at 3.75 s, 75 % at 5.4 s after the click) | approximate; the burst anchors are estimates |

## Residual deviations
- Reference activity bursts at about 2.6, 2.8, 3.0, 3.4, 4.1, 5.1, 5.4 and 5.7 s are the token reveals, approximated with a three-anchor schedule.
- The dim-text fade (about 0.5 s, 0.4 to 0.9 s) was not checked by measurement.
- Per-change Tab navigation exists in the reference but is not built; the clone only has accept all and reject all.
- The reference keeps the review bar until the user acts. The clone auto-accepts at review plus 4 s so the autoplay loops.
- In the last sheet the clone page still looks a little longer than the reference; the final copy trim was captured but its sheet was not re-read.

## Candidates
Winner: Arc UI AI inline edit. Runner-up: Arc UI AI translate. Kobra Document Agent's preview sits behind "Open preview" (a chat plus document panel, not captured further). Both Arc pages crashed on first load under load and loaded on retry. Details in `selection.md`.
