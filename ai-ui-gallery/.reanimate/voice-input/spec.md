- **Target**: UIStacks "Voice prompt" (https://uistacks.dev/components/voice-prompt), the live preview's talk bar in the default "Studio" look: the autoplaying demo loop (idle → listening with live transcript, waveform, timer, cancel and send → assistant speaking → reset with the reply in the hint), crop `--clip 500,560,440,216` at 1440x1100.
- **Destination**: `src/clones/voice-input/` (React 19 + TS, lucide-react icons, clone-local CSS). Motion is driven by one rAF clock and analytic springs, so it runs identically on reanimate's virtual clock and the real clock; no `motion` WAAPI.
- **Fidelity**: motion-faithful (UIStacks Pro, paid, "Get Pro · $159", install needs a license key; no open-source licence). Own palette (warm paper + ember beam), own font (Figtree), own copy ("Nova" as the assistant), lucide icons.

## Sources of the numbers

- `ref-v/` virtual-clock capture, 20 fps, 13 s, track of pill, bubble wrapper, Send, Cancel, label, bar 6. JS-driven values (widths, heights, bars) are exact here; motion's WAAPI opacity/transform collapse to 1 frame (the known trap).
- `ref-vt/` virtual track of the 15 word spans and the 13 bars (word insert times).
- `ref-anims*.json`: every `document.getAnimations()` created in the preview during one real-clock cycle, with duration, delay, easing (motion springs baked into `linear()`), keyframes.
- `ref-rt/` real-clock track for the WAAPI rows (Send/bubble/word enter, dense from 6.37 s).
- Spring fit on the baked `linear()` opacity curve: stiffness 420, damping 34, mass 1 (ζ 0.83), rmse 0.0001. The 450 ms scale and 245 ms translate curves fit the same spring (rmse < 0.007). Motion uses it for every enter/exit, and the JS widths/heights follow it too.

Rendered sizes below are at the preview's `zoom: 0.92` (native = rendered / 0.92). The clone renders its 440 px native column at zoom 0.92 too, placed where the reference sits in the crop (left 17.6, top 10.6).

## Static layout (native px)

| Element | Facts |
|---|---|
| column | width 440, min-height 216, flex column, justify-end, gap 16 → [bubble+pill group] / hint |
| group | flex column, gap 8 |
| bubble wrapper | margin -16 top/left/right/bottom, padding 16, overflow hidden (height animates 0 → content+32) |
| bubble | radius 20, surface, padding 12/16, text 15/24 regular, words inline-block |
| pill | height 56, radius full, padding 8 (right 10), gap 12, surface, no shadow |
| beam ring | absolute inset 0, padding 1, mask content-box exclude → 1 px ring; inside a square 120 % wide conic streak (transparent 0–64 %, then rising to the accent near 100 %), rotating |
| mic button | 40 round; idle muted bg + ink icon; active dark bg + white icon + soft drop shadow; icon 20, stroke 1.5 |
| labels | title 14/20 medium in a 20 px high overflow-hidden box (swap slides inside); sub 12/16 muted tabular |
| waveform | 13 bars, 3 px wide, gap 3, box 24 high; idle: 3 px dots in a light track colour; active: 24 px bars scaled in Y |
| buttons | 32 round, gap 6, overflow hidden, icon 16; Cancel muted bg + X; Send dark + arrow-up |
| hint | min-height 40, 13/20 muted, centred |

## Timeline (one loop = 12 000 ms; L = listen start; reference first listen at capture t ≈ 0.017 s)

| # | Element | Trigger | Start | Duration | From → to | Easing | Notes |
|---|---|---|---|---|---|---|---|
| 1 | loop | mount | idle 0.6 s, then L | 12 000 period | idle → listening → speaking → idle | – | ref: L at 0.017 s, next L at 12.017 s |
| 2 | mic button bg/colour | L, reset | L / L+7483 | 150 | muted → dark (and back) | cubic-bezier(0.4,0,0.2,1) | CSS transition-colors |
| 3 | mic icon swap | L, speaking, reset | same | 450 | out: opacity 1→0, scale 1→0.5; in: opacity 0→1, scale 0.5→1 | spring k420 c34 | icons overlap; speaking icon = audio-lines |
| 4 | title label swap | L, speaking, reset | same | y 245, opacity 450 | out: y 0→-10, op 1→0; in: y 10→0, op 0→1 | spring k420 c34 | box clips (overflow hidden) |
| 5 | sub label | L, reset | same | 0 | "Voice mode" ↔ timer | instant | |
| 6 | timer | listening, speaking | L | 1 s steps | 0:00, 0:01 … | step | ref 0:05 at speaking, 0:07 by reset |
| 7 | Cancel button enter | L | L | width spring ~300 to settle, op/scale 450 | width 0→32, op 0→1, scale 0.6→1 | spring k420 c34 | ref-v width 0,1,5,9,13,17,20,23,25,26,28 px (rendered) at 16.7 ms |
| 8 | beam layer | L / speaking | L / L+5083 | 300 | opacity 0→1 / 1→0 | cubic-bezier(0.25,0.1,0.35,1) | |
| 9 | beam rotation | L+70 | – | 3000 per turn | rotate 0→360°, infinite | linear | |
| 10 | bars | L | bar i at L + 80·(i mod 5) | 1100+130·(i mod 4) per loop | scaleY 0.18 → p → 0.45p → 0.85p → 0.18 at 0/.25/.5/.75/1 | easeInOut cubic-bezier(.42,0,.58,1) per segment | p = .35 .55 .45 .8 .6 1 .7 .95 .5 .75 .4 .6 .3; before start scaleY 0.15; keep looping through speaking; dots again at reset |
| 11 | words | listening | word k at L + 250·k (k=1..15) | 320 | op 0→1, blur 3→0 px, y 3→0 | ease-out | 15 words, 9 on line 1, line 2 starts at word 10 (L+2500) |
| 12 | bubble enter | word 1 | L+250 | height spring ~300, op 450, y 245 | height 0→80 (one line), op 0→1, y 6→0 | spring k420 c34 | ref-v h (rendered) 0,4,12,22,32,41,50,57,62,66,69,71,72,73,74 |
| 13 | bubble line 2 | word 10 | L+2500 | 0 | height +24 | instant | ref-v: 74 → 96 rendered in one frame |
| 14 | Send enter | word 1 | L+250 | as Cancel | width 0→32, op 0→1, scale 0.6→1 | spring | Cancel slides left as Send grows (gap 6 stays) |
| 15 | speaking | auto | L+5083 | – | label "…speaking", icon audio-lines, Send exits (width→0, op→0, scale→0.6), beam fades | spring | bars keep looping |
| 16 | reset | auto | L+7483 | height spring ~300, op 450 | bubble out (op 1→0, height→0), Cancel out, label/icon swap to idle, dots | spring | hint text swaps instantly to the assistant's reply |
| 17 | hint revert | auto | L+11233 | 0 | reply → default hint | instant | ref frame 225 (11.25 s) |

## Additions

None to the motion. Interactions beyond the autoplay loop (the reference preview also responds to taps): tap the mic in idle to start, the X to cancel, the arrow (or the mic while listening) to send, the mic while the assistant speaks to interrupt. A tap stops the autoplay loop. The level is a deterministic simulation (the per-bar loops above); no microphone is opened.
