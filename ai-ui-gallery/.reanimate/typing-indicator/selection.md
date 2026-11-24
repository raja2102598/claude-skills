# typing-indicator: selection

Concept: "Typing dots". Both candidates were opened with reanimate `capture.ts` (1440x900): a full-page frame to find the preview, then a 3 s, 10 fps capture cropped to the live preview. Raw captures stay out of git. The winner was picked on quality alone (polish, completeness, motion, how clearly it reads as an AI pattern). License played no part in the choice, only in the fidelity level.

| # | Candidate | What the preview shows | Verdict |
|---|---|---|---|
| 1 | assistant-ui · Typing indicator (`www.assistant-ui.com/elements/typing-indicator`) | Three 6 px dots at 40 % ink in a light outlined pill, with Bubble / Bare tabs. The motion is Tailwind's stock `animate-bounce`: 1100 ms, dots 160 ms apart, a lift of −25 % (1.5 px) with the bounce's hard ease-in drop. | **Runner-up.** Clean and quiet, but a stock bounce so small it barely reads, and one state. |
| 2 | Wensity UI · AI Typing Indicator (`ui.wensity.com/components/ai-typing-indicator`, Pro) | A 2x2 preview. The **Typing** cell is a chat bubble with a tucked corner, whose dots rise 0.28 em and brighten 0.32 → 1 in a 160 ms-staggered wave: a 1320 ms loop with soft in-out ease, no overshoot, and a rest beat. The other cells: Thinking (step icon, shimmering step label and timer), Writing (letter wave) and Working (3x3 matrix pulse). | **Winner.** |

Nothing failed to load. Wensity's preview is blank for about 2.5 s after load, so captures used `--wait-before 3500–4000`.

## Winner: Wensity · AI Typing Indicator (Typing cell)

It is the more finished take on the pattern. Each dot both lifts and brightens, so the wave reads at a glance even at 8 px. The in-out easing and the rest beat in each 1320 ms loop make it feel calm rather than busy. The bubble's tucked corner places it in a chat thread at once, as an incoming reply. The component is also more complete: the same piece offers Thinking, Writing and Working states. assistant-ui's version is tidy but is the stock Tailwind bounce at 1.5 px, so it is the runner-up. There is one winner, not two: both candidates are the same three-dot bubble. Wensity's other states are out of scope here; its Thinking cell belongs to the thinking-line concept.

## License and fidelity

Wensity: the page shows a "Pro" badge and sells the code with Wensity Pro, and no open-source license was found → **motion-faithful**. The clone is written fresh from the captures and the measured timings. It has its own palette (a slate bubble with a faint inner outline, slate-grey dots on the reference's black stage), its own radii, markup and CSS, and no Wensity assets, copy or code.
