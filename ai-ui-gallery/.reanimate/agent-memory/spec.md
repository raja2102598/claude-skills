# agent-memory spec
- Target: Arc UI "Agent memory" block preview card (`[class*=agent-memory_card]`, crop 633x721).
- Destination: `src/clones/agent-memory/` (React 19, Tailwind v4 project, CSS transitions).
- Fidelity: motion-faithful (paid Pro block; own palette, Manrope, copy, lucide icons).

| row | element | reference (real clock, load avg 45, so about +-0.3 s) | clone |
|---|---|---|---|
| 1 | meter | 62 -> 66 %, quint-out, first change by ~0.33 s | 700 ms quint-out |
| 2 | new row | opens ~0.07 s after click, grey highlight held ~1.5 s then fades | grid-rows 320 ms quint-out, highlight held 1.5 s, 1.1 s fade |
| 3 | chip | "Memory updated" -> "Added: ..." (green icon) ~0.1 s -> "Saved to Preferences" ~0.4 s after click | same three labels, 450 ms |
| 4 | list | bursts at 1.33-1.42 s and 1.7 s after click; reading of frames suggests a smooth scroll of the new row | smooth scrollIntoView at +1.0 s (unverified guess) |
| 5 | forget / filter / search / edit / add | not measured (capture budget) | built from stills: 5 s ring undo then collapse; sliding filter pill 300 ms; search field replaces filters |
