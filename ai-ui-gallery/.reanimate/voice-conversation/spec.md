# voice-conversation motion spec

**Target**: UIStacks "Voice call" (Pro), https://uistacks.dev/components/voice-call, the live preview card (`[id$='-preview'] section`, crop 480x420 at 480,536 in a 1440x1100 viewport). One full call: Dialing → Ringing → In call with a five-line transcript streamed word by word, the waveform following whoever talks, the Goal line asking → confirmed, then Call ended with the outcome card replacing the controls. The demo loops every 12.03 s; one cycle is cloned, and the clone loops the same way.
**Destination**: `ai-ui-gallery/src/clones/voice-conversation/` (React 19 + TS, Tailwind v4, lucide icons, clone-local CSS with CSS keyframes/transitions for every opacity / transform / filter row, springs sampled into `linear()`). The call is a deterministic simulated script on one rAF clock: no microphone, no audio. Renders alone at `/c/voice-conversation`.
**Fidelity**: motion-faithful. UIStacks Pro is paid ("Get Pro · $159", "Needs your license key"), so the clone is written fresh: own slate/teal palette, Geist from Google Fonts, lucide icons instead of the restaurant mark and the AI glyph, own fictional call (a vet clinic booking for a pet), own copy with the same word count per line.

## Captures
- `ref/`: `capture.ts --viewport 1440x1100 --clip 480,536,480,420 --trigger click --target "[aria-label='Replay']" --wait-before 3000 --duration 9600 --fps 25 --clock virtual`. t = 0 is the Replay click (frame 5). The top 4 px of the crop show the preview's look switcher (Studio / Standard / Glass), not the component.
- `probe1.json` (scratch, not kept): a real-clock rAF probe of one cycle that also logs every `getAnimations()` entry (durations, easings, keyframes). The reference runs its swaps, entrances and waveform through motion (WAAPI); its word fades are CSS transitions.
- The card sits in a preview wrapper with `zoom: 0.92` (the "Studio" look). Natural card 460 x 414 renders as 423 x 381. The clone applies the same zoom in its stage wrapper, so distances below are natural CSS px.

## Structure at rest (natural px)
| element | box | notes |
|---|---|---|
| card | 460 x 414, padding 16, radius 20 | white on a flat grey stage; centred in the crop |
| header | tile 40 (radius 12) · gap 12 · name 15/20 medium + number 13 subtle · status 13/20 (mt 2) · waveform | waveform: 14 bars 3 x 24, gap 3, origin centre |
| transcript log | mt 12, height 204 fixed, radius 14, padding 10/12, list gap 10 | rows: avatar 24 round (mt 1) · gap 10 · text 14/22. Callee text muted, agent text ink. Empty: centred 13 px placeholder. 5 rows fit, no scroll |
| goal row | mt 12, 20 high, gap 8 | icon 20 · "Goal" muted · label medium · status ("· asking" muted, "· confirmed" success) |
| controls | mt 12, border-top, pt 12, min-h 79 | 3 columns of 72, gap 16: round 44 buttons with 12/16 labels below (gap 6). Take over is disabled (opacity .5) until pickup |
| outcome card | same cell as controls, radius 14, padding 12, gap 12 | 32 px badge with check · title 14/20 + sub 13/20 · pill button h 32 |

## Timeline (t = 0 at start of the cycle; ms)
| # | element | property | from → to | start | duration | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | status | text | "Dialing…" | 0 | – | – | probe |
| 2 | avatar rings (2) | scale / opacity | 1 → 1.35 / .5 → 0 | 0 and 700 | 1400, infinite | ease-out cubic-bezier(0,0,.58,1) (fitted to the sampled curve, rmse < 0.001) | getAnimations |
| 3 | waveform idle | scaleY | static profile 0.12 + 0.42 × peak | 0 | – | – | probe |
| 4 | status swap (all swaps) | out: opacity 1 → 0, blur 0 → 2 px, y 0 → −8; in: opacity 0 → 1, blur 2 → 0 (450 ms), y 8 → 0 (250 ms) | – | 830 (Ringing…) | out 150, in 450 / 250 | out ease-out; in spring ω ≈ 20.8, ζ ≈ 0.84 (overshoot 0.9 %) | getAnimations |
| 5 | pickup | status → "In call 00:00" with a success dot whose halo pings (scale 1 → 2.4, opacity .45 → 0, 1600 ms ease-out, infinite); rings removed; placeholder → first row (no entrance); Take over opacity .5 → 1 (150 ms, cubic-bezier(.4,0,.2,1)); goal "· asking" appears | | 1750 | | | probe |
| 6 | goal icon swap | out: opacity 1 → 0, scale 1 → .6 (120 ms ease-out); in: opacity 0 → 1, scale .6 → 1 | pending → AI loader | 1750 | 500 | spring ω ≈ 22.8, ζ ≈ 0.57 (11 % overshoot) | getAnimations |
| 7 | goal AI loader | dot groups opacity steps | 4 phases | 1750 | 800, infinite | linear | getAnimations |
| 8 | call timer | text | 00:00 → 00:26, one "second" every 250 ms | 1762 | – | – | probe |
| 9 | transcript rows 2–5 | mount: opacity 0 → 1 (450 ms), y 6 → 0 (250 ms) | | 2665, 4716, 5946, 6946 (row 1 at 1750, no entrance) | | spring as 4 | getAnimations |
| 10 | words | opacity 0 → 1, blur 3 → 0 px | one word every 84 ms, first word 100 ms after the row mounts | | 200 | cubic-bezier(.4,0,.2,1) (CSS transition) | probe: 5 / 19 / 9 / 6 / 8 words, 1517 ms for 18 gaps |
| 10b | row avatar | opacity 0 → 1 | with the first word | | 200 | cubic-bezier(.4,0,.2,1) | probe |
| 11 | waveform speaking | per-bar scaleY loop .16 → p → .45p → .85p → .16 | from row mount to its last word | | bar i: [1300,1450,1600,1750][i % 4] ms, delay (i % 5) × 70 ms, infinite | ease-in-out per segment | getAnimations (peaks .30 .50 .42 .75 .55 .95 .65 1 .60 .85 .45 .70 .38 .50) |
| 11b | waveform colour | idle → callee → idle → agent … | track / muted / ink | with 11 | snap | – | probe |
| 12 | goal confirmed | icon AI → check (as 6); status "· asking" → "· confirmed" (as 4) | | 7873 | | | probe |
| 13 | call ends | status → "Call ended · 00:26" (as 4); controls opacity 1 → 0 (120 ms ease-out); tile opacity 1 → .6 (300 ms ease-out) | | 8484 | | | probe |
| 13b | outcome card | opacity 0 → 1 (450 ms), y 8 → 0 + scale .98 → 1 (250 ms) | | 8498 | | spring as 4 | getAnimations |
| 13c | outcome badge | scale .6 → 1 | | 8498 | 680 incl. ~80 ms hold | spring ω ≈ 23, ζ ≈ 0.48 (18 % overshoot) | getAnimations |
| 14 | loop | everything resets to Dialing | | 12030 | – | – | probe |

## Additions
- `?autoplay=0` waits for a click on an invisible 24 px start button in the stage corner (capture trigger), mirroring the reference's Replay click.
- A Replay button (lucide RotateCcw) in the card corner area is not added; the stage loops like the reference.
- Reduced motion: no rings, pings, waveform loop or blur; words appear without fades.
