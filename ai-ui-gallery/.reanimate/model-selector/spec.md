# model-selector motion spec

**Target**: Arc UI "Model picker" block, https://uiarc.dev/components/blocks/model-picker, the live preview (`[class*="preview-shell_shell"]`, clip 340,110,745,620 after the shell is scrolled to y=100 so the menu opens below the pill). The interaction: click the pill → menu opens → pointer rests on row 2 → moves to row 3 → selects row 3 → menu closes, the pill and the summary swap to the new model.
**Destination**: `ai-ui-gallery/src/clones/model-selector/` (React 19 + TypeScript, Tailwind v4 available, `motion/react` for the JS springs, lucide icons, clone-local CSS for the font, keyframes and tokens).
**Fidelity**: motion-faithful. Arc UI Pro is a paid block (no open-source license). Original palette (warm paper), Geist from Google Fonts, lucide icons, own copy, fictional models and vendors (Nova, Atlas, Orbit, Kite) with our own simple marks.

Viewport 1440x900 · fps 25 · `--clock virtual` (main) · crop 745x620.

Reference captures:
- `ref/` — `capture-ref.sh ref --clock virtual`: `--trigger click --target 'button[class*="model-picker_trigger"]' --pre-js prejs-ref.js --wait-before 5500 --duration 2800 --fps 25 --network-wait 300`.
- `ref-real/` — same on the real clock (visual check of the WAAPI rows; it runs ~110–130 ms late because the real click and the timers drift).
- `ref-real-probe1.json` — `probes/arcprobe.ts`: real-mouse rAF probe (open → hover row 2 → select row 2) of menu, highlight, pill layers, summary layers.
- `probes/arcanims.ts` — `document.getAnimations()` dumped at each step: exact duration/easing/keyframes of every CSS transition and every WAAPI animation `motion` starts.
- `probes/arcpage2.ts` — the menu's in-place page mode (narrow layout): Effort page swap and height spring.

Trigger: real click on the pill (Radix opens on pointerdown). `prejs-ref.js` schedules the rest from that pointerdown with synthetic pointer events (virtual-clock timers, so exact): hover row 2 at 700 ms, hover row 3 at 1100 ms, select row 3 at 1500 ms (pointerdown, pointerup, click). The real pointer stays on the pill, so the pill keeps its :hover style throughout. t = 0 is the click.

## Structure (static, crop coordinates)

| element | ref selector → clone selector | box (x,y,w,h) | notes |
|---|---|---|---|
| column | `.model-picker_stage` → `[data-ms-column]` | 153,193.6 440×242 | centred; pill, then summary 24 below |
| pill (trigger) | `button.model-picker_trigger` → `[data-ms-trigger]` | 257.5,193.6 231×40 → 273.5,193.6 199×40 | radius pill, 1px border, padding 0 12 0 13, gap 8; mark 16, text, chevron 15 |
| pill text | `.model-picker_triggerText` → `[data-ms-text]` | w 157 → 125 | overflow clip; two stacked layers (name 500 + effort muted, gap 7) |
| menu | `[role=menu]` → `[data-ms-menu]` | 221,242 304×323 | 8 below the pill, centred on it; radius 20, 1px border, floating shadow; transform-origin = pill centre, 8 px above |
| list | `.model-picker_list` | padding 6 | 4 model items 54 tall, separator (1 px, 6 margin), 2 rows 40 tall |
| item | `[role=menuitemradio]` | 290×54 | mark 18, name 13/500, blurb 12 secondary, check 16 at right |
| highlight | `.model-picker_highlight` → `[data-ms-highlight]` | left/right 6, h = item h, translateY = item top in list | rounded `radius-8`, muted fill |
| description | `.model-picker_description` → `[data-ms-desc]` | 183,253.6 380×39 | 13/1.5, centred, 2 lines, slot min-height 45 |
| facts | `dl.model-picker_facts` → `[data-ms-facts]` | 153,314.6 440×60.5 | 4 columns, 1 px subtle border, cell padding 11/8/12 |
| note | `.model-picker_note` | y 387.1, h 16.8 | 12 px muted |
| change note | `.model-picker_change` → `[data-ms-change]` | y 415.9 slot h 20 | 14 px check (success) + 12 px text |

