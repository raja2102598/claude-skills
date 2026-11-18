---
name: pick-ui-library
description: Choose an open-source frontend library or build an original component inspired by a UI reference while minimizing new dependencies.
disable-model-invocation: true
---

# Pick a UI library

If no task was supplied, ask what UI behavior the user needs. Otherwise:

1. Inspect the relevant package manifest and existing UI patterns. Respect the user's named library, framework, and constraints; do not reinterpret an explicit choice as permission to replace it.
2. Prefer native browser/CSS features or a suitable installed dependency. Do not add a package for a simple hover/fade, local state, or trivial conditional classes. Avoid hand-building complex accessible interactions when a suitable primitive already exists.
3. When a library is needed, read [references/libraries.md](references/libraries.md) and match the requested behavior. These are preferences, not mandatory dependencies. Keep a suitable existing alternative; migrate only when requested or required by the task.
4. For a component or design reference, use the [UI reference index](references/ui-reference-index.md) to find a match by name or use case. Read the relevant section of [references/component-sources.md](references/component-sources.md) for implementation guidance. Use the public preview or docs to identify useful behavior and states, then recommend an original implementation with native features or existing open-source primitives. Do not recommend buying paid components. For open-source reuse, verify that the specific component's license permits the intended use and follow its terms. If source access or reuse rights are unclear, write fresh code and use original assets.
5. Before recommending a new dependency, check its official docs for framework support, current API, and installation package name. Verify maintenance or licensing when those affect the choice. Research only the relevant candidate; do not assume a URL slug is an npm package name. If verification is unavailable, state that limit.
6. Recommend one choice with a brief reason tied to the task. If nothing in the catalog fits, label the recommendation as outside the curated catalog. Implement the component or install an eligible open-source dependency only when requested.

Keep the answer proportional: choice, reason, and any material compatibility constraint. Read only the references that apply to the request.
