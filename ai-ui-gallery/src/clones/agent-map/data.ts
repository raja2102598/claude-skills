import { CreditCard, Feather, FolderGit2, MessagesSquare, NotebookPen, Orbit, ShoppingBasket, Telescope, type LucideIcon } from "lucide-react";

export type NodeId = "lead" | "buyer" | "scout" | "scribe" | "paydesk" | "coderoom" | "chatter" | "pages";
export type Status = "working" | "needs" | "idle";
export type Phase = "pre" | "needs" | "approved";

export interface GraphNode {
  id: NodeId;
  kind: "agent" | "tool";
  col: 0 | 1 | 2;
  name: string;
  /** Role for agents, the resource for tools. */
  role: string;
  icon: LucideIcon;
  color: string;
  /** What the panel says the node is doing. */
  task: string;
}

export const NODES: GraphNode[] = [
  { id: "lead", kind: "agent", col: 0, name: "Atlas", role: "Orchestrator", icon: Orbit, color: "#e4572e", task: "Planning the weekly restock for the Harbor St. café." },
  { id: "buyer", kind: "agent", col: 1, name: "Halcyon", role: "Buyer", icon: ShoppingBasket, color: "#15a05a", task: "Paying Lakeside Roasters $860 through Paydesk." },
  { id: "scout", kind: "agent", col: 1, name: "Wayfinder", role: "Research", icon: Telescope, color: "#0284c7", task: "Comparing bean prices across nine roasters." },
  { id: "scribe", kind: "agent", col: 1, name: "Scribe", role: "Writer", icon: Feather, color: "#db2777", task: "Waiting for the roaster shortlist." },
  { id: "paydesk", kind: "tool", col: 2, name: "Paydesk", role: "Harbor payouts", icon: CreditCard, color: "#7c3aed", task: "Holds the café's supplier payouts." },
  { id: "coderoom", kind: "tool", col: 2, name: "Coderoom", role: "harbor/storefront", icon: FolderGit2, color: "#334155", task: "The storefront repository." },
  { id: "chatter", kind: "tool", col: 2, name: "Chatter", role: "#harbor-ops", icon: MessagesSquare, color: "#e08a0c", task: "The team's operations channel." },
  { id: "pages", kind: "tool", col: 2, name: "Pages", role: "Spring menu plan", icon: NotebookPen, color: "#0d9488", task: "The shared spring menu plan." },
];

export const NODE = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, GraphNode>;
export const COLUMNS: { label: string; ids: NodeId[] }[] = [
  { label: "Lead", ids: ["lead"] },
  { label: "Agents", ids: ["buyer", "scout", "scribe"] },
  { label: "Tools", ids: ["paydesk", "coderoom", "chatter", "pages"] },
];

export interface Edge {
  id: string;
  from: NodeId;
  to: NodeId;
}

/** Drawn in this order, like the reference (writer's lower tool first). */
export const EDGES: Edge[] = [
  { id: "lead-buyer", from: "lead", to: "buyer" },
  { id: "lead-scout", from: "lead", to: "scout" },
  { id: "lead-scribe", from: "lead", to: "scribe" },
  { id: "buyer-paydesk", from: "buyer", to: "paydesk" },
  { id: "scout-coderoom", from: "scout", to: "coderoom" },
  { id: "scribe-pages", from: "scribe", to: "pages" },
  { id: "scribe-chatter", from: "scribe", to: "chatter" },
];

/** Calls per minute on each edge. The buyer's two edges change while it waits for approval and after it. */
export function rateOf(edge: string, phase: Phase): number {
  switch (edge) {
    case "lead-buyer":
      return phase === "needs" ? 3 : phase === "approved" ? 28 : 22;
    case "lead-scout":
      return 9;
    case "lead-scribe":
      return 4;
    case "buyer-paydesk":
      return phase === "needs" ? 0 : 6;
    case "scout-coderoom":
      return 3;
    case "scribe-pages":
      return 4;
    case "scribe-chatter":
      return 6;
  }
  return 0;
}

export const totalRate = (phase: Phase) => EDGES.reduce((s, e) => s + rateOf(e.id, phase), 0);

export function statusOf(id: NodeId, phase: Phase): Status | null {
  if (NODE[id].kind === "tool") return null;
  if (id === "scribe") return "idle";
  if (id === "buyer" && phase === "needs") return "needs";
  return "working";
}

export const BUYER_ASK = "Wants to pay Lakeside Roasters $860 through Paydesk.";

/** Dots per edge and loop length, from the call rate. */
export function dotsFor(rate: number): { count: number; dur: number } {
  if (rate <= 0) return { count: 0, dur: 2.6 };
  if (rate >= 20) return { count: 3, dur: 1.8 };
  if (rate >= 8) return { count: 2, dur: 2.6 };
  return { count: 1, dur: 2.6 };
}

/** Tour: seconds after mount. At LOOP the graph remounts. */
export const TOUR = { scout: 2.4, needs: 4.8, approve: 7.6, loop: 12 };
/** Second hop of a lit path (agent → tool) starts this much later. */
export const HOP_DELAY = 0.18;

export const CAPTION =
  "Each dot is one call. Click a node to trace its route from the lead to the tools it uses; Halcyon stops and waits for you when a payment needs approval. Arrow keys move between nodes and columns.";
