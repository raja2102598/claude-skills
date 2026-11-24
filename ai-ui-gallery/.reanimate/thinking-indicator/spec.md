# thinking-indicator motion spec

Target: https://uistacks.dev/components/thinking-state, the live preview component `[data-look] > div > div` with 24 px padding. Captured after the docs page settles (9 s), then restarted with the preview's Replay button.
Destination: `ai-ui-gallery/src/clones/thinking-indicator/` (React 19 + TS, Tailwind v4, `motion/react`, `lucide-react`). Rendered alone at `/c/thinking-indicator`.
Fidelity: motion-faithful (UIStacks Pro is paid). Original palette, Geist font, lucide icons, own dot pattern and copy.

Viewport 1440x900 · crop 490x240 (component box 441.6x191 at 24,24) · stage background #f4f4f5.
Reference captures:
- `ref/`: `--clock virtual`, 20 fps, `--trigger click --target "button[aria-label=Replay]" --wait-before 9000 --duration 7500 --pre-roll 200`. Exact main timeline.
- `ref-real/`: the same on the real clock at 25 fps. Used for the micro-animations (see the caveat below).
- `ref-collapse/` (real, 25 fps) and `ref-collapse-v/` (virtual, 50 fps): click on the header once settled.
- rAF probes (`page.evaluate`, every frame) of the header children's opacity, transform, rect and colour. These are the numbers behind rows 4, 5 and 10.

**Virtual-clock caveat.** The reference's icon swap and the panel opacity are WAAPI animations started by motion.
reanimate's virtual clock pauses and seeks WAAPI animations, and these ones then finish within 1 to 2 frames.
JS-driven values (shimmer background-position, panel height) and all timers stay exact. Rows 4, 5 and 10b are
therefore specified and checked from real-clock rAF logs. Rows 1–3, 6–9 and 10a are checked from the virtual
captures.

## Structure (static)
| element | ref → clone | box at rest (crop px) | notes |
|---|---|---|---|
| root | `[data-look] > div > div` → `[data-ti-root]` | 24,24 441.6x191 | everything sits in this column |
| header button | `button[aria-expanded]` → `[data-ti-header]` | 24,24 133.2x20.7 (Thinking) | flex, gap 7.36, text 13.8 px / 20.7 |
| mark (icon box) | `button > span:first-child` → `[data-ti-mark]` | 24,27 14.72² | dot grid while running, check when done |
| label | `span.bg-clip-text` → `[data-ti-label]` | x 46.1 | shimmer gradient text while running; muted when done |
| timer | `span.tabular-nums` → `[data-ti-timer]` | after label +7.36 | 11.96 px, muted, tabular |
| chevron | `svg.lucide-chevron-down.rotate-180` → `[data-ti-chevron]` | after timer +7.36, 14.72² | points up while open (flipped) |
| panel | `div.overflow-hidden` → `[data-ti-panel]` | 31.4,52.1 434x158.2 | ml 7.36, mt 7.36, pl 14.72 (+0.92 border, transparent) |
| paragraph | `p` → `[data-ti-panel] p` | 47.1,52.1 418.5x71.8 | 3 lines, 13.8/23.92, muted |
| steps | `li:nth-child(n)` → `[data-ti-step]` | y 131.5 / 159.1 / 186.7, h 23.92 | gap 3.68; icon box 14.72, gap 9.2; meta 11.96 muted, ml 7.36 |

