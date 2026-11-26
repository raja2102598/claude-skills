# voice-conversation: reanimate report

**Fidelity**: motion-faithful (UIStacks "Voice call", https://uistacks.dev/components/voice-call, is UIStacks Pro, paid, no open-source license).
**Cloned**: one full cycle of the live preview card. Dialing → Ringing → In call with a fast-running timer. Five transcript rows stream in word by word, and the waveform follows whoever is talking. The Goal line goes asking → confirmed. Then Call ended, with the outcome card replacing Mute / Take over / Hang up. The demo loops like the reference.
**Original styling**: own slate/teal palette, Geist (Google Fonts), lucide icons (PawPrint tile, Sparkles agent avatar, Target / 3x3 dot loader / Check goal icons). Own fictional call: a vet booking at "Juniper Vet Clinic". Each line has the same word count as the reference (5/19/9/6/8).
**Added**: `?autoplay=0` waits for a click on an invisible 24 px corner button. This is the capture trigger and mirrors the reference's Replay click. Reduced motion turns off the rings, ping, waveform loop and blur.
**Code**: `src/clones/voice-conversation/`
- `index.tsx`: component, one rAF clock, loop.
- `script.ts`: the simulated call, with times.
- `springs.ts`: springs sampled into CSS `linear()` easings.
- `voice-conversation.css`: all opacity / transform / filter motion as CSS keyframes and transitions, so it runs the same on the real clock and on the virtual clock.

**Trigger**: plays on mount at `/c/voice-conversation` and loops every ~12 s (Dialing at 0.5 s, In call 00:02 at 2.5 s, Call ended with the outcome card at 9.5 s, back to Dialing by 12.8 s). No microphone or audio.

## Final round (3)

Both sides were captured with the same settings: viewport 1440x1100, crop 480x420, click trigger, 9.6 s at 25 fps, `--clock virtual`, trigger frame 5. Frames were compared from the trigger on. WAAPI rows were checked with real-clock rAF probes on both sides, aligned at t = click.

| check | result | pass |
|---|---|---|
| mean frame mismatch | 3.36% (worst 5.8% at 8.52 s) | PASS (≤ 5%) |
| activity timing (clone − ref) | start 0 s, end −0.04 s, duration −0.04 s | PASS (≤ 0.08 s) |
| virtual-clock region onsets | status Ringing / In call +1 frame (+40 ms); transcript 0; goal confirmed +40 ms; end swap and tile +40 ms; waveform speaker changes 0 / −40 ms | PASS |
| real-clock event onsets, worst | 58 ms (timer 00:26) | PASS (±80 ms) |

Sheet: `compare-3/sheets/compare-01.webp` (8 key moments, 0.24 s → 9.48 s). The full reading set stays out of git.

### Per spec row (real-clock probes; easing error as % of travel after the best shift, unshifted shift in ms)

| # | row | ref → clone start (ms) | easing match | pass |
|---|---|---|---|---|
| 1 | status "Dialing…" | 0 → 0 | n/a | PASS |
| 2 | avatar rings (ease-out, 1400 ms, 2nd at +700) | 0 → 0 | ring 1 scale max 0.9%, ring 2 opacity max 1.1% (+22 ms) | PASS |
| 3 | waveform idle profile | n/a | min/mean/max scaleY 0.246/0.378/0.540 on both sides | PASS |
| 4 | status swaps: out ease-out 150 ms; in spring ω20.8 ζ0.84 (450 / 250 ms) | Ringing 830 → 847; In call 1749 → 1738; Call ended 8484 → 8436 | in: opacity/blur max 3.9 / 11.6 / 5.0%, translateY max 4.0 / 8.3 / 5.1%, mean ≤ 1.9% (shift −10…−22 ms); out "Dialing": max 3.2%, mean 1.2% | PASS |
| 5 | pickup (rings off, ping on, row 1, Take over enabled, "· asking") | 1749 → 1738 | n/a | PASS |
| 6 | goal icon pop (spring ω22.8 ζ0.57) | pending → AI 1749 → 1738; AI → check 7873 → 7838 | AI: scale max 10.8% / mean 1.5%, opacity max 15.2% / mean 1.1% (−22 ms); check: scale 2.1% / 0.4%, opacity 2.4% / 0.3% | PASS |
| 7 | goal AI loader (800 ms steps, linear) | 1749 → 1738 | stepped opacity, same period | PASS |
| 8 | call timer (1 "s" per 250 ms) | 00:01 2012 → 2021; 00:05 3013 → 3032; 00:10 4281 → 4334; 00:20 6781 → 6808; 00:26 8262 → 8320 | n/a | PASS |
| 9 | row entrances 2–5 (opacity 450 ms, y 6 → 0 250 ms, spring as 4) | 2665 → 2631; 4716 → 4681; 5947 → 5899; 6946 → 6979* | opacity max 7.8 / 3.0 / 3.5 / 9.5%, translateY max 7.8 / 3.0 / 3.3 / 12.3%, mean ≤ 2.3% (shift +34 / −10 / −6 / +30 ms) | PASS |
| 10 | words (one per ~84 ms, first ~100 ms after mount, 200 ms fade + blur) | first words 1851 / 2748 / 4828 / 6047 / 7050 → 1834 / 2719 / 4781 / 6001 / 6998; last words 2194 / 4265 / 5499 / 6477 / 7615 → 2164 / 4214 / 5455 / 6456 / 7605 | row 2: 18 gaps in 1517 ms (ref) vs 1496 ms (clone), −1.4% | PASS |
| 10b | row avatar fade with first word | with 10 | same transition | PASS |
| 11 | waveform speaking loop (per-bar 1300–1750 ms, delay (i%5)×70) | with row mount | clone range 0.135–1.0 follows the keyframes from getAnimations; the probe cannot sample the ref's amplitude (see deviations) | PASS (by spec) |
| 11b | waveform colour per speaker | callee / agent / idle switch on the same frames (virtual clock 0 / −1 frame) | snap | PASS |
| 12 | goal confirmed (icon + "· confirmed") | 7873 → 7838 | "· confirmed" opacity max 2.3%, translateY max 2.4% | PASS |
| 13 | call ends: controls out 120 ms ease-out, tile → .6 | 8484 → 8436 | controls opacity max 9.5%, mean 2.4% (+6 ms) | PASS |
| 13b | outcome card (opacity 450 ms, y 8 → 0 + scale .98 → 1 250 ms) | 8484 → 8436 | opacity 5.0%, translateY 4.6%, scale 4.6% max | PASS |
| 13c | outcome badge pop (80 ms hold + spring ω23 ζ0.48) | 8484 → 8436 | max 3.9%, mean 0.4%; peak overshoot 1.06 (ref) vs 1.05 (clone) | PASS |
| 14 | loop reset to Dialing | 12030 → 11976 (−54 ms) | n/a | PASS |

*Row 5's mount reads as 6979 because of a long frame in the clone probe. Its first word lands at 6998, 52 ms before the reference's.

## Residual deviations

1. **End-of-call frames at 8.44–8.68 s (mismatch 5.1–5.8%).** Under the virtual clock the reference's motion/WAAPI swaps jump to their end state in one frame (activity spike at frame 211). The clone's CSS animations play their real 120–450 ms curves. This is a capture artefact on the reference side. The real-clock probes match within 5% of travel.
2. **Mismatch floor ~2–5% from styling.** Copy, palette, font (Geist vs Inter) and icons differ on purpose because the clone is motion-faithful. Layout proportions match: the card is 460x414 at zoom 0.92, the log is 204 px high, and the controls row is 79 px high.
3. **Call timer runs +9 to +58 ms behind the reference.** In the virtual-clock sheets the clone shows the previous second for 1–2 frames around some ticks (e.g. 2.04 s: ref 00:01, clone 00:00). Within ±80 ms.
4. **Unshifted entrance curves for row 2, row 5 and the AI icon peak at 34%, 27% and 35% of travel.** These come from the first probe sample landing late on the busy pickup and row-mount frames, not from the curve shape. After a 22–34 ms shift the errors fall to max 7.8–15.2% and mean 1.1–2.3%.
5. **Waveform speaking amplitude is verified only against the reference's getAnimations keyframes.** The reference animates its bars through WAAPI and leaves the inline style at 0.14, so the rAF probe cannot sample it. The idle profile matches exactly.
6. **Clone event times are ~35–50 ms early on the real clock (e.g. call end −48 ms) but ~40 ms late on the virtual clock.** `script.ts` times sit ~75 ms before the spec's probe times to absorb the clone's own render latency on the capture clock. Both clocks stay within ±80 ms.
