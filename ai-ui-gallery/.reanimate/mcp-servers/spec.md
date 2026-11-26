Target: Arc UI "MCP servers" block (https://uiarc.dev/components/blocks/mcp-servers), the Notion Sign in -> Authorize -> tool discovery flow.
Destination: src/clones/mcp-servers (React 19, Tailwind v4 present, CSS keyframes + lucide).
Fidelity: motion-faithful (own palette, Figtree/JetBrains Mono, fictional services, lucide icons).

Times are seconds from the capture start (click on Authorize at 0.20 s), 20 fps, virtual clock.
| row | trigger | ref | clone |
|---|---|---|---|
| Sign in sheet rise | Sign in click | ~100 ms rise + scrim fade | 130 ms ease-out rise (unmeasured finely) |
| Authorize label -> spinner | Authorize click | cross-fade 0.20-0.30 | 110 ms fade, 40 ms delay |
| Spinner | | 0.25-0.80 | same |
| Swap to discovery | | 0.85 | 0.85 |
| Tool rows | | 1.65 / 1.75 / 1.85 / 1.95 | 1.65 / 1.75 / 1.85 / 1.95 (activity 1.55-1.65 on shifted index) |
| "Found 4 tools" | | 2.10 | 2.05-2.10 |
| Done enabled | | 2.15 | 2.10-2.15 |
| Done, Retry, expand row, tool toggles | | not captured (see report) | own timings |
