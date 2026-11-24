# Cloning brief

How each clone in this gallery was made. It also briefs the agent that clones one concept.

## The job, per concept

`concepts.json` groups the AI and agent entries from `pick-ui-library/references/ui-reference-index.md`
into concepts. A concept is one idea (an agent plan, a model picker, a thinking line) offered by
several catalogs. For each concept:

**Speed mode (from 24 Nov 2026):** up to 8 agents share 4 CPUs. Keep the candidate review to one
screenshot plus one short capture per candidate, cap reanimate at 3 rounds, and report any row that
still fails with its numbers instead of running a 4th round. Real-clock probes are noisier under this
load; prefer the virtual clock and the `getAnimations()` durations and easings.

1. **Look at every candidate.** Open each candidate URL with reanimate's `capture.ts` and find the
   live preview on the page. Use a short capture, about 3 s at 10 fps, cropped to the preview with
   `--selector`, then read the frames or the filmstrip sheet. Note anything that fails to load:
   a 404, a login wall, a 429 after one retry with a pause, or a preview that never renders.
2. **Pick the better one.** Judge, in order:
   - visual polish
   - how complete it is (states, interactions, empty or error handling)
   - motion quality
   - how cleanly it reads as an AI/agent pattern

   License plays no part in the choice: the best candidate wins, whichever catalog it comes from.
   Pick **one** winner. Pick a second only when the concept holds two genuinely different
   components rather than variants of one, and say why.
3. **Clone the winner with the `reanimate` skill.** Invoke the skill and follow its workflow: scope,
   capture, spec, build, verify, and repeat for up to 3 rounds (speed mode: the user asked for the remaining concepts as soon as possible).
4. **Record the selection** (see Output).

## Fidelity and licenses (non-negotiable)

- **pixel-faithful** only when the winner's license is verified open source, such as assistant-ui,
  AI Elements / shadcn/ui, Nuxt UI, Magic UI (free), Animate UI or daisyUI. Check the license file or
  page and write what you found in `meta.license`. Load the same fonts and match colours, spacing and
  radii. Keep the attribution in `meta` and in `selection.md`.
- **motion-faithful** for everything else: paid catalogs (beUI Pro, Kobra, Magic UI Pro, paid Arc UI
  entries), and any license you could not verify (UIStacks, Wensity, HorizonX, Bencho, Libraries.dev,
  Rare UI with its Commons Clause, free Arc UI if no license is stated). Match trigger, sequence,
  stagger, timing (±80 ms), easing family and layout proportions. Write the code fresh and use original
  styling: our own palette, a system or Google font, lucide icons, and no copied assets, copy text,
  logos or brand marks. Never copy a site's JS or CSS source into the clone.
- Use placeholder content: neutral names, sample prompts, and fictional model names such as
  "Nova 2" or "Atlas Mini" rather than real vendor logos.

## Where things go

Work only inside `ai-ui-gallery/`:

```text
src/clones/<slug>/meta.ts        export const meta: CloneMeta (see src/gallery/types.ts)
src/clones/<slug>/index.tsx      export default function, the component; play the motion on mount
src/clones/<slug>/*              any other files the clone needs (clone-local CSS, shaders, data)
.reanimate/<slug>/               reanimate working dir: spec.md, ref/, clone-N/, compare-N/
.reanimate/<slug>/report.md      the reanimate step-6 report (final compare table, residual deviations)
.reanimate/<concept>/selection.md  candidates reviewed, what failed to load, winner and why
```

`<slug>` is `<concept>` or `<concept>-<short-name>` when a concept has two winners.

- Stack: React 19, TypeScript, Tailwind CSS v4, `motion` (import from `motion/react`), `lucide-react`
  and `clsx` are installed. Canvas, WebGL2 and WebGPU are written by hand; no three.js. **Do not
  install packages and do not edit `package.json`, `src/gallery/*`, `src/main.tsx`, `index.html` or
  `vite.config.ts`.** Other agents are working in the same tree at the same time. If a clone truly
  needs a package, finish what you can and say so in the report.
