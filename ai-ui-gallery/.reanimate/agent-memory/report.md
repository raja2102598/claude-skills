# agent-memory: reanimate report

**Status: PASS on the pill, forget, search, edit and add events (within +-80 ms per event on the real clock); two window-end deviations remain, the filter list tail (-100 ms) and the search list tail.**

**Cloned:** the Arc UI "Agent memory" block card (https://uiarc.dev/components/blocks/agent-memory), 633x721 stage: a usage meter, two switches, filter tabs with a sliding pill, search with marks, edit, forget with a 5 s undo, add, and a "Memory updated" chip that files a new memory in.
**Fidelity:** motion-faithful (paid Pro block; own palette, Manrope, copy and lucide icons).
**Code:** `src/clones/agent-memory/` (`index.tsx`, `model.ts`, `agent-memory.css`, `meta.ts`). `/c/agent-memory` autoplays; `?autoplay=0` turns the demo off.
**Trigger:** click the "Memory updated" chip (`.am-pill`).

## Verification (virtual clock on both sides unless noted; 30 fps; viewport 1440x1400; `--wait-before 6000`)

The reference card is 721 px tall at the start and 677 px after the chip collapses, so the clone is cropped to 633x677 for comparison (633x721 for add). compare.ts auto-align picks a wrong offset when the clone's motion is shorter, so `--offset 0` was used. The virtual clock does not drive WAAPI and collapses the reference's fades, so per-event times come from real-clock rAF probes (`probe-forget.ts`, `probe-flow.ts`). Virtual captures of flows with typing or key events use `--trigger none` plus a `--pre-js` timer; `--trigger click` with `--pre-js` fires the timer during wait-before.

| run | mean mismatch | timing (start / end / peak) | result |
|---|---|---|---|
| pill click, compare-10 (clone-8) | 3.74% | +33 / -67 / -33 ms | pass |
| filter to Preferences, compare-9 (clone-filter5) | 3.02% | 0 / -100 / 0 ms | end FAIL by 20 ms (list tail, see below) |
| forget, compare-forget-2 | 3.98% | -33 / +100 / +67 ms (before the shrink-easing fix) | per-event pass on the real clock |
| search, compare-search-1 | 3.53% | runs match within 70 ms | pass |
| edit, compare-edit-2 | 4.64% | -33 / -67 / 0 ms | pass |
| add, compare-add-4 | 3.75% | open state only | pass; typed events real clock only |

Sheets: `compare-8/sheets/compare-01.webp` (pill click, clone-7; the compare-10 recapture has numbers only).

### Per-event times (ms after the click or key, reference vs clone)
- Pill: label swap 30 to 130 vs 30 to 130; meter 62 to 66 over 30 to about 400 vs 30 ms delay + 400 ms cubic-out; row highlight appears at 0, held to 400 ms, gone by about 1300 vs same keyframes (1600 ms, hold to 25%); chip leaves at 1770 and the list glides 44 px over about 400 ms vs 1770 / 500 ms (the burst at 1.33 to 1.7 s on the real clock was this event, delayed by stalls).
- Filter: group 187 to 0 px, 25 to about 480 ms, matched with a sampled `linear()`; headings hide with a single filter.
- Forget: meter ticks 3, 39, 71, 87, 121, 171 (clone retimed to a 110 ms tween); strip at 39 vs 46; row 54 to 46 start/t50/t90/t99 104/171/304/420 vs 105/171/305/422; countdown 5s to 1s each 1000 ms; collapse after 5 s start 171 vs 171, t99 553 vs 571.
- Search: open 883 to 1050 vs 866 to 1046; filters fade 883 to 984; input fades in 934 to 1050 (clone 70 ms delay); first list change +70 vs +93 after the key; close list 4058 to 4150 vs 4049 to 4212, width 4069 to 4217 vs 4079 to 4245.
- Edit: open t99 452 vs 444, t90 285 vs 327; Esc close starts 156 vs 177; Enter commit starts 548 vs 575.
- Add: "Sorting into a group" at 16 vs 17; Add button fades out 134 vs 130; row opens 690 vs about 690; "Added to About you" at 685 vs 688, shown 2300 ms.

### Easing per row
| row | reference | clone | result |
|---|---|---|---|
| meter | cubic-out, about 0.4 s | cubic-out 400 ms, 30 ms delay | pass |
| highlight | CSS animation 1600 ms: hold 25%, then `cubic-bezier(0.22,1,0.36,1)` | same keyframes | pass (exact) |
| group, row and chip collapse | 25 ms start, fit `cubic-bezier(0.22,0.36,0.24,0.99)` 384 ms | sampled `linear()` of the measured curve, 500 ms | pass |
| forget row shrink 54 to 46 | cubic-out-like, 150 ms delay, about 380 ms | `cubic-bezier(0.215,0.61,0.355,1)` 380 ms, 150 ms delay | pass |
| search open | width 32 to 607 in about 170 ms, expo-like | same family, 180 ms | pass |
| edit open and close | 54 to 89 px, about 450 ms, ease-out | `cubic-bezier(0.215,0.61,0.355,1)` 420 / 460 ms | pass |
| add row | 0 to 54 px in about 360 ms, ease-out | collapse curve | pass |

## Residual deviations
1. Mean mismatch 3.0 to 4.6% is from palette, font and copy differing by design (limit 5%).
2. The window "end" error is the filter list tail: in the reference the list height shrinks as its own height animation that starts about 140 ms after the group (380 to 172 px, ending about 550 ms); the clone's list follows its content and finishes about 100 ms earlier (-100 ms, 20 ms over the limit). The search list collapse has the same shape (ref 520 ms, clone 350 ms). Fixing both needs a separate height animation on the list container.
3. The chip cross-fade and the Add button fade come from the virtual clock's collapsed WAAPI frames and the real-clock text sampler, not from measured opacity curves.
4. The reference ignores synthetic Escape/Enter in virtual runs, so the edit closes and the typed add events are real-clock only. The virtual add capture covers only the open state.
5. The clone's add always files into "About you" (the reference sorts by text, not measured beyond the one example) and the edit row 89 px height was matched, but the hint wording and layout are our own.
6. Forget meter ticks and the pill-hover fix were not re-captured after the last tweak; the forget row shrink was re-probed (matches within 2 ms).

## Candidates
Winner: Arc UI Agent memory (more states and interactions, richer motion, the clearest AI-memory pattern). Runner-up: Arc UI Agent routines (polished routine cards, fewer states and less motion). Both loaded; their short virtual-clock captures hung earlier, so each has a screenshot and a real-clock inspection only. Details in `selection.md`.
