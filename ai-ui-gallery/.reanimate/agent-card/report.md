# agent-card: reanimate report

**Cloned:** the beUI Pro "Agent Team -> Org chart" preview (https://pro.beui.dev/components/agent-team), one auto-played run, about 18.5 s long. Source is locked and paid, so this is motion-faithful.

**Ours:**
- Copy: fictional agents Helm (lead), Scout, Crawler, Tally, Scribe, Forge and Probe, with models Nova 2, Atlas Pro, Atlas Flash, Nova Mini, Orion Pro and Orion Mini.
- Palette: ink blue-black with one hue per agent.
- Fonts: Instrument Sans and JetBrains Mono.
- Icons: lucide.

**Sequence (t after mount, calibrated to the reference frames):**
- Helm runs from 0.
- Starts: Scout 0.85 s, Crawler 1.85, Tally 3.25, Scribe 4.65, Forge 6.25, Probe 10.85.
- Done: Crawler 6.65, Tally 10.85, Scout 11.85, Scribe 13.85, Probe 15.85, Forge 16.25, Helm 18.25.
- Final costs $0.41 / .23 / .03 / .06 / .11 / .17 / .02, total $1.03.

**Motion built:**
- Connectors: a grey track with the agent hue scaling in, 200 ms expo, 100 ms after each agent starts. The bar scales from the centre, ticks and trunks from the top, stubs from the left.
- Cards: Queued cards sit at opacity .55 and go to 1 on start.
- Status pill: a 300 ms expo roll (old up 16 px, new in from 16 px, opacity, 2 px blur). The queued dashed circle becomes a progress ring that fills linearly, then a check and "Done".
- Header: the running count and the cost are rolling digit columns.
- Footer: the elapsed seconds tick.

**Code:** `src/clones/agent-card/index.tsx`, `data.ts` (scripted timeline), `agent-card.css`, `meta.ts`. Short transitions are CSS keyframes and transitions, so they behave the same on the real and the virtual clock. Plays on mount; `window.dispatchEvent(new Event("reanimate:replay"))` replays.

## Capture
Both sides: `--viewport 1440x1400 --trigger none --wait-before 3500 --pre-roll 0 --duration 19500 --fps 10 --clock virtual`, crop 1024x705.
- Reference: pre-js clicks "Refresh preview" in the Org chart toolbar.
- Clone: pre-js dispatches `reanimate:replay`.
- The reference capture crashed after 195 of 220 frames (machine overload). 19.5 s still covers the whole run, which ends at 18.3 s. There is no `track.json` for the reference.
- A real-clock probe of the reference did not advance (the page ran at about 2 fps under load). All times therefore come from the virtual-clock frames, read from pill-region luminance and connector pixel changes at 100 ms resolution.
- The clone's first capture ran exactly 300 ms early on every event. A 300 ms offset was added in `data.ts` (the reference's capture starts about 300 ms after mount).

## Verification (round 2 of 3)
**compare.ts** (`--fps 10 --offset 0`, 195/195 frames): mean mismatch **2.57%**, worst frame 2.8% at 10.9 s. The static mismatch is about 2.3% from copy, palette and fonts.

Sheet: `compare-2/sheets/compare-01.webp`.

**Event frames** (0-based 10 fps frame of the first change; reference vs clone are identical):
| # | spec row | ref frame | clone frame | timing err | result |
|---|---|---|---|---|---|
| 1 | Scout start | 9 | 9 | 0 | pass |
| 2 | Crawler start | 19 | 19 | 0 | pass |
| 3 | Tally start | 33 | 33 | 0 | pass |
| 4 | Scribe start | 47 | 47 | 0 | pass |
| 5 | Forge start | 63 | 63 | 0 | pass |
| 6 | Probe start | 109 | 109 | 0 | pass |
| 7 | Crawler done | 67 | 67 | 0 | pass |
| 8 | Tally done | 109 | 109 | 0 | pass |
| 9 | Scout done | 119 | 119 | 0 | pass |
| 10 | Scribe done | 139 | 139 | 0 | pass |
| 11 | Probe done | 159 | 159 | 0 | pass |
| 12 | Forge done | 163 | 163 | 0 | pass |
| 13 | Helm done | 183 | 183 | 0 | pass |
| 14 | connector draws (lead trunk and bar, 3 column ticks, Crawler stub, Tally trunk, Probe stub) | 10 / 11 / 10 / 48 / 64 / 20 / 34 / 110 | same | 0 | pass |
| 15 | progress ring, cost and timer vs frames | | | | pass: sheet and header totals read the same, costs finish at the same values |

## Residual deviations
1. **Whole-window compare.ts timing metric reports FAIL** (start 0.9 s, end 0 s). It is an artefact: the reference's frames 1-10 show activity from its mount entrance and WAAPI fades, which collapse under the virtual clock, and the clone does not clone them.
2. **Mount entrance not cloned.** The reference cards fade in with a short blur and translateY stagger at mount. The virtual-clock reference frames show it settled, and it was not measured on the real clock because the real-clock probe did not advance.
3. **Done pill transition is one 10 fps frame in the clone and two in the reference** (up to 100 ms). Not measured further, since 100 ms was the capture resolution.
4. **Easing is unmeasured.** The 200 ms expo connector draws and the 300 ms pill roll are not fitted: at 10 fps a connector draw is complete within one frame. The pill roll duration and easing are copied from the sibling agent-tasks clone's measured beUI curve.
5. **The +300 ms calibration** is applied to the clone's events so its frames align with the reference capture. If the reference's real mount-to-click offset differs, real playback is shifted by at most that amount.
6. **About 2.3% static mismatch** from copy, palette, fonts and card text wrapping.

## Candidates
Winner: beUI Pro Agent Team (Org chart). Runner-up: UIStacks Agent roster. All six loaded. Details in `selection.md`.
