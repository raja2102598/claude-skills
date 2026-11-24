# agent-plan: motion spec

- **Target**: beUI Pro "Agent Plan" → "Plan runner" preview at https://pro.beui.dev/components/agent-plan
  (`#runner section[aria-labelledby]`, the card only). One full demo run: draft → auto-run → steps 1-4 done
  with streamed tool-call lines → step 5 fails → "needs attention" rest state. Restarted with the preview's
  "Refresh preview" button so t=0 is the remount.
- **Destination**: `ai-ui-gallery/src/clones/agent-plan/` (React 19 + TS, Tailwind v4, `motion/react`, lucide-react).
  Renders alone at `/c/agent-plan`, plays on mount.
- **Fidelity**: motion-faithful (beUI Pro is a paid catalog; source locked). Own copy, palette (dark, indigo
  accent), fonts (Google: Inter + JetBrains Mono), lucide icons. Match trigger, sequence, stagger, timing ±80 ms,
  easing family and layout proportions.

## Capture

Both sides: `--viewport 1440x1200 --trigger none --wait-before 3000 --pre-roll 0 --duration 12000 --fps 20 --clock virtual`,
crop 496x549 (card 448 wide + 24 px pad). Reference: `--clip 592,481,496,549`, `--pre-js` clicks
`#runner button[aria-label="Refresh preview"]` (remounts the demo, t=0 = remount). Clone: `--clip` of the stage
(same size), `--pre-js "dispatchEvent(new Event('reanimate:replay'))"` (remounts the clone).
No `--selector`, so frames start right at the pre-js (no 300 ms scroll settle).

## Static facts the motion depends on (reference, CSS px)

- Card 448 wide, 1 px border, radius 16, top-aligned in the crop at (24,24); grows downward. Heights: draft 407,
  running with 1 / 2 / 3 output lines 429 / 447 / 465, failed 501.
- Header 78: row (y 15, h 20: bot avatar 20, name 12 px medium + model mono 12 px, status pill h 20 right),
  goal h2 14 px medium at y 43, 6 progress segments at y 75 (h 4, gap 4, each ~66 px, rounded).
- List: pt 16, rows 36 high (20 title row + 16 gap), last row 22. Row = 20 px marker column (marker + 1 px
  connector, my 4) + 12 gap + content (title 14 px flex-1, tool badge h 20, time w 36 mono right-aligned).
  Draft rows also hold a 24 px invisible remove button on the right (badge/time sit 28 px further left).
- Output block under the running title: mt 6, lines 16 high with 2 gap (+22 for the first line, +18 each next),
  mono 12 px, `›` marker, newest line in foreground with a 6x12 pulsing cursor, older lines muted.
- Input row 48 (h 36 pill input + 36 round submit), footer 49 (border-top, left status text 12 px, right button h 32).
- Failure adds a red error line (+18) and a Retry pill button (mt 8, h 28) = +54.

## Motion spec (t = ms after mount; frame-time from the 20 fps virtual-clock capture)

| # | element | property | start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | whole card | draft hold | 0 | 700 | static | — | no entrance animation; frames 0-13 identical |
| 2 | status pill | label Draft → Running, colours grey → accent | 700 | 300 | | css ease (0.4,0,0.2,1) | width snaps 59 → 76 |
| 3 | pill dot | ping ring while running | 700 | 1000 loop | scale 1 → 2, opacity .6 → 0 | (0,0,0.2,1) | stops when not running |
| 4 | step rows | remove slot drops, badge + time shift right 28 px | 700 | 0 | | instant | |
| 5 | markers | draft numbers → bordered circles; running = spinner | 700 | 0 | | instant | spinner 1 turn / 1 s linear, arc ~90° + centre dot |
| 6 | titles | pending muted, running/done foreground | 700, each handoff | 300 | | css ease | |
| 7 | input / footer | "Add a step" → "Steer the next step"; footer text → "Step 1 of 6 · 0.0s · 1 call" | 700 | 0 | | instant | |
| 8 | footer button | Run plan → Stop: old gone at once, new pops | 700 | 300 | scale .5 → 1, opacity 0 → 1 | easeOutExpo (0.16,1,0.3,1) | frame 15 Stop at ~0.8 scale |
| 9 | output block | height 0 → auto on step start (card h +22) | 700, 2533, 4033, 6633, 8333 | 300 | | easeOutExpo (0.16,1,0.3,1), fitted 284-300 ms, rmse .003 | from easing.ts on card h |
| 10 | output line | x -4 → 0, opacity 0 → 1 | each line | 300 | | easeOutExpo, fitted 300 ms rmse .002 | |
| 11 | line schedule | lines appear on a 100 ms tick grid at ceil100(k·dur/n) into the step | s1 0/600/1200, s2 0/800, s3 0/900/1800, s4 0/900, s5 0/1200 | | | | step durations 1800/1500/2600/1700/2300 ms |
| 12 | line insert | step row layout animation (translate + scaleY from old box), rows below slide +18 | each line ≥ 2 | ~300 | | easeOutExpo | card/footer jump +18 at once; 1-2 frames of vertical squish |
| 13 | step handoff | done marker pops (scale .4 → 1, opacity), old output hidden at once and height → 0, next output enters | 2533, 4033, 6633, 8333 (tick + ~33) | 300 | | easeOutExpo | card h 465 → 429 etc. animated |
| 14 | connector | fill scaleY 0 → 1 (origin top) on done | each handoff | 300 | | easeOutExpo | 34 % after 17 ms |
| 15 | segment fill | scaleX = step elapsed / duration, follows the 100 ms tick (lag ~100 ms) | step start | step duration | 0 → 1 | linear | colour accent while running |
| 16 | segment colour | accent → foreground on done, → red on fail | handoff / fail | 300 | | css ease | |
| 17 | timers | step time and footer total count in 0.1 s per tick | 700 | per 100 ms | | step | done rows freeze at 1.8/1.5/2.6/1.7 s, total 9.9 s |
| 18 | failure | at 10600: pill → "Needs attention" red, marker → red X (pop), title red (300), error line enters, Retry button, footer "Step 5 failed · 9.9s · 12 calls", Stop → edit icon (pop), segment → red | 10600 | 300 | | easeOutExpo / css ease | card +54 instant, row 6 slides (layout) |
| 19 | rest | static from ~11.1 s | | | | | |
