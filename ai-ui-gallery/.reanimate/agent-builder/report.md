# agent-builder: reanimate report

**Cloned:** Arc UI "Agent builder" block preview (https://uiarc.dev/components/blocks/agent-builder), a 640×815 agent card.
- **Configure view:** inline-named agent, model picker, instructions with a character counter, six tool toggles, and knowledge files with an upload progress bar. After the upload the status reads "Unsaved changes" and Publish turns dark.
- **Test view:** Configure / Test cross-fade. A suggestion click sends: the empty state is removed at once, then the "Thinking" label, tool chips that appear and resolve, the answer streaming, and a done label with the elapsed time.
- **Chat scenarios:** three suggestions with their own chip lists and timings. Only the CSV export case is frame-compared against the reference (see Verification).

**Fidelity:** motion-faithful. Arc UI Pro is a paid block with no open-source license. Everything visible is ours:
- copy and names: Courier, Relay, Tracker, Notebook, Ledger, Nova 2, Atlas Mini
- palette: warm paper with a deep green accent
- font: IBM Plex Sans from Google Fonts
- icons: lucide

No Arc CSS, JS, copy or assets were copied.

**Added beyond the reference capture:**
- autoplay (mount upload, Test tab, first suggestion, restart); any input stops it; `?autoplay=0` turns it off; `window.dispatchEvent(new Event("reanimate:replay"))` remounts the card
- editable name, instructions, model cycling, tool toggles, file removal
- Publish
- Reset and Stop

**Code:** `src/clones/agent-builder/index.tsx`, `data.ts`, `agent-builder.css`, `meta.ts`.

**Trigger:** the mount upload plays on load. For the chat, click a suggestion on the Test tab (`.ab-suggestions` in the capture).

## Capture

Reference and clone use the same settings:
- `--viewport 1440x1400 --trigger click --wait-before 9000 --pre-roll 200 --duration 6500 --fps 25 --clock virtual --network-wait 300`
- pre-js: click the Test tab
- crop: the card (`[class*=agent-builder_card]` on the reference, `[data-ab-card]` on the clone), 640×815 on both sides
- click target: the suggestions container, which lands on the second suggestion (CSV export)

The fades in the clone are CSS keyframes, so they behave the same on the virtual and the real clock. The chat steps are timers and a rAF stream. Two clone captures crashed ("Target crashed") at the final selector lookup under memory pressure, after all frames were written; the third (clone-2) completed after the dev-server memory fix.

## Verification (round 2 of 3)

compare.ts (offset 0): mean mismatch 2.78 %, worst frame 3.2 % (#60), 169 of 169 frames compared, motion window 5–5 on both sides, timing error 0 s start / 0 s end, PASS. The mismatch is almost entirely text glyphs from the different font. Round 1 was invalid: its alignment offset was misdetected as 5, and the clone card was 1 px too tall.

Sheet: `compare-2/sheets/compare-01.webp`.

Event frames from per-frame activity (the click is frame 5), ref vs clone:

| event | ref frame | clone frame | err |
|---|---|---|---|
| click: empty state removed, user bubble, stop button | 5 | 5 | 0 |
| tool chip 1 appears | 23 | 23 | 0 |
| chip 1 result appears | 35 | 35 | 0 |
| tool chip 2 appears | 48–49 | 49 | +1 frame (40 ms) |
| answer streaming | 50–60 | 49–61 | +1 frame (40 ms) |
| done label and send button | 59–60 | 59–61 | 0–1 frame |

Spec rows (times in ms from the click):

| row | result |
|---|---|
| empty to thread, bubble | PASS |
| chip 1 at 720 and its result at 1200 | PASS |
| chip 2 at 1720 and its result at about 1840 | PASS (+40 ms) |
| answer 1800 to 2160 | PASS |
| done label "2.2s" | PASS |
| mount upload steps 600 to 3240 ms | Measured from the reference real-clock probe; not frame-compared (it happens before the click, during wait-before) |
| Configure / Test cross-fade | Not frame-compared; set from a real-clock screenshot series |

## Residual deviations
- **Only one chat flow is frame-verified.** The billing suggestion (3 chips) was measured on the real clock with about 100 ms resolution (±100 ms) and not run through compare.ts. The reference's real-clock chat was slower than its virtual-clock chat (5.4 s vs 2.2 s), which is why the two scenarios have different step times.
- **Third suggestion (Enterprise call):** invented timings and copy; no reference timing behind it.
- **Configure view:** inspected visually only, not frame-compared.
- **Text and glyph mismatch, about 2.8 % of pixels:** different font, so glyph shapes differ.
- **Reference shimmer:** none was visible in the reference frames, so the clone shows a static "Thinking" label with no shimmer.

## Candidates
Winner: Arc UI Agent builder. Runner-up: Arc UI AI setup wizard. Third: beUI Pro Agent Builder. All three loaded. Details in `selection.md`.
