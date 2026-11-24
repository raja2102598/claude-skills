# prompt-enhancer: report (round 4, virtual clock both sides)

**Fidelity:** motion-faithful. Reference: UIStacks "Prompt enhancer" (https://uistacks.dev/components/prompt-enhancer; UIStacks Pro, paid, code gated), clip 440,520,560,420 at viewport 1440x1400. Clone: `/c/prompt-enhancer`, `[data-stage]` 560x420 on `#f4f4f4`.

**Code:** `src/clones/prompt-enhancer/` (`index.tsx`, `prompt-enhancer.css`, `meta.ts`). Plays on mount and loops.

**Cloned:** a prompt card that runs this sequence:
- Placeholder, then the prompt is typed at 17 ms/char.
- Improve is pressed and shows "Improving" with a dotted spinner while a light runs clockwise round the card edge.
- The rewrite streams in word by word (40 ms/word) with the added words marked.
- "What changed" chips stagger in and Use turns dark.
- Use is pressed, the card flashes empty and then shows the new prompt with "51 words".
- The demo resets at 10.9 s and loops with a 12.1 s period (first run is shorter: 0.9 s of placeholder instead of 2.0 s, as in the reference).

**Own content:** neutral greys with a violet accent, Figtree, lucide icons, fictional shop copy ("Hearth Row"); a CSS-drawn dotted spinner replaces the reference's.

## Capture
Both sides: `--clock virtual`, viewport 1440x1400, 5 fps, 16 s, `--pre-roll 0`. compare.ts used `--offset 0 --pixel-threshold 0.2 --blur 3`. The clone is driven by one JS clock (an interval of about 16 ms) with CSS keyframes for entrances and the edge light, so WAAPI is not involved.

## Compare result (compare-4)
- Frames compared: 81/81.
- Mean mismatch: **0.37 %** blurred by 3 px (threshold 5 %) → PASS; sharp 2.11 %.
- Worst frames: 2.4 % (5.8 s), 2.2 % (5.4 s), 2.1 % (4.8 s), all during streaming, where the text wraps slightly differently.
- compare.ts timing error: start 0 s, end 0 s, duration 0 s, peak 0 s → PASS (limit 0.08 s). Every active frame matches the reference's burst frames (5 fps resolution, 0.2 s).

Sheet: `compare-4/sheets/compare-01.webp`.

## Per-event times (activity bursts, reference = clone)

| Event | Time |
|---|---|
| Typing starts | 1.0 s (first run), 13.0 s (second) |
| Improve pressed and edge light starts | about 2.4 s (14.4 s) |
| Stream starts, Improve disabled | 3.6 s (15.6 s) |
| Stream bursts (word groups, card growth) | 3.6 to 5.8 s |
| Chips in, Use enabled | 5.8 to 6.0 s |
| Use pressed, blank flash | 8.2 s |
| Old text for a frame, then new text and word count | 8.4 s, 8.6 s |
| Reset to placeholder | 11.0 s |
| False start "Write a p" for one frame | 11.8 s (reset again at 12.0 s) |

All bursts are accounted for. The one-frame blank at 8.2 s and the false start at 11.8 s are replicated deliberately. Frame 41 (8.2 s) is the largest burst (full card swap).

## Row pass/fail

| Spec row | Result |
|---|---|
| Sequence (typing, improving, stream, chips, use, new prompt, reset) | pass |
| Timings within one frame (0.2 s) | pass (compare.ts reports 0 s error) |
| Typing and stream rates | pass by eye (17 ms/char, 40 ms/word), not measured numerically |
| Edge light direction and start (bottom, clockwise, about 2.4 s period) | approximate; position matches on sampled frames, period estimated |
| Mean mismatch ≤ 5 % | pass, 0.37 % |

## Residual deviations
- The edge light period (2.4 s) and its fade-out are estimated from sparse 5 fps frames, so the exact lap position can differ by tens of degrees.
- Copy differs (the final text is about one line longer in the clone), so streaming frames wrap differently (about 2 % sharp mismatch).
- The spinner glyph is a CSS 3x3 dot grid, not the reference's.
- The Improve pill and result box are within 2 px of the reference; the reference's faint shadow strip at the top of the crop is page chrome and not cloned.
- A one-frame mount burst appeared in the clone at 0.2 s in rounds 1 and 3, as the web font loads. It was absent in round 4 and is not stable.
- 5 fps capture, so timing resolution is ±0.2 s. A higher fps on a quieter machine would tighten it.
- Rounds: 4 (one over the speed-mode cap).
