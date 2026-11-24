export type ToolId = "mail" | "chat" | "issues" | "docs" | "calendar" | "billing";

export const TOOLS: { id: ToolId; name: string; hint: string; on: boolean }[] = [
  { id: "mail", name: "Courier", hint: "Read threads and draft replies", on: true },
  { id: "chat", name: "Relay", hint: "Post in #escalations", on: true },
  { id: "issues", name: "Tracker", hint: "Create and update issues", on: true },
  { id: "docs", name: "Notebook", hint: "Search the help center", on: true },
  { id: "calendar", name: "Calendar", hint: "Book calls with the sales team", on: false },
  { id: "billing", name: "Ledger", hint: "Look up customers and charges", on: true },
];

export const FILES = [
  { name: "Refund policy 2026.pdf", size: "248 KB", kind: "PDF" },
  { name: "Plans and pricing, October 2026.md", size: "36 KB", kind: "MD" },
];
export const UPLOAD = { name: "Support macros.csv", size: "1.4 MB", kind: "CSV" };

export const INSTRUCTIONS =
  "You are the billing assistant for Harbor's support team. Answer questions about invoices, refunds and plan changes in a friendly, concise tone. Always look up the customer in Ledger before quoting amounts. Refunds over $200 need a human: draft the reply and flag it in #escalations. Never promise dates for product fixes; file a Tracker issue instead.";

export const SUGGESTIONS = [
  "A customer says they were charged twice in October",
  "CSV export is broken for team workspaces",
  "Can we book a call about the Enterprise plan?",
];

export const MODELS = ["Nova 2", "Atlas Mini", "Nova 2 Fast"];

export interface Chip { tool: "billing" | "docs" | "mail" | "chat" | "issues" | "calendar"; name: string; detail: string; at: number; detailAt: number }
export interface Scenario { chips: Chip[]; writeAt: number; streamMs: number; doneAt: number; took: string; answer: string }

// Times are ms from the send click. Measured on the reference (virtual clock for the CSV case, real clock for the billing case).
export const SCENARIOS: Scenario[] = [
  {
    chips: [
      { tool: "billing", name: "Searched customers", detail: "2 charges on Oct 14", at: 1000, detailAt: 1000 },
      { tool: "docs", name: "Read Refund policy 2026.pdf", detail: "Section 2.1", at: 2250, detailAt: 2250 },
      { tool: "mail", name: "Drafted reply", detail: "maya@northwind.example", at: 3050, detailAt: 3050 },
    ],
    writeAt: 3050,
    streamMs: 2150,
    doneAt: 5350,
    took: "3.8s",
    answer:
      "Maya Chen at Northwind was charged $49.00 twice on Oct 14. The second charge is a duplicate from a retried payment. The refund policy allows a full refund for duplicates within 30 days. I drafted a reply to Maya and can refund $49.00 once you approve.",
  },
  {
    chips: [
      { tool: "issues", name: "Created issue", detail: "ENG-2481", at: 720, detailAt: 1200 },
      { tool: "chat", name: "Posted message", detail: "#escalations", at: 1720, detailAt: 1840 },
    ],
    writeAt: 1800,
    streamMs: 360,
    doneAt: 2160,
    took: "2.2s",
    answer:
      "I filed ENG-2481, \"CSV export fails for team workspaces\", with the customer's steps and flagged it in #escalations. I told the customer the team is on it, without promising a date. I'll follow up when the issue moves to in progress.",
  },
  {
    chips: [{ tool: "billing", name: "Looked up plan", detail: "Team, 14 seats", at: 800, detailAt: 1100 }],
    writeAt: 1600,
    streamMs: 1500,
    doneAt: 3200,
    took: "2.0s",
    answer:
      "Calendar is switched off for this agent, so I can't book the call myself. The Team plan has 14 seats; Enterprise starts at 25. I can draft a note to the sales team so they reach out this week.",
  },
];
