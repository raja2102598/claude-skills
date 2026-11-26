# voice-input: reanimate report

**Fidelity:** motion-faithful. The reference is UIStacks "Voice prompt" (https://uistacks.dev/components/voice-prompt), a Pro component: "Get Pro · $159" and the install needs a license key. There is no open-source licence.
**What was cloned:** the preview's talk bar in the default "Studio" look, with its autoplay demo loop. One loop runs:
idle → tap → listening (mic turns dark, label swaps, Cancel grows in, a beam circles the bar, 13 bars animate, a timer runs) → a word every 250 ms, blur-fading into a bubble that grows above the bar (Send grows in with the first word) → send → the assistant speaks (audio-lines icon, Send and the beam leave) → reset (bubble and Cancel collapse, bars turn back into dots, the reply appears in the hint for 3.75 s) → the loop repeats every 12 s.
**Original styling:** warm paper palette, an ember-coloured beam, Instrument Sans, lucide icons, and our own copy. The assistant is "Nova"; the transcript is "Push the quarterly planning review to Friday and remind Priya to bring the onboarding drafts".
**Additions:** real taps work as well. Mic in idle starts listening; X discards; the arrow sends (so does the mic while listening); the mic interrupts while Nova speaks. A tap stops the autoplay. The level is a deterministic simulation (per-bar loops); no microphone is ever opened, so nothing about a mic is in the capture. Reduced motion turns the springs, word blur and beam rotation off.

**Code:** `src/clones/voice-input/` (`index.tsx`, `motion-model.ts`, `voice-input.css`, `meta.ts`). `motion-model.ts` holds every measured constant: one spring for all enter, exit and swap motion (stiffness 420, damping 34, mass 1), the demo schedule, and the bar loops. `index.tsx` drives every value from one rAF clock as a pure function of the time since its triggering event. That makes it frame-exact on reanimate's virtual clock and identical on a real one; it uses no `motion` WAAPI. The reference preview renders at `zoom: 0.92` ("Fit"), so the clone renders its 440 px native column at zoom 0.92 in the same place in the 440×216 crop.
**Trigger:** plays on mount. The first listen comes 1.0 s after mount, which lines up with the reference capture's first listen.

**Captures:** both sides were captured at viewport 1440×1100, crop 440×216 (reference `--clip 500,560,440,216`, clone `--selector "[data-stage]"`), `--clock virtual --fps 20 --duration 13000 --wait-before 800 --trigger none`. Reference animation data came from `document.getAnimations()` and a real-clock track; raw captures stay out of git.

## Final round (3): compare

- compare.ts: 265/265 frames at offset 0 (the track timings show the alignment is 0). Mean mismatch is **2.49 %** (PASS at 5 %). The worst frame is 4.5 % at 5.15 s.
- compare.ts activity curve: start 0 s, peak +0.05 s, end +0.70 s. That is a FAIL by the tool, but it is an artifact; see residual deviation 2.

Sheet: `compare-3/sheets/compare-01.webp`.

| # | Row | Reference | Clone | Δ / error | Easing | Result |
|---|---|---|---|---|---|---|
| 1 | Loop: listen start, next listen | Cancel first rendered 17 ms, 12 017 ms (12 000 ms period) | 33 ms, 12 033 ms | +17 ms | – | pass |
| 2 | Mic button colour | 150 ms cubic-bezier(0.4,0,0.2,1) (getAnimations) | same law, computed per frame | – | same | pass (by construction, not tracked) |
| 3 | Mic icon swap (scale 1→0.5 / 0.5→1, opacity) | spring curve: 50 % at 70 ms, 90 % at 147 ms | 74 / 151 ms | +4 ms | spring k420 c34 | pass |
| 4 | Title label swap (y ±10, opacity) | y 50 %/90 % at 70/147 ms, opacity 450 ms | 74/151 ms, 450 ms | +4 ms | spring | pass |
| 5/6 | Sub label / timer | instant; 1 s steps (0:05 at speaking, 0:07 before reset) | same | 0 | step | pass |
| 7 | Cancel enter: width 0→29 px (rendered) | 10/50/90 % at 50/100/183 ms | 50/100/183 ms | 0 ms; mean curve error 0.1 % | spring | pass |
| 7b | Cancel enter: opacity / scale 0.6→1 | linear() 50 % at 75 ms, 90 % at 151 ms | 78 / 153 ms | +3 ms | spring | pass |
| 8 | Beam layer fade in / out | 300 ms cubic-bezier(0.25,0.1,0.35,1) | same: 50 % at +98 ms, 90 % at +198 ms | – | same | pass |
| 9 | Beam rotation | 3000 ms per turn, linear, from listen +70 ms | same | – | linear | pass (by construction) |
| 10 | Bars 4–13: peak, trough, loop period | e.g. bar 6: 1.0 / 0.18 / 1233 ms; bar 8: 0.95 / 0.18 / 1483 ms | identical on all ten bars (periods within ±17 ms sampling) | 0 | ease-in-out segments | pass |
| 11 | Word insert times (15 words) | 250·k ms after listen | within 17 ms of every one | max 17 ms | – | pass |
| 11b | Word fade-in (opacity, blur 3→0, y 3→0) | 320 ms ease-out | 320 ms ease-out (50 % at +109 ms) | – | same | pass |
| 11c | Line wrap | words 1–9 on line 1, line 2 from word 10 | same | – | – | pass |
| 12 | Bubble enter: height 0→74 px | 10/50/90 % at 300/350/433 ms | 300/350/433 ms | 0 ms; mean 0.0 % | spring | pass |
| 12b | Bubble enter: opacity / y 6→0 | 50 %/90 % at 75/151 ms; real-clock 50→90 % span 76 ms | 74/151 ms; span 76 ms | ≤1 ms | spring | pass |
| 13 | Bubble second line (74→96 px, instant) | 2517 ms | 2533 ms | +17 ms | step | pass |
| 14 | Send enter: width, opacity, scale | width 300/350/433 ms; real-clock 50→90 % span 76 ms | 300/350/433 ms; span 76 ms | 0 ms; mean 0.1 % | spring | pass |
| 15 | Speaking: Send exit width 29→0 px | 5150/5200/5283 ms | 5150/5200/5283 ms | 0 ms; mean 0.1 % | spring | pass |
| 16 | Reset: bubble height 96→0, Cancel width 29→0 | 7550/7600/7683 ms | 7550/7600/7683 ms | 0 ms; mean 0.1 % | spring | pass |
| 17 | Hint: reply in, then back to default | frames 151 (7.55 s) and 225 (11.25 s) | frames 151 and 226 | 0 / +1 frame (≤17 ms underlying) | instant | pass |

Spring fit to the reference's own sampled `linear()` opacity curve: stiffness 420, damping 34 (ζ 0.83), rmse 0.0001. The same spring explains the JS-driven widths and heights; rows 7, 12, 14, 15 and 16 land on the same millisecond.

## Residual deviations

1. **Event edges are up to 17 ms late** (one 60 Hz tick): listen start 33 vs 17 ms, the second-line jump 2533 vs 2517 ms, and the hint revert one frame later. The clone's clock starts at mount and its events land on rAF ticks. Within ±80 ms.
2. **The compare.ts activity "end" is +0.70 s, and the worst frames are 4.5 % at 5.10–5.25 s.** This is the virtual-clock WAAPI trap, not a real deviation. The reference animates opacity, transform and filter with `motion` (label and icon swaps, Send/Cancel/bubble fades, word blur-in, beam rotation), and on the virtual clock those collapse into one frame. The clone renders them over their measured durations. After 12.5 s the reference's only motion is single-frame word pops, so its activity drops below the detector threshold while the clone's blur-ins and beam keep going. These rows were checked against the reference's `getAnimations()` curves and the real-clock track instead (rows 3, 4, 7b, 8, 11b, 12b and 14 above).
3. **Bar phase at the moment listening starts is not matched frame by frame.** The reference's own phase changes from run to run: two virtual captures had bar 6 at scaleY 0.33 and 0.55 when listening started. Bars are therefore matched on amplitude, trough and period (bars 4–13 are identical). Bars 1–3 could not be tracked on the reference because the selector also matched another element on the page. They use the same formula, with peaks 0.35/0.55/0.45 taken from their `getAnimations()` keyframes.
4. **Beam position per frame is not comparable,** because the reference's WAAPI rotation runs off the virtual clock. Its 3 s linear turn and its 300 ms fade come from `getAnimations()`. The gradient streak is our own (ember, not the reference's blue).
5. **The 2.49 % mean pixel mismatch includes deliberate differences:** palette, font (Instrument Sans instead of Inter) and copy, as motion-faithful requires.
