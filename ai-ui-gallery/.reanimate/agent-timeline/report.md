# agent-timeline: reanimate report

**Fidelity: motion-faithful.** The reference is Arc UI's "Agent timeline" (Pro, paid): https://uiarc.dev/components/agent-timeline.

The clone covers one whole orchestrated run on a shared time axis:
- **Rows:** a planner plus four agents, each with a coloured dot and a model line (with a lucide mark).
- **Playhead:** it runs from 0 to 26.4 s at wall-clock speed, x1 or x2.
- **Bars:** every bar grows with the playhead.
  - The active bar has a 2 px leading edge and a 28 px highlight. The highlight sweeps for 1.05 s of a 1.5 s cycle, then rests.
  - Waiting spans are hatched.
  - A tool call that fails turns to the danger tint with an x icon. The retry gets a rotate icon once it is done.
- **Handoff links:**
  - Out-links draw down from the planner (2.0 / 2.6 / 3.2 / 16.8 s), each with a port dot that pops in.
  - Return links draw up (9.4 / 12.2 / 14.6 / 23.0 s), and their port pops 260 ms later.
- **Header:** it counts seconds, tokens (linear within each span) and cost on every frame, with a shimmering "Running" label.
- **End of run:** the playhead fades out, the header cross-fades to a summary ("5 agents · 26.4s · 1.5x faster than in series · tokens, cost"), and Pause turns into Play.
- **Interactions:**
  - Hover or focus a bar for a card: agent, model, what it did, tool, time range, tokens, and a failure note.
  - Click a bar to trace that agent's handoffs. The other links and ports drop to .16 opacity and other agents' bars to .28. Escape or a click on empty plot clears it.
  - Pause/Play, Restart and a 1x/2x segmented control with a sliding thumb.
  - Scrub by dragging on the axis, or with the knob's keys (arrows ±0.5 s, Shift ±2.5 s, Home, End).
- **Reduced motion:** turns off draws, fades and shimmer.

Own styling throughout:
- Geist from Google Fonts, an own palette (slate planner; azure, violet, amber and teal agents) and lucide icons.
- Fictional agents and models: Planner/Nova 2 Pro, Verifier/Atlas Mini, Scout/Orion 4, Quant/Vega Lite, Scribe/Lumen 3 Flash.
- Own copy ("Signup drop after the 3.2 release") and own token counts.
- The span start and length values are the reference's run structure, reused as numbers so the sequence matches.
- No source, CSS, SVG or text from the site is used.

**Added:** nothing beyond the reference's own interactions.

## Code
- `src/clones/agent-timeline/index.tsx`: the component.
  - A rAF loop adds the elapsed frame time times the speed to `now`, rounded to 1 µs so that 120 frames land exactly on 2.0 s. It commits with `flushSync`.
  - The first frame after a (re)start holds the playhead.
  - Reaching 26.4 s settles the run one frame later, as in the reference.
  - Links and ports mount when `now ≥ at`.
- `src/clones/agent-timeline/data.ts`: the agents, spans, the derived handoff links, the speed-up and the totals.
- `src/clones/agent-timeline/agent-timeline.css`:
  - Every fade, draw and pop is a CSS transition or keyframe:
    - Draw: clip-path, 360 ms, (.22,1,.36,1), started 16 ms in.
    - Port: scale .4→1 plus opacity, 150 ms, (.16,1,.3,1), delay 0 / 260 ms, started 16 ms in.
    - Header layers: out 100 ms (.22,1,.36,1), in 150 ms (.16,1,.3,1).
    - Playhead settle: 200 ms.
    - Failed tint: 360 ms.
    - Shimmer: 2.4 s.
  - Because these are all CSS, they run the same on the real and the virtual clock.
- `src/clones/agent-timeline/meta.ts`: stage 669x403 on #f8f8f8.
- **Triggers:** the run plays on mount. Restart is `button[aria-label=Restart]`, Pause/Play is `button[aria-label=Pause|Play]`, and the knob is `.at-knob`.

## Method
- **Capture settings:** reference and clone share every setting:
  - viewport 1440x900, `--clock virtual`, `--wait-before 7000`;
  - `--trigger click --target 'button[aria-label=Restart]'`;
  - 27.6 s at 10 fps (the run is 26.4 s);
  - crop `[class*="agent-timeline_root"]` against `[data-stage]`, 669x403 both;
  - compared with `--offset 0`.
