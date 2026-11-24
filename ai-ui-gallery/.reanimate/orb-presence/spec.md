# orb-presence motion spec

Target: https://ui.wensity.com/components/chatgpt-orb, live preview `canvas.block.h-full.w-full` + 40 px pad, idle loop (winner, see selection.md)
Viewport: 1440x900   Fps: 20   Duration: 4000 ms   Trigger: none (continuous idle loop)   Clock: virtual, seed 1
Destination: ai-ui-gallery/src/clones/orb-presence/ (React 19 + TS, motion/react, hand-written WebGL2, clone-local CSS)
Fidelity: **motion-faithful** (Wensity Pro, no open-source license). Mixed additions: launcher button states (below).
Reference capture: .reanimate/orb-presence/ref
  `capture.ts --url https://ui.wensity.com/components/chatgpt-orb --out ref --viewport 1440x900 --selector "canvas.block.h-full.w-full" --pad 40 --trigger none --duration 4000 --fps 20 --clock virtual --gl --assets --wait-before 2000`
Clone capture: same command with `--url http://127.0.0.1:5173/c/orb-presence --selector "[data-stage]"` (stage = 340x340, same crop).

## Structure (static)
| element | ref → clone | box at rest (in the 340 crop) | notes |
|---|---|---|---|
| stage | preview panel → `[data-stage]` | 0,0,340,340, bg rgb(10,10,11) | near-black panel |
| orb canvas | `canvas.block` (webgl1) → `button.orbp-button > canvas.orbp-canvas` (webgl2) | 40,40,260,260, pixel ratio 1 | `border-radius: 50%`, `overflow: clip`; antialias false, alpha true, premultipliedAlpha true |
| disc mask | in shader, edge centred at r = 0.4935·size, AA ±1.7 px | radius ≈ 128 px | identical proportion |
| halo | faint dark halo, −2 levels for about 20 px | around the disc | clone: `box-shadow 0 0 26px 2px rgba(0,0,0,.45)` |
| cap / base split | saturated cap over a pale base; the horizon descends to the right at about 20° | cap ≈ 43 % of the disc | clone 43.0 % vs ref 43.2 % |

## Timeline (t=0 is the trigger; the motion is a loop that never rests)
| # | element | property | from → to / law | start | duration | easing | repeat | source |
|---|---|---|---|---|---|---|---|---|
| 1 | shader clock | `u_time` (ref) / `uPhase` (clone) | +1 s/s × 0.14 → phase +0.14/s | page start (ref −2500 ms) | ∞ | linear (clock) | – | gl-track.json `p1.u_time` kind clock +1/s |
| 2 | horizon | tilt angle | 0.52·sin(0.8τ) + 0.18·sin(2.1τ+1.1) rad, τ = phase | – | periods 56.1 s / 21.4 s | sinusoidal | ∞ | gl/shaders/p1.frag (constants) |
| 3 | horizon | offset along its normal (bob) | 0.05·sin(1.3τ+0.6) | – | period 34.5 s | sinusoidal | ∞ | p1.frag |
| 4 | haze + wisps | texture drift | measured −2.44, −1.74 px/s (3.0 px/s, heading 215°: down-left) | – | ∞ | linear | ∞ | orbprobe phase correlation on ref frames |
| 5 | haze + wisps | surface change per frame | 0.00042 mean abs change of normalised ink per frame | – | ∞ | – | – | orbprobe on ref frames |
| 6 | turbulence | confinement | only in the transition band (smoothstep 0.08–0.44 · 1−smoothstep 0.62–1.02 of the horizon axis); cap and base stay calm | – | – | – | – | p1.frag |
| 7 | orb (DOM) | position, size, opacity | none: the element is static, all motion is inside the canvas | – | – | – | – | track.json (constant) |

Over the 4 s capture the visible change is: tilt 18.8° → 21.8° (the sway's underlying angle 0.3087 → 0.3694 rad) and the wisps sliding about 12 px down-left.
Total length: infinite loop. Last visible change: none (never rests).

## Style facts (motion-faithful: own palette)
- Reference: cap #1d6fe8 (u_color), base cream = white tinted 4.5 % toward the cap, haze = 34 % mix.
- Clone (own): cap "lagoon" rgb(0.035, 0.55, 0.52) ≈ #098c85, base warm pearl rgb(0.984, 0.968, 0.93) ≈ #fbf7ed, mist = 34 % mix; a 7 % rim darkening for depth. Gradient noise with an integer hash (the reference uses value noise with a sin hash), 4 rotated octaves, written fresh.
- System UI font, lucide `AudioLines` icon in the status chip.

## Pass criteria (set before the final round, from reanimate's motion-faithful rules)
- Clock: same rate within 2 %, origin within 80 ms of the reference at the trigger.
- Sway and bob channels: |clone − ref(t)| mean error ≤ 5 % of the reference travel over the capture.
- Visible horizon tilt (probe): mean |error| ≤ 1°, tilt change over the capture within 0.6° of the reference's.
- Layout proportion: cap fraction within 10 %.
- Drift: speed within 10 %, heading within 10°.
- Surface energy (activity) per frame within 10 %.
- Nothing moves in the clone that is still in the reference: DOM static, base and cap calm.

## Additions (mixed)
The reference is a passive orb. The concept is a launcher, so the clone wraps the orb in an accessible button. None of this
shows until the user hovers, focuses or clicks, so the idle frames compared above are unaffected.
- `<button aria-label="Ask the assistant" aria-expanded aria-controls=status>`; Enter, Space or click toggles open; Esc closes and returns focus.
- Hover scale 1.02 and press 0.97 (spring, stiffness 420, damping 30); keyboard focus shows a 2 px #8ee6d8 ring, offset 5 px.
- Open state: the phase rate eases 0.14 → 0.42/s and the cap lifts by 0.1 (exponential, τ = 180 ms, settles in about 600 ms); a teal glow fades in.
  A `role=status` chip "Listening… Esc to close" fades up 6 px in 220 ms.
- `prefers-reduced-motion: reduce`: holds one still pose (τ = 2.2) and opens or closes instantly.
- No WebGL2: a CSS gradient disc in the same palette.
Evidence: .reanimate/orb-presence/additions-click (sheet), additions-focus/final.png, additions-reduced (0 change between frames).
