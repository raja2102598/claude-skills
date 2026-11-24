# chat-thread motion spec

**Target**: Arc UI "AI chat" block, https://uiarc.dev/components/blocks/ai-chat. The crop is `section[class*="chat_root"]` with `--chat-height: 720px`. The capture covers the scripted two-turn demo from its restart to rest:
- turn 1: question → thinking → tool → streamed markdown with a code block → actions;
- turn 2: an automatic follow-up with the same phases.

**Destination**: `ai-ui-gallery/src/clones/chat-thread/` (React 19 + TS, clone-local CSS for keyframes and fonts, `motion` only for JS-driven widths, lucide icons).
**Fidelity**: motion-faithful. Arc UI Pro is a paid catalog. The clone uses its own warm palette, Geist / Geist Mono (Google Fonts), lucide icons, an original spark mark, placeholder copy, and the model "Nova 2".

Viewport 1440x900 · crop `--clip 341,147,745,720` (745x720) · 10 fps main capture, 60 Hz rAF track · `--clock virtual`.

Reference captures (`capture-ref.sh`, `capture-ref-probe.sh`):
- `ref/`: main run, 22 s, `--track` on the thread, turns, reasoning, tools, markdown, actions, send and dock.
- `ref-probe/`: same trigger, no video. Pre-js `prejs-ref-probe.js` mirrors chunk counts, reasoning/tool/send/actions states, code-line counts and `scrollTop` into the widths of fixed divs, so `track.json` records them every frame.
- `ref-probe2/`: geometry of the thought button, the chevron, the label swap items and the tool chip at 60 Hz.

**Trigger**: the demo has no replay control. It restarts when the docs tabs switch Code → Preview. `prejs-ref.js` sets the height, clicks "Code" and scrolls the tab bar to y = 80. The capture trigger is a click on "Preview" (t = 0, frame 2).
- Frames 0–2 show the docs page's tab switch. Over the first 267 ms the panel slides up 6 px.
- The clone's equivalent: `?autoplay=0`, then a click on a hidden `[data-ct-start]` button.

The demo runs about 10 s and is at rest from 10.1 s. The main compare uses 11.5 s.

## Structure (static, crop px)

| element | ref → clone | box | notes |
|---|---|---|---|
| root | `section.chat_root` → `[data-ct-root]` | 0,0 745x720 | white surface, flex column |
| header | `.chat_header` → `[data-ct-header]` | 0,0 745x52 | 1px bottom rule; title button 18,9 162x34 (13px/500 + chevron); model chip 540,9 158x34 (mark + name + chevron); new-chat icon 701,9 34x34 |
| scroller | `.chat_scroller` → `[data-ct-scroller]` | 0,52 745x598 | overflow-y auto |
| thread | `.chat_thread` → `[data-ct-thread]` | padding 24/28/12, gap 28 between turns | |
| turn | `article.chat_turn` → `[data-ct-turn]` | x 28, w 689 | user row → 14 → reply (flex column, gap 10) |
| user bubble | `.chat_bubble` → `[data-ct-bubble]` | right-aligned, max 544, 15px/22.5, padding 10/16, radius 20 | 2 lines = 65, 1 line = 43 |
| reasoning row | `.chat_reasoning` → `[data-ct-reasoning]` | h 28 | mark 22x22 at x 28, button at x 56 (13px, padding 0 6) |
| tool chip | `.chat_toolChip` → `[data-ct-chip]` | h 30, pill, 1px border | icon, label, sources/count |
| markdown | `.chat_markdown` → `[data-ct-md]` | blocks gap 12, 15px/24 | lists: padding-left 22.5, item gap 6 |
| code block | `.chat_codeBlock` | radius 16, 1px border; header 36; pre padding 12/14/14, line 20.8 | 1 line = 85 high, +20.8 per line |
| actions | `.chat_actions` → `[data-ct-actions]` | h 30, margin −2/−6, 30x30 icons | hidden (takes space) until the reply ends |
| composer dock | `.chat_composerDock` → `[data-ct-dock]` | 0,650 745x70; padding 6/20/12 | form radius 24, padding 7; attach 34, field, send 36 |
| scroll-to-latest | "Scroll to latest message" | round, centred above the composer | shown only when the reader scrolls up (not in the demo) |

Block heights the copy must reproduce (they set when the thread starts to scroll):
- turn 1 markdown 524: p 24 · ol 186 (lines 1/2/2/2) · code 230 (8 lines) · p 48;
- turn 2 markdown 357: p 24 · ul 84 (1/1/1) · p 24 · code 189 (6 lines);
- turn heights 719 / 529; thread 1313 at rest; final `scrollTop` 715.

## Timeline (t = 0 at the Preview click; ms)

