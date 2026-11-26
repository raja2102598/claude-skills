# ai-summary: selection

Each candidate was opened with capture.ts (screenshot plus a 4 s, 5 fps capture of the live preview); all four loaded.

- UIStacks "AI summary": loads. A Slack-thread summary: skeleton, headline blurs in word by word, "Summarized by" byline, "+ 2 more" thread under it. Polished but a single short motion, no controls.
- UIStacks "AI recap": loads (the preview takes about 1.5 s to fill). Meeting recap that grows out of a skeleton, with next-step rows that check off with a drawn tick. Good, but the AI pattern is a static list once loaded.
- Arc UI "AI insight card" (winner): loads (about 6 s to render). A KPI card that explains itself: Explain button, thinking line, streamed reason, numbered annotations on the sparkline lighting up as each driver is read, driver bars filling, follow-up chips, source and model footer, Stop and Hide, autoplay loop.
- UIStacks "AI column": loads. A table column an AI fills row by row with shimmer, confidence dot, Retry on failed cells and a Run/Stop header. Strong error handling, but the motion is repetitive shimmer rows.

Winner: Arc UI AI insight card, on quality: it has the most states (idle, thinking, streaming, done, stopped, collapsed), the richest motion choreography (text, chart, bars and chips are tied to one stream), and the clearest AI pattern (a number that explains itself in place). Runner-up: UIStacks AI column. One component only: the others are variants of "AI-written text under a header".

Fidelity: motion-faithful (Arc UI Pro, no license stated for the preview, unverified). Own palette (warm paper, deep teal), Figtree, lucide icons, fictional copy and data ("Weekly sales", "Atlas Mini").
