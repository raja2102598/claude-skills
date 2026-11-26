# prompt-mention — selection

Concept: @-mention and context picker in the composer.

| candidate | loaded | notes |
|---|---|---|
| assistant-ui · Composer trigger popover (https://www.assistant-ui.com/elements/composer-trigger-popover) | yes | Static state tabs: Default, Categories, Search, Commands, No matches, Loading. Covers many states (category drill-in, empty, loading) but plain styling, and the preview shows no motion. MIT. **Runner-up.** |
| UIStacks · Mention prompt (https://uistacks.dev/components/mention-prompt) | yes | Autoplaying 12 s demo of both triggers. Grouped agents, people and commands; filtering on each keystroke; caret-anchored list that closes on a space and reopens for a two-word name; chips in the text; keyboard hint row; spring pop, exit shrink and a caption that steps aside. **Winner.** |
| assistant-ui · Context (https://www.assistant-ui.com/elements/composer-context) | yes | A token-usage ring in the composer rail that fills as the thread grows. It is a context-window meter, not a mention or context picker, so it is off-concept for this clone. |

**Winner: UIStacks "Mention prompt"**, cloned motion-faithful (UIStacks Pro: paid, source behind a license key, no open-source license; license played no part in the choice). It wins on every criterion:
- the most polished visuals of the three;
- the most complete flow: both `/` and `@`, grouped results, filtering, closing and reopening, chips, and keyboard affordances;
- the only candidate with real motion: spring open, exit shrink, caption fade and highlight glide;
- it reads directly as an agent-composer pattern, with agents and people mixed in one list.

assistant-ui's trigger popover has more edge states (loading, no matches, categories) but no motion and plainer visuals, so it is the runner-up. One winner only: the concept is a single component.
