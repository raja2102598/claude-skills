# prompt-input — reanimate report

**Clone**: `src/clones/prompt-input/` (`index.tsx`, `meta.ts`, `prompt-input.css`), rendered alone at `/c/prompt-input`.
**Reference**: Arc UI "AI composer" block, https://uiarc.dev/components/blocks/ai-composer (crop `section[class*="ai-composer_root"]`, 745x679).
**Fidelity**: motion-faithful. Arc UI Pro is a paid catalog with no open-source license. The clone uses its own warm palette, Instrument Sans and Instrument Serif (Google Fonts), lucide icons, its own copy, and the fictional model "Nova 2". No Arc source, CSS or assets were copied.
**What was cloned**: the full composer lifecycle. It starts from the empty-chat state: greeting, composer with tool chips, model and effort chip, mic and send, then three suggestions. Click Send (or press Enter) and:
- the composer glides to the foot of the thread;
- the prompt becomes a bubble, the model head appears and "Thinking" shimmers;
- the reply streams in fading chunks while the body grows a line at a time;
- Send morphs into Stop, ringed by an arc that fills with the reply;
- at the end the stop turns back into a muted arrow, the copy/Retry foot fades in, and the ring closes and fades.

**Additions**: none to the motion. Interactions wired as in the reference: typing enables Send; Enter sends; Stop ends the reply early; suggestions fill the prompt; "new chat" returns to the greeting. Tool chips toggle.
**Trigger**: the clone autoplays in the gallery (types a sample prompt, sends, waits, starts a new chat, repeats; any pointer or key input ends the demo). `?autoplay=0` disables autoplay, so captures use the same trigger as the reference: textarea filled by pre-js, then a click on Send.
**Rounds**: 6, one over the brief's cap of 5.
- Rounds 1–4 worked against the virtual-clock reference.
- Round 5 added real-clock rAF probes of the reference (`ref-real/`, `ref-real2/`), after the coordinator's notice that the virtual clock does not advance WAAPI. Those probes showed eight opacity/transform rows had collapsed to one frame in the virtual reference.
- Round 6 is the one extra round those re-specified rows needed.

## Verification, final round (6)

### Whole-frame compare (virtual clock, 25 fps, 106 frames, offset 0)

| metric | value | result |
|---|---|---|
| timing error start / end / duration / peak | 0.00 / −0.08 / −0.08 / 0.00 s | pass (limit 0.08 s) |
| motion window ref → clone | frames 5–18 → 5–16, peak #6 → #6 | pass |
| mean mismatch | 2.71 % (max 3.07 %) | trend only (motion-faithful: palette, fonts and copy differ on purpose) |

Sheet: `compare-6/sheets/compare-01.webp` (reference │ clone │ diff, every 2nd frame from 0.16 s). The other sheets stay out of git with the raw captures.

### Spec rows

Virtual-clock probe rows (`ref-probe` vs `clone-6-probe`, 50 fps, ms from the click):

| # | row | ref | clone | err | result |
|---|---|---|---|---|---|
| 1–3 | greeting/suggestions out; bubble, head and "Thinking" in | 17 | 0 | −17 | pass |
| 4 | dock glide easing (easing.ts) | material-emphasized fit 441 ms, within 1 % at 383 ms, 0 % overshoot | same family, fit 460 ms, within 1 % at 400 ms, 0 % overshoot; max \|Δ\| 2.19 px of 263.6 (0.8 %), mean 0.37 px | +17 | pass |
| 13 | "Thinking" removed | 667 | 667 | 0 | pass |
| 14 | reply chunks 1–7 appear | 700, 750 … 1000 | 717, 767 … 1017 | +17 each | pass |
| 15 | body line 2 start / end | 850 / 1183 | 850 / 1167 | 0 / −17 | pass |
| 17 | arc fill, mean \|err\| 40–1040 ms | – | – | 0.006 | pass |
| 12 | "Thinking" shimmer: band-0 onset; darkening at 640 ms | 280 ms; −26 levels | 320 ms; −26 levels | +40 | pass |

Real-clock rows (`ref-real2` vs `clone-6-real`, aligned on the switch frame; t½ = midpoint crossing):

