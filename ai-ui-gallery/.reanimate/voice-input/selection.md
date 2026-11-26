# voice-input: selection — Voice prompt / recorder

| Candidate | Loaded? | What it is |
|---|---|---|
| UIStacks: Voice prompt (https://uistacks.dev/components/voice-prompt) | yes | Autoplaying talk bar. Tap to talk, then "Listening…" with a 13-bar waveform, a timer, and Cancel and Send that grow in. The words it hears blur into a bubble above as they are transcribed. Send hands over to the assistant ("…is speaking"), and the reply lands in the hint. A light beam circles the bar while it listens, and every enter, exit and swap uses one spring. Paid (Pro, $159, license key). |
| Arc UI: Voice recorder (https://uiarc.dev/components/voice-recorder) | yes (preview needs ~6 s) | A voice-note thread. The mic expands into a record pill with a red dot, a tenths timer, a waveform scrolling in from the right, a trash can and a stop button; then you review, scrub and send into the thread. Polished, but no transcription; it is a chat voice-message pattern. Paid (Pro badge). |
| Rare UI: Voice note (https://www.rareui.com/components/voicenote) | **no**: blocked by a bot checkpoint; not retried, per the brief | – |

**Winner: UIStacks Voice prompt.**
- **Polish:** on a par with Arc.
- **Completeness:** more complete as an AI pattern: idle, listening, live transcription, cancel/send, the assistant replying, and the reply landing in the hint.
- **Motion:** richer: spring swaps, staggered bars, word blur-in, a growing bubble, the circling beam.
- **AI reading:** it reads unambiguously as speaking a prompt to an assistant, where Arc's recorder reads as a messaging voice note.

**Runner-up:** Arc UI Voice recorder.
**Fidelity:** motion-faithful, because the licence is paid; license played no part in the choice.
**Attribution:** in `meta.ts`.
