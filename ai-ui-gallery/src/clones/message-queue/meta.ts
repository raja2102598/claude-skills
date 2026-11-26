import type { CloneMeta } from "../../gallery/types";

export const meta: CloneMeta = {
  title: "Message queue",
  concept: "message-queue",
  source: "assistant-ui",
  sourceUrl: "https://www.assistant-ui.com/elements/message-queue",
  license: "MIT (assistant-ui, Copyright (c) 2026 AgentbaseAI Inc.; LICENSE verified on GitHub) - pixel-faithful, attribution kept",
  fidelity: "pixel-faithful",
  stage: { width: 480, height: 306, background: "#fcfcfa" },
  pickedBecause:
    "The only candidate that is really about messages typed while a run is in flight: a running turn, a numbered 'sends when this finishes' stack, and per-item cancel. AI Elements Queue is a todo list (covered by agent-tasks); Message timing is a stats badge.",
};
