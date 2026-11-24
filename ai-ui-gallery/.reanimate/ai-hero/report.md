# ai-hero: reanimate report

**Cloned**: beUI Pro "AI Workspace" landing hero (iframe source https://sift.demo.beui.dev), **motion-faithful**. Brand "Wren", own palette, font, copy and icons.
**Added**: working textarea (placeholders hide while typing), chips fill the composer, send button shows a "Sent to Wren" flash.
**Code**: `src/clones/ai-hero/index.tsx`, `ai-hero.css`, `meta.ts`. The motion plays on mount: entrance in about 1.3 s, then the placeholder prompt rotates every 2.8 s.

## How it was verified
- Same settings on both sides: 1134x738, `--clock virtual`, 20 fps, 6.5 s, trigger none, clip 0,0,1134,738. Reference is sift.demo.beui.dev, clone is `/c/ai-hero`.
- Clone captures clone-1 to clone-7, with compare.ts runs compare-1 to compare-5. The final round is clone-7 and compare-5 (sheet `compare-5/sheets/compare-01.webp`). The clone captures after clone-1 also carried `--track` for the table rows, which does not change the frames.
- The reference's opacity animations collapse under the virtual clock (all words appear at about 0.25 s), so opacity timing was measured on the real clock with rAF probes on both sides (`ref/real2`, `clone-real`) and position timing from the virtual-clock tracks (`ref/r3`, `ref/r2`).
- Rounds: round 1 built the clone (wrong stagger, slow secondary elements). Round 2 fixed the secondary elements with a faster curve. The final pass fixed the headline stagger rule, chip position and width, and placeholder x.

## compare-5 (final)
| metric | value |
|---|---|
| mean mismatch (6 px blur) | 39.55% (sharp 35.46%); colour, font and copy, not motion |
| compare.ts window | ref frames 1–18 (0.90 s), clone frames 1–18 (0.90 s) |
| timing error | start 0 s, end 0 s, duration 0 s, peak 0 s (pass, limit 0.08 s) |

## Per-event timing (virtual clock, t at 10/50/90 % of travel, ms; ref / clone / err)
| element | ref | clone | err |
|---|---|---|---|
| word idx 0 | 217/317/517 | 217/317/517 | 0/0/0 |
| word idx 2 | 350/467/650 | 367/467/667 | +17/0/+17 |
| word idx 4 | 500/600/817 | 517/617/817 | +17/+17/0 |
| word idx 6 | 633/750/950 | 650/750/950 | +17/0/0 |
| eyebrow | 117/150/250 | 133/167/250 | +17/+17/0 |
| subline | 317/350/450 | 333/367/450 | +17/+17/0 |
| composer | 417/450/550 | 433/467/550 | +17/+17/0 |
| chip 1 | 367/433/533 | 417/450/550 | +50/+17/+17 |
| chip 2 | 417/450/550 | 433/467/550 | +16/+17/0 |
| chip 3 | 417/467/567 | 433/483/567 | +16/+16/0 |
| aurora bars (container) | 50/133/383 | 50/133/383 | 0/0/0 |

All rows are within 80 ms. The chip 10 % row is the slowest, at +50 ms.

## Headline stagger, real clock (50 % opacity, rel. to word 1, ms)
| index | ref | clone | err |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 1 | 83 | 67 | -16 |
| 2 | 150 | 150 | 0 |
| 3 | 217 | 237 | +20 |
| 4 | 290 | 303 | +13 |
| 5 | 407 | 367 | -40 |
| 6 | 436 | 434 | -2 |

Order rule: one global word index across both lines at about 73 ms per word; line 2 continues straight after line 1. All errors are within 80 ms (single real-clock capture each, so jitter is about +/-40 ms).

## Placeholder loop and static positions
- Exit starts at 2.817 s (clone about 2.82 s), enter 300 ms later (clone about 3.12 s), period 2.8 s over 3 texts (8.4 s cycle).
- Placeholder rest position: clone (215, 482) vs reference (215, 482.3).
- Chips rest at y 624 and x 226/449/687 with widths 214/229/221 (reference 227/449.5/686.2 and 214.5/228.7/220.8).
- Real-clock reference fades: words about 0.2 s, eyebrow 252 ms, subline 216 ms, chips about 230 ms, prompt exit 190 ms and enter 200 ms. The clone uses 0.2 to 0.24 s fades.

## Activity bursts in the reference curve (all accounted for)
1. Entrance 0 to about 1.25 s: aurora rise, headline words, eyebrow, subline, composer, chips.
2. Prompt swap at 2.85 s (exit) and 3.15 to 3.25 s (enter).
3. Prompt swap at 5.65 s (exit) and 5.95 to 6.1 s (enter).
The clone shows bursts at the same frames (2.85–2.9, 3.15–3.25, 5.65–5.7, 5.95–6.05). Nothing else moves in the reference.

## Residual deviations
1. **Mean mismatch 39.55 %.** Own aurora palette (aqua/green/lime against the reference's magenta/orange/blue), different font, headline copy and brand. Not motion.
2. **Headline has 7 words, wording differs.** Stagger index matches one to one.
3. **Per-word probe is one real-clock capture per side at 12 fps.** The worst word is -40 ms (index 5); treat the table as +/-40 ms.
4. **The eyebrow, subline, composer and chips run about +17 ms late** (the clone's delays are quantised by the 20 fps virtual frames), and chip 1's 10 % point is +50 ms late.
5. **Chip stagger for chip 2 is interpolated** between the measured chips 1 and 3 delays, and then confirmed within 17 ms at 50 % on the final capture.
6. **Placeholder exit fade is measured on the reference only** (real clock); the clone's fade is a fixed 0.2 s. Not re-probed on the clone.
7. **Tracks cover only words 1, 3, 5 and 7 on the virtual clock** (nth-child quirk in the reference tracker); the real-clock probe covers all seven.
