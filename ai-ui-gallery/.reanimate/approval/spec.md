# approval motion spec

Target: Arc UI "Agent approvals" block preview, https://uiarc.dev/components/blocks/agent-approvals. Crop is the preview's `[data-fit-layer]` at a fixed clip of 377,398,672,650: the card (`[class*=agent-approvals_root]`, 640 px wide) plus 16 px on every side. The motion is a decision on the first request: click Approve, the row goes from sending to approved, then the next request takes focus. Deny runs the same timeline (checked separately in `ref-deny/`).
Destination: `ai-ui-gallery/src/clones/approval/` (React 19 + TS, plain clone-local CSS, `motion/react` for the queue presence and the row and slide springs, lucide-react).
Fidelity: motion-faithful. The Arc UI Pro block is paid, with no open-source license. The clone uses its own palette (warm paper, deep green Approve), IBM Plex Sans and Mono, its own copy, fictional agents and models ("Nova 2", "Atlas Mini"), initial-letter agent marks and lucide icons. It has no brand marks.
Reference capture: `.reanimate/approval/ref`:
`capture.ts --url … --viewport 1440x1400 --clip 377,398,672,650 --selector "[data-fit-layer]" --trigger click --target "[class*=agent-approvals_approve]" --wait-before 6000 --pre-roll 200 --duration 2400 --fps 25 --clock virtual --network-wait 300 --track "<8 selectors>"`
Real-clock probe of the WAAPI rows: `candidates/arc-anims-approve.json`. It records every `Animation` under the card after the click on the real clock, with its duration, easing and keyframes.
Clone capture: the same command with `--url http://127.0.0.1:5173/c/approval?autoplay=0 --selector "[data-stage]" --target "[data-ap=approve]"`.

## Structure (static, card-relative px; card 640 × 616.6, 1px border, radius 24)

| element | ref → clone | box | notes |
|---|---|---|---|
| card | `agent-approvals_root` → `[data-ap=card]` | 16,16 in the crop; 640 × 616.6 → 556.4 | overflow hidden; its height is the sum of the parts below and is not animated itself |
| header | `header` → `.ap-header` | 0..60 | title 15/500, "N pending" rolling count, "Rules · N" button 34 tall |
| focus area | `focusArea` → `[data-ap=focus-area]` | 61, h 302.6 | padding 0 20 18; holds an auto-height wrapper with a -4 px margin and 4 px padding |
| focus slide | `focusSlide` → `[data-ap=slide]` | 61, h 284.6 (272.4 for the 3-arg request) | meta 18, then title 22 (+14), reason 18 (+6), args (+16, 4 rows × 32 + 12 = 140), decision slot (+14) |
| decision slot | `decisionSlot` → `[data-ap=decision-slot]` | 40 = 32 actions + 2 × 4 padding; 44 with a 36 px status line | own auto-height; overflow hidden |
| queue rows | `queue > li` → `[data-ap=queue] > li` | 48 each, from 363; ul padding 0 8 8 | separator line at each row's top, inside the row (it collapses with it) |
| footer | `footer` | 52 incl. border-top | "› Resolved · N" with rolling count, J/K/A/D key hints |

## Timeline (t = 0 is the click; virtual-clock track unless marked "real")

