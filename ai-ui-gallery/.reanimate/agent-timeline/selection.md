# agent-timeline: selection

Concept: "Agent run timeline / loop".

**How each candidate was reviewed:** with reanimate `capture.ts`:
- one full-viewport frame (1440x900) to find the preview;
- then one short capture cropped to the preview (assistant-ui 5 s at 6 fps; the Arc runs 12–14 s at 2 fps, because their motion runs 25 s+);
- raw captures stay out of git.

The winner was picked on quality alone. License only set the fidelity level.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Tool timeline (`assistant-ui.com/elements/tool-timeline`) | "Working for Ns" over a compact verb list (Thinking / Read / Ran / Edited with mono targets) and file chips with +/− stats, ending "4 steps · 2 files changed". Plays once with a replay corner; tabs Default / Streaming / Collapsed / No changes / Long session. | Clean, but a one-column list of steps with little motion. Close to the existing `tool-call` and `agent-plan` clones. |
| 2 | Arc UI · Agent timeline (`uiarc.dev/components/agent-timeline`, Pro) | An orchestrator and 4 subagents on one time axis. A playhead grows thinking, tool and waiting bars. Handoff links draw out to each agent and back. The header counts time, tokens and cost live. One tool call fails and is retried. At the end there is a summary with a speed-up. Hover cards, click-to-trace, pause, restart, 1x/2x and a scrub knob. | **Winner.** |
| 3 | Arc UI · Agent run (`uiarc.dev/components/blocks/agent-run`, Pro block) | One coding agent's card. Steps stream in with the live one shimmering and per-step timings, then it stops on a two-file diff for approval. | Polished, but it is a step list with an approval gate. It overlaps `agent-plan`, `tool-call` and `approval`. |
| 4 | Arc UI · Agent loop (`uiarc.dev/components/agent-loop`, Pro) | A circular gather → act → verify loop around a model, with a bright head circling the stations. Action and check cards drop below, a context strip collects items, plus speed and pause controls. | **Runner-up.** A strong illustration of the loop, but a diagram rather than a record of the run. |

Nothing failed to load. The Arc pages stay blank for about 4–6 s after load while they hydrate.

## Winner: Arc UI · Agent timeline

It is the run timeline itself, and the richest of the four:
- Several agents share one clock, so you see parallelism, waiting and handoffs at a glance.
- Every part moves meaningfully: a linear playhead, growing bars with a live edge and a sweep, links that draw down and back up with popping ports, per-frame counters, and a settle at the end into a summary.
- It covers the states a real run view needs: thinking, tool, waiting, a failed call and its retry, done, paused, and scrubbed.
- It is interactive: hover details, a handoff trace, speed, restart and scrubbing.

The Agent loop is the runner-up, not a second winner. It shows the same idea (an agent's work over time) as a stylised cycle rather than the run's actual timeline. Speed mode argued for one clone, and the timeline reads more clearly as an AI agent pattern. The timeline is also distinct from the existing clones: `agent-plan` is a plan runner, `tool-call` is grouped tool calls, and `reasoning` is the chain of thought.

## License and fidelity

The Agent timeline page carries a "Pro" badge and a Get Pro link (paid), so the clone is **motion-faithful**.
- It was written from scratch from the captures and rAF probes, with its own palette, the Geist font, lucide icons, fictional agents and models, and own copy.
- The span timings are reused as numbers so the sequence matches.
- None of the site's JS, CSS, SVG or text is reused.
