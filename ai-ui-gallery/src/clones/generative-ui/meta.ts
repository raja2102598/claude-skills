import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Generative UI card",
  concept: "generative-ui",
  source: "beUI Pro",
  sourceUrl: "https://pro.beui.dev/components/crypto-agent",
  license:
    "beUI Pro (paid component, code behind the Pro plan); no open-source license, so motion-faithful with original styling. Rebuilt from captures only.",
  fidelity: "motion-faithful",
  stage: { width: 1136, height: 600, background: "#121110", dark: true },
  pickedBecause:
    "The only candidate where the assistant generates a live, interactive card inside the reply: tool steps resolve one by one, the reply streams in, then a swap quote card with a countdown ring and Approve / Decline signs through Sign, Submitted, Confirmed. The assistant-ui pages are static one-state widgets and the artifacts page is a static code viewer.",
};
