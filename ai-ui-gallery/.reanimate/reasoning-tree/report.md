# reasoning-tree: reanimate report

**Fidelity: motion-faithful.** The reference is Arc UI "Reasoning tree" (https://uiarc.dev/components/reasoning-tree, Pro, paid). Cloned the whole preview card (667x539), with nothing added. **Status: partial pass** — every depth's events match, but the end-of-run tail does not (see Final compare).

**Behaviour:**
- **Run:** it starts on mount and plays the full sequence. The ref's Ready to Reading step is a play icon for about 0.9 s, which the clone does not reproduce.
- **Reading:** reading starts at 1.0 s.
- **Per depth:**
  - **Propose:** nodes fade and slide in from -8 px (320 ms, `cubic-bezier(.22,1,.36,1)`, 60 ms stagger) while their edges draw in (420 ms).
  - **Score:** a rough value (about 45 % of final) appears, then the final value. Bars scale in 640 ms with the same easing and a 20 ms stagger. Numbers count up through an `@property --rt-n` integer counter on the same 640 ms tween.
  - **Keep:** the top N of the level stay and turn blue. The rest fade to 42 %, and a "k of n kept" label appears.
- **Answer:** at depth 3 the best node turns green, the other depth-3 nodes fade, the path to the question turns blue, and "Answer found" shows a check.
- **Controls:**
  - **Play/pause, Step, Reset:** these work and use a rAF-driven clock that can pause and step.
  - **Beam width 1/2/3:** it restarts the run with a spring-sliding pill. The tree data has 3 depth-1 nodes with 2 children each, so every beam width works.
- **Layout:** columns at x 20/167/337/506, widths 119/140/140/140, and a 62 px pitch with children centred on their parent.
- **Reduced motion:** transitions and the shimmer are turned off.

Own palette, copy, Geist, lucide icons and a fictional model name ("Nova 2"). No source, CSS, SVG or text from the site was used.

**Code:** `src/clones/reasoning-tree/` (`index.tsx`, `data.ts`, `reasoning-tree.css`, `meta.ts`).

**Triggers:** plays on load. Play is `[data-rt-play]`, beam buttons are `[data-rt-beam=N]`, and the status text is `[data-rt-status]`.

**Method:**
- **Capture settings:** the reference page was recorded on the real clock (viewport 1440x1100, clip 380,412,667,539, 10 fps, 22 s). The clone was recorded with `--clock virtual`, `--selector [data-stage]`, 10 fps and 12.5 s. The reference frames from the card's mount (frame 74 onward) were renumbered, and the compare used `--offset 0`.
- **Animation type:** the ref's animations are CSS transitions (the bar `transform` and the `--rt-n` counter, both 640 ms with delays of 0 and 20 ms), so the virtual clock handles them. The clone uses CSS transitions too, so there is no WAAPI trap.
- **Event times:** these come from the activity bursts in the compare report.

**Rounds** (4, one over the 3-round cap):
1. Clone-1 (compared by eye on the sheets): the autoplay timer made the clone about 1 s late.
2. Clone-2: the autoplay timer was removed. The depth-2 and depth-3 event times were still off by up to 1.1 s (the answer came 1.1 s early).
3. Clone-3: event times were re-read from the reference's activity bursts, and the two-stage scoring (rough value, then final) was added.
4. Clone-4: the winning-path edges got a 700 ms, staggered draw to mimic the ref's slow highlight. This changed no measured number.

**Final compare (compare-4, 126 frames, offset 0):**

| item | ref to clone | result |
|---|---|---|
| mean frame mismatch | 3.34 % (limit 5 %; from copy, font, palette) | pass |
| start timing | 0.00 s | pass |
| end of motion | ref 12.2 s, clone 11.7 s: -0.5 s | **fail** (limit 0.08 s) |
| peak timing | ref #10, clone #1: -0.9 s | fail (artifact, see below) |
| depth-1 propose / score / fill / keep | bursts at frames 27-30 / 33 / 39-41 / 43-44 on both | pass (within 1 frame, 100 ms) |
| depth-2 propose / score / fill / keep | 51-53 / 59-60 / 69-71 / 73-76 in the ref, 53-56 / 60-62 / 71-72 / 74-76 in the clone | pass (within about 1-2 frames) |
| depth-3 propose / score / fill | ref 86-91 / 94-96 / 99-105, clone 87-91 / 95-98 / 100-103 | pass (within about 1 frame) |
| answer | ref bursts 114-122, clone 115-118 | tail **fail** |
| bar and number tween (640 ms, `cubic-bezier(.22,1,.36,1)`) | same durations and easing, from `inspect.json` | pass (not probed) |
| status shimmer | the ref's 1800 ms linear, `backgroundPositionX` 100 % to 0 is matched exactly | pass |

Sheet: `compare-4/sheets/compare-01.webp`.

**Residual deviations:**
- **End and tail, -0.5 s:** the ref keeps changing for about 0.5 s after "Answer found" (frames 117-122). What moves there was not identified, so it was not matched. It is probably a slower multi-step path highlight, but that is a guess.
- **Peak, -0.9 s:** the ref's peak is the "Reading" label and controls change at frame 10. The clone's peak is the card fade-in at frame 1. The clone has no equivalent motion at frame 10, because it has no Ready state with a play icon before autoplay starts.
- **Interim score values:** the ref's scoring numbers wobble to arbitrary values (for example 0.43 against a final 0.86), and its depth-3 scores differ between runs (Ship Thursday 0.90 or 0.78). The clone uses a fixed 45 % interim and fixed final scores.
- **Not measured:** node fade and edge-draw easings were set by eye and are not verified against the ref. Pause, step, reset and beam widths 1 and 3 were not captured or compared.
- **Reference on the real clock, clone on the virtual clock:** the two captures used different clocks, so sub-frame timing comparisons are approximate.
- **Copy and palette:** the pixel mismatch (3.3 %) comes from own copy, font rendering and palette.
