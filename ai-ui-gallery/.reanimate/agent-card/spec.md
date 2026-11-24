# agent-card: motion spec

- **Target**: beUI Pro "Agent Team" -> "Org chart" preview, https://pro.beui.dev/components/agent-team
  (`#org-chart [id$="-panel-preview"] section`, 1024x705). One auto-played run after a remount via the preview's
  "Refresh preview" button.
- **Destination**: `ai-ui-gallery/src/clones/agent-card/` (React 19, TS, own CSS, lucide). `/c/agent-card`, plays on mount;
  `reanimate:replay` remounts.
- **Fidelity**: motion-faithful (paid catalog, source locked). Own palette (ink blue-black, per-agent hues), Instrument
  Sans + JetBrains Mono, lucide icons, fictional agents (Helm, Scout, Crawler, Tally, Scribe, Forge, Probe) and models.

## Capture
Both sides: `--viewport 1440x1400 --trigger none --wait-before 3500 --pre-roll 0 --duration 19500 --fps 10 --clock virtual`,
crop 1024x705. Reference `--pre-js` clicks Refresh preview; clone dispatches `reanimate:replay`.
(Reference capture crashed after 195 frames of 220; 19.5 s covers the whole run, which ends at 18.3 s.)
The real-clock reference probe did not advance (page at ~2 fps under load), so all times come from the virtual-clock frames:
pill-region luminance and connector pixel changes per frame, 100 ms resolution (event = first changed frame - 50 ms).

## Layout (CSS px, in the crop)
header 32 (chip 32, title 14/20, mono 12 summary, refresh 32); lead card 320x149 centred at y 52; columns 3 x 331, gap 16,
pt 32; sub cards 307x149 at x +24, gap 12; connectors 1 px, trunk 16, bar at y 217 from 16.67% - 5.3 px, ticks 16.
Card: p 14, radius 16, header 36 (chip 32, name 14/20, model 12/16, pill h 24), task 2 lines 43, mono footer 16.

## Motion spec (t = ms after remount)
| # | element | property | start | duration | from -> to | easing | notes |
|---|---|---|---|---|---|---|---|
| 1 | Helm | Running from mount | 0 | | | | |
| 2 | Scout / Crawler / Tally / Scribe / Forge / Probe | Queued -> Running (card opacity .55 -> 1, pill roll, ring fills) | 850 / 1850 / 3250 / 4650 / 6250 / 10850 | ~150-300 | | expo | header running count rolls |
| 3 | same agents | Running -> Done (check + "Done", muted) | 11850 / 6650 / 10850 / 13850 / 16250 / 15850; Helm 18250 | 300 | | expo | |
| 4 | connectors | grey track, agent hue scales in (bar from centre, ticks/trunks from top, stubs from left) | start of each agent + ~100 | < 200 (one 10 fps frame) | scale 0 -> 1 | expo | lead trunk + bar draw with the first child |
| 5 | progress ring | stroke-dashoffset linear in run time | start | until done | 0 -> 1 | linear | |
| 6 | cost | digit columns roll, 0.01 resolution, linear to final | start | until done | | 300 ms expo roll | finals .41 .23 .03 .06 .11 .17 .02, total $1.03 |
| 7 | seconds | round((elapsed + 0.2 s)) | | | | step | |
| 8 | pill swap | old up -16 / new from +16, opacity, blur 2 | event | 300 | | easeOutExpo | |
| 9 | entrance on mount | not present in virtual-clock reference frames (WAAPI collapses) | | | | | not cloned |
