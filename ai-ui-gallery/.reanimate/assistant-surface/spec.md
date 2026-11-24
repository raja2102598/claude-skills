# assistant-surface spec
- Target: assistant-ui "Assistant modal" element preview (https://www.assistant-ui.com/elements/assistant-modal), crop 734x309 at 297,357 in a 1280x800 viewport; launcher click.
- Destination: src/clones/assistant-surface (React 19, CSS keyframes, lucide).
- Fidelity: pixel-faithful (MIT, verified LICENSE in assistant-ui/assistant-ui). Public Sans.

| Element | Trigger | Property | Spec |
|---|---|---|---|
| dialog open | launcher click | opacity 0->1, scale .95->1, translateY 8->0, origin bottom-right | 300 ms cubic-bezier(.32,.72,0,1) |
| dialog close | launcher click | reverse | 200 ms same easing, unmounted after |
| composer footer open | with dialog | opacity, translateY 8->0 | 300 ms, delay 100 ms, same easing |
| launcher icon | state | bot <-> chevron-down crossfade, rotate, scale | ~200 ms |
| launcher tooltip | hover | dark pill left of launcher, label Open/Close Assistant | fade ~120 ms |
Geometry: launcher 44px circle, 16px from the stage corner; dialog 420x216, 16px above launcher, right-aligned; header 44px; composer 368 wide, radius 16.
