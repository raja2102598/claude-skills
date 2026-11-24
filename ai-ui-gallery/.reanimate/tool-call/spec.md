# tool-call motion spec

**Target**: Arc UI "Tool call" (Pro), https://uiarc.dev/components/tool-call, the live preview (`[class*=preview-shell_bezel]`, crop 685x430 at 370,404 in a 1440x900 viewport). The whole preview turn: user bubble, streamed lead-in sentence, and the grouped tool-call card that runs three calls (success, success, failure), plus the reference's own follow-ups: Retry (re-run, success, an approval row), Allow / Deny (finish, collapse, streamed answer, "Run again").
**Destination**: `ai-ui-gallery/src/clones/tool-call/` (React 19 + TS, Tailwind v4, `motion/react` for JS-driven heights, CSS keyframes for opacity / transform / filter, lucide icons, clone-local CSS with Geist from Google Fonts). Renders alone at `/c/tool-call`.
**Fidelity**: motion-faithful. Arc UI Pro is paid (Pro badge, "Get Pro", code locked), so the clone is written fresh: own warm palette, Geist / Geist Mono, lucide icons instead of the GitHub / Linear / PostgreSQL / Slack marks, own placeholder copy (fictional repo, board, database and channel).

## Captures
- `ref/`: main run. `capture.ts --clip 370,404,685,430 --trigger click --target "[data-ref-preview]" --pre-js prejs-ref.js --wait-before 3000 --duration 7000 --fps 25 --clock virtual`. The demo has no replay control and is not started by visibility; it restarts when the docs tabs switch Code → Preview, so pre-js clicks "Code" and the trigger clicks "Preview". t = 0 is that click (frame 5). Frames 0–8 show the docs page's own tab transition (code panel leaving, panel fading and sliding 6 px), not the component: compare from frame 9 (t = 0.16 s).
- `ref-retry/`: `--wait-before 8000 --trigger click --target "[aria-label^='Retry:']" --duration 2500`, otherwise the same.
- `ref-allow/`: pre-js `prejs-ref-allow.js` clicks Retry and advances the virtual clock 1.6 s, then the trigger clicks Allow; `--duration 3000`.
- `probes/arc-*.json`: real-clock rAF probes (opacity, transform, filter, inline shimmer gradient, heights every frame). The reference runs its opacity / scale / blur through motion (WAAPI): under the virtual clock those collapse to 1–2 frames, so those rows come from the probes. Heights and the shimmer position are JS-driven and exact on the virtual clock.

