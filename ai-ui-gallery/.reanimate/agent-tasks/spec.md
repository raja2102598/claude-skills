# agent-tasks: motion spec

- **Target**: beUI Pro "Background Agents" → "Agent list" preview at https://pro.beui.dev/components/background-agents
  (`#list section[aria-labelledby]`, the card only). One auto-played demo run after a remount: a queued agent
  starts, a running agent fails, two running agents roll through their steps (progress rings fill, timers tick)
  and finish with a diff; rest state from ~10.8 s. Restarted with the preview's "Refresh preview" button so t=0 is
  the remount.
- **Destination**: `ai-ui-gallery/src/clones/agent-tasks/` (React 19 + TS, Tailwind v4, `motion/react`,
  lucide-react). Renders alone at `/c/agent-tasks`, plays on mount; `reanimate:replay` remounts it.
- **Fidelity**: motion-faithful (beUI Pro is a paid catalog, source locked). Own copy (fictional repos/tasks), own
  palette (warm graphite, violet running ring, mint done, coral failed, amber needs-you), Google fonts
  Figtree + IBM Plex Mono, lucide icons. Match trigger, sequence, timing ±80 ms, easing family and layout
  proportions.

## Capture

Both sides: `--viewport 1440x1400 --trigger none --wait-before 3500 --pre-roll 0 --duration 11500 --fps 20
--clock virtual`, crop 496x590 (card 448 wide + 24 px pad on every side).
Reference: `--clip 592,485,496,590`, `--pre-js` clicks `#list button[aria-label="Refresh preview"]`.
Clone: `--clip` of the `[data-stage]` rect, `--pre-js "dispatchEvent(new Event('reanimate:replay'))"`.
Track: the section, the subtitle spans (`ul > li:nth-child(n) > button > span:nth-child(2) > span:nth-child(2) >
span:last-child|first-child`) and the marker spans (`… > button > span:first-child > span:last-child|first-child`)
of rows 1, 3 and 5. The clone keeps the same DOM roles so the same selectors work on both.

WAAPI rows (opacity and blur of subtitles and markers) collapse under the virtual clock in the reference; they were
read from `getAnimations()` in a real-clock rAF probe (`probe-real-1.json`), which gives their exact duration and
easing. The y and scale tweens run on motion's JS frameloop and are measured on the virtual clock (`ref/track.json`).

## Static facts (reference, CSS px)

- Card 448 x 542, top-left at (24,20) of the reference crop (the page shifts up 4 px after load; the clone's
  frames are compared with the clip moved 4 px down, `clone-3/frames-y409`), 1 px border, radius 24, padding 6. Height never changes during the
  auto-run (rows keep a fixed 16 px subtitle line).
- Header 56: 28 px round icon chip, title 14/20 medium, summary 12/16 muted ("2 running · 1 needs you · 1 done").
- List: radius 16, 1 px border, dividers; rows 57 (py 10, 20 px marker, gap 12, title 14/20 + subtitle 12/16 in a
  16 px clipped slot, right label mono 12, 14 px chevron).
- Row 2 (needs you) is expanded: panel pl 44, pt 2, pb 12, gap 12: 4 step lines 16 high (gap 6) with 14 px dots
  (done = filled + check, current = amber, pending = outline), then two pill buttons h 32 (primary + outline).
- Composer: pt 6, input h 40 pill with a 32 px round submit at right 4.
- Markers (20 px): running = progress ring (r 8, stroke 2, starts at 12 o'clock), needs = 10 px amber dot with a
  ping (CSS 1 s, scale 1→2, opacity .6→0 at 75 %, cubic-bezier(0,0,.2,1), loop), failed = red disc + X,
  done = green disc + check, queued = dashed outline circle.

## Motion spec (t = ms after remount; virtual-clock track at 60 Hz)

| # | element | property | start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | whole card | no entrance | 0 | — | static | — | rows render settled on mount |
| 2 | row 5 | queued → running (marker swap, subtitle roll, "Queued" → timer 0:00, header count) | 100 | 300 | | rows 6-8 | header 2 → 3 running |
| 3 | row 3 | running → failed (ring → red X, line → error, timer → "Failed") | 1700 | 300 | | rows 6-8 | header "2 running · 1 needs you · 1 failed · 1 done" |
| 4 | row 1 | step line rolls | 2000, 4617, 7217 | 300 | | row 6 | 2.6 s per step |
| 5 | row 5 | step line rolls | 2700, 5317, 7917 | 300 | | row 6 | 2.6 s per step |
| 6 | subtitle swap | old: y 0 → -16, opacity 1 → 0, blur 0 → 2; new: y 16 → 0, opacity 0 → 1, blur 2 → 0 | event (+17 y) | 300 | | easeOutExpo cubic-bezier(.16,1,.3,1) (WAAPI opacity/blur, JS y with the same curve) | both in one 16 px clipped slot; old removed after 300 |
| 7 | marker exit | opacity 1 → 0, scale 1 → .5 | event | 120 | | ease-in cubic-bezier(.4,0,1,1) | |
| 8 | marker enter | opacity 0 → 1, blur 3 → 0, scale .5 → 1 | event (+17) | 300 | | spring sampled as `linear()` (0.37 at 3.4 %, .55 at 20.7 %, .94 at 48 %, 1 at 93 %) | old and new overlap in the same cell |
| 9 | ring fill | stroke-dashoffset per frame, linear in time | 0 | until done | row 1: p = .2377 + .07691/s; row 3: p = .3256 + .09662/s; row 5: p = (t − 209) / 10406 | linear | ≈ 0.99 when the row finishes |
| 10 | timers | m:ss, +1 every 1000 ms from each agent's start | 0 | step | row 1 0:48 → 0:57, row 3 2:12 → 2:13, row 5 0:00 (t 100) → 0:09 | step | ticks at 1000k (rows 1, 3), 100 + 1000k (row 5) |
| 11 | row 1 done | ring → green check, line → `repo · branch` (mono), timer → "+14 −6" | 9817 | 300 | | rows 6-8 | header "1 running · … · 2 done" |
| 12 | row 5 done | same | 10517 | 300 | | rows 6-8 | header "1 needs you · 1 failed · 3 done" |
| 13 | rest | static except the amber ping | ~10.82 s | | | | |

## Interactions (in the reference, not part of the timed compare)

- Rows are an accordion (one open): chevron rotates 180°, the panel enters with height/opacity/blur.
- Needs you: two answers resume the agent. Failed: steps with the failed one marked, Retry. Done: steps, "Open PR",
  "View diff", file count. A task typed in the composer enters at the top of the list and runs.

## Additions

None beyond the reference's own feature set; the interactions above are rebuilt with our copy (answering resumes
the agent, Retry re-runs it, a submitted task joins the queue and starts when fewer than 3 agents run).
