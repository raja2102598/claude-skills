export type Cite = 1 | 2 | 3 | 4;
export interface Hit { title: string; meta?: string; right: string; badge?: Cite; kind: "doc" | "customer" | "issue" }

export interface Script {
  query: string;
  answer: string;
  /** which result row (group:index) each citation points at */
  cites: Record<Cite, string>;
  docs: { title: string; meta: string }[];
  customers: { title: string; meta: string; right: string; color: string }[];
  issues: { title: string; meta: string; right: string }[];
}

export const A: Script = {
  query: "billing retries",
  answer:
    "Failed charges are retried 8 times over about 3 days, with exponential backoff starting at 30 seconds [1]. Right now a 410 response stops retries early. The fix is in progress in BILL-2481 [2], first reported by Orbit Labs on October 24 [3]. To retry sooner, replay the charge from the payment log or call `POST /v1/charges/:id/replay` [4].",
  cites: { 1: "doc0", 2: "issue0", 3: "cust0", 4: "doc1" },
  docs: [
    { title: "Billing retries and backoff", meta: "Payments" },
    { title: "Replaying failed charges", meta: "Payments" },
    { title: "Verifying billing signatures", meta: "Security" },
  ],
  customers: [
    { title: "Orbit Labs", meta: "Enterprise · Maya Chen", right: "$412k ARR", color: "#3f7d6e" },
    { title: "Pinecrest", meta: "Enterprise · Sam Rivera", right: "$520k ARR", color: "#c2612f" },
    { title: "Harbor Co", meta: "Scale · Jonas Weber", right: "$96k ARR", color: "#5b6bc0" },
  ],
  issues: [{ title: "BILL-2481 Retries stop on 410", meta: "In progress", right: "Tracker" }],
};

export const B: Script = {
  query: "How do I set up team SSO?",
  answer:
    "Workspace admins turn on single sign-on in Settings, Security, then paste the metadata URL from their identity provider [1]. Run one test login before you enforce SSO, and keep one owner on email login as a break glass account [2]. If logins loop back to the sign-in page, that is AUTH-912, now in review [3]. Quill finished the same rollout on October 14 [4].",
  cites: { 1: "doc0", 2: "doc1", 3: "issue0", 4: "cust0" },
  docs: [
    { title: "Team single sign-on", meta: "Security" },
    { title: "Enforcing SSO for a workspace", meta: "Admin" },
    { title: "Directory provisioning", meta: "Security" },
  ],
  customers: [
    { title: "Quill", meta: "Enterprise · Daniel Okafor", right: "$386k ARR", color: "#444" },
    { title: "Meridian", meta: "Enterprise · Priya Raman", right: "$298k ARR", color: "#c2612f" },
    { title: "Fathom", meta: "Scale · Ines Koch", right: "$88k ARR", color: "#3f7d6e" },
  ],
  issues: [{ title: "AUTH-912 Login loop after SSO", meta: "In review", right: "Tracker" }],
};

export const RECENT = ["billing retries", "Figma export", "AUTH-912"];
export const SUGGESTED = ["How do I set up team SSO?", "How do I rotate an API key safely?", "Why do billing retries stop early?"];

export interface Token { text: string; kind: "w" | "cite" | "code"; n?: Cite }
export function tokenize(s: string): Token[] {
  const out: Token[] = [];
  const re = /(`[^`]+`)|(\[\d\])|([^\s`\[]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) out.push({ text: m[1].slice(1, -1), kind: "code" });
    else if (m[2]) out.push({ text: m[2][1], kind: "cite", n: Number(m[2][1]) as Cite });
    else out.push({ text: m[3], kind: "w" });
  }
  return out;
}
