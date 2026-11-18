# Curated UI libraries

These options cover full UI systems, component registries, and focused packages. Match the library to the project's stack and the scope of the change. Use the installed UI system when it covers the task. For community registries and catalogs with paid tiers, check the individual entry's license and use paid previews as inspiration for original implementations.

## Headless primitives and source registries

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com/docs) | React, Tailwind CSS | Copy and customize component source in your repo. Start here if the project already uses a shadcn registry. |
| [Radix Primitives](https://www.radix-ui.com/primitives) | React | Unstyled interaction primitives for dialogs, menus, popovers, tabs and other controls. |
| [React Aria](https://react-aria.adobe.com/) | React | Accessible primitives for collections, date pickers, overlays and complex keyboard interactions. |
| [Headless UI](https://headlessui.com/) | React, Vue | Unstyled menus, listboxes, dialogs and related controls for a custom design system. |

## Styled component kits

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [Material UI (MUI)](https://mui.com/material-ui/) | React | Material Design components for forms, navigation, dialogs and app layouts. |
| [Ant Design](https://ant.design/) | React | Enterprise UI for data-heavy screens, with tables, forms and filters. |
| [Mantine](https://mantine.dev/) | React | Themed components, form helpers and hooks for dashboards and general app UI. |
| [Chakra UI](https://chakra-ui.com/) | React | Themeable components and composition APIs for apps with a token-based design system. |
| [HeroUI](https://heroui.com/) | React | Styled components for forms, menus, overlays and application UI. |
| [daisyUI](https://daisyui.com/) | Tailwind CSS | CSS classes and themes for pre-styled components across frontend frameworks. |
| [Nuxt UI](https://ui.nuxt.com/) | Vue, Nuxt, Tailwind CSS | Components for forms, tables, dashboards, and documentation or chat layouts. |
| [PrimeVue](https://primevue.dev/) | Vue | A broad suite for business applications, including data grids, forms and overlays. |

## Animated components and design registries

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [Aceternity UI](https://ui.aceternity.com/components) | React, Tailwind CSS | Motion-heavy marketing effects, backgrounds, cards and interactive previews. |
| [Magic UI](https://magicui.design/) | React, Tailwind CSS | Animated interface effects and marketing blocks, including text reveals and marquees. |
| [React Bits](https://reactbits.dev/) | React | Animated text, backgrounds and interaction effects with live previews. |
| [21st.dev](https://21st.dev/community/components) | Community registry | Broad collection of UI blocks and components. Verify the framework, dependencies and license for each entry. |

## AI chat and agent interfaces

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [assistant-ui](https://www.assistant-ui.com/) | React | Chat components and runtime integration for threads, composers, attachments and tool UI. |
| [AI Elements](https://ui.shadcn.com/docs/ai-elements) | React, shadcn/ui | Chat and agent UI components for prompts, messages, and showing tool activity. Use the current shadcn/ui docs. |
| [CopilotKit](https://docs.copilotkit.ai/) | React, Vue, Angular | Embedded or standalone AI chat with frontend actions, shared state and agent integration. Evaluate the runtime alongside the UI. |

## Design reference catalogs

Use the public previews to find layout, component behavior, or visual treatments. The linked inventories list named examples and their preview URLs.

- [Arc UI](ui-reference-index.md#arc-ui) for React dashboard components, charts and app patterns.
- [Bencho](ui-reference-index.md#bencho) for React gauges, tabs, status controls and micro-interactions.
- [Grainient](ui-reference-index.md#grainient) for named gradient collections, backgrounds and shaders.
- [HorizonX](ui-reference-index.md#horizonx) for dashboard templates, assistant UI and effects.
- [uberdesigner](ui-reference-index.md#uberdesigner) for app shells, widgets, navigation and templates.

## Focused packages

### UI components & primitives

| Task | Library |
| --- | --- |
| Unstyled, accessible UI components (dialogs, popovers, menus, selects…) | [base-ui](https://base-ui.com) |
| Command menus (⌘K palettes) | [cmdk](https://cmdk.paco.me) |
| Toasts / notifications | [Sonner](https://sonner.emilkowal.ski) |
| Agent plan preview and approval UI | Build with existing primitives using [Kobra Plan Card](component-sources.md#kobra-plan-card) as inspiration |
| One-time password / verification code inputs | [input-otp](https://input-otp.rodz.dev) |
| Customizable GUIs / control panels | [Leva](https://github.com/pmndrs/leva) — [dialkit](https://joshpuckett.me/dialkit) is an alternative |

### Motion & visuals

| Task | Library |
| --- | --- |
| General-purpose animation (springs, layout animations, enter/exit) | [motion](https://motion.dev) (Framer Motion) |
| Animated primitives for an existing React or Vue component stack | [Animate UI](component-sources.md#animate-ui) |
| Animating numbers (counters, prices, stats) | [NumberFlow](https://number-flow.barvian.me) |
| Animated text components | [torph](https://torph.lochie.me/) |
| 3D globes | [Cobe](https://cobe.vercel.app) |
| Dynamic OG images (HTML/CSS → SVG/PNG) | [Satori](https://github.com/vercel/satori) |
| Syntax highlighting | [shiki](https://shiki.style) |

Reach for motion when you need springs, layout animations, exit animations, or gesture-driven values. A simple hover or fade doesn't need it — plain CSS transitions are the right tool there.

### Charts

| Task | Library |
| --- | --- |
| Real-time / streaming charts | [Liveline](https://github.com/benjitaylor/liveline) |
| General charts (static or interactive dashboards) | [recharts](https://recharts.org) |

The split: if data points arrive live and the chart scrolls with time, use Liveline. Everything else is recharts.

### Interaction & performance

| Task | Library |
| --- | --- |
| Drag and drop | [dnd kit](https://dndkit.com) |
| Virtualization (long lists, large tables) | [Virtuoso](https://virtuoso.dev) |

### State & styling

| Task | Library |
| --- | --- |
| State management | [zustand](https://zustand.docs.pmnd.rs) |
| Constructing `className` strings conditionally | [clsx](https://github.com/lukeed/clsx) |
| Type-safe, variant-driven styling for Tailwind | [cva](https://cva.style) |
| Theme switching / dark mode (no flash on load) | [next-themes](https://github.com/pacocoursey/next-themes) |

The styling split: clsx for ad-hoc conditional classes; cva when a component has real variants (size, intent, state) that deserve a typed API. They compose — cva uses clsx-style inputs internally.
