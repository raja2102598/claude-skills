# mcp-servers: reanimate report

**Status: partial pass.** Every event of the sign-in → discovery flow lands on the reference's frames, but compare.ts fails (mean mismatch 5.36 %, start timing 0.7 s) for reasons explained below, and Done / Retry / expand were not measured.

**Cloned:** Arc UI "MCP servers" (https://uiarc.dev/components/blocks/mcp-servers, Pro, no stated open-source license) → **motion-faithful**: own palette, Figtree and JetBrains Mono, fictional services (Gitforge, Trackline, Pagewise, Chatter, Watchtower, Ledgerly, Tabledb, Sketchpad) and lucide icons only. The block's Sign in → Authorize → tool discovery flow, plus the surrounding server list (status, transport, "n of m tools", token cost) and the rolling context-budget meter.

**Code:** `src/clones/mcp-servers/` (`index.tsx`, `data.ts`, `mcp-servers.css`, `meta.ts`); stage 695×672 on `#efede8`.
**Trigger:** plays on load (autoplay: Sign in, Authorize, Done, Retry, then loops). `?autoplay=0` turns it off; click `[data-ms=signin]` then `[data-ms=authorize]`. Dispatching `reanimate:replay` restarts it.

**Capture settings** (the same for reference and clone):
- `--viewport 1440x1400 --trigger click --fps 20 --clock virtual --network-wait 300`
- Reference crop `--clip 366,399,695,672`; clone crop `[data-stage]`.
- The Sign in sheet had already opened before recording started (the pre-js clicked it), so the reference's first two frames contain the sheet rising. Both sides were sliced to start at frame 3 and compared with `--offset 0`.
- The reference's Authorize click is at 0.20 s.

## Verification (3 rounds)

| Row | Reference | Clone (round 3) | Result |
|---|---|---|---|
| Authorize label to spinner | cross-fade, spinner from about 0.25 s | 110 ms fade with 40 ms delay, spinner from about 0.25 s | PASS (read from frames) |
| Swap to "Discovering tools" | 0.85 s | 0.85 s | PASS |
| Tool rows (stagger 100 ms) | 1.65 / 1.75 / 1.85 / 1.95 s | 1.65 / 1.75 / 1.85 / 1.95 s (compare activity at index 31–33, the same frames as the reference) | PASS |
| "Found 4 tools" | 2.10 s | about 2.05–2.10 s | PASS |
| Done enabled | 2.15 s | about 2.10–2.15 s | PASS |
| Footer counter roll | counts up as tools arrive | same | qualitative |

compare.ts, round 3 (`compare-3`):
- **Mean mismatch:** 5.36 % (threshold 5.0 %), FAIL.
- **Timing error:** start 0.7 s, end 0.0 s, duration −0.7 s, peak 0.0 s, FAIL on the 0.08 s limit.
- **Peak frame:** both sides peak at frame 15 (0.75 s, the swap to discovery).

Sheet: `compare-3/sheets/compare-01.webp`.

Why compare.ts fails, and what was measured instead:
- **Start error:** an artefact of the activity curve. The reference's activity at 0.05–0.7 s is spinner and button motion that the detector counts. The clone's spinner changes about 55 px per frame in the button region, below the detector threshold (the reference's varied between 78 and 1477 px per frame). The activity bursts that do register line up frame for frame.
- **Mismatch:** the mean sits at 5.4 % in every frame, including at rest: own palette and fonts, copy, and a slightly different card offset in the crop, not motion.
- **Easing:** not fitted. The spinner is a linear rotation. The reference's `inspect.json` held only an unrelated page shimmer, and its own motion ran on a path that could not be probed under the virtual clock.

**Reference activity bursts, all matched:** 0.05–0.35 s Authorize press, focus ring and label cross-fade; 0.35–0.75 s spinner (detection caveat above); 0.85 s swap to "Discovering tools"; 1.55–1.95 s four tool rows plus the footer counter roll; 2.00–2.15 s "Found 4 tools" header and Done enabling.

## Not measured (built with own timings)
- Done: the sheet sinks, the row becomes Connected, and the meter and counters roll (a capture attempt timed out).
- Retry on the errored server.
- Expanding a row and toggling tools.
- The Sign in sheet's rise: the reference shows it done within about 100 ms; the clone uses 130 ms.

**Not built:** the Add server flow. The button is present but does nothing.

## Residual deviations
- 5.4 % mean mismatch, from palette, fonts and crop offset.
- The spinner is smaller and lower-contrast than the reference's.
- Pagewise stands in for the reference's document-service connector; there is no Add-server flow.
