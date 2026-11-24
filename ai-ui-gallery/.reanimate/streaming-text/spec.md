# streaming-text motion spec

Target: https://kobra.systems/components/streaming-text, live preview `[data-slot=preview-stage]` (607x548 at 1440x900), default speed 16 ms/word. It is the winner (see selection.md).
Destination: ai-ui-gallery/src/clones/streaming-text/ (React 19 + TS, clone-local CSS keyframes, lucide-react). No `motion`: every timed opacity, colour, blur and transform is a CSS animation, so it runs the same on the real and the virtual clock.
Fidelity: **motion-faithful**. Kobra's Streaming Text is a paid component (Pro / $19), and no open-source license is published. The copy, palette, font and icons are our own.
Viewport: 1440x900   Fps: 60 (one capture frame per 60 Hz rAF tick, see "Capture note")   Duration: 4500 ms   Trigger: load (the stream plays on mount)   Clock: virtual, seed 1
Reference capture: `.reanimate/streaming-text/ref`
  `capture.ts --url https://kobra.systems/components/streaming-text --out ref --viewport 1440x900 --selector "[data-slot=preview-stage]" --trigger load --duration 4500 --fps 60 --clock virtual --track "<first live word>, <live code card>, <replay wrapper>"`
Clone capture: the same command with `--url http://127.0.0.1:5173/c/streaming-text --selector "[data-stage]"` and the clone's own track selectors (`[data-layer=live] [data-word]`, `[data-layer=live] [data-block=code]`, `[data-replay]`).
Real-clock probes (rAF sampling, no virtual clock): `kprobe.ts` (word arrival and per-word curves), `rprobe.ts` (Replay: blur-out, reset, restream, button entrance). Scripts and JSON are in `.reanimate/streaming-text/probes/` (`kv1.json`: reference on the virtual clock at 60 Hz steps; `kprobe1.json` and `kr1.json`: reference on the real clock; `cv3.json` and `cr3.json`: the final clone).

## Capture note (why 60 fps)
The reference reveals one word per animation frame once 16 ms have passed. Under the virtual clock, capture.ts runs every rAF tick inside one `advance()` per capture frame. At 25 fps that is 2–3 ticks per call with no round trip in between, so React's passive effects lag and the reference streams at an artificial ~27 ms/word: the code card lands at 4.58 s instead of 3.13–3.15 s (`ref-25fps/`). Stepping one tick per capture frame (60 fps) gives the 60 Hz behaviour. The 60 Hz virtual probe (`kv1.json`) and the real clock agree: 1 word per frame, rAF 16.9 ms, 77 % of frames add one word, and the rest skip on this loaded machine. Both sides are captured at 60 fps.

## Structure (static, px inside the 607x548 crop)
| element | ref → clone | box at rest (x,y,w,h) | notes |
|---|---|---|---|
| stage | `[data-slot=preview-stage]` → `[data-stage]` | 0,0,607,548 | ref bg #fafafa → clone paper #f7f5f0 |
| column | `div.w-[34rem]` → `.stx` | 31.5,0,544,548 | flex column, gap 12: reply grid + a 32 px Replay row |
| reply grid | `.grid` (two layers in one cell) → `.stx-grid` | 31.5,0,544,503.9 | `aria-hidden` invisible full copy reserves the height; the live layer streams on top, so the box never grows |
| h4 | 1 line | y 0, h 28 | 18/28 px, weight 700 → Geist 600, tracking −0.45 px |
| p1 + source pill | 2 lines | y 40, h 48.8 | 15/24.375 px; the pill (h 20, r full, 11 px, ink/7 % bg) sits after the last word |
| p2 | 3 lines | y 100.8, h 73.1 | |
| list | 4 items, 1/2/1/1 lines | y 185.9, h 133.9 | disc markers in muted, padding-left 20, 4 px between items, 3-word medium lead-ins |
| code card | header 41 + body 44 | y 331.8, h 87, r 14 | white card, 1 px border; header: icon, mono label, two 28 px icon buttons; body: 13/24 mono, padding 10 16 10 10 |
| p3 | 3 lines | y 430.8, h 73.1 | |
| Replay | button 76x28, r 8, 12.8 px | x 32, y 518 | raised secondary button with an icon + "Replay" |

Word counts per block (each word is one stream tick): h4 6 · p1 20 (pill on word 20) · p2 42 · li 14 / 23 / 14 / 15 (3-word lead each) · code card (one tick + hold) · p3 36. Total 170 words + pill + card = 176 ticks. The clone's copy keeps these counts exactly.

