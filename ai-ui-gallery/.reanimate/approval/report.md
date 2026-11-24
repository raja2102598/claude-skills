# approval: reanimate report

**Cloned:** the Arc UI "Agent approvals" block preview (https://uiarc.dev/components/blocks/agent-approvals): one decision on the focused request of a 5-request agent approval queue.
- **Approve:** the decision row cross-fades to "Sending your approval to …". Then it turns into "✓ Approved · …" and the pending count rolls 5 → 4. Then the next request rises into focus while its queue row collapses and the resolved count rolls 6 → 7.
- **Deny:** the same steps, with "Telling … no" and then "✕ Denied · … will not run it", about 185 ms sooner.

**Fidelity:** motion-faithful. Arc UI Pro is a paid block with no open-source license. Everything visible is ours:
- copy: release, customer-reply, archive, docs and ticket-merge requests from the fictional agents "Release agent", "Inbox agent", "Data agent" and "Triage agent", on the models "Nova 2" and "Atlas Mini"
- palette: warm paper with a deep green Approve button
- fonts: IBM Plex Sans and IBM Plex Mono, from Google Fonts
- marks and icons: initial-letter agent marks and lucide icons; no brand marks

No Arc CSS, JS, copy or assets were copied. Timings come from captures and from rAF probes of `getAnimations()`.

**Added beyond the reference capture** (none of these touch the verified run):
- Always allow, which approves and rolls the Rules count
- keyboard: Enter or A approves, D denies, J/K move the focus
- clicking a queue row focuses it, and the old focus grows back into the queue
- an "All caught up" empty state
- a gallery autoplay that approves, denies and always-allows through the queue, then starts over; any real input stops it
- rolling digits that wrap 9 → 0 in the count's direction
- a screen-reader text for each count

**Code:**
- `src/clones/approval/index.tsx`: the component.
- `data.ts`: the requests.
- `approval.css`: fonts, palette and the fade keyframes.
- `meta.ts`: the stage, 672×650 on `#f5f4f1`.

**Trigger:** the demo plays on load. `?autoplay=0` turns it off; captures then click `[data-ap=approve]` or `[data-ap=deny]`. `window.dispatchEvent(new Event("reanimate:replay"))` remounts the card.

## Capture

Reference and clone use the same settings:
- `--viewport 1440x1400 --trigger click --wait-before 6000 --pre-roll 200 --duration 2400 --fps 25 --clock virtual --network-wait 300`
- crop 672×650:
  - reference: `--clip 377,398,672,650`, the card plus 16 px on every side
  - clone: `[data-stage]`
- click target:
  - reference: `[class*=agent-approvals_approve]` or `…_deny`
  - clone: `[data-ap=approve]` or `[data-ap=deny]`
- 8 tracked elements on each side: card, focus area, decision slot, queue rows 1 and 2, the "5" and "4" glyphs, focus slide.

**WAAPI rows.** The reference's cross-fades run on WAAPI and collapse under the virtual clock. They were measured on the real clock in round 2 by recording every `Animation` under the card after the click, on both sides (the probe JSON stays out of git). The clone runs those fades as CSS keyframes with the same durations and easings.

Every height, rise and digit roll in the reference fits one critically damped spring: x(t) = 1 − (1 + ωt)e^(−ωt) with ω = 18 rad/s. The clone uses the same spring:
- motion values with stiffness 324 and damping 36
- for auto-heights, an analytic rAF follower that keeps its velocity when re-targeted

## Verification (round 5 of 5)

compare.ts (offset 0):

| flow | mean mismatch | worst frame | motion window ref → clone | timing err start / end / dur / peak | result |
|---|---|---|---|---|---|
| approve | 3.45 % | 4.4 % (#33, 1.32 s) | 6–41 → 6–42 | 0 / +0.04 / +0.04 / +0.04 s | PASS |
| deny | 3.74 % | 4.9 % (#28, 1.12 s) | 6–37 → 6–38 | 0 / +0.04 / +0.04 / +0.04 s | PASS |

Spec rows. Times are ms from the click. "virt" is the virtual-clock track; "real" is the real-clock probe.

| # | spec row | ref | clone | easing ref → clone | numbers | result |
|---|---|---|---|---|---|---|
| 1 | decision fade, actions → "Sending…" (out 100, in 150) | real +0 | real +0 | quint-out / expo-out on both | same durations | pass |
| 2 | decision slot height 40 → 44 | virt starts 17 | 17 | material-emph 440 (rmse 0.019) → material-emph 440 (0.018) | max \|Δ\| 0.26 px | pass |
| 3 | card +4 px chase (rows below drift down) | from ~67, 1 % at ~770 | from ~67–83 | ease 882 fit → ease 800 fit | max \|Δ\| 0.26 px of 4 px | pass |
| 4 | decision fade "Sending…" → "Approved" / "Denied" | real 468 / 269 | real 461 / 271 | as #1 | −7 / +2 ms | pass |
| 5 | pending roll 5 → 4 (±13 px, fade, blur) | virt starts ~483 / ~297 | ~483 / ~300 | material-emph 441 on both | ty max \|Δ\| 0.21 px, opacity max \|Δ\| 0.02 | pass |
| 6–7 | slide fades (out 100 quint, in 200 expo) | real 1108 / 889 | real 1077 / 896 | same | −31 / +7 ms | pass |
| 8 | new slide rise 14 → 0 | virt 1100 → 1467 | 1083 → 1467 | quint-out variant 605 (0.0118) → same family 568 (0.0112) | meanΔ 0.22 px | pass |
| 9 | queue row fade out (150 ease-out) | real 1108 / 889 | real 1077 / 896 | ease-out on both | −31 / +7 ms | pass |
| 10 | queue row collapse 48 → 0 | virt ~1097 / ~917 | ~1097 / ~917 | material-emph 422 (0.020) → material-emph 420 (0.019) | at +1133: 41.4 vs 41.1 px | pass |
| 11–12 | focus area 306.6 → 290.4; card 620.6 → 556.4 | virt ~1097 | ~1097 | material-emph 441 (0.019) → material-emph 479 (0.025) | card max \|Δ\| 2.15 px of 64 (3.4 %) approve, 3.1 px (4.8 %) deny | pass |
| 13 | resolved roll 6 → 7 (old up, new from below) | frames 33–37 | frames 33–37 | spring ω = 18 | same state in every sheet frame | pass |
| 14 | hover tint on the new Approve under the pointer (opacity 0.91) | real 1093 | real 1077 | quint-out 150 on both | | pass |
| 15 | rest | no change after frame 41 / 37 | 42 / 38 | | +1 frame (the collapsed row is removed) | pass |

Sheets:
- `compare-5/sheets/compare-01.webp`: approve, frames 5–45, every 0.16 s.
- `compare-5-deny/sheets/compare-01.webp`: deny, frames 5–41.

The frame-by-frame detail sheet of the advance stays out of git with the raw captures.

## Residual deviations

1. **Cross-fades show as ghosts in the virtual-clock sheets.** Mismatch is 4.4 % at frames #33–34 against about 3.3 % at rest.
   - The reference's WAAPI fades do not run under the virtual clock, so `ref/` shows those swaps instantly.
   - The clone follows the real-clock probe instead: out over 100 ms, in over 150 or 200 ms, with the same easings.
2. **At the advance, the clone's fades start 31 ms before the reference's on the real clock** (1077 vs 1108 ms).
   - The clone commits the swap one frame before its springs start.
   - That keeps the springs aligned within a frame (row height at +1133 ms: 41.1 vs 41.4 px).
   - The offset is within ±80 ms. Deny is +7 ms.
3. **About 3.3 % static mismatch.**
   - Our copy, palette and fonts (IBM Plex vs Geist and Inter) and our agent marks account for most of it.
   - The reference card sits 0.6 px lower and taller (616.6 vs 616.0 px) because of a fractional scroll offset on its page.
   - After the card shrinks, the reference page's next section border shows inside the crop at y = 626. It is not part of the component.
4. **The collapsed queue row is removed about 33–66 ms earlier** (at ~1550 ms vs ~1583–1600 ms). Motion's spring stops within 0.5 px. The row is under 0.3 px tall by then, so nothing visible changes.
5. **The +4 px chase in row 3 is a model.** The reference's nested auto-height lags its inner spring. A velocity-keeping critically damped follower at ω = 9 reproduces it:
   - progress at 200/300/400/500/600 ms: 15/41/63/80/90 % in the clone vs 17/42/60/75/88 % in the reference
   - max \|Δ\| 0.26 px
6. **Deny timing is measured; Always allow is not.** In the reference, Always allow opens a menu that was not captured. The clone's Always allow uses the Approve timing.

## Rounds

1. First build. Timing passed except the end (+0.12 s).
   - The focus area's −4 px margin collapsed through its parent (+3.4 px static).
   - The nested height chase was too slow: motion's re-target dropped the velocity.
2. Fixed the layout with flow-root.
   - Replaced the auto-height with an analytic critically damped follower (ω = 9 chase, ω = 18 direct).
   - Shifted the commits ~15–20 ms earlier.
   - Ran the real-clock probes on both sides.
   - Result: approve passes on every row.
3. Captured Deny on the reference and found it runs ~185 ms sooner. Gave each decision kind its own timing; deny then passed.
4. Digit wheels wrap 9 → 0 in the count's direction (an addition). Verified rows unchanged.
5. Screen-reader text for the counts. Final evidence; numbers identical to round 4.

## Candidates

- **Winner:** Arc UI Agent approvals, the fullest approval lifecycle of the eight (queue, risk, arguments, a decision that reads back, then the next request).
- **Runner-up:** beUI Pro Tool Approval.
- All eight loaded. Details are in `selection.md`.
