# agent-builder spec

- **Target**: Arc UI "Agent builder" block preview (https://uiarc.dev/components/blocks/agent-builder), the card `[class*=agent-builder_card]` (640x816): Configure view, Configure/Test switch, test chat from a suggestion click.
- **Destination**: `src/clones/agent-builder/` (React 19, Tailwind v4 not needed, clone-local CSS, lucide icons).
- **Fidelity**: motion-faithful (paid block). Own palette (warm paper, deep green), IBM Plex Sans, lucide icons, fictional names (Courier, Relay, Tracker, Notebook, Ledger, Nova 2, Atlas Mini).

## Motion rows (ms; chat rows from the click, virtual-clock capture, CSV-export suggestion, 25 fps)

| # | element | trigger | start | dur | from -> to | easing |
|---|---|---|---|---|---|---|
| 1 | knowledge upload bar | mount | 600 | 2640 | 0 -> 97 % in 9 lumpy steps, each a 150 ms scaleX ease-out | cubic-bezier(.22,1,.36,1) |
| 2 | upload row -> file row, files 2 -> 3 | mount | 3240 | instant | "Support macros.csv 97 %" -> "1.4 MB . CSV"; status "All changes published" -> "Unsaved changes", Publish grey -> dark | fade |
| 3 | Configure / Test | click Test | 0 | ~200 | cross-fade, selection pill slides 70 px | quint |
| 4 | empty state -> thread | click suggestion | 0 | 1 frame | empty state removed at once, user bubble in (~100 ms), "Thinking" label, send -> stop | - |
| 5 | tool chip 1 ("Created issue") | | 720 | 200 fade | label "Using tools" | quint |
| 6 | chip 1 result ("ENG-2481") | | 1200 | fade | | |
| 7 | chip 2 ("Posted message") then result | | 1720 / 1840 | | | |
| 8 | answer streaming, label "Writing" | | 1800 | 360 | | |
| 9 | done: label "Model . 2.2s", stop -> send | | 2160 | instant | | |

Real-clock run of the billing suggestion (3 chips) was 1.0 / 2.35 / 3.05 s, answer 3.05 -> 5.2 s, done 5.37 s ("3.8s").
