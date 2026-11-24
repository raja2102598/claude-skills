# message: selection

Reviewed 2026-11-24 with reanimate `capture.ts` and Playwright step probes:
- 1440 px viewport; whole-page first looks, then clicks and hovers on each action
- raw captures kept out of git

The pick was on quality alone. License only set the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Message (ui.shadcn.com, MIT) | yes | One turn: a user bubble with copy and edit, and a markdown reply with a code block. The action row has copy, thumbs up, thumbs down and retry, with tooltips. Thumbs fill on click. | Clean and complete as a message. Feedback ends at a filled thumb. |
| assistant-ui · Message actions (MIT) | yes | The action bar on its own (copy, helpful, unhelpful, regenerate, more) with state tabs. It has a hover tint, filled thumbs and a regenerate spin. Copy never showed a check headless (clipboard). | Good micro-states, but there is no message around them. |
| assistant-ui · Message pair (MIT) | yes | A user bubble and a reply played once. Copy and regenerate appear on hover. Has a Bubble/Flat toggle. | Hover reveal only; thin feedback. |
| Kobra · Message (paid preview) | yes | One user bubble with an avatar; clicking it reveals the timestamp. | Minimal: no actions or feedback. |
| UIStacks · Message (free tier; license not verified) | yes | A user bubble and a reply that streams in with blur. Shows "Thought for 12s" and source chips. The actions are copy, thumbs (fill) and a more menu (Copy as Markdown, Branch in new chat, Save to notes). | **Runner-up.** The broadest message, but feedback is a fill toggle. |
| Arc UI · Response feedback (Pro) | yes; renders after ~6 s | A reply whose copy turns into a check. Either thumb opens an inline panel on a spring: reason chips and a note (down), or chips with Skip that becomes Send (up). Sending shows a spinner, then a thank-you, then the panel folds back. It has a fail-the-next-send error path with Try again, and tooltips. | **Winner.** |
| Nuxt UI · ChatMessage (MIT) | yes | A static user message with an avatar. The actions example reveals one copy button on hover. | Basic. |
| shadcn/ui · Message (MIT) | yes | A static person-to-person chat (avatars, "Delivered", typing line, a reaction). | Not an AI pattern; no actions. |
| daisyUI · Chat bubble (MIT) | yes | Static chat-bubble classes (start/end, header, footer, colours). | Plain bubbles, no actions. |

Nothing failed to load: no 404, no login wall, no 429.

## Winner

**Arc UI, "Response feedback"** (https://uiarc.dev/components/response-feedback), cloned as `message`.

- **Why:** it carries the concept's whole feedback story with the most complete set of states, where the others stop at a filled thumb or a hover reveal:
  - copy turns into a check;
  - either thumb opens a contextual follow-up (what worked, or what missed the mark);
  - sending reads back (spinner, then thanks), then the panel cleans itself up;
  - an error and retry path;
  - tooltips and focus handling.

  Its motion is one consistent system: a critically damped spring at ω = 26 for the panel and the check, plus short quint-out and expo-out fades.
- **Fidelity: motion-faithful.** The component carries Arc's Pro badge (paid) and states no open-source license.
  - Own palette, Geist fonts, copy, model name, reason labels and marks.
  - No Arc CSS, JS or assets.
- **Only one winner:** the other candidates are variants of the same message-plus-actions idea, or plain chat bubbles.
- **Runner-up:** UIStacks Message.
