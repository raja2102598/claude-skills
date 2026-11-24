# coding-agent: selection

Concept: **Coding-agent output (terminal, tests, file tree, stack trace)**. Each candidate got one screenshot, and Terminal and Test Results also got a Replay capture. All four candidates are AI Elements on ui.shadcn.com. The AI Elements LICENSE at raw.githubusercontent.com/vercel/ai-elements/main/LICENSE is Apache-2.0, "Copyright 2023 Vercel, Inc." (verified). The demo sources `terminal-demo.tsx` and `test-results-demo.tsx` in shadcn-ui/ui are MIT. That clears pixel-faithful cloning, with attribution in `meta.license`.

| Candidate | URL | Loaded | Notes |
|---|---|---|---|
| **AI Elements, Terminal** (winner) | https://ui.shadcn.com/docs/ai-elements/base/terminal | yes | A scripted run of `pnpm lint`, `pnpm test` and `pnpm build`. Each line shimmers while it runs, and its stdout streams into a code block at 200 ms per line. The block opens on the first line and folds shut when the command ends. Then the answer streams and a Replay button appears. It has the richest motion and the most states of the four. |
| **AI Elements, Test Results** (second winner) | https://ui.shadcn.com/docs/ai-elements/base/test-results | yes | A shimmering "Running pnpm test checkout" line for 1.5 s. It lands as a red summary, "Ran 5 tests, 1 failed", that opens into suites and tests. The failing suite and test are open with the error and file location, and passing suites stay folded. It is a different component from Terminal. |
| AI Elements, Stack Trace (runner-up) | https://ui.shadcn.com/docs/ai-elements/base/stack-trace | yes | A failed tool call in red whose collapsible lists stack frames with file:line links and a "4 framework frames" fold. Polished and a strong error state, but a static fold with less motion than the other two. |
| AI Elements, File Tree | https://ui.shadcn.com/docs/ai-elements/base/file-tree | yes | A static folder tree with collapsibles and a selected file. No replay and no streaming, so it is the weakest candidate for motion or agent flavour. |

**Why Terminal wins:** it has the best motion (live shimmer, streamed stdout, height transitions on open and close, sequential commands) and the most complete states (running, streaming, done, folded, finished transcript, Replay). It also reads most clearly as an agent running commands.

**Why a second winner:** Test Results is a distinct component, not a variant of Terminal. Its job is structured results: nested suites and tests, pass and fail states, a red failure that opens by default, and a keep-mounted collapsible tree. The Terminal winner has no such state. Stack Trace shares that error idea but is mostly static, and File Tree is static, so Test Results is the stronger second pick on quality alone. License played no part in the choice.

Clones: `coding-agent-terminal` and `coding-agent-tests` (both pixel-faithful). Reports in `report.md`.
