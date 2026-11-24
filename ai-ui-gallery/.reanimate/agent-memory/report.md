# agent-memory: reanimate report

**Status: FAILS verification — needs a re-check on a quieter machine.** The capture machine ran at a load average of about 45 with out-of-memory kills, so both captures stalled and timing is only good to about ±0.3 s.

**Cloned:** the Arc UI "Agent memory" block card (https://uiarc.dev/components/blocks/agent-memory), 633x721 crop: a usage meter, two switches, filter tabs with a sliding pill, search with marks, edit, forget with a 5 s undo, add, and a "Memory updated" chip that files a new memory in.
**Fidelity:** motion-faithful (paid Pro block; own palette, Manrope, copy and lucide icons).
**Code:** `src/clones/agent-memory/` (`index.tsx`, `model.ts`, `agent-memory.css`, `meta.ts`). `/c/agent-memory` autoplays (file a memory, forget one, filter, search, loop); `?autoplay=0` turns the demo off.
**Trigger:** click the "Memory updated" chip (`.am-pill`).

## Verification (3 rounds, real clock on both sides)

A virtual-clock capture of the reference crashed Chromium ("Target crashed", out of memory), so both sides were captured on the real clock.

| run | frames | timing (start / end / peak) | mean mismatch | result |
|---|---|---|---|---|
| pill click, compare-3 (offset 10) | 70 @ 30 fps | -0.133 / 0 / -0.333 s | 6.20% | FAIL (timing limit 0.08 s, mismatch limit 5%) |
| pill click, compare-2 (auto offset 15) | 65 @ 30 fps | -0.3 / -0.167 / -0.5 s | 6.20% | FAIL |

Sheet: `compare-3/sheets/compare-01.webp`. The clone lags the reference in the sheets because of capture stalls, so these numbers do not show a real timing error either way.

| row | reference | clone | result |
|---|---|---|---|
| meter 62 to 66 | first change by 0.33 s, then slow | 700 ms quint-out | approximate |
| new row | opens about 0.07 s after click, highlight held, fades after about 1.5 s | height 320 ms, highlight held 1.5 s then 1.1 s fade | approximate |
| chip labels | Memory updated, then Added, then Saved to Preferences at about 0.4 s | same three labels, 450 ms | approximate |
| list bursts at 1.33–1.42 s and 1.7 s | unexplained | smooth scroll at +1.0 s (guess) | unverified |
| forget, filter, search, edit, add | not measured | built from stills | not verified |

## Residual deviations
1. Timing error of 0.13–0.5 s comes from capture stalls at load average about 45 (both reference and clone), not a measured error in the clone.
2. Mismatch is 6.2% because palette, font and copy differ by design.
3. The reference's WAAPI motion cannot be captured under the virtual clock, and the live site crashed when tried.
4. The 1.33 s and 1.7 s bursts and the forget, filter, search, edit and add timings need a quieter machine to measure.

## Candidates
Winner: Arc UI Agent memory (more states and interactions, richer motion, the clearest AI-memory pattern). Runner-up: Arc UI Agent routines (polished routine cards, fewer states and less motion). Both loaded; their short virtual-clock captures hung, so each has a screenshot and a real-clock inspection only. Details in `selection.md`.
