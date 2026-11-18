---
name: elephant-goldfish-model
description: Explore software designs, draft specifications, review documents with independent agents, and check designs against code.
disable-model-invocation: true
license: Apache-2.0
---

# Design and independent review

Choose only the workflow needed for the request and read its bundled instructions:

- Explore an idea: [brainstorm](skills/egm-brainstorm/SKILL.md).
- Write a design: [draft](skills/egm-draft/SKILL.md).
- Review a software design: [review](skills/egm-review/SKILL.md).
- Configure a focused document review: [review loop](skills/egm-review-loop/SKILL.md).
- Address findings: [resolve](skills/egm-resolve/SKILL.md).
- Document existing code: [bootstrap](skills/egm-bootstrap/SKILL.md).
- Compare designs with code: [drift report](skills/egm-drift-report/SKILL.md).

Do not load all workflows or launch the full sequence by default. If no task is supplied, ask what the user wants to design or review.

This folder is the bundled plugin root. Resolve persona, standard, and integration paths here, and user artifact paths in the user's project. Read the appropriate host integration in `docs/` before execution. When a workflow calls another bundled skill, read that skill's file and follow it in-thread if native skill invocation is unavailable; do not assume nested skills were registered by installing this folder.

Preserve the chosen workflow's approval checkpoints and review limits. Goldfish reviewers require fresh subagent contexts without the parent conversation; never simulate an independent review in the parent. Read only the needed reviewer personas and standards. This workflow produces designs and review artifacts; implementation requires leaving the design workflow.

For an explicitly focused or one-pass document review, route directly to review-loop with `ReviewMode: single-pass`, recommending only relevant reviewer roles and confirming the configuration before dispatch. For a full/comprehensive software-design review, use review and retain its stages and convergence rules. Do not silently downgrade a full review to save tokens. Reuse unchanged host guidance across nested calls, and never forward the parent transcript to reviewers.
