# trace-waterfall: selection

Concept: "Trace waterfall".
- **Capture:** every candidate was opened with reanimate `capture.ts` at 1440 px wide. Each got one page screenshot plus one short capture of its live preview, replayed where the page allows (2–10 fps). The raw captures are kept out of git.
- **Pick:** on quality alone: polish, completeness, motion, and how clearly it reads as an AI/agent pattern. License played no part in the choice, only in the fidelity level.
- **Failed to load:** nothing.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Trace waterfall (`www.assistant-ui.com/elements/trace-waterfall`) | A small "Trace 1840ms" card. Grey bars appear one row at a time ("run", "chat.completions", "web_search"); each row fades and slides in over 300 ms and its width eases over 500 ms. State tabs: Streaming, Completed, Failed span, No spans, Deep trace. Plays once. | Clean and open source, but plain: one colour, three rows, no playhead or detail. |
| 2 | Kobra · Trace Waterfall (`kobra.systems/components/trace-waterfall`, Pro, $19) | A live multi-agent run of about 1 min. Counters tick (duration, cost, tokens, LLM / tool calls, errors). Agent groups are sticky, with coloured model and tool bars, handoff lines, a failed span and its retry. The axis rescales as the run grows, and there are search, speed and pause controls. | **Runner-up.** The richest feature set, but the run takes a minute. In a cramped preview the sticky rows overlap mid-scroll ("Save research" shows under the Researcher header), and the page takes about 8 s to start. |
| 3 | UIStacks · Trace waterfall (`uistacks.dev/components/trace-waterfall`, Pro, $159) | A light "Run 518 · Reorder plan" card: stat tiles, a blue playhead line, bars that grow with a glowing leading edge, Running → Done, three agents and seven steps over 7.2 s. The card grows as rows arrive. | Polished, but fewer states: no failure or retry, no detail panel in the default view. |
| 4 | beUI Pro · Agent Traces → Trace waterfall (`pro.beui.dev/components/agent-traces`, paid) | A dark run card, "support-agent · refund request", with "Completed with 1 retry". Stat odometers roll on load, and there are kind legend chips. The playhead (a line with a knob) replays the run: bars fill in real order and rows the playhead has not reached stay dim. It includes a striped failed span and its retry, collapsible subtrees, Pause and Replay, and a detail panel (timing bar, model, tokens, cost, input, output, attributes). | **Winner.** |
| 5 | shadcn/ui · Trace (`ui.shadcn.com/docs/components/base/trace`) | A chat answer with a reasoning trace: "Thought for 5s", "Ran pnpm --version", a failed command, "Used 2 sources", then Replay. | A chain-of-thought list, not a waterfall. Off-concept. |

## Winner: beUI Pro · Trace waterfall
It is the most finished take on the pattern and the one whose motion carries the idea:
- **The playhead:** replaying a run makes the timing legible. Bars fill exactly as the playhead crosses them, and rows the playhead has not reached stay dim.
- **Completeness:** it shows the whole story of a run at once. That covers the stats, the legend by span kind, the nested agent and subagent tree, an inline failure plus its retry, and a detail panel for the selected span.
- **Why not Kobra:** Kobra has more features, but its minute-long live run and overlapping sticky rows read less cleanly.
- **Why not UIStacks:** UIStacks is polished but has no failure, retry or detail state.

All candidates are one component in different skins, so there is no second winner.

## License and fidelity
beUI Pro is a paid catalog: the site sells plans ("See pricing", Login), and the block's code is not public. → **motion-faithful.**

The clone is written from scratch from captures and track data. Nothing from the site was reused:
- an ink-dark palette of its own, with different kind hues;
- IBM Plex Sans and IBM Plex Mono;
- different lucide icons;
- placeholder copy: "claims-agent · warranty claim", the fictional models "Nova 2" and "Atlas Mini", and new span names, numbers and texts.

Only the run's schedule (span starts and durations) is kept, because it is the motion.
