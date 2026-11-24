# voice-conversation: candidate selection

Concept: Voice agent / call / live transcript. All 7 candidates from `concepts.json` were captured (raw captures stay out of git).

| candidate | source / license | what the preview shows | verdict |
|---|---|---|---|
| Voice conversation, https://www.assistant-ui.com/elements/voice-conversation | assistant-ui (MIT, open source) | Light card with a grey orb dot. Connecting → Listening → Thinking → Speaking (dot turns into a blue halo orb), then you / ai transcript lines, mic and hang-up buttons | Clean but sparse: one orb, two static transcript lines, little motion beyond the orb colour and halo. **Runner-up** |
| Voice Agent, https://pro.beui.dev/components/voice-agent | beUI Pro (paid) | Dark card with a large blue fluid orb, "Listening", a quoted prompt, End call | Polished orb, but no transcript, call state or outcome |
| Voice Conversation, https://pro.beui.dev/components/voice-conversation | beUI Pro (paid) | Dark card: Start talking → Connecting → Listening to you (bar waveform) → Thinking → Speaking, one quoted line, End chat | Good waveform motion; one line of text, no transcript history |
| Voice mode, https://pro.beui.dev/components/mobile/voice-mode | beUI Pro (paid) | Phone frame with an orb, Speaking, one reply paragraph, three round controls | Mobile voice-mode screen; a narrower variant of the same orb idea |
| Voice call, https://uistacks.dev/components/voice-call | UIStacks Pro (paid, license key) | An AI agent places a call: Dialing → Ringing (pulsing rings) → In call with a timer. Streaming word-by-word transcript, speaker-coloured waveform, Goal line asking → confirmed, Take over / Mute / Hang up, then Call ended with an outcome card | **Winner** |
| Live transcript, https://uistacks.dev/components/live-transcript | UIStacks Pro (paid) | Meeting transcript ("Weekly ops sync", REC badge, speaker turns, decision chips, "Ask about this meeting") | A meeting-notes transcript, not a voice agent; it fits a different concept better |
| Speech player, https://uiarc.dev/components/speech-player | Arc UI (Pro) | Read-aloud player under an assistant message: progress bar, speed, karaoke-style word highlight | Text-to-speech playback, not a conversation or call |

**Failed to load**: none. Every preview rendered; the beUI and UIStacks demos needed a click on Start talking or Replay to run.

**Winner: UIStacks "Voice call".** It is the most complete voice-agent surface in the set and reads most clearly as an agent pattern. It has every state of a call (dialing, ringing, live, ended), a live transcript that streams word by word per speaker, and a waveform that follows the active speaker. It also has a goal that the agent confirms, a human Take over control, and an outcome card at the end. Its motion is also the richest: spring swaps with blur, staggered row entrances, word fades and an outcome badge pop. assistant-ui is the open-source runner-up; it is polished but shows far fewer states and less motion. The license played no part in the choice. Because UIStacks Pro is paid, the clone is motion-faithful with original styling and copy.