- Fonts: `@import` from `fonts.googleapis.com` in a clone-local CSS file that `index.tsx` imports.
- Set `meta.stage` to the reference crop size and the background colour behind the component.
  The stage centres the component and crops to `[data-stage]`.
- Leave git alone: no commits, no branches. The coordinating session commits.

## Capturing

- The shared dev server is `http://127.0.0.1:5173`, and a clone renders alone at
  `http://127.0.0.1:5173/c/<slug>`. If it does not answer, start your own with
  `npx vite --port <5200 + a random number> --strictPort` from `ai-ui-gallery/` and stop it at the end.
- **Warm the page before every clone capture.** The dev server's Tailwind only learns a file's classes
  once Vite has transformed that file, so the first load of a new or edited clone renders unstyled and
  the CSS arrives mid-capture. Run
  `for f in src/clones/<slug>/*.ts*; do curl -s "http://127.0.0.1:5173/$f" >/dev/null; done; sleep 1`
  from `ai-ui-gallery/` first, then capture. Clone-local CSS files are not affected.
- reanimate is installed at `~/.claude/skills/reanimate`, and its setup is already done; run scripts as
  `bun ~/.claude/skills/reanimate/scripts/<name>.ts`. Use the same viewport, trigger, duration, fps
  and crop size for the reference and the clone. Crop the clone with `--selector "[data-stage]"`.
- Prefer `--clock virtual` on both sides for JS-driven motion. It makes captures exact and repeatable.
  **Trap:** the virtual clock does not drive WAAPI animations, and `motion` runs opacity and transform
  through WAAPI. Under it, a reference's motion animations collapse into 1–2 frames, and a clone's
  motion animations can stay frozen at their start value. Measure such rows on the reference with
  real-clock rAF probes (`--track` without `--clock virtual`). In the clone, use CSS keyframes for
  short opacity/transform transitions (sample a spring into a `linear()` easing). Those behave the same
  on both clocks. Keep `motion` for JS-driven values such as height and layout. Alternatives that also
  worked: animate motion values with `animate(value, …)`, or give a motion element an `onUpdate`
  handler. Either keeps the tween on motion's JS frameloop instead of WAAPI.
- For per-frame JS motion (streams, typewriters, counters), capture at `--fps 60` with `--clock virtual`.
  Below the page's 60 Hz rAF rate, the virtual clock runs several ticks per step, which can slow the
  reference's own scheduling (one stream ran 27 ms/word at 25 fps against 16.7 at 60). Also commit
  per-frame state with `flushSync` inside the rAF, or React may land it a frame late.
- Measure WAAPI rows on the real clock in your first or second round, not your last. Two clones needed
  a 6th or 7th round because their real-clock probes came late.
- The machine has 4 CPUs shared with other agents. Keep captures short (the motion plus about 1 s),
  use `--fps 25` or lower unless the motion needs more, and do not run captures in parallel yourself.
- Keep raw captures under `.reanimate/`. The `.gitignore` keeps `spec.md`, `report.md`,
  `selection.md` and the final round's `compare-*/sheets/compare-01.webp` (the coordinator converts it) and drops frames, video, JSON and PNG sheets.

## Done means

- `npx tsc --noEmit` passes in `ai-ui-gallery/`.
- `/c/<slug>` renders the clone and the motion plays on load (or on the documented trigger).
- `report.md` has the last compare round: timing error, mean mismatch, easing match per element, and
  pass or fail per spec row, plus each residual deviation with a number and a reason.
- `selection.md` lists every candidate with one line each and the reason for the winner.
- Subagents cannot write `report.md` (the harness refuses report files), so put its full text at the end
  of the final message and the coordinator saves it.
- The final message to the coordinator is short: the slug or slugs, fidelity, pass/fail summary, the
  winner and the runner-up, any candidate that failed to load, and any package the clone still needs.
