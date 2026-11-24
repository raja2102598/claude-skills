# reasoning-tree: selection

- **Arc UI, Reasoning tree** (https://uiarc.dev/components/reasoning-tree, Pro/paid): loads fine after `--wait-before 6000`. It draws beam search as a tree: question, then three depths of thoughts. Each depth is proposed, scored (bars fill, numbers count up) and pruned to the beam. The winning path then lights up in green and blue. Controls: play/pause, step, reset, and a beam-width control (1/2/3). The status line goes Ready, Reading the question, Proposing N thoughts, Scoring N thoughts, Keeping the best K, Answer found.
- **Winner:** the only candidate, and a complete one. No runner-up.
- **Fidelity:** motion-faithful, because it is paid. The palette, copy, fonts (Geist), lucide icons and fictional model name ("Nova 2") are the clone's own. No source, CSS, SVG or text from the site was used.
- **Failures:** none.
