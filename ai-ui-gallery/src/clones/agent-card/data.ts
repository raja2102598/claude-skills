export type AgentId = "helm" | "scout" | "crawler" | "tally" | "scribe" | "forge" | "probe";

export interface AgentDef {
  id: AgentId;
  name: string;
  model: string;
  task: string;
  icon: string;
  tools: string[];
  /** CSS colour variable name suffix */
  hue: string;
  /** ms after mount when it starts / finishes (scripted, read off the reference) */
  start: number;
  end: number;
  /** final cost in dollars */
  cost: number;
}

/** Event times are the reference's, minus half a 10 fps frame (the frame in which the change is first seen). */
export const AGENTS: AgentDef[] = [
  { id: "helm", name: "Helm", model: "Nova 2", task: "Launch the spring pricing page by Friday", icon: "workflow", tools: ["file", "chat", "code"], hue: "helm", start: 0, end: 18250, cost: 0.41 },
  { id: "scout", name: "Scout", model: "Atlas Pro", task: "Compare yearly discount depth across six rival plans", icon: "search", tools: ["web", "file"], hue: "scout", start: 850, end: 11850, cost: 0.23 },
  { id: "crawler", name: "Crawler", model: "Atlas Flash", task: "Pull the plan tables from each rival pricing page", icon: "scan", tools: ["web"], hue: "crawler", start: 1850, end: 6650, cost: 0.03 },
  { id: "tally", name: "Tally", model: "Atlas Pro", task: "Group 140 support tickets that mention invoices", icon: "chart", tools: ["chat", "table"], hue: "tally", start: 3250, end: 10850, cost: 0.06 },
  { id: "scribe", name: "Scribe", model: "Nova Mini", task: "Write the plan copy and three short FAQ answers", icon: "pen", tools: ["file", "pen"], hue: "scribe", start: 4650, end: 13850, cost: 0.11 },
  { id: "forge", name: "Forge", model: "Orion Pro", task: "Build the plan switch and yearly prices into checkout", icon: "code", tools: ["code", "term", "tag"], hue: "forge", start: 6250, end: 16250, cost: 0.17 },
  { id: "probe", name: "Probe", model: "Orion Mini", task: "Run checkout tests for monthly and yearly billing", icon: "flask", tools: ["code", "term"], hue: "probe", start: 10850, end: 15850, cost: 0.02 },
];

export const byId = Object.fromEntries(AGENTS.map((a) => [a.id, a])) as Record<AgentId, AgentDef>;

/** First-level children (columns) and their sub-agents, in tree order. */
export const TREE: { id: AgentId; children: AgentId[] }[] = [
  { id: "scout", children: ["crawler", "tally"] },
  { id: "scribe", children: [] },
  { id: "forge", children: ["probe"] },
];

export type Status = "queued" | "running" | "done";

export function statusAt(a: AgentDef, t: number): Status {
  if (t >= a.end) return "done";
  if (t >= a.start) return "running";
  return "queued";
}

export function progressAt(a: AgentDef, t: number): number {
  return Math.max(0, Math.min(1, (t - a.start) / (a.end - a.start)));
}

/** Cost so far, in cents, linear in run time. */
export function centsAt(a: AgentDef, t: number): number {
  return Math.round(a.cost * 100 * progressAt(a, t));
}

export function secondsAt(a: AgentDef, t: number): number {
  const run = Math.min(t, a.end) - a.start;
  return run <= 0 ? 0 : Math.round((run + 200) / 1000);
}
