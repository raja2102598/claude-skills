# approval: selection

Reviewed 2026-11-24 with reanimate `capture.ts`:
- 1440 px viewport; the crop was the preview, or the whole page for a first look
- 2–25 fps; trigger clicks on Approve, Allow once, Deny or Send message
- raw captures in `.reanimate/approval/candidates/<name>/`, kept out of git

The pick was on quality alone (polish, completeness, motion, AI-pattern clarity). License played no part in the choice, only in the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Confirmation (ui.shadcn.com, MIT) | yes; the preview is blank until "Send message" is clicked | Chat turn: the user message, a "Thinking" stream that collapses to "Thought", then a "Run rm -rf dist?" item with Deny / Approve. Approve collapses it to a tool line and the reply follows. Has Reset. | Clean and minimal; one request with no risk, arguments or queue. |
| assistant-ui · Approval card (MIT) | yes | Static "Run command" card with a command block and Deny / Always allow / Allow once. Allow once fades the buttons into "Approved · running" with a spinner, then "✓ Finished" at ~2 s. Has a Command/Destructive variant toggle. | Polished but small: a single request. |
| Arc UI · Agent approvals (Pro) | yes; renders after ~5–6 s | Queue of 5 agent tool calls. The focus card shows agent and model, a risk level, a mono command, a reason and editable arguments, with Deny / Always allow ▾ / Approve ⏎. The decision reads back ("Sending your approval…" → "✓ Approved" or "Telling … no" → "✕ Denied"), counts roll, the next request rises into focus and its row collapses. Also a Rules count, a resolved footer and J/K/A/D keys. | **Winner.** |
| beUI Pro · Tool Approval (paid) | yes; preview ~3.5 s | Dark "Needs your approval · 5 waiting" queue with shell, diff and DB previews, risk pills, a "Why:" line and Always allow scoped to a pattern. Deny opens a note for the agent. Approve lifts the card and the next row grows in (~250 ms, with blur). | **Runner-up.** As polished and nearly as complete, but a decision swaps away instantly with no read-back of what happened. |
| beUI Pro · Approval Queue (paid) | yes | A general human review inbox (access, assets, purchases) with tabs, search and a modal review dialog. | Not an agent pattern; the dialog breaks out of the card. |
| UIStacks · Approval request (free tier; license not verified) | yes | A single "Pay 3 vendor invoices" card with risk, tool arguments, an expiry countdown and Deny / Always allow / Allow once. The buttons collapse into an "Allowed once" line. | A good single-request card with one state change. |
| UIStacks · Agent permissions (Pro) | yes | OAuth-style consent card: Read/Write/Send scopes with switches, an access duration and Allow / Deny. Uses real third-party app logos. | A different pattern (scope consent), and mostly static. |
| beUI Pro · Agent questions (mobile, paid) | yes | A phone-mockup questionnaire: the agent asks clarifying questions one at a time. | Clarifying questions, not tool approval. |

Nothing failed to load: no 404, no login wall, no 429.

## Winner

**Arc UI, "Agent approvals"** (https://uiarc.dev/components/blocks/agent-approvals), cloned as `approval`.

- **Why:** Arc and beUI Tool Approval are level on polish. Arc wins on completeness and on how clearly it reads as an agent pattern. Its decision has a visible lifecycle: sending → approved or denied → the next request. It also names the agent and model, shows the risk and the arguments, and keeps a resolved history and a rules count. Its motion is a single consistent spring system (ω = 18 rad/s) with rolling counts.
- **Fidelity: motion-faithful.** The block carries Arc's Pro badge (paid; source behind the Pro plan) and states no open-source license.
  - The clone uses its own copy, palette, IBM Plex fonts, initial-letter agent marks and lucide icons.
  - None of Arc's brand marks were reproduced: not its agent or tool logos, nor the vendor names in its copy.
  - No Arc CSS, JS or assets were copied.
- **Only one winner:** the beUI queues, the single-request cards and the consent card are variants of the same approve-or-deny idea, or a different pattern (questions).
- **Runner-up:** beUI Pro Tool Approval.
