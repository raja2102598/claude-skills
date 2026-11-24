/* Sample approval requests. Agents, models, people and values are fictional. */

export type Risk = "high" | "medium" | "low";
export type ToolIcon = "release" | "mail" | "database" | "globe" | "merge";

export interface Agent {
  name: string;
  model: string;
  /** Mark colour: a rounded square with the agent's initial. */
  color: string;
}

export interface Arg {
  key: string;
  value: string;
  mono?: boolean;
}

export interface Request {
  id: string;
  agent: Agent;
  ago: string;
  risk: Risk;
  tool: ToolIcon;
  /** Focus title: a verb and an optional command in mono. */
  verb: string;
  command?: string;
  reason: string;
  args: Arg[];
  /** One-line summary in the queue. */
  summary: string;
}

const RELEASE: Agent = { name: "Release agent", model: "Nova 2", color: "#c4572f" };
const INBOX: Agent = { name: "Inbox agent", model: "Atlas Mini", color: "#3d6db3" };
const DATA: Agent = { name: "Data agent", model: "Nova 2", color: "#7556bf" };
const TRIAGE: Agent = { name: "Triage agent", model: "Atlas Mini", color: "#2c8569" };

export const REQUESTS: Request[] = [
  {
    id: "release",
    agent: RELEASE,
    ago: "2 min ago",
    risk: "high",
    tool: "release",
    verb: "Run",
    command: "make release ENV=prod",
    reason: "All 186 checks passed on main and the release window opened at 09:30.",
    args: [
      { key: "Project", value: "orbit-web", mono: true },
      { key: "Commit", value: "a41c9e2 Tighten rate limits", mono: true },
      { key: "Target", value: "production", mono: true },
      { key: "Regions", value: "eu-west, us-east", mono: true },
    ],
    summary: "Ship orbit-web to production",
  },
  {
    id: "reply",
    agent: INBOX,
    ago: "5 min ago",
    risk: "medium",
    tool: "mail",
    verb: "Send a reply to a customer",
    reason: "Priya asked about her invoice twice today, and the credit posted at 11:42.",
    args: [
      { key: "To", value: "priya@example.com" },
      { key: "Subject", value: "Your credit for invoice #3071" },
      {
        key: "Body",
        value: "Hi Priya, a credit of $84.00 is now on your account. It shows up on your next invoice within three business days.",
      },
    ],
    summary: "Reply to priya@example.com about her invoice",
  },
  {
    id: "archive",
    agent: DATA,
    ago: "9 min ago",
    risk: "high",
    tool: "database",
    verb: "Archive",
    command: "workspaces",
    reason: "These workspaces have had no sign-in for 180 days and hold no paid seats.",
    args: [
      { key: "Table", value: "workspaces", mono: true },
      { key: "Rows", value: "2,310", mono: true },
      { key: "Filter", value: "last_seen < now() - 180d", mono: true },
    ],
    summary: "Archive 2,310 stale workspaces",
  },
  {
    id: "docs",
    agent: RELEASE,
    ago: "14 min ago",
    risk: "medium",
    tool: "globe",
    verb: "Publish",
    command: "docs → staging",
    reason: "The new pricing pages are merged and the link checker found no broken links.",
    args: [
      { key: "Site", value: "docs.orbit.test", mono: true },
      { key: "Branch", value: "main", mono: true },
      { key: "Pages", value: "38 changed", mono: true },
    ],
    summary: "Publish the docs site to staging",
  },
  {
    id: "merge",
    agent: TRIAGE,
    ago: "21 min ago",
    risk: "low",
    tool: "merge",
    verb: "Merge 4 duplicate tickets",
    reason: "All four describe the same export timeout and were filed this morning.",
    args: [
      { key: "Keep", value: "OPS-212", mono: true },
      { key: "Close", value: "OPS-214, OPS-217, OPS-220, OPS-221", mono: true },
    ],
    summary: "Merge 4 duplicate tickets into OPS-212",
  },
];

export const RESOLVED_AT_START = 6;
export const RULES_AT_START = 2;

export const RISK_LABEL: Record<Risk, string> = { high: "High", medium: "Medium", low: "Low" };
