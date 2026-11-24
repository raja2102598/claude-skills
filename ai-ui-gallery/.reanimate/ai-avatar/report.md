# ai-avatar: reanimate report

**Fidelity: motion-faithful.** The reference is the Arc UI "AI mascot" preview card (https://uiarc.dev/components/ai-mascot, card `[class*="ai-mascot_card"]`, 560x319). The component is marked Pro and no license was verified, so the clone draws its own character, "Pip", with its own palette, copy and code. The reference's artwork was not copied.

## Code
- `src/clones/ai-avatar/index.tsx`
  - Pip is an SVG whose pose is updated every rAF from `performance.now()`.
  - A rAF-driven tour state machine advances the states.
  - Exponential smoothing (tau 60-140 ms) blends the pose between states.
  - Because everything is JS-driven, it runs the same on the virtual clock and the real clock.
- `src/clones/ai-avatar/avatar.css`
  - Label crossfade and shimmer, and the switcher pill slide (CSS).
- `src/clones/ai-avatar/meta.ts`
  - Stage 560x319 on #fffdf8.
- Trigger: mount. Captures set `window.__pipT0` through a pre-js to start the tour at a fixed phase.

## Method
- Both sides: `--clock virtual --fps 20 --duration 21000 --trigger none`, 560x319 card crop. The reference was captured with `--wait-before 5500`, the clone with `--wait-before 300 --pre-js` (resets the tour clock).
- The tour was measured on the reference with a 24 s real-clock probe of `data-status`, then refined by detecting status-line changes in the 20 fps frames.
- Probe result: thinking 2614 ms, writing 3519, done 2315, idle 1816, thinking 1717, error ~1960, idle ~4050, listening ~2200. The loop is ~20.7 s.
- Rounds:
  - Round 1 (12.6 s capture) showed the clone 0.3 s early.
  - Round 2 fixed the phase offset and the writing duration.
  - Round 3 (final, compare-4) fixed the late error, idle and listening durations.

## Verification (compare-4, 420 frames, 21 s)
compare.ts: mean mismatch **5.80 %** (threshold 5 %, FAIL, see deviation 1). Timing error: start 0 s, end +0.05 s, duration +0.05 s → PASS (limit 0.08 s). Peak frame 9.45 s on the clone against #36 on the reference (the two characters' biggest-activity frames differ because their art differs).

State-change frames (status-line detection, 50 ms/frame):

| transition | ref frame | clone frame | err |
|---|---|---|---|
| writing → done | 106 | 107 | +50 ms |
| done → idle | 152 | 153 | +50 ms |
| idle → thinking | 188 | 189 | +50 ms |
| thinking → error | 223 | 224 | +50 ms |
| error → idle | 262 | 263 | +50 ms |
| idle → listening | 343 | 344 | +50 ms |

Reference activity curve, every burst accounted for:

| time | burst in the reference | covered by |
|---|---|---|
| 1.7 s | thinking → writing | tour step 2 |
| 2-4.8 s | dashed line and dot sweep, period ~1.8 s | writing row |
| 5.2 s | done: arcs, hop, sparkles | done row |
| 7.6 s | done → idle, blink | idle row |
| 9.4-11 s | thinking orbit (front crossing ~0.8 s in) | thinking row |
| 11.2 s | error shake | error row |
| 13 s | error → idle | tour step |
| 14.1 s | idle blink | blink every 4.2 s |
| 17 s | listening entry, blink | entry blink |
| 19.3 s | thinking again | tour |

Round 1 compared only the first 12.6 s and round 2 only the first 12.6 s of the 21 s ref; compare-4 covers all 21 s.

| # | element / property | result |
|---|---|---|
| 1 | tour sequence and every state-change time | pass, ≤ 50 ms |
| 2 | status label swap and switcher pill follow the state | pass (same frames) |
| 3 | idle breathing, bob, glance, blink | present; blink phase not matched frame-by-frame |
| 4 | thinking orbit period 2.4 s, front crossing 0.8 s after entry | built from the measured trace, not numerically compared |
| 5 | writing sweep period 1.8 s | built from reading frames, not numerically compared |
| 6 | done hop, sparkles, ^ ^ eyes | pass visually in the sheet (done frames line up) |
| 7 | error shake, worried brows | pass visually |
| 8 | layout: ref body centre ~105 px, ground ellipse ~166 px, label y ~234, switcher row y 271-310 | within ~3 px |

## Residual deviations
1. **Mean mismatch 5.8 % against the 5 % gate.** Constant across all frames (5.6-6.3 %). It is the character's own colours, shape and cream card against the reference's black pebble on white. It is not motion, and motion-faithful work allows different art. No lower number is claimable without copying the artwork.
2. **Only transitions were measured per frame.** Orbit and sweep phases were set from the frame sheets, not from `easing.ts` tracks. The reference tracks only the static stage (SVG attributes), and the virtual clock does not expose the dot.
3. **Blink timing.** The reference blinks at 14.1 s and on entry to listening. The clone blinks every 4.2 s and on entry to idle and listening, so a few blinks land off.
4. **Real-clock tour jitter.** The reference tour has real-clock jitter (about +/-100 ms per step); the clone is a fixed schedule.
5. **Click behaviour.** Clicking a state pauses the tour and plays that state. The reference's click behaviour was not captured.

Sheet: `compare-4/sheets/compare-01.webp`.
