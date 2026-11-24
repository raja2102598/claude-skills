# sources: selection

Reviewed 2026-11-24 with reanimate `capture.ts`:
- 1440 px viewport, crop `[data-slot=preview]`
- one still and one short 10 fps capture per candidate
- Sources: Replay clicked; Inline Citation: first citation chip hovered

The pick was on quality alone. License only set the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Sources (ui.shadcn.com, MIT) | yes | A chat turn. The question bubble comes first, then the answer streams in one word per 20 ms. With the last word, a "Used 3 sources" trace line (globe, count, chevron) lands open under the answer and lists each cited page (duplicate URLs dropped) with an outbound arrow. The line folds and unfolds on a 200 ms height ease while the chevron turns. Rows darken on hover, and a Replay button restarts the turn. | **Winner.** |
| AI Elements · Inline Citation (ui.shadcn.com, MIT) | yes | Three static paragraphs with five grey host chips (`Button` secondary xs). Hovering a chip (10 ms delay, 100 ms close delay) opens a 256 px hover card: title, one-line description and a host link, with Base UI's fade and zoom. | **Runner-up.** Polished, but one interaction (a hover card) on static text. |

Nothing failed to load: no 404, no login wall, no 429.

## Winner

**AI Elements, "Sources"** (https://ui.shadcn.com/docs/ai-elements/base/sources), cloned as `sources`.

- **Why:** it tells the fuller citation story, inside a real chat turn:
  - the answer streams;
  - its sources arrive with the answer as a counted, collapsible list;
  - each row is an outbound link;
  - fold and unfold are animated, and there are hover states and a replay.

  The two candidates are level on polish (same design system). Sources wins on completeness (streaming, open and closed states, hover, replay) and on motion (stream plus height ease, against one hover card). It also reads more plainly as an agent pattern ("Used 3 sources" after an answer).
- **Fidelity: pixel-faithful.** shadcn/ui is MIT (`LICENSE.md`, "Copyright (c) 2023 shadcn"); the demo is `apps/v4/examples/base/sources-demo.tsx`.
  - Same Geist font, colours, spacing, radii and layout, plus the demo's own question and answer.
  - The cited sites are placeholders on the reserved `.example` domain (page titles kept, domains swapped), so no real publication is named or linked.
  - Attribution is in `meta`.
- **Only one winner:** Inline Citation is a genuinely different component (per-claim chips with hover-card previews, not a source list), so it could justify a second slug. This run was scoped to `sources/` only, so it is left as the runner-up.
