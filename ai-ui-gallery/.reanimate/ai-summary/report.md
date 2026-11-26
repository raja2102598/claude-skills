# ai-summary: reanimate report

**Cloned:** Arc UI "AI insight card" (https://uiarc.dev/components/blocks/ai-insight-card), motion-faithful. The block is Pro, has no stated license, and is unverified.
**Added:** a Stop-before-answer message, a `prefers-reduced-motion` path, and `aria-live` plus `aria-expanded`. Manual clicks on Explain, Hide or a chip switch autoplay off.
**Not built:** the ref's chart scrub tooltip and keyboard point reading.
**Trigger:** plays on mount once in view. Explain starts after 1.4 s, then the follow-ups run, then Hide. Explain, Stop, Hide and the chips are all clickable.

## Rounds (cap of 3 reached)
| round | change | result |
|---|---|---|
| 1 | first build | Stream timing matched the probes. Panel height spring was 380 ms against about 200 ms in the ref, and the clone card ended at 537 px against 559 px (2-line answer against 3 lines). |
| 2 | panel transition cut to 240 ms | Height curve 262 to 559 in about 200 ms (ref 262 to 556 in 205 ms). |
| 3 | answer copy lengthened to 3 lines | Card height 559 px, same as the ref. |

## Why compare.ts cannot settle timing
The reference site did not capture under the virtual clock. Two virtual captures hung and were killed, and a third attempt at the Hide/Explain trigger hung for 6 minutes and produced no frames. I therefore used real-clock captures on both sides. The machine had load average about 6.7 on 4 CPUs.

Under that load the 25 fps frame index does not equal real time. Real timestamps are in `track.json`. The reference's stream took 1.2 s on the frame axis against about 0.3 s in the unloaded probe. The clone's hold phase shows 2.4 s against 3.6 s in its own probe. Frame-axis timing from compare.ts is therefore unreliable for both sides.

## compare.ts, last full run (compare-3)
Command: `compare.ts --ref ref3/frames --clone clone-3/frames --out compare-3 --offset -5`. The offset aligns the Explain click, from the track.json expansion start (ref +278 ms, clone +93 ms). Both captures were 775x669 at 1440x1100, 25 fps, real clock, click trigger on Explain, 6.5 s window.

| item | result |
|---|---|
| mean mismatch | 4.09 % (threshold 5 %, pass). It is mostly palette, background and font, which this fidelity level does not match. |
| activity window | ref frames 2 to 161, clone 4 to 111 |
| timing error, clone minus ref | start +0.08 s, end -2.0 s, duration -2.08 s, peak -0.28 s, FAIL against the 0.08 s limit |

Bursts in the ref's activity curve, each with its clone counterpart:

| ref burst (frame axis) | what it is | clone |
|---|---|---|
| 0.08 s | pre-click noise | 0.36 s noise |
| 0.84 to 1.32 s | click, expansion, thinking line and skeleton | 0.8 to 1.0 s |
| 1.96 to 3.2 s | stream, annotations, bars | 1.6 to 2.2 s |
| 6.4 s | autoplay moves to the next follow-up | 4.6 s |

The structure matches burst for burst. The spacing differs, for the reason above.

## Timing evidence that holds up: DOM-mutation probes (real clock)
The ref was probed with a MutationObserver (`probe.json`). The clone was probed with `cprobe.ts`, which ran unloaded. I also read the ref's timing constants from its client script, as numbers only, no code copied.

| row | ref | clone | criterion | result |
|---|---|---|---|---|
| Stop to first text (thinking) | 783 to 946 ms across 5 runs; script constant 820 | 861 ms | ±80 ms | pass (ref 946 run is +85) |
| stream tick | 34 to 44 ms, mean about 40 | 36 to 40 ms, mean 38.6 | ±80 ms | pass |
| chunk fade | 150 ms, ease-out expo | 150 ms, same curve | same | pass |
| hold after answer, to next follow-up | 3611 to 3642 ms | 3609 ms | ±80 ms | pass |
| follow-up order | Explain, Compare to last quarter, Break down by plan, Hide, then Explain after 1400 ms | same by construction; Hide and the 1400 ms Explain were not probed in the clone | order | pass for the first two runs, rest unverified |
| panel expand (track.json heights) | 262 to 556 px in 205 ms | 262 to 559 in 200 ms | ±80 ms | pass |
| final card height | 559 px | 559 px | layout | pass |

## Easing match
- **Panel height:** the ref uses a snappy spring and the clone uses a 240 ms cubic-bezier(.22,1,.36,1). The track curves agree to within the coarse, load-limited sampling.
- **Chunk and driver fades:** all use the ref's cubic-bezier(.22,1,.36,1), read from its CSS.

## Residual deviations
- **Frame-axis timing:** compare.ts shows end -2.0 s and duration -2.08 s, caused by real-clock capture under load (see above).
- **Mean mismatch of 4.09 %:** palette, background and font, which are intentionally different at this fidelity level.
- **Panel spring:** the ref uses a spring and the clone approximates it with a cubic-bezier, within about 5 ms on the track data.

Sheet: `compare-3/sheets/compare-01.webp`. Winner and candidates: `selection.md`.
