# Upstream source

Source: https://github.com/google/elephant-goldfish-model

Commit: `8c29f560e300471d458b71d1131834e097b18d4f`.

Apache-2.0; see LICENSE. Imported the complete runtime file set selected by upstream `scripts/pack_plugin.py`, including both Claude and Codex adapters. Added a single explicit entrypoint to keep seven workflows behind on-demand routing. Shortened bundled skill descriptions; other instruction adaptations are recorded below. No plugin was activated locally and no model-backed design or review workflow was executed. Fresh-context review capability must be checked in the consuming host.

## Context-efficiency adaptation

Added explicit single-pass mode for focused reviews while retaining full-review convergence, caps, approval gates, and fresh-context isolation. Default small reviews dispatch directly with one instance per role. Parent context reuse requires freshness; every fresh reviewer still reads assigned source evidence. The canonical synthesizer (also used by the Claude adapter) requires explicit requests for duplicate instances; nested workflows reuse unchanged host integration guidance.

Static packaging and instruction checks do not establish measured runtime token savings.