## Timeline (t = 0 is the Replay click / mount)
| # | element | property | from → to | start ms | duration ms | easing | stagger / repeat | source |
|---|---|---|---|---|---|---|---|---|
| 1 | label | text | "Thinking…" → "Searching…" → "Reading…" → "Thought for 5s" | 0 / 1600 / 3200 / 4800 | instant | – | every 1600 | ref virtual: changes at frames 36, 68, 100 (= +1.60, +3.20, +4.80 s); rAF probe 1683/3285/4901 |
| 1b | label | color | ink (shimmer) → muted | 4800 | instant | – | – | rAF probe: color transparent (bg-clip) → rgb(83,83,88) in one frame |
| 2 | label | shimmer: background-position-x | 100 % → 0 % (band at −0.25W → 1.25W, bg-size 250 %) | 0, restarts each phase | 1600 | linear | per phase, stops at done | rAF probe: −1.06 %/frame, 99 % at 92 ms, 0 % at 1675 |
| 3 | timer | text | "1s" → "2s" … "5s", hidden at done | 0, 1000, 2000, 3000, 4000 / hide 4800 | instant | – | +1000 | ref virtual: timer changes at +1.00, 2.00, 3.00, 4.00 s |
| 4 | mark: dot grid | opacity | 1 → 0 (exit) | 4800 | 300 | ease (cubic-bezier .25,.1,.25,1); fit 317 ms, rmse 0.009 | – | rAF probe 4896→5195 |
| 4b | mark: dot grid | position on exit | ref popped 1.9 px left / 9.8 px up (popLayout + the preview's `zoom: 0.92`) → clone exits in place | 4800 | – | – | – | rAF probe rect; reference artifact, see report |
| 5 | mark: check | scale | 0.4 → 1, peak 1.128 at ~160 ms, trough 0.972 at ~310 ms, settles ~700 ms | 4800 (concurrent with #4) | ~700 | spring stiffness 500, damping 20, mass 1 (fit rmse 0.0035) | – | rAF probe 4896→5657 |
| 5b | mark: check | opacity | 1 (no fade) | – | – | – | – | rAF probe |
| 6 | step 1 icon | circle → check | swap | 3200 | instant | – | – | ref virtual frame 68; rAF probe |
| 7 | steps 2, 3 icons | circle → check | swap | 4800 | instant | – | – | ref virtual frame 100 |
| 8 | panel, paragraph, step text | – | static while running (open) | – | – | – | – | no change in any frame |
| 8b | dot grid | – | static (no frame cycling) while running | – | – | – | – | rAF probe: group opacities constant 0.12,1,0,0,0 |
| 9 | timer, chevron x | layout | jump with the label width (no layout animation) | with #1 | instant | – | – | rAF probe rects |
| 10a | panel (collapse on header click, done state) | height | 158.2 → 0 | click +17 | ~350 (99 % at 283) | spring ~ stiffness 360, damping 34 (fit rmse 0.004); ≈ cubic-bezier(.25,.1,.2,1) 300 ms | – | ref-collapse-v track (virtual, JS-driven) |
| 10b | panel (collapse) | opacity | 1 → 0 | click | ~310 | ease 300 ms | – | ref-collapse track (real clock) |
| 10c | chevron (collapse) | rotation | 180° → 0 | click | instant | – | – | ref-collapse frames |

Trigger: mount (and Replay). Total length 4.8 s of phases, last visible change ≈ 5.5 s (spring settle).

## Style facts the motion depends on
- Sizes are the reference's at its 0.92 preview zoom: text 13.8 px (15 × 0.92), lines 23.92 px, icons 14.72 px, gaps 7.36 / 9.2 / 3.68 px.
- Shimmer band: gradient stops ink 0–35 %, highlight 50 %, ink 65–100 %; background-size 250 % 100 %.
- The dot-grid mark is static: a dim 5×5 grid (ink at 12 %) with 9 lit dots in a gradient. Clone: its own X pattern, amber → rose.
- The check is green in the reference (#12a150). Clone: teal #0d9488. Pending step icon: an outline circle in muted grey.
- Pre-trigger state (pre-roll frames): settled "Thought for 5s", all steps done, panel open.

## Additions
- A small Replay control (lucide rotate-ccw, muted) in the stage's top-right corner. The reference has one in its docs chrome, just outside the crop. It restarts the run and is the clone's capture trigger (`--target "[data-ti-replay]"`). It is static and has no effect on any timed row.
- `prefers-reduced-motion: reduce`: no shimmer, the check appears without the spring, and the panel toggles without a height animation. The timeline itself still runs.
