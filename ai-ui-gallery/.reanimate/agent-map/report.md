# agent-map: reanimate report

Fidelity: motion-faithful. Reference: UIStacks "Agent map" (Pro, paid). Clone: src/clones/agent-map/ (index.tsx, data.ts,
agent-map.css, meta.ts). Plays on load at /c/agent-map: 12 s tour (lead → research agent 2.4 s → buyer "Needs you" 4.8 s →
approved 7.6 s → remount 12.0 s), loops; click / arrow keys / "Approve payment" take over; `reanimate:replay` remounts.
No additions beyond the reference's behaviour (own palette, Geist, lucide icons, fictional names, own copy).

Capture (both sides): viewport 1440×1400, 870×533 crop, --trigger none --wait-before 4000 --pre-roll 0 --duration 12600
--fps 20 --clock virtual. Ref pre-js seeks the SMIL dots from the virtual clock and clicks Replay; clone pre-js dispatches
`reanimate:replay` after 250 ms (the harness records ~250 ms after the pre-js; the reference remounts at frame 0).
Per-frame state from probes/measure.py (edge draw fraction, node tint, panel/header change), dot positions from
probes/dots.py; real-clock reference rows (motion WAAPI) from probes/timeline.txt, anims.json, draw.txt.

## Verification (round 3 of 3)

compare.ts: 253/253 frames, offset 0, mean mismatch 2.74 % (max 2.99 %; copy, palette and font differ by design), motion
window ref 48–240 / clone 48–240, timing error start 0 s, end 0 s, duration 0 s → PASS. ("peak" differs by 9.6 s only
because the four step spikes are near equal: the ref's largest is #48, the clone's #240. Not a timing difference.)

| # | row | ref | clone | err | easing (ref → clone) | result |
|---|---|---|---|---|---|---|
| 1 | tour steps (header / panel swap frames) | 2.40, 4.80, 7.60, 12.00 | 2.40, 4.80, 7.60, 12.00 | 0.00 s | — | pass |
| 2 | path draw, mount (3 lead edges, 50 % / 90 %) | 0.076–0.078 / 0.145–0.150 | 0.074 / 0.141–0.145 | −0.002…−0.005 s | overdamped spring ω 25 ζ 1.12 (fit RMSE 0.004 to ref rAF samples) → same | pass |
| 2 | path draw, 2.4 s lead→research / research→tool | 2.490 / 2.673 (50 %) | 2.487 / 2.669 | −0.003 / −0.004 s | same | pass |
| 2 | path draw, 4.8 s lead→buyer / buyer→tool | 4.892 / 5.093 (50 %); 90 % 4.971 / 5.161 | 4.889 / 5.089; 4.964 / 5.148 | −0.003…−0.013 s | same | pass |
| 3 | 2nd-hop delay | 0.183 s, 0.201 s | 0.182 s, 0.200 s | −0.001 s | — | pass |
| 3 | which edges light per step | sheets | same | — | — | pass |
| 4 | call dots (lead→research, frames 0–95) | positions | mean abs err 0.43 % of edge (≈0.6 px ≈ 7 ms), 75 frames | — | cubic-bezier(0.4,0,0.6,1), opacity 0→1→1→0 at 15/85 % → same | pass |
| 5 | node tint 50 % crossings (4 transitions) | 2.479 / 2.467 / 4.879 / 4.867 | 2.463 / 2.450 / 4.862 / 4.850 | −0.016…−0.017 s | 200 ms cubic-bezier(0.4,0,0.2,1) → same | pass |
| 6–7 | panel exit / enter (ref real-clock probe; clone virtual track) | exit done +94 ms, enter at +111 ms, opacity spring 450 ms, y 6→0 246 ms | exit 100 ms, enter +100 ms, opacity 0.5 at +167 / 0.98 at +283, y 6→0 246 ms | −11 ms start | spring linear() (ω 20.5 ζ 0.83, fit RMSE ≈1e-4) → same | pass |
| 7 | description line | opacity 450 ms, y 4→0 546 ms | same | 0 | same | pass |
| — | card height jumps | 464.6 / 508.8 / 464.6 / 490.4 at the swaps | identical values, same frames | 0 | instant | pass |
| 8 | header calls/min swap | 4.80, 7.60, 12.00 | 4.80, 7.60, 12.00 | 0 | instant | pass |
| 9 | needs you: loader removed, node narrower, edges re-route | 4.80 | 4.80 (buyer→tool plateau 0.75 on both) | 0 | instant | pass |
| 10 | warning dot pop | 647 ms spring, overshoot 1.18 | 647 ms, spring ω 23.8 ζ 0.49 (fit RMSE 0.008) | 0 (declared) | spring → spring | pass |
| 11 | pulse ring | 1.6 s loop, scale 1→2.2, opacity 0.6→0 (+0.4 s) | same | 0 (declared) | ease-out → ease-out | pass |
| 12 | approval at 7.6 s (loader back, button gone, rates, no redraw) | sheets compare-10 | same | 0 | — | pass |
| 13 | warning dot exit | 644 ms spring | 644 ms | 0 (declared) | spring | pass |
| 14 | status badge swap | opacity 450 / scale 0.9↔1 294 ms, both at once | same | 0 (declared) | spring | pass |
| 15 | working loader | 800 ms, 4 × 200 ms, 60 ms cross-fades | same (own dot patterns) | 0 | linear | pass |
| 16 | remount at 12.0 s (draw 50 % / 90 %) | 12.076–12.078 / 12.145–12.150 | 12.102–12.105 / 12.175–12.183 | +0.027…+0.033 s | same | pass |

Round history: clone-1 started 0.25 s early (the harness records ~250 ms after the pre-js) → clone pre-js delays the
replay 250 ms, draws start 1 frame after the lighting render. clone-2: all draw rows ≤ 13 ms, dots 1.25 % of edge
(~20 ms) ahead → the dot clock starts one frame after mount. clone-3: dots 0.43 %.
Sheets: .reanimate/agent-map/compare-3/sheets/compare-01.webp (the other sheets, compare-02 … compare-16, are not committed) (step frames: compare-04 at 2.4 s, compare-07
at 4.8 s, compare-10 at 7.6 s, compare-16 at 12.0 s).

## Residual deviations

- Panel, badge and needs-you dot fades show for ~5 frames per step in the clone but collapse to one frame in the reference
  capture: motion runs them on WAAPI, which the virtual clock does not drive. Clone timings follow the real-clock probes
  (exit 100 ms, enter +100 ms, 450 / 246 / 546 / 294 / 647 / 644 ms springs); start error −11 ms.
- Remount draw +27…+33 ms (within 80 ms): the new card's clock starts on its first frame after the loop remount. Fix if
  wanted: hand the loop timestamp to the new card.
- Node tint transitions run one 60 Hz frame (−17 ms) early.
- Node widths follow the clone's own names and Geist (the lead node is 2.2 px narrower, so its edges start 2 px earlier).
  The 2.74 % mismatch is copy, palette and icons, by design.
- Round 2 ran at a 960×640 viewport after two Chromium crashes at 1440×1400 (machine memory pressure). The crop is
  identical; round 3 is back at 1440×1400.
