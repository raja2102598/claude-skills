# agent-handoff: selection

Concept: **Subagent / agent handoff**. Each candidate got one screenshot plus one short capture (raw captures stay out of git). All four loaded.

| Candidate | URL | Loaded | Notes |
|---|---|---|---|
| **AI Elements, Subagent** (winner) | https://ui.shadcn.com/docs/ai-elements/base/subagent | yes | Scripted, replayable demo. A user question, then a "Running the research subagent" line with a spinner and a shimmering label. The subagent's tool calls run one by one nested under it, it reports back, and the parent agent streams its answer. A Replay button follows. MIT (shadcn/ui). |
| Arc UI, Agent handoff (runner-up) | https://uiarc.dev/components/agent-handoff | yes (blank for the first ~2.5 s) | Polished, long (about 10 s) support-chat sequence with two scenario tabs. A bot answers, hands off to a human with a transfer card and a shared summary, then the agent joins and types. It is a bot-to-human escalation set in a branded store mock. License not verified, so it would be motion-faithful only. |
| UIStacks, Agent handoff | https://uistacks.dev/components/agent-handoff | yes | Bot-to-human escalation card: "Waiting for a person", an Asked / Tried / Stopped summary, open questions, and "Send back to agent" / "Take over" buttons. A skeleton shimmer gives way to content. Mostly one static card. License not verified. |
| assistant-ui, Handoff | https://www.assistant-ui.com/elements/agent-handoff | yes | Static Triage → Maintainer chip pair with a reason and a "carried over" list. The only motion is the receiving chip lighting up. There is no running or in-progress state. |

**Winner: AI Elements "Subagent".**
- It reads most clearly as an agent-to-agent handoff: the parent delegates, the subagent works live and visibly (nested tool calls with spinners and shimmer), then reports back so the parent can answer.
- It is the most complete in states: delegated, running per step, finished per step, reported, streamed answer and replay.
- Its motion is crisp and well timed.
- Visually it is as polished as Arc UI.
- The MIT license allows a pixel-faithful clone, but that played no part in the choice.

**Runner-up: Arc UI.** It has the richest sequence and is very polished, but it is a support escalation from a bot to a person rather than an agent-to-agent handoff, and much of its frame is chat chrome around the handoff itself.

One winner only: the other three are variants of a handoff card or line, not a different component.
