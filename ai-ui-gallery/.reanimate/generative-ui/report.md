# generative-ui: reanimate report

**Fidelity: motion-faithful.** The reference is beUI Pro "Crypto Agent" (paid), https://pro.beui.dev/components/crypto-agent. Its transaction-chat preview was cloned and cropped to 1136x600. The preview opens on a welcome screen with three suggestions. Clicking "Swap tokens" plays the whole reply:
- The user bubble appears.
- A "Thinking..." line shows, then three tool steps resolve one by one.
- A sentence streams in word by word.
- A generated swap card appears: a quote with a 30 s countdown ring and Decline / Approve buttons.
- After Approve, the button reads "Confirm in wallet" and Decline leaves. A Sign, Submitted, Confirmed stepper opens, Submitted and Confirmed land together, the balance ticks down and a "Done" line is added below the card.
- The thread is top-anchored and scrolls only when the content grows (card entry, stepper open, Confirmed), like the reference.

**Verification status: frame-compared** (reference and clone captured with the same viewport, fps and `--clock virtual`, plus real-clock rAF and scrollTop probes for the WAAPI rows).

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

Both sides were captured with `capture.ts --clock virtual`, viewport 1440x1100.
- **Reference:** `--clip 272,465,1136,600`.
- **Clone:** `--selector "[data-stage]"`, which resolves to clip 152,250,1136,600. The clone's stage sits at a different page position than the reference's preview, so the same page-coordinate clip cannot be used on both. An earlier round did that and its numbers were wrong.

Captures:
- **Main turn:** 25 fps, 6 s. The reference trigger is a click on `button[aria-label="Swap 0.5 ETH to USDC"]`, an invisible overlay that sits over the suggestion; clicking the `<p>` text times out. The clone trigger is `?auto=0` plus `[data-gu-start]`. Reference frames are `ref-3`, clone frames are `clone-6`, comparison is `compare-6`.
- **Approve leg:** `--trigger none` with a `--pre-js` that clicks Swap at 200 ms and Approve at 4000 ms (virtual time), 20 fps, 8.5 s. Reference frames are `ref-ap`, clone frames are `clone-ap3`, comparison is `compare-ap3`.

Under the virtual clock the reference's WAAPI entrances (bubble, step rows, card) collapse into single-frame snaps. Their durations, easing and the scroll behaviour therefore come from real-clock probes (`rt-probe*.ts` and `rt-scroll.ts` in `.reanimate/generative-ui/`), run on the reference and the clone with the same click.
- The probes log per-frame DOM text changes, computed opacity, transform and filter, and the thread's `scrollTop`.
- They resolve to about 17 ms.
- The "ms" values below are from those probes, measured from the click, and include about 10 to 20 ms of click-to-first-frame latency.
- The clone constants were shifted by about 15 ms to compensate.

An earlier version of this clone used times read from a real-clock video under heavy load. They were wrong by 0.3 to 0.7 s in places and were replaced.

## Compare results (aligned captures)

| Leg | Frames | Mean mismatch | Timing error (clone minus ref) |
|---|---|---|---|
| Main turn (`compare-6`) | 150 of 151, offset +1 | 2.73 % (limit 5 %) | start -0.04 s, end -0.12 s, duration -0.08 s, peak 0 s |
| Approve leg (`compare-ap3`) | 168 of 171, offset -3 | 2.45 % | `compare.ts` start -0.20 s, end -0.15 s, peak -0.20 s |

`compare.ts` flags both timing lines as FAIL because they exceed its 0.08 s limit. The main-turn end is one frame past it. On the Approve leg the window metric is distorted by the reference's WAAPI snaps and by the clone's composer fade at the click. The activity tables are more reliable:
- **Main turn:** the card burst lands on the same frame in both, #65 (2.60 s).
- **Approve leg:** the stepper opens at clone 5.35 s against reference 5.40 s. Confirmed lands at clone 7.00 s against reference 7.10 s. That is 50 to 100 ms early, within 2 frames at 20 fps.

The remaining mismatch (2.5 to 3.5 %) is mostly colours, fonts, token and orb styling and the bubble width, not timing or layout.

