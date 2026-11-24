# orb-voice motion spec

Target: Arc UI "Voice orb" (https://uiarc.dev/components/voice-orb), live preview `[class*=voice-orb_demo]` (520x440), one full voice turn after "Start voice chat" (winner, see selection.md)
Viewport: 1440x900   Fps: 20   Duration: 11000 ms   Trigger: click `[class*=voice-orb_start]`   Clock: virtual, seed 1, network-wait 200 ms
Destination: ai-ui-gallery/src/clones/orb-voice/ (React 19 + TS, hand-written WebGL2, motion for the pill width, CSS keyframes for short enters/exits, clone-local CSS)
Fidelity: **motion-faithful** (Arc UI Pro, paid, no open-source license). Additions: an opt-in real-microphone path (below).
Reference capture: .reanimate/orb-voice/ref
  `capture.ts --url https://uiarc.dev/components/voice-orb --out ref --viewport 1440x900 --selector "[class*=voice-orb_demo]" --trigger click --target "[class*=voice-orb_start]" --duration 11000 --fps 20 --wait-before 6000 --clock virtual --network-wait 200 --gl --assets --track "canvas, [class*=voice-orb_statusText], [class*=voice-orb_line] > span:last-child, [class*=voice-orb_controls], [class*=voice-orb_clock]"`
Real-clock probe (shapes of the WAAPI enters/exits): .reanimate/orb-voice/ref-real (same crop and trigger, 6.5 s, no virtual clock).
Clone capture: same command with `--url http://127.0.0.1:<port>/c/orb-voice --selector "[data-stage]" --target ".ov-start"` and the equivalent track selectors.

No microphone exists in headless capture. The reference falls back to a simulated level (its getUserMedia call fails), and the
clone drives the same law deterministically, so both captures run the same synthetic voice.

## Structure (static, in the 520x440 crop)
| element | ref → clone | box | notes |
|---|---|---|---|
| card | `div.voice-orb_demo` → `.ov-card` | 0,0,520,440, radius 24, padding 24/20/20, column gap 14 | white on #f8f8f8 → warm white on #f3f2ee |
| status | `p.status > span` → `.ov-status > .ov-status-text` | centred, y 25, h 18, 13 px | crossfades per state |
| orb | `button > canvas` (WebGL1, 200x200, ratio 1) → `.ov-orb > canvas` (WebGL2) | 160,57,200,200 | resting orb radius = 0.6 of the half canvas (60 px); glow fades out by r 1.62 (97 px) |
| transcript | `div.transcript > p.line > span.word` → `.ov-transcript > .ov-line > .ov-word` | 21,271,478,42, lines bottom-aligned, 15/21 px, centred | one line per turn |
| controls | `div.controls` pill → `.ov-controls` | centred, y 327, h 44, w 159 idle / 142 live | idle: Start button; live: mute, timer, end |
| note | `p.note` → `.ov-note` | y 385, h 34, 12 px | idle only |

## Timeline (t = 0 at the click; virtual clock)
| # | element | property | from → to / law | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | status | label swap | old exits: opacity 1→0, y 0→4 px, blur 0→4; new enters: opacity 0→1, y 4→0, blur 4→0 | state change (+17) | exit 100, enter 200 | exit ease-out, enter cubic-bezier(.16,1,.3,1) | script tokens + ref-real track (exit 0.35 @38 ms, 0 @102; enter 0.80 @38, 0.98 @102) |
| 2 | controls | width | 159 → 142 px | 17 | ≈ 400 (settles) | spring, visualDuration 0.3, bounce 0 | ref-real track: 157/153/150/146/144/142 at +38/70/102/143/193/389 ms |
| 3 | controls | panel swap | idle panel exits: opacity→0, scale→0.92, blur→4 (100 ms); live panel enters: opacity/blur 150 ms, scale 0.92→1 snappy spring (0.2) | 17 | 100 / 150 / ≈300 | ease-out / spring | ref-real track: enter opacity .46/.72/.91/1, scale .937/.963/.979/.994 |
| 4 | transcript | line swap | hint exits: opacity→0, y→−10 px, blur→4 (140 ms, quint-out); new line enters opacity 0→1, y 10→0 | 17 | 140 / ≈500 | cubic-bezier(.22,1,.36,1) / spring 0.3 | ref-real track |
| 5 | words (heard) | appear | first at 900 ms, then 150 + 22 ms per character of the previous word, plus a measured 6.5 ms render latency per step | 900, 1117, 1333, 1583, 1783, 2050, 2367, 2617, 2900, 3100, 3433 | 340 each | opacity 0→1, y 3→0, blur 4→0, cubic-bezier(.16,1,.3,1) | ref track.json (word x/w change), script law |
| 6 | line | rise on first word | translateY +21 px → 0 (the line grows from 0 to 21 px, bottom-anchored) | 900 | ≈500 | spring 0.3 | ref-real track (line y 21 → 0) |
| 7 | orb | shape params | every parameter springs to the state's target: x'' = 40(target − x) − 12.6 x' (critically damped, settles ≈ 0.6 s) | each state change | ≈600 | spring | gl-track: uWobble, uShimmer, uScale, uRing, uHalo |
| 8 | orb | per-state targets | idle (breath .028, wobble .014, flow .32, swirl .1, glow .55); listening (.01, .022, .7, .22, gain .15, rings 1, glow .75, grow +.03); thinking (.012, .03, .55, 1.25, sheen 1, glow .6, grow −.08); speaking (.006, .026, .95, .3, gain .19, glow .9, grow +.02) | – | – | – | gl-track channel rest values |
| 9 | orb | voice level | listening: 0.8 · voice(t − chatStart) where voice = clamp(1.1 · max(0, ½sin 7.2s + ½sin(11.3s+1.2))^1.4 · clamp(.7 sin 1.15s + .55)), s = t + 21.9; speaking: per-word pulse 0.95 → 0.12 in 320 ms (expo-out), reaching the orb one frame after the word renders (measured: first non-zero uVoice 2 frames after the word); follower attack 18/s, release 5/s | 17 | ∞ | – | python re-simulation of uVoice: mean error 0.00016 (0.06 % of range) |
| 10 | orb | swell, ripples, glow | radius = 1 + grow + breath·sin(1.25·clock) + 0.9u (u = level·gain); edge voice term 2.6u; ripples 3 rings, phase rate 0.42 + 0.5·level per s, strength rings·(0.35 + 0.9·level); glow·(0.2 + 1.6u) + 0.08·sheen; lift 2.2u | – | ∞ | – | gl-track uScale/uVoice/uRing/uRingPhase/uHalo/uBright |
| 11 | orb | clocks | ink flow += dt·(flow + 3·level·gain); swirl += dt·swirl; sheen angle −2.3 rad/s; all running since mount (ref clock 6.50 s at the click) | page start | ∞ | linear | gl-track first sample (mount at −6483 ms) |
| 12 | state | thinking | 700 ms after the last heard word | 4150 | 1500 | – | gl-track uShimmer starts 4150 |
| 13 | state | speaking | first spoken word +260 ms, then 150 + 22 ms/char | 5667; words 5933, 6200, 6483, 6800, 7083, 7283, 7533, 7883, 8100, 8283, 8500, 8733 | – | – | track.json |
| 14 | state | listening (turn 2) | 1300 ms after the last spoken word | 10050 | – | – | status 10150 (after its 100 ms exit) |
| 15 | timer | m:ss | +1 every 1000 ms from the click | 1000, 2000, … | – | steps | track.json clock width |

Trigger: click. Total: a 10 s turn that loops (three scripted turns). Never fully rests while active.

## Style facts (motion-faithful: own palette and copy)
- Reference: Inter, grey orb (c1 #353535, c2 #515151, c3 #c6c6c6) on white, rose end button.
- Clone: Figtree (Google Fonts), indigo ink #27235c / violet #6d5ae6 / apricot #ffdbc7 orb, warm white card on #f3f2ee, coral end button, lucide Mic / MicOff / PhoneOff.
- Shader written fresh: gradient noise with an integer hash, two marbled layers on a warp field, glass bulge, our lighting. The motion laws (edge lobes, swirl falloff, ripple travel, sheen band, swell/glow response) are the measured ones.
- Copy is our own (a rail-travel assistant). The first turn's words have exactly the reference's word lengths, so the per-character cadence lands every word on the reference's frame.

## Pass criteria (motion-faithful)
- State changes, word reveals and timer steps within 80 ms of the reference.
- GL channels (gl.ts compare with --map): same kind, start/end within 80 ms, mean error ≤ 5 % of range.
- Palette-independent orb probe: edge radius per frame mean |Δ| ≤ 1.5 px (≈ 2.5 % of the radius); ripple/glow energy curve same shape.
- DOM enter/exit shapes as rows 1-6 (durations ± 80 ms, same easing family).
- Nothing moves in the clone that is still in the reference.

## Additions
- "Use my microphone" (idle note): asks for the microphone; if granted, the chat starts with the real RMS level (dB mapped to 0..1) instead of the demo voice. Not used in capture (capture clicks Start). If refused, the note says so and the demo voice stays.
- Reduced motion: the orb holds a still pose (no breathing, fixed ink) and enters/exits are instant.
- No WebGL2: a CSS gradient disc.
