// Placeholder run: a claims agent handling a warranty claim. Start / duration (ms) mirror the reference's schedule so the
// playback timing matches; every name, number and text is our own.

export type Kind = "agent" | "model" | "tool" | "retrieval" | "check";

export interface Span {
  id: string;
  parent: string | null;
  name: string;
  kind: Kind;
  start: number; // ms from run start
  dur: number; // ms
  error?: string;
  facts: [string, string][];
  input: string;
  output: string;
  attrs: [string, string][];
}

export const KINDS: { id: Kind; label: string }[] = [
  { id: "agent", label: "Agent" },
  { id: "model", label: "Model" },
  { id: "tool", label: "Tool" },
  { id: "retrieval", label: "Retrieval" },
  { id: "check", label: "Check" },
];

export const KIND_LABEL: Record<Kind, string> = { agent: "Agent", model: "Model", tool: "Tool", retrieval: "Retrieval", check: "Check" };

export const RUN = {
  id: "run_4c19e2b0",
  when: "Today, 09:41:07",
  title: "claims-agent · warranty claim",
  status: "Finished · 1 retry",
  total: 9180,
  stats: [
    { label: "Duration", value: "9.18s" },
    { label: "Spans", value: "15" },
    { label: "Tokens", value: "11,486" },
    { label: "Cost", value: "$0.034" },
  ],
};

export const TICKS = [0, 2000, 4000, 6000, 8000];

