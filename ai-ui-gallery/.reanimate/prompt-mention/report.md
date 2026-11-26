# prompt-mention — reanimate report

**Fidelity**: motion-faithful (UIStacks "Mention prompt", https://uistacks.dev/components/mention-prompt; UIStacks Pro, paid; no open-source license). Cloned: the composer's @-mention / slash-command picker and its 12.0 s autoplay loop. `/` opens a command list, `@` opens agents and people. The list sits at the caret, narrows as you type, closes on a trailing space and reopens for a two-word name. A pick sits in the text as a chip. Also cloned: the spring pop on open, the 100 ms exit shrink, the caption that fades out while the list is open, and the active-row highlight that glides when the list jumps.
**Original content:** palette, Geist font, lucide icons, fictional commands, agents and people (/checklist, @Vesper, @Marlon Hale…), and copy.
**Added**: nothing visual. Keyboard (↑/↓, Enter/Tab, Esc), pointer pick, the toolbar @ and / buttons, and Backspace-removes-a-chip are working versions of what the reference's hint row and caption describe; all were tested with no console errors.

**Code**: `src/clones/prompt-mention/index.tsx` (component plus demo driver), `data.tsx` (fictional items), `prompt-mention.css` (styles plus all keyframes and transitions), `meta.ts`.
**Trigger**: plays on load. The loop runs on page time from navigation, as the reference's does. Any real key or pointer input ends the demo. `?autoplay=0` disables it.

## Captures
- Reference: virtual clock, 20 fps, 12.3 s starting 11.7 s after load (the second loop). A pre-js finishes the reference's WAAPI animations as they start.
- Clone: same viewport, crop size, pre-js, fps, duration and clock. Two settings differ, to line up the loops: wait 11567 ms, and a longer network wait so the lazily loaded module has mounted. The leftover ±100 ms start-time jitter of the virtual clock is removed with `compare.ts --offset -2`.
- WAAPI rows: real-clock rAF probes on both sides, plus the reference's `getAnimations()` list. Probe scripts and raw captures stay out of git.

## Last compare round (round 1, `compare-1/`)
- Frames compared: 245/247 at 20 fps, clone offset −2 frames. **Mean mismatch 1.64%** (PASS ≤ 5%). Worst frame is #204 at 3.1%: the third list open, where the reference is drawn fully opaque and the clone is mid-fade (see residual 1).
- compare.ts activity-curve "timing error" says FAIL (peak −3.7 s). That metric doesn't fit here: the loop has 18 similar events and its "peak" lands on a different text-heavy frame on each side. The per-event table below takes its place.

Sheet: `compare-1/sheets/compare-01.webp`.

### Sequence timing (track.json, ms after the loop's first list open)
| event | ref | clone | err |
|---|---|---|---|
| open `/` | 0 | 0 | 0 |
| filter → 2, → 1 | 1133, 1183 | 1133, 1183 | 0.1 |
| exact match: chip + anchor jump | 2633 | 2633 | 0.1 |
| close (space) | 2700 | 2700 | 0 |
| open `@` | 5150 | 5150 | 0 |
| filter → 2, → 1 | 6283, 6333 | 6283, 6333 | 0.1 |
| close | 7700 | 7700 | 0 |
| open `@` | 9850 | 9850 | 0 |
| filter → 3 (2 groups), → 2, → 1 | 9883, 9933, 9983 | same | 0.1 |
| line wrap: anchor jumps to line 2 | 11233 | 11233 | 0.1 |
| close (space after first name) | 11300 | 11300 | 0 |
| reopen (last name) | 11350 | 11350 | 0 |
| exact full name: anchor jump | 11483 | 11483 | 0.1 |
| close | 11550 | 11550 | 0 |

Max |err| is 0.1 ms over 18 events. Period: 12000 ms for both.

### Easing per element
| element / row | reference | clone | match |
|---|---|---|---|
| popover opacity on open (row 4, real clock) | reaches 0.99 at 162 / 172 ms; fit "ease ~208 ms" / "material ~200 ms" (400 ms spring, overshoot clamped) | reaches 0.99 at 165 / 148 ms; fit "ease ~203 ms" (same 400 ms spring) | PASS (≤ 24 ms) |
| popover scale / y on open (row 5, real clock) | s 0.972 / 0.988 / 0.998 at 50 / 100 / 150 ms; y −4 → peak +0.12 px; scale overshoot 0–1.2% | s 0.968–0.975 / 0.988–0.992 / 0.998–1.000; y −4 → peak +0.12 px; scale overshoot 3% | PASS (spring family) |
| popover exit (row 7, real clock) | opacity 0.67–0.70 at 33 ms, 0.26–0.28 at 67 ms; gone after 117 ms; scale → 0.961 | opacity 0.52–0.74 at 33 ms, 0.15–0.31 at 67 ms; gone after 117–133 ms; scale → 0.960 | PASS |
| caption opacity (row 6, virtual) | cubic-bezier(0.4,0,0.2,1), 100 ms, RMSE 0.0004 | cubic-bezier(0.4,0,0.2,1), 100 ms, RMSE 0.0005 | PASS |
| list height on filter (row 3) | instant | instant | PASS |
| anchor jumps (row 8) | instant: x 37.1 → 113.5; 221.1 → 37.1 with y +22.1; 37.1 → 135.6 | instant: x 37.1 → 99.4; 221.1 → 37.1 with y +22.1; 37.1 → 124.5 | PASS (x differs with the text, residual 5) |
| reopen during exit (row 10) | resumes from scale 0.973 | resumes from the exit's current opacity and scale | PASS |
| chip, hint, send (rows 11–12) | same frame | same frame | PASS |

### Spec rows
Rows 1–12 all PASS.

## Residual deviations
1. **Open frames in the virtual capture.** The reference pops to full opacity in one frame because the pre-js finishes its WAAPI opacity. The clone shows its real spring fade over 2–3 frames (about 150 ms), adding 0.5–1.5% mismatch on frames #8–9, #111–114, #204–206 and #234. Real-clock probes show the two curves match (row 4).
2. **Exit frames in the virtual capture**, same cause: the reference vanishes in one frame, while the clone's 100 ms ease-out shows over 2 frames (#61, #161, #238).
3. **Open-spring scale overshoot** is 3% against the reference's 0–2%. That is 0.0004 scale, about 0.1 px on the 288 px popover. One spring drives both opacity and transform.
4. **Exit scale starts about 15 ms sooner** than the reference's JS-driven tween (scale 0.973–0.980 against 0.986 at 50 ms). This is within ±80 ms.
5. **Anchor x after an exact match** is 99.4 against 113.5 crop px ("/checklist" vs "/summarize"), and 124.5 against 135.6 for the full-name jump. The cause is our own copy in Geist versus their copy in Inter. The demo sentence was chosen so the wrap to line 2 happens on the same keystroke.
6. **The highlight glide after a jump** (300 ms) cannot be checked: in the reference the list closes 50 ms after every jump. Only the first frame (highlight at its old screen position) is compared, and it matches.
7. **Capture alignment**: the clone needs wait 11567 instead of 11700, plus a −2 frame offset. The virtual clock's start time varies by about ±100 ms per run, and the dev server loads the clone lazily.
