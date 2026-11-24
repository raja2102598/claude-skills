# agent-builder: reanimate report

**Cloned:** Arc UI "Agent builder" block preview (https://uiarc.dev/components/blocks/agent-builder), a 640×815 agent card.
- **Configure view:** inline-named agent, model picker, instructions with a character counter, six tool toggles, and knowledge files with an upload progress bar. After the upload the status reads "Unsaved changes" and Publish turns dark.
- **Test view:** Configure / Test cross-fade. A suggestion click sends: the empty state is removed at once, then the "Thinking" label, tool chips that appear and resolve, the answer streaming, and a done label with the elapsed time.
- **Chat scenarios:** three suggestions with their own chip lists and timings. All three are frame-compared against the reference (see Verification). The reference has all three suggestions, so none is an addition.

**Fidelity:** motion-faithful. Arc UI Pro is a paid block with no open-source license. Everything visible is ours:
- copy and names: Courier, Relay, Tracker, Notebook, Ledger, Nova 2, Atlas Mini
- palette: warm paper with a deep green accent
- font: IBM Plex Sans from Google Fonts
- icons: lucide

No Arc CSS, JS, copy or assets were copied.

**Added beyond the reference capture:**
- autoplay (mount upload, Test tab, first suggestion, restart); any input stops it; `?autoplay=0` turns it off; `window.dispatchEvent(new Event("reanimate:replay"))` remounts the card
- editable name, instructions, model cycling, tool toggles, file removal
- Publish
- Reset and Stop

**Code:** `src/clones/agent-builder/index.tsx`, `data.ts`, `agent-builder.css`, `meta.ts`.

**Trigger:** the mount upload plays on load. For the chat, click a suggestion on the Test tab (`.ab-suggestions` in the capture).

## Capture

Reference and clone use the same settings, all on the virtual clock:
- Chat flows: `--viewport 1440x1400 --trigger click --wait-before 9000 --pre-roll 200 --duration 8000 --fps 25 --clock virtual --network-wait 300`, pre-js: click the Test tab.
- Configure: `--viewport 1440x1400 --trigger load --duration 5000 --fps 25 --clock virtual --network-wait 300`, no pre-js.
- crop: the card (`[class*=agent-builder_card]` on the reference, `[data-ab-card]` on the clone), 640×815 on both sides. The clone is loaded with `?autoplay=0`.
- click targets: reference `[class*=agent-builder_suggestions] > button:nth-child(N)`, clone `.ab-suggestions > button:nth-child(N)`, N = 1 (billing), 2 (CSV export), 3 (Enterprise call).
- compare.ts is run with `--offset 0` (the click is frame 5 on both sides). Auto-align misdetects the offset and its motion window sees only the click frame, so the per-event table below is the verdict.

The fades in the clone are CSS keyframes, so they behave the same on the virtual and the real clock. The chat steps are timers and a rAF stream. The reference's real-clock chat runs about 2x slower than its virtual-clock chat under CPU load (billing 5.4 s vs 2.7 s), so all scenarios are timed from the virtual clock (a 60 Hz rAF, the unloaded behaviour). `inspect.json` shows 0 declared animations on the reference at load; no separate real-clock rAF probe was run for the WAAPI rows.

## Verification

### CSV export suggestion (round 2 of 3)
compare.ts (offset 0): mean mismatch 2.78 %, worst frame 3.2 % (#60), 169 of 169 frames compared, timing error 0 s start / 0 s end, PASS. Sheet: `compare-2/sheets/compare-01.webp`.

| event | ref frame | clone frame | err |
|---|---|---|---|
| click: empty state removed, user bubble, stop button | 5 | 5 | 0 |
| tool chip 1 appears | 23 | 23 | 0 |
| chip 1 result appears | 35 | 35 | 0 |
| tool chip 2 appears | 48–49 | 49 | +1 frame (40 ms) |
| answer streaming | 50–60 | 49–61 | +1 frame (40 ms) |
| done label and send button | 59–60 | 59–61 | 0–1 frame |

### Billing suggestion (3 chips; fix round 1; `ref-billing`, `clone-billing-2`, `compare-billing-2`)
compare.ts (offset 0): mean mismatch 3.06 %, timing error 0 s start / 0.04 s end, PASS. The mismatch is text glyphs. Sheet: `compare-billing-2/sheets/compare-01.webp`. The baseline `clone-billing-1` (real-clock timings: chips at 1000 / 2250 / 3050 ms, done at 5350 ms) failed by 280 to 2590 ms.

| event | ref ms | clone ms | err | result |
|---|---|---|---|---|
| chip 1 appears, label "Using tools" | 720 | 720–760 | +40 | PASS |
| chip 1 result, chip 2 slot | 1200–1240 | 1200–1320 | +40 | PASS |
| chip 2 result, chip 3 appears | 1720–1800 | 1720–1880 | +40 to +80 | PASS |
| chip 3 result (email) | 2280 | 2280 | 0 | PASS |
| "Writing" label, answer starts | 2320 | 2320 | 0 | PASS |
| answer text ends | 2680 | 2680 | 0 | PASS |
| done label "2.7s", send button | 2760–2800 | 2760–2840 | 0 to +40 | PASS |

### Third suggestion, Enterprise call (fix round 1; `ref-enterprise`, `clone-enterprise-2`, `compare-enterprise-2`)
The reference has this suggestion (one chip, then a short answer about Calendar being off and a booking link). The clone keeps its own copy and chip name and uses the reference's timings. compare.ts (offset 0): mean mismatch 2.61 %, timing error 0 s / 0 s, PASS. Sheet: `compare-enterprise-2/sheets/compare-01.webp`. The baseline `clone-enterprise-1` (invented timings: answer at 1600 ms, done at 3200 ms) failed by +360 and +1680 ms.

| event | ref ms | clone ms | err | result |
|---|---|---|---|---|
| chip appears | 720 | 760 | +40 | PASS |
| chip result | 1200 | 1200–1240 | 0 to +40 | PASS |
| "Writing" label, answer starts | 1240 | 1240 | 0 | PASS |
| answer ends | 1480 | 1480 | 0 | PASS |
| done label "1.5s" | 1520 | 1520 | 0 | PASS |

### Configure view (fix rounds 1 and 2; `ref-configure`, `clone-configure-3`, `compare-configure-3`)
compare.ts (offset 0): mean mismatch 5.84 %, timing error 0 s start / 0.04 s end, PASS on timing. Sheet: `compare-configure-3/sheets/compare-01.webp`. The reference's frames 0–13 (0–520 ms) show the page settling around the preview (the card shifts a few px), not component motion; the clone, cropped by selector, does not shift. The mount upload on the virtual clock runs 640 to 2120 ms and swaps to the file row at 2160 ms (the old 600 to 3240 ms came from a loaded real-clock probe). The baseline `clone-configure-1` finished the swap at 3240 ms (+1080 ms). Round 2 shortened the post-swap fades (file row 200 ms, status 150 ms, Publish 150 ms).

| event | ref ms | clone ms | err | result |
|---|---|---|---|---|
| upload bar starts (0 %) | 640 | 640 | 0 | PASS |
| last bar step (97 %) | 2120 | 2120 | 0 | PASS |
| upload row to file row, "Unsaved changes", Publish dark | 2160 | 2200 | +40 | PASS |
| last change settles | 2240 | 2320 | +80 | PASS (at the limit) |

Spec rows (times in ms from the click unless noted):

| row | result |
|---|---|
| empty to thread, bubble | PASS |
| CSV: chip 1 at 720 and its result at 1200 | PASS |
| CSV: chip 2 at 1720 and its result at about 1840 | PASS (+40 ms) |
| CSV: answer 1800 to 2160, done "2.2s" | PASS |
| billing: three chips, answer 2320 to 2680, done "2.7s" | PASS (max +80 ms) |
| Enterprise call: chip, answer 1240 to 1480, done "1.5s" | PASS (max +40 ms) |
| mount upload 640 to 2120 ms, swap at 2160 ms | PASS (swap +40 ms) |
| Configure / Test cross-fade | Not frame-compared; set from a real-clock screenshot series |

## Residual deviations
- **Fade starts one frame late:** the clone's chip fades start about +40 ms after the reference's (up to +80 ms on the billing chip 2 result / chip 3 row), because a CSS animation starts on the frame after the timer. Inside the +-80 ms limit.
- **Configure settle:** the clone's post-swap fades end 80 ms after the reference's (frame 58 vs 56); which frame the swap lands on varies by one frame between runs. At the limit.
- **Configure mean mismatch 5.84 %:** above the 5 % pixel-faithful bar. Text-dominant: different font, copy and tool names, and more text on this view. Not a timing issue.
- **Configure page-load shift:** the reference card moves a few px during 0–520 ms because the page settles around it; the clone does not reproduce this.
- **Configure / Test cross-fade:** still not frame-compared (set from a real-clock screenshot series).
- **WAAPI rows:** no separate real-clock rAF probe was run on the reference. The fades read as multi-frame on the virtual clock, so they were not collapsed.
- **Text and glyph mismatch, about 2.6 to 3.1 % of pixels in the chat flows:** different font, so glyph shapes differ.
- **Reference shimmer:** none was visible in the reference frames, so the clone shows a static "Thinking" label with no shimmer.

## Candidates
Winner: Arc UI Agent builder. Runner-up: Arc UI AI setup wizard. Third: beUI Pro Agent Builder. All three loaded. Details in `selection.md`.
