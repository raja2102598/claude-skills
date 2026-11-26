# prompt-mini — reanimate report

**Clone**: `src/clones/prompt-mini/` (`index.tsx`, `meta.ts`, `prompt-mini.css`), rendered alone at `/c/prompt-mini` on a 393x356 stage, background `#0f1013`, dark.
**Reference**: beUI Pro "Prompt input" (mobile), https://pro.beui.dev/components/mobile/prompt-input. The live preview is a looping phone video (600x1304, 60 fps, 12.68 s), kept out of git. The crop is `0,760,600,544` (the foot of the screen), scaled to 393 px wide. That width is the phone's size in points, at 1.527 video pixels per point.
**Fidelity**: motion-faithful. beUI Pro is a paid catalog with no open-source license. The clone uses:
- its own graphite and violet palette;
- Geist, loaded from Google Fonts;
- lucide icons;
- its own copy, with "Nova 2" as the model name;
- a hand-drawn SVG lake in place of the reference's photo.

No beUI source, CSS or media was copied.

**What was cloned**: the whole phone-composer story, played on load and repeated every 12.28 s.
1. A one-line pill: + / "Write or hold to speak" / mic / voice button.
2. Tapping + opens the pill into a card with a photo tile. The card grows upward with an ease-out-expo curve (about 215 ms).
3. The tile fades and scales in, an upload ring fills in steps (8 → 35 → 65 → 100 %), the photo appears, and the ring and dim layer fade out. Send lights up.
4. The mic is pressed (scale 0.9) and recording starts. The + and model chip cut out, the placeholder cross-fades to a recording row (pulsing dot, timer, 36-column waveform), × fades in, and arrow becomes check. Twelve bars stream in from the right every 83 ms and the timer ticks 0:01, 0:02.
5. The transcript arrives. The text fades in quickly, the recording row fades out, the card grows one line, and check becomes arrow.
6. Send: the card folds back into the pill. The photo tile shrinks to nothing at the card top, and the primary button becomes a stop button with the mic hidden.
7. The reply finishes: the mic returns and stop cross-fades back to the voice icon.

**Additions**: none to the motion. Real interaction is wired, and any trusted pointer or key input ends the demo and finishes whatever the demo left half-done:
- + attaches a photo, with a simulated upload (checked by hand).
- The mic and the voice button record, with a live waveform and timer. × discards; check transcribes.
- Typing enables Send, and Enter sends. Stop ends the reply.
- The model chip cycles its effort level. A tap outside an empty card collapses it.
- `?autoplay=0` disables the demo.

Only + was tested by hand; the other controls are untested.

**Trigger**: page load (the demo starts at mount). Demo time T = video time − 400 ms.
**Rounds**: 3 (speed-mode cap).
- **Round 1:** Tailwind's preflight `box-sizing: border-box` made the card 14 px short in every state.
- **Round 2:** heights matched within 1–2 px, but the cross-fades ran 15–35 ms late or slow.
- **Round 3:** cross-fades re-timed per element from the 60 fps reference; tile entrance delayed 30 ms; a separate send-ready step added; the second ring step moved earlier.

**Measurement note:** the reference is a video, so timings come from its frames; there were no `getAnimations()` values. The clone uses CSS for opacity and transform and runs height on a motion value, so the virtual-clock WAAPI trap does not apply.

## Verification, final round (3)

Virtual clock, 30 fps, 368 frames, clone offset +1 frame. The offset came from matching the card's top edge frame by frame, with a mean error of 0.26 px.

| metric | value | result |
|---|---|---|
| timing error start / end / duration / peak | −0.033 / +0.033 / +0.067 / 0.000 s | pass (limit 0.08 s) |
| motion window ref → clone | frames 75–258 → 74–259, peak #208 → #208 | pass |
| mean mismatch | 3.21 % (worst frame 7.1 % at 6.97 s, the transcript cross-fade) | trend only (palette, font, copy and artwork differ on purpose) |

Sheet: `compare-3/sheets/compare-01.webp` (reference │ clone │ diff, every 15th frame from 2.5 s to 11 s).

**Spec rows.** "t½" is the time a region's change crosses 50 %, measured on the shared 30 fps grid. "mean |Δ|" is the gap between the two normalised curves.

