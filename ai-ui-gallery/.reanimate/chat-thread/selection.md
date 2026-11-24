# chat-thread: selection

Concept: "Full chat thread": the whole conversation surface. That means the message list, auto-scroll, new-turn entrance, the composer docked at the foot, and the scroll affordances.

Method (speed mode):
- Each candidate got a Playwright page shot with reanimate `capture.ts` (1440x900).
- Each live preview then got one short capture cropped to it: 3–12 s at 2–10 fps, on load or after its send/replay trigger. Pages that have state tabs got one screenshot per tab.
- The pick was on quality alone (polish, completeness, motion, how clearly it reads as an AI pattern). License only sets the fidelity level.
- Raw captures are in `cand/` and stay out of git.

| # | candidate | status | notes |
|---|---|---|---|
| 1 | AI Elements · Chat (`ui.shadcn.com/docs/ai-elements/base/chat`) | loaded | Clean light thread on the shadcn Message Scroller. Empty state "What should we build?" with a pre-filled prompt. Send pins the user turn to the top. Then a streamed "Thinking" line folds into "Thought", "Running rg …" becomes "Ran …", and a markdown answer with a code block streams in. The next prompt is pre-filled. Polished and open source, but plain: no actions, model or chat controls. |
| 2 | assistant-ui · Thread (`www.assistant-ui.com/elements/thread`) | loaded | Small 734x310 preview with state tabs (Default, Empty, Streaming, Error, Tool calls, Needs action, Long thread). The tabs are static snapshots, and the Streaming tab is frozen mid-word. Sending replies "This is a demo." at once with a smooth scroll. Broad on states, thin on motion. |
| 3 | Arc UI · AI chat (`uiarc.dev/components/blocks/ai-chat`, Pro) | loaded (~4–6 s blank) | **Winner.** Details below. |
| 4 | Arc UI · Chat thread (`uiarc.dev/components/chat-thread`) | loaded | A human team chat: grouped bubbles, image, reactions, Sending → Delivered → Read receipts with a sliding avatar, typing dots, then the reply. Fine motion, but not an AI pattern. |
| 5 | Wensity · AI Chat Interface (`ui.wensity.com/components/ai-chat-interface`, Pro) | loaded (~2.5 s blank) | **Runner-up.** Dark thread. A send pins the bubble, then a live "Thinking 6s" timeline shows searches and source rows fading in with blur. It folds to "Writing", the answer streams with blur-in words, and the thread auto-follows. Also sources, copy/rate/retry, a model chip, dictate and stop. As polished as #3, but one turn with fewer thread-level controls. |
| 6 | Kobra · Conversation (`kobra.systems/components/conversation`, paid preview) | loaded (~3.5 s blank) | iMessage-style blue/grey bubbles. Typing dots become a reply, then a "Scanning 68 components" chip. No composer, header or scrolling; a bubble primitive more than a thread. |
| 7 | Nuxt UI · Chat (`ui.nuxt.com/docs/components/chat`) | loaded, no live preview | Overview page: a component table, install and server/client code. Nothing renders. |
| 8 | Nuxt UI · ChatMessages (`ui.nuxt.com/docs/components/chat-messages`) | loaded (~6 s) | Static examples: a message list, a status "…" indicator, an auto-scroll button and agent steps (thought / ran / failed / sources). They open on click but do not play a conversation. |
| 9 | shadcn/ui · Message Scroller (`ui.shadcn.com/docs/components/base/message-scroller`) | loaded | Phone-sized thread. Send anchors the user turn to the top and the reply streams under it without jumping. A round scroll-to-bottom arrow appears when text runs under the composer. The best scroll mechanics of the set, but a single plain text reply. |
| 10 | Arc UI · Support conversation (`uiarc.dev/components/screens/support-conversation`, Pro) | loaded | A full helpdesk screen with inbox, thread, internal notes and customer panel. Static on load and not an AI pattern. |

Nothing failed to load. Nuxt UI Chat (#7) has no live preview to judge.

## Winner: Arc UI · AI chat

https://uiarc.dev/components/blocks/ai-chat · license: Arc UI Pro (Pro badge, "Get Pro", code behind the plan). Paid, so **motion-faithful**. License played no part in the choice.

- **Polish:** a refined light surface. It has a header (chat switcher, model chip, new chat), right-aligned user bubbles, inline reasoning and tool chips, rich markdown with code blocks, and a docked pill composer.
- **Completeness:** a two-turn conversation plays on its own. The reply streams in after the thinking and tool steps, and a follow-up question is sent automatically. The thread also has:
  - copy/edit on the user turn;
  - copy/retry/rate on the reply;
  - Send morphing to Stop while streaming;
  - chats and model menus;
  - edit/retry versions.
- **Motion:** each turn fades in. The thinking label resolves to "Thought for 4s". The tool chip spins and resolves with a count. The answer streams block by block while the thread follows the live edge. On the second send, the new turn is pinned near the top and the reply grows under it.
- **AI-pattern clarity:** it is unmistakably an assistant thread from end to end.

Runner-up: Wensity AI Chat Interface. It is equally polished and has the richest live "thinking" timeline. But it plays one turn, and the thread itself (header, switcher, multi-turn follow) carries less.

AI Elements Chat and the shadcn Message Scroller have the cleanest scroll anchoring, but much less content and motion.

One winner only. Chat thread (#4) and Support conversation (#10) are human-chat components, not a second AI thread.
