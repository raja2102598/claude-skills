# generative-ui: reanimate report

**Fidelity: motion-faithful.** The reference is beUI Pro "Crypto Agent" (paid), https://pro.beui.dev/components/crypto-agent. Its transaction-chat preview was cloned and cropped to 1136x600. The preview opens on a welcome screen with three suggestions. Clicking "Swap tokens" plays the whole reply:
- The user bubble appears.
- A "Thinking..." line shows, then three tool steps resolve one by one.
- A sentence streams in word by word.
- A generated swap card appears: a quote with a 30 s countdown ring and Decline / Approve buttons.
- After Approve, the button reads "Confirm in wallet" and Decline leaves. A Sign, Submitted, Confirmed stepper opens, and the header wallet balance ticks down.

**Verification status (re-check): frame-compared (reference and clone captured with the same settings, `--clock virtual`, plus real-clock rAF probes for the WAAPI rows).**

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

Both sides were captured with `capture.ts --clock virtual`, viewport 1440x1100, crop `272,465,1136,600`.

- **Main turn:** 25 fps, 6 s. The reference trigger was a click on `button[aria-label="Swap 0.5 ETH to USDC"]`. That invisible overlay button sits on top of the suggestion; clicking the `<p>` text times out because the overlay intercepts the click. The clone trigger was `?auto=0` plus `[data-gu-start]`. Reference frames are `ref-3`, clone frames are `clone-3` (before the fix) and `clone-5` (after).
- **Approve leg:** `--trigger none` with a `--pre-js` that clicks Swap at 200 ms and Approve at 4000 ms (virtual time), 20 fps, 8.5 s. Reference frames are `ref-ap`, clone frames are `clone-ap` (before) and `clone-ap2` (after).
- **WAAPI trap:** under the virtual clock the reference's WAAPI entrances (bubble, step rows, card) collapse into single-frame snaps. Their durations and easing therefore come from real-clock rAF probes (`rt-probe*.ts` in `.reanimate/generative-ui/`), run on the reference and the clone with the same click.
  - The probes log per-frame DOM text changes plus computed opacity, transform and filter, resolved to about 17 ms.
  - All "ms" values below come from those probes, measured from the click. Clone probe values include about 10 to 20 ms of timer-to-rAF latency, which I compensated for.
- **Previous version:** the earlier report's times came from a real-clock video taken under heavy load. They were wrong by 0.3 to 0.7 s in places, and the clone was retimed from them.

## Compare results (final captures)

| Leg | Frames | Mean mismatch | Timing error (clone minus ref) |
|---|---|---|---|
| Main turn (`compare-5`) | 147/151 compared, offset -4 | 3.50 % (threshold 5 %) | start 0 s, end -0.08 s, duration -0.08 s: PASS (limit 0.08 s). `compare.ts` reports peak -0.52 s because the reference's peak is a single-frame WAAPI snap of the card. |
| Approve leg (`compare-ap2`) | 170/171 compared, offset -1 | 2.87 % | `compare.ts` end -1.25 s, flagged FAIL. This is a metric artefact: the reference's late activity (frame 142) is the Confirmed state, which the clone has at the same time. Real timing from the probes is within 20 ms (below). |

Before the fix the main turn read mismatch 3.56 % with timing error end +0.72 s FAIL, clone card at +3.5 s against the reference's +2.6 s.

The mismatch is dominated by layout and styling, not timing:
- The reference thread is left-aligned, with the bubble above the steps.
- The clone's bubble sits right and its swap card is taller.

## Per-event times, ms after the click (real-clock probes)

**Main turn**

| Row | Reference | Clone (measured, after fix) | Result |
|---|---|---|---|
| Welcome fade-out | starts about +50, 125 ms, opacity only | +0, 125 ms, opacity only | pass |
| User bubble in | +226 | +231 | pass |
| "Thinking..." line | +226 to +533 | +266 to +532 | pass |
| Step 1 row in | +533 | +532 | pass |
| Step 1 done, step 2 row in | +1046 | +1048 | pass |
| Step 2 done, step 3 row in | +1558 | +1565 | pass |
| Step 3 done, reply starts | +2094 | +2110 | pass |
| Reply words | stagger about 21 ms, about 180 ms to opaque, last word done about +2.6 s | 21 ms stagger, 260 ms each, done +2587 | pass, residual about 40 ms |
| Card in | +2611 | +2618 to +2630 | pass |