## Timeline (t=0 = mount / navigation; the reference's first word is at 900.0 in the 60 Hz virtual probe, sampled visible at 916.7 by track.json)
| # | element | property | from → to | start ms | duration ms | easing | stagger / repeat | source |
|---|---|---|---|---|---|---|---|---|
| 1 | stream | first word inserted | – | 900 after mount (and 900 after a Replay reset) | – | – | – | kv1 (900.0), kv2 (Replay: reset +33, first word +917 from click), rprobe (real: reset +436, first word +1336) |
| 2 | stream | word cadence | 1 word per frame when ≥ 16 ms have passed | 900 | 170 words | linear | 16.67 ms/word at 60 Hz (168 gaps of 16.7) | kv1, kprobe (real: 16.9 ms frames, 1 word in 77 % of frames) |
| 3 | each word | opacity | 0 → 1 | its tick | 180 | ease `cubic-bezier(.25,.1,.25,1)` | per word | inspect.json `streaming-word-fade`; curve 0, .084, .262, .468, .638, .763, .852, .915, .957, .983, .997, 1 per 16.7 ms on both clocks |
| 4 | each word | colour | trail 1 → trail 2 (30 %) → trail 3 (60 %) → ink (100 %) | its tick | 180 | linear between stops | per word | inspect.json `streaming-word-hue`: ref blue 250° → violet 295° → rose 350° → ink; clone amber → tangerine → terracotta → ink |
| 5 | source pill | opacity (+ the word's fade) | 0 → 1 | the same tick as p1's last word | 180 | ease | – | kv1: n jumps by 2 at 1316.7 |
| 6 | blocks (h4, p, li) | appear | instant, with their first word; the li marker shows at once (no fade) | first word's tick | 0 | – | – | frames 2.20 s (bullet alone + faint first word) |
| 7 | code card | opacity | 0 → 1 | tick 134 (3133 in kv1, sampled 3150) | 300 | ease | the stream holds 100 ms (6 frames), and p3's first word is at tick 140 (3233) | kv1, track.json |
| 8 | stream end | last word | – | tick 175 = 3816.7 | – | – | – | kv1, track.json |
| 9 | Replay wrapper | opacity | 0 → 1 | the same frame as the last word (3816.7) | ≈280 | out-quint (RMSE 0.003 on the real clock) | – | rprobe real clock (the virtual clock collapses this WAAPI opacity to 1 frame) |
| 10 | Replay wrapper | translateY | 4 px → 0 | 3816.7 | ≈280 | out-quint (RMSE 0.002), JS-driven in the ref, so the virtual track shows it too | – | rprobe + ref track.json |
| 11 | Replay click: reply grid | opacity 1 → 0, filter blur 0 → 4 px (one progress) | – | click | ≈420 (settles; 99 % at 265) | critically damped spring ω = 25 rad/s (RMSE 0.010) | – | rprobe real clock |
| 12 | Replay click: Replay wrapper | opacity | 1 → 0 | click | ≈200 | out-cubic (RMSE 0.012) | – | rprobe |
| 13 | Replay click: reset | content cleared, grid opacity back to 1 | – | click + ≈436 | – | – | – | rprobe |
| 14 | restream | first word | – | reset + 900 (click + 1336) | – | – | rows 2–10 repeat | rprobe, kv2 |

Trigger: load (mount). Replay: click. Total length: 4.12 s from mount to rest (last word 3817 + 300). Last visible change: about 4.10 s (the Replay rise settles).

## Style facts (motion-faithful: our own look)
- Reference: ABC Diatype (paid) 15/24.375 px, ink oklch(0.145 0 0), muted oklch(0.556 0 0), bg #fafafa, trail oklch(0.7 0.14 250) → oklch(0.58 0.17 295) → oklch(0.62 0.13 350).
- Clone: Geist + Geist Mono (Google Fonts), the same sizes, paper #f7f5f0, ink #24201b, muted #7c756c, card #fffdf9 with border #e7e2d8. Trail: oklch(0.80 0.13 85) gold → oklch(0.68 0.17 52) tangerine → oklch(0.56 0.15 30) terracotta → ink. Lucide icons (BookOpen in the pill, SquareTerminal, Download, Copy, RotateCcw). The copy is our own reply, about a test runner's cold start.

## Pass criteria (motion-faithful)
- Stream start (first word), code-card tick, p3 start, last word and Replay appearance: each within ±80 ms of the reference.
- Cadence: words per frame identical (1 per 16.67 ms frame); total stream 2917 ms ± 80 ms.
- Per-word fade: same curve (meanAbsDiff ≤ 0.05) and duration ±16 ms; trail has 3 stops at 0/30/60 % then ink.
- Code card fade 300 ms ease (±16 ms); Replay entrance and exit, and grid blur-out: the same family, with the duration within ±80 ms on the real-clock probe.
- Layout: each block's y within 10 % of the column height of the reference's y, same line counts, grid height within 10 %.
- compare.ts activity curve: timing error ≤ 0.08 s (start, end, peak).

## Additions
- `prefers-reduced-motion: reduce`: words still stream (the content arriving is information), but without the fade, trail or blur. Replay resets at once, and the button appears without the rise.
- Accessibility: the live layer has `aria-busy` while streaming, and the reservation layer is `aria-hidden` and `inert`. The pill is a real button with an `aria-label` that lists its sources, the code card's buttons have labels, and Copy writes the command to the clipboard.
- `wordMs` and `startDelayMs` props (defaults 16 and 900) mirror the reference's speed setting. They are not shown on the stage.
