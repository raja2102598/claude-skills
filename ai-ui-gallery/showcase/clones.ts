import type { ComponentType } from "react";
import type { CloneMeta } from "../src/gallery/types";

// Finished clones only, imported by name, so a clone still being built can't break the showcase build.
// Numbers come from each clone's .reanimate/<slug>/report.md and selection.md.
export interface ShowcaseEntry {
  slug: string;
  load: () => Promise<{ default: ComponentType }>;
  meta: () => Promise<{ meta: CloneMeta }>;
  candidates: number;
  rounds: number;
  timing: string;
  reference: string;
  runnerUp: string;
}

export const entries: ShowcaseEntry[] = [
  {
    slug: "prompt-input",
    load: () => import("../src/clones/prompt-input/index.tsx"),
    meta: () => import("../src/clones/prompt-input/meta.ts"),
    reference: "Arc UI · AI composer", candidates: 13, rounds: 6, timing: "every fade within 28 ms", runnerUp: "UIStacks Prompt input",
  },
  {
    slug: "chat-thread",
    load: () => import("../src/clones/chat-thread/index.tsx"),
    meta: () => import("../src/clones/chat-thread/meta.ts"),
    reference: "Arc UI · AI chat", candidates: 10, rounds: 3, timing: "21 of 22 rows pass, events within 17 ms", runnerUp: "Wensity AI Chat Interface",
  },
  {
    slug: "message",
    load: () => import("../src/clones/message/index.tsx"),
    meta: () => import("../src/clones/message/meta.ts"),
    reference: "Arc UI · Response feedback", candidates: 9, rounds: 3, timing: "16 of 17 rows pass", runnerUp: "UIStacks Message",
  },
  {
    slug: "streaming-text",
    load: () => import("../src/clones/streaming-text/index.tsx"),
    meta: () => import("../src/clones/streaming-text/meta.ts"),
    reference: "Kobra · Streaming Text", candidates: 7, rounds: 3, timing: "same word on 360 of 360 frames", runnerUp: "assistant-ui Streaming text",
  },
  {
    slug: "thinking-indicator",
    load: () => import("../src/clones/thinking-indicator/index.tsx"),
    meta: () => import("../src/clones/thinking-indicator/meta.ts"),
    reference: "UIStacks · Thinking state", candidates: 7, rounds: 3, timing: "0.00 s timing error", runnerUp: "Arc UI Agent status",
  },
  {
    slug: "typing-indicator",
    load: () => import("../src/clones/typing-indicator/index.tsx"),
    meta: () => import("../src/clones/typing-indicator/meta.ts"),
    reference: "Wensity · AI Typing Indicator", candidates: 2, rounds: 1, timing: "dot tracks identical, 0 s error", runnerUp: "assistant-ui Typing indicator",
  },
  {
    slug: "reasoning",
    load: () => import("../src/clones/reasoning/index.tsx"),
    meta: () => import("../src/clones/reasoning/meta.ts"),
    reference: "Arc UI · Reasoning block", candidates: 6, rounds: 5, timing: "every event within 17 ms", runnerUp: "AI Elements Chain of Thought",
  },
  {
    slug: "tool-call",
    load: () => import("../src/clones/tool-call/index.tsx"),
    meta: () => import("../src/clones/tool-call/meta.ts"),
    reference: "Arc UI · Tool call", candidates: 9, rounds: 5, timing: "within 0.04 s on 4 sequences", runnerUp: "UIStacks Tool call",
  },
  {
    slug: "agent-plan",
    load: () => import("../src/clones/agent-plan/index.tsx"),
    meta: () => import("../src/clones/agent-plan/meta.ts"),
    reference: "beUI Pro · Agent Plan", candidates: 6, rounds: 7, timing: "0 s timing error", runnerUp: "Arc UI Agent plan",
  },
  {
    slug: "agent-tasks",
    load: () => import("../src/clones/agent-tasks/index.tsx"),
    meta: () => import("../src/clones/agent-tasks/meta.ts"),
    reference: "beUI Pro · Background Agents", candidates: 4, rounds: 3, timing: "event times identical", runnerUp: "Arc UI Agent tasks",
  },
  {
    slug: "approval",
    load: () => import("../src/clones/approval/index.tsx"),
    meta: () => import("../src/clones/approval/meta.ts"),
    reference: "Arc UI · Agent approvals", candidates: 8, rounds: 5, timing: "within 0.04 s, approve and deny", runnerUp: "beUI Pro Tool Approval",
  },
  {
    slug: "trace-waterfall",
    load: () => import("../src/clones/trace-waterfall/index.tsx"),
    meta: () => import("../src/clones/trace-waterfall/meta.ts"),
    reference: "beUI Pro · Trace waterfall", candidates: 5, rounds: 3, timing: "playhead within 0.04 px", runnerUp: "Kobra Trace Waterfall",
  },
  {
    slug: "model-selector",
    load: () => import("../src/clones/model-selector/index.tsx"),
    meta: () => import("../src/clones/model-selector/meta.ts"),
    reference: "Arc UI · Model picker", candidates: 8, rounds: 4, timing: "0 s timing error", runnerUp: "beUI Pro Model Picker",
  },
  {
    slug: "context-meter",
    load: () => import("../src/clones/context-meter/index.tsx"),
    meta: () => import("../src/clones/context-meter/meta.ts"),
    reference: "Arc UI · Context window", candidates: 9, rounds: 3, timing: "send, compact and hover on time", runnerUp: "beUI Pro Context Window",
  },
  {
    slug: "orb-voice",
    load: () => import("../src/clones/orb-voice/index.tsx"),
    meta: () => import("../src/clones/orb-voice/meta.ts"),
    reference: "Arc UI · Voice orb", candidates: 6, rounds: 3, timing: "words within 33 ms, GL within 2.1 %", runnerUp: "Wensity Siri Orb",
  },
  {
    slug: "orb-presence",
    load: () => import("../src/clones/orb-presence/index.tsx"),
    meta: () => import("../src/clones/orb-presence/meta.ts"),
    reference: "Wensity · ChatGPT Orb", candidates: 7, rounds: 3, timing: "clock within 15 ms, sway within 1.1 %", runnerUp: "Wensity AI Orb",
  },
  {
    slug: "agent-builder",
    load: () => import("../src/clones/agent-builder/index.tsx"),
    meta: () => import("../src/clones/agent-builder/meta.ts"),
    reference: "Arc UI · Agent builder", candidates: 3, rounds: 2, timing: "chat events within 40 ms, one flow", runnerUp: "Arc UI AI setup wizard",
  },
  {
    slug: "agent-card",
    load: () => import("../src/clones/agent-card/index.tsx"),
    meta: () => import("../src/clones/agent-card/meta.ts"),
    reference: "beUI Pro · Agent Team", candidates: 6, rounds: 2, timing: "13 events on the same frame", runnerUp: "UIStacks Agent roster",
  },
  {
    slug: "agent-cursor",
    load: () => import("../src/clones/agent-cursor/index.tsx"),
    meta: () => import("../src/clones/agent-cursor/meta.ts"),
    reference: "Arc UI · Agent cursor", candidates: 1, rounds: 4, timing: "8 flights within 16 ms, 7.1% mismatch", runnerUp: "none (only candidate)",
  },
  {
    slug: "agent-handoff",
    load: () => import("../src/clones/agent-handoff/index.tsx"),
    meta: () => import("../src/clones/agent-handoff/meta.ts"),
    reference: "AI Elements · Subagent", candidates: 4, rounds: 3, timing: "0 s timing error, 0.00% mismatch", runnerUp: "Arc UI Agent handoff",
  },
  {
    slug: "agent-map",
    load: () => import("../src/clones/agent-map/index.tsx"),
    meta: () => import("../src/clones/agent-map/meta.ts"),
    reference: "UIStacks · Agent map", candidates: 6, rounds: 3, timing: "16 rows pass, 0 s timing error", runnerUp: "Arc UI Agent orchestrator",
  },
  {
    slug: "agent-memory",
    load: () => import("../src/clones/agent-memory/index.tsx"),
    meta: () => import("../src/clones/agent-memory/meta.ts"),
    reference: "Arc UI · Agent memory", candidates: 2, rounds: 3, timing: "fails limits, capture stalls hid timing", runnerUp: "Arc UI Agent routines",
  },
  {
    slug: "agent-timeline",
    load: () => import("../src/clones/agent-timeline/index.tsx"),
    meta: () => import("../src/clones/agent-timeline/meta.ts"),
    reference: "Arc UI · Agent timeline", candidates: 4, rounds: 3, timing: "16 rows pass, 0 s timing error", runnerUp: "Arc UI Agent loop",
  },
  {
    slug: "ai-button",
    load: () => import("../src/clones/ai-button/index.tsx"),
    meta: () => import("../src/clones/ai-button/meta.ts"),
    reference: "Wensity · AI Button", candidates: 3, rounds: 4, timing: "0.04 s timing error, 4.2% mismatch", runnerUp: "Arc UI AI spark",
  },
  {
    slug: "ai-inline-edit",
    load: () => import("../src/clones/ai-inline-edit/index.tsx"),
    meta: () => import("../src/clones/ai-inline-edit/meta.ts"),
    reference: "Arc UI · AI inline edit", candidates: 5, rounds: 5, timing: "fails, timing drifted 0.6 s, 13% mismatch", runnerUp: "Arc UI AI translate",
  },
  {
    slug: "ai-search",
    load: () => import("../src/clones/ai-search/index.tsx"),
    meta: () => import("../src/clones/ai-search/meta.ts"),
    reference: "Arc UI · AI search bar", candidates: 2, rounds: 5, timing: "events within one frame, end +0.1 s", runnerUp: "Arc UI AI answer",
  },
  {
    slug: "assistant-surface",
    load: () => import("../src/clones/assistant-surface/index.tsx"),
    meta: () => import("../src/clones/assistant-surface/meta.ts"),
    reference: "assistant-ui · Assistant modal", candidates: 6, rounds: 4, timing: "close 0 s error, open not measured", runnerUp: "Arc UI AI side panel",
  },
  {
    slug: "checkpoint",
    load: () => import("../src/clones/checkpoint/index.tsx"),
    meta: () => import("../src/clones/checkpoint/meta.ts"),
    reference: "AI Elements · Checkpoint", candidates: 1, rounds: 1, timing: "0 s timing error, 0.00% mismatch", runnerUp: "none (only candidate)",
  },
  {
    slug: "coding-agent-terminal",
    load: () => import("../src/clones/coding-agent-terminal/index.tsx"),
    meta: () => import("../src/clones/coding-agent-terminal/meta.ts"),
    reference: "AI Elements · Terminal", candidates: 4, rounds: 5, timing: "0 s timing error, 0.18% mismatch", runnerUp: "AI Elements Stack Trace",
  },
  {
    slug: "coding-agent-tests",
    load: () => import("../src/clones/coding-agent-tests/index.tsx"),
    meta: () => import("../src/clones/coding-agent-tests/meta.ts"),
    reference: "AI Elements · Test Results", candidates: 4, rounds: 2, timing: "0 s timing error, 0.00% mismatch", runnerUp: "AI Elements Stack Trace",
  },
  {
    slug: "generative-ui",
    load: () => import("../src/clones/generative-ui/index.tsx"),
    meta: () => import("../src/clones/generative-ui/meta.ts"),
    reference: "beUI Pro · Crypto Agent", candidates: 5, rounds: 1, timing: "re-check pending, no frame compare", runnerUp: "beUI Pro AI Artifacts",
  },
  {
    slug: "image-generation",
    load: () => import("../src/clones/image-generation/index.tsx"),
    meta: () => import("../src/clones/image-generation/meta.ts"),
    reference: "Arc UI · Image generation", candidates: 6, rounds: 3, timing: "15 of 18 rows pass, 2 fail", runnerUp: "Kobra Image Generation",
  },
  {
    slug: "mcp-servers",
    load: () => import("../src/clones/mcp-servers/index.tsx"),
    meta: () => import("../src/clones/mcp-servers/meta.ts"),
    reference: "Arc UI · MCP servers", candidates: 4, rounds: 3, timing: "5 timed rows pass, 5.4% mismatch", runnerUp: "beUI Pro MCP Connectors",
  },
  {
    slug: "message-branches",
    load: () => import("../src/clones/message-branches/index.tsx"),
    meta: () => import("../src/clones/message-branches/meta.ts"),
    reference: "assistant-ui · Edit a sent message", candidates: 2, rounds: 1, timing: "0 s timing error, 0.6% mismatch", runnerUp: "assistant-ui Message branches",
  },
  {
    slug: "message-queue",
    load: () => import("../src/clones/message-queue/index.tsx"),
    meta: () => import("../src/clones/message-queue/meta.ts"),
    reference: "assistant-ui · Message queue", candidates: 3, rounds: 3, timing: "0 s timing error, 1.6% mismatch", runnerUp: "assistant-ui Message timing",
  },
  {
    slug: "model-fallback",
    load: () => import("../src/clones/model-fallback/index.tsx"),
    meta: () => import("../src/clones/model-fallback/meta.ts"),
    reference: "UIStacks · Model fallback", candidates: 1, rounds: 3, timing: "events within 0.1 s, window check fails", runnerUp: "none (only candidate)",
  },
  {
    slug: "model-stats",
    load: () => import("../src/clones/model-stats/index.tsx"),
    meta: () => import("../src/clones/model-stats/meta.ts"),
    reference: "Arc UI · Model card", candidates: 6, rounds: 2, timing: "re-check pending, frame compare failed", runnerUp: "Arc UI LLM cost calculator",
  },
  {
    slug: "prompt-enhancer",
    load: () => import("../src/clones/prompt-enhancer/index.tsx"),
    meta: () => import("../src/clones/prompt-enhancer/meta.ts"),
    reference: "UIStacks · Prompt enhancer", candidates: 2, rounds: 4, timing: "0 s timing error, 0.37% mismatch", runnerUp: "UIStacks Copy-prompt box",
  },
  {
    slug: "prompt-library",
    load: () => import("../src/clones/prompt-library/index.tsx"),
    meta: () => import("../src/clones/prompt-library/meta.ts"),
    reference: "Arc UI · Prompt studio", candidates: 5, rounds: 5, timing: "streaming 100 ms late, rest within 33 ms", runnerUp: "UIStacks Prompt versions",
  },
  {
    slug: "prompt-mention",
    load: () => import("../src/clones/prompt-mention/index.tsx"),
    meta: () => import("../src/clones/prompt-mention/meta.ts"),
    reference: "UIStacks · Mention prompt", candidates: 3, rounds: 1, timing: "all 18 events on the same frame", runnerUp: "assistant-ui Composer trigger popover",
  },
  {
    slug: "prompt-mini",
    load: () => import("../src/clones/prompt-mini/index.tsx"),
    meta: () => import("../src/clones/prompt-mini/meta.ts"),
    reference: "beUI Pro · Mobile prompt input", candidates: 3, rounds: 3, timing: "all rows pass, within 33 ms", runnerUp: "UIStacks Mini prompt",
  },
  {
    slug: "reasoning-effort",
    load: () => import("../src/clones/reasoning-effort/index.tsx"),
    meta: () => import("../src/clones/reasoning-effort/meta.ts"),
    reference: "assistant-ui · Reasoning effort", candidates: 1, rounds: 2, timing: "steps within 10 ms, 0.25% mismatch", runnerUp: "none (only candidate)",
  },
  {
    slug: "reasoning-tree",
    load: () => import("../src/clones/reasoning-tree/index.tsx"),
    meta: () => import("../src/clones/reasoning-tree/meta.ts"),
    reference: "Arc UI · Reasoning tree", candidates: 1, rounds: 4, timing: "partial, run end 0.5 s early", runnerUp: "none (only candidate)",
  },
  {
    slug: "share-chat",
    load: () => import("../src/clones/share-chat/index.tsx"),
    meta: () => import("../src/clones/share-chat/meta.ts"),
    reference: "UIStacks · Share chat", candidates: 2, rounds: 6, timing: "10 bursts within 0.1 s, 8.1% mismatch", runnerUp: "assistant-ui Shared conversation",
  },
  {
    slug: "sources",
    load: () => import("../src/clones/sources/index.tsx"),
    meta: () => import("../src/clones/sources/meta.ts"),
    reference: "AI Elements · Sources", candidates: 2, rounds: 3, timing: "0 ms timing error, replay and close", runnerUp: "AI Elements Inline Citation",
  },
  {
    slug: "suggestions",
    load: () => import("../src/clones/suggestions/index.tsx"),
    meta: () => import("../src/clones/suggestions/meta.ts"),
    reference: "AI Elements · Suggestion", candidates: 1, rounds: 4, timing: "within 0.05 s, 0.72% mismatch", runnerUp: "none (only candidate)",
  },
  {
    slug: "thread-list",
    load: () => import("../src/clones/thread-list/index.tsx"),
    meta: () => import("../src/clones/thread-list/meta.ts"),
    reference: "UIStacks · Conversation list", candidates: 7, rounds: 4, timing: "6 timed rows pass within 10 ms", runnerUp: "assistant-ui Thread search",
  },
  {
    slug: "voice-conversation",
    load: () => import("../src/clones/voice-conversation/index.tsx"),
    meta: () => import("../src/clones/voice-conversation/meta.ts"),
    reference: "UIStacks · Voice call", candidates: 7, rounds: 3, timing: "every event within 58 ms", runnerUp: "assistant-ui Voice conversation",
  },
  {
    slug: "voice-input",
    load: () => import("../src/clones/voice-input/index.tsx"),
    meta: () => import("../src/clones/voice-input/meta.ts"),
    reference: "UIStacks · Voice prompt", candidates: 3, rounds: 3, timing: "all 17 rows pass, within 17 ms", runnerUp: "Arc UI Voice recorder",
  },
];