## Structure at rest (crop px, end of the main run)
| element | ref | box | notes |
|---|---|---|---|
| stage | `preview-shell_bezel` | 685x430 | flat grey (#f7f7f7) behind the demo; the demo column is centred vertically, so every height change moves it up by half |
| demo column | `tool-call_demo` | x 23, w 640 | grid, gap 20 (bubble → turn), turn gap 12 (prose → card) |
| user bubble | `tool-call_user` | right-aligned, 285x38.5 | 15 px / 22.5, padding 8/16, radius 14, muted fill |
| prose | `tool-call_prose` | h 23.25 | 15 px / 1.55, two chunks |
| card | `tool-call_group` | 640 x 197 (3 rows, one failed) | 1 px border, radius 16, white |
| card header | `groupToggle` | 630x40 inside 4 px padding | stacked 20 px round marks (12 px glyph, 16 px step), label 13 px muted (flex 1), meta 12 px, chevron 16 |
| call list | `calls` | border-top 1 px, padding 4 | rows 630x40; failed row 58 (title 20 + note 18 + 12 padding; Retry 28 high sits on the title line) |
| row | `tool-call_head` | grid 16 / 1fr / auto / 16 / 16, gap 10, padding 6/12 | mark, title (13 px/20), aside (12 px muted "4 results · 1.2s"), status icon 16, chevron 16 |

## Main timeline (t = 0 at mount / the Preview click)
| # | element | property | from → to | start ms | duration | easing | source |
|---|---|---|---|---|---|---|---|
| 1 | bubble | present | – | 0 | – | – | ref frames 7–9 (static, no entrance) |
| 2 | prose chunk 1, chunk 2 | opacity | 0 → 1 | 180, 230 (+50) | 150 | cubic-bezier(.22,1,.36,1) (CSS anim) | ref frames 10–12; probe: 2nd chunk +50 |
| 3 | card slot | height | 0 → 99 (header + row) | 600 (+17 first growth) | ~450 to 99 % | critically damped spring, ω ≈ 17.2 rad/s (k 300, c 35) | ref track: 3.6/11.3/21.5/32.3/42/51.5 px at +16/33/50/66/83/100 ms |
| 3b | card slot | opacity | 0 → 1 | 600 | 150 | ease-out | probe .23/.39/.53/.66/.78/.87/.95/.99 every 16 ms |
| 4 | row title (running) | shimmer band | band 4.4 em wide, base muted → ink at centre, sweeps left → right across the title cell | ~+220 after the row mounts | 1800 per pass (0.29 px/ms over a 518 px cell) | linear | probe inline gradient 0 → 100 % in 1800 ms; ref frames 30–46 |
| 4b | card header label (any call running) | shimmer | same | ~+180 | 1800 | linear | probe |
| 5 | running status | spinner rotation | 0 → 360° | with the row | 800 per turn | linear, infinite | CSS `tc-spin .8s linear infinite` |
| 6 | row 1 done | label | "Searching…" out (opacity 1 → 0, blur 0 → 2 px, 150 ms, cubic-bezier(.22,1,.36,1)); "Searched…" in (opacity 0 → 1, blur 4 → 0, 200 ms, cubic-bezier(.16,1,.3,1)), stacked in place | 1800 | 150 / 200 | as listed | probe |
| 6b | row 1 done | status icon | spinner out: opacity 1 → 0 (100 ms ease-out), scale 1 → .6; check in: opacity 0 → 1 (100 ms ease-out), scale .6 → 1 | 1800 | scale ~350 | critically damped spring ω ≈ 25 | probe scale .61/.66/.72/.78/.84/.88/.91/.94/.95 every 16 ms |
| 6c | row 1 done | aside meta | opacity 0 → 1 | 1800 | 150 | cubic-bezier(.22,1,.36,1) | probe |
| 7 | row 2 | mount: row height 0 → 40 | 2017 | ~450 | spring ω ≈ 17.2 | ref track (list 99 → 139) |
| 7b | row 2 | opacity 0 → 1 | 2017 + 60 delay | 150 | ease-out | probe |
| 7c | header stack mark 2 | opacity 0 → 1 (150 ease-out), scale .6 → 1 (spring ω ≈ 17) | 2017 | ~400 | – | probe |
| 7d | header label | "Using 1 tool" → "Using 2 tools" crossfade (as 6) | 2017 | 150 / 200 | – | probe |
| 8 | row 2 done | as 6–6c | 2777 | – | – | ref frames 74–75 |
| 9 | row 3 | mount, as 7–7d ("Using 3 tools") | 3000 | – | – | ref track |
| 10 | row 3 fails | label crossfade → "Could not …"; spinner → error icon (as 6b); note line added; row height 40 → 58 (spring ω ≈ 17.2); Retry fades in (150, cubic-bezier(.22,1,.36,1)) | 4385 | – | – | ref frames 114–115, probe |
| 10b | card header | "Using 3 tools" → "Used 3 tools" crossfade, shimmer stops; "1 failed" fades in (150 ease-out, danger tint) | 4385 | – | – | probe |
| 11 | demo column | y | follows every height change (centred) | – | – | – | layout |

## Follow-ups (t = 0 at the click)
| # | trigger | what | when |
|---|---|---|---|
| R1 | Retry | row 3 back to running: label crossfade, error → spinner, note removed (height 58 → 40 spring), Retry fades out, "1 failed" fades out, header "Used" → "Using" | 0 |
| R2 | | row 3 succeeds (as 6–6c) with its meta | 700 |
| R3 | | approval row mounts (as 7–7c): accent-tinted box, note line, Deny / Allow + shield icon; header → "Waiting for approval" | 975 |
| A1 | Allow | approval row → running "Posting to …": note removed (58 → 40), buttons fade out, header → "Using 4 tools" | 0 |
| A2 | | row 4 succeeds; header "Used 4 tools", total time "3.0s" fades in | 620 |
| A3 | | card collapses: list opacity → 0 (~100 ms), list height → 0 (spring ω ≈ 17.2), header chevron 180° → 0 (440 ms spring curve) | 1100 |
| A4 | | answer paragraph streams in 5 chunks, ~45 ms apart, 150 ms fade each | 1580 |
| A5 | | "Run again" appears under the answer (restarts the whole turn) | 2280 |
| D1 | Deny | row 4 → denied (muted title, "Denied", ban icon); header "Used 4 tools" + total; answer streams after ~480 ms; "Run again" ~700 ms later | 0 |
| X | row / header click | rows open their input / output details and the header collapses the list with the same height spring and chevron rotation | – |

## Additions
- `?autoplay=0` capture mode: the stage stays empty until `[data-tc-start]` (an invisible full-stage button) is clicked, so the clone uses the same click trigger as the reference. The gallery plays on mount.
- `prefers-reduced-motion: reduce`: no shimmer, spinner or springs; states still step on the same timeline.
