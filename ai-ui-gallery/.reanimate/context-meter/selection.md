# context-meter: selection

Reviewed 2026-11-24 with reanimate `capture.ts`:
- 1440 px viewport; the crop was the preview, or the whole page for a first look
- 2–60 fps; triggers were load, idle, a click on Send / Compact / Play demo, or a hover on a legend row or button
- Arc also got real-clock probes of every Animation and CSSTransition
- raw captures and probes kept out of git

The pick was on quality alone (polish, completeness, motion, AI-pattern clarity). License played no part in the choice, only in the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Context (ui.shadcn.com, MIT) | yes | An "8% context" pill. Hovering it opens a card with a progress bar and input / output / reasoning counts (fade and zoom in about 150 ms). | Clean but minimal: one bar, no fill motion, no actions. |
| assistant-ui · Context display (MIT) | yes | A static grid of ring, bar and text meters at low, warning and critical levels, plus a pinned "on hover" card (72 % full, with a breakdown). Tabs switch between empty, low, warning, critical and over-limit. | Good state coverage, but static: no fill motion. |
| assistant-ui · Context breakdown (MIT) | yes | A segmented bar (system / tools / files / conversation / headroom) that fills once in steps and turns amber near the limit, with a replay button. | Pleasant, but simple: one bar and a stepped fill, no actions. |
| Arc UI · Context window (Pro) | yes; renders after ~5–6 s | A 200-cell grid that fills by category, with a dashed 80 % compaction line, a reply reserve and a model menu (switching rescales the grid). Seven-row breakdown; hovering a row dims every other category. Send message and Attach file colour the new cells in a stagger while every number counts up. Compact now folds the conversation cells, then collapses them into a summary while the numbers count down, with a status line throughout. Also compacts on its own at 80 %. | **Winner.** |
| beUI Pro · Context Window (paid) | yes; preview ~3.5 s | A dark card with a segmented meter and threshold tick that grows turn by turn on its own, with rolling digits. Warns past 70 % (amber, "Compact now" turns blue). Compacting shows "Summarized / Cleared" per row, and it auto-compacts at 85 %. | **Runner-up.** As polished, with lovely digit rolls, but the fill is a single bar and compaction is a short shrink, with less choreography than Arc's fold then collapse. |
| beUI Pro · Usage & context (mobile, paid) | yes | A phone mockup: a usage budget block, plus a context grid that drains on compaction. | A smaller mobile take on Arc's grid idea. |
| Bencho · Context meter (license not verified) | yes | A card with a stacked bar, category chips and a Compact button. Hovering a chip isolates its segment, and the total rolls with a blur. Has a "Play demo". | Polished micro-interaction, but a single bar with fewer states. |
| UIStacks · Context meter (Pro, license not verified) | yes | A context card whose bar fills on load, and a composer ring at 86 % that shows a breakdown popover on hover. Warns at 80 % and 95 %. | Closest to the textbook ring-with-hover, but less complete and less motion. |
| Arc UI · Prompt cache (Pro) | yes; renders after ~5–6 s | An animated explainer of prompt caching: request bars, cache write / hit, cost and time. | Polished but a different concept (cache economics), not a context meter. |

Nothing failed to load: no 404, no login wall, no 429.

## Winner

**Arc UI, "Context window"** (https://uiarc.dev/components/context-window), cloned as `context-meter`.

- **Why:** Arc and beUI Context Window are level on polish. Arc wins on completeness and motion.
  - It has the most states: fill, hover breakdown, send, attach, manual and automatic compaction, a model switch with rescale, a reserve and a threshold.
  - Its compaction has a visible two-step lifecycle (fold, then collapse into a summary) with staggered cells and counting readouts.
  - A grid of 5K-token cells reads unmistakably as an agent's context window.
- **Fidelity: motion-faithful.** The component carries Arc's Pro badge (paid; source behind the Pro plan) and states no open-source license.
  - The clone uses its own palette (warm paper with vermilion / marigold / pine / indigo categories), Manrope, its own copy, fictional models (Nova 2 1M, Atlas Mini 512K, Lumen 4 400K) and lucide icons.
  - No Arc CSS, JS, assets, brand marks or vendor names were copied.
- **Only one winner:** the other candidates are variants of the same meter idea (bar, ring, grid), except Prompt cache, which is a different pattern.
- **Runner-up:** beUI Pro Context Window.
