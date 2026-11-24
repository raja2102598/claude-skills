# agent-plan: selection

Reviewed 2026-11-24 with reanimate `capture.ts` (1440 px viewport, 10 fps, preview crop; long runs at 4 fps).
Raw captures: `.reanimate/agent-plan/candidates/<name>/` (sheets kept, frames dropped by .gitignore).
Picked on quality alone (polish, completeness, motion, AI-pattern clarity); license played no part in the choice,
only in the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Plan (ui.shadcn.com, MIT) | yes | Plan inside a chat turn: collapsible "Plan: … · N of 4 done", shimmer on the running title, pending/running/done icons, final message streams in, Replay button. Shows the finished state on load; the run plays only on Replay. | Clean but small: no approval, no per-step output, no failure state. |
| assistant-ui · Agent plan (MIT) | yes | Checklist with a thin progress bar and mono "N of 5", spinner + one-line description on the active step, plays once on load. | Minimal; slow cadence, a single state family (no draft, no failure). |
| Arc UI · Agent plan (Pro) | yes (preview takes ~5 s to render) | Editable draft (rename, reorder, add, remove) with Keep planning / Approve plan, then a live checklist: sub-activity lines under the running step, per-step durations, progress bar, agent-added step highlighted mid-run, Pause, "Working on step N". | **Runner-up.** As complete as the winner, plainer visual and calmer motion. |
| beUI Pro · Agent Plan (Plan runner) | yes (preview ~3.5 s) | Draft with tool badges and estimates → runs by itself: segmented progress, spinner, streamed tool-call lines with a cursor, live per-step and total timers, call counter, steer input; step 5 fails with red output, "Needs attention" and Retry. | **Winner.** Most polished and most complete run: every state an agent plan needs (draft, running, done, failed + retry, steering) with tight, consistent motion. |
| Kobra · Plan Card (paid) | yes | Approval card: title, summary, to-dos collapsed to 3 + "3 more", auto-approve countdown ring with rolling digits, View Plan / Approve ⌘↵. | Good approval prompt, but static apart from the countdown; no execution. A variant of the same idea, so no second winner. |
| UIStacks · Plan card (license not verified) | yes | Drafting stream: steps blur in over skeletons, sources stack, time/credit estimate, Edit plan / Start research, then a highlight walks the steps. | Polished drafting, thin run side (no per-step output or failure); relies on real third-party app logos. |

Nothing failed to load: every URL answered 200, no login wall, no 429.

## Winner

**beUI Pro, Agent Plan → "Plan runner"** (https://pro.beui.dev/components/agent-plan), cloned as `agent-plan`.

- Fidelity: **motion-faithful**. beUI Pro is a paid catalog with the source locked ("Source code is locked"), so
  the clone uses its own copy (a CSV-export plan by a fictional agent "Atlas" on "nova-2"), its own palette
  (cool near-black, indigo accent, different tool colours), Inter + JetBrains Mono, and lucide icons. No beUI
  CSS, JS, copy or assets were copied; timings and proportions were measured from the capture.
- Only one winner: Kobra's approval card and the other plans are variants of the same "plan with steps" idea, and
  the beUI draft → Run plan flow already covers the approval moment.
- Runner-up: Arc UI Agent plan.
