# message motion spec

Target: Arc UI "Response feedback" preview, https://uiarc.dev/components/response-feedback. The crop is a fixed clip of 397,419,632,690 at a 1440x1200 viewport: the 600 px card (`[class*=response-feedback_card]`) plus 16 px on every side, with room for the open panel and the demo switch below it. The pre-js (`prejs-ref.js`) pins the docs canvas to `min-height: 820px; align-content: start`. That keeps the host page's own auto-height animation and the "When to use" heading out of the crop. It does not touch the component.
Destination: `ai-ui-gallery/src/clones/message/`. Stack: React 19 + TS, plain clone-local CSS, lucide-react. Height springs are stepped on rAF; short fades and pops are CSS keyframes and transitions.
Fidelity: motion-faithful. The component carries Arc's Pro badge (paid, source behind the Pro plan) and states no open-source license. The clone uses its own palette (warm paper, slate-indigo primary), Geist and Geist Mono, and its own copy ("Nova 2", a backup/export question, its own reasons and labels). The mark is a lucide sparkle and the thanks check is drawn by hand. No Arc CSS, JS or assets were used.

Reference captures, all with `--clock virtual --network-wait 300 --wait-before 7000 --pre-roll 200` (see `capref.sh`):
- `ref-hover`: `--trigger hover --target "[aria-label='Bad response']"`, 700 ms at 30 fps
- `ref-down`: `--trigger click --target "[aria-label='Bad response']"`, 1000 ms at 60 fps
- `ref-copy`: `--trigger click --target "[aria-label='Copy reply']"`, 2300 ms at 30 fps
- `ref-submit`: pre-js opens the panel and picks "Too long", then `--pre-hover` on Submit for 800 ms; `--trigger click` on Submit, 2900 ms at 30 fps

Real-clock probe (`probes/arcanims.ts` → `probes/arc-anims.json`): every `Animation` created after each step, with its duration, delay, easing and keyframes, plus a per-rAF box track.
Clone captures: `capclone.sh N` runs the same flags with `--url http://127.0.0.1:<own port>/c/message?autoplay=0 --selector "[data-stage]"`. The targets are `[data-mf=down|copy|submit]`, and `prejs-clone-submit.js` does the same setup as the reference's submit pre-js.

## Structure (card-relative px)

| element | ref → clone | box | notes |
|---|---|---|---|
| card | `response-feedback_card` → `[data-mf=card]` | 16,16 in the crop; 600 × 380 at rest | border 1, radius 20, padding 16, grid gap 16 |
| prompt bubble | `_bubble` → `.mf-bubble` | right-aligned, 440 × 56 | radius 14, padding 8/12, 13/20 |
| reply | `_reply` | author 20, body 202 (p 70 + ul 124), action row 32 at y 331 | grid gap 8; the action row is 4 px further down |
| action buttons | `_iconButton`, copy button | 32 × 32, radius 14, gap 2, row starts 8 px left of the text | glyphs 16 px |
| panel clip | `_panelClip` → `[data-mf=panel-clip]` | at y 363; height 222 (thumbs-down form), 94 (thumbs-up), 66 (thanks) | overflow hidden; padding-top 8; panel border 1, radius 14, padding 12 |
| tooltip | `[role=tooltip]` | 44 tall, 8 px above the button, centred | dark pill, radius 14, 13 px |
| demo switch | "Fail the next send" → "Simulate a send error" | 40 tall, 16 px below the card | moves down with the card |

## Timeline (t = 0 at the trigger; "virt" = virtual-clock track, "real" = real-clock getAnimations probe)