export const SPANS: Span[] = [
  {
    id: "run", parent: null, name: "claims-agent.run", kind: "agent", start: 0, dur: 9180,
    facts: [["Agent", "claims-agent"], ["Spans", "15"], ["Tokens", "11,486"], ["Cost", "$0.034"]],
    input: "Claim #C-20418: blender stopped working after 7 months, receipt attached.",
    output: "Approved a $64.00 refund to the original card and replied to the customer.",
    attrs: [["retries", "1"], ["region", "eu-west"]],
  },
  {
    id: "screen", parent: "run", name: "input.screen", kind: "check", start: 40, dur: 190,
    facts: [["Policy", "pii-and-abuse"], ["Verdict", "pass"], ["Flags", "0"], ["Cost", "$0.0001"]],
    input: "Claim #C-20418 message and attachment metadata.", output: "pass · no findings", attrs: [["mode", "strict"]],
  },
  {
    id: "outline", parent: "run", name: "outline", kind: "model", start: 260, dur: 1050,
    facts: [["Model", "Nova 2"], ["Input tokens", "1,912"], ["Output tokens", "238"], ["Cost", "$0.0064"]],
    input: "Customer reports blender #C-20418 failed after 7 months and asks for a refund. Outline the steps.",
    output: "1. Read the warranty terms\n2. Fetch claim #C-20418\n3. Assess coverage\n4. Pay out via the ledger\n5. Reply to the customer",
    attrs: [["temperature", "0.3"]],
  },
  {
    id: "search", parent: "run", name: "docs.search", kind: "retrieval", start: 1340, dur: 570,
    facts: [["Index", "warranty-terms"], ["Hits", "6"], ["Top score", "0.91"], ["Cost", "$0.0004"]],
    input: "small appliance warranty, 12 months, motor failure", output: "6 passages · best: §4.2 Motor defects", attrs: [["k", "6"]],
  },
  {
    id: "embed", parent: "search", name: "embed.text", kind: "tool", start: 1350, dur: 130,
    facts: [["Tool", "embedder"], ["Dimensions", "768"], ["Tokens", "14"], ["Cost", "$0.0001"]],
    input: "small appliance warranty, 12 months, motor failure", output: "vector[768]", attrs: [["cache", "miss"]],
  },
  {
    id: "query", parent: "search", name: "index.query", kind: "tool", start: 1490, dur: 390,
    facts: [["Tool", "vector-index"], ["Rows", "6"], ["Scanned", "18.2k"], ["Cost", "$0.0003"]],
    input: "top_k=6 · namespace=terms", output: "6 rows", attrs: [["filter", "region=eu"]],
  },
  {
    id: "fetch-1", parent: "run", name: "claims.fetch", kind: "tool", start: 1950, dur: 950, error: "Upstream timed out after 900ms",
    facts: [["Tool", "claims-api"], ["Status", "504"], ["Attempt", "1 of 2"], ["Cost", "$0"]],
    input: "GET /claims/C-20418", output: "504 Gateway Timeout", attrs: [["timeout", "900ms"]],
  },
  {
    id: "fetch-2", parent: "run", name: "claims.fetch", kind: "tool", start: 2960, dur: 660,
    facts: [["Tool", "claims-api"], ["Status", "200"], ["Attempt", "2 of 2"], ["Cost", "$0"]],
    input: "GET /claims/C-20418", output: "{ product: \"BL-300\", bought: \"2026-04-02\", price: 64.00 }", attrs: [["timeout", "900ms"]],
  },
  {
    id: "assess", parent: "run", name: "assess.coverage", kind: "model", start: 3700, dur: 2450,
    facts: [["Model", "Nova 2"], ["Input tokens", "4,388"], ["Output tokens", "412"], ["Cost", "$0.0142"]],
    input: "Terms §4.2 + claim C-20418. Is a motor failure at 7 months covered?",
    output: "Covered: motor defects within 12 months. Refund the purchase price, $64.00.", attrs: [["temperature", "0.1"]],
  },
  {
    id: "payout", parent: "run", name: "payout-subagent", kind: "agent", start: 6200, dur: 2200,
    facts: [["Agent", "payout"], ["Spans", "3"], ["Tokens", "2,214"], ["Cost", "$0.0081"]],
    input: "Refund $64.00 for claim C-20418.", output: "Refund ref PO-7731 posted.", attrs: [["handoff", "claims-agent"]],
  },
  {
    id: "draft", parent: "payout", name: "draft.payout", kind: "model", start: 6260, dur: 920,
    facts: [["Model", "Atlas Mini"], ["Input tokens", "1,620"], ["Output tokens", "184"], ["Cost", "$0.0031"]],
    input: "Prepare a refund entry for C-20418, $64.00, original card.", output: "{ amount: 64.00, method: \"card\", ref: \"C-20418\" }",
    attrs: [["temperature", "0"]],
  },
  {
    id: "ledger", parent: "payout", name: "ledger.post", kind: "tool", start: 7220, dur: 880,
    facts: [["Tool", "ledger"], ["Status", "201"], ["Entry", "PO-7731"], ["Cost", "$0"]],
    input: "POST /entries { amount: 64.00 }", output: "201 Created · PO-7731", attrs: [["idempotent", "yes"]],
  },
  {
    id: "limits", parent: "payout", name: "limits.check", kind: "check", start: 8130, dur: 240,
    facts: [["Policy", "refund-limits"], ["Verdict", "pass"], ["Limit", "$250"], ["Cost", "$0.0001"]],
    input: "amount=64.00 · tier=standard", output: "pass", attrs: [["mode", "strict"]],
  },
  {
    id: "reply", parent: "run", name: "write.reply", kind: "model", start: 8420, dur: 640,
    facts: [["Model", "Nova 2"], ["Input tokens", "1,064"], ["Output tokens", "196"], ["Cost", "$0.0038"]],
    input: "Tell the customer the refund was approved.", output: "Good news: your claim is approved and $64.00 is on its way to your card.",
    attrs: [["tone", "warm"]],
  },
  {
    id: "redact", parent: "run", name: "output.redact", kind: "check", start: 9070, dur: 100,
    facts: [["Policy", "pii-out"], ["Verdict", "pass"], ["Redactions", "0"], ["Cost", "$0.0001"]],
    input: "Reply draft (212 chars).", output: "pass · nothing to redact", attrs: [["mode", "strict"]],
  },
];
