# model-stats: reanimate report (verified on a quieter machine, load ~5-6)

**Cloned:** the Arc UI "Model card" (https://uiarc.dev/components/model-card). It has a model tab switcher with Reload, an identity header with a Compare switch, capability chips, context limits with a bar, prices plus a monthly-volume slider with a rolling cost estimate, benchmark bars with tabs, a copy-id footer, a compare table and a loading skeleton.

**Fidelity:** motion-faithful (paid Pro component). Own palette, DM Sans and JetBrains Mono, fictional models (Nova 2, Atlas Mini, Orbit 3 Sol, Quill 1 Argon), lucide icons.

**Code:** `src/clones/model-stats/` (`index.tsx`, `model.ts`, `model-stats.css`, `meta.ts`). `meta.stage` is 640x806. Autoplay runs on mount; any pointer, key or wheel input stops it, and `?autoplay=0` turns it off. Triggers: `[data-t=seg-atlas]`, `[data-t=compare]`, `[data-t=reload]`, `[data-t=volume]`.

**Capture setup (both sides identical):**
- Viewport 1440x1400, `--clock virtual`, 25 fps, 2200 ms, `--wait-before 6000`, 200 ms pre-roll, click the second model tab. Frames are 640x806.
- Reference (`ref-v`): `--clip 394,452,640,806`, trigger `[class*=model-card_controls] button:nth-of-type(2)`. Its first virtual-clock attempt hung and was killed at 300 s; the single retry worked, so no real-clock fallback was needed.
- Clone: `--selector "[data-stage]"`, `?autoplay=0`, trigger `[data-t=seg-atlas]`.
- `compare.ts` runs with a fixed `--offset 0`. Auto-align picked offset 8 on an earlier round and produced misleading numbers.

**Fixes in this verification:**
- `LOOKUP_MS` 80 -> 40 -> 25 (swap lands on frame 0.24 s like the reference).
- The cost tween was refit from 420 to 240 ms, and its state was lifted above the `Swap` (see "Rolling cost" below), because it remounted at each swap and jumped instead of rolling.

**Final compare (`compare-10`, clone-v5 vs ref-v, 61 of 61 frames, `--offset 0`):**

| measure | result |
|---|---|
| mean mismatch | 7.70 % (threshold 5 %) FAIL. It is 8.2 % flat before the click and 6-8 % after. See deviation 1. |
| motion window | reference frames 6-7 (peak #6); clone frames 6-9 (peak #6) |
| timing error (start / end / duration / peak) | 0 s / +0.08 s / +0.08 s / 0 s. PASS (limit 0.08 s). |

The earlier compares `compare-6` (clone-v1, `LOOKUP_MS` 80) read start +0.04 s, end +0.12 s, duration +0.08 s, mismatch 7.72 %. `compare-7` (`LOOKUP_MS` 40), `compare-8` (clone-v3) and `compare-9` (cost fix, `LOOKUP_MS` 40) read 7.71 % with 0 / +0.08 / +0.08 / 0 s.

**Reference activity curve, virtual clock, per-frame pixel diff:**
- Frames 6 and 7 (0.24 s and 0.28 s) hold the swap burst: about 8.8k and 5.7k changed pixels. The click lands at 0.20 s, so the swap is about 40-80 ms after the click.
- Frames 8-11 (0.32-0.44 s) are small, 0.2-0.8k pixels, in the price, cost and benchmark area. These are the rolling cost number and the bar re-rank.
- Nothing else happens until 2.4 s except a 7x10 px blink at about (263,385).
- The earlier unexplained bursts at 0.60 s and 1.20 s do not exist on the virtual clock. They were duplicated and caught-up video frames from the overloaded real-clock capture, not real events.

**Clone activity (clone-v5):** the swap burst runs frames 6-8 (46k / 29k / 23k pixels, fade plus new content), then 7.7k at frame 9, then 0.4-0.7k at frames 10-12 for the number settling. It is quiet after frame 12.

**Rolling cost, fraction of the way to the final value (click at 0.20 s):**

| t (s) | reference ($1,000 to $600) | clone ($1,000 to $313) |
|---|---|---|
| 0.20 | 0 | 0 |
| 0.24 | 0.43 | 0 (old content starts fading) |
| 0.28 | not read | 0.36 |
| 0.32 | 0.90 | 0.72 |
| 0.36 | not read | 0.86 |
| 0.40 | 0.98 | 0.95 |
| 0.44 | not read | 0.995 |
| 0.48 | 1.0 | 1.0 |

The clone is a cubic-out roll that settles by 0.44-0.48 s, like the reference. It starts about one frame (40 ms) later.

**Per-event times, real-clock rAF and MutationObserver probe (ms after an in-page click; repeated runs jitter by 15-60 ms under load):**

| event | reference | clone |
|---|---|---|
| new content inserted (name text changes) | 34 and 51 ms (two runs) | 63 and 122 ms with `LOOKUP_MS` 40; not re-probed with 25 |
| old fields start fading out (100 ms, quint-out) | 72 ms | about 4 ms after the swap |
| old content removed | 123 and 195 ms | 190 and 247 ms with `LOOKUP_MS` 40 |
| compare-table cells fade (150 ms) | 59-198 ms | not applicable |

The frame compare, which is exact on the virtual clock, puts the swap at 0.24 s on both sides with `LOOKUP_MS` 25.

**Easing and duration per row** (reference from `getAnimations()`; clone from CSS):

| row | reference | clone | match |
|---|---|---|---|
| field swap out | 100 ms, cubic-bezier(.22,1,.36,1), opacity | 100 ms, same curve | yes |
| field swap in | 150 ms, same easing | 150 ms with 40 ms delay, same curve, plus translateY(3px) | yes |
| compare-table cells | 150 ms, same easing | not separately built | n/a |
| label text | 150 ms (same curve) and 200 ms (cubic-bezier(.16,1,.3,1)) | covered by the field swap | approximate |
| segmented control colour | 150 ms | 150 ms | yes |
| segmented pill | not seen as a WAAPI animation (CSS transition or instant) | 260 ms transform and width | unmeasured |
| compare switch track | 200 ms | 200 ms | yes |
| skeleton pulse | 1400 ms ease-in-out, 1 / .55 / 1 | same | yes |
| rolling cost | cubic-out, about 230 ms (fit from frames) | 240 ms cubic-out, state above the swap | yes, starts one frame late |
| benchmark bars and re-rank | not measured | 640 ms width, 480 ms translateY | unmeasured |

**Pass or fail per spec row:**
- Trigger, sequence and swap timing: PASS.
- Fade easings: PASS, with the caveat in deviation 2.
- Rolling cost: PASS (settles 0.44-0.48 s, cubic-out).

**Residual deviations:**
1. Mean mismatch of 7.7 % is mostly design and not motion. The 8.2 % flat before the click comes from different fonts, palette, fictional copy and layout (for example "Claude Opus 5.5 / Sonnet 5.5" against "Nova 2 / Atlas Mini", a different header icon and different benchmark rows). A motion-faithful clone is not expected to reach 5 %.
2. The reference's WAAPI fades collapse to an instant swap on the virtual clock, but the clone's CSS keyframes keep running. The clone therefore shows about 0.08 s of fade (frames 7-9) that the reference's virtual capture does not. On the real clock both fade for about 100 ms out and 150 ms in. This is a capture artefact, within the 80 ms tolerance (+0.08 s end).
3. The real-clock swap probe was 63-122 ms on the clone against 34-51 ms on the reference when `LOOKUP_MS` was 40. It is now 25 on the frame compare (swap at 0.24 s, same frame as the reference). It has not been re-probed on the real clock.
4. (Resolved.) The cost number no longer remounts; it rolls cubic-out over 240 ms and settles at 0.44-0.48 s. The remaining difference is the roll starting about one frame (40 ms) later and being about 0.18 behind at 0.32 s. The clone's final value ($313) differs from the reference's ($600) because the model data is fictional.
5. Benchmark re-rank (translateY 480 ms, width 640 ms), the segmented pill (260 ms), the Reload skeleton and the slider drag were not measured on the reference.

Sheet: `compare-10/sheets/compare-01.webp`.