| # | element | property | from → to | start | duration | easing | notes / source |
|---|---|---|---|---|---|---|---|
| 1 | turn 1 body | opacity | 0 → 1 | 0 (first frame) | 150 | cubic-bezier(.22,1,.36,1) | CSS `fadeIn` (getAnimations) |
| 2 | send button | state | idle (light, arrow) → disabled | 0 | – | – | probe `send` |
| 3 | send button | idle → stop (dark bg, square) | bg 150 ms transition + icon swap | 467 | 150 | standard | probe `send`, ref-probe2 icon 18→16 px |
| 4 | "Thinking" label | text shimmer | dark band sweeps left → right, ~57 px/s, enters ~300 ms | 300 | loop | linear | label darkness per frame (bands peak 0.65 → 1.3 s) |
| 5 | thinking chevron | opacity | 0 → 1 | 567 | 150 | standard | ref-probe2 (0.44 at 583) |
| 6 | tool chip (turn 1) | mount | pops in (no fade), spinner 0.9 s/turn linear | 1450 | – | – | ref-probe2, CSS `spin` |
| 7 | thought label | swap | "Thinking" → "Thought for 4s": new label y +2 → 0 (and fade), old out | 1450 | 150 | standard | ref-probe2 transform samples |
| 8 | thought button | width | 80 → 117 | 1450 | ~350 | critically damped spring ω ≈ 25.75 (k 663, c 51.5) | ref-probe2, fit RMSE 0.004 |
| 9 | tool chip | label swap + width | 158 → 256, label y +2 → 0 | 2300 | ~350 | same spring / standard | ref-probe2 |
| 10 | stream turn 1 | chunks | one chunk group per tick, 51 ticks | 2433 + 50k (k = 0…50) | – | – | probe `c1`, md height steps |
| 11 | each chunk | opacity | 0 → 1 | per tick | 150 | standard | CSS `chunkIn` |
| 12 | md blocks turn 1 | growth | p k0 · ol item1 k5 · item2 k9 (line 2 k13) · item3 k14 (k18) · item4 k20 (k26) · code k27 (lines 1,1,3,3,4,4,4,6,6,7,7,7,8,8) · p k41 (line 2 k47) | | | | ref track md heights |
| 13 | scroller | follow live edge | per frame `scrollTop += (bottom − scrollTop)·0.22`, at least 1 px, applied the frame after growth | 4000 (first overflow) | – | exponential, k = 0.22 per 16.7 ms frame | thread y in ref track; ratio 0.21–0.23 per frame |
| 14 | send | stop → idle (disabled arrow) | | 4983 | 150 | standard | probe |
| 15 | actions turn 1 | opacity | 0 → 1 | 4983 | 150 | standard | ref track 0.44 / 0.72 / 0.87 / 0.94 / 0.98 per frame |
| 16 | turn 2 body | opacity | 0 → 1 (fade) + scroll to bottom (#13 law) | 6483 | 150 | standard | ref track (thread −105 → −256 over 300 ms) |
| 17 | send | idle → stop | | 6483 | 150 | standard | probe |
| 18 | tool chip turn 2 + label swap ("Thought for 2s") | as 6–8 | | 7033 | | | ref track (thread h +40) |
| 19 | tool chip turn 2 done | as 9 | | 7917 | | | probe `t2` −33 ms lag |
| 20 | stream turn 2 | 37 ticks | p k0 · item1 k5 · item2 k11 · item3 k16 · p k21 · code k27 (lines 1,2,3,4,4,5,5,5,6,6) | 8050 + 50k | | | ref track md heights |
| 21 | send → idle; actions turn 2 fade | | | 9900 | 150 | standard | probe |
| 22 | chunk spans flattened | – | – | +250 after the end | – | – | no visual change |

Trigger: click (Preview tab in the reference; hidden start button in the clone). Total length: about 10.1 s. Last visible change: actions turn 2 at about 10.05 s.

Not moving: the header, composer, dock and user-row hover actions (opacity 0 unless hovered).

## Style facts

- Reference: Inter, 15px/24 markdown, 15px/22.5 bubble, 13px UI. Neutral oklch greys; white surface; bubble oklch(.978); code bg oklab(.985); border oklch(.935–.965); orange vendor mark.
- Clone: Geist / Geist Mono; warm palette (paper #fbfaf7, ink #24211c, muted #7b746b, rule #ebe6de, bubble #f2eee7); teal spark mark; lucide icons; original copy (a nightly import that runs past 6 am; follow-up about 8 workers).

## Additions

None to the compared motion. Interactions present in the reference and wired in the clone:
- typing plus Enter / Send starts a new scripted turn; Stop ends the stream;
- the scroll-to-latest button appears when the reader scrolls up and glides back to the live edge;
- hovering a user turn shows copy / edit;
- new chat clears the thread.

Gallery autoplay loops the demo; `?autoplay=0` waits for the start button.
