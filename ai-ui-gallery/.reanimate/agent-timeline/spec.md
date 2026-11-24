# agent-timeline: motion spec

- **Target**: Arc UI "Agent timeline" (Pro), https://uiarc.dev/components/agent-timeline, the preview card
  `section[class*="agent-timeline_root"]` (668.8x402.7 at 1440x900). One full run after a click on Restart.
- **Destination**: `src/clones/agent-timeline/` in ai-ui-gallery (React 19, TS, Tailwind v4 available, lucide-react);
  rendered alone at `/c/agent-timeline`, cropped with `[data-stage]`.
- **Fidelity**: motion-faithful (paid Pro entry). Own palette, Geist font, lucide icons, own agent/model names and copy.

## Capture

Both sides: viewport 1440x900, `--clock virtual`, `--wait-before 7000`, `--trigger click --target
'button[aria-label=Restart]'`, duration 27.6 s, 10 fps (whole run). Reference crop `[class*="agent-timeline_root"]`,
clone crop `[data-stage]` (669x403).

## Sources of the numbers

- A real-clock probe (`probe.ts`, rAF hook logging every state change, `Element.animate` hooked) over a full run:
  no WAAPI animations at all; every transition is CSS (transitions + @keyframes) or a per-frame JS variable `--now`.
- `--now` advances 1:1 with wall time at 1x (2008 ms → 1.9999), from the first rAF after the Restart click.
- CSS tokens read from the page (timing only): instant 100 ms, fast 150 ms, standard 200 ms, considered 360 ms;
  ease-standard (.22,1,.36,1), ease-enter (.16,1,.3,1), ease-in-out (.65,0,.35,1).

## Static layout (card 669x403, radius 24, 1px border)

| Part | Box (relative to card) |
|---|---|
| inner padding | 18 px top/bottom, gutter 20 px left/right |
| header | y 18, title 15/500 (17 px line), status line 13 px (18 px) at y 37 |
| scroller (rows + axis) | y 72, 667x256; labels column 176 px; plot x 189…648 (459 px = 26.4 s, 17.39 px/s) |
| rows | 5 rows x 44 px from y +6; bar 16 px centred (top 14 in row), radius 5 |
| axis | 30 px, 1px top border; ticks every 5 s, 12 px muted, top 9; knob 9x9 at axis top with a 2 px surface ring |
| playhead | 1 px, height 226, foreground at opacity .5 |
| footer | y 344, 40 tall: Pause 32x32 (secondary), Restart 32x32 (ghost), speed segmented 85x40 (1x / 2x); legend right |

## Motion rows

| # | Element | Trigger / start | Duration | From → to | Easing | Notes |
|---|---|---|---|---|---|---|
| 1 | `--now` (playhead x, knob x, bar widths, counters) | first rAF after Restart | 26.4 s | 0 → 26.4 | linear (wall clock x speed) | playhead `left = now/26.4`; knob same |
| 2 | span width | now ≥ s | d | 0 → d/26.4·100 % − 1.5 px | linear with now | `left = s/26.4 + .75px`; 30 spans, timings below |
| 3 | span "active" edge | s ≤ now < s+d | — | right corners 1.5 px, 2 px inset edge in the series colour | step | tool edge mixes 30 % foreground |
| 4 | active shine (thinking/tool) | while active | 1.5 s loop | 28 px band, −28 px → 100 %+28 px over 70 % of the cycle | ease-in-out (.65,0,.35,1) | not on waiting spans |
| 5 | out-handoff link (orch → agent) | now ≥ t (2.0, 2.6, 3.2, 16.8) | 360 ms | clip-path inset(0 0 100%) → inset(0) (draws down) | ease-standard | L-shape: down from orch bar bottom (y 36) to agent row centre, right 0.3 s |
| 6 | out port dot | same frame | 150 ms, delay 0 | scale .4 → 1, opacity 0 → 1 | ease-enter | 7 px, at (t, 36) |
| 7 | return link (agent → orch) | now ≥ end + 0.3 (9.4, 12.2, 14.6, 23.0) | 360 ms | clip-path inset(100% 0 0) → inset(0) (draws up) | ease-standard | right 0.3 s from the agent's last span end, then up |
| 8 | return port dot | same frame | 150 ms, delay 260 ms | scale .4 → 1, opacity 0 → 1 | ease-enter | at (end + 0.3, 36) |
| 9 | header: seconds counter | per frame | — | now, 1 decimal | — | right-aligned in a "26.4s" sizer |
| 10 | header: tokens counter | per frame | — | Σ tokens_i · clamp((now−s_i)/d_i, 0, 1), floored, thousands sep | linear per span | waiting spans carry no tokens |
| 11 | header: cost | per frame | — | tokens x rate, 2 decimals | — | |
| 12 | "Running" label | while playing | 2.4 s loop | text shimmer | — | own shimmer |
| 13 | header swap at the end | now ≥ 26.4 | out 100 ms, in 150 ms | running layer → finished layer (check icon, agents, time, speed-up, cost) | out ease-standard, in ease-enter | crossfade, same grid cell |
| 14 | playhead settles | now ≥ 26.4 | 200 ms | opacity .5 → 0 | ease-standard | knob stays at 26.4 |
| 15 | play/pause glyph | end of run (pause → play) | play in 150 ms, pause out 100 ms | opacity | ease-standard | |
| 16 | failed span icon / retry icon | mount (when span starts) | 150 ms | opacity 0 → 1 | ease-enter | x-circle in the failed tool span, rotate-cw in the retry |

### Span timings (s, d) — the run's structure, reused as numbers

- Orchestrator: think 0–2.0, wait 2.0–14.6, think 14.6–16.8, wait 16.8–23.0, think 23.0–25.2, tool 25.2–26.4
- Agent 1 (row 1): think 3.5–4.1, tool 4.1–5.6, think 5.6–6.3, tool 6.3–7.7, think 7.7–9.1
- Agent 2 (row 2): think 2.9–3.5, tool 3.5–4.8, think 4.8–5.5, tool 5.5–7.5, think 7.5–8.5, tool 8.5–9.7, think 9.7–11.9
- Agent 3 (row 3): think 2.3–3.0, tool 3.0–5.1 (failed), think 5.1–5.7, tool 5.7–7.3 (retry), think 7.3–8.3,
  tool 8.3–9.9, think 9.9–11.8, tool 11.8–13.0, think 13.0–14.3
- Agent 4 (row 4): think 17.1–17.9, tool 17.9–18.8, think 18.8–22.7

## Interactions (not in the timed capture)

Hover a span: floating card (agent, model, what it did, tool, time range, tokens). Click a span: trace its handoff
path (other links/ports .16 opacity, other spans .28). Pause/Play, Restart, 1x/2x, scrub with the axis knob
(pointer or arrow keys, Home/End).
