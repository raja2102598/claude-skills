# tool-call: selection

Concept: "Tool call card". Every candidate was opened with reanimate `capture.ts` at 1440x900. Each got a short capture of 3–8 s at 5–10 fps, cropped to its live preview, and was replayed where the page allowed. The raw captures stay out of git. The pick was on quality alone (polish, completeness, motion, how clearly it reads as an AI pattern). License played no part in the choice, only in the fidelity level. Nothing failed to load.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | AI Elements · Tool (`ui.shadcn.com/docs/ai-elements/base/tool`) | A short thread. Three terminal tool lines run in turn with a shimmering "Running …" label, then "Ran node --version", "Ran npm --version" and a red "Failed to run pnpm --version" that opens to its output. The answer streams in, with a Replay button. | Complete lifecycle, but plain text lines: no grouping, timing or retry. |
| 2 | assistant-ui · Tool call (`www.assistant-ui.com/elements/tool-call`) | One disclosure line, "Searching the docs [draft persistence]". It shimmers for about 4 s, blurs into "Searched the docs" with a check, then auto-opens Request / Result. State tabs: Default, Running, Expanded, Failed, Long input. | Polished single call; one tool only. |
| 3 | assistant-ui · Tool group (`/elements/tool-group`) | Three static variants (Outline / Ghost / Muted) of a collapsed "3 tool calls" wrapper, with state tabs. No motion on load. | Wrapper only. |
| 4 | assistant-ui · Tool failure (`/elements/tool-error`) | A static error card: fetch URL, ETIMEDOUT, 1/3 attempts, Skip / Retry. | One state. |
| 5 | assistant-ui · Tool fallback (`/elements/tool-fallback`) | A static "Used tool: get_weather" line, with tabs for Running, Needs approval, Denied and others. | Minimal default renderer. |
| 6 | Arc UI · Tool call (`uiarc.dev/components/tool-call`, Pro) | A grouped card under an agent turn. Calls stream in one by one: spring-grown rows, a shimmering live label and spinner, then a check with "4 results · 1.2s". A failure shows its reason inline with Retry. The header has stacked tool marks, Using → Used, and "1 failed". Retry re-runs the call and adds an approval row (Deny / Allow). Finishing collapses the card under a streamed answer with Run again. | **Winner.** |
| 7 | UIStacks · Tool call (`uistacks.dev/components/tool-call`, Pro) | A card with a Running badge (dot spinner) and input JSON, plus a skeleton output that resolves to rows and "Success". A second card goes Running → Failed, "Rate limited · retry in 3s". | **Runner-up.** Polished input/output panes, but separate cards: no grouping, approval or follow-up. |
| 8 | Nuxt UI · ChatTool (`ui.nuxt.com/docs/components/chat-tool`) | One chip, "Running lint checks cd, pnpm run", with a looping text shimmer and a collapsible slot. | A building block, not a full card. |
| 9 | assistant-ui · Agent Tool (`www.assistant-ui.com/components/agent-tools`) | A product page whose live figure is the same Tool call demo as #2. | Duplicate of #2. |

## Winner: Arc UI · Tool call
It is the most complete take on the pattern and the most finished motion. Calls run in sequence inside one grouped card, with:
- springy row growth;
- a shimmer band and spinner while a call runs;
- blur-swapped labels and spring-scaled status icons when it settles;
- result counts and durations.

Failure is recoverable in place (reason + Retry), approval is inline (Deny / Allow), and the turn closes by collapsing the card under the streamed answer. It reads at once as an agent tool-call transcript. UIStacks is the runner-up for its input/output panes and skeleton results, but it shows independent cards without the group, approval or follow-up flow. Both of UIStacks' cards are variants of one component, so there is no second winner.

## License and fidelity
Arc UI Pro is paid: the component carries a Pro badge, the page offers "Get Pro", and the code is behind the Pro plan. → **motion-faithful.**

The clone is written from scratch from captures and probes. It has its own warm palette, Geist / Geist Mono from Google Fonts, lucide icons instead of the GitHub / Linear / PostgreSQL / Slack marks, and placeholder copy (nova/app, launch board, db-primary, #launch, "Atlas"). None of the site's JS, CSS, SVG or text is reused. The reference's CSS and `getAnimations()` were read only to take durations and easings.
