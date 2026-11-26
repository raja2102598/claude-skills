# ai-search selection
Concept: AI search bar / answer. Both candidates (Arc UI) loaded; one screenshot + one short capture each (capture.ts crashed twice with "Target crashed" under memory pressure, then loaded on retry).

| # | Candidate | Result |
|---|---|---|
| 1 | Arc UI, AI search bar (/components/blocks/ai-search-bar) | loaded. Autoplaying loop: type a query, grouped results (Docs, Customers, Issues) with highlighted matches and an "Ask AI" row, Tab, thinking skeleton, streamed answer with numbered citations that light badges on the matching results, reset, then a suggested question runs the same way. Keyboard hints and model in the footer. **Winner** |
| 2 | Arc UI, AI answer (/components/blocks/ai-answer) | loaded. Full-page article layout: question, collapsible Thinking, sources row, formatted streamed answer with citation marks, follow-up composer, copy/regenerate/share. Polished, but its streaming and citation pattern is a subset of what the search bar shows in a single card, and it needs a page-size stage. Runner-up |

Why 1 won, on quality alone: it is the more complete and more legible AI-search pattern. It covers the whole loop (query, results, ask, think, stream, cite, reset, suggested question) in one compact component, with clear motion beats (skeleton to token stream, badges lighting as citations land) and an obvious link between answer and results. The answer page is strong but is mostly a streaming article, close to the streaming-text and reasoning concepts.
Source: Arc UI, https://uiarc.dev/components/blocks/ai-search-bar (paid Arc UI Pro block; clone is original code and styling).
