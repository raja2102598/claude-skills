# prompt-input — selection

Method:
- A Playwright screenshot of each page.
- A capture.ts load capture (3 s at 10 fps, cropped to the preview). Every preview is static at rest.
- An interaction probe on eight candidates (#1, 2, 3, 6, 7, 10, 11, 12): type a prompt, press Enter, ~4 s of frames.

The review captures stay out of git.

| # | candidate | status | notes |
|---|---|---|---|
| 1 | AI Elements — Prompt Input | loaded | Clean textarea, attach, model and effort menus, send. Send only fills when there is text; no reply, stream or stop motion. |
| 2 | assistant-ui — Composer | loaded | Attachment chip with upload spinner, model picker, mic, send, state tabs. Submit just clears; very little motion. |
| 3 | Kobra — Chat Input | loaded | One-row pill with a voice-glow button and model chip. Sending opens a Kobra Pro paywall and redirects to pricing. |
| 4 | Kobra — Composer | loaded, off-concept | An email-draft composer with A/B/C versions, not a prompt input. |
| 5 | Rare UI — AI Prompt Box | **failed to load** | curl got HTTP 429; the one capture.ts try in a real browser got the Vercel Security Checkpoint ("Failed to verify your browser", Code 21). |
| 6 | Wensity — AI Prompt Input | loaded (slow, ~2.5 s blank) | Dark composer with a glowing liquid border that traces while typing; attach, image, model, send. Submit clears. A single-effect showcase. |
| 7 | UIStacks — Prompt input | loaded | Very complete: + menu (files, folders, commands, connectors, plugins), tool chips, model trigger, a context ring that ticks up as you type, a gradient beam around the border on focus, send→stop over a streamed reply. **Runner-up.** |
| 8 | UIStacks — Prompt with attachments | loaded | Composer with file and image cards: upload progress, failed upload with Retry, +N more. An attachments variant. |
| 9 | UIStacks — Docked composer | loaded | Full-width composer docked under a chat, with a file-chip tray and send→stop. A layout variant of #7. |
| 10 | beUI Pro — Agent Chat Input | loaded | Dark creative composer with Image/4K/16:9 and model selectors. Submit dims the box, then resets. |
| 11 | Arc UI — AI composer | loaded | **Winner.** Full lifecycle; details below. |
| 12 | Nuxt UI — ChatPrompt | loaded | Textarea, plus, model select, green submit. Submit only cycles the button's status icon. |
| 13 | Nuxt UI — ChatPromptSubmit | loaded | Only the submit button, with ready/submitted/streaming/error states. A part, not a composer. (Its cropped load capture failed in ffmpeg; the page screenshot is fine.) |

## Winner: Arc UI — AI composer

https://uiarc.dev/components/blocks/ai-composer · license: Arc UI Pro (paid), so **motion-faithful**. License played no part in the choice.

It leads on all four criteria:
- **Polish:** the most refined of the set.
- **Completeness:**
  - greeting and three suggestions;
  - plus menu, Web search and Extended thinking toggles;
  - model chip with effort, dictation;
  - Send muted → ready → Stop with a progress ring;
  - attachments, / commands and @ mentions;
  - thinking state, streamed reply, copy/Retry.
- **Motion:** the most choreographed:
  - a spring glide of the composer from the centred greeting to the thread foot;
  - a send→stop morph with an arc that fills with the reply;
  - a thinking shimmer;
  - chunked fade-in streaming, with the body growing a line at a time.
- **AI-pattern clarity:** it reads end to end: ask → think → stream → done.

Runner-up UIStacks Prompt input is just as polished and complete inside the box. Its motion, though, is a focus beam, a context ring and a send/stop swap, so it carries less of the lifecycle.

One winner only. #8 and #9 are variants of the same component, not a second component.
