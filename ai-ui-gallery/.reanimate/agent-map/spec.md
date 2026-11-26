# agent-map: motion spec

- **Target**: UIStacks "Agent map" live preview (https://uistacks.dev/components/agent-map), the whole `section[aria-label="Agent map"]` card: lead → agents → tools graph, travelling call dots, path highlight, side details panel, and its 12 s auto-tour (Replay restarts it).
- **Destination**: `ai-ui-gallery/src/clones/agent-map/` (React 19 + TS, Tailwind v4, `motion`, lucide-react). SVG edges and dots drawn by hand, no graph library.
- **Fidelity**: motion-faithful (UIStacks Pro, license not verifiable as open source). Own palette, font (Geist), lucide icons, fictional agent and tool names, own copy.

## Capture

Reference: `ref/` = `capture.ts --url https://uistacks.dev/components/agent-map --viewport 1440x1400 --clip 285,543,870,533
--trigger none --wait-before 4000 --pre-js prejs-ref.js --duration 12600 --fps 20 --clock virtual --track …`.
`prejs-ref.js` seeks the SMIL dots from the virtual clock and clicks Replay, so frame 0 = the remount.
Clone: same viewport, fps, duration and clock, `--selector "[data-stage]"` (870 × 533 stage), pre-js dispatches
`reanimate:replay`. Real-clock rows (motion's WAAPI opacity/transform, which collapse under the virtual clock) come from
the rAF probes in `probes/` (`timeline.txt`, `anims.json`, `draw.txt`); per-frame state from `probes/measure.py`.

## Static facts (unscaled px; the preview renders at zoom 0.92)

- Stage 870 × 533, bg #f4f4f5. Card at (12, 12), 920 wide (846 px on screen), radius 20, white, no shadow.
  Height jumps (no tween) with the panel: 533 (lead, 3 connections), 505 (agent, 2 connections), 553 (needs-you, with button).
- Header: px 20, pt 20; 40 px icon box r12; title 15/20 medium, subtitle 13/20; right "N calls a minute" 13/20 tabular.
- Graph: pt 20, pb 20, px 20; group 880 × 256, 3 columns of 261.3 with gap 48. Column label 12/16 + 8 gap, then the
  node stack centred in the remaining 232 px, nodes 52 tall, gap 8 → node centres y: lead 140.06; agents 80.03 / 140.06 /
  200.09; tools 50.02 / 110.06 / 170.09 / 230.12 (svg units).
- Node: w-fit, radius 12, p 8, pr 14, gap 10; 32 px icon box r10; name 14/20 medium, role 12/16; 14 px "working" dot
  loader at the right of working agents (lead, buyer, research). Selected: bg select 6 %, inset ring select 22 %, text in
  select colour. Rest: inset ring track.
- Edges: cubic `M x1 y1 C mx y1, mx y2, x2 y2` (mx = mid x), x1 = source node right edge, x2 = target column left edge;
  track 1 px #d4d4d8, round caps. Highlight 1.5 px select colour on top (pathLength 1). Dots r 2.5 select colour.
- Topology: lead → 3 agents; buyer → tool 1, research → tool 2, writer → tools 4 and 3. Rates (calls/min): lead→buyer
  22, lead→research 9, lead→writer 4, buyer→tool1 6, research→tool2 3, writer→tools 10 in total.
- Panel (aside): border-top, p 20, 2 columns gap 40. Left: 40 px icon + name 15/20 + "Agent · Role" 13/20; status
  badge h24 (mt 12), description 13/20 (mt 8), [needs-you only: full-width 36 px pill button, mt 12]. Right:
  "Connections" 13/20 then 36 px rows: 24 px icon r8, "Calls X / Called by X", "N/min" tabular.

## Rows

| # | element / property | trigger / start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|
| 1 | tour steps | mount = 0 | — | lead → research (2.40 s) → buyer needs you (4.80 s) → buyer approved (7.60 s) → remount (12.00 s) | — | frames 48/96/152/240 at 20 fps |
| 2 | highlight draw (pathLength) | selection change (+0–17 ms) | ≈ 400 ms (0.5 at 68 ms, 0.9 at 180 ms, 0.99 at 300 ms) | 0 → 1 | overdamped spring ω 25, ζ 1.12 (fit RMSE 0.004) | all edges of the hop together; 2nd hop (agent → tool) +0.18 s; old highlight removed instantly |
| 3 | which edges light | selection | — | lead: lead→agents; agent: lead→agent + agent→tools; tool: lead→agent→tool | — | dots only on lit edges |
| 4 | call dots | graph mount clock (not reset per selection) | 1.8 s if ≥ 20/min, else 2.6 s; repeat | along the path | cubic-bezier(0.4, 0, 0.6, 1) | count 3 (≥20/min, begins 0/0.6/1.2 s), 2 (≥8/min, 0/1.3 s), 1 (>0), 0 (0/min); opacity 0 → 1 (15 %) → 1 (85 %) → 0, linear |
| 5 | node selected bg + ring | selection | 200 ms | rest ↔ select tint | cubic-bezier(0.4, 0, 0.2, 1) | CSS transition, old and new together |
| 6 | panel exit | selection of a different node | 100 ms | opacity 1 → 0 | ease-out | real-clock probe; mode wait |
| 7 | panel enter | +100 ms | opacity 450 ms, y 246 ms | opacity 0 → 1, y 6 → 0 px | spring linear() (no visible overshoot) | description line: opacity 450 ms, y 4 → 0 over 546 ms |
| 8 | header calls/min | 4.80 s, 7.60 s | instant | 54 → 35 → 60 | — | number swaps, no count-up |
| 9 | buyer "needs you" | 4.80 s | — | loader removed (node 24 px narrower, edges re-route instantly) | — | badge "Needs you" + button in panel |
| 10 | warning dot pop | 4.80 s | 647 ms | scale 0 → 1 | spring, overshoot 1.18 at ~150 ms | dot on icon corner, 12 px, 2 px surface ring |
| 11 | warning pulse ring | 4.80 s + 0.4 s | 1.6 s loop | scale 1 → 2.2, opacity 0.6 → 0 in the first half, then rest | ease-out | infinite |
| 12 | approve (buyer working) | 7.60 s | — | loader back, rates 3/0 → 22/6, button removed | — | edges stay drawn (no redraw); dots 1 → 3 on lead→buyer, 0 → 1 on buyer→tool |
| 13 | warning dot exit | 7.60 s | 644 ms | scale 1 → 0 | spring | |
| 14 | status badge swap | 7.60 s | opacity 450 ms, scale 294 ms | old: 1 → 0, 1 → 0.9; new: 0 → 1, 0.9 → 1 | spring linear() | popLayout: both at once |
| 15 | working loader | always | 800 ms loop | 4 dot patterns, 200 ms each | 60 ms cross-fades | in nodes (14 px) and badge (16 px) |
| 16 | remount | 12.00 s | — | state, highlights and dot clock reset to t = 0 | — | same as Replay |

Real-clock panel timing (probes/timeline.txt): exit done at +94 ms, new content mounted at +111 ms with y 6, settled by
+460 ms. Under the virtual clock the reference panel swap collapses to one frame (motion WAAPI); the clone uses CSS
keyframes, which play on both clocks, so the compare shows ~0.5 s of panel fade per step that the reference capture lacks.
