import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Voice call with live transcript",
  concept: "voice-conversation",
  source: "UIStacks",
  sourceUrl: "https://uistacks.dev/components/voice-call",
  license:
    "UIStacks Pro (paid: 'Get Pro · $159', install needs a license key); no open-source license, so motion-faithful with original styling. Rebuilt from captures and getAnimations() timings only.",
  fidelity: "motion-faithful",
  stage: { width: 480, height: 420, background: "#eceff2" },
  pickedBecause:
    "The most complete voice-agent surface of the set: an AI agent places a call (Dialing → Ringing → In call with a running timer), the transcript streams in word by word as each side talks, a waveform follows the speaker, the Goal line goes asking → confirmed, and the call ends with an outcome card replacing Mute / Take over / Hang up.",
};
