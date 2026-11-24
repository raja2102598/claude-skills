# orb-presence: candidate selection

Concept: Assistant orb (idle presence / launcher). Each reachable candidate was captured with reanimate
`capture.ts` (1440x900, `--clock virtual`, 3 s at 10 fps, cropped to the live preview). The captures and
filmstrips are in `.reanimate/orb-presence/candidates/<name>/`.

The rule (as updated by the coordinator): the winner is chosen on quality alone, judging visual polish,
completeness, motion quality and how clearly it reads as an AI/agent pattern. License only decides fidelity.

| # | Candidate | Loaded? | One line |
|---|---|---|---|
| 1 | Rare UI · Fluid Orb (rareui.com/components/fluidorb) | **No** | curl got HTTP 429. One try in a real browser (capture.ts) stopped at a Vercel Security Checkpoint: "Failed to verify your browser, Code 21". Recorded as unavailable. |
| 2 | Wensity · ChatGPT Orb (ui.wensity.com/components/chatgpt-orb) | Yes | A 260 px WebGL disc on near-black. Fractal noise pushes soft white ink up into a saturated blue field, inside a crisp circular mask with a faint dark halo. Slow, continuous drift. Playground: accent (6 swatches + custom), size, drift speed. **Pro** (paid). |
| 3 | Wensity · AI Orb (ui.wensity.com/components/ai-orb) | Yes | A near-black glass sphere with a violet rim light that orbits the edge (it travels top to right in about 3 s). Very polished. Billed as a loader ("drifts while a model generates"). Playground: gradient, size, drift, rim. **Pro**. |
| 4 | Wensity · Liquid Glass Orb (ui.wensity.com/components/liquid-glass-orb) | Yes | A soap-bubble glass orb that gates a page ("Swipe up to enter"). At rest it is almost still. It is an entry hero driven by a drag gesture, not an assistant presence. **Pro**. |
| 5 | assistant-ui · Orb (assistant-ui.com/elements/orb) | Yes | A realtime voice orb: a 64 px WebGL2 simplex-noise disc with five states (idle, connecting, listening, speaking, muted), four palettes and a connect/mute/disconnect bar. It is the most complete. At its size it shows little detail, and its glow leaves a dotted white fringe on the light preview. **MIT** (LICENSE in assistant-ui/assistant-ui). |
| 6 | Libraries.dev · Thinking orbs (libraries.dev/orbs) | Yes | Canvas 2D dot-spheres (56 px) inside "Solving...." / "Thinking...." pills, nine states. Well crafted, but they are status labels for a thinking indicator, not an idle orb or launcher. License not verifiable. |
| 7 | Rare UI · Matrix orb (rareui.com/components/matrixorb) | **No** | Same domain, behind the same Vercel checkpoint and 429. Unavailable. |

## Winner: Wensity · ChatGPT Orb

- **Visual polish**: the best of the set, tied with AI Orb. It is large and soft and well lit: the ink
  feathers into the blue field with no banding, and the mask edge is clean. assistant-ui's orb is small
  and shows edge artefacts. Libraries.dev's dots are tiny.
- **Reads as the AI pattern**: of the polished pair, this one is the "assistant is here" voice orb, the
  idle presence that this concept is about. AI Orb is described and built as a generation loader.
  Liquid Glass is a page gate, and Libraries.dev is a thinking label.
- **Motion**: a calm, continuous drift with no loop seam, which is what an idle presence needs.
- **Completeness**: AI Orb has the same playground axes (colour, size, speed). assistant-ui is more complete
  (five states and a control bar), but polish ranks first, and the clone adds the launcher states
  (hover, focus and press on an accessible button) itself.

**Runner-up: Wensity · AI Orb**. Its polish is equal and its motion is more visible, but it is a loader
rather than an idle presence. Third: assistant-ui Orb, the most complete, but behind on polish.

## Fidelity

Wensity components are marked Pro (paid), and no open-source license is published. The clone is
**motion-faithful**: the shader is written fresh from the recovered math, with our own palette (no blue
"ChatGPT" look and no brand name), a system font and lucide icons. No Wensity JS, CSS or GLSL is copied.
