# orb-voice: reanimate report

**Cloned**: Arc UI "Voice orb" (https://uiarc.dev/components/voice-orb), **motion-faithful**.
It covers the full voice-mode card: status label, WebGL orb, word-by-word transcript, call pill (mute, timer, end) and note. The capture runs one whole turn after "Start voice chat": listening, then thinking, then speaking, then listening again.
**Added**: an opt-in "Use my microphone" link in the idle note. It feeds the real RMS level (getUserMedia + AnalyserNode) instead of the demo voice and is not used in capture. Reduced motion holds a still orb pose and makes the enters instant. Without WebGL2 a CSS gradient disc is shown.

**Code**: `src/clones/orb-voice/`
- `index.tsx`: the demo, the orb loop, the transcript, the pill.
- `orb-gl.ts`: WebGL2 renderer with our own GLSL.
- `voice-model.ts`: state shapes, springs, the synthetic voice, the script timing.
- `orb-voice.css`: CSS keyframes, with springs sampled into `linear()`.
- `meta.ts`

Open `/c/orb-voice`. The orb idles on mount; clicking "Start voice chat" (or the orb) starts the loop. Esc or the end button stops it.

## How it was verified
Reference and clone were captured with the same command: 1440x900, a 520x440 crop, click trigger, 11 s at 20 fps, `--clock virtual`, seed 1, `--network-wait 200`, `--gl`, plus DOM tracks.

The reference's enter and exit animations use WAAPI (motion). Their shapes were measured once on the real clock (6.5 s) and from the script's motion tokens. The clone does these with CSS keyframes, which behave the same on either clock.

No microphone exists headless. The reference's getUserMedia call fails, so it falls back to a simulated level. Its `uVoice` uniform was re-simulated in Python: it equals 0.8·voice(t − chat start), with a mean error of 0.00016 (0.06 % of range). The clone drives exactly that law.

Orb motion was checked three ways:
1. `gl.ts compare` on every uniform, using `--map`.
2. A palette-independent frame probe. On luminance distance from the card it measures the orb edge radius (the steepest fall of the radial profile) and the glow and ripple energy outside it.
3. The compare sheets.

## Rounds
| round | change | word timing | GL channels (value) | orb edge mean \|Δ\| |
|---|---|---|---|---|
| 1 | first build | −150 to +33 ms; drifts late in speaking | all ≤ 4.8 % except ring phase 7.7 % | 0.69 px |
| 2 | first-turn copy given the reference's exact word lengths; measured 6.5 ms per-step latency; more ink contrast | 0 to +33 ms | all ≤ 3.4 % except ring phase 8.9 % (sawtooth) | 0.52 px |
| 3 | spoken-word pulse reaches the orb one frame after the word renders; pill width spring no longer restarts when the old panel unmounts; start button 159 px; mic glyph pops only on toggle | **0 to +33 ms** | **all ≤ 2.1 %** | **0.45 px** |

## Verification (round 3 of 3)
| spec row | measured (ref → clone) | criterion | result |
|---|---|---|---|
| 5 heard words (11) | 900/1117/1333/1583/1783/2050/2367/2617/2900/3100/3433 → each +16.7 to +33.4 ms | ≤ 80 ms | pass |
| 13 spoken words (12) | 5933 … 8733 → +0 to +33.3 ms | ≤ 80 ms | pass |
| 12/14 state changes (GL) | thinking: uShimmer starts 4150 → 4150; settle 6550 → 6567; listening again: uWobble ends 10650 → 10650 | ≤ 80 ms | pass |
| 1 status label swap | DOM label change (after the 100 ms exit) at 133/4250/5767 → 100/4267/5817 (−33/+17/+50 ms). Exit 100 ms ease-out; enter 200 ms expo-out: clone 0.972 @ +83 ms, 0.986 @ +100 vs ref 0.94 @ +70, 0.984 @ +102 | ≤ 80 ms, same family | pass |
| 2 pill width | 159 → 142 px. Progress ref 0.11/0.33/0.52/0.78/0.87/0.97 at +39/70/102/144/193/351 ms; clone 0.11/0.33/0.52/0.67/0.86/0.95 at +33/67/100/133/200/267 | spring 0.3 s, no bounce | pass |
| 3 panel swap | enter opacity: ref 0.46/0.72/0.91/1 at +39/70/102/144; clone 150 ms ease-out (0.41/0.66/0.86/0.99 by law); scale 0.92 → 1 snappy spring | same family, ≤ 80 ms | pass |
| 4 line swap | old line exits 140 ms up 10 px with blur; new line enters on spring 0.3 s (ref 0.20/0.41/0.59/0.78 at +39/70/102/144, law 0.15/0.35/0.53/0.72) | same | pass |
| 5 word fade | clone 0.28/0.49/0.75/0.87 at +17/33/67/100 ms (expo-out 340 ms law 0.28/0.48/0.75/0.87); ref real 0.31/0.66/0.88 at +29/67/108 | same family | pass |
| 6 first-word rise | virtual tracks: ref 38 % at +83 ms and 85 % at +200 ms; clone 47 % / 88 %; both settle ≈ 530 ms | same spring | pass |
| 7-8 shape springs | uWobble 0.0 %, uShimmer↔uSheen 0.1 %, uSwirl↔uTwist 0.1 %, uScale↔uRadius 0.7 % of range | ≤ 5 % | pass |
| 9 voice level | uVoice 1.0 %, uBright↔uLift 1.0 %; peaks listen 0.2702 → 0.2699, speak 0.2167 → 0.2208 | ≤ 5 % | pass |
| 10 ripples, glow | uRing↔uRings 0.3 %, uHalo↔uGlow 0.8 %; ring phase 2.1 % (circular 0.012 cycle while rings show); probe glow+ripple energy correlation 0.976, mean ×1.05 | ≤ 5 % | pass |
| 11 clocks | flow 0.1 %, sheen angle 0.2 %; orb clock at the click +26 ms (page-time origin) | rate same, ≤ 80 ms | pass |
| orb edge (probe) | mean \|Δ\| 0.45 px, max 3.0, correlation 0.975. Rest 61.50 → 61.50; listen 62.12 → 62.19; think 55.57 → 56.32; speak 63.10 → 62.91 | ≤ 1.5 px mean | pass |
| 15 timer | the sheets show the same m:ss on the same frames (for example 0:01 at #24 and #42) | ≤ 80 ms | pass |
| layout | card 520x440, orb 200 at 160,57, transcript 478x42 at y 271, pill y 327, 159 → 142 px | ≤ 10 % | pass |
| compare.ts timing | motion window start 0 s, end +0.05 s, duration +0.05 s | ≤ 0.08 s | pass |
| canvas (gl.ts) | 200x200, ratio 1, antialias false, alpha, premultiplied in both. WebGL1 TRIANGLE_STRIP 4 → WebGL2 full-screen TRIANGLES 3; no blend and 1 draw per frame in both | same or explained | pass (explained) |

Pixels, for the record (motion-faithful does not judge them): mean mismatch 5.72 % sharp and 4.49 % blurred (6 px), offset −1, worst frame 6.5 %. The diff is the orb's palette, plus our copy and font.

`gl.ts compare` prints FAIL on 4 rows (uTime, uScale, uRingPhase, uShimmerAngle) only for "start +83/84 ms". That is the first traced frame, when the canvas mounted (the clone's page loads faster), not a change in motion. Their value errors are 0.1 / 0.7 / 2.1 / 0.2 % of range.

Sheet: `compare-3/sheets/compare-01.webp` (0–2.1 s; the full set stays out of git).

## Residual deviations
1. **Heard words land one frame late (+16.7 ms; word 3 +33 ms).** The measured 6.5 ms per-step latency also applies to the first word, which tips each of them into the next 50 ms frame. Within 80 ms.
2. **The status label's DOM change shows −33/+17/+50 ms.** The clone removes the exiting label on `animationend` through a React update, up to 2 frames after its 100 ms exit; motion removes it exactly at 100 ms. The state itself changes on the same frame (the GL rows).
3. **The thinking-state edge reads +0.75 px.** uRadius matches to 0.7 % of range. The probe edge differs because our apricot sheen and rim lighten the very edge, so the steepest fall sits slightly further out. It is a palette effect.
4. **Orb clock +26 ms at the click.** The clone integrates from page time, so the orb keeps its phase across remounts, while the reference counts from its own mount (6.50 s before the click). This is within 80 ms.
5. **Texture is not the reference's.** The shader is written fresh (gradient noise with an integer hash, two marbled layers, our glass bulge and lighting, an indigo/violet/apricot palette). The edge lobes, swirl falloff, ripple travel, sheen band and swell/glow response follow the measured laws; the ink pattern is our own.
6. **Exit opacity shape.** On the loaded real clock the reference's 100 ms status exit reads 0.35 at +38 ms; the clone's ease-out law gives about 0.45. That is one frame of sampling uncertainty, with the same duration and family.
7. **Copy, font and colours differ on purpose:** a rail-travel assistant in Figtree, a warm card, a coral end button. There are no Arc assets, copy, CSS, JS or GLSL in the clone.

## Candidates
Winner: Arc UI Voice orb, the most complete voice-orb pattern of the set (four states, transcript, timer, controls, simulated level). Runner-up: Wensity Siri Orb (most striking still image, but one idle loop with no voice input or states). Third: Libraries.dev Voice ring. All six candidates loaded. Details in `selection.md`.
