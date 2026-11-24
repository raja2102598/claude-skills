# reasoning motion spec

Target: https://uiarc.dev/components/reasoning-block, the live preview (demo column: the Live / Finished / Interrupted
switch and the reasoning card). Crop `404,425,618,565` at 1440x1100, which takes in the switch and the card fully open.
Trigger: the preview's own state switch. `--pre-js` clicks "Finished", then `--trigger click` on "Live" starts a live run.
Destination: `ai-ui-gallery/src/clones/reasoning/` (React 19 + TS, Tailwind v4, `motion` available, `lucide-react`).
Rendered alone at `/c/reasoning`.
Fidelity: motion-faithful (Arc UI Pro is paid). Own palette (blue-black ink, indigo mark, teal done), Geist,
lucide icons (Sparkle mark instead of the reference's vendor logo) and placeholder copy ("Nova 2", a stale-cache
investigation).

Reference captures:
- `ref/`: `--clock virtual`, 25 fps, 11.8 s, `--pre-js` Finished → click Live, `--wait-before 7000 --network-wait 300`.
  Exact for timers and JS-driven values (heights, line scroll, label/counter offsets, shimmer gradient) and for CSS
  animations (chunk fades, chevron transition).
- `ref-real/`: the same on the real clock (25 fps, rAF track).
- rAF probes (`page.evaluate` every frame, real clock), plus a hook on `Element.prototype.animate` that logged every
  WAAPI call (keyframes, duration, easing). These are the source for the opacity rows (5, 8, 11b, 12b, 13b), which
  the virtual clock collapses into 1–2 frames (motion runs opacity through WAAPI).

## Structure (static, crop px)
| element | ref → clone | box | notes |
|---|---|---|---|
| state switch | `[class*=segmented-control_root]` → `[role=tablist]` | 195,10 228x40 | r 14, pad 3, buttons h 32 r 10, 13 px/500; active = surface pill |
| card | `[class*=reasoning-block_root]` → `[data-rb-card]` | 19,70 580 wide; h 46 closed / 90 streaming / 483 open | 1 px border, r 14, white |
| header row | `_head` → `.rb-head` | 20,71 578x32 (+12 bottom pad) | grid 20 / 1fr / auto / 16, gap 10, pad 12 16 0 |
| mark | `_mark svg` → `[data-rb-mark]` | 36,83 20x20 (18 px glyph) | static; clone: lucide Sparkle, indigo |
| label | `_labelInner` → `[data-rb-label] > span` | 66,83 h 20 | "Thinking" shimmer + counter (gap 6, min 3.4ch, tabular) |
| Stop | `_actions button` → `[data-rb-stop]` | right edge 556, h 28 | ghost, 12 px/500, 10 px filled square |
| chevron | `_chevron` → `[data-rb-chevron]` | 566,85 16x16 | absent until the stream opens |
| live window | `_liveClip` → `[data-rb-clip=live]` | 20,103 578x44 | inner box 516x40 at x 66 (margin 4 16 0 46); 13/20 muted |
| stream tail | `_liveTail` → `[data-rb-tail]` | bottom-aligned, min-h 40 | 16 px top mask once taller than 40 |
| panel | `_panelClip` → `[data-rb-clip=panel]` | 20,115 578x437.2 | pad 4 16 16; steps gap 16 |
| step | `_step` → `[data-rb-step]` | 82.3 tall (title 14.3 + 2 + 3 lines × 22) | dot 7 px at 7,7; 1 px rail; title 13/500; para 13/22 secondary |
| foot | `_foot` → `[data-rb-foot]` | min-h 28, mt 12 | check (success) + "Done" 12 px + copy button |

