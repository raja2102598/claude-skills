# generative-ui: selection

Concept: "Generative UI / artifacts in chat". Every candidate was opened with `capture.ts` at 1440x900, then a screenshot and a short capture. The pick was on quality alone: polish, completeness, motion, how clearly it reads as an AI pattern. License did not enter the choice. Nothing failed to load.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Generative UI (`/elements/generative-ui`) | A small weather card, 94°F, with Default / Markdown / Diagram / Map tabs. Static, no motion on load. | A one-state widget. |
| 2 | assistant-ui · Channel message (`/elements/generative-channel-message`) | A Slack-style message card: channel and timestamp row, avatar, author, and a Markdown list. Default and Narrow tabs. Static. | A single static card. |
| 3 | assistant-ui · Response time (`/elements/generative-chart-line`) | A single-series line chart with axis ticks. Static. | A single static chart. |
| 4 | beUI Pro · AI Artifacts (`pro.beui.dev/components/ai-artifacts`) | A code artifact (header, copy and download, syntax-highlighted lines, "Ready", Version 1) and a document artifact (Preview/Edit, versions). Static on load. | **Runner-up.** Polished, but a viewer with little motion. |
| 5 | beUI Pro · Crypto Agent (`pro.beui.dev/components/crypto-agent`) | A wallet-agent chat. A suggestion click starts the reply: tool steps resolve one by one with spinners then checks, the sentence streams in with a blur-in, and a swap quote card appears with a countdown ring and Decline / Approve. Approve runs a Sign, Submitted, Confirmed stepper and ticks the header balance. | **Winner.** |

## Winner: beUI Pro · Crypto Agent
It is the only candidate that shows generated UI as part of a conversation, with sequence, state and interaction: steps, streamed text, a live card, and an approval that carries through to a result. The assistant-ui pages are static and have one state each. The artifacts page is a static viewer. The winner is paid, so the clone is motion-faithful with its own palette, fonts, icons and fictional copy. Attribution: beUI Pro, `pro.beui.dev/components/crypto-agent`.
