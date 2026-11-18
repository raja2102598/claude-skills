---
name: unslop
description: Polish AI-generated interfaces by correcting spacing, color, typography, copy, layout, visuals, and motion while preserving product identity.
license: CC-BY-4.0
metadata:
  author: Damir Sokolovsky
  x: https://x.com/heydamir
  site: https://heydamir.design/unslop
---

# Unslop

Polish the requested screen while preserving its product, features, content, section order, and established brand. Do not invent claims, data, or features. Keep required attribution in this package and the video credit in any generated story.

1. Find the rendering files and inspect the screen. If only a URL, local HTML, or screenshot is supplied, read [capture.md](references/capture.md). A reconstruction is a redesign artifact, not a change to the live site.
2. Read [signs.md](references/signs.md) and record observed issues with locations. Heavy slop calls for all nine passes; light slop calls only for affected passes, preserving the existing palette, type, layout, and visual. If there is no slop, suggest at most two or three precise refinements and apply only with agreement.
3. Read [direction.md](references/direction.md). Show the audit and five-line direction (product, character, world, moments, signature). Wait for approval before editing unless the user already authorized proceeding without that wait.
4. Read only the needed passes below, in order. For a full redesign, apply all nine. Use [tokens.md](references/tokens.md) for the values needed by active passes. Reuse unchanged references already available in the current context; after compaction or a relevant file change, reload the needed material.
5. Read [checklist.md](references/checklist.md), verify applicable items and the original audit, and compare the rendered result. Batch corrections between renders; keep the upstream limit of three screen checks. Report the direction, changes, and remaining limitations concisely.

Passes, in order:

1. [Spacing](references/pass-spacing.md)
2. [Color](references/pass-color.md)
3. [Icons](references/pass-icons.md)
4. [Copy](references/pass-copy.md)
5. [Type](references/pass-type.md)
6. [Layout](references/pass-layout.md)
7. [Details](references/pass-details.md)
8. [Visuals](references/pass-visuals.md)
9. [Motion](references/pass-motion.md)

Load visual examples, image-generation guidance, and effects only when the visuals pass needs them. Apps and dashboards normally use real product content rather than generated imagery. Start requested image work after direction approval and continue independent passes while it runs.

Read [story-video.md](references/story-video.md) only when the user asks for a video or explicitly chooses that shareable format; an ordinary cleanup does not require it. Preserve the `unslop by @heydamir` video credit.

Do not replace removed decoration with another trend or turn every product into the same template. Keep real logos; never rename the product. Respect user-pinned brand choices. Full-pass detail and examples remain in the references.