| # | row | ref t½ | clone t½ | err | mean \|Δ\| (% of range) | result |
|---|---|---|---|---|---|---|
| 7 | arrow out: opacity | 118 | 126 | +8 | 2.5 % | pass |
| 7 | arrow out: lift y (while visible) | – | – | – | 1.8 % | pass |
| 8 | stop in: opacity | 65 | 78 | +13 | 2.5 % | pass |
| 8 | stop in: scale | 65 | 93 | +28 | 3.8 % | pass |
| 6 | ring track in | 85 | 93 | +8 | 3.2 % | pass |
| 11 | top-bar fade-in | 265 | 242 | −23 | 2.6 % | pass |
| 4 | dock glide | – | – | – | 0.5 % | pass |
| 17 | arc fill | – | – | – | 1.0 % | pass |
| 18 | foot fade-in | 1082 | 1098 | +16 | 3.3 % | pass |
| 23 | arc fade-out | 1249 | 1226 | −23 | 3.1 % | pass |
| 21 | arrow back: opacity | 1099 | 1098 | 0 | 1.2 % | pass |
| 21 | arrow back: y from +4 px | – | – | – | 1.0 % | pass |
| 20 | stop out: opacity / scale | 1049 / – | 1060 / – | +11 | 0.9 % / 1.6 % | pass |
| 19 | ring track out | 1115 | 1125 | +10 | 0.6 % | pass |

Rows 9, 10 and 22 are button and mic colour transitions. The clone uses the reference's declared transition (150 ms, cubic-bezier(0.22,1,0.36,1)) and the sheets show the same state at each frame. Pass.

All 23 spec rows pass.

## Residual deviations

1. **Virtual-clock frames vs real-clock motion (reference artifact).** In `ref/` and `ref-probe/`, the reference's WAAPI fades are instant: top bar, ring track, arrow/stop opacity, foot, ring and arc fade-outs. The clone fades them the way the real-clock reference does. So the virtual sheets show differences at the send button and top-right corner around 0.24–0.48 s and 1.24–1.40 s, and the virtual probe reports "top bar shown" +217 ms and "foot shown" / "ring hidden" +67 ms. The real-clock rows are the measurement for these rows, and all pass.
2. **Stop-square scale-in midpoint +28 ms** (real clock, 3.8 % mean deviation). motion's spring takes its first step one frame after the commit. The spring constant matches (ω≈24 on both sides).
3. **"Thinking" shimmer onset +40 ms.** It is a soft CSS gradient sweep tuned on pixel darkness, and both sides reach the same darkening by 640 ms. This is also why the whole-frame activity window ends 0.08 s earlier in the clone (the reference's frame-18 activity is the shimmer).
4. **Mean frame mismatch 2.71 %**, flat across the sequence (2.6 % at rest, ~3.1 % with the full reply). The cause is the original palette, fonts (Instrument Sans/Serif vs Inter/Geist), icons and copy, as motion-faithful requires. Layout boxes match: dock 26,559 vs 26,559; bubble y 57 vs 57; body y 147.5 vs 148; foot 20,229.5 vs 20,230.
5. **Reply text** is original copy split into 8 chunks sized so the wraps fall on the same chunks as the reference (line 2 at chunk 4, line 3 at chunk 8). The last line holds a whole chunk instead of starting mid-chunk; timing is unaffected.
6. The arrow-exit lift is scored only while the arrow is visible, because the reference removes the element at ~150 ms, after it reaches opacity 0.

## Implementation notes

- No motion element tweens: everything runs on motion values animated with `animate(value)` (JS frame loop: dock FLIP, glyph morph, ring opacities) or on CSS keyframes (chunks, shimmer, top bar, foot). That behaves the same on the virtual and real clocks. Round 1 used `AnimatePresence` tweens, which motion hands to WAAPI, and they froze under the virtual clock.
- The simulated stream runs on one rAF clock from the click. Its state commits use `flushSync`, so each chunk lands on the frame it is due.
- `prefers-reduced-motion`: no glide, fades or shimmer; states still change in the same order.
- `npx tsc --noEmit` passes. No packages needed.
