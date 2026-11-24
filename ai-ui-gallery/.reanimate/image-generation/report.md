# image-generation — reanimate report

**Fidelity:** motion-faithful. Arc UI "Image generation" (https://uiarc.dev/components/image-generation) is Pro: it has the Pro badge and its source sits behind the paid plan. The code is written fresh with our own warm palette, IBM Plex Sans/Mono, lucide icons, our own copy and fictional model names (Nova Image, Atlas Mini, Quill 2). The "generated" images are four landscapes painted procedurally on a 2D canvas; nothing is copied from the reference.

**Cloned:** one full generation run from mount:
- the empty dot field with the suggestion overlay;
- the auto-submit at 533 ms;
- the dark halftone wave on its elliptical path;
- the colour bleed into a coloured halftone;
- the blur-resolve into the sharp image;
- four filmstrip variations that colour 250 ms apart and resolve 400 ms apart;
- the "Generating n%" read-out and the seed pill;
- the Generate ↔ Stop button with its n/4 count.

**Added:**
- Selectable thumbnails (a radio group with arrow keys).
- Generate re-runs with new seeds; Vary makes four variants of the active scene.
- Stop freezes unfinished images under a "Stopped" veil with Retry.
- Upscale sweeps a halftone band down the image and doubles the size label.
- Download saves a PNG.
- The aspect chips letterbox the next run.
- Reduced motion keeps a static field and cross-fades to the image.

**Code:** `src/clones/image-generation/` (`index.tsx`, `meta.ts`, `image-generation.css`, `timeline.ts`, `field.ts`, `scenes.ts`).

**Trigger:** plays on mount. `?autoplay=0` waits for a click on `[data-ig-start]`; that click is the reference's t = 0.

**Capture:** both sides use the same viewport (1440×900), crop size (600×626), duration (7.5 s), fps (30) and virtual clock. Comparisons start at t = 233 ms because the reference's first frames show the docs page's tab transition. Two round-3 attempts were OOM-killed; the reported capture was taken on a re-warmed dev server after the memory fix.

## Last compare round (clone-3)

| # | Row | Reference | Clone | Error | Result |
|---|---|---|---|---|---|
| 1–2 | Empty field, then overlay removed | gone at 550 | gone at 550 | 0 | pass |
| 3 | Run start (status pill, thumbs, glow) | frame 533 | frame 533 (track +17 ms) | 0 to +17 ms | pass |
| 4 | Generate → Stop button | bg 53→193→242→253 at 533/567/600/633 | `cubic-bezier(.2,0,0,1)` 100 ms (fitted rms 0.01) | n/a | pass |
| 5 | Wave centroid, t 600–2300 | n/a | n/a | mean 4.6 px, max 14 px (limit 8 mean) | pass |
| 6 | Wave spread | n/a | ratio 0.99 (min 0.89) | within 15 % | pass |
| 7–8 | Colour/growth phase: dot energy 10/50/90 % | 1673 / 2430 / 3151 | 1612 / 2415 / 3074 | −62 / −15 / −76 ms | pass |
| 7–8 | Darkness 10/50/90 % | 1335 / 2922 / 3440 | 1280 / 3003 / 3291 | −55 / +81 / −149 ms | partial: 90 % crossing −149 ms (image content) |
| 7–8 | Chroma 10/50/90 % (white-balanced to the stage colour) | 1967 / 2865 / 3430 | 2405 / 2967 / 3339 | +437 / +102 / −91 ms | fail on the number, image content (see below) |
| 8 | Colour mix c(t) vs the reference dot log | 0.018 / 0.108 / 0.249 / 0.413 / 0.577 / 0.724 / 0.848 at 1500…3000 | smoothstep(1300, 3550) | max 0.025 | pass |
| 9 | Status % at 1065 / 2528 / 3592 / 4523 / 5188 | 13 / 50 / 74 / 91 / 100 | 15 / 51 / 74 / 91 / 100 (round-2 read-off) | ≤ +2 points | pass |
| 10 | Resolve: preview opacity (field and glow mirror it) | 10/50/90 % at 4132 / 4481 / 4887 | 4149 / 4499 / 4903 | +16 ms; max err 0.024 (0.004 after a 16 ms shift); same delay 983 ms and visible duration 1150 ms in easing.ts | pass |
| 11 | Done: count 0→1 | 5267 | 5300 | +33 ms | pass |
| 11 | Done: status pill swap | instant at 5300 | 150 ms crossfade, starts 5333, settles about 5400 | +33 ms at start, about +100 ms to settle | **fail** (see below) |
| 12–13 | Thumbs colour and resolve stagger | 250 / 400 ms | same constants; thumb 1 resolve equals the stage within 0.024 | n/a | pass |
| 14 | Stop → Generate | activity at 6533 / 6566 | 6533 / 6566 | 0 | pass |
| 15 | Spinner | 810 ms linear | same | n/a | pass |
| — | Layout (crop px) | stage 80,8.8 440²; thumb 12,459.8 48²; status 90,412.8, w 135.75 | stage 80,9 440²; thumb 12,460 48²; status 90,413, w 137.3 | ≤ 1.6 px | pass |
| — | Whole-run activity | 533–6566 | 533–6566 | 0 | pass |

**compare.ts (offset 0, from t = 233 ms):**
- Mean mismatch is 18.7 %. It is not a criterion for motion-faithful work here: the palette and images differ, so mismatch climbs once the image resolves.
- The tool's own start and peak timing reads "FAIL" because a docs-page frame (the tab change at t = 266 ms) counts as motion on the reference side, and the peak frames show different image content.
- With a 0.2 % noise floor, both sides move from 533 to 6566 ms.

**Sheet:** `compare-3/sheets/compare-01.webp` (the whole run on one sheet).

## Residual deviations

1. **Resolve and run-start events are +16–17 ms in track.json.** This is one 60 Hz frame: the tracker samples in its rAF before the clone's loop runs, and the screenshots line up frame for frame (button at 533, Generate back at 6533). Within ±80 ms.
2. **Status pill done-swap (row 11, fails):** the reference swaps instantly at 5300 and shrinks the pill. The clone cross-fades the two labels in one grid cell (out 100 ms, in 150 ms after 40 ms) and settles about 100 ms later. Known fix, not applied because of the 3-round cap: render only the current pill content and set `DONE_AT` to 5260.
3. **Done events (count, final image) are +33 ms** (5300 vs 5267), from `DONE_AT` = 5270 landing on the next 60 Hz frame. Within ±80 ms.
4. **Chroma 10 % crossing is +437 ms** (+746 ms without white balance), and the darkness 90 % crossing is −149 ms.
   - Both are frame-pixel measures that depend on the picture and the palette. The clone starts from a warm stage and warm ink, not the reference's neutral grey, and its painted lake is lower in chroma than the reference photo.
   - The motion itself matches: the colour mix c(t), checked against the reference's canvas dot log, is within 0.025 at every sample, and the dot-energy curve (dot size, alpha and contrast) is within ±76 ms.
5. **Halftone dot mapping is partly assumed:** colour ×0.78, alpha 0.83–0.87, radius 2.95 − 0.35·luminance. It was fitted on the 400 dots the reference log holds, which are the top rows only, so the curve for light areas is an extrapolation.
6. **After round 3:** the unselected model chips' clipped name letters were fixed and inactive labels hidden from screen readers; checked by screenshot only, no motion change.
