# ai-avatar: reanimate report

**Fidelity: motion-faithful.** The reference is the Arc UI "AI mascot" preview card (https://uiarc.dev/components/ai-mascot, card `[class*="ai-mascot_card"]`, 560x319). The component is marked Pro and no license was verified, so the clone draws its own character, "Pip", with its own palette, copy and code. The reference's artwork was not copied.

## Code
- `src/clones/ai-avatar/index.tsx`
  - Pip is an SVG whose pose is updated every rAF from `performance.now()`.
  - A rAF-driven tour state machine advances the states.
  - Exponential smoothing (tau 60-140 ms) blends the pose between states.
  - The companion path leads its target by the smoothing tau, so a moving dot does not lag.
  - Everything is JS-driven, so it runs the same on the virtual clock and the real clock.
- `src/clones/ai-avatar/avatar.css`
  - Label crossfade and shimmer, and the switcher pill slide (CSS).
- `src/clones/ai-avatar/meta.ts`
  - Stage 560x319 on #fffdf8.
- Trigger: mount. Captures set `window.__pipT0` through a pre-js to start the tour at a fixed phase.

## Method
- Both sides: `--clock virtual --fps 20 --duration 21000 --trigger none`, 560x319 card crop. The reference was captured with `--wait-before 5500`, the clone with `--wait-before 300 --pre-js` (resets the tour clock).
- compare.ts runs with `--offset 0`. With the clone's continuous idle bob, auto-align picks +15 frames (it finds the clone's motion start earlier than the reference's), which is a false result.
- The tour was measured on the reference with a 24 s real-clock probe of `data-status`, then refined by detecting status-line changes in the 20 fps frames.
- The companion dot, the body centroid and the eye whites were tracked per frame on both sides. Connected components of dark pixels were used for the reference. Amber and teal colour masks were used for the clone.
- Rounds: round 1 (12.6 s) found a 0.3 s phase error. Round 2 fixed the phase and the durations. Round 3 (compare-4) fixed the tour step durations. Fix round 1 (clone-5, compare-5) shifted phase by -50 ms and re-measured the orbit, sweep, blinks, hop and shake. Fix round 2 (clone-6, compare-6) tuned the writing return and the error-shake delay.

## Verification (compare-6, 425 frames, 21 s, offset 0)
compare.ts on the whole card: mean mismatch **5.80 %** (threshold 5 %, FAIL, see deviation 1). Timing error: start -0.05 s, end 0 s, duration +0.05 s, peak 9.45 s → PASS (limit 0.08 s). Label strip only: mean mismatch 8.5 %, timing error start -0.05 s, end -0.05 s, duration 0 s → PASS.

State changes (status-line detection, 50 ms/frame): writing → done 106 / 106, done → idle 152 / 152, idle → thinking 188 / 188, thinking → error 223 / 223, error → idle 262 / 262, idle → listening 343 / 343 (reference / clone). All 0 ms.

| # | element / property | reference | clone | result |
|---|---|---|---|---|
| 1 | tour sequence and every state-change time | 6 changes as above | identical frames | pass, 0 ms |
| 2 | thinking orbit | period 2.3 s; right extreme (340,64) at +0.28 s after entry; left extreme x 219; back-top y 50; home (325,63) | same-frame distance mean 6.3 px (max 44 px on the frames where the dot enters or leaves the hidden front arc); best lag -15 ms | pass |
| 3 | writing sweep | y ~180; x 248→311 in 1.2 s, ease-in-out; arced return of ~0.3 s up to y 172; period 1.7 s; starts at 0.15 s after entry | x error mean 4.5 px (max 27 px at the return edge); same period and phase after the return fix | pass |
| 4 | blinks | closed at frames 58, 203, 289, 348 (~150 ms), randomised gaps of 7.25 / 4.3 / 2.95 s (mean ~4.8 s), plus reopen on state change at 109 and 155 | closed at 57, 202, 288, 348, plus 107 and 153/155 on the state changes | pass, ≤ 1 frame |
| 5 | idle body bob | y 108.8 to 113.9 px (4.8 to 5.1 px peak to peak), period ~3.2 s, max at frame 298 | 105.2 to 110.2 px (4.9 px peak to peak), max at frame 297 | pass |
| 6 | done | no hop; body rises ~4 px in 5 frames; sparkles at (326,59) and (341,79); companion disappears | body rises 2 svg px; sparkles at the same positions; companion hidden | pass |
| 7 | error shake | body x +6.3 px peak at frame 224, ±1 px by 227, ~0.3 s decay | +4.2 px at 224, ±1 px by 227 | pass |
| 8 | listening companion | dot at (320,55); area pulses 87 to 136 px² with a ~0.95 s period | same position and pulse | pass |
| 9 | layout: ref body centre ~110 px, ground ellipse ~166 px, label y ~234, switcher row y 271-310 | | within ~4 px | pass |

Sheet: `compare-6/sheets/compare-01.webp`.

## Residual deviations
1. **Mean mismatch 5.8 % against the 5 % gate.** Constant across all frames (5.6 to 6.3 %). It is the character's own colours, shape and cream card against the reference's black pebble on white. It is not motion, and motion-faithful work allows different art.
2. **Orbit and sweep error is not zero.** Orbit same-frame mean 6.3 px (max 44 px), sweep mean 4.5 px (max 27 px). The max values are at the dot's entry and exit of the hidden front arc and at the return edge, where the tracker sees a different shape or a different edge of the dot than the reference.
3. **Error-shake peak is 2 px smaller than the reference** (+4.2 px against +6.3 px).
4. **Blink schedule is a repeat.** The measured randomised gaps loop with the 20.7 s tour; they are not redrawn each loop.
5. **Real-clock tour jitter.** The reference tour has real-clock jitter (about ±100 ms per step); the clone is a fixed schedule.
6. **Click behaviour.** Clicking a state pauses the tour and plays that state. The reference's click behaviour was not captured.
