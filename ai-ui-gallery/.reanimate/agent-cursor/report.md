# agent-cursor: reanimate report

**Cloned:** Arc UI "Agent cursor" (https://uiarc.dev/components/agent-cursor), motion-faithful (Arc UI Pro, paid): own palette, fonts (Inter, Geist), copy, names and lucide icons. A scripted run in a shared document: the agent's cursor flies out of its avatar, selects a passage, streams a rewrite, adds a heading, fixes a typo while a teammate's cursor reads along, then a review bar offers Accept and the agent returns home.

**Code:** `src/clones/agent-cursor/` (`index.tsx`, `meta.ts`, `agent-cursor.css`), stage 669x511.
**Trigger:** the run plays on mount and loops every 9.8 s. The "Edits land" / "Connection drops" control restarts it. "Connection drops" is a reduced scenario (flight, return, "Connection lost", Retry) and is not verified against the reference.

## Method
- A real-clock reference capture is unusable: the reference drives its cursors from rAF and timers, and under load the script stretched (first flight at 704 ms, review bar at 8430 ms) and rendered at about 10 fps. Rounds 1 and 2 (real clock) were discarded.
- Round 3 and the extra verification capture (clone-4) use `--clock virtual --fps 25` on both sides, with the same click and crop. All timing numbers below come from the reference's virtual-clock `track.json`.
- Round 3 fixed the clone's timeline to the virtual script. The cursors are JS-driven (rAF tween), so they follow the virtual clock. clone-4 changed only the easing and was captured once beyond the 3-round cap to verify it.
- The reference crop is 669x480, because the demo is clipped at capture time; the clone is cropped to the same top 480 rows before comparing.

## Final compare (compare-4, reference vs clone-4)
| Item | Result |
|---|---|
| Mean frame mismatch | 7.12% (limit 5%), FAIL by the number. Cause: own font, palette, copy and 1 px layout offsets (motion-faithful). Round 3 was 9.19%. |
| compare.ts timing error | start -0.12 s, end -0.12 s, duration 0 s, FAIL on paper. Artifact: the window start is picked from pre-click motion that differs on the two sides. The per-event tracks below are the real check. |
| Agent flight starts (8 flights) | 266 / 916 / 1350 / 2050 / 2683 / 3700 / 4400 / 5600 ms in the reference vs 266 / 916 / 1366 / 2066 / 2683 / 3716 / 4416 / 5616 ms in the clone (≤ 16 ms). PASS |
| Teammate cursor moves | 2333, 4066, 5983, 7100, 8166 ms in the reference vs 2350, 4083, 6000, 7116, 8166 ms in the clone (≤ 17 ms). PASS |
| Cycle length | reset at 9816 ms in the reference. The clone's timer fires at 9816 ms; the reset frame lands 1-2 frames (40-80 ms) later. PASS |
| Cursor easing (`easing.ts --compare-track`, agent x) | all three measured flights fit `cubic-bezier(0.4,0,0.2,1)` in the reference (~477 / ~507 / ~458 ms). Clone: same family, ~438 / ~560 / ~420 ms, rmse 0.016 / 0.023 / 0.016. Delay 50-83 ms vs 33-67 ms; visible duration 417 / 467 / 400 ms vs 433 / 483 / 417 ms. PASS |
| Status labels, review bar, accept, return home | order and times follow the spec table. PASS |
| Text events (dim 1750, collapse 1960, stream 2000-2350, heading open 3300, typing 3450-3650, typo swap 4650 ms) | read from reference frames at 25 fps (about ±40 ms); match by eye on the compare sheets. PASS |

Sheet: `compare-4/sheets/compare-01.webp` (frames 125 to 330, every 6th).

Every burst in the reference activity curve is covered: reset, flight out, three more agent flights to the heading and typo, selection sweep, dim, collapse, stream, heading open and typing, typo swap, review bar, agent return and fade, three teammate nudges, accept move, bar out, return home, loop.

## Residual deviations
- The reference's opacity and height fades (review bar, doc fades, chunk fades) collapse under the virtual clock because WAAPI is not driven, so only their start frames were checked. Their durations are taken from the real-clock capture (bar about 380 ms, chunk fade 180 ms).
- The selection sweep's shape is read from frames (line by line in step with the cursor), not measured.
- Real-clock behaviour was not compared; the reference is load-dependent there.
- The clone's cursor tags, bar and card differ in colour and font by design, giving the ~7% mismatch floor.
- "Connection drops" is simplified and its timing is not verified against the reference.
- Rounds: 3 plus one verification capture over the cap.

## Candidates
Arc UI Agent cursor was the only candidate; it loaded fine (the live preview renders after about 5 s). No runner-up. Details in `selection.md`.
