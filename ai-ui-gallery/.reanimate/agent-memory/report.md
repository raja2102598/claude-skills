# agent-memory: reanimate report

**Status: PASS on the pill-click run (mismatch and timing within limits); filter run passes mismatch with a tail-timing deviation; forget, search, edit and add are still unmeasured.**

**Cloned:** the Arc UI "Agent memory" block card (https://uiarc.dev/components/blocks/agent-memory): a usage meter, two switches, filter tabs with a sliding pill, search with marks, edit, forget with a 5 s undo, add, and a "Memory updated" chip that files a new memory in.
**Fidelity:** motion-faithful (paid Pro block; own palette, Manrope, copy and lucide icons).
**Code:** `src/clones/agent-memory/` (`index.tsx`, `model.ts`, `agent-memory.css`, `meta.ts`). `/c/agent-memory` autoplays; `?autoplay=0` turns the demo off.
**Trigger:** click the "Memory updated" chip (`.am-pill`).

## Verification (2 fix rounds, virtual clock on both sides, 30 fps, viewport 1440x1400, `--wait-before 6000`, crop 633x677, `--offset 0`)

The reference ran fine on the virtual clock once the load dropped. The virtual clock does not drive WAAPI, so the chip cross-fade is collapsed into 1 to 2 frames. Row and chip geometry were cross-checked with a real-clock rAF probe (`refr-pill`).

| run | frames | timing start / end / peak | mean mismatch | result |
|---|---|---|---|---|
| pill click, compare-8 (clone-7) | 91 @ 30 fps | +0.033 / -0.067 / -0.033 s | 3.75% (2.85% at pixel-threshold 0.3) | mismatch PASS; timing start and peak within 0.08 s, end -0.067 s, window duration -0.1 s (tail metric, see below) |
| filter tab "Preferences", compare-7 (clone-filter2) | 49 @ 30 fps | 0 / -0.167 / 0 s | 3.02% | mismatch PASS; end -0.167 s (FAIL on the window end only) |

Earlier runs (clone-6, compare-5): 3.75%, start +0.033 s, end -0.033 s, duration -0.067 s, PASS. The first virtual-clock run (compare-4) had the clone missing the chip collapse.

The window metric's "end" is a tail artifact. The reference's activity runs until about 2.43 s and the clone's until about 2.37 s, because the clone's expo-like tail drops under the activity threshold slightly earlier.

### Per-event times (seconds after the click, reference | clone)

| event | reference | clone |
|---|---|---|
| chip label "Memory updated" to "Saved to Preferences" | 0.03 to 0.13 (collapsed by the virtual clock) | 0.03 to 0.13 |
| new row opens, rows below shift | 0.03 to about 0.5 | 0.03 to about 0.55 |
| meter 62 to 66 | 0.03 to about 0.4, 41% at 0.1 s, 83% at 0.2 s, 95% at 0.28 s | 30 ms delay + 400 ms |
| row highlight | appears at 0, held to 0.4 s, gone by about 1.3 s | same (1600 ms keyframe) |
| chip leaves, list glides up 44 px | chip fades at 1.77 s; collapse 1.77 to about 2.3 s | chip row collapses 1.77 to about 2.3 s |
| card height 721 to 677 | with the collapse | with the collapse |
| filter to Preferences: "About you" group | rows fade within about 60 ms; group height 187 to 0 px over about 0.45 s (58% left at 0.1 s, 17% at 0.2 s, 4% at 0.3 s, 1% at 0.4 s) | 520 ms collapse |

### Easing per row

| row | reference | clone | result |
|---|---|---|---|
| meter | cubic-out-like, about 0.4 s | cubic-out 400 ms, 30 ms delay | pass |
| highlight | CSS animation 1600 ms: hold to 25%, then `cubic-bezier(0.22,1,0.36,1)` | same keyframes | pass (exact, from `inspect.json`) |
| chip collapse and list glide | 44 px, fast start, about 0.5 s | `cubic-bezier(0.22,1,0.36,1)`, 520 ms | pass |
| group collapse (filter) | ease-out, about 0.45 s to 99% | same curve, 520 ms | approximate (ref is a little more linear mid-way; end metric -0.167 s) |
| new row and chip label | opens at once, shifting rows about 0.5 s; label swaps in 0.1 s | grid 520 ms; 100 ms cross-fade | approximate |

## Residual deviations
1. Mean mismatch 2.9 to 3.8% is from palette, font and copy differing by design (limit 5%).
2. The window "end" error of -0.07 s (pill) and -0.167 s (filter) is the tail of the expo-like easing falling under the activity threshold; the filter reference is closer to cubic-out than the clone's expo-like curve.
3. The chip cross-fade could not be measured: the virtual clock collapses the reference's WAAPI fade, and the real-clock probe only tracked the first matched label. The 100 ms is read from the virtual frames.
4. The clone's stage is 721 px and the card shrinks to 677 px like the reference, but the list switches to a fixed 11 px top margin. The group spacing was tuned by eye from one frame, so it is good to about 1 to 2 px.
5. Forget with its 5 s undo, search, edit and add are still built from stills and unmeasured (they have no timings in this report).
6. The last CSS edit (no hover fill on the "Saved to Preferences" chip) was not recaptured; the clone-7 sheet still shows the grey hover fill, which the reference does not have.

## Candidates
Winner: Arc UI Agent memory (more states and interactions, richer motion, the clearest AI-memory pattern). Runner-up: Arc UI Agent routines (polished routine cards, fewer states and less motion). Both loaded; their short virtual-clock captures hung earlier, so each has a screenshot and a real-clock inspection only. Details in `selection.md`.

Sheet: `compare-8/sheets/compare-01.webp`.
