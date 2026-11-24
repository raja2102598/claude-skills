# generative-ui: reanimate report

**Fidelity: motion-faithful.** The reference is beUI Pro "Crypto Agent" (paid), https://pro.beui.dev/components/crypto-agent. Its transaction-chat preview was cloned and cropped to 1136x600. The preview opens on a welcome screen with three suggestions. Clicking "Swap tokens" plays the whole reply:
- The user bubble appears.
- Three tool steps resolve one by one.
- A sentence streams in word by word.
- A generated swap card appears: a quote with a 30 s countdown ring and Decline / Approve buttons.
- After Approve, a Sign, Submitted, Confirmed stepper plays.
- The header wallet balance ticks down.

**Verification status: lighter than most clones — needs a re-check.** No `compare.ts` run; reference times were read from a real-clock video at ±100 ms (see Method).

Styling is original:
- Warm dark palette with a teal accent.
- Geist and Geist Mono.
- lucide icons.
- A coral orb avatar.
- Fictional names: agent "Orbit", token LMN to USDX, chain "Aurora", route "Meridian v3", contact "lena.eth". No vendor logos.

**Added:** `?auto=` capture modes, a Decline path that ends in "Nothing was signed", a 30 s quote re-roll (the rate jitters and the countdown restarts), and a reduced-motion path. The Decline path and the re-roll were not seen in the reference.

**Code:** `src/clones/generative-ui/` (`index.tsx`, `generative-ui.css`, `meta.ts`).

**Triggers**
- The turn autoplays 900 ms after mount.
- `?auto=0` waits for a click on `[data-gu-start]`.
- `?auto=approve` also auto-approves 1.8 s after the card appears (used for capture).
- Manual: click `[data-gu-approve]` or `[data-gu-decline]`.

## Method

Reference: `capture.ts` could not click into the page under the shared-CPU load (Playwright's `click` and even `boundingBox` timed out, and a pre-js `.click()` never changed the page). So the reference was recorded with a separate Playwright script:
- A real mouse click at the card, then Approve.
- `recordVideo` at 1440x1100.
- `frames.ts` to extract frames, cropped to 272,465,1136,600, at 10 fps for the first 6 s and 2 fps for approval.
- Event times were read off those frames, accurate to about 100 ms.
- The reference video was real-clock, with no virtual clock and no per-frame track.

Clone: `capture.ts --clock virtual`, 1440x900, `[data-stage]`, 10 fps (round 1) and 5 fps (round 2).

## Timings, ms after the click, reference vs clone

`compare.ts` and `easing.ts` were not run: the reference frames have no frame-exact alignment with the clone. Reference values are read from the frames; clone values are the timeline constants, confirmed on the clone sheets.

| Row | Reference | Clone | Result |
|---|---|---|---|
| User bubble in | about +40 | +40 | pass |
| Step 1 row, spinner | about +200 | +200 | pass |
| Step 1 done, step 2 row | about +900 | +900, +330 | pass |
| Step 2 done | about +1650 | +1650 | pass |
| Step 3 row, then done | about +1500, then +2250 | +1500, then +2250 | pass |
| Reply words, blur-in | begin about +2300, finish about +3400 | +2300, 34 ms stagger, finishes about +3150 | start passes; finish about 250 ms early (not measured to the word) |
| Card in (blur-up), 700 ms | about +3300 | +3300 | pass |
| Countdown ring, "30s" | 30 s | 30 s | pass |
| Approve to Sign check | about +900 | +900 | pass |
| Submitted check | about +3000 | +3000 | pass |
| Confirmed | about +3500 | +3500 | pass |
| Balance tick | at Sign done | at Sign done | pass |

Easing family: the entrances are blur-up and rise with an ease-out curve in both. Curves were not fitted.

Mean mismatch: not computed.

## Residual deviations
- **No frame compare.** Timing rows carry about ±100 ms from the real-clock reference video taken under shared load. Re-check with `compare.ts` when the machine is less loaded.
- The reference's header pill read "Confirmed" while the Submitted step was still spinning (about +3 s after Approve). The clone keeps the pill in step with the stepper (Signing, Pending, Confirmed), treating the reference's behaviour as a quirk.
- The reply sentence finishes about 250 ms earlier than the reference (not measured to the word); the per-word stagger was estimated from blurred frames.
- The thread is bottom-anchored with a 22 px top fade. As the card grows, the content slides up at the card's own pace, not at the reference's scroll easing (not measured).
- The countdown re-roll in the clone is an addition; the reference was not watched beyond 30 s.
