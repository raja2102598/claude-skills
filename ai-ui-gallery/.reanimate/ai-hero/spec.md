# ai-hero spec
Target: beUI Pro "AI Workspace" landing hero (https://sift.demo.beui.dev, viewport 1134x738, first screen incl. nav).
Destination: src/clones/ai-hero (React 19, plain CSS keyframes). Fidelity: motion-faithful (own palette, font, copy, brand "Wren").
Rows (page time, virtual clock): bars container scaleY 0->1 from 17 ms, ~1 s (sampled linear()); words stagger 183 ms + 142 ms*(2*line+word), 28 px rise, 620 ms settle + 200 ms fade; eyebrow 111 ms (10 px), sub 311 ms (14 px), composer 411 ms (18 px), chips 361/400/445 ms (snap curve tau 58 ms); placeholder loop period 8.4 s / 3 texts, exit at 2.817 s +2.8 s*k (0 to -5 px, fade 190 ms), enter 300 ms later (+7 px to 0, fade 200 ms).
