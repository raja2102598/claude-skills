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

export const ANSWER =
  "Maya Chen at Northwind was charged $49.00 twice on Oct 14. The second charge is a duplicate from a retried payment. The refund policy allows a full refund for duplicates within 30 days. I drafted a reply to Maya and can refund $49.00 once you approve.";
