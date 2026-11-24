# agent-tasks: selection

Reviewed 2026-11-24 with reanimate `capture.ts`: one page screenshot plus one short capture per candidate (about 3 to 4 s at 10 fps, cropped to the preview). Raw captures stay out of git. The pick was made on quality alone (polish, completeness, motion, how clearly it reads as an AI pattern). License only set the fidelity level.

| Candidate | Loaded? | What the preview shows | Verdict |
|---|---|---|---|
| AI Elements · Task (ui.shadcn.com, MIT) | yes | One agent turn: user bubble, two collapsible task lines ("Found the project files", "Updated the page metadata") that expand to show their steps, final message, Replay. | A single task's trace, not a list of agents running in parallel. Clean but small for this concept. |
| Arc UI · Agent tasks (Pro) | yes (preview takes about 5 s) | Light board for coding agents: composer with repo, branch and model pickers; tabs All / Running / Ready for review / Merged; cards with branch, diff bar, checks, Create pull request / PR open / Retry / Merged. During the capture one running card turns "Ready for review". | **Runner-up.** Complete and well organised, but plainer and almost static. |
| beUI Pro · Agent tasks (mobile Agent Inbox) | yes (about 3.5 s) | Phone inbox with groups (Needs you / Running / Done), filling rings, a Review button and Retry. | Polished, but slow and a phone mock-up. It is a variant of the same idea from the same catalog, so no second winner. |
| beUI Pro · Background Agents (Agent list) | yes (about 3.5 s) | Card of 5 parallel agents. Progress rings fill while each agent's current step rolls in (blur and slide), with live timers. A queued agent starts; a run fails and offers Retry; one asks a question inline with an amber ping and two answers; finished runs show a +/− diff with Open PR / View diff. The composer queues new tasks. | **Winner.** The most polished and most complete: every state a background-agent list needs, with tight, consistent motion. |

Nothing failed to load: no 404, no login wall, no 429.

## Winner

**beUI Pro, Background Agents → "Agent list"** (https://pro.beui.dev/components/background-agents), cloned as `agent-tasks`.

- **Fidelity: motion-faithful.** beUI Pro is a paid catalog and its source is locked.
- **Everything visible is ours:**
  - copy: fictional repos and tasks ("Speed up the search index", "Move cron jobs to the queue")
  - palette: warm graphite with a violet ring, mint done, coral failed, amber needs-you
  - fonts: Figtree and IBM Plex Mono
  - icons: lucide
- **Nothing copied:** no beUI CSS, JS, copy or assets. Timings and easings were measured from the captures and from `getAnimations()`.
- **One winner only:** the mobile inbox and the Arc board are variants of the same "list of agents" idea, and the AI Elements Task is a single-task trace that agent-plan and tool-call already cover.
- **No overlap with agent-plan:** this is a list of several agents running in parallel, not one plan's step-by-step run.
