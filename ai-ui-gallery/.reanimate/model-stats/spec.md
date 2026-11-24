Target: Arc UI "Model card" preview (https://uiarc.dev/components/model-card), the card with its model switcher.
Destination: src/clones/model-stats/ (React 19, Tailwind v4 present, plain CSS used, motion lib not needed).
Fidelity: motion-faithful (Pro component): own palette, DM Sans, fictional models, lucide icons.

Rows (from real-clock getAnimations probes of the reference, easing cubic-bezier(.22,1,.36,1) throughout):
- field swap on model change / compare / benchmark tab: old 100 ms opacity out, new 150 ms opacity in after 40 ms.
- model switch lands after about 800 ms (tab selects at once, content swaps once the lookup is done) - read from frames.
- compare switch track: 200 ms; segmented control colours 150 ms.
- skeleton bones pulse: opacity 1 -> .55 -> 1, 1400 ms ease-in-out, infinite.
- numbers: estimated cost rolls (cubic-out 420 ms, JS-driven); benchmark bars width 640 ms, rows re-rank by translateY 480 ms.
