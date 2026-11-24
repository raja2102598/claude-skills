# claude-skills

A collection of [Claude Code](https://claude.com/claude-code) skills.

A skill is a folder with a `SKILL.md` inside. Claude reads the `description` in the
frontmatter to decide when to load it, so the body costs nothing until it's actually
relevant.

## Setup on a new machine

```bash
git clone https://github.com/raja2102598/claude-skills.git ~/.claude/skills
```

**The clone path is load-bearing.** Claude only discovers personal skills in
`~/.claude/skills` — cloning anywhere else silently does nothing.

If that directory already exists with content, clone elsewhere and merge rather than
forcing it:

```bash
git clone https://github.com/raja2102598/claude-skills.git /tmp/cs
cp -r /tmp/cs/*/ ~/.claude/skills/
```

Verify with `/skills` in a Claude Code session, or just `ls ~/.claude/skills`.

## Skills

| Skill | What it's for |
|-------|---------------|
| `gmail-attachments` | Getting attachment bytes out of Gmail. The Gmail connector returns attachment metadata but exposes no download tool; this documents the RAW MIME workaround. |
| `teach` | Teach a topic across sessions with lessons, recall practice, reference sheets, and learning records. From [Matt Pocock’s skills](https://github.com/mattpocock/skills); MIT license. |
| `unslop` | Polish UI spacing, color, typography, copy, and visuals. By [Damir Sokolovsky](https://github.com/heydamir/unslop); CC BY 4.0. |
| `security-audit` | Review security boundaries and verify vulnerability findings. From [Cloudflare](https://github.com/cloudflare/security-audit-skill); MIT license. |
| `codebase-design` | Design modules with small interfaces and testable implementations. From Matt Pocock’s skills; MIT license. |
| `grill-me` | Start a questioning session to examine a plan or design. Uses `grilling`. From Matt Pocock’s skills; MIT license. |
| `grilling` | Ask questions in rounds to resolve decisions and their dependencies. From Matt Pocock’s skills; MIT license. |
| `impeccable` | Design, critique, and refine frontend interfaces; Apache-2.0. |
| `elephant-goldfish-model` | Draft software designs and review documents with independent agents; Apache-2.0. |
| `pick-ui-library` | Choose a UI library with minimal dependency churn; MIT license. |
| `mythical-agent-month` | Estimate AI-assisted software work, agent runtime, review effort, and calendar delays. From [MedAdemBHA](https://github.com/MedAdemBHA/mythical-agent-month), MIT. |
| `prune-tests` | Remove redundant tests and tests that guard no intended behavior. From [Caldo](https://github.com/caldoai/skills), MIT. |
| `untangle-codebase` | Refactor structural coupling while preserving intended behavior. From [Caldo](https://github.com/caldoai/skills), MIT. Explicit invocation. |
| `wait-what` | Ask the agent to explain its last response again in simpler language. From Matt Pocock’s skills; MIT license. |
| `reanimate` | Clone an animation, widget or section from a site, video, gif or Lottie file, then verify the clone frame by frame against the reference. From [NiazMorshed2007/reanimate](https://github.com/NiazMorshed2007/reanimate); MIT. Needs Bun. |

## Pick a UI library

`/pick-ui-library <task>` in Claude Code or `$pick-ui-library <task>` in Codex checks existing dependencies and native features first. It uses Emil Kowalski’s library catalog and public UI references to recommend open-source components or original implementations inspired by the demos. Browse the [UI reference index](pick-ui-library/references/ui-reference-index.md) for component links, demos, and a short description of each. Explicit invocation only; importing this folder does not install its listed UI packages.

## Reanimate

`/reanimate <what>, <where it is>, <where it goes>` records the reference in headless Chromium, rebuilds it in your stack, records the clone the same way, and iterates until timing, easing and pixels match. Say "match it exactly" for pixel-faithful output; motion-faithful is the default. Install Bun 1.1+ first; the first run downloads Playwright's Chromium and a static ffmpeg (about 250 MB). See [reanimate/UPSTREAM.md](reanimate/UPSTREAM.md) if a preinstalled Playwright makes the capture fail.

## Estimation and refactoring

Use `/mythical-agent-month` with a task list or roadmap to estimate AI-assisted work. The bundled calculators require Python 3. Use `/untangle-codebase [optional area]` to start a structural refactor.

## Optional skills

`codebase-design`, `grill-me`, `grilling`, and `wait-what` are stored here for optional installation.
If you install `grill-me`, include `grilling`, which it invokes.

## Using the UI and security skills

In Claude Code, use `/unslop` to polish a screen or `/security-audit` to review code.
In Codex, invoke `$unslop` or `$security-audit` with your request.

Cloudflare’s skill uses guidance mode for focused security questions. A full audit
uses independent agents, Node.js validators, and an OS-enforced sandbox for running target code.

## Using teach

In Claude Code, run `/teach <topic>`. In Codex, invoke `$teach` with your topic.
Run it from the folder where you want to keep lessons and learning records.
The skill creates teaching files in that workspace and asks about your learning goal.

For local Codex use, copy `teach/` into `~/.codex/skills/`. Claude Code discovers
it in `~/.claude/skills/`. Each copy needs the full folder, including the templates.

## Adding a skill

```bash
mkdir -p ~/.claude/skills/<name>
$EDITOR ~/.claude/skills/<name>/SKILL.md
```

Frontmatter needs `name` and `description`. Write the description as *when to use this*,
including the phrasings you'd actually type — that string is the only thing Claude matches
against, so a vague one means the skill never fires.

```markdown
---
name: my-skill
description: Use when <situation>. Triggers on "<phrase>", "<other phrase>".
---
```

Then commit and push; `git pull` on the other machines.

## Conventions

- One skill per directory, named the same as its `name:` frontmatter field.
- Record the **trap** as well as the fix — what the wrong path looks like, so it isn't
  rediscovered from scratch next time.
- Mark what's actually been verified versus assumed. An untested caveat left in as
  gospel sends future-you down the expensive fallback for no reason.
- Keep credentials, tokens, key files, and personal data out of the repository.

## UI and design workflows

- `impeccable`: complete standalone distribution with command-specific references. Its launcher can download the pinned engine on first use; importing into this library does not run it or install hooks. The upstream workflow already loads references by command.
- `unslop`: updated existing import; use it for a focused UI cleanup. Attribution and license remain bundled.
- `elephant-goldfish-model`: one explicit entrypoint routes to seven complete bundled workflows. Copy the whole folder if installing later; personas, standards, and host integration docs are required. Nested skills need not be registered separately. Reviews require genuine fresh-context subagents and retain upstream approval checkpoints. Use a focused review when sufficient; full reviews may consume substantial model usage.

No local installation is performed by adding these folders to this repository. Source versions and local adaptations are recorded in each folder's `UPSTREAM.md`. Skill descriptions contain capabilities only; provenance and invocation settings live separately.

## Context-efficient execution

Unslop loads affected passes for light cleanup and all nine only for a full redesign; video instructions are separate. Impeccable loads the active command and required checks without preloading the command catalog. Both reuse unchanged references already present in context.

For an explicitly focused or one-pass EGM review, the confirmed configuration can select `ReviewMode: single-pass`. It uses one instance per selected role, defaults to direct dispatch for up to three roles, and stops after that round and its resolution checkpoint. This is not convergence or a comprehensive review. Full EGM reviews retain two-clean-round convergence, five-round cap, user checkpoints, and fresh reviewer contexts. No requested reviewers or required evidence are silently skipped to save tokens.

These changes reduce unconditional instruction loading and avoid unnecessary duplicate dispatch. Runtime token savings have not been benchmarked.