**Approve leg**

| Row | Reference | Clone (measured, after fix) | Result |
|---|---|---|---|
| Button label to "Confirm in wallet" | +273 | +286 | pass |
| Decline gone | text gone at +739 | clone fade starts +480, 260 ms, gone about +740 | pass (reference fade start not resolved) |
| Stepper opens, Sign done, Submitted spinning | +1485 | +1486 | pass |
| Submitted done and Confirmed | +3143 (text colour ramp +3143 to +3434) | +3135 | pass |
| Balance tick, 22,237.60 to 22,233.62 | +3120 | +3135 | pass |
| "Done" text and explorer line | +3116 | not in clone (pill and stepper show Confirmed instead) | residual |

The reference's step rows alternate every 512 ms. The old assumption that the header pill reads "Confirmed" early (about +3 s before Submitted ended) matches: in the reference all three happen at about +3.1 s.

## Easing per row (reference, from rAF probes)

| Row | Reference | Clone |
|---|---|---|
| User bubble | opacity 0 to 1 and translateY 7.5 px to 0, about 250 ms, exponential ease-out (about 49 % at 28 ms) | `gu-rise`, 250 ms, `cubic-bezier(.16,1,.3,1)`: match |
| Step rows | translateY 4 px to 0 plus opacity, about 250 ms, exponential ease-out (56 % at 23 ms) | `gu-rise-s`, 250 ms, same curve: match |
| Words | opacity and blur, about 180 ms to .99, ease-out | `gu-word`, 260 ms, same curve: close |
| Card | translateY 11 px to 0, blur 6 px to 0, opacity 0 to 1, about 460 ms, exponential ease-out | `gu-card-in`, 460 ms, same values: match |
| Welcome out | opacity 1 to 0 in about 125 ms | opacity only, 125 ms: match |
| Confirmed label | colour ramp about 300 ms | CSS transition 200 ms: close |

The fitted curve family is an exponential ease-out, `cubic-bezier(.16,1,.3,1)`. I read it off the opacity and translate samples. I did not run `easing.ts`, because the reference WAAPI rows have no track under the virtual clock.

## Residual deviations
- **Card height.** The clone's swap card is about 1.35x taller (66 px legs). Once the stepper opens, the thread overflows the 600 px stage and the card header, including the Confirmed pill, scrolls under the top fade. The reference keeps it in view. This is a styling difference and was left alone as asked. A shorter leg row would fix it.
- **Thread layout.** The clone's bubble is right-aligned and the reference's is left-aligned. This drives most of the 2.9 to 3.5 % mismatch.
- **Word stagger.** Measured about 21 ms with about 180 ms to opaque from noisy opacity counts. The clone's word finish is within about 40 ms of the reference. I did not fit the blur curve.
- **Decline exit.** Only the end time (+739) is known on the reference, so the clone's 260 ms fade-out is an estimate.
- **Missing end state.** The reference adds a "Done. You swapped 0.5 ETH for ..." line and a "View on explorer" link at +3116. The clone shows the explorer line from stepper open and has no "Done" sentence.
- **Window metric.** `compare.ts`'s motion window and peak are distorted on the reference because its WAAPI rows snap under the virtual clock. The window is measured on one bursty frame, and the final-frame flags above are artefacts. The per-event times above are the real numbers.
- **Clock error.** All reference times are probe-resolved to about 17 ms (rAF) and include about 10 to 20 ms of click-to-first-frame latency. The clone's constants were shifted by 15 ms to compensate.
- **Re-roll and Decline.** The countdown re-roll and the Decline path are additions the reference was not watched for; I did not watch the reference beyond +8 s.
- **Thinking dots.** The clone's three-dot pulse is a simple opacity cycle, not measured on the reference.
