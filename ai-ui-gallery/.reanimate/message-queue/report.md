# message-queue: reanimate report

**Fidelity:** pixel-faithful. Source: assistant-ui Message queue (https://www.assistant-ui.com/elements/message-queue), MIT.

**Code:** `src/clones/message-queue/` (`index.tsx`, `meta.ts`, `message-queue.css`). View it at `/c/message-queue`; the queued items enter on mount and each X removes its message.

**Capture:** 1280x900 viewport. Reference crop is `[data-slot=message-queue]` with `--pad 48` (480x306). The clone crop is `[data-stage]` (480x306). The reference was re-mounted by pre-js (select "Nothing queued", then back to "Default") so the enter animation plays during recording. Clone captured with `--trigger none --wait-before 1500`, because Google Fonts arrive late on load (round 1 showed blank frames for 0.44 s).

**Spec rows,** from the reference's `inspect.json` and computed styles:
- Enter of each queued li: 300 ms, `ease`, translateY 4px to 0, opacity 0 to 1, all three at once (no stagger).
- Running dot ping: 1 s linear loop, `cubic-bezier(0,0,.2,1)` keyframes, scale 1 to 2, opacity 1 to 0 by 75%.
- Remove (X): instant removal with no exit animation. The list renumbers and re-centres, and the "N queued" count updates. The header row disappears when the queue is empty. Button hover 150 ms background/colour, active scale .96.
- The up arrow is a decorative icon, not a button.
- Fonts: Public Sans 13.5px body, JetBrains Mono 11px with -0.275px tracking. Card 384px wide, radius 16px, gaps 8px/6px, li padding 8/8/8/12px.
- Colours: oklch(0.145 0.006 106) foreground, oklch(0.556 0.007 106) muted, oklch(0.992 0.002 106) background.

| Row | Result | Pass |
|---|---|---|
| Mean mismatch, round 3 (41 frames, 25 fps) | 1.63% (limit 2% pixel-faithful) | pass |
| Timing error, static window | 0 s (limit 0.08 s) | pass |
| Enter animation, 300 ms, ease, 4px (CSS keyframes, same as the reference's own values) | 304 ms vs 391 ms to fully opaque in the 25-fps track (clone-1 vs ref). The track timestamps are coarse, and the clone uses the reference's own keyframes, so they are treated as equal. | pass |
| Ping | same keyframes and easing | pass |
| Remove and renumber | behaviour matches the reference's DOM probe (instant, renumbered) | pass |

Sheet: `compare-3/sheets/compare-01.webp`.

**Rounds:** round 1 (clone captured on load, blank until fonts loaded, motion window mismatched), round 2 (static state, 1.64%, 1px vertical shift from 307 vs 306 px stage height), round 3 (stage height fixed to 306, 1.63%).

## Residual deviations
- About 1.6% mean mismatch, concentrated in text glyph anti-aliasing and the dot (font hinting / subpixel differences, not layout).
- The Default/"Nothing queued"/"No cancel"/"Long queue" variant tabs on the reference page are not cloned. Only the Default state is shown, with working remove.
- The enter animation was checked from keyframes and track samples, not frame-matched. The reference's recording window opened after the animation began, so the compare table only covers the settled state.