| # | trigger | element | property | from → to | start | duration | easing | source |
|---|---|---|---|---|---|---|---|---|
| 1 | hover | thumb button | background, colour | → hover tint | 0 | 150 | quint-out (0.22,1,0.36,1) | real |
| 2 | hover | tooltip | mounts after a delay; opacity, translateY + scale | 0 → 1; (3 px, 0.97) → none | 250 | 150 | expo-out (0.16,1,0.3,1) | virt + real |
| 3 | press | thumb button / tooltip | scale 0.94 (:active); tooltip opacity → 0, scale → 0.98 | | 0 | 100 | quint-out | real |
| 4 | click thumb | filled thumb glyph | opacity | 0 → 1 | 0 | 150 | quint-out | virt |
| 5 | click thumb | panel clip | height | 0 → 222 (card 380 → 602) | first rAF (17); moves from 33 | ~267 to 1 % | critically damped spring, ω = 26 rad/s (stiffness 676, damping 52) | virt |
| 6 | click thumb | panel clip | opacity | 0 → 1 | 0 (real +~18) | 150 | quint-out | real (WAAPI; it snaps under the virtual clock) |
| 7 | click thumb | first reason chip | focus moves into the panel | | 0 | — | — | frames |
| 8 | click copy | copy glyph | opacity 1 → 0, scale 1 → 0.7 | | 17 | 100 | quint-out | virt (scale) + real (opacity) |
| 9 | click copy | check glyph | opacity 0 → 1; scale 0.7 → 1; the stroke draws on | | 17 | opacity 100; scale ~300 to 1 %; draw ~200 | quint-out; spring ω = 26 | virt + real + frames |
| 10 | click copy | button colour | → green | | 17 | 150 | quint-out | real |
| 11 | +1800 | copy ← check | rows 8–10 reversed | | 1817 | as above | | virt |
| 12 | click Submit | label → spinner | label opacity → 0; loader opacity → 1; spinner rotates | | 0 | 150 / 150 / 700 per turn | quint-out / expo-out / linear | real |
| 13 | +700 | panel content | form → thanks; height snaps 222 → 66 (no spring) | | 700 | — | — | virt (same frame) |
| 14 | +700 | old form / thanks | old opacity 1 → 0; new opacity 0 → 1 and translateY 2 → 0 | | 700 / 740 / 750 | 100 / 150 / ~150 | ease-out / quint-out / stiff spring (ω ≈ 62) | real + virt |
| 15 | +700 | thanks check | stroke draws on from the left end | | ~800 | ~250 | quint-out | frames 29–36 |
| 16 | +2300 | thumb button | focus returns; its tooltip shows at once | | 2300 | 150 | expo-out | virt |
| 17 | +2300 | panel clip | height 66 → 0, opacity 1 → 0, then unmount (~2683) | | first rAF 2317; moves from 2333 | ~267 to 1 % | spring ω = 26; opacity 150 quint-out | virt + real |

Thumbs up: the same rows 4–7, with a 94 px panel ("What was good?" / Skip, reason chips; Skip turns into Send once a chip is picked). Skip folds the panel (row 17 from the click). Changing thumbs while the panel is open swaps the content and snaps the height. Pressing the selected thumb again clears it and folds the panel.
Failure ("Fail the next send" on): after the 700 ms spinner, the footer note turns red ("Couldn't send") and Submit reads "Try again".

## Clone mapping
- Rows 5 and 17: `SpringPanel` steps a critically damped follower (ω = 26) analytically on rAF and writes `style.height`. Its first frame only anchors the clock, as the reference does. A content change while the panel is open snaps the height (row 13).
- Rows 2, 3, 6, 8, 9, 12, 14 and 15 use CSS keyframes. Springs are sampled into `linear()`: ω = 26 for the check's pop, ω = 62 for the 2 px settle. Rows 1, 4 and 10 are CSS transitions. All of these run the same on the real and the virtual clock.
- Timers (`SEND_MS` 700, `THANKS_HOLD_MS` 1600, `COPY_RESET_MS` 1800, `TIP_DELAY_MS` 250) commit through `flushSync`, so each state lands in the frame its timer fires in.

## Additions (outside the verified runs)
- A gallery autoplay plays copy, thumbs down with a reason and Submit, then thumbs up with a reason and Send, and loops every 13 s. `?autoplay=0` turns it off, and any real pointer or key input stops it. `reanimate:replay` remounts the message.
- Escape closes the panel. An aria-live region announces each step.
