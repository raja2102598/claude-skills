# streaming-text: selection

Concept: "Streaming response text". Every candidate was opened with reanimate `capture.ts` (1440x900, a short
capture at 10 fps cropped to the live preview, `--clock virtual` where the motion is JS-timed). Raw captures are in
`.reanimate/streaming-text/candidates/<name>/`. The winner was picked on quality alone: polish, completeness, motion,
and how clearly it reads as an AI pattern. License played no part in the choice, only in the fidelity level.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Streaming text (`www.assistant-ui.com/elements/streaming-text`) | One centred paragraph streamed word by word. Each word fades in over 500 ms and lands blue, then settles to ink over 700 ms. A caret pulses at the end of the line, an inline code chip comes in mid-stream, and a corner button pauses or replays. Tabs show Default, Streaming (held mid-reply with a caret) and Complete. | **Runner-up.** Clean and the most explicit about states, but it is a single short paragraph in small text. |
| 2 | Kobra · Streaming Text (`kobra.systems/components/streaming-text`) | A full assistant reply in markdown: heading, two paragraphs (the first ends with a "GitHub +1" source pill), a four-item list with bold lead-ins, a terminal code card that fades in as a unit, and a closing paragraph. Words arrive one per frame (16 ms/word, with 44/28/10 options). Each one fades in over 180 ms through a blue → violet → rose trail into ink. An invisible copy of the whole reply reserves the height, so nothing below moves. A Replay button rises in at the end, and Replay blurs the reply out before streaming it again. | **Winner.** |
| 3 | Rare UI · Streaming Response (`www.rareui.com/components/streamingresponse`) | Not loaded. The site sits behind a Vercel Security Checkpoint (HTTP 429 to curl, "Failed to verify your browser" in headless Chromium), and other agents in this run already saw the same. Recorded as unavailable without retrying. | **Unavailable.** |
| 4 | Arc UI · Realtime stream (`uiarc.dev/components/realtime-stream`, Pro) | A live latency line chart ("Checkout API", p95 ms) that scrolls at 60 fps and pins a "Spike" marker on anomalies. | Polished, but it is a streaming data chart, not streaming response text. Off-concept. |
| 5 | Aceternity UI · Text Generate Effect (`ui.aceternity.com/components/text-generate-effect`) | A large bold sentence in which each word un-blurs and fades in, about 200 ms apart, once, when the component mounts. The preview loads late (about 2.5 s after page load). | A good-looking text reveal, but a marketing headline effect: one state, no reply structure, no replay. |
| 6 | Magic UI · Typing Animation (`magicui.design/docs/components/typing-animation`) | "Hello World! 👋" typed character by character (about 100 ms/char) with a blinking cursor, plus a replay button. | A plain typewriter. Minimal, and it does not read as a model reply. |
| 7 | Animate UI · Typing Text (`animate-ui.com/docs/primitives/animate-ui/typing-text`) | "Typing Text component" typed character by character (about 100 ms/char) in 36 px semibold with a bar cursor. | A plain typewriter primitive, the same as Magic UI's. |

## Winner: Kobra · Streaming Text

- **Visual polish.** This is the best of the set. The reply is set as real markdown (heading, paragraphs, a list
  with bold lead-ins, a source pill, a code card). The three-hue trail makes the front of the stream glow, and the
  words behind it settle into plain ink. assistant-ui is neat, but it is a single small paragraph.
- **Completeness.** Kobra has every block type an assistant answer uses, with a per-block treatment: words stream,
  the pill rides in with its word, and the code card fades in as one unit while the stream holds for 100 ms. It
  reserves layout height, so nothing jumps. It has an end state (Replay rises in), a replay transition (blur-out,
  then a restream), and a speed setting. assistant-ui's states (caret, pause, a held mid-stream tab) are its edge,
  but polish ranks first.
- **Motion.** One word per frame with a short 180 ms per-word fade gives a fluid, fast token stream. The colour
  trail shows where new tokens land without slowing reading down.
- **Reads as AI.** It looks like an assistant answer streaming in, with sources and a code block. Aceternity,
  Magic UI and Animate UI are generic text effects, and Arc's realtime stream is a chart.

**Runner-up: assistant-ui Streaming text** (MIT). Its states are the most explicit, but the visual is a single paragraph.
No second winner: the typewriters (Magic UI, Animate UI) and Aceternity's reveal are variants of "text appearing", not
a different AI component.

## License and fidelity

Kobra's Streaming Text sits in the "Generative UI" section, outside the "Free" group. The code panel is covered by
"Upgrade to Kobra Pro · Get Pro / Buy component ($19)". No open-source license is published. → **motion-faithful.**
The clone is written from scratch from the captures and probes. It uses its own copy (a reply about a test runner's
cold start), its own palette (warm paper, an amber → tangerine → terracotta trail into ink), Geist and Geist Mono
from Google Fonts, lucide icons, and a fictional source pill. No Kobra JS, CSS, copy, icons or favicons are used.
