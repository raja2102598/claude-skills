# prompt-input motion spec

**Target**: Arc UI "AI composer" block, https://uiarc.dev/components/blocks/ai-composer, crop `section[class*="ai-composer_root"]`; the send sequence (empty-chat greeting state with a typed prompt → click Send → thread, thinking, streamed reply, done).
**Destination**: `ai-ui-gallery/src/clones/prompt-input/` (React 19 + TypeScript, Tailwind v4 available, `motion/react` for springs, lucide icons, clone-local CSS for fonts and keyframes).
**Fidelity**: motion-faithful (Arc UI Pro is a paid catalog; no open-source license). Original palette, Google fonts (Instrument Sans / Instrument Serif), lucide icons, own copy and fictional model "Nova 2".

Viewport 1440x900 · fps 25 (main) and 50 (probe) · `--clock virtual` · crop 745x679
Reference captures:
- `ref-real/`, `ref-real2/` — real clock, `--no-video`, rAF `--track` probes (pre-js `prejs-ref-probe.js` / `prejs-ref-probe2.js`, the second also mirrors the arc's opacity); the source for the opacity/transform rows marked **real** below.
- `ref/` — `capture.ts --url <arc> --selector 'section[class*="ai-composer_root"]' --trigger click --target 'button[class*="ai-composer_send"]' --pre-js prejs-ref.js --wait-before 1500 --duration 4000 --fps 25 --clock virtual --network-wait 300 --track …`
- `ref-probe/` — same, `--duration 1600 --fps 50`, pre-js `prejs-ref-probe.js` also mirrors the send arc's `stroke-dashoffset`, the ring-track opacity and the live chunk count into hidden fixed divs so `track.json` records them (analysis only).

Trigger: click on Send with the textarea pre-filled by pre-js (`execCommand('insertText')`). t = 0 is the click. In the gallery the clone autoplays the same sequence (types the prompt, then sends); `?autoplay=0` turns autoplay off so the capture uses the same click trigger as the reference.
Captures run 4.0 s (main) and 1.6–1.7 s (probes).

## Structure (static, crop coordinates)

| element | ref selector → clone selector | box at rest (x,y,w,h) | notes |
|---|---|---|---|
| card | `section.ai-composer_root` → `[data-pi-card]` | 1,0 745x680 (crop cuts the last row) | radius 24, 1px border, overflow hidden |
| greeting (new) | `.ai-composer_intro` → `[data-pi-intro]` | 26,240.6 695x30.8 | centred text, display font; group centred on the card's inner height |
| dock (new) | `.ai-composer_dock` → `[data-pi-dock]` | 26,295.4 695x96 | gap 24 under greeting |
| suggestions (new) | `.ai-composer_suggestions` → `[data-pi-suggestions]` | 26,407.4 695x32 | 3 pill chips, gap 8, centred, gap 16 under dock |
| dock (thread) | same | 26,559 695x96 | bottom padding 24 |
| surface | `.ai-composer_surface` → `[data-pi-surface]` | = dock | radius 20, padding 10, 1px border |
| textarea | `.ai-composer_input` | +11,+11 673x40 | 15px / 22.5px, padding 8 |
| toolbar | `.ai-composer_toolbar` | +11,+53 673x32 | left: + (32), 2 tool chips (118, 154); right: model chip (170), mic (32), send (32), gap 4 |
| send button | `.ai-composer_send` → `[data-pi-send]` | toolbar right edge, 32x32 | ring svg 40x40 centred on it, rotated −90°, `pathLength=1` |
| top-bar button | `.ai-composer_topBar` → `[data-pi-topbar]` | 700,13 32x32 | "new chat" (square-pen) |
| user bubble | `.ai-composer_bubble` → `[data-pi-bubble]` | right edge 721, y 57, h 43 | 15px/22.5, padding 10/16, radius 20, subtle fill |
| reply head | `.ai-composer_replyHead` → `[data-pi-replyhead]` | 26,120 h18 | 16px model mark + model name (13px muted) |
| reply body (grow) | `.ai-composer_grow` → `[data-pi-grow]` | 26,148 695 × 26 → 48 → 72 | overflow hidden; text 15px / 24px lines |
| reply foot | `.ai-composer_replyFoot` → `[data-pi-foot]` | 20,230 109x32 (final) | copy (32) + Retry (73), gap 4 |

## Timeline (t = 0 is the click)

Rows marked **real** were re-measured on the real clock (`ref-real/`, `ref-real2/`: `--track` rAF probes without `--clock virtual`,
aligned on the switch frame). The reference runs those opacity/transform tweens through WAAPI, which the virtual clock does not
advance, so in `ref/` and `ref-probe/` they collapse into one frame. Layout, stream and arc timing agree on both clocks.

| # | element | property | from → to | start ms | duration ms | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | greeting, suggestions | presence | shown → removed | 17 | 0 (instant) | – | track, frames |
| 2 | bubble, reply head, "Thinking" | presence | none → shown at rest position | 17 | 0 (no lift, no fade, both clocks) | – | probe tracks: bubble y and opacity constant |
| 3 | textarea | value | prompt → empty (placeholder) | 17 | 0 | – | frames |
| 4 | dock | translateY (FLIP) | −263.6 px → 0 | 17 (moves from 33) | ~650 (within 1 % at 383) | critically damped spring ω≈17.5 rad/s (stiffness 300, damping 35); easing.ts: material-emphasized 441 ms fit, no overshoot; same curve on the real clock | ref/track.json, ref-real |
| 5 | ring arc | opacity, visible fraction | 0 → 1 at once; 0.02 → 0.10 | 17 | 0 / 17 | – | probes |
| 6 | ring track | opacity | 0 → 1 | 17 | 230 (t½ 85) | easeOutQuad | **real** |
| 7 | send arrow | opacity / translateY | 1 → 0 / 0 → −4 px | 17 | 130 / 150 (t½ 118) | easeInQuint (lifts and fades late) | **real** |
| 8 | stop square | scale, opacity | 0.7 → 1, 0 → 1 | 17 | scale spring ω≈24 (stiffness 600, damping 49); opacity 260 (t½ 65) | spring / easeOutCubic | **real** (scale also in probe) |
| 9 | send button | background, colour | ink → soft fill | 17 | 150 | cubic-bezier(0.22,1,0.36,1) | inspect.json transition |
| 10 | mic | colour | normal → dim while streaming | 17 | 150 | same | frames |
| 11 | top-bar button | opacity | 0 → 1 | 17 + 183 delay | 220 (t½ 265) | easeOutQuad | **real** |
| 12 | "Thinking" | shimmer | dark edge enters from the left, ~100 px/s, ~110–125 px soft ramp | ~250 | until removal | linear | label pixel darkness, band 0: 121 → 95 from 280 to 640 ms |
| 13 | "Thinking" | presence | shown → removed | 667 | 0 | – | probes (both clocks) |
| 14 | reply chunks (8) | opacity per chunk | 0 → 1 | 700, 750, 800, 850, 900, 950, 1000, ~1033 | 150 each | cubic-bezier(0.16,1,0.3,1) | inspect.json CSSAnimation + probe chunk count |
| 15 | reply body | height | 26 → 48 (2nd line) | 850 | 158 | ease-out | probe + easing.ts |
| 16 | reply body | height | 48 → 72 (3rd line) | ~1035 | 150 | ease-out | probe |
| 17 | ring arc | visible fraction | 0.10 → 1.0 | 700 | ~480 (to ~1180) | starts at ~0.8 /s, ramps to ~2.2 /s in ~170 ms, keeps filling after the reply ends | probe arc channel (both clocks) |
| 18 | reply foot | opacity | 0 → 1, then rides the body height | 1050 | 160 (t½ 1082 from switch) | easeOutQuad | **real** |
| 19 | ring track | opacity | 1 → 0 | 1050 | 210 (t½ 1115 from switch) | easeOutQuad | **real** |
| 20 | stop square | opacity / scale | 1 → 0 / 1 → 0.7 | 1050 | 100 / 110 | easeOutQuart / easeOutCubic | **real** |
| 21 | send arrow | translateY, opacity | +4 px → 0, 0 → 1 | 1050 | spring ω≈24 (stiffness 600, damping 49); opacity 280 | spring / easeOutCubic | **real** |
| 22 | send button, mic | colour | stop on soft fill → muted arrow (empty); mic back | 1050 | 150 | cubic-bezier(0.22,1,0.36,1) | frames |
| 23 | ring arc | opacity | 1 → 0 once it has closed | ~1185 | 200 (t½ 1249 from switch) | easeOutQuad | **real** |

Trigger: click on Send (or Enter). Total length: ~1.45 s from the click (last change: arc fade and arrow settle).
Nothing else moves: bubble, reply head, toolbar chips and model chip are still throughout.

## Style facts the motion depends on

- Card 745x680, radius 24, overflow hidden; content column 695 wide at x 26.
- Composer 96 tall, radius 20; toolbar controls 32 tall, pills fully rounded.
- Reply text 15px / 24px lines; the body is an `overflow: hidden` box whose height animates to its content, so a wrapped line stays clipped until the height animation reaches it.
- Send ring: 40x40 svg, circle stroke ~1.5px, starts at 12 o'clock and fills clockwise.

## Additions

None. The clone also wires the obvious interactions of the reference (typing enables Send, Enter sends, suggestions fill the prompt, "new chat" returns to the greeting), but the verified sequence is the send sequence above.
