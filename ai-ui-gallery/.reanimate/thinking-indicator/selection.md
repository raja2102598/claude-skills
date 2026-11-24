# thinking-indicator: selection

Concept: "Thinking / status line". Every candidate was opened with reanimate `capture.ts` (1440x900, a short
5–10 fps capture cropped to the live preview; raw captures in `.reanimate/thinking-indicator/cand/`).
The winner was picked on quality alone (polish, completeness, motion, AI-pattern clarity); license played no part
in the choice, only in the fidelity level.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Thinking indicator (`www.assistant-ui.com/elements/thinking-indicator`) | Pulsing blue dot (opacity 1 → 0.5, 2 s) and a shimmering "Thinking" label that slides in; tabs for "With timer" and "Long label". | Clean but minimal: one state, no completion or detail. |
| 2 | Rare UI · Inline AI Status (`www.rareui.com/components/aistatus`) | Did not load: curl got HTTP 429, and the one capture.ts try hit a Vercel Security Checkpoint ("Failed to verify your browser", Code 21). | **Unavailable.** |
| 3 | UIStacks · Thinking state (`uistacks.dev/components/thinking-state`) | Dot-grid mark, shimmering label that steps Thinking → Searching → Reading with a live seconds counter, then settles into "Thought for 5s". The check springs in, the steps below tick to green checks, and the reasoning panel collapses from the header. | **Winner.** |
| 4 | beUI Pro · AI Thinking Loaders (`pro.beui.dev/components/ai-thinking-loader`) | Six pixel/node loaders (pixel orbit, grid scan…) next to a static "Thinking..." label, in dark mode. | Nice loaders, but only a spinner: no states, timer or detail. |
| 5 | Nuxt UI · ChatShimmer (`ui.nuxt.com/docs/components/chat-shimmer`) | A text shimmer over "Thinking..." (2 s linear sweep). | A building block (the shimmer), not a full status line. |
| 6 | Arc UI · Agent status (`uiarc.dev/components/agent-status`, Pro) | Pill with an agent mark inside a spinning ring, an activity icon with a shimmering label ("Searching for…", "Editing src/…"), an m:ss timer, a width that morphs between activities, and a steps panel on click. | **Runner-up.** The most polished pill motion, but it is an app-level agent-run pill rather than a thinking line. It also leans on a brand-like mark. |
| 7 | assistant-ui · Agent status (`www.assistant-ui.com/elements/agent-status`) | Pill: pulsing dot, label (blur-in), seconds timer, pause button; Refactoring → Waiting for approval → Running tests; tabs for Working/Waiting/Done/Failed. | Good multi-state pill, plainer motion than Arc. |

## Winner: UIStacks · Thinking state

It is the most complete take on the concept, and it reads at once as the standard AI "thinking" pattern. It has a
live phase label with a shimmer, an elapsed timer, and a settle state ("Thought for 5s") where the check springs in.
The reasoning steps tick to done in sync with the phases, and the panel collapses from the header. The motion is
restrained but finished: a 1.6 s shimmer per phase, a 300 ms fade of the mark and a spring (overshoot about 21 %) on
the check. Arc's Agent status pill is more polished in raw motion. It is a different pattern, though (a persistent
pill for an agent run), and it is less clearly a "thinking line", so it is the runner-up rather than a second winner.

## License and fidelity

UIStacks Pro is paid: "Get Pro · $159", and the code tab is locked behind a license key. → **motion-faithful.**
The clone is written from scratch from the captures. It has its own palette (warm stone ink, an amber→rose dot
mark, a teal check), the Geist font (Google Fonts), lucide icons, its own 5×5 dot pattern and placeholder copy.
None of the site's JS, CSS, SVG or text is reused.