## Timeline (t = 0 is the click on Live; a live run loops every 10.867 s)
| # | element | property | from → to | start ms | duration ms | easing | notes / source |
|---|---|---|---|---|---|---|---|
| 0 | state switch pill | x, width | Finished → Live | 0 (next frame) | ~320 (96 % at +280) | spring, critically damped, ω ≈ 17.5 (visualDuration 0.3, bounce 0) | ref frames: left edge 22 / 40 / 66 / 78 / 86 / 92 / 96 % at +40…+280 ms |
| 1 | card | state | Finished (open) → Thinking 0s, Stop, no chevron, h 46 | 0 | instant | – | virtual track: h 483.2 → 46 between −83 and 0 |
| 2 | label "Thinking" | shimmer band | dark band sweeps left → right over muted text | 200 after mount, every 2400 | 1750 sweep | linear | virtual frames: darkening from 0.24 s, centroid x 68 → 116 by 1.92 s; next band 2.64–2.68 s. Probe: sweep 1.8 s, rest 0.55 s |
| 3 | counter | text | 0s → 1s → 2s → 3s | ≈1037 / 2118 / 3197 | – | – | first 25 fps frame showing it (1040 / 2120 / 3200) ∩ rAF window from the track |
| 3b | counter | old: opacity 1→0, y 0→−4; new: opacity 0→1, y 4→0 | per tick | 100 out / 150 in | (.22,1,.36,1) out / (.16,1,.3,1) in | animate() hook (opacity); virtual track (y: 63 % at +22 ms, 96 % at +60 ms) |
| 4 | chevron | presence | hidden → shown | 900 | instant | – | virtual track |
| 5 | live window | height 0 → 44, opacity 0 → 1 | 900 (mount), spring from 917 | ~330 (1 % at +267) | spring k 685 c 52.4 (visualDuration 0.2, bounce 0); opacity 150 ms (.22,1,.36,1) | fit rmse 0.0019 (`easing.ts`: "material emphasized ~293 ms" family) |
| 6 | stream chunks | append + opacity 0→1 | P1 900/950/1000/1033/1067/1100/1150; P2 1967/1983/2033/2083/2117/2167/2200/2250; P3 3050/3067/3100/3150/3200/3233; P4 4050/4083/4117/4167/4200 | 150 each | (.22,1,.36,1) | first chunk of each step arrives with its layer (no own fade); virtual track: 0 / .44 / .72 / .87 at 17 ms steps |
| 7 | stream tail | translateY on wrap to line 3 | +20 → 0 | 1083 / 2217 / 3217 / 4217 (wrap +17) | ~300 | same spring as #5 | virtual track; ref shows the jumped text for one frame before the offset applies (1067, 2200, 3200, 4200) |
| 7b | live slot | mask | none → 16 px top fade | with #7 | instant | – | `[data-overflow]` once the tail is taller than 40 px |
| 8 | stream layer | step swap: old opacity 1→0, new 0→1 | ≈1955 / 3037 / 4037 (rAF ticks 1967 / 3050 / 4050) | 100 out / 150 in | (.22,1,.36,1) / (.16,1,.3,1) | animate() hook; first frame showing it 1960 / 3040 / 4040 |
| 9 | Stop | presence | shown → removed | 4233 | instant | – | virtual track |
| 10 | label | "Thinking Ns" → "Thought for 4s": old opacity 1→0; new opacity 0→1, y 2→0 | 4233 (first frame 4250) | 100 out / 150 in | (.22,1,.36,1) / (.16,1,.3,1) | animate() hook; virtual y 2 → 0.92 → 0.43 → 0.19 at 17 ms steps; colour secondary |
| 11 | live window | height 44 → 0 | 4250 | ~330 | spring #5 | virtual track |
| 11b | live window | opacity 1 → 0 | 4233 | 100 | (.22,1,.36,1) | animate() hook |
| 12 | panel | height 0 → 437.2 (card 46 → 483.2) | 5350, spring from 5366 | ~450 (1 % at +283) | spring #5 | fit rmse 0.0016 |
| 12b | panel | opacity 0 → 1 | 5350 | 150 | (.22,1,.36,1) | animate() hook |
| 12c | chevron | rotate 0 → 180° | 5350 | 200 | (.22,1,.36,1) | CSS transition; virtual track |
| 13 | panel | height 437.2 → 0 | 9950 | ~450 | spring #5 | virtual track |
| 13b | panel | opacity 1 → 0 | 9950 | 100 | (.22,1,.36,1) | animate() hook |
| 13c | chevron | rotate 180 → 0° | 9950 | 200 | (.22,1,.36,1) | |
| 14 | run | loop restart: label → "Thinking 0s" (as #10), Stop back, chevron hidden | 10867 | as #10 | | virtual track |
| 15 | – | static between 4.6 s and 5.35 s, and between 5.8 s and 9.95 s | | | | frame diff: no change in frames 150–254 |

Panel content (all four steps and the foot) arrives with the panel; there is no per-step stagger.

## Style facts the motion depends on
- Inter 13 px / 20 px in the reference, letter-spacing −0.01em; the clone uses Geist at the same size and leading.
  Chunk splits in the clone are placed so the chunk that wraps onto line 3 lands at the reference's times (P1 #5,
  P2 #7, P3 #5, P4 #5), measured in the clone page with the real font.
- The live window shows the last two lines of the newest step; the tail is bottom-aligned and at least 40 px tall, so
  lines 1–2 fill from the top and line 3 scrolls the window.
- Spring for every height and the line scroll: critically damped, ω = 26.18 rad/s (motion `visualDuration: 0.2, bounce: 0`).
- Shimmer: grey base (ink mixed into muted), ink at the band's peak; the band is about as wide as the word.

## Other states (not timed; for completeness)
- Stop (during thinking): label → "Stopped after Ns"; the stream folds; opening shows the steps so far and
  "Stopped before finishing" with a small square.
- Finished tab: "Thought for 7s", open, four steps, "Done" + copy.
- Interrupted tab: alert icon + "Thinking interrupted", Retry (outline) and chevron; opening shows step 1 and the
  start of step 2, with an error footer.
- Header hover: surface tint; clicking the header toggles the panel (or the live window while thinking).

## Additions
- None. Reduced motion: no shimmer, no fades, springs jump to their end values (the timeline still runs).

## Capture notes
- Frame i of a capture is the page state at i/25 s − 0.2 s; rAF (track) samples are at 60 Hz. A timer change shows
  on a frame when it fires at or before that frame's time, so event times were placed inside the intersection of the
  reference's rAF window and its first visible frame. The clone commits each timeline step with `flushSync` inside its
  timer; with React's normal batching the commit raced the frame and landed one frame late (rounds 2–3).
