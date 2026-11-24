# prompt-mini — motion spec

- **Target**: beUI Pro "Prompt input" (mobile), https://pro.beui.dev/components/mobile/prompt-input. The live preview is a
  looping 600x1304 phone video (`ref-src/prompt-composer.mp4`, 60 fps, 12.68 s). Cloned: the composer docked at the
  foot of the phone screen, crop `0,760,600,544` of the video scaled to 393x356 (the phone is 393 pt wide, 1.527 px/pt).
- **Destination**: `src/clones/prompt-mini/` (React 19, TypeScript, Tailwind v4, `motion`, `lucide-react`), route `/c/prompt-mini`.
- **Fidelity**: motion-faithful. beUI Pro is a paid catalog with no open-source license: own palette (graphite + violet
  accent), Geist from Google Fonts, lucide icons, own copy, fictional model "Nova 2", and a hand-drawn SVG landscape in
  place of the photo. No beUI source, CSS or media copied.

Winner chosen in speed-mode review (see selection text in the final report): beUI phone composer over UIStacks
"Mini prompt" and assistant-ui "Mobile composer".

## Reference timeline

Video time `v`; the composer first shows at v = 0.400 s, so the clone's demo time is `T = v − 400 ms`. The reference
frames (`ref/frames`, 30 fps) start at v = 0.41 s. Measurements are from the 60 fps frames in `ref-hi/` (per-frame
bounding box of the card, region-progress curves and per-column waveform heights, scripts in `scratch/`).

The demo is one scripted loop (the video's own story): tap + → photo uploads → hold mic → voice note → transcript →
send → reply running → reply done → idle again, then repeat (period 12.28 s).

| # | element | property | T start (ms) | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | card | height | 2483 | ≈215 ms (99 % at 150 ms) | 57 → 174 px | ease-out-expo, remaining = 2^(−10 t/215) | fit to 11 frames, no overshoot; bottom edge fixed, grows up; content bottom-anchored and clipped |
| 2 | card content | swap pill → compose | 2483 | cut | pill row → thumbnail / "Ask…" / [+][model chip] … [mic][send dim] | — | new row is complete on the first changed frame |
| 3 | thumbnail tile | opacity, scale | 2500 | ≈150 ms | 0 / 0.85 → 1 / 1 | ease-out | tile clipped by the growing card top |
| 4 | progress ring | arc | 2483 / 2883 / 3283 / 3767 | ≈120 ms steps | 8 % → 35 % → 65 % → 100 % | ease-out | determinate upload ring over a dimmed tile |
| 5 | thumbnail image | appears | 2917 | cut | dark tile → photo (dimmed ≈45 %) | — | |
| 6 | send | enabled | 3783 | cut | dim accent → accent | — | |
| 7 | ring + dim overlay | opacity | 4005 | ≈215 ms | 1 → 0 | ease-out-expo (p = .32/.62/.78/.88 at frames 1–4) | |
| 8 | mic | press scale | 4385 | 150 ms | 1 → 0.9 | `ease` (0.25,0.1,0.25,1) (p = .21/.42/.58/.75/.82/.90/.94) | hold-to-talk press |
| 9 | +, model chip | remove | 4650 | cut | | — | record mode starts |
| 10 | mic | tint | 4650 | cut | grey → accent-tint bg, accent icon | — | stays scaled 0.9 |
| 11 | placeholder → record row | crossfade | 4650 | 200 ms | | ease-out (0,0,0.58,1) (p = .18/.45/.72/.94 at frames 1/3/6/9) | |
| 12 | × button | opacity | 4650 | 200 ms | 0 → 1 | ease-out | |
| 13 | send icon | arrow → check | 4650 | 200 ms | crossfade | ease-out | |
| 14 | waveform | bars | 4750 + k·83.3, k = 0…11 | each bar grows in ≈50 ms | dot (2 px) → bar | ease-out | 36 columns, 7.7 px pitch; the row shifts left one column per bar; frozen after bar 12; heights 16,17,15,11,11,15,20,23,20,14,10,8 px |
| 15 | timer | text | 4650 / 5667 / 6683 | cut | 0:00 → 0:01 → 0:02 | — | ticks every ≈1017 ms |
| 16 | record dot | opacity | 4650 | ≈1.07 s period | 1 ↔ 0.4 | ease-in-out | peaks at ≈4.8, 5.8, 6.9 s |
| 17 | card | height | 6925 | ≈215 ms | 174 → 194 px | ease-out-expo | 2-line transcript |
| 18 | record row → transcript | crossfade | 6925 | 200 ms | | ease-out | + / chip back on a cut |
| 19 | send icon | check → arrow | 6925 | 200 ms | crossfade | ease-out | |
| 20 | mic | back | 6925 | 200 ms | tint → grey (cut), scale 0.9 → 1 | ease-out | |
| 21 | card | height | 8454 | ≈215 ms | 194 → 57 px | ease-out-expo (start 0.26 frame after v = 8.850) | send |
| 22 | card content | swap compose → pill | 8467 | cut | [+] "…hold to talk" [stop] | — | mic hidden while the reply runs |
| 23 | thumbnail tile | scale, opacity | 8467 | ≈100 ms | 1 → 0 | ease-out | 1 → .6 → .3 → .14 per frame, centre fixed |
| 24 | mic | return | 10683 | cut | hidden → shown | — | reply done |
| 25 | primary icon | stop → voice | 10683 | 150 ms | crossfade | ease-out | p = .28/.52/.74/.85/.93 |

Ignored: v = 8.333 s (one frame of text re-rasterisation, no motion) and v = 12.50 s (loop seam).

## Static layout (393x356 stage, px)

- Screen background flat; card x 12–381 (369 wide), bottom edge at y = 311 (45 px above the stage foot), 1 px
  border, radius 22.5 in every state (the collapsed card is 57 tall, so it is nearly but not quite a pill).
- Padding: 8 px around the button row (+ 1 px border), 12 px above the thumbnail.
- Buttons: secondary 39 px circles, primary 41 px, gap 8 px; model chip 39 tall, ≈131 wide.
- Thumbnail 58x58, radius 10, × badge 18 px at its top-right corner.
- Placeholder / transcript text: 15 px, 22 px line height, 20 px from the card edge; collapsed placeholder starts
  65 px from the card edge.
- Waveform: 36 columns from x = 77 to 352 (card-relative), 3 px wide, dot 2 px tall.