Sheets (final captures): `compare-6/sheets/compare-01.webp` (main turn) and `compare-ap3/sheets/compare-01.webp` (Approve leg).

## Per-event times, ms after the click (real-clock probes)

**Main turn**

| Row | Reference | Clone (after fix) | Result |
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
| Thread scroll at card entry | 0 to 16 px in about 50 ms | 0 to about 12 px in about 120 ms | pass (content height 622 against 618) |

**Approve leg**

| Row | Reference | Clone (after fix) | Result |
|---|---|---|---|
| Button label to "Confirm in wallet" | +273 | +286 | pass |
| Decline gone | text gone at +739 | fade starts +480, 260 ms, gone about +740 | pass (the reference's fade start is not resolved) |
| Stepper opens, Sign done, Submitted spinning | +1485 | +1486 | pass |
| Scroll at stepper open | 16 to 67 px in about 130 ms, ease-out | 22 to 67 px in about 130 ms, ease-out | pass |
| Submitted done and Confirmed | +3143 (text colour ramp +3143 to +3434) | about +3135 | pass |
| Balance tick, 22,237.60 to 22,233.62 | +3120 | +3135 | pass |
| Scroll at Confirmed | 67 to 135 px, content height 741 | 67 to 135 px, content height 741 | pass |
| "Done" line and explorer link | +3116 | +3135 | pass |

The reference steps are paced 512 ms apart, each row appearing as the previous one resolves. In the reference, Submitted done, Confirmed, the balance tick and the "Done" line all happen within about 25 ms, at about +3.1 s.

## Easing per row (reference, from rAF probes)

| Row | Reference | Clone |
|---|---|---|
| User bubble | opacity 0 to 1 and translateY 7.5 px to 0, about 250 ms, exponential ease-out (about 49 % at 28 ms) | `gu-rise`, 250 ms, `cubic-bezier(.16,1,.3,1)`: match |
| Step rows | translateY 4 px to 0 plus opacity, about 250 ms, exponential ease-out (56 % at 23 ms) | `gu-rise-s`, 250 ms, same curve: match |
| Words | opacity and blur, about 180 ms to .99, ease-out | `gu-word`, 260 ms, same curve: close |
| Card | translateY 11 px to 0, blur 6 px to 0, opacity 0 to 1, about 460 ms, exponential ease-out | `gu-card-in`, 460 ms, same values: match |
| Welcome out | opacity 1 to 0 in about 125 ms | opacity only, 125 ms: match |
| Confirmed label | colour ramp about 300 ms | CSS transition 200 ms: close |
| Thread scroll | fast ease-out, about 130 ms | cubic ease-out, 130 ms: match |

The fitted curve family is an exponential ease-out, `cubic-bezier(.16,1,.3,1)`, read off the opacity and translate samples. I did not run `easing.ts`, because the reference WAAPI rows have no track under the virtual clock.

## Residual deviations
- **Window metric.** `compare.ts`'s motion window and peak are distorted on the reference because its WAAPI rows snap under the virtual clock. Both legs show a "FAIL" on the timing line (main turn end -0.12 s). The per-event probe times above are the real numbers.
- **Reference card at 2.6 s.** The reference has already snapped the card in under the virtual clock, while the clone card is still fading in (full by about 2.8 s). This is an artefact, not a real offset.
- **Confirmed ramp.** In the Approve leg the clone's Confirmed lands 50 to 100 ms before the reference's in the virtual capture (clone 7.00 s against reference 7.10 s). That is within 2 frames at 20 fps. The probe times agree to within 25 ms.
- **Word stagger.** Measured about 21 ms with about 180 ms to opaque from noisy opacity counts. The clone's word finish is within about 40 ms of the reference. I did not fit the blur curve.
- **Decline exit.** Only the end time (+739) is known on the reference, so the clone's 260 ms fade is an estimate.
- **Composer.** The reference's input bar is below the visible stage. The clone keeps its own composer in the welcome state and fades it out when the turn starts.
- **Bubble width.** The clone's bubble is about 6 px wider than the reference's. This is a styling difference.
- **Thinking dots.** The clone's three-dot pulse is a simple opacity cycle, not measured on the reference.
- **Added states.** The countdown re-roll and the Decline path are additions. The reference was not watched beyond +8 s.
