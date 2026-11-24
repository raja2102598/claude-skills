# trace-waterfall: motion spec

- **Target**: beUI Pro "Agent Traces", first variant "Trace waterfall" (https://pro.beui.dev/components/agent-traces), the live preview card `section.max-w-6xl`, 1070x881 at a 1440 px wide viewport. Main sequence = click "Replay"; secondary = the in-view intro sweep and the stat odometers on load.
- **Destination**: `src/clones/trace-waterfall/` (React 19 + TS + Tailwind v4 + motion + lucide), rendered at `/c/trace-waterfall`.
- **Fidelity**: motion-faithful (beUI Pro is a paid catalog). Original palette (ink dark), IBM Plex Sans / Plex Mono, lucide icons, placeholder copy (claims-agent, fictional model "Nova 2").

## Captures
- `ref/`: virtual clock, 25 fps, 1440x1000, crop `section.max-w-6xl`, trigger = click Replay, 200 ms pre-roll (trigger frame 5), 10 s. Tracks: playhead, root fill, row 2 opacity + fill, error fill (row 7), row 9 opacity + fill, row 10 fill.
- `ref-intro/`: virtual clock, 1440x900, pre-js scrolls the card into view, trigger none. Tracks the intro sweep and the odometer digit columns.
- Every motion here is JS-driven (rAF + motion values) or an instant style switch, so the virtual clock is exact. No WAAPI rows.

## Static layout (crop px)
- Card 1070x881, radius 24, 1 px border. Header p-6: run-id line y≈33 (12 px), title y≈63 (20 px), status pill y≈97 (h 24). Stats on the right: 4 columns, gap 32, label 12 px, value 18 px mono.
- Toolbar (mt 20, border-bottom, px 24, py 12): 5 legend chips h 32 left; right: readout (mono 12, min-w 64, right aligned) · pause button 36 px circle (only while playing) · Replay pill h 36.
- Body grid: waterfall column 718 + aside 352 (border-left). Waterfall px 12 → figure 692 wide; label column 240; track = figure − 240 − 2·12 = 428 px (x 570 → 998 in viewport).
- Axis row h 32: "0ms" at 0 % (left-aligned), 2s/4s/6s/8s at t/9.18 (centred). Grid lines 1 px at the same x through the rows.
- 15 rows, h 40, gap 2 (pitch 42; tree h 628). Indent 8 + 14·depth. Chevron cell 20, icon disc 24, mono 12 name. Bar h 12 fully rounded, track = muted, fill = kind colour scaled from the left. Duration label mono 12 at bar end + 8 px, or before the bar when end > ~72 %, or in the label column for the full-width root.
- Error span: stripe-filled bar, label and name in the error colour, alert icon after the name. Selected row: muted pill behind the whole row, 2 px ring on its bar. Detail aside: kind pill, name, Timing bar, Start/End, 2x2 facts, Input, Output, Attributes.
- Playhead: 1 px line over the tree (z above rows), 8 px knob centred on its top end.

## Motion rows (ms from the Replay click = trigger)

| # | element | property | trigger / start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | playhead | x | click, starts +17 ms (next frame) | 6000 | 0 → 428 px (0 → 9.18 s of trace, 1.53x) | linear | measured 0.0713 px/ms constant |
| 2 | playhead | opacity | +17 ms on, off at 6017 | instant | 0 → 1 → 0 | step | hidden when idle |
| 3 | each bar fill | scaleX | when the playhead reaches its start | its trace duration / 1.53 | 0 → 1 | linear (= clamp((p − start)/dur)) | e.g. row 2 33→183 ms, row 7 1291→1917 ms, row 9 2435→4050 ms, row 10 4083→5517 ms |
| 4 | each row content | opacity | when the playhead reaches the span start | instant | 0.4 → 1 | step | all rows reset to 0.4 at the click (root goes to 1 on the first frame) |
| 5 | readout | text | each frame | – | "0ms" → "9.18s" | – | < 1 s as "Nms" (10 ms steps), else "x.xxs"; reference lags the playhead ≈35 ms |
| 6 | pause button | presence | click → end | – | mounts at the click, unmounts at 6017 | step | pushes the readout 44 px left |
| 7 | end state | all | 6017 | – | readout "9.18s / 9.18s", playhead hidden, fills 1, rows 1 | – | then static |

Intro (on load / in view, `ref-intro`):

| # | element | property | start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| I1 | playhead + fills + rows | as rows 1–4 | one frame after the card enters view | 2400 | 0 → 9.18 s | linear | 3.83x; same rules as the replay |
| I2 | stat odometers | digit column translateY | on load | ≈900 (99 % at ≈600) | 0 → digit·1.1em | exponential ease-out, τ ≈ 130 ms (11 % at 17 ms, 53 % at 100, 79 % at 200, 95 % at 383) | all digits start together |

Interactions present in the reference (not frame-compared): pause/resume, row select → aside swaps (opacity + blur), chevrons collapse subtrees, legend chips toggle kinds (rows fade over 200 ms).
