# prompt-mention — motion spec

- **Target**: UIStacks "Mention prompt" live preview (https://uistacks.dev/components/mention-prompt), the composer and its caret popover, crop `--clip 440,495,560,352` at 1440x900 (the preview's "Fit" mode renders the component at 0.92 scale). The preview autoplays a 12.0 s demo loop: `/` → command list → filter → pick → chip, type, `@` → agents/people list → filter → pick → chip, type, `@` → filter (closes on a trailing space, reopens) → pick.
- **Destination**: `ai-ui-gallery/src/clones/prompt-mention/` (React 19, TS, Tailwind v4, clone-local CSS; CSS keyframes for the popover's opacity/transform; no motion/WAAPI so both clocks render the same).
- **Fidelity**: motion-faithful. UIStacks is a paid catalog (Pro license key needed for the source); no open-source license. Own palette, Geist (Google Fonts), lucide icons, fictional agents/people/commands, own copy.

## Captures

- Reference: `capture-ref.sh ref` (virtual clock, 20 fps, 12.3 s from 11.7 s after load = the second demo loop; `prejs-ref.js` finishes the reference's WAAPI animations as they start, because the virtual clock does not drive them).
- Clone: `capture-clone.sh clone-N` (same viewport, crop size, pre-js, fps, duration and clock; stage at 440,274; longer network wait so the lazily imported clone mounts before virtual time runs; wait 11567 ms to line the loops up, residual offset ±100 ms from the clock's start time is taken out with `compare.ts --offset`).
- WAAPI rows (popover enter/exit) measured on the real clock: `probes/rprobe.ts` (rAF samples), `review/anims.txt` (the reference's `getAnimations()` timings).

## Static layout (natural px; shown at 0.92)

- Card 560 wide, radius 20, padding 16, white on a light page; top-left at (22.4, 16) of the 560x352 crop. Text 15/24, 2 rows (48 px). Toolbar 12 below: two 32 px round icon buttons, a 12/16 hint, a 32 px send button at the right (filled when there is text, a bare arrow when empty). Caption 13/20 centred 16 below the card.
- Popover 288 wide, radius 16, padding 4, soft two-layer shadow, transform-origin top-left, top = anchor line top + 31, left = anchor x clamped to ≤ 200. Group label 12/16 medium (28 px row), option 52 px (24 px icon, 14/20 name, 12/16 sub, ↵ glyph on the active row), list max-height 260 (scrolls), footer hint row 33 px. Heights: 3 commands 225, 1 option 121, 2 options 173, 6 options 301.
- Active row: filled 12 px radius highlight; first match is active after every keystroke.

## Rows (times relative to the loop's first list open; 50 ms per typed character)

| # | element | property | trigger | start | duration | from → to | easing | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | composer text | value | loop | 0 / 1133 / 1183 / 2633 / 2700 / 5150 / 6283 / 6333 / 7700 / 9850 / 9883 / 9933 / 9983 / 11233 / 11300 / 11350 / 11483 / 11550 ms; reset 11950, period 12000 | 50 ms per char | `/`, 2 filter chars, pause 1150, rest of the name, space; 26 chars; `@`, 2 chars, pause, rest, space; 20 chars; `@`+3 chars at once, pause, 3 chars (wraps to line 2), space (closes), last name (reopens), space | step | events = open, filter, filter, jump, close, … as in report |
| 2 | popover | mount | trigger char at a word start | same frame | — | — | — | closes on a trailing space or when nothing matches; reopens when the query matches again |
| 3 | popover | height | each filter keystroke | same frame | 0 | 225 → 173 → 121 (and 301 → 253 → 173 → 121) | instant | no height tween |
| 4 | popover | opacity | open | 0 | ~170 visible (400 ms spring) | 0 → 1 | spring, 3 % overshoot clamped (0.27 @ 40 ms, 0.66 @ 80, 0.99 @ ~160) | WAAPI in the reference: real clock only |
| 5 | popover | translateY, scale | open | 0 | ~150 visible (400 ms spring) | −4 px, 0.96 → 0, 1 | same spring (s 0.97 @ 50, 0.99 @ 100, 1.00 @ 150; y peaks +0.12 px @ ~195) | origin top-left |
| 6 | caption | opacity | open / close | +1 frame | 100 | 1 → 0 / 0 → 1 | cubic-bezier(0.4,0,0.2,1) | CSS transition (both clocks) |
| 7 | popover | opacity, scale | close | 0 | 100, unmounted ≈ 117 | 1 → 0, 1 → 0.96 | ease-out | no translate on exit |
| 8 | popover | left / top | exact match, line wrap | same frame | 0 | anchor = trigger char; on an exact match the caret (chip end); clamp left ≤ 200 | instant | jumps at `/checklist` (+2633), wrap (+11233), full name (+11483) |
| 9 | highlight | translate | popover jump while open | same frame | ~300 | old screen position → row | spring glide | reference: motion layout glide of the active-row fill |
| 10 | popover | opacity, transform | reopen during exit (+11350) | 0 | 400 spring | from the exit's current value → 1 | spring | reference resumes from scale 0.973 |
| 11 | chip | background / colour | exact match | same frame | 0 | plain → chip (grey for commands, tinted for mentions) | instant | stays after the space |
| 12 | hint, send | visibility, fill | empty / open | same frame | 0 | — | instant | hint hidden while empty or open |

## Additions

None. Keyboard (↑/↓, Enter/Tab, Esc), pointer pick, toolbar `@`/`/` buttons and Backspace-removes-a-chip are interactive versions of what the reference's hint row and caption describe; the gallery autoplay stops on the first real input (`?autoplay=0` disables it).
