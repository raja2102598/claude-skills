# model-stats: reanimate report (speed mode, 2 rounds)

**Status: frame compare fails under load — needs a re-check on a quieter machine.** The swap timing passes on an rAF probe (83 ms reference vs 80 ms clone constant), but the clone was not re-probed after the fix.

**Cloned:** the Arc UI "Model card" (https://uiarc.dev/components/model-card). It has a model tab switcher with Reload, an identity header with a Compare switch, capability chips, context limits with a bar, prices plus a monthly-volume slider with a rolling cost estimate, benchmark bars with tabs, a copy-id footer, a compare table and a loading skeleton.

**Fidelity:** motion-faithful (paid Pro component). Own palette, DM Sans and JetBrains Mono, fictional models (Nova 2, Atlas Mini, Orbit 3 Sol, Quill 1 Argon), lucide icons.

**Code:** `src/clones/model-stats/` (`index.tsx`, `model.ts`, `model-stats.css`, `meta.ts`). `meta.stage` is 640x806. Autoplay runs on mount (switch to Atlas Mini, drag the volume slider, change benchmark tab, toggle Compare, switch rival, reload, back to Nova 2); any pointer, key or wheel input stops it, and `?autoplay=0` turns it off. Triggers: `[data-t=seg-atlas]`, `[data-t=compare]`, `[data-t=reload]`, `[data-t=volume]`.

**Capture setup:**
- Both sides: real clock (`--clock virtual` crashed Chromium on the reference page at load average about 60), viewport 1440x1400, 20 fps, 2200 ms, click on the second model tab, 6 s wait before.
- Reference: `--clip 394,452,640,806`.
- Clone: `--selector "[data-stage]"` with `?autoplay=0`.
- Frames are 640x806 on both sides.
- Last compare: `compare-4` (`--offset -7`, aligned on the swap event).

**Fixes in round 2:**
- **Stage and alignment:** the clone stage is now 640x806 (was 720x880) and the card 748 px, so the card is full-width in the crop on both sides.
- **Model-switch latency:** the reference swaps content about 83 ms after the click, with the fade-out starting at 1 ms. The clone's earlier "800 ms lookup" was click latency misread from a capture; `LOOKUP_MS` is now 80.

**Last compare round (`compare-4`):**

| measure | result |
|---|---|
| frames compared | 40 of 47 |
| mean mismatch | 11.30 % (threshold 5 %) |
| timing error from `compare.ts` (start / end / duration / peak) | +1.10 s / −0.35 s / −1.45 s / +1.10 s |
| pass | FAIL on both |

Sheet: `compare-4/sheets/compare-01.webp`.

**Why those numbers are unreliable:**
- The video is jerky under load, so the reference activity curve shows events only at frames 12, 24 and 41–42.
- The clone shows one swap event at frames 34–35.
- Click and trigger latency also differs between captures, so `compare.ts` auto-align and offset are arbitrary. This is why the timing row fails.
- The 11 % mismatch is flat across all frames, also before the swap. The cause is different fonts, layout positions and copy, not motion.

**Per-event timing, from a real-clock rAF and MutationObserver probe on both pages:**

| event | reference | clone |
|---|---|---|
| fade starts after click | 1 ms | 846 ms before the fix; about 1 ms expected after the `LOOKUP_MS` fix (not re-probed) |
| model name text changes | 83 ms | 818 ms before the fix; 80 ms by constant after (not re-probed) |
| fade complete | not measured | about 200 ms after the swap |

Other probed timings (`getAnimations()` on the reference, clone CSS set to the same values):
- field swap out: 100 ms quint-out (0.22,1,0.36,1).
- field swap in: 150 ms, delay 40 ms, same easing.
- Compare switch track: 200 ms.
- segmented control colour: 150 ms.
- skeleton pulse: 1400 ms ease-in-out, opacity 1 / .55 / 1.

**Residual deviations:**
1. Mean mismatch of 11.3 % is not a motion measurement here. It comes from palette, fonts, copy and layout, which differ by design.
2. Timing from the frame compare fails (+1.1 s start) because of dropped video frames and click-latency jitter under load 60. The clone was not re-probed after the latency fix.
3. In the reference, frames at 0.60 s and 1.20 s show activity that was not attributed to a particular event. The 2.05 s activity looks like the swap itself.
4. The rolling cost number is a whole-value cubic-out tween over 420 ms, not per-digit.
5. Benchmark re-rank uses translateY at 480 ms and bar widths at 640 ms. These were not measured on the reference.
6. The Reload skeleton and slider drag were not captured on the reference.
