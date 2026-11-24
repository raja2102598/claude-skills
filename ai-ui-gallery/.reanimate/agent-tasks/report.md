# agent-tasks: reanimate report

**Cloned:** the beUI Pro "Background Agents → Agent list" preview (https://pro.beui.dev/components/background-agents). One auto-played run after a remount, about 10.8 s long:
- a queued agent starts
- a running agent fails
- two agents roll through their steps while their progress rings fill and timers tick
- both finish with a diff
- the card rests with the amber needs-you ping

**Fidelity:** motion-faithful (paid catalog, source locked). Everything visible is ours:
- copy: fictional repos and tasks
- palette: warm graphite, violet running ring, mint done, coral failed, amber needs-you
- fonts: Figtree and IBM Plex Mono
- icons: lucide

**Also rebuilt with our copy:** the reference's own interactions, which are not part of the timed compare.
- Rows work as an accordion: the chevron rotates and the panel opens with height, opacity and blur.
- Needs-you answers resume the agent.
- Failed runs offer Retry, which re-runs them.
- Done rows show Open PR / View diff and a file count.
- Running rows have a Stop button.
- A task typed into the composer enters at the top and starts when fewer than 3 agents are running.
- The list scrolls past 428 px, so the composer stays on stage (a CSS-only change after the final capture; the demo list is 426 px, so the cloned layout is unchanged).
- Checked in the browser with no console errors.

**Code:**
- `src/clones/agent-tasks/index.tsx`: state machine, scheduler, rows, keyed cross-fade "Swap"
- `data.ts`: agents, copy, scripted times
- `agent-tasks.css`: fonts, palette, keyframes
- `meta.ts`

**How it runs:**
- **Trigger:** plays on mount.
- **Replay:** `window.dispatchEvent(new Event("reanimate:replay"))` remounts it.
- **Scheduling:** transitions and timer ticks fire from timeouts set for their exact time, as in the reference. A rAF loop writes the ring stroke-dashoffset straight to the DOM.
- **Short opacity/blur/transform swaps:** CSS keyframes, so they behave the same on the real and the virtual clock.
  - subtitle roll: 300 ms easeOutExpo
  - marker exit: 120 ms cubic-bezier(.4,0,1,1)
  - marker enter: 300 ms spring sampled as `linear()`, fitted to the reference curve with ω 28.9 and ζ 0.94 (max error 0.0012)

## Capture

Both sides use the same settings:
- `--viewport 1440x1400 --trigger none --wait-before 3500 --pre-roll 0 --duration 11500 --fps 20 --clock virtual`
- crop 496x590
- `--pre-js` remounts the demo:
  - reference: clicks `#list button[aria-label="Refresh preview"]`
  - clone: dispatches `reanimate:replay`

Notes on the crop:
- The reference page shifts up 4 px after load, so its card sits at (24,20) in the crop, not (24,24).
- The final clone frames were therefore compared re-cropped 4 px lower (equivalent to `--clip 472,409`). The extra bottom rows are stage background.

Notes on WAAPI rows:
- The reference's motion runs opacity and blur through WAAPI. These collapse under the virtual clock.
- They were measured with real-clock rAF probes that also log `getAnimations()`, on both sides (kept out of git).
- Round 3 only changed how events are scheduled, not the keyframes, so the round-2 probe still covers the final code for these rows.

## Verification (round 3 of 3)

**compare.ts** (offset 0):
- mean mismatch **4.57%**, worst frame 4.7% at 2.0 s
- at rest about 4.5%, which is copy, palette and fonts
- the reference crop and the clone crop line up to the pixel: card 448x542, rows 57/197/57/57/56

**Whole-window timing metric:** reports FAIL (start −8.05 s). This is an artefact:
- The reference's per-frame activity stays under compare.ts's detector, because its WAAPI fades collapse to one frame under the virtual clock.
- Read burst by burst instead, the 10 activity bursts match one to one:
  - 8 start on the same frame: 2, 34, 41, 55, 93, 107, 145, 159
  - the 2 "done" bursts start one 20 fps frame later (196→197 and 210→211). The real offset is 17 ms (see row 11).

**Event times** (60 Hz virtual track, t after the remount): identical on both sides.
- 100: row 5 starts
- 1700: row 3 fails
- 2000 / 4617 / 7217: row 1 steps
- 2700 / 5317 / 7917: row 5 steps
- 9817: row 1 done
- 10517: row 5 done

| # | spec row | timing err | easing (ref → clone) | numbers | result |
|---|---|---|---|---|---|
| 1 | no entrance on mount | 0 | — | frame 0 is settled on both sides | pass |
| 2 | row 5 queued → running, header 3 running | 0 (100) | rows 6-8 | header and timer change at frame 100 on both | pass |
| 3 | row 3 running → failed | 0 (1700) | rows 6-8 | | pass |
| 4 | row 1 step lines | 0 (2000/4617/7217) | row 6 | | pass |
| 5 | row 5 step lines | 0 (2700/5317/7917) | row 6 | | pass |
| 6 | subtitle roll: y ±16, opacity, blur 2px | first move 17 ms (clone) vs 33 ms (ref); settles at 217 ms on both | easeOutExpo 300 → easeOutExpo 300 (CSS) | y meanAbsDiff 0.37 px (2.3% of travel) on row 5, 0.46 px (2.9%) on row 1, 0.03 px on row 3. Real-clock opacity at 33/50/100 ms: ref .19/.45/.83, clone .32/.54/.86 | pass |
| 7 | marker exit: opacity and scale → .5 | ≤ 8 ms | ease-in (.4,0,1,1) 120 → same | real-clock opacity at 33/67/100/133 ms: ref .97/.77/.46/.06, clone .96/.76/.44/.04 | pass |
| 8 | marker enter: opacity, blur 3px, scale .5 → 1 | ≤ 17 ms | spring `linear()` 300 → fitted spring 300 | scale meanAbsDiff .010 (2.0% of travel) on row 5, .019 (3.8%) on row 1, .001 on row 3. Real-clock opacity at 33/67/100/133 ms: ref .03/.36/.67/.85, clone .09/.44/.72/.88 | pass |
| 9 | ring fill, linear per frame | 0 | linear → linear | real-clock DOM fit, slope /s and p(0), ref vs clone: row 1 .07685/.2380 vs .07694/.2385; row 3 .09408/.3284 vs .09653/.3267 (only 1.7 s of data); row 5 .09610 vs .09603 (start −.0201 vs −.0191). Pixel arc coverage, mean diff in turns: rows 3/5 .005/.006 | pass |
| 10 | timers (1 s ticks) | 0 | step | same tick frames: row 1 at 1000…9000, row 3 at 1000, row 5 at 100 + 1000k | pass |
| 11 | done swaps (rows 1 and 5) | ≤ 17 ms | rows 6-8 | the ref's label and header switch by 9800/10500, the clone's at 9817/10517 (one 20 fps frame later in the sheets) | pass |
| 12 | header summary text | 0 / ≤ 17 ms | instant | 100, 1700, done events | pass |
| 13 | rest after about 10.8 s; only the ping moves | 0 | CSS 1 s (0,0,.2,1) loop on both | no other activity after frame 214 | pass |

Sheet: `compare-3/sheets/compare-01.webp` (the whole run, every 1.2 s). The frame-by-frame key-moment sheets stay out of git.

## Residual deviations

1. **Cross-fades show as gradual fades in the clone's virtual-clock frames but as one-frame cuts in the reference's** (bursts at 34-38 and 197-200: activity .0106 vs .0075). This is the WAAPI collapse under the virtual clock. On the real clock, both sides follow the same curves (rows 6-8).
2. **The clone's entering subtitle and marker start about 8 to 16 ms before the reference's.**
   - The reference starts its JS y/scale one rAF after the state change; the clone uses a 16 ms CSS delay.
   - Max difference is 4.8 px on the first moving frame. Mean is 2-4% of travel.
3. **The "done" swaps land 17 ms later than the reference's label switch.**
   - The reference flips the right label and header at ≤ 9800 ms and starts the marker and subtitle tweens at 9817.
   - The clone does all of it at 9817. This is within ±80 ms.
4. **The pixel arc coverage of row 1 reads up to .067 turn lower in the clone.** This is a classifier artefact:
   - The antialiased edge of the lighter violet arc is under-counted.
   - The DOM fits agree to .0001/s, and zoomed frames at 6 s and 9 s show the same arc length.
5. **About 4.5% static mismatch** from our copy, palette and fonts (Figtree / IBM Plex Mono vs Geist).

## Rounds

1. **Layout and sequence matched**, but every event landed one frame late: the rAF polling read 999.99 ms on the virtual clock.
2. **Added +0.5 ms and scripted the reference's measured step times** (4617/5317/7217/7917/9817/10517). The real-clock probe matched the WAAPI curves. Some events were still one rAF late, because rAF ticks are not aligned to the remount.
3. **Moved transitions and timer ticks to timeouts set for their exact time**, as the reference does. All event times now match on the 60 Hz track. The 4 px crop offset was found and corrected in the compare.
