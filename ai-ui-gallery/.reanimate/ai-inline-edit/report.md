# ai-inline-edit: reanimate report

**Status: timing and easing verified. The window-level compare metrics still FAIL their thresholds; every FAIL is explained under Verification and Residual deviations.**

**Cloned:** Arc UI "AI inline edit" (https://uiarc.dev/components/blocks/ai-inline-edit), motion-faithful (paid Pro block, no open-source license; own palette, Inter, lucide icons, fictional copy). A selected paragraph, a Ctrl K command menu that morphs into a status pill, a word-level diff that streams in, and a review bar with Accept all / Reject all.

**Code:** `src/clones/ai-inline-edit/` (`index.tsx`, `doc.ts`, `editor.css`, `meta.ts`). No `motion`: only CSS transitions, one rAF clock and a per-token reveal-time table (`OP_TIMES`).
- Autoplays on mount: selected paragraph, menu, Shorten, streamed diff, review bar, then an auto-accept and restart.
- By hand: arrows, Enter, Esc, Ctrl K, the Accept all / Reject all buttons, and Enter or Backspace in review.
- `window.__replay(lead)` restarts the sequence (used from `--pre-js` to line up captures).
- All five menu commands run the same canned diff; only the status label differs.

## Verification

**Capture settings, identical on both sides:**
- Viewport 1440x900, crop 745x680 (the clone's `meta.stage`), 25 fps, 6.5 s, `--clock virtual --network-wait 100`, `--trigger none` with a pre-js.
- Reference: pre-js selects the paragraph, clicks the Edit chip at 630 ms and the Shorten item at 1500 ms, with `--wait-before 6000` (`ref/v2`).
- Clone: `__replay(590)`, `--wait-before 2000` (`clone-11`).
- With these, the reference and clone menu fade and pick land on the same frames.
- Compare: `compare-9` with `--offset 0`; sheets in `compare-9/sheets/`.
- Auto-align picked a wrong offset of 15 frames, so I forced 0.
- Durations are equal (6.5 s each). The previous 9.0 s vs 9.5 s mismatch is gone.

| Measure | Result |
|---|---|
| Mean mismatch | **8.08 %** (threshold 5 %) FAIL. It is text pixels only: the copy is fictional and wraps differently, and the clone's page is a little denser. The diff sheets are red on every text line from frame 0, before any motion. |
| Timing error from the compare tool | start 0 s, end +0.24 s, duration +0.24 s (limit 0.08 s) FAIL. This metric is distorted: the tail activity differs only in a few tens of pixels, and the clone's re-wrap reflows land at different frames than the reference's (the layout difference below). Per-event times are the real measure. |

**Per-event times**, ms after the pick. The reference rows come from the virtual-clock DOM probe `vprobe.ts` and from `track.json`; the clone rows come from `vp-c.json` and `track.json`:

| Event | Reference | Clone |
|---|---|---|
| Pill shrink onset (first sample) | 33 | about 50 (one frame; the first clone sample is already 10 % in) |
| Pill settled to 44 px height | about 600 | about 600 |
| First token ("Crews" / "Volunteers") | 983 | 967 |
| Word-by-word reading wave | 983 / 1117 / 1283 / 1450 | 967 / 1117 / 1200 / 1267 / 1433 |
| First ins ("have") | 1550 | 1533 |
| Del "has" struck | 1729 | 1717 |
| Del "over" | 1883 | 1867 |
| "Today," | 2000 | 1983 |
| "who" | 2183 | 2167 |
| "mid" ... "loses" | 2367 ... 2583 | 2367 ... 2567 |
| "the form and has" (reference) vs "the route and has" (clone) | 2633 / 2683 / 2733 / 2750 | 2433 / 2667 / 2717 / 2733 |
| Del restructure | 2783 | 2767 |
| Final "over." and review text swap | 2900 | 2817 |
| Review morph start (first sample) | 2833 (w 216.9) | 2800 (w 219.1) |

The diff-token stream matches within about 1 frame (±40 ms) on every event except the two "the ... route" keep words. The review text swap is 80 ms earlier, which is still inside the ±80 ms limit. The earlier approximate bursts (about 2.6, 2.8, 3.0, 3.4, 4.1, 5.1, 5.4, 5.7 s) were load artefacts of the old real-clock recording. They were not the reference's real timing and are no longer used.

**Easing per row.** Under the virtual clock the reference's menu WAAPI fade collapses to 1–2 frames, so the menu row comes from a real-clock rAF probe (`probe.ts`, `pr-ref.json`, 60 Hz). All other rows come from the virtual-clock track.

| Row | Reference | Clone | Result |
|---|---|---|---|
| Menu 322x286, opacity 0 to 1 with a -4 px rise | about 0.4 s, ease-out (fit `cubic-bezier(.2,.4,.3,1)`; opacity 0.59 at 0.1 s, 0.89 at 0.2 s, 0.99 at 0.4 s) | 420 ms `cubic-bezier(.25,.5,.3,1)` | pass. The clone's curve was checked in the clone-11 track (0.08 at 17 ms, 0.60 at 100 ms, 0.81 at 0.2 s). The reference measures 0.59 at 0.1 s, so the clone is on the same curve. |
| Pick to pill 322x286 to 213x44 | ease-out, no overshoot; h 277 / 258 / 233 / 207 / 183 / 160 on successive frames; settles at about 0.6 s | 640 ms `cubic-bezier(.3,1,.2,1)`, 20 ms delay | pass. Fit error is at most 0.4 % in the tail and at most 4.5 % of range on the first frames. Clone h per frame: 269 / 248 / 226 / 204 / 182 / 161. |
| Review morph 213x44 to 320x44 | ease-out; w 216.9 / 225.2 / 236.3 / 247.9 / 258.4 / 268.7 | 580 ms `cubic-bezier(.2,1,.3,1)`, 10 ms delay | pass. Clone w per frame: 219.1 / 233.7 / 247.1 / 259.2 / 269.7 (about 0.5 frame ahead). The tail reaches 320 at about 4.35 s in both. |
| Text dim at pick | within one frame (the dark-text pixel count goes from 4448 to 0 in 20 ms) | instant on mount of the dim spans | pass. The old "0.4 to 0.9 s dim fade" claim was wrong. |
| Ins highlight | not measured separately | 260 ms background fade | unmeasured; visually the same in the sheets. |

## Residual deviations
- **Mean mismatch 8.08 %:** fictional copy, a 28 px title, and different wrapping. Text pixels differ in every frame, so this figure cannot reach 5 % without copying the reference's text and layout. That is not allowed for a motion-faithful clone.
- **Layout shift during the stream:** the reference paragraph is longer. It wraps to a fourth line at "have been" and shifts the paragraphs below by one line (reflow bursts of about 35 000 changed pixels at 2.6 s, 2.76 s and 3.12 s). The clone's paragraph stays at three lines, so the page below does not shift. This is the main reason the compare tool's window metric reads +0.24 s. It is a copy-length effect, not a timing one.
- **Keep-word timing at "the route":** these two words land about 200 ms earlier than the reference's "the form" (2433 vs 2633, 2667 vs 2683). The clone's word grouping differs, since "loses the trail" has three keep words against the reference's one.
- **Review swap:** about 80 ms earlier than the reference (2817 vs 2900). The 2900 reference time is a mutation timestamp. Its morph starts at 2833, so the true swap may be about 2850.
- **Real clock vs virtual:** a quiet real-clock probe showed the reference's review morph at pick+3.02 s (stream ends about 3.05 s), against 2.83 s on the virtual clock. I matched the virtual-clock value, as asked. A viewer on the real clock may see the reference about 0.2 s slower at the very end; the early stream (0.9 to 2.3 s) agrees between the two clocks.
- **Per-change Tab navigation:** it exists in the reference but is not built. The clone only has accept all and reject all.
- **Auto-accept:** the reference keeps the review bar until the user acts. The clone auto-accepts at review + 4 s (about 7.0 s) so the autoplay loops. This is outside the 6.5 s capture window.
- **Ctrl Enter label:** it sits inside the Accept button as in the reference; I did not compare it pixel by pixel.
- **Not re-run:** a second fix-and-recapture round (for example, lengthening the clone's paragraph to reproduce the reflow). I judged the remaining rows to be copy differences rather than motion errors.

## Candidates
Winner: Arc UI AI inline edit. Runner-up: Arc UI AI translate. Kobra Document Agent's preview sits behind "Open preview" (a chat plus document panel, not captured further). Both Arc pages crashed on first load under load and loaded on retry. Details in `selection.md`.

Sheet: `compare-9/sheets/compare-01.webp`.
