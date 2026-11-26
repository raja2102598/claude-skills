# agent-map: selection

Candidates (concepts.json "agent-map"), each captured with reanimate capture.ts (3–4 s, cropped to the preview) in
.reanimate/agent-map/cand/. All six loaded; none hit a 404, a login wall or a 429.

- Kobra "Agent Map" (https://kobra.systems/components/agent-map): a walking-route map card inside a chat answer (map
  tiles, route dots, place cards). It is an agent showing a geographic map, not an agent/orchestrator graph: off-concept.
- UIStacks "Agent map" (https://uistacks.dev/components/agent-map): lead → agents → tools graph with bezier edges, a
  path highlight that draws from the lead to the selected node's tools, call dots paced by calls/min, a details panel,
  a "Needs you" approval state, arrow-key navigation and a 12 s auto-tour. **Winner.**
- Arc UI "Agent orchestrator" (https://uiarc.dev/components/blocks/agent-orchestrator): a lead with four parallel
  sub-agent cards (concurrency picker, tool steps, tokens/cost, a failed-and-retrying card, summary). Polished and
  complete, but a list of parallel runs rather than a graph, and it overlaps the parallel-agent concepts. **Runner-up.**
- Arc UI "AI workflow" (https://uiarc.dev/components/ai-workflow): a vertical run log of one automation (trigger →
  classify → route → post) with Passes/Fails/Loading/Empty states. Good states, but linear steps that read as a run log.
- beUI Pro "Weave Workflow Builder" (https://pro.beui.dev/components/weave-workflow-builder): three nodes on a dotted
  canvas, one travelling dot and a spinner. The thinnest graph candidate (few nodes, no panel, few states).
- UIStacks "Automation card" (https://uistacks.dev/components/automation-card): a when/then automation summary with an
  on/off toggle and On/Paused/Error states. Mostly static, a settings card rather than a graph.

Winner: UIStacks "Agent map". It is the only candidate that is an actual orchestration graph, and its motion carries
meaning: the path draw shows who calls whom, dot pace shows call volume, and the approval state pauses one agent. It
also has the most complete interaction (selection, keyboard, panel, tour). One winner only: beUI's builder is a smaller
variant of the same idea, not a different component.

License: paid. The page offers "Get Pro · $159" and installs from @uistacks-pro with a license key, so the clone is
motion-faithful (own palette, Geist, lucide icons, fictional names, own copy; rebuilt from captures and rAF probes, no
source used).
