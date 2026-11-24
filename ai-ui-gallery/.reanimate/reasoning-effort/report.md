# reasoning-effort: reanimate report

**Cloned:** assistant-ui "Reasoning effort" (https://www.assistant-ui.com/elements/reasoning-effort), **pixel-faithful**. assistant-ui is MIT (LICENSE at raw.githubusercontent.com/assistant-ui/assistant-ui/main/LICENSE, verified for the `message-queue` clone); attribution to the assistant-ui authors is in `meta.ts` and `selection.md`.

**Code:** `src/clones/reasoning-effort/` (`index.tsx`, `reasoning-effort.css`, `meta.ts`). View it at `/c/reasoning-effort`.

**Behaviour:**
- It plays once on mount.
- The corner button toggles Pause and Replay (icon crossfade 200 ms, scale .25, blur 4 px).
- Low/Medium/High/Max rescales the cap (2,000 / 8,000 / 24,000 / 64,000) while the used share stays put.
- The four state tabs (Default, Not started, Budget spent, Read only) are an addition. They show only on hover of the stage, so the capture crop stays identical to the reference.
- Replay animates only the Default state; the reference's replay behaviour in the other states was not probed.

**Spec rows from the reference** (computed styles, 1440x1000 viewport, preview box at 352,307, 784x360):
- Widget: max-w 384, 10 px gap.
- Title: Public Sans 13.5/500.
- Count: JetBrains Mono 11 px, tracking -0.025em, tabular, muted.
- Segmented track: pill, 2 px padding, 2 px gap, bg foreground/4%.
- Options: 12 px/500, 4 px vertical padding. Active option is the page bg with foreground/90.
- Options have a 150 ms cubic-bezier(.4,0,.2,1) colour/scale transition and a 0.97 press squeeze.
- Progress bar: 3 px tall, track foreground/6% with a 1 px inset ring at foreground/10%. Fill is blue-500 with a 500 ms width transition on the same ease.
- Replay button: 28 px at the top-right of the inner box (-12, -12).
- Replay icon swap: 200 ms, cubic-bezier(.2,0,0,1).
- Preview box: 1 px border plus 24 px padding.
- Caps: Low 2,000 / Medium 8,000 / High 24,000 / Max 64,000.
- State tabs:
  - Default: High, 58%, 13,920 / 24,000.
  - Not started: Medium, 0 / 8,000.
  - Budget spent: Low, 2,000 / 2,000, 100%.
  - Read only: Max, 41,312 / 64,000, 64.55%, options are spans with aria-current.
- Motion:
  - Plays on load and on Replay.
  - The fill goes 14 -> 29 -> 41 -> 52 -> 58 % in steps of 900 ms, the first one immediate.
  - The button label flips to "Replay animation" at the end.
  - Changing the effort after the run only rescales the count; the bar stays at 58% and nothing replays.

## Verification (2 rounds, real clock)

Setup: 1440x1000. Reference clip 352,307,784,360; clone `[data-stage]`. In-page rAF logs of the aria-valuetext / bar width / button label serve as the timing probe.

| Row | Reference | Clone | Verdict |
|---|---|---|---|
| Final static frame (Default), mean abs pixel diff | n/a | 0.25% mean, 1.7% of pixels differ by more than 8/255 (threshold 2%) | PASS |
| Step interval 14→29→41→52→58 | 907 / 899 / 901 / 902 ms | 899 / 901 / 898 / 900 ms | PASS (error under 10 ms; limit 80) |
| First step | immediate 14% on click | immediate (after round-2 fix) | PASS |
| Label flip to "Replay animation" | at last step (7715 ms) | at last step (7750 ms) | PASS |
| Bar width easing | 500 ms cubic-bezier(.4,0,.2,1) (computed style) | same CSS | PASS (declared match) |
| Effort click after run (rescale only, bar stays 58%) | caps 2,000 / 8,000 / 24,000 / 64,000 | same | PASS |
| Other states (Not started, Budget spent, Read only) | text and aria read from the DOM | same values | PASS (static values; no pixel diff run) |

**No compare sheet is kept for this slug.** The `capture.ts`/`compare.ts` motion-window numbers were unusable: reference track timestamps drifted under the shared-CPU load (intervals of about 1.1 to 1.9 s), the reference page also autoplays on load so a click trigger caught a second run, and the 3 px bar is too small for compare.ts's activity detector (0.1 s window for the reference, none for the clone). Timing rows use in-page rAF probes of the DOM instead, and pixels use the final-frame diff.

## Residual deviations

- The diff residue sits on the label text of the four options and on the bar track. It is anti-aliasing, plus a likely 1 px or sub-pixel vertical offset of the widget (unresolved; the diff alone does not separate the two). It is about 0.25% mean.
- The clone has no 1 px figure border or rounded corners around the stage (same convention as `message-branches`), and its background is flat #fdfcfa.
- The clone's replay button runs the sequence only in the Default state. Replay in the other states was not probed on the reference.
- Keyboard focus rings were not tested.
