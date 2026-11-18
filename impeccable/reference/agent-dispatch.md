# Standalone agent dispatch

Use this procedure wherever a playbook delegates an Impeccable role. A copied skill folder does not register native named agents; bundled TOML files alone are not proof of registration.

- If the host advertises the required named agent, use it with the playbook's input packet. The parent need not read that agent's definition.
- If the host has subagents but that name is not registered, spawn a general-purpose agent. Pass the absolute path to the matching TOML below and the same input packet. Instruct the child to read the TOML's `developer_instructions` field first and follow it as its role, then read the assigned evidence and return its output contract. The parent need not load or paste the persona. TOML runtime/model settings are metadata, not shell commands or a substitute for actual host permissions. If the persona cannot be read, report failure rather than continuing without it.
- With no subagent capability, follow the active playbook's disclosed inline fallback and its matching `degraded/` reference. A same-context pass is never described as an independent review.

Resolve these paths against the absolute skill directory, independent of the project's cwd:

- Finish reviewer: `agents/impeccable_finish_reviewer.toml`.
- Documenter: `agents/impeccable_documenter.toml`.
- Asset producer: `agents/impeccable_asset_producer.toml`.
- Manual edit applier: `agents/impeccable_manual_edit_applier.toml`.

Keep each role's input packet, write restrictions, evidence requirements, and return format unchanged. The finish reviewer must start without the parent transcript: use `fork_turns: "none"` or `fork_context: false` when that is the supported schema; otherwise use the host's equivalent fresh-context mechanism. If isolation cannot be established, report that limitation instead of claiming an independent result. For verdict continuations, use only that reviewer's prior context and the new fix packet, never the builder transcript.

A generic child must not read a `degraded/` persona: those files describe an inline substitution and would mislabel a real delegated run. Report role startup failures and use the active playbook's existing retry limits.
