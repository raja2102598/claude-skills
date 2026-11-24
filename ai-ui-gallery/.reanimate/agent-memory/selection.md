# agent-memory: selection

Concept: Agent memory / routines. Both candidates are Arc UI blocks; each loaded (one screenshot, `memory/final.png`, `routines/final.png`; the short capture of each is `inspect.json` only, because the virtual-clock capture of the live site hung under load and a real-clock capture was used instead).

- **Agent memory** (https://uiarc.dev/components/blocks/agent-memory): loaded. Usage meter, two memory switches, category filters with a sliding pill, search with match marks, in-place edit, forget with 5 s undo, add, and a live "Memory updated" chip that files a new memory in with a highlight while the meter and counts move.
- **Agent routines** (https://uiarc.dev/components/blocks/agent-routines): loaded. Four scheduled routines with switch, next-run countdown, connector icons, run-history bars and expand-to-edit; polished, but fewer states are visible in the preview and the motion is mostly an expand and a switch.

Winner: **Agent memory**. It has the broader set of states and interactions (filter, search, edit, forget with undo, add, a live update chip) and the motion is richer (list height and layout changes, chip label sequence, meter, highlight fade). It also reads most clearly as an AI memory pattern (what the assistant saved, why, and how to correct it). Runner-up: Agent routines. No second pick: they are different subjects but routines is the weaker component.