| # | row | ref t½ (ms) | clone t½ (ms) | err (ms) | mean \|Δ\| | easing | result |
|---|---|---|---|---|---|---|---|
| 1 | card height, pill → card (57 → 174 px) | – | – | ≈0 | 0.2 %, max 1 px | expo-out ≈215 ms, same | pass |
| 3 | tile fade/scale in | 2541 | 2539 | −2 | 2.7 % | ease-out | pass |
| 4 | ring steps 35 / 65 / 100 % | 2881 / 3285 / 3762 | 2886 / 3274 / 3751 | +6 / −11 / −11 | 5.6 / 3.2 / 4.9 % | ease-out | pass |
| 5 | photo appears (cut) | 2883 | 2884 | +1 | 1.2 % | cut | pass |
| 6 | send lights up (cut) | 3750 | 3750 | 0 | 0.0 % | cut | pass |
| 7 | ring and dim layer fade | 4014 | 4025 | +12 | 5.5 % | expo-out | pass |
| 8 | mic press, scale 0.9 | 4406 | 4396 | −10 | 2.0 % | `ease` 150 ms | pass |
| 9–10 | + and chip out, mic tint (cut) | 4605 | 4607 | +2 | – | cut | pass |
| 11 | placeholder → recording row | 4686 | 4698 | +12 | 2.3 % | ease-out | pass |
| 12 | × fade-in | 4605 | 4607 | +2 | 24 % (region artefact, see below) | ease-out | pass |
| 13 | arrow → check | 4666 | 4681 | +15 | 2.6 % | ease-out | pass |
| 14 | 12 bars every 83.3 ms | – | – | ±33 on 4 of 12 bars | count equal on 70 of 75 frames | ease-out grow | pass |
| 15 | timer 0:01 / 0:02 | 5649 / 6651 | 5648 / 6650 | −1 / −1 | 1.7 / 1.3 % | cut | pass |
| 16 | dot pulse, peaks / troughs | 4.82, 5.28–5.32, 5.85, 6.45 s | 4.82, 5.32, 5.85–5.88, 6.42 s | ≤33 | 16 of 228 levels (7 %) | ease-in-out | pass |
| 17 | card height +1 line (174 → 194/195) | – | – | ≈0 | 5.0 %, max 2 px | expo-out | pass |
| 18 | recording row → transcript | 6919 | 6924 | +5 | 1.9 % | ease-out | pass |
| 19 | check → arrow | 6949 | 6963 | +14 | 3.0 % | ease-out | pass |
| 20 | mic tint off, scale back | 6922 | 6928 | +6 | 2.6 % | ease-out | pass |
| 21 | card height, card → pill (194 → 57) | – | – | +13 | 3.3 %, max 27 px on one frame | expo-out | pass |
| 22 | pill content swap (cut) | 8450 | 8450 | 0 | 0.0 % | cut | pass |
| 23 | tile shrinks out | – | – | within 1 frame | read from the sheets | expo-out | pass |
| 24 | mic returns (cut) | 10650 | 10650 | 0 | 0.0 % | cut | pass |
| 25 | stop → voice icon | 10699 | 10688 | −10 | 3.9 % | ease-out | pass |

## Residual deviations

- **Collapse starts about 13 ms late.** The send step fires on the first 60 Hz frame after T = 8454. At one 30 fps frame the card is 27 px behind (progress 0.42 against 0.61). Mean |Δ| over the collapse is 3.3 %.
- **Transcript card is 1 px taller** (195 against 194 px). The clone grows by its 21 px line height; the reference grows by about 20.3 px.
- **Recording row fades out about one 30 fps frame slower** when the transcript arrives. The reference fades its timer and bars at different speeds; the clone fades the row as one 150 ms layer. Frame 209 still shows 12 faint bars against 9.
- **× fade-in reads 24 % mean |Δ|** because of how it is measured: the region starts with the + button, which cuts out, so the curve passes 1 on both sides. The midpoint error is +2 ms.
- **Four of the twelve waveform bars land one frame (33 ms) off.** The reference's bars land every 83.3 ms; the clone's steps can only fire on 60 Hz animation frames.
- **Record-dot pulse differs by 7 %** in red level (16 of 228); peaks and troughs are within 33 ms.
- **Pixel differences are deliberate:** colours, font, copy and artwork, which give the 3.21 % mean mismatch. The text is Geist 16 px against the reference's system sans.
- **Two reference flickers are not reproduced:** a one-frame re-render of the text at v = 8.333 s and the loop seam at v = 12.5 s. Neither is motion.
