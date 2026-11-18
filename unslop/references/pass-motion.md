## 9. Motion

- Remove motion that loops for no reason, like `animate-pulse` or `animate-ping` on things that are not live, shimmer on headings, breathing glows, floating elements and parallax.
- Remove `transition-all`, bouncy springs, `hover:scale` on cards and anything that moves more than a few pixels on hover.
- Keep motion that explains something. A hover is a quick color or surface change, a press is a tiny scale down, a menu fades and rises a few pixels from where it opens, a changed number tweens.
- Transition color, background, border, opacity and transform, and name them, like `transition-colors` or `transition-[transform,opacity]` in Tailwind, instead of a catch all. Never animate width, height, top, left, margins or large blurs, they stutter on weak devices.
- One easing curve and a few durations across the screen, from the tokens. Short for feedback, a little longer for things that enter.
- At most one entrance on load, a short fade and rise for the main content with a small stagger. Not every card flying in from a different side.
