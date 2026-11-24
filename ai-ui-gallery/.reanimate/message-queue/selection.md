# message-queue: selection

Candidates reviewed (one screenshot plus a short capture each):
- assistant-ui "Message queue" (https://www.assistant-ui.com/elements/message-queue): loaded fine. A running turn pill with a pinging blue dot, then "N queued / sends when this finishes" and numbered queued messages, each with a decorative up arrow and a remove (X) button. Variants: Default, Nothing queued, No cancel, Long queue. **Winner.**
- AI Elements "Queue" (https://ui.shadcn.com/docs/ai-elements/base/queue): loaded fine. It is a todo list (collapsible "4 completed" with a Replay button), which is the agent-tasks pattern, not queued messages. Not picked.
- assistant-ui "Message timing" (https://www.assistant-ui.com/elements/message-timing): loaded fine. It is a first-token / total / speed stats badge and hover card, with little motion. **Runner-up**, not cloned. It is a different component, so a second winner is not justified here.

Why Message queue won: it is the only candidate about messages typed while a run is in flight. It is polished, has the most states (empty, no-cancel, long truncated queue, per-item cancel with renumbering) and reads clearly as an AI/agent pattern. Its motion is small: an enter slide plus a ping dot.

License: assistant-ui LICENSE is MIT, Copyright (c) 2026 AgentbaseAI Inc. (raw.githubusercontent.com/assistant-ui/assistant-ui/main/LICENSE). The clone is **pixel-faithful** with attribution in `meta.ts` and here.
