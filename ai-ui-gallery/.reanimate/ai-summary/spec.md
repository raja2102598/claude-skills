# ai-summary spec
Target: https://uiarc.dev/components/blocks/ai-insight-card, preview canvas. Destination: src/clones/ai-summary (React 19, CSS). Fidelity: motion-faithful.

| row | element | trigger | timing | easing |
|---|---|---|---|---|
| 1 | button label (Explain/Stop/Hide) | state | rise 4 px + fade 150 ms, slot width 200 ms | ease-out expo-like cubic-bezier(.22,1,.36,1) |
| 2 | panel open/close | Explain/Hide | height ~200 ms (ref track 262 to 556 px in 205 ms), opacity 150 ms | same |
| 3 | thinking line | after open | shown 820 ms, fade 150 ms | |
| 4 | stream | after thinking | 1 chunk per 34 ms tick, chunk fade 150 ms | |
| 5 | annotation badge/dot/guide | chunk with a mention | opacity 150, scale .8/.5 to 1 200 ms; active then mentioned | |
| 6 | driver row | mention | skeleton to label 150 ms, bar width 200 ms, active bg 150 ms | |
| 7 | autoplay | in view | idle 1400 ms, then Explain; 3600 ms after each answer next follow-up; after the last, Hide | |
