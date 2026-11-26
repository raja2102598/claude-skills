# agent-cursor spec

- **Target**: https://uiarc.dev/components/agent-cursor, the live preview (`[class*="agent-cursor_demo"]`, 669x511 stage), "Edits land" run.
- **Destination**: `src/clones/agent-cursor/` (React 19, plain CSS, lucide icons).
- **Fidelity**: motion-faithful (Arc UI Pro, paid). Own palette (teal agent, violet teammate), Inter + Geist, own copy, fictional names Atlas and Maya.

## Reference clock

The reference runs its cursors from rAF (inline `transform: translateX() translateY()` with decimals) and schedules with timers. A real-clock capture under load stretches the script (first flight at 704 ms, review at 8430 ms) and drops to about 10 fps. The virtual clock at 60 Hz rAF gives the true script, so every number below is from `refv/track.json` (`--clock virtual --fps 25`). t = 0 is the run reset (teammate cursor opacity dips to 0 and back).

## Timeline (ms from reset)

| t | what | detail |
|---|---|---|
| 0-133 | reset | doc swaps back to the original text, teammate cursor fades 0 to 1 in 133 ms |
| 266-750 | agent flies out of its avatar | (33,30) to (178,158), 483 ms, ease-out; opacity 0 to 1 in 150 ms; tag "Claude" |
| 916-1233 | to start of Goals paragraph | (35,249), 316 ms; status "Tightening the goals" at 916 |
| 1350-1683 | selection sweep | to (537,298), 333 ms; tinted selection grows line by line in step with the cursor |
| ~1750-1850 | old text dims | opacity about 0.18 |
| ~1960 | paragraph collapses | 3 lines to 1 line with a caret |
| 2000-2350 | rewrite streams | 8 chunks, about 45 ms apart, tinted; block grows to 2 lines |
| 2050-2333 | agent to (541,274) | 283 ms |
| 2333-2650 | teammate nudges | (331,181) to (319,178), 316 ms |
| 2683-3250 | agent to next paragraph | (35,301), 566 ms; status "Adding a heading" at 2733 |
| 3300-3450 | heading block opens | 0 to 39 px |
| 3450-3650 | "Rollout" typed | about 30 ms per letter |
| 3700-3933 | agent follows the typing | (82,317), 233 ms |
| 4066-4450 | teammate nudges | (335,185), 383 ms |
| 4400-4716 | agent to the typo | (241,342), 316 ms; status "Fixing a typo" at 4400 |
| ~4650 | typo swapped | wavy underline gone, corrected word tinted |
| 5583-5616 | review bar appears, status "3 edits ready for review" | status width 71 to 150 |
| 5600-6066 | agent flies back to its avatar | 466 ms; opacity 1 to 0 over 5766-5900 |
| 5983-6300 | teammate nudges | (349,184), 316 ms |
| 7100-7600 | teammate moves to Accept | (454,422), 500 ms |
| 7766 | accept | bar out, tints removed, status "Accepted 3 edits", Run again |
| 8166-8700 | teammate returns home | (332,181), 533 ms |
| 9816 | next run starts | 2050 ms after accept |

Cursor geometry (stage coordinates): cursor tip at the transform origin, tag 12 px right and 18 px below, 24 px tall pill with 16 px avatar or mark.

Layout: card 669x452, radius 20, header 56 px (28 px avatars, 12 px status), doc padding 24/32, Geist 20 title, Inter 14/24 body, segmented control "Edits land / Connection drops" at y 470. Review bar 375x42, 14 px from card bottom.

Additions: none. The "Connection drops" scenario is a reduced version (flight, return, "Connection lost", Retry).
