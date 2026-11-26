# prompt-mini — selection

Concept: Compact / mobile prompt. Speed-mode review, reusing the earlier (interrupted) agent's captures: one screenshot and one short capture per candidate.

| candidate | loaded | one line |
|---|---|---|
| UIStacks — Mini prompt, https://uistacks.dev/components/mini-prompt | yes | A light, inline one-line prompt in an invoice header: ⌘J hint, hints that cycle while empty, focus, typing, send, a dotted loader and a one-line answer. Polished but small, and a desktop inline prompt rather than a phone composer. License not verified. |
| assistant-ui — Mobile composer, https://www.assistant-ui.com/elements/mobile-composer | yes | A light phone composer with suggestion chips, + / field / mic / send and a "return to send" hint. It has six static states (default, disabled, keyboard open, long input, ready, running with stop) but almost no motion between them. MIT. |
| beUI Pro — Prompt input (mobile), https://pro.beui.dev/components/mobile/prompt-input | yes (the preview is a 12.7 s looping phone video) | A dark phone composer: pill → card with an upload ring, model chip, hold-to-talk voice note with live waveform and timer, transcript, then send folds it back into a pill with stop until the reply ends. Paid. |

**Winner: beUI Pro Prompt input (mobile).** It has the best visual polish and is the most complete: idle, uploading, ready, recording, transcript, running and done. Its motion is the richest and cleanest, and it reads plainly as an AI phone composer. It is distinct from `prompt-input`, which is the desktop composer lifecycle. Cloned motion-faithful because the catalog is paid; license played no part in the choice.
**Runner-up: UIStacks Mini prompt**, which has its own small expand, hint and send motion. assistant-ui is third: it has a complete set of states but is mostly static.
**One winner only:** the other two are variants of the same compact composer, not a different component.
**Failed to load:** none.
