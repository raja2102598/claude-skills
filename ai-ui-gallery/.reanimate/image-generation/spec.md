# image-generation motion spec

**Target**: Arc UI "Image generation" (Pro), https://uiarc.dev/components/image-generation, the live preview's component root (`[class*=image-generation_root]`, 600x626, clipped at 413,105 in a 1440x900 viewport after scrolling 400 px). One generation run from mount: the empty dot field, the auto-submitted prompt, the halftone wave, the colour bleed into a coloured halftone, the blur-resolve into the sharp image, the staggered filmstrip of four variations, and the composer's Generate ↔ Stop button.
**Destination**: `ai-ui-gallery/src/clones/image-generation/` (React 19 + TS; canvas 2D written fresh; clone-local CSS with IBM Plex Sans / IBM Plex Mono from Google Fonts; lucide icons). Renders alone at `/c/image-generation`.
**Fidelity**: motion-faithful. Arc UI Pro is paid (Pro badge, "Get Pro", code behind the plan), so the clone is written fresh: own warm palette and type, procedural landscapes painted on canvas instead of the photos, fictional model names, own copy. Nothing of the site's JS, CSS, images or text is reused; its CSS and canvas call log were read only for durations, curves and grid geometry.

## Captures
- `ref/`: `capture.ts --url https://uiarc.dev/components/image-generation --clip 413,105,600,626 --trigger click --target "[data-ref-preview]" --pre-js prejs-ref.js --wait-before 7000 --duration 7500 --fps 30 --clock virtual --network-wait 1500 --gl --track "<stage, field canvas, glow canvas, preview img, final img, status slot, empty overlay, thumb field, thumb preview>"`. The demo has no replay control; it remounts when the docs tabs go Code → Preview, so pre-js scrolls 400 px and clicks Code, the trigger clicks Preview. t = 0 is that click (frame 6). Frames up to t = 200 ms show the docs page's tab transition (code text scrolling out, composer toolbar mounting): **compare from t = 233 ms (frame 13)**.
- `probes/arc-probe.json`: a real-clock rAF probe (inline opacity/filter/transform, status text, thumb status). Its timings are stretched by machine load; used only to name the state machine. All numbers below are from the virtual-clock `ref/` (track.json, the canvas 2D log `ref/gl/canvas2d-c18/c19/c20-23.txt`, and frames).
- `probe.py`: palette-light frame probe on the 440x440 stage (wave centroid / spread / peak of the low-passed darkness, mean darkness, chroma, dot-structure energy). `parse2d.py`: parses the canvas 2D call log (it holds the first ~400 dots of every 15th frame).
- Clone: the same command with `--url "http://127.0.0.1:<port>/c/image-generation?autoplay=0" --clip` replaced by `--selector "[data-stage]"`, `--trigger click --target "[data-ig-start]"`, no pre-js, `--wait-before 2500`.

## Structure at rest (root px)
| element | ref | box | notes |
|---|---|---|---|
| root | `image-generation_root` | 600x626, 1 px border, padding 8, gap 8 | white panel, column |
| stage | `stage` | 440x440 at 80,9 (centred in a 582 frame) | rounded, canvas fill; layers: dot field canvas, glow canvas (CSS blur 7 px), preview img, final img; dims pill top-right (10 px inset), status pill bottom-left (10 px inset, 26 high) |
| dot field | 2D canvas 440x440 | 55 x 55 dots, pitch 8, first at 4,4 | grey ink rgb(11,11,11) with per-dot alpha and radius |
| bar | `bar` | 582x54 at 9,457 | strip of 4 thumbs (48x48, gap 6, padding 3), pill group Upscale / Vary / Download (32 high) at right |
| thumb field | 2D canvas 48x48 | 12 x 12 dots, pitch 4 | same phases as the stage, own timing |
| composer | `composer` | 582x98 at 9,519 | textarea 2 lines (14/20) + toolbar 44: model chips (one named, two icon-only), aspect chips 1:1 / 4:5 / 16:9, Generate button 106x34 at right |

