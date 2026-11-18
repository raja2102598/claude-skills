# Component sources

Use these references to understand interaction patterns. Build with the project's existing components and design tokens. For paid sources, work from public previews or documentation and write the implementation from scratch. Use original styling and assets. Reuse source code only when its license permits the intended use.

## Animate UI

Use for animated primitives or an explicit Animate UI request. Check the project's framework, `components.json`, package manager, and component imports. The official docs cover React with Radix UI, Base UI, or React Aria, and Vue with reka-ui. Choose the documented path for the specific component. For a shadcn component, scope the Animate UI CLI to the requested component and inspect the resulting diff. For a direct primitive import, check support for its component and parts before swapping. Keep the app's styling, keyboard behavior, and focus management, and verify reduced motion.

For a broader Animate UI workflow, the upstream skill docs explain the separate `npx skills add imskyleen/animate-ui` command. The upstream skill and packages are installed independently of this catalog.

- [Repository and license](https://github.com/imskyleen/animate-ui)
- [Installation](https://animate-ui.com/docs/installation)
- [Official skill instructions](https://github.com/imskyleen/animate-ui/tree/main/skills/animate-ui)

## Kobra Plan Card

Use for an agent plan that users can preview before approving. Start with the plan title, summary, ordered tasks, and a clear approval action. Reuse the app's existing approval state and action handlers. Test keyboard access, expanded and collapsed views, and repeated approval attempts. If the app supports automatic approval, connect the countdown to that existing policy.

Kobra Plan Card is a paid reference. Use its public preview to understand the flow. Build the plan card with the project's existing disclosure, list, and button primitives.

- [Kobra Plan Card public preview](https://kobra.systems/components/plan-card)

## Wensity UI Progressive Image Loading

Use for React or Next.js images that need a blur, color, or shimmer placeholder. Check the project's existing image component first. Preserve the image aspect ratio while it loads, pass descriptive alt text for meaningful images, and check load failures and reduced-motion behavior.

Implement the placeholder and transition with the project's image component and CSS. Use the framework's built-in placeholder support when available, such as `next/image` in Next.js.

- [Wensity UI component preview](https://ui.wensity.com/components/progressive-image-loading)

## Baobun Studio Agents Guidelines

Consult the guidelines when the request calls for the Baobun Studio agent UI reference. Use the publicly visible guidance to identify patterns relevant to the task, then adapt those patterns with the project's own components and styling.

- [Baobun Studio Agents Guidelines](https://baobun.studio/demo/agents/guidelines)

## Accordee

**What it is:** a live demo of a CRM with a built-in AI assistant called Rune. The demo workspace is filled with sample company data. Its "Get the code" link points to a pricing page, so treat it as a paid product and use only the public demo.

**Use it for:** an AI assistant inside a business app, an agent builder form, or an integrations catalog. Screens worth checking:

- **Ask Rune chat:** suggested prompts, a model picker, a collapsible "3 tools used" list showing the agent's steps, and generated files (such as a PDF report) with Share and Download actions.
- **Agent builder:** name, role, colour, model tier (Auto, Fast, Balanced, Deep reasoning), skill toggles, workspace context, a tone segmented control, and custom instructions.
- **App Library:** integration cards with Connect and Favorite actions. Each integration page has tabs such as Overview, Automation, and Configuration.
- **Workspace shell:** a sidebar with unread counts, ⌘K search, ⌘Y for agents, and quick-action chips such as "Summarise contract".

Open the matching screen before describing or adapting it. Rebuild the behavior with the project's own layout, styling, and assets.

- [Accordee demo](https://demo.accordee.app/)

## Relay Workflow OS

**What it is:** a live demo of a console for running AI agent workflows. It is a client-rendered React app, so a plain fetch returns only the title. Open it in a browser to see the screens. No source code or license is published, so use it only as a visual reference.

**Use it for:** an operations console for agents or automations. Screens worth checking:

- **Runs:** a list of runs with filters and a step-by-step timeline showing each step's input and output.
- **Approvals inbox:** agents stop and wait for a person before sending. A reviewer can approve, reject, or edit the draft ("Edited by you. The agent will send your version."). Workspace approval policies can be overridden per workflow, but only to make them stricter.
- **Agents:** each agent's status and current task ("on step 2 of 5"), with performance and cost by workflow.
- **Workflow builder:** start from a blank canvas, a template, or a one-sentence description that Relay turns into a draft. Nothing runs until you publish.
- **Ask Relay:** a command palette that searches workflows, agents, and runs, and answers questions about runs, cost, or failures.
- **Settings and states:** API keys shown only once, integrations, notification preferences, and empty, loading, and lost-connection states for every view.

Rebuild the behavior with the project's own components and styling.

- [Relay Workflow OS demo](https://relay-workflow-os.vercel.app/)

## Arc UI

**What it is:** a React component library that is installed through the shadcn CLI and also has an MCP server for AI agents. It has 244 animated components and 143 blocks. The free tier (121 components and 22 blocks, no account needed) installs straight into the project, so the source lives in your codebase. Arc Pro is a one-time paid upgrade with the motion-heavy components and most of the complete blocks.

**Use it for:** a project that already uses shadcn/ui and needs an animated everyday component (dropdown, dialog, date picker, tabs, toast stack, switch, elastic slider), a chart or dashboard piece (revenue globe, horizon chart, choropleth), or a complete block (kanban, AI chat, command palette).

Check `components.json`, then add only the requested free component, for example `npx shadcn@latest add @uiarc/button`, and review the diff. The homepage does not state the license, so read the license page before reusing code. Treat Pro components as preview-only references.

- [Arc UI](https://uiarc.dev/)
- Free React/shadcn workspace setup card with progress, expandable tasks, async actions and a hide control. Check the current license before reusing source. [Arc UI Onboarding Checklist](https://uiarc.dev/components/onboarding-checklist)

For a short workspace setup checklist, persist completion by step ID and update it after an async action succeeds. Keep failed steps open with a readable retry state.

## beUI Pro

**What it is:** a paid catalog of animated React blocks, page sections, full landing page templates, and React Native mobile screens. The previews use Framer Motion shared-layout animations, React Flow for canvas builders, and Recharts for charts.

**Use it for:** layout and motion ideas. Its sections:

- **Agents:** chat input, agent plan, tool approval, traces, voice agent, model picker, context window meter, and diff review.
- **Components and blocks:** cards, data tables, command palettes, dashboards, KPI overviews, kanban, messaging, and pricing.
- **Pages and templates:** auth, checkout, settings, docs, changelog, onboarding, status, and full landing pages.
- **Mobile:** React Native wallet, messaging, paywall, settings, and onboarding screens.

Work only from the public previews. Build the component with the project's existing primitives and motion library. If Framer Motion is not already installed, use CSS transitions for simple motion.

- [beUI Pro components](https://pro.beui.dev/components)

## UIStacks

Consult the component catalog when a request names UIStacks. If the relevant preview is accessible, use it to identify layout, behavior, and states to implement with the project's existing primitives. Verify the specific component's license before reusing any source.

- [UIStacks components](https://uistacks.dev/components)

## Senior Frontend

Use this external skill as a review reference when implementing or adapting a component. Reuse the project's components and tokens, cover loading, empty, error, and long-content states where applicable, and verify keyboard operation, screen reader behavior, and narrow layouts in a browser.

- [Senior Frontend skill reference](https://www.aitmpl.com/component/skills/development/senior-frontend)

## Marked

Consult Marked when the user supplies it as a design reference. Open the relevant page before describing the pattern. If the page is unavailable, work from any screenshots or behavior the user supplied. Implement the pattern with the project's own code, styling, and assets.

- [Marked](https://marked.dev/)

## Rare UI

Use the public previews for agent status, assistant presence, and streamed replies. Drive statuses from real events. Announce meaningful status changes without moving focus, and offer a reduced-motion presentation. Rare UI publishes its components under MIT with the Commons Clause and a visible attribution requirement. Review the component terms before reusing code.

- Inline status for thinking, researching, analyzing, writing, completion and errors, with optional details and elapsed time. [Rare UI Inline AI Status](https://www.rareui.com/components/aistatus)
- Animated orb for assistant presence or a chat launcher. Pair the visual with an accessible button when it opens chat. [Rare UI Fluid Orb](https://www.rareui.com/components/fluidorb)
- Incremental Markdown reveal with stop, copy, retry and rating interactions. [Rare UI Streaming Response](https://www.rareui.com/components/streamingresponse)

## Libraries.dev Voice Position and Voice Ring

Use these references for audio-reactive interfaces. Separate audio amplitude from spatial direction. In a React app, animate from mic or playback level when that is all the input provides. Voice Position is beta and its weights have separate terms from the MIT Swift code. The vendor states that commercial release of the model requires a plan. Treat the direction effect as inspiration unless the project already has an eligible signal and model.

- On-device iPhone model estimates speaker direction and rough distance from stereo microphone input. The SwiftUI kits are MIT and the model has separate terms. [Libraries.dev Voice Position](https://libraries.dev/voice-position)
- React and SwiftUI voice visualizer for listening, speaking and processing. The React preview can take a supplied audio level. [Libraries.dev Voice Ring](https://libraries.dev/voice-ring)

## Wensity ChatGPT Orb

Use the circular motion as inspiration for an original assistant mark. For a floating chat launcher, preserve a visible button affordance with a clear accessible name, an idle state, and a distinct open state.

- Soft animated ink inside a circle. Reference for a compact assistant mark or launcher visual. [Wensity ChatGPT Orb](https://ui.wensity.com/components/chatgpt-orb)