- **Probes:** a real-clock rAF probe, with `Element.animate` hooked, logged every state change of the reference over a full run.
  - The reference has no WAAPI at all, only CSS plus a per-frame `--now`. So the virtual clock was valid for every row.
  - `now` tracks wall time 1:1.
  - Tokens are Σ tokens·clamp((now−s)/d).
  - Out-links mount at the handoff time; return links mount at the agent's end + 0.3 s.
- **Rounds:**
  1. A bug: links had zero hop width. Fixed before the round-1 capture.
     - Round 1: links and ports mounted 33 ms late (float drift left `now` at 1.9999… at 2.0 s). The end fades started 1 frame early.
  2. Rounded `now`; settle deferred by one frame; links and ports started one frame in (the reference shows one frame of progress on the frame they appear); failed tint 360 ms.
     - Round 2: the port pop matches to 0.015 opacity and the end fades match exactly. The failed ring showed a frame early.
  3. Box-shadow added to the failed transition.
     - Round 3: all rows pass.
- **After round 3:** frame analysis showed the reference's "Running" shimmer is a 2.4 s cycle: muted text, an ink band crossing in about 1.2 s, then about 1.2 s of rest. The clone had 2.0 s with a light band. Fixed and spot-checked with a 6 s virtual capture: period 24 frames on both, band visible for 8 frames (reference) vs 7 (clone). This was not re-run as a full 4th round.

## Final compare (round 3)

| Check | Reference | Clone | Error | Result |
|---|---|---|---|---|
| Mean frame mismatch (279 frames) | — | — | 2.50% (max 2.88%, copy/colour only) | PASS (≤ 5%) |
| Activity-curve timing (start/end/duration/peak) | frames 1–267 | frames 1–267 | 0 s | PASS |
| 1 Playhead x(t), 0→26.4 s | linear, 25.9 s visible | linear, 25.9 s visible | max 0.2 px (11.5 ms); fit RMSE .0055 vs .0054 | PASS |
| 2 Bar growth with `now` | tied to playhead | tied to playhead | same as row 1 | PASS |
| 3 Active edge, on/off at s / s+d | — | — | ≤ 1 frame | PASS |
| 4 Active shine | 1.5 s loop, 70% travel | same | not tracked; sheets match | PASS (visual) |
| 5 Out-link draw-down | mounts 2016.7 ms, clip 80.0% | mounts 2016.7 ms, clip 80.8% | ≈ 1 ms | PASS |
| 6 Out-port pop (ease-enter 150 ms) | .533/.788/.903/.957 at +0/17/33/50 ms | .518/.781/.900/.955 | ≤ .015 opacity (< 1 ms); best fit easeOutExpo 145 ms on both, RMSE .0024 | PASS |
| 7–8 Return link + port (+260 ms) | appears at frame 97, port at 99 | same frames | 0 frames | PASS |
| 9–11 Seconds, tokens, cost counters | per frame | per frame | 0 to 50 ms (the reference's React text lags its own playhead) | PASS |
| 12 "Running" shimmer | 2.4 s cycle | 2.0 s in round 3 → 2.4 s after the fix | period 0 after the fix; phase not matchable | PASS after the post-round fix (spot check) |
| 13 Header cross-fade at the end | layer 1→.402→.133→.039 from 26450 ms | identical | 0 ms | PASS |
| 14 Playhead settle (200 ms) | .5→.329→.201→.118 from 26450 ms | identical | 0 ms | PASS |
| 15 Pause→Play glyph | frame 267 | frame 267 | 0 frames | PASS |
| 16 Failed tint / icons | progress .75 at frame 54 | .83 | ≈ 20 ms early | PASS |

**Sheet:** `compare-3/sheets/compare-01.webp`. It shows the round-3 shimmer, from before the post-round fix. The other five sheets stay out of git.

## Residual deviations
- **Header counter text (0 to 50 ms):** the reference renders its header with React a variable 0–3 frames behind its playhead, which it drives through a CSS variable. In some frames its last digit is one tick behind the clone's. The lag is nondeterministic, so it is not emulated.
- **Failed tint onset (≈ 20 ms early):** the clone's colour is at 83% at the first frame after 5.1 s, the reference's at 75%. Same cause: React state lag in the reference.
- **Shimmer phase (about 200 ms):** the reference's shimmer starts at hydration and Restart does not reset it, so its phase depends on page load. Period and sweep match.
- **Mismatch 2.5% is copy and colour only:** own names, text, token counts, palette (violet vs the reference's deep purple), font and model marks.
