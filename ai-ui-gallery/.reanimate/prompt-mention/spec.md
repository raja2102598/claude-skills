# prompt-mention — motion spec

- **Target**: UIStacks "Mention prompt" live preview (https://uistacks.dev/components/mention-prompt), the composer and its caret popover, crop `--clip 440,495,560,352` at 1440x900 (the preview's "Fit" mode renders the component at 0.92 scale). The preview autoplays a 12.0 s demo loop: `/` → command list → filter → pick → chip, type, `@` → agents/people list → filter → pick → chip, type, `@` → filter (closes on a trailing space, reopens) → pick.
- **Destination**: `ai-ui-gallery/src/clones/prompt-mention/` (React 19, TS, Tailwind v4, clone-local CSS; CSS keyframes for the popover's opacity/transform; no motion/WAAPI so both clocks render the same).
- **Fidelity**: motion-faithful. UIStacks is a paid catalog (Pro license key needed for the source); no open-source license. Own palette, Geist (Google Fonts), lucide icons, fictional agents/people/commands, own copy.
