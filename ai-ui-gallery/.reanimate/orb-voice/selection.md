# orb-voice: candidate selection

Concept: Voice-reactive orb / Siri-style visualizer. Each candidate was opened with reanimate `capture.ts` (1440x900): first a survey of the whole page, then a capture cropped to the live preview (3 s at 10 fps, or a longer click-triggered run where the preview needs a trigger). Raw captures stay out of git.

The winner is chosen on quality alone (visual polish, completeness, motion quality, how clearly it reads as an AI/agent pattern). License only decides fidelity.

| # | Candidate | Loaded? | One line |
|---|---|---|---|
| 1 | Arc UI · Voice orb (uiarc.dev/components/voice-orb) | Yes (preview ≈ 6 s) | A 200 px WebGL orb in a voice-mode card. Idle breathing; listening with voice swell and outward ripples; thinking with a shrink, fast swirl and orbiting sheen; speaking with a per-word pulse. Word-by-word transcript, call timer, mute and end controls. It uses a simulated level when there is no mic and loops three scripted turns. **Pro** (paid). |
| 2 | Wensity · Voice Reactive Orb (ui.wensity.com/components/voice-aurora-wave) | Yes | A blue SVG blob (feTurbulence displacement) around a stop button that swells with a "synthetic waveform". One state only; the displaced edge looks grainy. No Pro gate on the page, but no open-source license found. |
| 3 | Wensity · Siri Orb (ui.wensity.com/components/siri-orb) | Yes | A glassy WebGL sphere with a prism ribbon sweeping through it. The most striking still frame, but a single idle loop with no voice input or states. **Pro**. |
| 4 | Wensity · iPhone Siri (ui.wensity.com/components/iphone-siri) | Yes (triggered by "Open Siri") | An iPhone mockup whose Dynamic Island swells into a WebGL Siri glow. Polished, but a device mock full of Apple-style app icons rather than a reusable orb. **Pro**. |
| 5 | Libraries.dev · Voice ring (libraries.dev/voice-ring) | Yes | Canvas 2D glowing spectrum rings (listening/speaking, processing, mono variants) with a playground (demo voice, microphone, manual drive). Nicely made, but a 150 px ring rather than an orb. License not verifiable. |
| 6 | Libraries.dev · Voice (libraries.dev/voice) | Yes | A colourful glow that rises from the bottom of a phone-sized chat panel while the transcript types. An edge glow, not an orb. License not verifiable. |

## Winner: Arc UI · Voice orb
- **Visual polish**: a refined, soft-lit orb with a crisp edge, gentle halo and ripples on a clean card. Wensity's Siri Orb has the flashier single frame, but Arc's orb holds up in every state.
- **Completeness**: by far the most complete. It has four orb states with spring transitions, a live transcript, a timer, mute and end, an idle hint, an "ended after" message and a simulated level when the microphone is unavailable. Every other candidate shows one state, or a ring or glow without the surrounding voice UI.
- **Motion**: each state has its own character (ripples, swirl with sheen, per-word pulse), and the parameters spring between states with no jumps.
- **Reads as the AI pattern**: it is literally a voice-assistant turn (listening, thinking, speaking), the core of this concept.

**Runner-up: Wensity · Siri Orb.** It has the strongest still image, but it is one decorative loop with no voice reactivity or states. Third: Libraries.dev Voice ring, which has states and a mic playground but is a small ring rather than an orb. Only one winner was picked: the remaining candidates are variants of the same voice visualizer, not a different component.

## Fidelity
Arc UI marks the Voice orb **Pro** (paid, "Get Pro"), and no open-source license is published. The clone is therefore **motion-faithful**. The shader is written fresh with our own noise, layering and palette (indigo, violet, apricot); the font is Figtree, the icons are lucide, and the copy is our own rail-travel assistant. No Arc JS, CSS, GLSL or copy is used. The motion constants (state shapes, springs, level law, word cadence) were measured from the trace.
