# typing-indicator: motion spec

- **Target**: Wensity "AI Typing Indicator" (`ui.wensity.com/components/ai-typing-indicator`), the **Typing** cell of the
  live preview: the dark chat bubble with three dots (crop 595,548 160x96 at 1440x900, scrollY 0). The preview's other
  cells (Thinking step label, "Writing a reply" letter wave, Working matrix) are out of scope: the concept is typing dots,
  and the thinking line is its own concept in this gallery.
- **Destination**: `src/clones/typing-indicator/` (React 19 + TS, Tailwind v4; the loop is clone-local CSS keyframes,
  no `motion` needed), rendered alone at `/c/typing-indicator`.
- **Fidelity**: motion-faithful. Wensity marks the component "Pro" and sells the code behind Wensity Pro; no open-source
  license found, so original palette and markup, same trigger, timing, stagger, easing and proportions.

## Capture

Both sides: `capture.ts --viewport 1440x900 --trigger none --duration 4000 --fps 25 --clock virtual` (CSS keyframes
follow the virtual clock), `--pre-js` that seeks every `*dot*` animation to `currentTime = 2640` (two periods) and
resumes it, so frame 0 of both captures is the same loop phase (dot 1 at the start of its rise). Reference crop
`--clip 595,548,160,96`; clone crop `--clip` of `[data-stage]` (160x96, same size). Track: the three dots
(`:nth-child(1..3)`), every rAF.

## Source of the numbers

`inspect.json › animations` (`ati-dot`, three CSS animations) and `ref/track.json` (per-rAF translateY/opacity).

## Rows

| # | element | property | trigger | start | duration | delay / stagger | from → to | easing | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | dot 1 | translateY | mount, infinite loop | 0 | 1320 ms period | 0 | 0 → −4.48 px (0.28 em) at 28 % (369.6 ms) → 0 at 56 % (739.2 ms) → hold 0 to 100 % | each segment cubic-bezier(0.45, 0, 0.55, 1) (in-out sine family), no overshoot | track: peak −4.48 at +370 ms, back to 0 at +740 ms |
| 2 | dot 1 | opacity | same | 0 | 1320 ms | 0 | 0.32 → 1 (28 %) → 0.32 (56 %) → hold | same per segment | moves with row 1 |
| 3 | dot 2 | translateY + opacity | same | +160 ms | 1320 ms | 160 ms after dot 1 | as rows 1–2 | same | track peak at +330 ms |
| 4 | dot 3 | translateY + opacity | same | +320 ms | 1320 ms | 320 ms after dot 1 | as rows 1–2 | same | track peak at +490 ms |
| 5 | wave | loop | – | – | period 1320 ms; all three at rest for 1320 − 739 − 320 = 261 ms per loop | – | – | – | – |
| 6 | bubble | static | – | – | – | – | – | – | 67.81 x 44.78, padding 14.4 / 16.8 px (0.9 / 1.05 em), radius 22.4 px with a 7.2 px bottom-left "tail" corner |
| 7 | dots | static | – | – | – | – | – | – | 8 px circles (0.5 em), gap 5.12 px (0.32 em), pitch 13.11 px, centred in a 16 px row; at rest they sit 18.35 px below the bubble top |

Static palette of the reference (dark preview): page #000, bubble rgb(24,24,27), dots zinc-400 at the animated opacity.
The clone keeps the proportions and uses its own colours (see Additions/Style).

## Style (clone, original)

Stage #0b0d12, bubble #1b2130 with a 1 px inner hairline, dots #a9b4c8. Same geometry in em at 16 px.

## Additions

- Reduced motion: dots static at opacity 0.55, no lift.
- `role="status"` with an accessible label "Assistant is typing".
- Mount state: the dots use `animation-fill-mode: backwards`, so dots 2 and 3 show the rest pose (0.32) during their
  160 / 320 ms start delay. The reference shows them at full opacity for that first delay (no fill), a one-off flash
  on mount that the clone leaves out.
