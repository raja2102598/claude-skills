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

**Capture:** both sides use the same viewport (1440×900), crop size (600×626), duration (7.5 s), fps (30) and virtual clock. Comparisons start at t = 233 ms because the reference's first frames show the docs page's tab transition. Two round-3 attempts were OOM-killed; the round-3 capture was taken on a re-warmed dev server after the memory fix. Round 4 (the timing fix below) was captured with the same settings on a freshly warmed dev server; the reference capture in `ref/` was reused.

## Last compare round (clone-4, after round 4)

| # | Row | Reference | Clone | Error | Result |
|---|---|---|---|---|---|
| 1–2 | Empty field, then overlay removed | gone at 550 | gone at 550 | 0 | pass |
| 3 | Run start (status pill, thumbs, glow) | frame 533 | frame 533 (track +17 ms) | 0 to +17 ms | pass |
| 4 | Generate → Stop button | bg 53→193→242→253 at 533/567/600/633 | `cubic-bezier(.2,0,0,1)` 100 ms (fitted rms 0.01) | n/a | pass |
| 5 | Wave centroid, t 600–2300 | n/a | n/a | mean 4.6 px, max 14 px (limit 8 mean) | pass (round 3, motion not touched in round 4) |
| 6 | Wave spread | n/a | ratio 0.99 (min 0.89) | within 15 % | pass (round 3) |
| 7–8 | Colour/growth phase: dot energy 10/50/90 % | 1673 / 2430 / 3151 | 1612 / 2415 / 3074 | −62 / −15 / −76 ms | pass (round 3) |
| 7–8 | Darkness 10/50/90 % | 1335 / 2922 / 3440 | 1280 / 3003 / 3291 | −55 / +81 / −149 ms | partial: 90 % crossing −149 ms (image content) |
| 7–8 | Chroma 10/50/90 % (white-balanced to the stage colour) | 1967 / 2865 / 3430 | 2405 / 2967 / 3339 | +437 / +102 / −91 ms | fail on the number, image content (see below) |
| 8 | Colour mix c(t) vs the reference dot log | 0.018 / 0.108 / 0.249 / 0.413 / 0.577 / 0.724 / 0.848 at 1500…3000 | smoothstep(1300, 3550) | max 0.025 | pass |
| 9 | Status % at 1065 / 2528 / 3592 / 4523 / 5188 | 13 / 50 / 74 / 91 / 100 | 15 / 51 / 74 / 91 / 100 (round-2 read-off) | ≤ +2 points | pass |
| 10 | Resolve: preview opacity (field and glow mirror it) | 10/50/90 % at 4132 / 4481 / 4887 | 4149 / 4499 / 4903 (clone-4 preview opacity ramp unchanged: 3983 → 1.0 at 5150) | +16 ms; max err 0.024 (0.004 after a 16 ms shift) | pass |
| 11 | Done: count 0→1 and final image | 5267 | 5283 track sample (DONE_AT 5260) | 0 to +16 ms, same sample as the reference's pill swap | pass |
| 11 | Done: status pill swap | instant at frame 166 (5300 ms); slot width 135.8 → 144.2 px at track t 5283.3 | instant at frame 166; slot width 134.4 → 137.3 px at track t 5283.3; no in-between frames | 0 ms (round 3: +33 ms start, about +100 ms to settle) | **pass** |
| 12–13 | Thumbs colour and resolve stagger | 250 / 400 ms | same constants; thumb 1 resolve equals the stage within 0.024 | n/a | pass |
| 14 | Stop → Generate | activity at 6533 / 6566 | 6533 / 6566 (clone-4 whole-run activity ends at the reference's last active frame, 203) | 0 | pass |
| 15 | Spinner | 810 ms linear | same | n/a | pass |
| — | Layout (crop px) | stage 80,8.8 440²; thumb 12,459.8 48²; status 90,412.8, w 135.75 | stage 80,9 440²; thumb 12,460 48²; status 90,413, w 137.3 | ≤ 1.6 px | pass |
| — | Whole-run activity | 533–6566 | 533–6566 | 0 | pass |

Rows 5–10 and 12–15 were not re-measured one by one after round 4 (which changed only the status pill and `DONE_AT`). Their pass results are from round 3. In round 4 the resolve and done events in `track.json` and the whole-run activity were checked and match the reference.

**compare.ts (`compare-4`, offset 0, 232 frames):**
- Mean mismatch is 18.26 % over all 232 frames, and 18.71 % from t = 233 ms (219 frames), the same as round 3. It is not a criterion for motion-faithful work here: the palette and images differ, so mismatch climbs once the image resolves.
- Frame 0 shows 46 % mismatch. It is a pre-roll frame before the comparison window and is not motion.
- The tool's own start and peak timing reads "FAIL" because the docs-page frames (the tab change before t = 233 ms) count as motion on the reference side, and the peak frames show different image content.
- Per-frame mismatch over frames 150–231 is the same as round 3 or lower (≤ 0.037 lower in frames 150–165, within 0.007 in frames 200–231), so nothing regressed.

**Sheet:** `compare-3/sheets/compare-01.webp` (the whole run on one sheet, from round 3). It was not rebuilt for compare-4: the frame-by-frame row 11 check was done on the frames directly.

## Residual deviations

1. **Resolve and run-start events are +16–17 ms in track.json.** This is one 60 Hz frame: the tracker samples in its rAF before the clone's loop runs, and the screenshots line up frame for frame (button at 533, Generate back at 6533). Within ±80 ms.
2. **Done events (count, final image, pill swap) are 0 to +16 ms.** `DONE_AT` is 5260 and these land on the same frame as the reference's pill swap. Fixed in round 4, previously a +33 ms start and a pill that settled about +100 ms late.
3. **Chroma 10 % crossing is +437 ms** (+746 ms without white balance), and the darkness 90 % crossing is −149 ms.
   - Both are frame-pixel measures that depend on the picture and the palette. The clone starts from a warm stage and warm ink, not the reference's neutral grey, and its painted lake is lower in chroma than the reference photo.
   - The motion itself matches: the colour mix c(t), checked against the reference's canvas dot log, is within 0.025 at every sample, and the dot-energy curve (dot size, alpha and contrast) is within ±76 ms.
4. **Halftone dot mapping is partly assumed:** colour ×0.78, alpha 0.83–0.87, radius 2.95 − 0.35·luminance. It was fitted on the 400 dots the reference log holds, which are the top rows only, so the curve for light areas is an extrapolation.
5. **Status pill width differs by 2.9 px after the swap** (clone 137.3 px vs reference 144.2 px for the done label, from the track), and before it by 1.6 px (137.3 vs 135.8). This is font and padding, not timing.
6. **After round 3:** the unselected model chips' clipped name letters were fixed and inactive labels hidden from screen readers; checked by screenshot only, no motion change.

## Rounds

- Rounds 1–3: build, wave/colour fit, resolve fit, chip fixes (see above).
- Round 4: render only the current status-pill content (instant swap, pill resizes) and `DONE_AT` 5270 → 5260. Row 11 passes. The Generate/Stop button keeps its two-label cross-fade (scoped CSS).
