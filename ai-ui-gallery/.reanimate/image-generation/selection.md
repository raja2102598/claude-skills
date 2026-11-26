# image-generation: candidate review

Concept: Image generation loader. Speed mode: one screenshot plus one short capture per candidate (kept out of git). All six loaded.

| Candidate | Source | What it shows | Loaded |
|---|---|---|---|
| Image Generation Loader | Aceternity UI | A pixel-grid band labelled "ANALYSING" / "LOADING" sweeps over a static app screenshot. It is a scan overlay, not an image being generated. | yes |
| Image generation | assistant-ui (MIT) | A small dotted placeholder square with "1024 × 1024" and a "Generating" caption. Nearly static, no reveal. | yes |
| Image generation | Arc UI (Pro) | A full studio panel: halftone field with a drifting dark wave, colour bleed, blur-resolve, a staggered filmstrip of four variations, live %, Stop/Generate, upscale/vary/download, composer with model and aspect chips. | yes |
| Image Generation | Kobra | A chat reply with a "Composing scene" pill. Two halftone blobs wander in a grey frame; one image, no controls, and no resolve within the 8 s capture. | yes |
| AI Image Loading Animation | Wensity | A dark card: "Creating image" with a timer, particles that gather into the picture, a % counter. | yes |
| Image generations | UIStacks | A four-thumbnail card where each image blur-reveals with its own % chip, plus "0 of 4 ready". | yes |

**Winner: Arc UI "Image generation"** (https://uiarc.dev/components/image-generation).
- It is the only candidate that shows a whole generation run, from empty state through computing, colour emerging and resolving to done.
- Its motion is the richest and best paced: the elliptical wave, the colour bleed, the blur/scale resolve with a measured curve, and the 250/400 ms stagger.
- It is the most complete: empty state, progress, Stop with partial results, finished actions.
- License played no part in the choice; the clone is motion-faithful because the component is Pro (paid).

**Runner-up: Kobra.** It uses the same halftone idea and reads well inside a chat, but it is one image with no progress or controls. Wensity and UIStacks are clean reveals with less of a story. Aceternity is a scan overlay rather than a generator, and assistant-ui is close to static.

One winner only: the other candidates are variants of the same loader, not a different component.