## Timeline (t = 0 at mount / the Preview click; all from the virtual clock)
| # | element | property | from → to / law | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | empty state | field | static radial bump: alpha 0.13 + 0.51·exp(−d²/2σ²), σ ≈ 120 px, centre 220,220; r = 0.48 + 2.47·a | 0 | until 533 | static | frames 233–500 (probe constant); dot darkness map |
| 2 | empty overlay | presence | "Describe…" line + 3 suggestion pills at the stage bottom; removed instantly | 0 → 533 | – | none | track `empty` 1 → gone at 533/550 |
| 3 | run start | state | empty → running (auto-submit): thumbs replace placeholders, status pill "Generating 1%", glow canvas opacity 0 → 1 | 533 | instant | – | track: status w0→135 at 533, glow 0→1 at 550 |
| 4 | Generate → Stop | label | crossfade, out 100 ms, in 150 ms after 40 ms; button primary → secondary | 533 | ~200 | ease-out | frames 567–667 (btn region), CSS stableItem transitions |
| 5 | wave blob | centre | ellipse: x = 180.5 − 163.3·sin θ, y = 189.8 + 58·cos θ, θ = 0.59·t[s] + 2.409 (114,137 at 533 → 320,160 at 3000) | 533 | until faded | sinusoidal (constant angular rate) | gaussian fits on c19 / c18 (rms 1.2 / 1.8 px); frame centroid |
| 6 | wave blob | size | σ = 90 + 0.028·(t − 533) px (96 at 750 → 117 at 1500) | 533 | – | linear | c18 fits |
| 7 | wave blob | strength | main dots: alpha 0.13 + 0.54·g·(1 − fade); glow dots: max(0, 0.92·g·(1 − fade) − 0.27), r = 2.05 + 2.57·a; fade = smoothstep(1400, 3600) | 533 | blob gone by ~3600 | smoothstep | c19 core 0.63 (≤1500) → 0.50 (2000) → 0.31 (2500) → 0.13 (3000) → 0 (3750) |
| 8 | dots | colour / alpha / radius | ink → darkened image colour, alpha → ~0.83–0.89, r → 2.55–3.3 (bigger where darker); mix c = smoothstep(1300, 3550) | ~1400 | ~2150 | smoothstep | c18 dot colours: c = .02/.11/.25/.42/.58/.73/.85/.94/1.0 at 1500…3500 step 250 |
| 9 | status % | text | 1 → 100: round(100·(1 − (1 − u)^1.3)), u = (t − 533)/4700 | 533 | 4700 | ease-out (power 1.3) | status crops: 13 % at 1065, 50 % at 2528, 74 % at 3592, 91 % at 4523, 100 % at 5188 |
| 10 | resolve (stage) | field opacity 1 → 0 and blur 0 → 5 px; glow opacity 1 → 0; preview opacity 0 → 1, blur 12 → 0 px, scale 1.04 → 1 | one progress p | 3910 | 1290 | cubic-bezier(.30,0,.55,1) | track.json (fit rmse 0.0019); probe inline styles (linear in p) |
| 11 | done (stage) | state | final image, status pill swaps to "seed … · 4.7s" (crossfade), actions enabled, Stop count 1/4 | 5267–5300 | – | – | frames 5267/5300, track final at 5283 |
| 12 | thumbs 1–4 | colour phase | thumb k (0-based) runs row 8 delayed by 250·k ms | 1300 + 250k | ~2250 | smoothstep | c20–c23 colour mix |
| 13 | thumbs 1–4 | resolve | row 10 delayed by 400·k ms; done at 5267 + 400k (count k+1/4) | 3910 + 400k | 1290 | cubic-bezier(.30,0,.55,1) | thumb-vs-final distance per frame: done 5267 / 5667 / 6067 / 6483 |
| 14 | Stop → Generate | label + fill | crossfade back, primary fill | 6483 | ~200 | ease-out | frames 6467–6633 |
| 15 | status spinner | 3x3 dots | per-dot opacity loop 1 → 0.22, 810 ms, linear | 533 | ∞ while running | linear | CSS keyframes (`ig-spin`) |

Total length about 6.7 s. Last visible change: the Generate label at ~6.65 s.

## Pass criteria (motion-faithful)
- Discrete events (rows 2, 3, 4, 11, 13, 14) within ±80 ms (± 1 frame at 30 fps is 33 ms).
- Wave centroid (probe, t 600–2300, before colour dominates): mean distance ≤ 8 px, spread within 15 %.
- Colour / growth phase: the normalised chroma and dot-energy curves reach 10 / 50 / 90 % within ±80 ms of the reference.
- Resolve: preview opacity curve max error ≤ 0.03 and timing ±80 ms (track.json, easing.ts --compare-track); glow and field follow it.
- Status %: within ±2 points at the read-off times.
- Layout proportions: root, stage, bar, thumbs and composer boxes within 2 px.

## Additions
- `?autoplay=0` capture mode: the empty state renders and holds; an invisible 24 px start button `[data-ig-start]` in the root's top-left corner starts the clock (the reference's t = 0 is its mount, which equals this click).
- Thumbs are selectable (radio group, arrow keys); a finished thumb shows its image on the stage. Generate (or Vary) re-runs with a new seed; Stop halts unfinished images with a "Stopped" veil and Retry; Upscale sweeps a dot band across the image and doubles the size label; Download saves the active image as PNG.
- `prefers-reduced-motion: reduce`: no dot animation; the run still times the same but shows the static field, then cross-fades to the image.
