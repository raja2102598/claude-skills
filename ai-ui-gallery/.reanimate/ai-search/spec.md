# ai-search spec
- Target: Arc UI "AI search bar" preview, `div[class*="ai-search-bar_root"]` (640x502), https://uiarc.dev/components/blocks/ai-search-bar
- Destination: src/clones/ai-search (React 19, CSS keyframes + one rAF clock, lucide)
- Fidelity: motion-faithful (paid Arc UI Pro): own palette, Hanken Grotesk, fictional copy and sources, model "Nova 2".

Reference capture: `capture.ts --viewport 1440x1100 --selector 'div[class*="ai-search-bar_root"]' --trigger load --duration 14000 --fps 10 --clock virtual --network-wait 300` (ref/v2); clone same with `--selector '[data-stage]'` (cap-clone.sh). The demo autoplays an 18 s loop from load.

| # | row | time (s from load) | detail |
|---|---|---|---|
| 1 | card fades in, recents + suggestions | 0.1-0.45 | opacity ramp |
| 2 | query types | 1.07-1.45 | ~25 ms/char; results list from 2 chars |
| 3 | Tab: Ask row becomes answer card | 2.45 | snap, no height tween (102 px) |
| 4 | thinking skeleton, spinning mark | 2.45-3.25 | two bars, pulse 0.55-1 alternate |
| 5 | answer streams | 3.25-4.1 | one token/frame, 150 ms linear-wrapper ease-out fade (`chunkIn`, cubic-bezier(.22,1,.36,1)) |
| 6 | citation chip appears with its token; result badge lights | per token | same 150 ms fade |
| 7 | "Writing" -> "4 sources", copy live | 4.1-4.2 | |
| 8 | reset to recents | 9.35 | snap |
| 9 | first suggestion highlighted | 10.05-10.3 | 180 ms background transition |
| 10 | Enter runs it: same rows 3-7 | 10.8 / 11.55-12.5 | |
| 11 | loop | 18.0 | |
