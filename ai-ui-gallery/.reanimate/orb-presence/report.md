# orb-presence: reanimate report

**Cloned**: Wensity "ChatGPT Orb" idle loop (https://ui.wensity.com/components/chatgpt-orb), **motion-faithful**.
**Added**: an accessible launcher around the orb (button, focus ring, hover/press, open state with status chip, Esc to close, reduced-motion pose, no-WebGL fallback). See spec.md › Additions.

**Code**: `src/clones/orb-presence/index.tsx` (component, motion constants, launcher), `orb-gl.ts` (WebGL2 renderer and our own GLSL), `orb.css` (clone-local styles), `meta.ts`. View it at `/c/orb-presence`. The idle drift plays on mount; click, Enter or Space opens; Esc closes.

## How it was verified
Reference and clone were captured with the same command: 1440x900, 340x340 crop, `--clock virtual`, seed 1, 20 fps, 4 s, trigger none, `--gl`. With a palette swap and an endless 3 px/s drift, compare.ts's pixel metrics cannot separate motion from colour. So the motion is checked three ways: (1) the GL trace channels (clock, sway, bob) against the reference shader's functions evaluated on its own traced `u_time`; (2) a palette-independent frame probe on normalised luminance ("ink"), which measures horizon tilt, cap fraction, drift velocity (phase correlation) and surface energy per frame; (3) the compare sheets, read state by state.

## Rounds
| round | change | tilt err (mean/max) | cap | drift speed | energy | clock origin |
|---|---|---|---|---|---|---|
| 0 | capture only: Tailwind on the shared dev server had not scanned the new files, so the canvas sat at 300x150 | – | – | – | – | – |
| 1 | first build (layout moved to clone-local CSS) | −6.0° / 6.5° | −5.7 % | 2.15× | 3.10× | −100 ms |
| 2 | integer hash (exact on every GPU, made a numpy twin of the shader possible); turbulence halved, flow re-aimed down-left, ramp lowered | −0.23° / 0.51° | −1.6 % | 1.02× | 1.20× | −100 ms |
| 3 | turbulence 0.27/0.06, flow (0.25, 0.28); clock on page time | **−0.14° / 0.33°** | **−0.6 %** | **1.04×** | **0.99×** | **+15 ms** |

## Verification (round 3 of 3)
| spec row | measured (ref → clone) | criterion | result |
|---|---|---|---|
| 1 clock | rate 0.1400/s → 0.1400/s; origin at trigger 2.500 s → 2.515 s (+15 ms) | rate ±2 %, origin ≤ 80 ms | pass |
| 2 sway angle (channel) | max \|uTilt − ref ang(t)\| = 0.00069 rad = 1.1 % of the 0.0607 rad travel | ≤ 5 % of travel | pass |
| 2 sway angle (visible) | tilt 18.8–21.8° → 18.7–21.7°; mean err −0.14°, max 0.33°; change over 4 s +2.64° → +2.87° | mean ≤ 1°, change within 0.6° | pass |
| 3 bob (channel) | max \|uRise − ref lift(t)\| = 0.00007 (1.2 % of travel) | ≤ 5 % | pass |
| 4 drift | (−2.44, −1.74) → (−2.37, −2.05) px/s; speed 3.00 → 3.13 (+4 %); heading 215.5° → 220.9° (+5.4°) | speed ±10 %, heading ±10° | pass |
| 5 surface energy | 0.00042 → 0.00042 per frame (0.99×) | ±10 % | pass |
| 6 turbulence confined to band | sheets: cap and base calm in both, haze only along the horizon | same | pass |
| layout | cap 0.432 → 0.430 of the disc (−0.6 %); disc 260 px at 40,40 in both; same edge radius | within 10 % | pass |
| 7 DOM static | canvas rect constant in both track.json | nothing extra moves | pass |
| canvas settings (gl.ts compare) | 260x260, ratio 1, antialias false, alpha, premultiplied: same; webgl → webgl2; quad (6 verts, blend ONE/1−SRC_ALPHA) → full-screen triangle (3 verts, no blend); 1 draw per frame on both | same or explained | pass (explained below) |

Pixels (for the record; motion-faithful does not judge them): compare.ts mean mismatch 24.42 % sharp / 24.56 % blurred (6 px), offset 0, every frame 24.2–24.8 %. The diff is the recoloured cap (blue → lagoon). The pale base passes, and the red area keeps the same shape in every frame, so it measures palette, not motion. Palette-independent layout mismatch (normalised ink maps, 6 px blur): mean |Δ| 0.053, and 15.6 % of disc pixels differ by more than 0.1 (worst frame 16.6 %). compare.ts timing error reads 0 s, but the activity curve is flat on both sides: the drift is about 0.15 px per frame, below its pixel threshold. Rows 1–5 carry the timing evidence instead.

Sheet: `compare-3/sheets/compare-01.webp` (first 1.4 s; the full set stays out of git). The probe, sim and GL numbers were kept out of git with the other raw captures.

## Residual deviations
1. **Texture is not the reference's noise.** The ink-map mismatch is 0.053 mean (15.6 % of pixels > 0.1). That is by design: the reference is paid and unlicensed, so the GLSL is written fresh (gradient noise, integer hash, our own layering). It is matched statistically (tilt, cap, drift and energy above), not feature for feature.
2. **Drift heading is +5.4° steeper and speed +4 %.** The wisps fall slightly more steeply. This is within the criteria and comes from layering two noise fields at different scales: the two velocities are not independent knobs.
3. **Visible tilt changes by +2.87° against +2.64° over 4 s (+0.23°).** The underlying sway is identical (1.1 % of travel). The small difference is how our haze sits on the horizon as it drifts.
4. **Clock origin +15 ms.** The clock runs on page time, so the orb keeps its phase across remounts, and the reference counts from its own mount. That is within the 80 ms limit, and on a real page the phase at any moment depends on load time anyway.
5. **WebGL2 + full-screen triangle, no blend**, against WebGL1 + quad + premultiplied blend. The output is the same: one opaque-or-masked draw onto a cleared transparent canvas, at the same cadence (1 draw per frame).
6. **Colours and look differ on purpose**: lagoon cap over warm pearl, slight rim darkening, the launcher's hover, focus and open states. There are no Wensity assets, copy, CSS, JS or GLSL in the clone.

## Candidates
Winner: Wensity ChatGPT Orb (tied for the best polish; reads most clearly as idle presence). Runner-up: Wensity AI Orb (as polished, but built as a generation loader). Third: assistant-ui Orb (MIT; most complete, five states, but small with edge artefacts). Rare UI Fluid Orb and Matrix orb did not load (HTTP 429, then a Vercel Security Checkpoint). Liquid Glass Orb and Libraries.dev Thinking orbs loaded but are off-concept. Details in `selection.md`.
