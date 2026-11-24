# ai-avatar spec

- **Target**: Arc UI "AI mascot" preview card (https://uiarc.dev/components/ai-mascot), selector `[class*="ai-mascot_card"]`, 560x319: mascot stage, inline mini mascot + status line, state switcher (Idle/Listening/Thinking/Writing/Done/Error) and Pause. Auto-cycling tour.
- **Destination**: `src/clones/ai-avatar/` (React 19, TS, hand-written SVG driven in rAF, CSS keyframes for text).
- **Fidelity**: motion-faithful. Own character "Pip" (rounded-square teal body with ear nubs, round eyes, amber star companion), own palette, copy, font weights. No Arc artwork or code.

## Tour (measured: label-region change detection on 20 fps virtual capture, plus a 24 s real-clock state probe)
Loop 20.7 s: thinking 2614, writing 3519, done 2315, idle 1816, thinking 1717, error 2041, idle 4394, listening 2300 ms. Ref frame 0 sits ~0.9 s into the first thinking (0.6 s after pre-roll compensation in the clone).

## Motion rows
| # | element | trigger | motion | notes |
|---|---|---|---|---|
| 1 | tour state label + switcher pill | each tour step | label crossfades up 5 px + blur, ~240 ms; pill slides ~320 ms | listening/thinking/writing labels shimmer |
| 2 | idle | state idle | breathing scale ±1.2 %, bob ±1.6 px, eyes glance sin, companion hovers upper right, blink every ~4 s (150 ms) | blink also on entry to idle/listening |
| 3 | listening | state | leans in (-5 deg, +4 px), eyes widen 18 %, companion pings a ring every 1.1 s | |
| 4 | thinking | state | companion orbits the head, period 2.4 s, front crossing 0.8 s after entry, hidden behind body on far side; gaze up-left | |
| 5 | writing | state | gaze down, dashed line under mascot revealed by companion sweeping left to right, 1.8 s period (sweep 0.95 s, fade, restart) | |
| 6 | done | state | eyes to ^ ^ arcs, hop 7 px (0.45 s), two sparkles pop and twinkle | |
| 7 | error | state | damped shake (decay 6/s, 48 rad/s), worried brows, companion dims and droops | |
| 8 | all pose values | | exponential smoothing tau 60-140 ms | |
