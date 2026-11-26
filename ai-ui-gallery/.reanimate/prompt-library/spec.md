Target: Arc UI Prompt studio card (https://uiarc.dev/components/blocks/prompt-studio), Run click.
Destination: src/clones/prompt-library (React 19, Tailwind v4, own CSS).
Fidelity: motion-faithful.

| row | reference (virtual clock, t from click) |
|---|---|
| 1 Run label Run->Stop swap | immediately at click |
| 2 output frame grows 52->84 px, footer line slides in | 0-380 ms, ease-out (90% at 250 ms) |
| 3 "Thinking" label shimmer | 0-800 ms |
| 4 status flips to Writing, body starts | 800 ms |
| 5 words stream, frame follows 84->285 px | 800-1830 ms |
| 6 Reply check, copy button, stats footer | ~1.7-1.9 s |
