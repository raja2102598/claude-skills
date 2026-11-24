# model-selector — selection

Method (review captures stay out of git):
- A Playwright screenshot of each page.
- An interaction probe on each page: click the trigger, screenshot early and settled, hover row 2, scroll, pick, screenshot.
- 25 fps real-clock captures of the open motion for Arc, beUI and Wensity. The Wensity capture's crop missed, so it was judged from its probe instead.

| # | candidate | status | notes |
|---|---|---|---|
| 1 | AI Elements — Model Selector | loaded | A prompt box with two plain dropdowns: model (grouped by provider, with a check) and effort. Basic fade/zoom menu with no descriptions and no summary. |
| 2 | assistant-ui — Model selector | loaded | Popover with search, provider filter chips, grouped rows with vendor logos and a context-window line, and a check. Tabs for Open, No selection, Locked models and No matches. Most complete in states, but its motion is a plain popover fade. |
| 3 | Arc UI — Model picker | loaded (~5 s) | **Winner.** Details below. |
| 4 | beUI Pro — Model Picker | loaded (~4 s, dark) | 21 models across providers, with group counts and a fixed bottom search. The list opens scrolled to the selected row and its items fade in. Second variant: provider rail. Very polished. Uses real vendor logos. **Runner-up.** |
| 5 | Wensity — AI Model Selector | loaded (~3.5 s, dark) | Four options with icon and one-liner. Scale-and-unblur open and a gliding selection pill. A small single-effect showcase: no search, effort or catalogue. |
| 6 | UIStacks — Model picker | loaded | Open on load. Three models with icon, description, speed and credit chips, a check and a "More models" row; fades out on close. Polished but narrow. (Its trigger is found by `aria-haspopup`, not by text.) |
| 7 | UIStacks — Assistant picker | loaded | Picks custom assistants rather than models: search, Pinned and Recent groups, tool logos, usage line. A neighbouring concept. |
| 8 | assistant-ui — Model logos | loaded | Static inline vendor marks (default, small, labelled, tinted). A part, not a selector, and they are real brand logos. |

## Winner: Arc UI — Model picker

https://uiarc.dev/components/blocks/model-picker · license: Arc UI Pro (paid block, source behind the Pro plan), so **motion-faithful**. License played no part in the choice.

It leads on the criteria in order:
- **Polish:** one quiet pill and a refined menu with a floating shadow, a 20 px radius and one-line notes under each model.
- **Completeness:** four featured models, an effort submenu (Low to Max, with a default tag), a More models catalogue by provider, and a check on the current model. Under the pill sits a model summary (description, context, prices, effort) with a "Switched from …" confirmation. It has keyboard support and an in-menu page mode for narrow layouts.
- **Motion:**
  - the menu opens with a spring pop;
  - a highlight glides between rows on a critically damped spring;
  - the chevron springs;
  - on a pick, the pill, its mark, the description and the changed prices cross-fade with a 3–4 px lift;
  - the pill's width springs to the new label and the pill re-centres.
- **AI-pattern clarity:** it reads at once as "choose the model and how hard it thinks".

Runner-up beUI Pro is as polished and has better search. Its motion is mostly the list reveal, and it has no effort control and no in-place summary of the choice.

One winner only. #6 and #7 are variants of the same idea (#7 picks assistants), and #8 is only the logos, so none of them is a second component.
