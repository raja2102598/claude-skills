# reasoning: selection

Concept: "Reasoning / chain of thought". Every candidate was opened with reanimate `capture.ts` (1440x900, a full-viewport
frame to find the preview, then a 5 fps capture of 6–12 s cropped to the live preview; raw captures in
`.reanimate/reasoning/cand/`). The motions here run 5–11 s, so the review captures are longer than the usual 3 s.
The winner was picked on quality alone (polish, completeness, motion, AI-pattern clarity); license played no part in the
choice, only in the fidelity level.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | AI Elements · Reasoning (`ui.shadcn.com/docs/ai-elements/base/reasoning`) | Inside a chat turn: a shimmering "Thinking" header, the reasoning streams into a left-ruled block, then it auto-collapses to "Thought for 5s" as the answer streams; Replay button. | Clean, but one header and one stream: no stop, error or structured-steps state. |
| 2 | AI Elements · Chain of Thought (`ui.shadcn.com/docs/ai-elements/base/chain-of-thought`) | "Researching" spinner header; three steps arrive one by one with spinners and shimmering active labels, one step opens a tool-output table, then the whole thing folds to "Researched in 3 steps" and the answer streams. | **Runner-up.** Very polished, but it is an agent's tool trace (read log, web search, code search) rather than the model's reasoning, and it overlaps the agent-plan / tool-call concepts. |
| 3 | assistant-ui · Reasoning (`www.assistant-ui.com/elements/reasoning`) | Bordered panel with a brain icon and a shimmering "Reasoning" trigger over static text; tabs Default / Streaming / Collapsed / Long reasoning. No replay control on this page. | Loads fine; the motion is only the label shimmer. |
| 4 | Arc UI · Reasoning block (`uiarc.dev/components/reasoning-block`, Pro) | Card with a mark, a shimmering "Thinking" label and a live seconds counter, a Stop button, and the newest reasoning streaming through a two-line window that scrolls line by line under a top fade. It then folds to "Thought for Ns" and opens into the full reasoning as headed steps on a timeline with a "Done" footer. Demo tabs Live / Finished / Interrupted; Stop gives "Stopped after Ns" with partial steps, Interrupted shows an error label, Retry and an error footer. | **Winner.** |
| 5 | Kobra · Reasoning Steps (`kobra.systems/components/reasoning-steps`, paid preview) | Container-less text: a stage label with a moving shimmer ("Reviewing the incident call", "Drafting the rollout policy"), source chips that pop in, reasoning lines that blur in and scroll. | Nice type motion, but there is no container, no collapse and no done state in 10 s of preview. |
| 6 | Nuxt UI · ChatReasoning (`ui.nuxt.com/docs/components/chat-reasoning`) | Renders only after about 6 s of hydration. "Thinking…" shimmer with a chevron, and text that streams into a 240 px column with a 200 px max height, auto-scroll and a top fade. | A building block: one state, a plain stream. |

Nothing failed to load. Nuxt UI's preview stays blank for the first ~6 s after load (client-only render), and
assistant-ui's reasoning page has no replay control, unlike other assistant-ui pages.

## Winner: Arc UI · Reasoning block

It is the most complete reasoning block of the set, and it reads at once as the AI "thinking" pattern. While the model
thinks you see a live label and timer, a Stop control, and only the newest two lines of reasoning. Those lines arrive in
fading chunks, and the window scrolls one line at a time (20 px, ~300 ms) under a 16 px fade. When thinking ends, the
stream folds away (height spring, ~330 ms), the label cross-fades to "Thought for Ns", and the card opens (~450 ms) into
the full chain of thought as headed steps on a dotted timeline. It covers every state a real block needs: live, done,
stopped and interrupted, with retry and copy. AI Elements' Chain of Thought is just as polished, but it shows an agent's
tool steps rather than reasoning, so it is the runner-up. It is not a second winner: both are variants of "show the
work, then fold it to a summary", and Arc's block already ends in structured steps. Arc also differs from the
`thinking-indicator` clone, which is a status line with a phase label and a check. This clone is the reasoning content
itself: the live stream and the step-by-step chain.

## License and fidelity

The Reasoning block page carries a "Pro" badge ("Get Pro"; Pro entries are paid) → **motion-faithful**. The clone is
written from scratch from the captures and rAF probes. It has its own palette (cool slate ink with an indigo accent),
the Geist font (Google Fonts), lucide icons and its own mark (a lucide sparkle in place of the reference's vendor
logo). The copy is placeholder (a fictional "Nova 2" model reasoning about a flaky cache). None of the site's JS, CSS,
SVG or text is reused.