## Timeline (t = 0 is the click)

All CSS transitions below run correctly on the virtual clock (track.json matches the real-clock probe to 0.01). Rows marked **WAAPI** are `motion` animations the virtual clock collapses into one frame; their numbers come from `getAnimations()` and the real-clock probe.

| # | element | property | from → to | start ms | duration ms | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | menu | presence | none → mounted | 0 | – | – | ref/track.json |
| 2 | menu | opacity | 0 → 1 | 0 | 150 | cubic-bezier(.16,1,.3,1) | getAnimations (CSS transition) + track |
| 3 | menu | transform | translate(0,-6) scale(.97) → none | 0 | 440 | critically damped spring ω≈18.3 (sampled into linear()) | getAnimations + track |
| 4 | chevron | rotate | 0 → 180° | 0 | 440 | same spring curve | getAnimations + track |
| 5 | pill | border / background | hover → open (border-strong, muted fill) | 0 | 100 / 150 | cubic-bezier(.22,1,.36,1) | getAnimations |
| 6 | highlight | presence + position | hidden → on row 2 (y 60, h 54) | 700 (shown 717) | 0 (jumps) | – | track |
| 7 | highlight | opacity | 0 → 1 | 700 | 100 | ease-out (.0,.0,.58,1) | **WAAPI** getAnimations + real probe |
| 8 | highlight | translateY | 60 → 114 (row 2 → row 3) | 1100 (moves 1117) | ~350 (99 % at 1400) | critically damped spring ω=26 (stiffness 676, damping 52), rms 0.002 | track fit |
| 9 | menu | opacity | 1 → 0 | 1500 | 100 | cubic-bezier(.22,1,.36,1) | getAnimations + track |
| 10 | menu | transform | none → translate(0,-3) scale(.985) | 1500 | 100 | cubic-bezier(.22,1,.36,1) | getAnimations + track |
| 11 | menu | presence | mounted → removed | 1600 | – | – | track |
| 12 | highlight | opacity | 1 → 0 | 1500 | 100 | ease-out | **WAAPI** |
| 13 | chevron | rotate | 180° → 0 | 1500 | 440 | spring curve (row 4) | getAnimations + track |
| 14 | pill | border / background | open → hover | 1500 | 100 / 150 | cubic-bezier(.22,1,.36,1) | getAnimations |
| 15 | pill text, mark, description, changed fact values | old layer opacity | 1 → 0 | 1500 | 100 | cubic-bezier(.22,1,.36,1) | **WAAPI** |
| 16 | same, new layer | opacity | 0 → 1 | 1500 | 150 | cubic-bezier(.22,1,.36,1) | **WAAPI** |
| 17 | new pill text, fact values | translateY | 3 → 0 | 1517 | 150 | cubic-bezier(.22,1,.36,1) (fit error < 0.01) | track + real probe |
| 18 | new description, change note | translateY | 4 → 0 | 1517 | 150 | same | track |
| 19 | new mark | scale | .9 → 1 | 1517 | 150 | same | real probe |
| 20 | change note | presence + opacity | none → "Switched from …", 0 → 1 | 1500 | 150 | same as 16 | track (**WAAPI** opacity) |
| 21 | pill text | width (pill re-centres) | 157 → 125 (pill 231 → 199) | 1517 | ~320 (99.5 % at 1800) | spring ω=26 (stiffness 676, damping 52), rms 0.0025 | track fit |

Additions and secondary paths (not in the verified sequence):
- **Effort** and **More models** rows open in-menu pages (back row + list), the reference's own narrow-layout mode (`arcpage2.ts`): the page content swaps at once and the menu height springs (≈360 ms). The 745 px stage clips side submenus, so the clone always uses pages.
- Keyboard: arrows move the highlight, Enter selects, Escape closes or goes back, ArrowLeft goes back. Outside click closes.
- Gallery autoplay: on mount the clone plays the same scripted sequence once (open, row 2, row 3, select), then stays interactive. `?autoplay=0` turns it off for captures, which use the click trigger above.