| # | element | property | from → to | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | decision row | content cross-fade: actions → "Sending your approval to …" | out 1→0, in 0→1 | 0 | out 100, in 150 | out quint-out (0.22,1,0.36,1), in expo-out (0.16,1,0.3,1) | real probe (+0 ms) |
| 2 | decision slot | height | 40 → 44 | 17 | ~400 to 1 % | critically damped spring ω = 18 rad/s (stiffness 324, damping 36); material-emphasized 440 fit | track + easing.ts |
| 3 | focus area, card, rows below | height / y | +4 px (616.6 → 620.6) | ~70 | ~750 to 1 % | lags row 2: a velocity-keeping chase at ω ≈ 9 (progress 17/42/60/75/88/95 % at 200…700 ms) | track |
| 4 | decision row | content cross-fade: "Sending…" → "✓ Approved · Simulated, nothing ran" | same as #1 | 468 (real), between frames 17 and 18 | 100 / 150 | as #1 | real probe + frames |
| 5 | pending count | digit roll 5 → 4: old glyph y 0 → +13 with opacity 1 → 0, new glyph −13 → 0 with 0 → 1, blur while moving | | 485 | ~380 to 1 % | spring ω = 18 | track + easing.ts |
| 6 | old focus slide | opacity | 1 → 0 (absolute, out of flow) | ~1100 (real 1108) | 100 | quint-out | real probe |
| 7 | new focus slide | opacity | 0 → 1 | ~1100 | 200 | expo-out | real probe |
| 8 | new focus slide | translateY | 14 → 0 | ~1098 | ~370 to 1 % | spring ω = 18; quint-out 605 fit | track + easing.ts |
| 9 | its queue row (li 1) | opacity | 1 → 0 | ~1100 (real 1108) | 150 | ease-out | real probe |
| 10 | its queue row (li 1) | height (rows below slide up 48 px) | 48 → 0 | ~1097 | ~380 to 1 % | spring ω = 18 | track + easing.ts |
| 11 | focus area (outer auto-height) | height | 306.6 → 290.4 | ~1097 | ~380 | spring ω = 18 (direct re-target, no chase) | track |
| 12 | card | height | 620.6 → 556.4 | ~1097 | ~430 to 1 % | sum of rows 10 + 11 | track + easing.ts |
| 13 | resolved count | digit roll 6 → 7, the reverse direction (old glyph up, new from below) | | ~1100 | ~380 | spring ω = 18 | frames 33–37 |
| 14 | new Approve button | hover tint under the resting pointer (opacity 0.91) | | ~1093 | 150 | quint-out | real probe (CSS transition) |

Trigger: click Approve (or Deny). Total length: ~1.6 s. The last visible change is at ~1.57 s, when the collapsed row is removed.
Deny: the same steps with "Telling … no", then "✕ Denied · … will not run it", each ~185 ms sooner: the denied swap at 269 ms (real) with the count roll from ~297, and the advance at 889 ms (real) with the springs from ~917 (`ref-deny/`, `ref-realclock-deny.json`).

Every spring in the reference fits one critically damped curve, x(t) = 1 − (1 + ωt)e^(−ωt) with ω = 18 rad/s. Checks against the card height from 1100 ms: 53.8 % at +100 ms (curve 53.7 %), 87 % at +200 (87.4 %) and 97 % at +300 (97.1 %).

## Style facts the motion depends on
- Cross-fading content is absolutely positioned on exit, so only the entering content sets the height.
- Rolling digits sit in a 22 px column with overflow hidden: 2 px above and below the 18 px line. A glyph at ±13 px is mostly clipped.
- Queue rows clip their content (overflow hidden) while they collapse.
- Reference fonts: Geist (titles) and Inter (13/18 body), mono for code. Clone fonts: IBM Plex Sans and Mono, from Google Fonts.

## Clone mapping
- Rows 2, 3 and 11: `AutoHeight`. It is a critically damped follower stepped analytically on rAF and written to `style.height`. Re-targeting keeps the velocity. ω is 18, or 9 for the focus wrapper while a decision is in flight. It runs the same on the real and the virtual clock.
- Rows 5, 8, 10 and 13: `animate(motionValue, …, { stiffness: 324, damping: 36 })` on motion's JS frameloop. No WAAPI is involved.
- Rows 1, 4, 6, 7 and 9: CSS keyframes with the probed durations and easings (WAAPI in the reference; it collapses under the virtual clock).
- Timers (`TIMING` in index.tsx): approve decided 467 and advance 1080; deny 281 and 899 (the reference's deny is ~185 ms quicker: roll at ~297, springs at ~917). Each commit lands one frame before the springs it starts.

## Additions (outside the verified run; they don't change its motion)
- Deny and Always allow run the same lifecycle. Always allow also rolls the Rules count.
- Keyboard: Enter or A approves, D denies, J/K move the focus. Clicking a queue row focuses it, and the old focus row grows back in.
- An empty state ("All caught up") when the queue is clear.
- A gallery autoplay that approves, denies and always-allows through the queue, then starts over. `?autoplay=0` turns it off; any real input stops it.
- `reanimate:replay` remounts the card.
