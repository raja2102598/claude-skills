# streaming-text: reanimate report

**Cloned:** Kobra "Streaming Text" (https://kobra.systems/components/streaming-text), default speed 16 ms/word, **motion-faithful** (paid: "Buy component ($19)", code behind Pro, no open-source license).

**Added:**
- A reduced-motion path.
- `aria-busy` on the live layer; the height-reserving copy is `aria-hidden` + `inert`.
- A source pill with an `aria-label` listing its sources.
- Working Copy and Download buttons on the code card.
- Keyboard Replay that gives focus back to the button.
- `wordMs` and `startDelayMs` props, mirroring the reference's speed setting.

**Code** (all in `src/clones/streaming-text/`):
- `index.tsx`: the component and its rAF stream clock.
- `reply.ts`: our own copy, with the reference's word count per block, plus the tick timeline.
- `streaming.css`: clone-local styles and every keyframe.
- `meta.ts`

View it at `/c/streaming-text`. It plays on mount (first word at 0.9 s), and Replay at the end restreams. It does not use `motion`, so the WAAPI trap does not apply.

## How it was verified
Both sides used the same `capture.ts` command:
- 1440x900, 607x548 crop, `--clock virtual`, seed 1, trigger load, 4.5 s.
- 60 fps, so each capture frame is one 60 Hz rAF tick. At 25 fps the virtual clock runs 2–3 ticks per step, and the reference's own effect scheduling then slows it to about 27 ms/word (its code card lands at 4.58 s instead of 3.13 s). That capture is kept as `ref-25fps/`.

Three other sources of evidence:
- **A 60 Hz virtual-clock DOM probe** (`probes/vprobe.ts`): live word count, per-word computed opacity and colour, the code card and the Replay wrapper, for every frame.
- **Real-clock rAF probes** (`probes/kprobe.ts`, `probes/rprobe2.ts`) for the Replay cycle. The reference's Replay entrance and exit run on motion's WAAPI, which collapses to one frame under the virtual clock.
- **Compare sheets**, read state by state.

The probes and raw captures stay out of git.

## Rounds
| round | change | result |
|---|---|---|
| 1 | first build (code `<code>` set to block so the card is 87 px) | Stream timeline exact (first word, code card and Replay on the same frames). 95/171 words started their fade one frame late: React committed after the frame, because dev-mode time slicing yields. |
| 2 | `flushSync` the reveal inside the rAF | 171/171 fades start on their reveal frame, and the per-word curves are identical. |
| 3 | blur-out starts one frame in (−16 ms), like the reference's frame-synced spring; also tried on the button exit and reverted | Blur-out meanAbsDiff 0.038 → 0.006 (real clock). |

## Verification (round 3 of 3)
| spec row | ref → clone | criterion | result |
|---|---|---|---|
| 1 first word | 900.0 → 900.0 ms (probe); first visible capture frame #55 (0.917 s) in both | ±80 ms | pass |
| 2 cadence | live word count equal on 360/360 probe frames; 1 word per 16.67 ms frame; stream 900 → 3816.7 ms on both (2916.7 ms) | same | pass |
| 3 word fade | fade starts one frame after insertion on 171/171 words on both; opacity curve meanAbsDiff 0.000 (words 40, 100, 150); 180 ms, ease | ≤ 0.05 | pass |
| 4 colour trail | stops at 0/30/60 % then ink, reached at +183 ms on both (our own amber → tangerine → terracotta) | same structure | pass |
| 5 source pill | lands on the frame of p1's 20th word (word count +2 at 1316.7 ms) on both | same tick | pass |
| 6 blocks and markers | appear with their first word; bullets show at once (sheets) | same | pass |
| 7 code card | inserted at 3133.3 on both; opacity curve identical (meanAbsDiff 0.000), 300 ms ease; stream holds 100 ms and p3 starts at 3233.3 on both | ±16 ms | pass |
| 8 last word | 3816.7 → 3816.7 ms | ±80 ms | pass |
| 9 Replay entrance, opacity (real clock) | t50 50.0 → 50.0, t90 116.5 → 116.5 ms; meanAbsDiff 0.004; out-quint, about 280 ms | ≤ 0.05 | pass |
| 10 Replay entrance, 4 px rise | meanAbsDiff 0.033 (3.3 % of travel) | ≤ 5 % | pass |
| 11 Replay blur-out (opacity + 4 px blur) | meanAbsDiff 0.006; t50 77 → 80, t90 153 → 161, t99 271 → 261 ms; critically damped spring ω 25 | ≤ 0.05, ±80 ms | pass |
| 12 Replay button exit | meanAbsDiff 0.024; t50 61.5 → 61.3 ms; out-cubic 200 ms | ≤ 0.05 | pass |
| 13 reset after click | 436 → 445 ms (+8) | ±80 ms | pass |
| 14 restream first word | click + 1336 → + 1361 ms (+25) | ±80 ms | pass |
| layout | every block's y identical to 0.1 px (see below); grid 503.9 px on both; same line count per block; Replay at y 518 (76 → 79 px wide) | within 10 % | pass |
| compare.ts activity window | start +0.017 s, end −0.017 s, duration −0.033 s (recomputed with a 0.01 % floor) | ≤ 0.08 s | pass (see note) |

Layout positions (both sides): h4 0, p1 40, p2 100.8, list 185.9 (items 185.9, 214.3, 267, 295.4), code card 331.8 with height 87, p3 430.8.

**Pixels** (not judged for motion-faithful): compare.ts mean mismatch 3.31 %, PASS at 5 %. Frames at rest before the stream read 0.0 %. The worst frames are 7.0 %, the finished reply, and the difference is all text: our own copy, palette and font.

**Note on compare.ts's timing verdict.** The tool's own motion window reads FAIL:
- at 60 fps it finds ref 206–206 and nothing on the clone;
- on a 15 fps subsample it gives start +0.067 s, end −0.067 s, peak +1.07 s.

This is because its fixed activity floor of 0.2 % of pixels per frame sits inside the streaming plateau: about 0.06 % per frame at 60 fps and 0.1–0.3 % at 15 fps. And the "peak" of a flat plateau is arbitrary. Recomputed on the same activity arrays with a 0.01 % floor:
- ref 0.933–3.983 s, clone 0.950–3.967 s.
- The one-frame difference at each end is palette, not timing: an 8 %-opacity gold word on paper is under pixelmatch's colour threshold, where a blue word on white is not.

**Sheet:** `compare-3/sheets/compare-01.webp`. It runs 0–4.05 s in 0.45 s steps. The states match at every timestamp: blank until 0.9 s, p1 at 1.35 s, p2 at 1.8 s, the list at 2.25–3.15 s, the code card and p3 at 3.6 s, and Replay at 4.05 s.

## Residual deviations
1. **Real-clock cadence under load.** On this shared 4-CPU machine, the reference averaged 20.6 ms/word (3500 ms for the stream). Only 77 % of its 16.9 ms frames added a word. The clone keeps exactly one word per frame (2917 ms), so it is 17 % faster (−566 ms) on the real clock here. On the deterministic 60 Hz clock the two are identical, frame for frame. The reference's skipped frames come from its update scheduling under load, not from a designed timing. The clone commits each reveal inside the frame, so it does not skip.
2. **Replay rise.** In the reference the rise lags its opacity by one frame (a JS-driven transform). The clone runs both on one CSS curve: 0.13 px mean difference.
3. **Restream +25 ms, blur-out t90 +8 ms.** These come from real-clock frame jitter and the 430 ms reset timer; all are within ±80 ms.
4. **Replay in the virtual capture.** The reference's Replay pops in within one frame (motion's WAAPI collapses on the virtual clock). The clone fades it in over 280 ms. The real-clock probe (row 9) is the evidence for this row.
5. **Look differs on purpose.**
   - Copy is our own: a reply about a test runner's cold start, with the reference's word count in every block.
   - Palette: paper #f7f5f0, ink #24201b, trail amber → tangerine → terracotta.
   - Fonts are Geist and Geist Mono instead of ABC Diatype.
   - Icons are lucide, and the pill reads "Handbook +1".
   - List lead-ins render at weight 500, where the reference's font draws its medium as 400.
   - No Kobra JS, CSS, copy, icons or favicons are used.
6. **compare.ts timing verdict.** Its default activity floor does not fit a text stream. The note above recomputes it and shows both readings.

## Candidates
- **Winner:** Kobra Streaming Text (the best polish and the most complete reply).
- **Runner-up:** assistant-ui Streaming text (MIT; the clearest states, but one small paragraph).
- **Did not load:** Rare UI Streaming Response (Vercel Security Checkpoint, recorded without retrying).
- **Off-concept:** Arc UI Realtime stream (a live chart).
- **Generic text effects:** Aceternity Text Generate Effect, Magic UI Typing Animation, Animate UI Typing Text.

Details are in `selection.md`.
