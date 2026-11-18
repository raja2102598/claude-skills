# Upstream source

Source: https://github.com/pbakaus/impeccable

Commit: `c1e0e5492fbb524f5df84d635ecfae7dc438ec45`.

Apache-2.0; see LICENSE and NOTICE.md. Imported the complete `.agents/skills/impeccable` distribution, including launcher, pinned engine checksums, command references, and agents. Adapted discovery descriptions only; runtime files are unchanged; instruction adaptations are recorded below. Importing does not activate hooks or execute/download the engine. Runtime workflows have not been executed here.

Normalized incidental trailing whitespace in imported text files.

## Context-efficiency adaptation

Moved the optional command table into reference/commands.md, removed generic introductory prose, and added scoped reads and context reuse. Updated routing to find the moved catalog. Runtime, command playbooks, native handling, fallback, and required craft-floor checks are preserved.

Static packaging and instruction checks do not establish measured runtime token savings.

## Standalone delegation compatibility

Added shared registered-agent/general-purpose dispatch for all four bundled roles. Unregistered roles are read by the child from their TOML developer_instructions rather than assumed to be installed native agents. Updated new-work, visuals, and live-edit call sites; corrected the Codex fresh-context example to fork_turns: "none". Persona content and output contracts are unchanged. Native model-backed dispatch has not been exercised here.
