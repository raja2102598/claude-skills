# UI reference index

Use the [component inventories](#component-inventories) to browse the names documented by each library. The tables below link to library catalogs, individual references and focused packages. See [Component sources](component-sources.md) for implementation guidance and [Curated UI libraries](libraries.md) for dependency selection. Use paid previews as design inspiration and check the applicable license before reusing code or assets.

## Components, demos and design guides

| Source | Reference | What to look for |
| --- | --- | --- |
| Accordee | [Accordee demo](https://demo.accordee.app/) | Business app shell with an AI assistant, agent builder and integrations catalog. |
| Animate UI | [Animate UI installation](https://animate-ui.com/docs/installation) | Framework and registry setup for animated primitives. |
| Animate UI | [Animate UI repository](https://github.com/imskyleen/animate-ui) | Source and license for animated UI primitives. |
| Animate UI | [Animate UI skill instructions](https://github.com/imskyleen/animate-ui/tree/main/skills/animate-ui) | Upstream workflow for selecting and integrating Animate UI components. |
| Arc UI | [Arc UI catalog](https://uiarc.dev/) | Animated React primitives, dashboard blocks and app patterns. Free and Pro entries. |
| Arc UI | [Arc UI Onboarding Checklist](https://uiarc.dev/components/onboarding-checklist) | Free React/shadcn workspace setup card with progress, expandable tasks, async actions and a hide control. Check the current license before reusing source. |
| Baobun Studio | [Agents Guidelines](https://baobun.studio/demo/agents/guidelines) | Design reference for agent interfaces. Consult the relevant guidance on the source. |
| beUI Pro | [beUI Pro catalog](https://pro.beui.dev/components) | Paid previews for chat composers, tool approvals, voice agents, agent plans and dashboards. |
| Claude Code Templates | [Senior Frontend](https://www.aitmpl.com/component/skills/development/senior-frontend) | Review reference for responsive layout, UI states, accessibility and browser checks. |
| Kobra | [Kobra Plan Card](https://kobra.systems/components/plan-card) | Paid preview for reviewing agent tasks and approving a plan. |
| Libraries.dev | [Libraries.dev Voice Position](https://libraries.dev/voice-position) | On-device iPhone model estimates speaker direction and rough distance from stereo microphone input. The SwiftUI kits are MIT and the model has separate terms. |
| Libraries.dev | [Libraries.dev Voice Ring](https://libraries.dev/voice-ring) | React and SwiftUI voice visualizer for listening, speaking and processing. The React preview can take a supplied audio level. |
| Marked | [Marked](https://marked.dev/) | Design reference. Inspect the relevant page before describing a pattern. |
| Rare UI | [Rare UI Fluid Orb](https://www.rareui.com/components/fluidorb) | Animated orb for assistant presence or a chat launcher. Pair the visual with an accessible button when it opens chat. |
| Rare UI | [Rare UI Inline AI Status](https://www.rareui.com/components/aistatus) | Inline status for thinking, researching, analyzing, writing, completion and errors, with optional details and elapsed time. |
| Rare UI | [Rare UI Streaming Response](https://www.rareui.com/components/streamingresponse) | Incremental Markdown reveal with stop, copy, retry and rating interactions. |
| Relay | [Relay Workflow OS demo](https://relay-workflow-os.vercel.app/) | Agent operations console with runs, timelines, workflows and human approvals. |
| UIStacks | [UIStacks components](https://uistacks.dev/components) | Component catalog reference. Inspect the relevant preview before adapting it. |
| Wensity UI | [Progressive Image Loading](https://ui.wensity.com/components/progressive-image-loading) | Aspect-ratio-preserving image placeholders and a transition when the image loads. |
| Wensity UI | [Wensity ChatGPT Orb](https://ui.wensity.com/components/chatgpt-orb) | Soft animated ink inside a circle. Reference for a compact assistant mark or launcher visual. |

## UI libraries and registries

### Headless primitives and source registries

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com/docs) | React, Tailwind CSS | Copy and customize component source in your repo. Start here if the project already uses a shadcn registry. |
| [Radix Primitives](https://www.radix-ui.com/primitives) | React | Unstyled interaction primitives for dialogs, menus, popovers, tabs and other controls. |
| [React Aria](https://react-aria.adobe.com/) | React | Accessible primitives for collections, date pickers, overlays and complex keyboard interactions. |
| [Headless UI](https://headlessui.com/) | React, Vue | Unstyled menus, listboxes, dialogs and related controls for a custom design system. |

### Styled component kits

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

### Animated components and design registries

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [Aceternity UI](https://ui.aceternity.com/components) | React, Tailwind CSS | Motion-heavy marketing effects, backgrounds, cards and interactive previews. |
| [Magic UI](https://magicui.design/) | React, Tailwind CSS | Animated interface effects and marketing blocks, including text reveals and marquees. |
| [React Bits](https://reactbits.dev/) | React | Animated text, backgrounds and interaction effects with live previews. |
| [21st.dev](https://21st.dev/community/components) | Community registry | Broad collection of UI blocks and components. Verify the framework, dependencies and license for each entry. |

### AI chat and agent interfaces

| Library or registry | Stack | When to look here |
| --- | --- | --- |
| [assistant-ui](https://www.assistant-ui.com/) | React | Chat components and runtime integration for threads, composers, attachments and tool UI. |
| [AI Elements](https://ui.shadcn.com/docs/ai-elements) | React, shadcn/ui | Chat and agent UI components for prompts, messages, and showing tool activity. Use the current shadcn/ui docs. |
| [CopilotKit](https://docs.copilotkit.ai/) | React, Vue, Angular | Embedded or standalone AI chat with frontend actions, shared state and agent integration. Evaluate the runtime alongside the UI. |

## Focused libraries by use case

| Library | What it covers |
| --- | --- |
| [base-ui](https://base-ui.com) | Accessible unstyled components such as dialogs and menus. |
| [cmdk](https://cmdk.paco.me) | Keyboard command palette. |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications. |
| [input-otp](https://input-otp.rodz.dev) | One-time password and verification inputs. |
| [Leva](https://github.com/pmndrs/leva) | Developer control panels. |
| [dialkit](https://joshpuckett.me/dialkit) | Alternative for adjustable control panels. |
| [motion](https://motion.dev) | Springs, layout transitions and gesture-driven animation. |
| [NumberFlow](https://number-flow.barvian.me) | Animated numbers, prices and counters. |
| [torph](https://torph.lochie.me/) | Animated text. |
| [Cobe](https://cobe.vercel.app) | 3D globe visualization. |
| [Satori](https://github.com/vercel/satori) | Render HTML and CSS into social preview graphics. |
| [shiki](https://shiki.style) | Syntax highlighting. |
| [Liveline](https://github.com/benjitaylor/liveline) | Live time-series charts. |
| [recharts](https://recharts.org) | General-purpose React charts. |
| [dnd kit](https://dndkit.com) | Drag and drop. |
| [Virtuoso](https://virtuoso.dev) | Virtualized lists and tables. |
| [zustand](https://zustand.docs.pmnd.rs) | Application state management. |
| [clsx](https://github.com/lukeed/clsx) | Conditional class names. |
| [cva](https://cva.style) | Typed styling variants. |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme switching. |

## Component inventories

Public catalog snapshot checked on 18 November 2026. Component families are listed once per documented page or registry entry. Subcomponents, release variants, raw icons and internal implementation exports are outside the snapshot unless they have their own catalog entry. For paid libraries, the lists cover the public previews and use those previews as design inspiration. Check the source for changes and the current reuse terms.

### shadcn/ui

66 entries. Component families across the registry. Base UI, Radix and React Aria implementations can share a name.

- [Accordion](https://ui.shadcn.com/docs/components/base/accordion), [Alert](https://ui.shadcn.com/docs/components/base/alert), [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog), [Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio), [Attachment](https://ui.shadcn.com/docs/components/base/attachment)
- [Avatar](https://ui.shadcn.com/docs/components/base/avatar), [Badge](https://ui.shadcn.com/docs/components/base/badge), [Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb), [Bubble](https://ui.shadcn.com/docs/components/base/bubble), [Button](https://ui.shadcn.com/docs/components/base/button)
- [Button Group](https://ui.shadcn.com/docs/components/base/button-group), [Calendar](https://ui.shadcn.com/docs/components/base/calendar), [Card](https://ui.shadcn.com/docs/components/base/card), [Carousel](https://ui.shadcn.com/docs/components/base/carousel), [Chart](https://ui.shadcn.com/docs/components/base/chart)
- [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox), [Code Block](https://ui.shadcn.com/docs/components/base/code-block), [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible), [Combobox](https://ui.shadcn.com/docs/components/base/combobox), [Command](https://ui.shadcn.com/docs/components/base/command)
- [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu), [Data Table](https://ui.shadcn.com/docs/components/base/data-table), [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker), [Dialog](https://ui.shadcn.com/docs/components/base/dialog), [Direction](https://ui.shadcn.com/docs/components/base/direction)
- [Drawer](https://ui.shadcn.com/docs/components/base/drawer), [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu), [Empty](https://ui.shadcn.com/docs/components/base/empty), [Field](https://ui.shadcn.com/docs/components/base/field), [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)
- [Input](https://ui.shadcn.com/docs/components/base/input), [Input Group](https://ui.shadcn.com/docs/components/base/input-group), [Input OTP](https://ui.shadcn.com/docs/components/base/input-otp), [Item](https://ui.shadcn.com/docs/components/base/item), [Kbd](https://ui.shadcn.com/docs/components/base/kbd)
- [Label](https://ui.shadcn.com/docs/components/base/label), [Marker](https://ui.shadcn.com/docs/components/base/marker), [Menubar](https://ui.shadcn.com/docs/components/base/menubar), [Message](https://ui.shadcn.com/docs/components/base/message), [Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller)
- [Native Select](https://ui.shadcn.com/docs/components/base/native-select), [Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu), [Pagination](https://ui.shadcn.com/docs/components/base/pagination), [Popover](https://ui.shadcn.com/docs/components/base/popover), [Progress](https://ui.shadcn.com/docs/components/base/progress)
- [Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire), [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group), [Resizable](https://ui.shadcn.com/docs/components/base/resizable), [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area), [Select](https://ui.shadcn.com/docs/components/base/select)
- [Separator](https://ui.shadcn.com/docs/components/base/separator), [Sheet](https://ui.shadcn.com/docs/components/base/sheet), [Sidebar](https://ui.shadcn.com/docs/components/base/sidebar), [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton), [Slider](https://ui.shadcn.com/docs/components/base/slider)
- [Spinner](https://ui.shadcn.com/docs/components/base/spinner), [Switch](https://ui.shadcn.com/docs/components/base/switch), [Table](https://ui.shadcn.com/docs/components/base/table), [Tabs](https://ui.shadcn.com/docs/components/base/tabs), [Textarea](https://ui.shadcn.com/docs/components/base/textarea)
- [Toast](https://ui.shadcn.com/docs/components/base/toast), [Toggle](https://ui.shadcn.com/docs/components/base/toggle), [Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group), [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip), [Trace](https://ui.shadcn.com/docs/components/base/trace)
- [Typography](https://ui.shadcn.com/docs/components/base/typography)

### Radix Primitives

35 entries. Component and utility pages from the official Primitives docs.

- [Accessible Icon](https://www.radix-ui.com/primitives/docs/utilities/accessible-icon), [Accordion](https://www.radix-ui.com/primitives/docs/components/accordion), [Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog), [Aspect Ratio](https://www.radix-ui.com/primitives/docs/components/aspect-ratio), [Avatar](https://www.radix-ui.com/primitives/docs/components/avatar)
- [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox), [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible), [Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu), [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [Direction Provider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider)
- [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu), [Form](https://www.radix-ui.com/primitives/docs/components/form), [Hover Card](https://www.radix-ui.com/primitives/docs/components/hover-card), [Label](https://www.radix-ui.com/primitives/docs/components/label), [Menubar](https://www.radix-ui.com/primitives/docs/components/menubar)
- [Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu), [One-Time Password Field](https://www.radix-ui.com/primitives/docs/components/one-time-password-field), [Password Toggle Field](https://www.radix-ui.com/primitives/docs/components/password-toggle-field), [Popover](https://www.radix-ui.com/primitives/docs/components/popover), [Portal](https://www.radix-ui.com/primitives/docs/utilities/portal)
- [Progress](https://www.radix-ui.com/primitives/docs/components/progress), [Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group), [Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area), [Select](https://www.radix-ui.com/primitives/docs/components/select), [Separator](https://www.radix-ui.com/primitives/docs/components/separator)
- [Slider](https://www.radix-ui.com/primitives/docs/components/slider), [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot), [Switch](https://www.radix-ui.com/primitives/docs/components/switch), [Tabs](https://www.radix-ui.com/primitives/docs/components/tabs), [Toast](https://www.radix-ui.com/primitives/docs/components/toast)
- [Toggle](https://www.radix-ui.com/primitives/docs/components/toggle), [Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group), [Toolbar](https://www.radix-ui.com/primitives/docs/components/toolbar), [Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip), [Visually Hidden](https://www.radix-ui.com/primitives/docs/utilities/visually-hidden)

### React Aria

55 entries. The documented React Aria Components catalog.

- [Autocomplete](https://react-aria.adobe.com/Autocomplete), [Breadcrumbs](https://react-aria.adobe.com/Breadcrumbs), [Button](https://react-aria.adobe.com/Button), [Calendar](https://react-aria.adobe.com/Calendar), [Checkbox](https://react-aria.adobe.com/Checkbox)
- [CheckboxGroup](https://react-aria.adobe.com/CheckboxGroup), [ColorArea](https://react-aria.adobe.com/ColorArea), [ColorField](https://react-aria.adobe.com/ColorField), [ColorPicker](https://react-aria.adobe.com/ColorPicker), [ColorSlider](https://react-aria.adobe.com/ColorSlider)
- [ColorSwatch](https://react-aria.adobe.com/ColorSwatch), [ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker), [ColorWheel](https://react-aria.adobe.com/ColorWheel), [ComboBox](https://react-aria.adobe.com/ComboBox), [DateField](https://react-aria.adobe.com/DateField)
- [DatePicker](https://react-aria.adobe.com/DatePicker), [DateRangePicker](https://react-aria.adobe.com/DateRangePicker), [Disclosure](https://react-aria.adobe.com/Disclosure), [DisclosureGroup](https://react-aria.adobe.com/DisclosureGroup), [DropZone](https://react-aria.adobe.com/DropZone)
- [FileTrigger](https://react-aria.adobe.com/FileTrigger), [Form](https://react-aria.adobe.com/Form), [GridList](https://react-aria.adobe.com/GridList), [Group](https://react-aria.adobe.com/Group), [Link](https://react-aria.adobe.com/Link)
- [ListBox](https://react-aria.adobe.com/ListBox), [Menu](https://react-aria.adobe.com/Menu), [Meter](https://react-aria.adobe.com/Meter), [Modal](https://react-aria.adobe.com/Modal), [NavigationTree](https://react-aria.adobe.com/NavigationTree)
- [NumberField](https://react-aria.adobe.com/NumberField), [Popover](https://react-aria.adobe.com/Popover), [PreviewTrigger](https://react-aria.adobe.com/PreviewTrigger), [ProgressBar](https://react-aria.adobe.com/ProgressBar), [RadioGroup](https://react-aria.adobe.com/RadioGroup)
- [RangeCalendar](https://react-aria.adobe.com/RangeCalendar), [SearchField](https://react-aria.adobe.com/SearchField), [Select](https://react-aria.adobe.com/Select), [Separator](https://react-aria.adobe.com/Separator), [Sheet](https://react-aria.adobe.com/Sheet)
- [Slider](https://react-aria.adobe.com/Slider), [Switch](https://react-aria.adobe.com/Switch), [Table](https://react-aria.adobe.com/Table), [Tabs](https://react-aria.adobe.com/Tabs), [TagGroup](https://react-aria.adobe.com/TagGroup)
- [TextField](https://react-aria.adobe.com/TextField), [TimeField](https://react-aria.adobe.com/TimeField), [Toast](https://react-aria.adobe.com/Toast), [ToggleButton](https://react-aria.adobe.com/ToggleButton), [ToggleButtonGroup](https://react-aria.adobe.com/ToggleButtonGroup)
- [TokenField](https://react-aria.adobe.com/TokenField), [Toolbar](https://react-aria.adobe.com/Toolbar), [Tooltip](https://react-aria.adobe.com/Tooltip), [Tree](https://react-aria.adobe.com/Tree), [Virtualizer](https://react-aria.adobe.com/Virtualizer)

### Headless UI

16 entries. React component catalog.

- [Button](https://headlessui.com/react/button), [Checkbox](https://headlessui.com/react/checkbox), [Combobox](https://headlessui.com/react/combobox), [Dialog](https://headlessui.com/react/dialog), [Disclosure](https://headlessui.com/react/disclosure)
- [Dropdown Menu](https://headlessui.com/react/menu), [Fieldset](https://headlessui.com/react/fieldset), [Input](https://headlessui.com/react/input), [Listbox](https://headlessui.com/react/listbox), [Popover](https://headlessui.com/react/popover)
- [Radio Group](https://headlessui.com/react/radio-group), [Select](https://headlessui.com/react/select), [Switch](https://headlessui.com/react/switch), [Tabs](https://headlessui.com/react/tabs), [Textarea](https://headlessui.com/react/textarea)
- [Transition](https://headlessui.com/react/transition)

### Headless UI for Vue

10 entries. The published Vue v1 component catalog.

- [Combobox (Autocomplete)](https://headlessui.com/v1/vue/combobox), [Dialog (Modal)](https://headlessui.com/v1/vue/dialog), [Disclosure](https://headlessui.com/v1/vue/disclosure), [Listbox (Select)](https://headlessui.com/v1/vue/listbox), [Menu (Dropdown)](https://headlessui.com/v1/vue/menu)
- [Popover](https://headlessui.com/v1/vue/popover), [Radio Group](https://headlessui.com/v1/vue/radio-group), [Switch (Toggle)](https://headlessui.com/v1/vue/switch), [Tabs](https://headlessui.com/v1/vue/tabs), [Transition](https://headlessui.com/v1/vue/transition)

### Material UI (MUI)

59 entries. Material UI core. MUI X is a separate library.

- [Accordion](https://mui.com/material-ui/react-accordion/), [Alert](https://mui.com/material-ui/react-alert/), [App Bar](https://mui.com/material-ui/react-app-bar/), [Autocomplete](https://mui.com/material-ui/react-autocomplete/), [Avatar](https://mui.com/material-ui/react-avatar/)
- [Backdrop](https://mui.com/material-ui/react-backdrop/), [Badge](https://mui.com/material-ui/react-badge/), [Bottom Navigation](https://mui.com/material-ui/react-bottom-navigation/), [Box](https://mui.com/material-ui/react-box/), [Breadcrumbs](https://mui.com/material-ui/react-breadcrumbs/)
- [Button](https://mui.com/material-ui/react-button/), [Button Group](https://mui.com/material-ui/react-button-group/), [Card](https://mui.com/material-ui/react-card/), [Checkbox](https://mui.com/material-ui/react-checkbox/), [Chip](https://mui.com/material-ui/react-chip/)
- [Click-Away Listener](https://mui.com/material-ui/react-click-away-listener/), [Container](https://mui.com/material-ui/react-container/), [CSS Baseline](https://mui.com/material-ui/react-css-baseline/), [Dialog](https://mui.com/material-ui/react-dialog/), [Divider](https://mui.com/material-ui/react-divider/)
- [Drawer](https://mui.com/material-ui/react-drawer/), [Floating Action Button](https://mui.com/material-ui/react-floating-action-button/), [Grid](https://mui.com/material-ui/react-grid/), [Image List](https://mui.com/material-ui/react-image-list/), [InitColorSchemeScript](https://mui.com/material-ui/react-init-color-scheme-script/)
- [Link](https://mui.com/material-ui/react-link/), [List](https://mui.com/material-ui/react-list/), [Masonry](https://mui.com/material-ui/react-masonry/), [Menu](https://mui.com/material-ui/react-menu/), [MenubarNew](https://mui.com/material-ui/react-menubar/)
- [Modal](https://mui.com/material-ui/react-modal/), [No SSR](https://mui.com/material-ui/react-no-ssr/), [Number FieldNew](https://mui.com/material-ui/react-number-field/), [Pagination](https://mui.com/material-ui/react-pagination/), [Paper](https://mui.com/material-ui/react-paper/)
- [Popover](https://mui.com/material-ui/react-popover/), [Popper](https://mui.com/material-ui/react-popper/), [Portal](https://mui.com/material-ui/react-portal/), [Progress](https://mui.com/material-ui/react-progress/), [Radio Group](https://mui.com/material-ui/react-radio-button/)
- [Rating](https://mui.com/material-ui/react-rating/), [Select](https://mui.com/material-ui/react-select/), [Skeleton](https://mui.com/material-ui/react-skeleton/), [Slider](https://mui.com/material-ui/react-slider/), [Snackbar](https://mui.com/material-ui/react-snackbar/)
- [Speed Dial](https://mui.com/material-ui/react-speed-dial/), [Stack](https://mui.com/material-ui/react-stack/), [Stepper](https://mui.com/material-ui/react-stepper/), [Switch](https://mui.com/material-ui/react-switch/), [Table](https://mui.com/material-ui/react-table/)
- [Tabs](https://mui.com/material-ui/react-tabs/), [Text Field](https://mui.com/material-ui/react-text-field/), [Textarea Autosize](https://mui.com/material-ui/react-textarea-autosize/), [Timeline](https://mui.com/material-ui/react-timeline/), [Toggle Button](https://mui.com/material-ui/react-toggle-button/)
- [Tooltip](https://mui.com/material-ui/react-tooltip/), [Transfer List](https://mui.com/material-ui/react-transfer-list/), [Typography](https://mui.com/material-ui/react-typography/), [useMediaQuery](https://mui.com/material-ui/react-use-media-query/)

### Ant Design

74 entries. Component pages in the React docs.

- [Affix](https://ant.design/components/affix), [Alert](https://ant.design/components/alert), [Anchor](https://ant.design/components/anchor), [App](https://ant.design/components/app), [AutoComplete](https://ant.design/components/auto-complete)
- [Avatar](https://ant.design/components/avatar), [Badge](https://ant.design/components/badge), [BorderBeam6.4.0](https://ant.design/components/border-beam), [Breadcrumb](https://ant.design/components/breadcrumb), [Button](https://ant.design/components/button)
- [Calendar](https://ant.design/components/calendar), [Card](https://ant.design/components/card), [Carousel](https://ant.design/components/carousel), [Cascader](https://ant.design/components/cascader), [Checkbox](https://ant.design/components/checkbox)
- [Collapse](https://ant.design/components/collapse), [ColorPicker](https://ant.design/components/color-picker), [ConfigProvider](https://ant.design/components/config-provider), [DatePicker](https://ant.design/components/date-picker), [Descriptions](https://ant.design/components/descriptions)
- [Divider](https://ant.design/components/divider), [Drawer](https://ant.design/components/drawer), [Dropdown](https://ant.design/components/dropdown), [EditableProTable](https://ant.design/components/editable-table), [Empty](https://ant.design/components/empty)
- [Flex](https://ant.design/components/flex), [FloatButton](https://ant.design/components/float-button), [Form](https://ant.design/components/form), [Grid](https://ant.design/components/grid), [Icon](https://ant.design/components/icon)
- [Image](https://ant.design/components/image), [Input](https://ant.design/components/input), [InputNumber](https://ant.design/components/input-number), [Layout](https://ant.design/components/layout), [ListDEPRECATED](https://ant.design/components/list)
- [Listy6.6.0](https://ant.design/components/listy), [Masonry6.0.0](https://ant.design/components/masonry), [Mentions](https://ant.design/components/mentions), [Menu](https://ant.design/components/menu), [Message](https://ant.design/components/message)
- [Modal](https://ant.design/components/modal), [Notification](https://ant.design/components/notification), [Pagination](https://ant.design/components/pagination), [Popconfirm](https://ant.design/components/popconfirm), [Popover](https://ant.design/components/popover)
- [Progress](https://ant.design/components/progress), [QRCode](https://ant.design/components/qr-code), [Radio](https://ant.design/components/radio), [Rate](https://ant.design/components/rate), [Result](https://ant.design/components/result)
- [Segmented](https://ant.design/components/segmented), [Select](https://ant.design/components/select), [Skeleton](https://ant.design/components/skeleton), [Slider](https://ant.design/components/slider), [Space](https://ant.design/components/space)
- [Spin](https://ant.design/components/spin), [Splitter](https://ant.design/components/splitter), [Statistic](https://ant.design/components/statistic), [Steps](https://ant.design/components/steps), [Switch](https://ant.design/components/switch)
- [Table](https://ant.design/components/table), [Tabs](https://ant.design/components/tabs), [Tag](https://ant.design/components/tag), [Timeline](https://ant.design/components/timeline), [TimePicker](https://ant.design/components/time-picker)
- [Tooltip](https://ant.design/components/tooltip), [Tour](https://ant.design/components/tour), [Transfer](https://ant.design/components/transfer), [Tree](https://ant.design/components/tree), [TreeSelect](https://ant.design/components/tree-select)
- [Typography](https://ant.design/components/typography), [Upload](https://ant.design/components/upload), [Util](https://ant.design/components/_util), [Watermark](https://ant.design/components/watermark)

### Mantine

176 entries. Core UI, dates, charts and official UI extensions covered by Mantine’s docs.

- [Accordion](https://mantine.dev/core/accordion/), [ActionBar](https://mantine.dev/core/action-bar/), [ActionIcon](https://mantine.dev/core/action-icon/), [Affix](https://mantine.dev/core/affix/), [Alert](https://mantine.dev/core/alert/)
- [AlphaSlider](https://mantine.dev/core/alpha-slider/), [Anchor](https://mantine.dev/core/anchor/), [AngleSlider](https://mantine.dev/core/angle-slider/), [AppShell](https://mantine.dev/core/app-shell/), [AreaChart](https://mantine.dev/charts/area-chart/)
- [AspectRatio](https://mantine.dev/core/aspect-ratio/), [Autocomplete](https://mantine.dev/core/autocomplete/), [Avatar](https://mantine.dev/core/avatar/), [BackgroundImage](https://mantine.dev/core/background-image/), [Badge](https://mantine.dev/core/badge/)
- [BarChart](https://mantine.dev/charts/bar-chart/), [BarsList](https://mantine.dev/charts/bars-list/), [Blockquote](https://mantine.dev/core/blockquote/), [Box](https://mantine.dev/core/box/), [Breadcrumbs](https://mantine.dev/core/breadcrumbs/)
- [BubbleChart](https://mantine.dev/charts/bubble-chart/), [BulletChart](https://mantine.dev/charts/bullet-chart/), [Burger](https://mantine.dev/core/burger/), [Button](https://mantine.dev/core/button/), [Calendar](https://mantine.dev/dates/calendar/)
- [CandlestickChart](https://mantine.dev/charts/candlestick-chart/), [Card](https://mantine.dev/core/card/), [Carousel](https://mantine.dev/x/carousel/), [Cascader](https://mantine.dev/core/cascader/), [Center](https://mantine.dev/core/center/)
- [Checkbox](https://mantine.dev/core/checkbox/), [Chip](https://mantine.dev/core/chip/), [CloseButton](https://mantine.dev/core/close-button/), [Code](https://mantine.dev/core/code/), [Code Highlight](https://mantine.dev/x/code-highlight/)
- [CodeHighlight](https://mantine.dev/code-highlight/code-highlight/), [Collapse](https://mantine.dev/core/collapse/), [ColorInput](https://mantine.dev/core/color-input/), [ColorPicker](https://mantine.dev/core/color-picker/), [ColorSwatch](https://mantine.dev/core/color-swatch/)
- [Combobox](https://mantine.dev/core/combobox/), [ComboboxPopover](https://mantine.dev/core/combobox-popover/), [CompositeChart](https://mantine.dev/charts/composite-chart/), [Container](https://mantine.dev/core/container/), [CopyButton](https://mantine.dev/core/copy-button/)
- [DataList](https://mantine.dev/core/data-list/), [DateInput](https://mantine.dev/dates/date-input/), [DatePicker](https://mantine.dev/dates/date-picker/), [DatePickerInput](https://mantine.dev/dates/date-picker-input/), [DateTimePicker](https://mantine.dev/dates/date-time-picker/)
- [Dialog](https://mantine.dev/core/dialog/), [Diff](https://mantine.dev/code-highlight/diff/), [Divider](https://mantine.dev/core/divider/), [DonutChart](https://mantine.dev/charts/donut-chart/), [Drawer](https://mantine.dev/core/drawer/)
- [Dropzone](https://mantine.dev/x/dropzone/), [EmptyState](https://mantine.dev/core/empty-state/), [Fieldset](https://mantine.dev/core/fieldset/), [FileButton](https://mantine.dev/core/file-button/), [FileInput](https://mantine.dev/core/file-input/)
- [Flex](https://mantine.dev/core/flex/), [FloatingIndicator](https://mantine.dev/core/floating-indicator/), [FloatingWindow](https://mantine.dev/core/floating-window/), [FocusTrap](https://mantine.dev/core/focus-trap/), [FunnelChart](https://mantine.dev/charts/funnel-chart/)
- [GaugeChart](https://mantine.dev/charts/gauge-chart/), [Grid](https://mantine.dev/core/grid/), [Group](https://mantine.dev/core/group/), [Heatmap](https://mantine.dev/charts/heatmap/), [Highlight](https://mantine.dev/core/highlight/)
- [HoverCard](https://mantine.dev/core/hover-card/), [HueSlider](https://mantine.dev/core/hue-slider/), [Image](https://mantine.dev/core/image/), [Indicator](https://mantine.dev/core/indicator/), [InlineDateTimePicker](https://mantine.dev/dates/inline-date-time-picker/)
- [Input](https://mantine.dev/core/input/), [JsonInput](https://mantine.dev/core/json-input/), [JsonViewer](https://mantine.dev/code-highlight/json-viewer/), [Kbd](https://mantine.dev/core/kbd/), [LineChart](https://mantine.dev/charts/line-chart/)
- [List](https://mantine.dev/core/list/), [Loader](https://mantine.dev/core/loader/), [LoadingOverlay](https://mantine.dev/core/loading-overlay/), [Mark](https://mantine.dev/core/mark/), [Marquee](https://mantine.dev/core/marquee/)
- [MaskedDateInput](https://mantine.dev/dates/masked-date-input/), [MaskInput](https://mantine.dev/core/mask-input/), [MatrixChart](https://mantine.dev/charts/matrix-chart/), [Mentions](https://mantine.dev/core/mentions/), [Menu](https://mantine.dev/core/menu/)
- [Menubar](https://mantine.dev/core/menubar/), [MiniCalendar](https://mantine.dev/dates/mini-calendar/), [Modal](https://mantine.dev/core/modal/), [Modals](https://mantine.dev/x/modals/), [MonthPicker](https://mantine.dev/dates/month-picker/)
- [MonthPickerInput](https://mantine.dev/dates/month-picker-input/), [MultiSelect](https://mantine.dev/core/multi-select/), [NativeSelect](https://mantine.dev/core/native-select/), [Navigation Progress](https://mantine.dev/x/nprogress/), [NavLink](https://mantine.dev/core/nav-link/)
- [Notification](https://mantine.dev/core/notification/), [Notifications](https://mantine.dev/x/notifications/), [NumberFormatter](https://mantine.dev/core/number-formatter/), [NumberInput](https://mantine.dev/core/number-input/), [OverflowList](https://mantine.dev/core/overflow-list/)
- [Overlay](https://mantine.dev/core/overlay/), [Pagination](https://mantine.dev/core/pagination/), [Paper](https://mantine.dev/core/paper/), [PasswordInput](https://mantine.dev/core/password-input/), [PhoneInput](https://mantine.dev/core/phone-input/)
- [PieChart](https://mantine.dev/charts/pie-chart/), [Pill](https://mantine.dev/core/pill/), [PillsInput](https://mantine.dev/core/pills-input/), [PinInput](https://mantine.dev/core/pin-input/), [Popover](https://mantine.dev/core/popover/)
- [Portal](https://mantine.dev/core/portal/), [Progress](https://mantine.dev/core/progress/), [QuarterPicker](https://mantine.dev/dates/quarter-picker/), [QuarterPickerInput](https://mantine.dev/dates/quarter-picker-input/), [RadarChart](https://mantine.dev/charts/radar-chart/)
- [RadialBarChart](https://mantine.dev/charts/radial-bar-chart/), [Radio](https://mantine.dev/core/radio/), [RangeSlider](https://mantine.dev/core/range-slider/), [Rating](https://mantine.dev/core/rating/), [Rich Text Editor](https://mantine.dev/x/tiptap/)
- [RingProgress](https://mantine.dev/core/ring-progress/), [RollingNumber](https://mantine.dev/core/rolling-number/), [SankeyChart](https://mantine.dev/charts/sankey-chart/), [ScatterChart](https://mantine.dev/charts/scatter-chart/), [ScrollArea](https://mantine.dev/core/scroll-area/)
- [Scroller](https://mantine.dev/core/scroller/), [SegmentedControl](https://mantine.dev/core/segmented-control/), [Select](https://mantine.dev/core/select/), [SemiCircleProgress](https://mantine.dev/core/semi-circle-progress/), [SimpleGrid](https://mantine.dev/core/simple-grid/)
- [Skeleton](https://mantine.dev/core/skeleton/), [Slider](https://mantine.dev/core/slider/), [Space](https://mantine.dev/core/space/), [Sparkline](https://mantine.dev/charts/sparkline/), [Splitter](https://mantine.dev/core/splitter/)
- [Spoiler](https://mantine.dev/core/spoiler/), [Spotlight](https://mantine.dev/x/spotlight/), [Stack](https://mantine.dev/core/stack/), [Stepper](https://mantine.dev/core/stepper/), [SunburstChart](https://mantine.dev/charts/sunburst-chart/)
- [Switch](https://mantine.dev/core/switch/), [Table](https://mantine.dev/core/table/), [TableOfContents](https://mantine.dev/core/table-of-contents/), [Tabs](https://mantine.dev/core/tabs/), [TagsInput](https://mantine.dev/core/tags-input/)
- [Text](https://mantine.dev/core/text/), [Textarea](https://mantine.dev/core/textarea/), [TextInput](https://mantine.dev/core/text-input/), [ThemeIcon](https://mantine.dev/core/theme-icon/), [TimeGrid](https://mantine.dev/dates/time-grid/)
- [TimeInput](https://mantine.dev/dates/time-input/), [Timeline](https://mantine.dev/core/timeline/), [TimePicker](https://mantine.dev/dates/time-picker/), [TimeValue](https://mantine.dev/dates/time-value/), [Title](https://mantine.dev/core/title/)
- [Toggle](https://mantine.dev/core/toggle/), [Toolbar](https://mantine.dev/core/toolbar/), [Tooltip](https://mantine.dev/core/tooltip/), [Tour](https://mantine.dev/core/tour/), [Transition](https://mantine.dev/core/transition/)
- [Tree](https://mantine.dev/core/tree/), [Treemap](https://mantine.dev/charts/treemap/), [TreeSelect](https://mantine.dev/core/tree-select/), [Typography](https://mantine.dev/core/typography/), [UnstyledButton](https://mantine.dev/core/unstyled-button/)
- [VisuallyHidden](https://mantine.dev/core/visually-hidden/), [WaffleChart](https://mantine.dev/charts/waffle-chart/), [WeekPicker](https://mantine.dev/dates/week-picker/), [WeekPickerInput](https://mantine.dev/dates/week-picker-input/), [YearPicker](https://mantine.dev/dates/year-picker/)
- [YearPickerInput](https://mantine.dev/dates/year-picker-input/)

### Chakra UI

115 entries. Component pages, including layout and utility components.

- [Accordion](https://chakra-ui.com/docs/components/accordion), [Action Bar](https://chakra-ui.com/docs/components/action-bar), [Alert](https://chakra-ui.com/docs/components/alert), [Aspect Ratio](https://chakra-ui.com/docs/components/aspect-ratio), [Avatar](https://chakra-ui.com/docs/components/avatar)
- [Badge](https://chakra-ui.com/docs/components/badge), [Bleed](https://chakra-ui.com/docs/components/bleed), [Blockquote](https://chakra-ui.com/docs/components/blockquote), [Box](https://chakra-ui.com/docs/components/box), [Breadcrumb](https://chakra-ui.com/docs/components/breadcrumb)
- [Button](https://chakra-ui.com/docs/components/button), [Calendar](https://chakra-ui.com/docs/components/calendar), [Card](https://chakra-ui.com/docs/components/card), [Carousel](https://chakra-ui.com/docs/components/carousel), [Center](https://chakra-ui.com/docs/components/center)
- [Center (Absolute)](https://chakra-ui.com/docs/components/absolute-center), [Checkbox](https://chakra-ui.com/docs/components/checkbox), [Checkbox Card](https://chakra-ui.com/docs/components/checkbox-card), [Checkmark](https://chakra-ui.com/docs/components/checkmark), [ClientOnly](https://chakra-ui.com/docs/components/client-only)
- [Clipboard](https://chakra-ui.com/docs/components/clipboard), [Close Button](https://chakra-ui.com/docs/components/close-button), [Code](https://chakra-ui.com/docs/components/code), [Code Block](https://chakra-ui.com/docs/components/code-block), [Collapsible](https://chakra-ui.com/docs/components/collapsible)
- [Color Picker](https://chakra-ui.com/docs/components/color-picker), [Color Swatch](https://chakra-ui.com/docs/components/color-swatch), [Combobox](https://chakra-ui.com/docs/components/combobox), [CommandUsed to build searchable command menus, search dialogs, and pickers.](https://chakra-ui.com/docs/components/command), [Container](https://chakra-ui.com/docs/components/container)
- [Data List](https://chakra-ui.com/docs/components/data-list), [Date Input](https://chakra-ui.com/docs/components/date-input), [Date Picker](https://chakra-ui.com/docs/components/date-picker), [Dialog](https://chakra-ui.com/docs/components/dialog), [Download Trigger](https://chakra-ui.com/docs/components/download-trigger)
- [Drawer](https://chakra-ui.com/docs/components/drawer), [Editable](https://chakra-ui.com/docs/components/editable), [Em](https://chakra-ui.com/docs/components/em), [Empty State](https://chakra-ui.com/docs/components/empty-state), [EnvironmentProvider](https://chakra-ui.com/docs/components/environment-provider)
- [Field](https://chakra-ui.com/docs/components/field), [Fieldset](https://chakra-ui.com/docs/components/fieldset), [File Upload](https://chakra-ui.com/docs/components/file-upload), [Flex](https://chakra-ui.com/docs/components/flex), [Float](https://chakra-ui.com/docs/components/float)
- [Floating Panel](https://chakra-ui.com/docs/components/floating-panel), [For](https://chakra-ui.com/docs/components/for), [FormatByte](https://chakra-ui.com/docs/components/format-byte), [FormatNumber](https://chakra-ui.com/docs/components/format-number), [Grid](https://chakra-ui.com/docs/components/grid)
- [Group](https://chakra-ui.com/docs/components/group), [Heading](https://chakra-ui.com/docs/components/heading), [Highlight](https://chakra-ui.com/docs/components/highlight), [Hover Card](https://chakra-ui.com/docs/components/hover-card), [Icon](https://chakra-ui.com/docs/components/icon)
- [Icon Button](https://chakra-ui.com/docs/components/icon-button), [Image](https://chakra-ui.com/docs/components/image), [Input](https://chakra-ui.com/docs/components/input), [Kbd](https://chakra-ui.com/docs/components/kbd), [Link](https://chakra-ui.com/docs/components/link)
- [Link Overlay](https://chakra-ui.com/docs/components/link-overlay), [List](https://chakra-ui.com/docs/components/list), [Listbox](https://chakra-ui.com/docs/components/listbox), [LocaleProvider](https://chakra-ui.com/docs/components/locale-provider), [Mark](https://chakra-ui.com/docs/components/mark)
- [Marquee](https://chakra-ui.com/docs/components/marquee), [Menu](https://chakra-ui.com/docs/components/menu), [Number Input](https://chakra-ui.com/docs/components/number-input), [Overlay Manager](https://chakra-ui.com/docs/components/overlay-manager), [Pagination](https://chakra-ui.com/docs/components/pagination)
- [Password Input](https://chakra-ui.com/docs/components/password-input), [Pin Input](https://chakra-ui.com/docs/components/pin-input), [Popover](https://chakra-ui.com/docs/components/popover), [Portal](https://chakra-ui.com/docs/components/portal), [Presence](https://chakra-ui.com/docs/components/presence)
- [Progress](https://chakra-ui.com/docs/components/progress), [Progress Circle](https://chakra-ui.com/docs/components/progress-circle), [Prose](https://chakra-ui.com/docs/components/prose), [QR Code](https://chakra-ui.com/docs/components/qr-code), [Radio](https://chakra-ui.com/docs/components/radio)
- [Radio Card](https://chakra-ui.com/docs/components/radio-card), [Radiomark](https://chakra-ui.com/docs/components/radiomark), [Rating](https://chakra-ui.com/docs/components/rating), [Rich Text Editor](https://chakra-ui.com/docs/components/rich-text-editor), [Scroll Area](https://chakra-ui.com/docs/components/scroll-area)
- [Segmented Control](https://chakra-ui.com/docs/components/segmented-control), [Select](https://chakra-ui.com/docs/components/select), [Select (Native)](https://chakra-ui.com/docs/components/native-select), [Separator](https://chakra-ui.com/docs/components/separator), [Show](https://chakra-ui.com/docs/components/show)
- [SimpleGrid](https://chakra-ui.com/docs/components/simple-grid), [Skeleton](https://chakra-ui.com/docs/components/skeleton), [Skip Nav](https://chakra-ui.com/docs/components/skip-nav), [Slider](https://chakra-ui.com/docs/components/slider), [Spinner](https://chakra-ui.com/docs/components/spinner)
- [Splitter](https://chakra-ui.com/docs/components/splitter), [Stack](https://chakra-ui.com/docs/components/stack), [Stat](https://chakra-ui.com/docs/components/stat), [Status](https://chakra-ui.com/docs/components/status), [Steps](https://chakra-ui.com/docs/components/steps)
- [Switch](https://chakra-ui.com/docs/components/switch), [Table](https://chakra-ui.com/docs/components/table), [Tabs](https://chakra-ui.com/docs/components/tabs), [Tag](https://chakra-ui.com/docs/components/tag), [Tags Input](https://chakra-ui.com/docs/components/tags-input)
- [Text](https://chakra-ui.com/docs/components/text), [Textarea](https://chakra-ui.com/docs/components/textarea), [Theme](https://chakra-ui.com/docs/components/theme), [Timeline](https://chakra-ui.com/docs/components/timeline), [Toast](https://chakra-ui.com/docs/components/toast)
- [Toggle Tip](https://chakra-ui.com/docs/components/toggle-tip), [Tooltip](https://chakra-ui.com/docs/components/tooltip), [Tree View](https://chakra-ui.com/docs/components/tree-view), [Visually Hidden](https://chakra-ui.com/docs/components/visually-hidden), [Wrap](https://chakra-ui.com/docs/components/wrap)

### HeroUI

73 entries. The React component catalog.

- [Accordion](https://heroui.com/en/docs/react/components/accordion), [Alert](https://heroui.com/en/docs/react/components/alert), [AlertDialog](https://heroui.com/en/docs/react/components/alert-dialog), [Autocomplete](https://heroui.com/en/docs/react/components/autocomplete), [Avatar](https://heroui.com/en/docs/react/components/avatar)
- [Badge](https://heroui.com/en/docs/react/components/badge), [Breadcrumbs](https://heroui.com/en/docs/react/components/breadcrumbs), [Button](https://heroui.com/en/docs/react/components/button), [ButtonGroup](https://heroui.com/en/docs/react/components/button-group), [Card](https://heroui.com/en/docs/react/components/card)
- [Chip](https://heroui.com/en/docs/react/components/chip), [CloseButton](https://heroui.com/en/docs/react/components/close-button), [ColorArea](https://heroui.com/en/docs/react/components/color-area), [ColorField](https://heroui.com/en/docs/react/components/color-field), [ColorPicker](https://heroui.com/en/docs/react/components/color-picker)
- [ColorSlider](https://heroui.com/en/docs/react/components/color-slider), [ColorSwatch](https://heroui.com/en/docs/react/components/color-swatch), [ColorSwatchPicker](https://heroui.com/en/docs/react/components/color-swatch-picker), [DateField](https://heroui.com/en/docs/react/components/date-field), [DatePicker](https://heroui.com/en/docs/react/components/date-picker)
- [DateRangePicker](https://heroui.com/en/docs/react/components/date-range-picker), [Description](https://heroui.com/en/docs/react/components/description), [Disclosure](https://heroui.com/en/docs/react/components/disclosure), [DisclosureGroup](https://heroui.com/en/docs/react/components/disclosure-group), [Drawer](https://heroui.com/en/docs/react/components/drawer)
- [Dropdown](https://heroui.com/en/docs/react/components/dropdown), [ErrorMessage](https://heroui.com/en/docs/react/components/error-message), [FieldError](https://heroui.com/en/docs/react/components/field-error), [Fieldset](https://heroui.com/en/docs/react/components/fieldset), [Form](https://heroui.com/en/docs/react/components/form)
- [Input](https://heroui.com/en/docs/react/components/input), [InputGroup](https://heroui.com/en/docs/react/components/input-group), [InputOTP](https://heroui.com/en/docs/react/components/input-otp), [Kbd](https://heroui.com/en/docs/react/components/kbd), [Label](https://heroui.com/en/docs/react/components/label)
- [Link](https://heroui.com/en/docs/react/components/link), [ListBox](https://heroui.com/en/docs/react/components/list-box), [Meter](https://heroui.com/en/docs/react/components/meter), [Modal](https://heroui.com/en/docs/react/components/modal), [NewAvatarGroup](https://heroui.com/en/docs/react/components/avatar-group)
- [NewComboBox](https://heroui.com/en/docs/react/components/combo-box), [NewSheet](https://heroui.com/en/docs/react/components/sheet), [NewTabs](https://heroui.com/en/docs/react/components/tabs), [NumberField](https://heroui.com/en/docs/react/components/number-field), [Pagination](https://heroui.com/en/docs/react/components/pagination)
- [Popover](https://heroui.com/en/docs/react/components/popover), [ProgressBar](https://heroui.com/en/docs/react/components/progress-bar), [ProgressCircle](https://heroui.com/en/docs/react/components/progress-circle), [RangeCalendar](https://heroui.com/en/docs/react/components/range-calendar), [ScrollShadow](https://heroui.com/en/docs/react/components/scroll-shadow)
- [SearchField](https://heroui.com/en/docs/react/components/search-field), [Select](https://heroui.com/en/docs/react/components/select), [Separator](https://heroui.com/en/docs/react/components/separator), [Skeleton](https://heroui.com/en/docs/react/components/skeleton), [Slider](https://heroui.com/en/docs/react/components/slider)
- [Spinner](https://heroui.com/en/docs/react/components/spinner), [Surface](https://heroui.com/en/docs/react/components/surface), [TagGroup](https://heroui.com/en/docs/react/components/tag-group), [TextArea](https://heroui.com/en/docs/react/components/text-area), [TextField](https://heroui.com/en/docs/react/components/text-field)
- [TimeField](https://heroui.com/en/docs/react/components/time-field), [ToggleButton](https://heroui.com/en/docs/react/components/toggle-button), [ToggleButtonGroup](https://heroui.com/en/docs/react/components/toggle-button-group), [Toolbar](https://heroui.com/en/docs/react/components/toolbar), [Typography](https://heroui.com/en/docs/react/components/typography)
- [UpdatedCalendar](https://heroui.com/en/docs/react/components/calendar), [UpdatedCheckbox](https://heroui.com/en/docs/react/components/checkbox), [UpdatedCheckboxGroup](https://heroui.com/en/docs/react/components/checkbox-group), [UpdatedRadioGroup](https://heroui.com/en/docs/react/components/radio-group), [UpdatedSwitch](https://heroui.com/en/docs/react/components/switch)
- [UpdatedTable](https://heroui.com/en/docs/react/components/table), [UpdatedToast](https://heroui.com/en/docs/react/components/toast), [UpdatedTooltip](https://heroui.com/en/docs/react/components/tooltip)

### daisyUI

68 entries. Component classes. Themes are available through the project’s theme catalog.

- [Accordion Accordion is used for showing and hiding content but only one item can stay open at a time.](https://daisyui.com/components/accordion/), [Alert Alert informs users about important events.](https://daisyui.com/components/alert/), [Aura](https://daisyui.com/components/aura/), [Avatar Avatars are used to show a thumbnail representation of an individual or business in the interface.](https://daisyui.com/components/avatar/), [Badge Badges are used to inform the user of the status of specific data.](https://daisyui.com/components/badge/)
- [Breadcrumbs Breadcrumbs helps users to navigate through the website.](https://daisyui.com/components/breadcrumbs/), [Browser mockup Browser mockup shows a box that looks like a browser window.](https://daisyui.com/components/mockup-browser/), [Button Buttons allow the user to take actions or make choices.](https://daisyui.com/components/button/), [Calendar Calendar includes styles for different calendar libraries.](https://daisyui.com/components/calendar/), [Card Cards are used to group and display content in a way that is easily readable.](https://daisyui.com/components/card/)
- [Carousel Carousel show images or content in a scrollable area.](https://daisyui.com/components/carousel/), [Chat bubble](https://daisyui.com/components/chat/), [Checkbox Checkboxes are used to select or deselect a value.](https://daisyui.com/components/checkbox/), [Code mockup Code mockup is used to show a block of code in a box that looks like a code editor.](https://daisyui.com/components/mockup-code/), [Collapse Collapse is used for showing and hiding content.](https://daisyui.com/components/collapse/)
- [Countdown Countdown gives you a transition effect when you change a number between 0 to 999.](https://daisyui.com/components/countdown/), [Diff Diff component shows a side-by-side comparison of two items.](https://daisyui.com/components/diff/), [Divider Divider will be used to separate content vertically or horizontally.](https://daisyui.com/components/divider/), [Dock](https://daisyui.com/components/dock/), [Drawer sidebar Drawer is a grid layout that can show/hide a sidebar on the left or right side of the page.](https://daisyui.com/components/drawer/)
- [Dropdown Dropdown can open a menu or any other element when the button is clicked.](https://daisyui.com/components/dropdown/), [FAB / Speed Dial](https://daisyui.com/components/fab/), [Fieldset](https://daisyui.com/components/fieldset/), [File Input File Input is an input field for uploading files.](https://daisyui.com/components/file-input/), [Filter](https://daisyui.com/components/filter/)
- [Footer Footer can contain logo, copyright notice, and links to other pages.](https://daisyui.com/components/footer/), [Hero Hero is a component for displaying a large box or image with a title and description.](https://daisyui.com/components/hero/), [Hover 3D card](https://daisyui.com/components/hover-3d/), [Hover Gallery](https://daisyui.com/components/hover-gallery/), [Indicator Indicators are used to place an element on the corner of another element.](https://daisyui.com/components/indicator/)
- [Join (group items)](https://daisyui.com/components/join/), [Kbd Kbd is used to display keyboard shortcuts.](https://daisyui.com/components/kbd/), [Label Label is used to provide a name or title for an input field. Label can be placed before or after the field.](https://daisyui.com/components/label/), [Link Link adds the missing underline style to links.](https://daisyui.com/components/link/), [List List is a vertical layout to display information in rows.](https://daisyui.com/components/list/)
- [Loading Loading shows an animation to indicate that something is loading.](https://daisyui.com/components/loading/), [Mask Mask crops the content of the element to common shapes.](https://daisyui.com/components/mask/), [Megamenu](https://daisyui.com/components/megamenu/), [Menu Menu is used to display a list of links vertically or horizontally.](https://daisyui.com/components/menu/), [Modal Modal is used to show a dialog or a box when you click a button.](https://daisyui.com/components/modal/)
- [Navbar Navbar is used to show a navigation bar on the top of the page.](https://daisyui.com/components/navbar/), [OTP](https://daisyui.com/components/otp/), [Pagination Pagination is a group of buttons that allow the user to navigate between a set of related content.](https://daisyui.com/components/pagination/), [Phone mockup Phone mockup shows a mockup of an iPhone.](https://daisyui.com/components/mockup-phone/), [Progress Progress bar can be used to show the progress of a task or to show the passing of time.](https://daisyui.com/components/progress/)
- [Radial progress Radial progress can be used to show the progress of a task or to show the passing of time.](https://daisyui.com/components/radial-progress/), [Radio Radio buttons allow the user to select one option from a set.](https://daisyui.com/components/radio/), [Range slider Range slider is used to select a value by sliding a handle.](https://daisyui.com/components/range/), [Rating Rating is a set of radio buttons that allow the user to rate something.](https://daisyui.com/components/rating/), [Select Select is used to pick a value from a list of options.](https://daisyui.com/components/select/)
- [Skeleton Skeleton is a component that can be used to show a loading state of a component.](https://daisyui.com/components/skeleton/), [Stack Stack visually puts elements on top of each other.](https://daisyui.com/components/stack/), [Stat Stat is used to show numbers and data in a block.](https://daisyui.com/components/stat/), [Status](https://daisyui.com/components/status/), [Steps Steps can be used to show a list of steps in a process.](https://daisyui.com/components/steps/)
- [Swap Swap allows you to toggle the visibility of two elements using a checkbox or a class name.](https://daisyui.com/components/swap/), [Table Table can be used to show a list of data in a table format.](https://daisyui.com/components/table/), [Tabs Tabs can be used to show a list of links in a tabbed format.](https://daisyui.com/components/tab/), [Text Input Text Input is a simple input field.](https://daisyui.com/components/input/), [Text Rotate](https://daisyui.com/components/text-rotate/)
- [Textarea Textarea allows users to enter text in multiple lines.](https://daisyui.com/components/textarea/), [Theme Controller](https://daisyui.com/components/theme-controller/), [Timeline Timeline component shows a list of events in chronological order.](https://daisyui.com/components/timeline/), [Toast Toast is a wrapper to stack elements, positioned on the corner of page.](https://daisyui.com/components/toast/), [Toggle Toggle is a checkbox that is styled to look like a switch button.](https://daisyui.com/components/toggle/)
- [Tooltip Tooltip can be used to show a message when hovering over an element.](https://daisyui.com/components/tooltip/), [Validator Validator class changes the color of form elements to error or success based on input's validation rules.](https://daisyui.com/components/validator/), [Window mockup Window mockup shows a box that looks like an operating system window.](https://daisyui.com/components/mockup-window/)

### Nuxt UI

135 entries. Component pages for Vue and Nuxt.

- [Accordion](https://ui.nuxt.com/docs/components/accordion), [Alert](https://ui.nuxt.com/docs/components/alert), [App](https://ui.nuxt.com/docs/components/app), [AuthForm](https://ui.nuxt.com/docs/components/auth-form), [Avatar](https://ui.nuxt.com/docs/components/avatar)
- [AvatarGroup](https://ui.nuxt.com/docs/components/avatar-group), [Badge](https://ui.nuxt.com/docs/components/badge), [Banner](https://ui.nuxt.com/docs/components/banner), [BlogPost](https://ui.nuxt.com/docs/components/blog-post), [BlogPosts](https://ui.nuxt.com/docs/components/blog-posts)
- [Breadcrumb](https://ui.nuxt.com/docs/components/breadcrumb), [Button](https://ui.nuxt.com/docs/components/button), [Calendar](https://ui.nuxt.com/docs/components/calendar), [Card](https://ui.nuxt.com/docs/components/card), [Carousel](https://ui.nuxt.com/docs/components/carousel)
- [ChangelogVersion](https://ui.nuxt.com/docs/components/changelog-version), [ChangelogVersions](https://ui.nuxt.com/docs/components/changelog-versions), [ChartNew](https://ui.nuxt.com/docs/components/chart), [Chat](https://ui.nuxt.com/docs/components/chat), [ChatAttachmentSoon](https://ui.nuxt.com/docs/components/chat-attachment)
- [ChatMessage](https://ui.nuxt.com/docs/components/chat-message), [ChatMessages](https://ui.nuxt.com/docs/components/chat-messages), [ChatPalette](https://ui.nuxt.com/docs/components/chat-palette), [ChatPrompt](https://ui.nuxt.com/docs/components/chat-prompt), [ChatPromptSubmit](https://ui.nuxt.com/docs/components/chat-prompt-submit)
- [ChatReasoning](https://ui.nuxt.com/docs/components/chat-reasoning), [ChatShimmer](https://ui.nuxt.com/docs/components/chat-shimmer), [ChatTool](https://ui.nuxt.com/docs/components/chat-tool), [Checkbox](https://ui.nuxt.com/docs/components/checkbox), [CheckboxGroup](https://ui.nuxt.com/docs/components/checkbox-group)
- [Chip](https://ui.nuxt.com/docs/components/chip), [Collapsible](https://ui.nuxt.com/docs/components/collapsible), [ColorModeAvatar](https://ui.nuxt.com/docs/components/color-mode-avatar), [ColorModeButton](https://ui.nuxt.com/docs/components/color-mode-button), [ColorModeImage](https://ui.nuxt.com/docs/components/color-mode-image)
- [ColorModeSelect](https://ui.nuxt.com/docs/components/color-mode-select), [ColorModeSwitch](https://ui.nuxt.com/docs/components/color-mode-switch), [ColorPicker](https://ui.nuxt.com/docs/components/color-picker), [CommandPalette](https://ui.nuxt.com/docs/components/command-palette), [Container](https://ui.nuxt.com/docs/components/container)
- [ContentNavigation](https://ui.nuxt.com/docs/components/content-navigation), [ContentSearch](https://ui.nuxt.com/docs/components/content-search), [ContentSearchButton](https://ui.nuxt.com/docs/components/content-search-button), [ContentSurround](https://ui.nuxt.com/docs/components/content-surround), [ContentToc](https://ui.nuxt.com/docs/components/content-toc)
- [ContextMenu](https://ui.nuxt.com/docs/components/context-menu), [DashboardGroup](https://ui.nuxt.com/docs/components/dashboard-group), [DashboardNavbar](https://ui.nuxt.com/docs/components/dashboard-navbar), [DashboardPanel](https://ui.nuxt.com/docs/components/dashboard-panel), [DashboardResizeHandle](https://ui.nuxt.com/docs/components/dashboard-resize-handle)
- [DashboardSearch](https://ui.nuxt.com/docs/components/dashboard-search), [DashboardSearchButton](https://ui.nuxt.com/docs/components/dashboard-search-button), [DashboardSidebar](https://ui.nuxt.com/docs/components/dashboard-sidebar), [DashboardSidebarCollapse](https://ui.nuxt.com/docs/components/dashboard-sidebar-collapse), [DashboardSidebarToggle](https://ui.nuxt.com/docs/components/dashboard-sidebar-toggle)
- [DashboardToolbar](https://ui.nuxt.com/docs/components/dashboard-toolbar), [Drawer](https://ui.nuxt.com/docs/components/drawer), [DropdownMenu](https://ui.nuxt.com/docs/components/dropdown-menu), [Editor](https://ui.nuxt.com/docs/components/editor), [EditorDragHandle](https://ui.nuxt.com/docs/components/editor-drag-handle)
- [EditorEmojiMenu](https://ui.nuxt.com/docs/components/editor-emoji-menu), [EditorMentionMenu](https://ui.nuxt.com/docs/components/editor-mention-menu), [EditorSuggestionMenu](https://ui.nuxt.com/docs/components/editor-suggestion-menu), [EditorToolbar](https://ui.nuxt.com/docs/components/editor-toolbar), [Empty](https://ui.nuxt.com/docs/components/empty)
- [Error](https://ui.nuxt.com/docs/components/error), [FieldGroup](https://ui.nuxt.com/docs/components/field-group), [FileUpload](https://ui.nuxt.com/docs/components/file-upload), [Footer](https://ui.nuxt.com/docs/components/footer), [FooterColumns](https://ui.nuxt.com/docs/components/footer-columns)
- [Form](https://ui.nuxt.com/docs/components/form), [FormField](https://ui.nuxt.com/docs/components/form-field), [Header](https://ui.nuxt.com/docs/components/header), [Icon](https://ui.nuxt.com/docs/components/icon), [Input](https://ui.nuxt.com/docs/components/input)
- [InputDate](https://ui.nuxt.com/docs/components/input-date), [InputMenu](https://ui.nuxt.com/docs/components/input-menu), [InputNumber](https://ui.nuxt.com/docs/components/input-number), [InputRating](https://ui.nuxt.com/docs/components/input-rating), [InputTags](https://ui.nuxt.com/docs/components/input-tags)
- [InputTime](https://ui.nuxt.com/docs/components/input-time), [Kbd](https://ui.nuxt.com/docs/components/kbd), [Link](https://ui.nuxt.com/docs/components/link), [Listbox](https://ui.nuxt.com/docs/components/listbox), [LocaleSelect](https://ui.nuxt.com/docs/components/locale-select)
- [Main](https://ui.nuxt.com/docs/components/main), [Marquee](https://ui.nuxt.com/docs/components/marquee), [Modal](https://ui.nuxt.com/docs/components/modal), [NavigationMenu](https://ui.nuxt.com/docs/components/navigation-menu), [Page](https://ui.nuxt.com/docs/components/page)
- [PageAnchors](https://ui.nuxt.com/docs/components/page-anchors), [PageAside](https://ui.nuxt.com/docs/components/page-aside), [PageBody](https://ui.nuxt.com/docs/components/page-body), [PageCard](https://ui.nuxt.com/docs/components/page-card), [PageColumns](https://ui.nuxt.com/docs/components/page-columns)
- [PageCTA](https://ui.nuxt.com/docs/components/page-cta), [PageFeature](https://ui.nuxt.com/docs/components/page-feature), [PageGrid](https://ui.nuxt.com/docs/components/page-grid), [PageHeader](https://ui.nuxt.com/docs/components/page-header), [PageHero](https://ui.nuxt.com/docs/components/page-hero)
- [PageLinks](https://ui.nuxt.com/docs/components/page-links), [PageList](https://ui.nuxt.com/docs/components/page-list), [PageLogos](https://ui.nuxt.com/docs/components/page-logos), [PageSection](https://ui.nuxt.com/docs/components/page-section), [Pagination](https://ui.nuxt.com/docs/components/pagination)
- [PinInput](https://ui.nuxt.com/docs/components/pin-input), [Popover](https://ui.nuxt.com/docs/components/popover), [PricingPlan](https://ui.nuxt.com/docs/components/pricing-plan), [PricingPlans](https://ui.nuxt.com/docs/components/pricing-plans), [PricingTable](https://ui.nuxt.com/docs/components/pricing-table)
- [Progress](https://ui.nuxt.com/docs/components/progress), [ProgressGroup](https://ui.nuxt.com/docs/components/progress-group), [RadioGroup](https://ui.nuxt.com/docs/components/radio-group), [ScrollArea](https://ui.nuxt.com/docs/components/scroll-area), [Select](https://ui.nuxt.com/docs/components/select)
- [SelectMenu](https://ui.nuxt.com/docs/components/select-menu), [Separator](https://ui.nuxt.com/docs/components/separator), [Sidebar](https://ui.nuxt.com/docs/components/sidebar), [Skeleton](https://ui.nuxt.com/docs/components/skeleton), [Slideover](https://ui.nuxt.com/docs/components/slideover)
- [Slider](https://ui.nuxt.com/docs/components/slider), [Splitter](https://ui.nuxt.com/docs/components/splitter), [Stepper](https://ui.nuxt.com/docs/components/stepper), [Switch](https://ui.nuxt.com/docs/components/switch), [Table](https://ui.nuxt.com/docs/components/table)
- [Tabs](https://ui.nuxt.com/docs/components/tabs), [Textarea](https://ui.nuxt.com/docs/components/textarea), [Theme](https://ui.nuxt.com/docs/components/theme), [Timeline](https://ui.nuxt.com/docs/components/timeline), [Toast](https://ui.nuxt.com/docs/components/toast)
- [ToggleGroupSoon](https://ui.nuxt.com/docs/components/toggle-group), [ToggleSoon](https://ui.nuxt.com/docs/components/toggle), [Tooltip](https://ui.nuxt.com/docs/components/tooltip), [Tree](https://ui.nuxt.com/docs/components/tree), [User](https://ui.nuxt.com/docs/components/user)

### PrimeVue

91 entries. The full Vue component directory, including entries documented as directives.

- [Accordion](https://primevue.dev/accordion/), [AnimateOnScroll](https://primevue.dev/animateonscroll/), [AutoComplete](https://primevue.dev/autocomplete/), [Avatar](https://primevue.dev/avatar/), [Badge](https://primevue.dev/badge/)
- [BlockUI](https://primevue.dev/blockui/), [Breadcrumb](https://primevue.dev/breadcrumb/), [Button](https://primevue.dev/button/), [Card](https://primevue.dev/card/), [Carousel](https://primevue.dev/carousel/)
- [CascadeSelect](https://primevue.dev/cascadeselect/), [Checkbox](https://primevue.dev/checkbox/), [Chip](https://primevue.dev/chip/), [CommandMenu](https://primevue.dev/commandmenu/), [Compare](https://primevue.dev/compare/)
- [ConfirmDialog](https://primevue.dev/confirmdialog/), [ConfirmPopup](https://primevue.dev/confirmpopup/), [ContextMenu](https://primevue.dev/contextmenu/), [DataTable](https://primevue.dev/datatable/), [DataView](https://primevue.dev/dataview/)
- [DatePicker](https://primevue.dev/datepicker/), [DeferredContent](https://primevue.dev/deferredcontent/), [Dialog](https://primevue.dev/dialog/), [Divider](https://primevue.dev/divider/), [Dock](https://primevue.dev/dock/)
- [Drawer](https://primevue.dev/drawer/), [DynamicDialog](https://primevue.dev/dynamicdialog/), [Fieldset](https://primevue.dev/fieldset/), [FileUpload](https://primevue.dev/fileupload/), [FloatLabel](https://primevue.dev/floatlabel/)
- [Fluid](https://primevue.dev/fluid/), [FocusTrap](https://primevue.dev/focustrap/), [Gallery](https://primevue.dev/gallery/), [IconField](https://primevue.dev/iconfield/), [IftaLabel](https://primevue.dev/iftalabel/)
- [Inplace](https://primevue.dev/inplace/), [InputColor](https://primevue.dev/inputcolor/), [InputGroup](https://primevue.dev/inputgroup/), [InputNumber](https://primevue.dev/inputnumber/), [InputOtp](https://primevue.dev/inputotp/)
- [InputPassword](https://primevue.dev/inputpassword/), [InputTags](https://primevue.dev/inputtags/), [InputText](https://primevue.dev/inputtext/), [KeyFilter](https://primevue.dev/keyfilter/), [Knob](https://primevue.dev/knob/)
- [Label](https://primevue.dev/label/), [Listbox](https://primevue.dev/listbox/), [Mask](https://primevue.dev/mask/), [MegaMenu](https://primevue.dev/megamenu/), [Menu](https://primevue.dev/menu/)
- [Menubar](https://primevue.dev/menubar/), [Message](https://primevue.dev/message/), [MeterGroup](https://primevue.dev/metergroup/), [OrderList](https://primevue.dev/orderlist/), [OrgChart](https://primevue.dev/organizationchart/)
- [Paginator](https://primevue.dev/paginator/), [Panel](https://primevue.dev/panel/), [PickList](https://primevue.dev/picklist/), [Popover](https://primevue.dev/popover/), [ProgressBar](https://primevue.dev/progressbar/)
- [ProgressSpinner](https://primevue.dev/progressspinner/), [RadioButton](https://primevue.dev/radiobutton/), [Rating](https://primevue.dev/rating/), [Ripple](https://primevue.dev/ripple/), [ScrollArea](https://primevue.dev/scrollarea/)
- [ScrollTop](https://primevue.dev/scrolltop/), [Select](https://primevue.dev/select/), [SelectButton](https://primevue.dev/selectbutton/), [Sidebar](https://primevue.dev/sidebar/), [Skeleton](https://primevue.dev/skeleton/)
- [Slider](https://primevue.dev/slider/), [SpeedDial](https://primevue.dev/speeddial/), [SplitButton](https://primevue.dev/splitbutton/), [Splitter](https://primevue.dev/splitter/), [Stepper](https://primevue.dev/stepper/)
- [StyleClass](https://primevue.dev/styleclass/), [Tabs](https://primevue.dev/tabs/), [Tag](https://primevue.dev/tag/), [Terminal](https://primevue.dev/terminal/), [Textarea](https://primevue.dev/textarea/)
- [TieredMenu](https://primevue.dev/tieredmenu/), [Timeline](https://primevue.dev/timeline/), [Toast](https://primevue.dev/toast/), [ToggleButton](https://primevue.dev/togglebutton/), [ToggleSwitch](https://primevue.dev/toggleswitch/)
- [Toolbar](https://primevue.dev/toolbar/), [Tooltip](https://primevue.dev/tooltip/), [Tree](https://primevue.dev/tree/), [TreeSelect](https://primevue.dev/treeselect/), [TreeTable](https://primevue.dev/treetable/)
- [VirtualScroller](https://primevue.dev/virtualscroller/)

### Aceternity UI

127 entries. Public component pages. Premium variants are design references.

- [3D Animated Pin](https://ui.aceternity.com/components/3d-pin), [3d Card](https://ui.aceternity.com/components/3d-card), [3D Card Effect](https://ui.aceternity.com/components/3d-card-effect), [3D Globe](https://ui.aceternity.com/components/3d-globe), [3D Marquee](https://ui.aceternity.com/components/3d-marquee)
- [Animated Modal](https://ui.aceternity.com/components/animated-modal), [Animated Tabs](https://ui.aceternity.com/components/tabs), [Animated Testimonials](https://ui.aceternity.com/components/animated-testimonials), [Animated Tooltip](https://ui.aceternity.com/components/animated-tooltip), [Apple Cards Carousel](https://ui.aceternity.com/components/apple-cards-carousel)
- [ASCII Art](https://ui.aceternity.com/components/ascii-art), [Aurora Background](https://ui.aceternity.com/components/aurora-background), [Background Beams](https://ui.aceternity.com/components/background-beams), [Background Beams With Collision](https://ui.aceternity.com/components/background-beams-with-collision), [Background Boxes](https://ui.aceternity.com/components/background-boxes)
- [Background Cubes Grid](https://ui.aceternity.com/components/background-cubes-grid), [Background Gradient](https://ui.aceternity.com/components/background-gradient), [Background Gradient Animation](https://ui.aceternity.com/components/background-gradient-animation), [Background Lines](https://ui.aceternity.com/components/background-lines), [Background Ripple Effect](https://ui.aceternity.com/components/background-ripple-effect)
- [Bento Grid](https://ui.aceternity.com/components/bento-grid), [Canvas Reveal Effect](https://ui.aceternity.com/components/canvas-reveal-effect), [Canvas Text](https://ui.aceternity.com/components/canvas-text), [Card Spotlight](https://ui.aceternity.com/components/card-spotlight), [Card Stack](https://ui.aceternity.com/components/card-stack)
- [Cards](https://ui.aceternity.com/components/cards-free), [Carousel](https://ui.aceternity.com/components/carousel), [Chromatic Image](https://ui.aceternity.com/components/chromatic-image), [CLI](https://ui.aceternity.com/components/cli), [Cloud Shader](https://ui.aceternity.com/components/cloud-shader)
- [Code Block](https://ui.aceternity.com/components/code-block), [Colourful Text](https://ui.aceternity.com/components/colourful-text), [Comet Card](https://ui.aceternity.com/components/comet-card), [Compare](https://ui.aceternity.com/components/compare), [Container Scroll Animation](https://ui.aceternity.com/components/container-scroll-animation)
- [Container Text Flip](https://ui.aceternity.com/components/container-text-flip), [Cover](https://ui.aceternity.com/components/container-cover), [Cover](https://ui.aceternity.com/components/cover), [Direction Aware Hover](https://ui.aceternity.com/components/direction-aware-hover), [Dither Shader](https://ui.aceternity.com/components/dither-shader)
- [Dotted Glow Background](https://ui.aceternity.com/components/dotted-glow-background), [Draggable Card](https://ui.aceternity.com/components/draggable-card), [Encrypted Text](https://ui.aceternity.com/components/encrypted-text), [Evervault Card](https://ui.aceternity.com/components/evervault-card), [Expandable Cards](https://ui.aceternity.com/components/expandable-card)
- [Feature Sections](https://ui.aceternity.com/components/feature-sections-free), [Fey.com Macbook Scroll](https://ui.aceternity.com/components/macbook-scroll), [File Upload](https://ui.aceternity.com/components/file-upload), [Flip Words](https://ui.aceternity.com/components/flip-words), [Floating Dock](https://ui.aceternity.com/components/floating-dock)
- [Floating Navbar](https://ui.aceternity.com/components/floating-navbar), [Focus Cards](https://ui.aceternity.com/components/focus-cards), [Following Pointer](https://ui.aceternity.com/components/following-pointer), [GitHub Globe](https://ui.aceternity.com/components/github-globe), [Glare Card](https://ui.aceternity.com/components/glare-card)
- [Globe](https://ui.aceternity.com/components/globe), [Glowing Background Stars Card](https://ui.aceternity.com/components/glowing-stars-effect), [Glowing Effect](https://ui.aceternity.com/components/glowing-effect), [Glowing Stars](https://ui.aceternity.com/components/glowing-stars), [Gooey Input](https://ui.aceternity.com/components/gooey-input)
- [Google Gemini Effect](https://ui.aceternity.com/components/google-gemini-effect), [Grid](https://ui.aceternity.com/components/grid), [Grid and Dot Backgrounds](https://ui.aceternity.com/components/grid-and-dot-backgrounds), [Hero Highlight](https://ui.aceternity.com/components/hero-highlight), [Hero Parallax](https://ui.aceternity.com/components/hero-parallax)
- [Hero Sections](https://ui.aceternity.com/components/hero-sections-free), [Hover Border Gradient](https://ui.aceternity.com/components/hover-border-gradient), [Hover Effect](https://ui.aceternity.com/components/card-hover-effect), [Image Generation Loader](https://ui.aceternity.com/components/image-generation-loader), [Images Badge](https://ui.aceternity.com/components/images-badge)
- [Images Slider](https://ui.aceternity.com/components/images-slider), [Infinite Moving Cards](https://ui.aceternity.com/components/infinite-moving-cards), [Input](https://ui.aceternity.com/components/input), [Keyboard](https://ui.aceternity.com/components/keyboard), [Label](https://ui.aceternity.com/components/label)
- [Lamp](https://ui.aceternity.com/components/lamp), [Lamp Section Header](https://ui.aceternity.com/components/lamp-effect), [Layout Grid](https://ui.aceternity.com/components/layout-grid), [Layout Text Flip](https://ui.aceternity.com/components/layout-text-flip), [Lens](https://ui.aceternity.com/components/lens)
- [Link Preview](https://ui.aceternity.com/components/link-preview), [Liquid Glass](https://ui.aceternity.com/components/liquid-glass), [Loaders](https://ui.aceternity.com/components/loader), [Magnetic Button](https://ui.aceternity.com/components/magnetic-button), [Meteor Effect](https://ui.aceternity.com/components/meteors)
- [Moving Border](https://ui.aceternity.com/components/moving-border), [Moving Line](https://ui.aceternity.com/components/moving-line), [Multi Step Loader](https://ui.aceternity.com/components/multi-step-loader), [Navbar Menu](https://ui.aceternity.com/components/navbar-menu), [Noise Background](https://ui.aceternity.com/components/noise-background)
- [Notch](https://ui.aceternity.com/components/notch), [Parallax Grid Scroll](https://ui.aceternity.com/components/parallax-scroll), [Parallax Hero Images](https://ui.aceternity.com/components/parallax-hero-images), [Parallax Scroll 2](https://ui.aceternity.com/components/parallax-scroll-2), [Pixelated Canvas](https://ui.aceternity.com/components/pixelated-canvas)
- [Placeholders And Vanish Input](https://ui.aceternity.com/components/placeholders-and-vanish-input), [Pointer Highlight](https://ui.aceternity.com/components/pointer-highlight), [Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar), [Scales](https://ui.aceternity.com/components/scales), [Shooting Stars](https://ui.aceternity.com/components/shooting-stars)
- [Shooting Stars and Stars Background](https://ui.aceternity.com/components/shooting-stars-and-stars-background), [Sidebar](https://ui.aceternity.com/components/sidebar), [Signup Form](https://ui.aceternity.com/components/signup-form), [Sparkles](https://ui.aceternity.com/components/sparkles), [Spotlight](https://ui.aceternity.com/components/spotlight)
- [Spotlight New](https://ui.aceternity.com/components/spotlight-new), [Squiggly Text](https://ui.aceternity.com/components/squiggly-text), [Stars Background](https://ui.aceternity.com/components/stars-background), [Stateful Button](https://ui.aceternity.com/components/stateful-button), [Sticky Banner](https://ui.aceternity.com/components/sticky-banner)
- [Sticky Scroll Reveal](https://ui.aceternity.com/components/sticky-scroll-reveal), [SVG Mask Effect](https://ui.aceternity.com/components/svg-mask-effect), [Tailwind CSS buttons](https://ui.aceternity.com/components/tailwindcss-buttons), [Terminal](https://ui.aceternity.com/components/terminal), [Text Flipping Board](https://ui.aceternity.com/components/text-flipping-board)
- [Text Generate Effect](https://ui.aceternity.com/components/text-generate-effect), [Text Hover Effect](https://ui.aceternity.com/components/text-hover-effect), [Text Reveal Card](https://ui.aceternity.com/components/text-reveal-card), [Timeline](https://ui.aceternity.com/components/timeline), [Tooltip Card](https://ui.aceternity.com/components/tooltip-card)
- [Tracing Beam](https://ui.aceternity.com/components/tracing-beam), [Typewriter Effect](https://ui.aceternity.com/components/typewriter-effect), [Vortex Background](https://ui.aceternity.com/components/vortex), [Wavy Background](https://ui.aceternity.com/components/wavy-background), [Webcam Pixel Grid](https://ui.aceternity.com/components/webcam-pixel-grid)
- [Wobble Card](https://ui.aceternity.com/components/wobble-card), [World Map](https://ui.aceternity.com/components/world-map)

### Magic UI

78 entries. Public component docs.

- [Android](https://magicui.design/docs/components/android), [Animated Beam](https://magicui.design/docs/components/animated-beam), [Animated Circular Progress Bar](https://magicui.design/docs/components/animated-circular-progress-bar), [Animated Gradient Text](https://magicui.design/docs/components/animated-gradient-text), [Animated Grid Pattern](https://magicui.design/docs/components/animated-grid-pattern)
- [Animated List](https://magicui.design/docs/components/animated-list), [Animated Shiny Text](https://magicui.design/docs/components/animated-shiny-text), [Animated Theme TogglerNew](https://magicui.design/docs/components/animated-theme-toggler), [Aurora Text](https://magicui.design/docs/components/aurora-text), [Avatar Circles](https://magicui.design/docs/components/avatar-circles)
- [BacklightNew](https://magicui.design/docs/components/backlight), [Bento Grid](https://magicui.design/docs/components/bento-grid), [Blur Fade](https://magicui.design/docs/components/blur-fade), [Border Beam](https://magicui.design/docs/components/border-beam), [Code Comparison](https://magicui.design/docs/components/code-comparison)
- [Comic Text](https://magicui.design/docs/components/comic-text), [Confetti](https://magicui.design/docs/components/confetti), [Cool Mode](https://magicui.design/docs/components/cool-mode), [Dia Text RevealNew](https://magicui.design/docs/components/dia-text-reveal), [Dither FieldNew](https://magicui.design/docs/components/dither-field)
- [Dock](https://magicui.design/docs/components/dock), [Dot Pattern](https://magicui.design/docs/components/dot-pattern), [Dotted MapNew](https://magicui.design/docs/components/dotted-map), [File Tree](https://magicui.design/docs/components/file-tree), [Flickering Grid](https://magicui.design/docs/components/flickering-grid)
- [Floating 3D ParticlesNew](https://magicui.design/docs/components/floating-3d-particles), [Glare HoverNew](https://magicui.design/docs/components/glare-hover), [Globe](https://magicui.design/docs/components/globe), [Glyph MatrixNew](https://magicui.design/docs/components/glyph-matrix), [Grid Pattern](https://magicui.design/docs/components/grid-pattern)
- [Hero Video Dialog](https://magicui.design/docs/components/hero-video-dialog), [Hexagon PatternNew](https://magicui.design/docs/components/hexagon-pattern), [Hyper Text](https://magicui.design/docs/components/hyper-text), [Icon Cloud](https://magicui.design/docs/components/icon-cloud), [Interactive Grid Pattern](https://magicui.design/docs/components/interactive-grid-pattern)
- [Interactive Hover Button](https://magicui.design/docs/components/interactive-hover-button), [iPhone](https://magicui.design/docs/components/iphone), [Kinetic TextNew](https://magicui.design/docs/components/kinetic-text), [Lens](https://magicui.design/docs/components/lens), [Light RaysNew](https://magicui.design/docs/components/light-rays)
- [Line Shadow Text](https://magicui.design/docs/components/line-shadow-text), [Magic Card](https://magicui.design/docs/components/magic-card), [Marquee](https://magicui.design/docs/components/marquee), [Meteors](https://magicui.design/docs/components/meteors), [Morphing Text](https://magicui.design/docs/components/morphing-text)
- [Neon Gradient Card](https://magicui.design/docs/components/neon-gradient-card), [Noise TextureNew](https://magicui.design/docs/components/noise-texture), [Number Ticker](https://magicui.design/docs/components/number-ticker), [Orbiting Circles](https://magicui.design/docs/components/orbiting-circles), [Particles](https://magicui.design/docs/components/particles)
- [Pixel Image](https://magicui.design/docs/components/pixel-image), [Pointer](https://magicui.design/docs/components/pointer), [Progressive Blur](https://magicui.design/docs/components/progressive-blur), [Pulsating Button](https://magicui.design/docs/components/pulsating-button), [Rainbow Button](https://magicui.design/docs/components/rainbow-button)
- [Retro Grid](https://magicui.design/docs/components/retro-grid), [Ripple](https://magicui.design/docs/components/ripple), [Ripple Button](https://magicui.design/docs/components/ripple-button), [Safari](https://magicui.design/docs/components/safari), [Scroll Based Velocity](https://magicui.design/docs/components/scroll-based-velocity)
- [Scroll Progress](https://magicui.design/docs/components/scroll-progress), [Shimmer Button](https://magicui.design/docs/components/shimmer-button), [Shine Border](https://magicui.design/docs/components/shine-border), [Shiny Button](https://magicui.design/docs/components/shiny-button), [Smooth Cursor](https://magicui.design/docs/components/smooth-cursor)
- [Sparkles Text](https://magicui.design/docs/components/sparkles-text), [Spinning Text](https://magicui.design/docs/components/spinning-text), [Striped PatternNew](https://magicui.design/docs/components/striped-pattern), [Terminal](https://magicui.design/docs/components/terminal), [Text 3D FlipNew](https://magicui.design/docs/components/text-3d-flip)
- [Text Animate](https://magicui.design/docs/components/text-animate), [Text HighlighterNew](https://magicui.design/docs/components/highlighter), [Text Reveal](https://magicui.design/docs/components/text-reveal), [Tweet Card](https://magicui.design/docs/components/tweet-card), [Typing AnimationNew](https://magicui.design/docs/components/typing-animation)
- [Video Text](https://magicui.design/docs/components/video-text), [Warp Background](https://magicui.design/docs/components/warp-background), [Word Rotate](https://magicui.design/docs/components/word-rotate)

### Magic UI Pro

19 entries. Public section and template preview groups.

- [AI Agent](https://pro.magicui.design/docs/templates/agent), [Call To Action](https://pro.magicui.design/docs/sections/call-to-action), [Carousel](https://pro.magicui.design/docs/sections/carousel), [Codeforge](https://pro.magicui.design/docs/templates/codeforge), [Dev Tool](https://pro.magicui.design/docs/templates/devtool)
- [FAQ](https://pro.magicui.design/docs/sections/faq), [Feature](https://pro.magicui.design/docs/sections/feature), [Feature Cards](https://pro.magicui.design/docs/sections/feature-cards), [Feature Scroll](https://pro.magicui.design/docs/sections/feature-scroll), [Feature Slideshow](https://pro.magicui.design/docs/sections/feature-slideshow)
- [Footer](https://pro.magicui.design/docs/sections/footer), [Header](https://pro.magicui.design/docs/sections/header), [Hero](https://pro.magicui.design/docs/sections/hero), [Mobile](https://pro.magicui.design/docs/templates/mobile), [Portfolio](https://pro.magicui.design/docs/templates/portfolio)
- [Pricing](https://pro.magicui.design/docs/sections/pricing), [SaaS](https://pro.magicui.design/docs/templates/saas), [Social Proof](https://pro.magicui.design/docs/sections/social-proof), [Startup](https://pro.magicui.design/docs/templates/startup)

### React Bits

219 entries. Names from the [upstream source catalog](https://github.com/DavidHDev/react-bits/tree/main/src/content). Alternate code and styling variants are counted once.

- `AccordionGallery`, `AcidSquares`, `AeroShards`, `AnimatedContent`, `AnimatedList`
- `Antigravity`, `ASCIIText`, `Aurora`, `Balatro`, `Ballpit`
- `Beams`, `BellToggle`, `BlobCursor`, `BlurText`, `BorderGlow`
- `BounceCards`, `BranchedMenu`, `BubbleMenu`, `CallChip`, `CardNav`
- `CardSwap`, `Carousel`, `ChromaGrid`, `CircularCarousel`, `CircularGallery`
- `CircularText`, `ClickSpark`, `CodeSlots`, `ColorBends`, `CometDial`
- `Counter`, `CountUp`, `Crosshair`, `CRTWarp`, `CrystalizedBall`
- `Cubes`, `CursorGrid`, `CurvedInput`, `CurvedLoop`, `DarkVeil`
- `DecayCard`, `DecryptedText`, `DepthCarousel`, `DepthText`, `Dither`
- `DitherVeil`, `Dock`, `DodgeField`, `DomeGallery`, `DotField`
- `DotGrid`, `DriftWall`, `EchoText`, `ElasticMesh`, `ElasticSlider`
- `ElectricBorder`, `ElectricLogo`, `EvilEye`, `FadeContent`, `FallingText`
- `FaultyTerminal`, `Ferrofluid`, `FlexCarousel`, `FlipCard`, `FloatingLines`
- `FlowingMenu`, `FluidGlass`, `FluxLines`, `FlyingButton`, `FlyingPosters`
- `Folder`, `FolderFloat`, `FoldText`, `FuseButton`, `FuzzyText`
- `Galaxy`, `GhostCursor`, `GhostFibers`, `GlareHover`, `GlassIcons`
- `GlassSurface`, `GlideSelect`, `GlitchText`, `GlowCursor`, `GooeyNav`
- `GradientASCII`, `GradientBlinds`, `GradientText`, `GradientWaves`, `GradualBlur`
- `Grainient`, `GridDistortion`, `GridMotion`, `GridScan`, `HalftoneReveal`
- `HoldButton`, `HoloCard`, `HoloMosaic`, `Hyperspeed`, `ImageTrail`
- `InfiniteMenu`, `InfiniteSpiral`, `Iridescence`, `JellyRadio`, `Lanyard`
- `LaserFlow`, `LatticeLoader`, `LetterGlitch`, `Lightfall`, `Lightning`
- `LightPillar`, `LightRays`, `LightTunnel`, `LineSidebar`, `LineWaves`
- `LiquidChrome`, `LiquidEther`, `LogoLoop`, `MagicBento`, `MagicRings`
- `Magnet`, `MagnetLines`, `MaskedHeading`, `Masonry`, `MetaBalls`
- `MetallicPaint`, `MicroSlats`, `ModelViewer`, `MoltenMetal`, `MorphSlider`
- `Noise`, `OptionWheel`, `Orb`, `OrbitImages`, `PaperCrumple`
- `Particles`, `ParticleText`, `PatternWaves`, `PeekRating`, `PillNav`
- `PixelBlast`, `PixelCard`, `PixelSnow`, `PixelSwap`, `PixelTrail`
- `PixelTransition`, `Plasma`, `PlasmaWave`, `Prism`, `PrismaticBurst`
- `ProfileCard`, `PromptBar`, `PulseHeart`, `Radar`, `RefineFrame`
- `ReflectiveCard`, `Ribbons`, `RippleDistortion`, `RippleGrid`, `RotatingText`
- `RubberSegment`, `Scanner`, `ScrambledText`, `ScrollExpand`, `ScrollFloat`
- `ScrollReveal`, `ScrollStack`, `ScrollVelocity`, `ScrubField`, `ShapeBlur`
- `ShapeGrid`, `ShapeWaves`, `ShinyText`, `Shredder`, `Shuffle`
- `SideRays`, `Silk`, `SlicedWaves`, `SlideCommit`, `SlingButton`
- `SloshGauge`, `SoftAurora`, `SpecularButton`, `SplashCursor`, `SplitFlapText`
- [SplitText](https://reactbits.dev/text-animations/split-text), `SpotlightCard`, `SpringCheck`, `SquishSwitch`, `Stack`
- `StaggeredMenu`, `StarBorder`, `StatusMark`, `Stepper`, `StickerPeel`
- `Strands`, `StrokeText`, `SwarmCursor`, `SwipeRow`, `SwipeToast`
- `TargetCursor`, `TearTicket`, `TechText`, `TextCursor`, `TextLoop`
- `TextPressure`, `TextType`, `ThoughtLine`, `Threads`, `TiltedCard`
- `Topography`, `TrueFocus`, `VariableProximity`, `VoicePill`, `WakeSlider`
- `WarmTooltip`, `WarpText`, `Waves`, `WebThreads`

### assistant-ui

153 entries. Public chat patterns and component references in Elements and the assistant-ui component browser.

- [Activity graph](https://www.assistant-ui.com/elements/activity-graph), [Agent card](https://www.assistant-ui.com/elements/agent-card), [Agent plan](https://www.assistant-ui.com/elements/agent-plan), [Agent status](https://www.assistant-ui.com/elements/agent-status), [Agent Tool](https://www.assistant-ui.com/components/agent-tools)
- [Approval card](https://www.assistant-ui.com/elements/approval-card), [Artifact card](https://www.assistant-ui.com/elements/artifact-card), [Assistant modal](https://www.assistant-ui.com/elements/assistant-modal), [Assistant sidebar](https://www.assistant-ui.com/elements/assistant-sidebar), [assistant-ui base kit](https://www.assistant-ui.com/components/assistant-ui)
- [Attachment](https://www.assistant-ui.com/elements/attachment), [Attachments](https://www.assistant-ui.com/elements/composer-attachments), [Background runs](https://www.assistant-ui.com/elements/background-inbox), [Canvas](https://www.assistant-ui.com/elements/canvas-split), [Channel message](https://www.assistant-ui.com/elements/generative-channel-message)
- [Chart](https://www.assistant-ui.com/elements/chart), [Chat panel](https://www.assistant-ui.com/elements/chat-panel), [Checkpoints](https://www.assistant-ui.com/elements/checkpoint-history), [Code diff](https://www.assistant-ui.com/elements/code-diff), [Code runner](https://www.assistant-ui.com/elements/code-runner)
- [Command palette](https://www.assistant-ui.com/elements/command-palette), [Comparison](https://www.assistant-ui.com/elements/comparison-card), [Composer](https://www.assistant-ui.com/elements/composer), [Composer trigger popover](https://www.assistant-ui.com/elements/composer-trigger-popover), [Computer use](https://www.assistant-ui.com/elements/computer-use)
- [Conference session](https://www.assistant-ui.com/elements/generative-event-session), [Confidence](https://www.assistant-ui.com/elements/confidence-marker), [Confirm dialog](https://www.assistant-ui.com/elements/generative-notify-confirm), [Connection state](https://www.assistant-ui.com/elements/connection-state), [Context](https://www.assistant-ui.com/elements/composer-context)
- [Context breakdown](https://www.assistant-ui.com/elements/context-breakdown), [Context display](https://www.assistant-ui.com/elements/context-display), [Conversation map](https://www.assistant-ui.com/elements/conversation-map), [Cost meter](https://www.assistant-ui.com/elements/cost-meter), [Create event](https://www.assistant-ui.com/elements/generative-create-event)
- [Create task](https://www.assistant-ui.com/elements/generative-create-task), [Current weather](https://www.assistant-ui.com/elements/generative-weather-current), [Data table](https://www.assistant-ui.com/elements/data-table), [Diagram](https://www.assistant-ui.com/elements/diagram), [Dictation](https://www.assistant-ui.com/elements/composer-voice)
- [Directive text](https://www.assistant-ui.com/elements/directive-text), [Document reference](https://www.assistant-ui.com/elements/document-reference), [Draft email](https://www.assistant-ui.com/elements/generative-draft-email), [Draft restore](https://www.assistant-ui.com/elements/draft-restore), [Edit a sent message](https://www.assistant-ui.com/elements/edit-message)
- [Elicitation form](https://www.assistant-ui.com/elements/elicitation-form), [Empty state](https://www.assistant-ui.com/elements/empty-state), [Error state](https://www.assistant-ui.com/elements/error-state), [Feedback dialog](https://www.assistant-ui.com/elements/feedback-dialog), [File](https://www.assistant-ui.com/elements/file)
- [File tree](https://www.assistant-ui.com/elements/file-tree), [Flight tracker](https://www.assistant-ui.com/elements/generative-flight-tracker), [Flow graph](https://www.assistant-ui.com/elements/flow-graph), [Follow-up suggestions](https://www.assistant-ui.com/elements/follow-up-suggestions), [Generative UI](https://www.assistant-ui.com/elements/generative-ui)
- [Geo map](https://www.assistant-ui.com/elements/geo-map), [Guardrail notice](https://www.assistant-ui.com/elements/guardrail-notice), [Handoff](https://www.assistant-ui.com/elements/agent-handoff), [Heat graph](https://www.assistant-ui.com/elements/heat-graph), [Image](https://www.assistant-ui.com/elements/image)
- [Image gallery](https://www.assistant-ui.com/elements/image-gallery), [Image generation](https://www.assistant-ui.com/elements/image-generation), [Inline citation](https://www.assistant-ui.com/elements/inline-citation), [Job progress](https://www.assistant-ui.com/elements/job-progress), [Launcher](https://www.assistant-ui.com/elements/launcher-bubble)
- [Link preview](https://www.assistant-ui.com/elements/link-preview), [Loader](https://www.assistant-ui.com/elements/loading-state), [Map](https://www.assistant-ui.com/elements/map-answer), [Markdown text](https://www.assistant-ui.com/elements/markdown-text), [Math](https://www.assistant-ui.com/elements/math-block)
- [MCP config dialog](https://www.assistant-ui.com/elements/mcp-config), [Media player](https://www.assistant-ui.com/elements/media-player), [Memory](https://www.assistant-ui.com/elements/memory-chips), [Mentions](https://www.assistant-ui.com/elements/composer-mentions), [Mermaid diagram](https://www.assistant-ui.com/elements/mermaid-diagram)
- [Message actions](https://www.assistant-ui.com/elements/message-actions), [Message branches](https://www.assistant-ui.com/elements/message-branches), [Message pair](https://www.assistant-ui.com/elements/message-pair), [Message queue](https://www.assistant-ui.com/elements/message-queue), [Message timing](https://www.assistant-ui.com/elements/message-timing)
- [Mobile composer](https://www.assistant-ui.com/elements/mobile-composer), [Model logos](https://www.assistant-ui.com/elements/logos), [Model selector](https://www.assistant-ui.com/elements/model-selector), [Models](https://www.assistant-ui.com/elements/composer-model-picker), [Number ticker](https://www.assistant-ui.com/elements/number-ticker)
- [Onboarding](https://www.assistant-ui.com/elements/onboarding), [Option list](https://www.assistant-ui.com/elements/option-list), [Orb](https://www.assistant-ui.com/elements/orb), [Order tracking](https://www.assistant-ui.com/elements/generative-order-status), [Permission grant](https://www.assistant-ui.com/elements/permission-grant)
- [Player card](https://www.assistant-ui.com/elements/generative-player-card), [Playlist](https://www.assistant-ui.com/elements/generative-playlist), [Portfolio overview](https://www.assistant-ui.com/elements/generative-portfolio), [Prompt library](https://www.assistant-ui.com/elements/prompt-library), [Purchase receipt](https://www.assistant-ui.com/elements/generative-receipt)
- [Question flow](https://www.assistant-ui.com/elements/question-flow), [Quota banner](https://www.assistant-ui.com/elements/quota-banner), [Quote](https://www.assistant-ui.com/elements/quote), [Read aloud](https://www.assistant-ui.com/elements/read-aloud), [Reasoning](https://www.assistant-ui.com/elements/reasoning)
- [Reasoning effort](https://www.assistant-ui.com/elements/reasoning-effort), [Recommendation card](https://www.assistant-ui.com/elements/recommendation-card), [Regenerate with](https://www.assistant-ui.com/elements/regenerate-menu), [Research report](https://www.assistant-ui.com/elements/research-report), [Response time](https://www.assistant-ui.com/elements/generative-chart-line)
- [Retrieval chunks](https://www.assistant-ui.com/elements/retrieval-chunks), [Reviewable diff](https://www.assistant-ui.com/elements/reviewable-diff), [Ride status](https://www.assistant-ui.com/elements/generative-ride-status), [Riverside Loft](https://www.assistant-ui.com/elements/generative-stays), [Run activity](https://www.assistant-ui.com/elements/run-activity)
- [Schedule](https://www.assistant-ui.com/elements/schedule-card), [Score breakdown](https://www.assistant-ui.com/elements/score-breakdown), [Scroll anchor](https://www.assistant-ui.com/elements/scroll-anchor), [Search in conversation](https://www.assistant-ui.com/elements/conversation-search), [Server panel](https://www.assistant-ui.com/elements/mcp-server-panel)
- [Settings](https://www.assistant-ui.com/elements/settings-panel), [Shared conversation](https://www.assistant-ui.com/elements/shared-conversation), [Shiki highlighter](https://www.assistant-ui.com/elements/shiki-highlighter), [Shopping cart](https://www.assistant-ui.com/elements/generative-cart), [Slash commands](https://www.assistant-ui.com/elements/composer-slash-commands)
- [Software purchase](https://www.assistant-ui.com/elements/generative-software-purchase), [Sources](https://www.assistant-ui.com/elements/sources), [Speaker identity](https://www.assistant-ui.com/elements/speaker-identity), [Spec sheet](https://www.assistant-ui.com/elements/spec-sheet), [Stopped run](https://www.assistant-ui.com/elements/stopped-run)
- [Streaming text](https://www.assistant-ui.com/elements/streaming-text), [Subagent list](https://www.assistant-ui.com/elements/subagent-list), [Support tickets](https://www.assistant-ui.com/elements/generative-chart-bars), [Syntax highlighter](https://www.assistant-ui.com/elements/syntax-highlighter), [Table reservation](https://www.assistant-ui.com/elements/generative-booking)
- [Task card](https://www.assistant-ui.com/elements/task-card), [Terminal block](https://www.assistant-ui.com/elements/terminal-block), [Thinking indicator](https://www.assistant-ui.com/elements/thinking-indicator), [Thread](https://www.assistant-ui.com/elements/thread), [Thread list](https://www.assistant-ui.com/elements/thread-list)
- [Thread list sidebar](https://www.assistant-ui.com/elements/thread-list-sidebar), [Thread search](https://www.assistant-ui.com/elements/thread-search), [Timeline](https://www.assistant-ui.com/elements/timeline), [Timestamps](https://www.assistant-ui.com/elements/day-separator), [Todo list](https://www.assistant-ui.com/elements/todo-list)
- [Tool call](https://www.assistant-ui.com/elements/tool-call), [Tool failure](https://www.assistant-ui.com/elements/tool-error), [Tool fallback](https://www.assistant-ui.com/elements/tool-fallback), [Tool group](https://www.assistant-ui.com/elements/tool-group), [Tool timeline](https://www.assistant-ui.com/elements/tool-timeline)
- [Tooltip icon button](https://www.assistant-ui.com/elements/tooltip-icon-button), [Trace waterfall](https://www.assistant-ui.com/elements/trace-waterfall), [Typing indicator](https://www.assistant-ui.com/elements/typing-indicator), [View event](https://www.assistant-ui.com/elements/generative-view-event), [Voice conversation](https://www.assistant-ui.com/elements/voice-conversation)
- [Web preview](https://www.assistant-ui.com/elements/web-preview), [Web search](https://www.assistant-ui.com/elements/web-search), [Weekly active users](https://www.assistant-ui.com/elements/generative-chart-area)

### assistant-ui primitives

19 entries.

- [Action Bar](https://www.assistant-ui.com/docs/api-reference/primitives/action-bar), [Action Bar More](https://www.assistant-ui.com/docs/api-reference/primitives/action-bar-more), [Assistant If](https://www.assistant-ui.com/docs/api-reference/primitives/assistant-if), [Assistant Modal](https://www.assistant-ui.com/docs/api-reference/primitives/assistant-modal), [Attachment](https://www.assistant-ui.com/docs/api-reference/primitives/attachment)
- [Branch Picker](https://www.assistant-ui.com/docs/api-reference/primitives/branch-picker), [Chain Of Thought](https://www.assistant-ui.com/docs/api-reference/primitives/chain-of-thought), [Composer](https://www.assistant-ui.com/docs/api-reference/primitives/composer), [Composition](https://www.assistant-ui.com/docs/api-reference/primitives/composition), [Error](https://www.assistant-ui.com/docs/api-reference/primitives/error)
- [Message](https://www.assistant-ui.com/docs/api-reference/primitives/message), [Message Part](https://www.assistant-ui.com/docs/api-reference/primitives/message-part), [Queue Item](https://www.assistant-ui.com/docs/api-reference/primitives/queue-item), [Selection Toolbar](https://www.assistant-ui.com/docs/api-reference/primitives/selection-toolbar), [Suggestion](https://www.assistant-ui.com/docs/api-reference/primitives/suggestion)
- [Thread](https://www.assistant-ui.com/docs/api-reference/primitives/thread), [Thread List](https://www.assistant-ui.com/docs/api-reference/primitives/thread-list), [Thread List Item](https://www.assistant-ui.com/docs/api-reference/primitives/thread-list-item), [Thread List Item More](https://www.assistant-ui.com/docs/api-reference/primitives/thread-list-item-more)

### AI Elements

21 entries. The current shadcn/ui catalog.

- [Chain of Thought](https://ui.shadcn.com/docs/ai-elements/base/chain-of-thought), [Chat](https://ui.shadcn.com/docs/ai-elements/base/chat), [Checkpoint](https://ui.shadcn.com/docs/ai-elements/base/checkpoint), [Confirmation](https://ui.shadcn.com/docs/ai-elements/base/confirmation), [Context](https://ui.shadcn.com/docs/ai-elements/base/context)
- [File Tree](https://ui.shadcn.com/docs/ai-elements/base/file-tree), [Inline Citation](https://ui.shadcn.com/docs/ai-elements/base/inline-citation), [Message](https://ui.shadcn.com/docs/ai-elements/base/message), [Model Selector](https://ui.shadcn.com/docs/ai-elements/base/model-selector), [Plan](https://ui.shadcn.com/docs/ai-elements/base/plan)
- [Prompt Input](https://ui.shadcn.com/docs/ai-elements/base/prompt-input), [Queue](https://ui.shadcn.com/docs/ai-elements/base/queue), [Reasoning](https://ui.shadcn.com/docs/ai-elements/base/reasoning), [Sources](https://ui.shadcn.com/docs/ai-elements/base/sources), [Stack Trace](https://ui.shadcn.com/docs/ai-elements/base/stack-trace)
- [Subagent](https://ui.shadcn.com/docs/ai-elements/base/subagent), [Suggestion](https://ui.shadcn.com/docs/ai-elements/base/suggestion), [Task](https://ui.shadcn.com/docs/ai-elements/base/task), [Terminal](https://ui.shadcn.com/docs/ai-elements/base/terminal), [Test Results](https://ui.shadcn.com/docs/ai-elements/base/test-results)
- [Tool](https://ui.shadcn.com/docs/ai-elements/base/tool)

### CopilotKit

42 entries. Components with pages in the official reference source tree.

- [AssistantMessage (react-native)](https://docs.copilotkit.ai/reference/react-native/components/AssistantMessage), [CopilotActivity (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotActivity), [CopilotChat](https://docs.copilotkit.ai/reference/components/CopilotChat), [CopilotChat (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChat), [CopilotChat (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotChat)
- [CopilotChat (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChat), [CopilotChatAssistantMessage](https://docs.copilotkit.ai/reference/components/CopilotChatAssistantMessage), [CopilotChatAssistantMessage (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChatAssistantMessage), [CopilotChatAssistantMessage (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChatAssistantMessage), [CopilotChatInput](https://docs.copilotkit.ai/reference/components/CopilotChatInput)
- [CopilotChatInput (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChatInput), [CopilotChatInput (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChatInput), [CopilotChatMessageView](https://docs.copilotkit.ai/reference/components/CopilotChatMessageView), [CopilotChatMessageView (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChatMessageView), [CopilotChatMessageView (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChatMessageView)
- [CopilotChatToolCallGroup](https://docs.copilotkit.ai/reference/components/CopilotChatToolCallGroup), [CopilotChatUserMessage](https://docs.copilotkit.ai/reference/components/CopilotChatUserMessage), [CopilotChatUserMessage (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChatUserMessage), [CopilotChatUserMessage (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChatUserMessage), [CopilotChatView](https://docs.copilotkit.ai/reference/components/CopilotChatView)
- [CopilotChatView (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotChatView), [CopilotChatView (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotChatView), [CopilotKit](https://docs.copilotkit.ai/reference/components/CopilotKit), [CopilotKitProvider (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotKitProvider), [CopilotKitProvider (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotKitProvider)
- [CopilotMarkdown (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotMarkdown), [CopilotModal (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotModal), [CopilotPopup](https://docs.copilotkit.ai/reference/components/CopilotPopup), [CopilotPopup (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotPopup), [CopilotPopup (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotPopup)
- [CopilotPopup (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotPopup), [CopilotSidebar](https://docs.copilotkit.ai/reference/components/CopilotSidebar), [CopilotSidebar (angular)](https://docs.copilotkit.ai/reference/angular/components/CopilotSidebar), [CopilotSidebar (react-native)](https://docs.copilotkit.ai/reference/react-native/components/CopilotSidebar), [CopilotSidebar (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotSidebar)
- [CopilotThreadsDrawer](https://docs.copilotkit.ai/reference/components/CopilotThreadsDrawer), [CopilotThreadsDrawer (vue)](https://docs.copilotkit.ai/reference/vue/components/CopilotThreadsDrawer), [GenerativeUIActivity (react-native)](https://docs.copilotkit.ai/reference/react-native/components/GenerativeUIActivity), [GenerativeUIProvider (react-native)](https://docs.copilotkit.ai/reference/react-native/components/GenerativeUIProvider), [GenerativeUISurface (react-native)](https://docs.copilotkit.ai/reference/react-native/components/GenerativeUISurface)
- [GenerativeUISurface (vue)](https://docs.copilotkit.ai/reference/vue/components/GenerativeUISurface), [UserMessage (react-native)](https://docs.copilotkit.ai/reference/react-native/components/UserMessage)

### Animate UI

88 entries. Published component, background and icon component docs. Framework and primitive variants can have separate pages.

- [Accordion](https://animate-ui.com/docs/primitives/base-ui/accordion), [Alert Dialog](https://animate-ui.com/docs/primitives/base-ui/alert-dialog), [Auto Height](https://animate-ui.com/docs/primitives/animate-ui/auto-height), [Avatar Group](https://animate-ui.com/docs/primitives/animate-ui/avatar-group), [Blur](https://animate-ui.com/docs/primitives/animate-ui/blur)
- [Bottom Navigation](https://animate-ui.com/docs/primitives/animate-ui/bottom-navigation), [Bubble Background](https://animate-ui.com/docs/backgrounds/bubble), [Button](https://animate-ui.com/docs/primitives/animate-ui/button), [Carousel](https://animate-ui.com/docs/primitives/animate-ui/carousel), [Checkbox](https://animate-ui.com/docs/primitives/base-ui/checkbox)
- [Click](https://animate-ui.com/docs/primitives/animate-ui/click), [Code Block](https://animate-ui.com/docs/primitives/animate-ui/code-block), [Collapsible](https://animate-ui.com/docs/primitives/base-ui/collapsible), [Combobox](https://animate-ui.com/docs/primitives/base-ui/combobox), [Context Menu](https://animate-ui.com/docs/primitives/base-ui/context-menu)
- [Copy Button](https://animate-ui.com/docs/primitives/animate-ui/copy-button), [Counting Number](https://animate-ui.com/docs/primitives/animate-ui/counting-number), [Cursor](https://animate-ui.com/docs/primitives/animate-ui/cursor), [Dialog](https://animate-ui.com/docs/primitives/base-ui/dialog), [Drawer](https://animate-ui.com/docs/primitives/base-ui/drawer)
- [Dropdown Menu](https://animate-ui.com/docs/primitives/base-ui/dropdown-menu), [Effect](https://animate-ui.com/docs/primitives/animate-ui/effect), [Fade](https://animate-ui.com/docs/primitives/animate-ui/fade), [Fireworks Background](https://animate-ui.com/docs/backgrounds/fireworks), [Flip Button](https://animate-ui.com/docs/primitives/animate-ui/flip-button)
- [Get Started](https://animate-ui.com/docs/icons/get-started), [GitHub Stars](https://animate-ui.com/docs/primitives/animate-ui/github-stars), [GitHub Stars Button](https://animate-ui.com/docs/primitives/animate-ui/github-stars-button), [Glyph Background](https://animate-ui.com/docs/backgrounds/glyph), [Gradient Background](https://animate-ui.com/docs/backgrounds/gradient)
- [Gradient Text](https://animate-ui.com/docs/primitives/animate-ui/gradient-text), [Gravity Stars Background](https://animate-ui.com/docs/backgrounds/gravity-stars), [Hexagon Background](https://animate-ui.com/docs/backgrounds/hexagon), [Highlight](https://animate-ui.com/docs/primitives/animate-ui/highlight), [Highlight Text](https://animate-ui.com/docs/primitives/animate-ui/highlight-text)
- [Hole Background](https://animate-ui.com/docs/backgrounds/hole), [Hover Card](https://animate-ui.com/docs/primitives/base-ui/hover-card), [Hugeicons](https://animate-ui.com/docs/icons/hugeicons), [Icon Button](https://animate-ui.com/docs/primitives/animate-ui/icon-button), [Image Zoom](https://animate-ui.com/docs/primitives/animate-ui/image-zoom)
- [Input OTP](https://animate-ui.com/docs/primitives/animate-ui/input-otp), [Liquid Button](https://animate-ui.com/docs/primitives/animate-ui/liquid-button), [Lucide Icons](https://animate-ui.com/docs/icons/lucide-icons), [Magnetic](https://animate-ui.com/docs/primitives/animate-ui/magnetic), [Menubar](https://animate-ui.com/docs/primitives/base-ui/menubar)
- [Morphing Text](https://animate-ui.com/docs/primitives/animate-ui/morphing-text), [Motion Grid](https://animate-ui.com/docs/primitives/animate-ui/motion-grid), [Navigation Menu](https://animate-ui.com/docs/primitives/base-ui/navigation-menu), [Page Transition](https://animate-ui.com/docs/primitives/animate-ui/page-transition), [Pagination](https://animate-ui.com/docs/primitives/base-ui/pagination)
- [Particles](https://animate-ui.com/docs/primitives/animate-ui/particles), [Pinned List](https://animate-ui.com/docs/primitives/animate-ui/pinned-list), [Popover](https://animate-ui.com/docs/primitives/base-ui/popover), [Preview Link Card](https://animate-ui.com/docs/primitives/base-ui/preview-link-card), [Progress](https://animate-ui.com/docs/primitives/base-ui/progress)
- [Questionnaire](https://animate-ui.com/docs/primitives/base-ui/questionnaire), [Radio Group](https://animate-ui.com/docs/primitives/base-ui/radio-group), [Ripple Button](https://animate-ui.com/docs/primitives/animate-ui/ripple-button), [Rolling Text](https://animate-ui.com/docs/primitives/animate-ui/rolling-text), [Rotating Text](https://animate-ui.com/docs/primitives/animate-ui/rotating-text)
- [Scroll Fade](https://animate-ui.com/docs/primitives/animate-ui/scroll-fade), [Scroll Progress](https://animate-ui.com/docs/primitives/animate-ui/scroll-progress), [Scrolling Number](https://animate-ui.com/docs/primitives/animate-ui/scrolling-number), [Select](https://animate-ui.com/docs/primitives/base-ui/select), [Sheet](https://animate-ui.com/docs/primitives/base-ui/sheet)
- [Shimmering Text](https://animate-ui.com/docs/primitives/animate-ui/shimmering-text), [Shine](https://animate-ui.com/docs/primitives/animate-ui/shine), [Sidebar](https://animate-ui.com/docs/primitives/base-ui/sidebar), [Slide](https://animate-ui.com/docs/primitives/animate-ui/slide), [Slider](https://animate-ui.com/docs/primitives/base-ui/slider)
- [Sliding Number](https://animate-ui.com/docs/primitives/animate-ui/sliding-number), [Sliding Text](https://animate-ui.com/docs/primitives/animate-ui/sliding-text), [Splitting Text](https://animate-ui.com/docs/primitives/animate-ui/splitting-text), [Spring](https://animate-ui.com/docs/primitives/animate-ui/spring), [Stars Background](https://animate-ui.com/docs/backgrounds/stars)
- [Swapping Text](https://animate-ui.com/docs/primitives/animate-ui/swapping-text), [Switch](https://animate-ui.com/docs/primitives/base-ui/switch), [Tabs](https://animate-ui.com/docs/primitives/base-ui/tabs), [Theme Toggler](https://animate-ui.com/docs/primitives/animate-ui/theme-toggler), [Theme Toggler Button](https://animate-ui.com/docs/primitives/animate-ui/theme-toggler-button)
- [Tilt](https://animate-ui.com/docs/primitives/animate-ui/tilt), [Toast](https://animate-ui.com/docs/primitives/base-ui/toast), [Toggle](https://animate-ui.com/docs/primitives/base-ui/toggle), [Toggle Group](https://animate-ui.com/docs/primitives/base-ui/toggle-group), [Tooltip](https://animate-ui.com/docs/primitives/base-ui/tooltip)
- [Topography Background](https://animate-ui.com/docs/backgrounds/topography), [Typing Text](https://animate-ui.com/docs/primitives/animate-ui/typing-text), [Zoom](https://animate-ui.com/docs/primitives/animate-ui/zoom)

### Arc UI

392 entries. Components, blocks and screens listed by Arc. Paid entries are public design references.

- [Accordion](https://uiarc.dev/components/accordion), [Account health](https://uiarc.dev/components/blocks/account-health), [Action button](https://uiarc.dev/components/action-button), [Action morph](https://uiarc.dev/components/action-morph), [Action swap](https://uiarc.dev/components/action-swap)
- [Activity feed](https://uiarc.dev/components/blocks/activity-feed), [Activity heatmap](https://uiarc.dev/components/activity-heatmap), [Activity rings](https://uiarc.dev/components/activity-rings), [Activity terrain](https://uiarc.dev/components/blocks/activity-terrain), [Agent approvals](https://uiarc.dev/components/blocks/agent-approvals)
- [Agent builder](https://uiarc.dev/components/blocks/agent-builder), [Agent cursor](https://uiarc.dev/components/agent-cursor), [Agent gallery](https://uiarc.dev/components/blocks/agent-gallery), [Agent handoff](https://uiarc.dev/components/agent-handoff), [Agent loop](https://uiarc.dev/components/agent-loop)
- [Agent memory](https://uiarc.dev/components/blocks/agent-memory), [Agent orchestrator](https://uiarc.dev/components/blocks/agent-orchestrator), [Agent plan](https://uiarc.dev/components/agent-plan), [Agent routines](https://uiarc.dev/components/blocks/agent-routines), [Agent run](https://uiarc.dev/components/blocks/agent-run)
- [Agent status](https://uiarc.dev/components/agent-status), [Agent tasks](https://uiarc.dev/components/blocks/agent-tasks), [Agent timeline](https://uiarc.dev/components/agent-timeline), [AI answer](https://uiarc.dev/components/blocks/ai-answer), [AI chat](https://uiarc.dev/components/blocks/ai-chat)
- [AI command](https://uiarc.dev/components/ai-command), [AI composer](https://uiarc.dev/components/blocks/ai-composer), [AI feature launch](https://uiarc.dev/components/blocks/ai-feature-launch), [AI inline edit](https://uiarc.dev/components/blocks/ai-inline-edit), [AI insight card](https://uiarc.dev/components/blocks/ai-insight-card)
- [AI mascot](https://uiarc.dev/components/ai-mascot), [AI search bar](https://uiarc.dev/components/blocks/ai-search-bar), [AI setup wizard](https://uiarc.dev/components/blocks/ai-setup-wizard), [AI side panel](https://uiarc.dev/components/blocks/ai-side-panel), [AI spark](https://uiarc.dev/components/ai-spark)
- [AI translate](https://uiarc.dev/components/ai-translate), [AI workflow](https://uiarc.dev/components/ai-workflow), [Alert](https://uiarc.dev/components/alert), [Animated counter](https://uiarc.dev/components/animated-counter), [Announcement bar](https://uiarc.dev/components/announcement-bar)
- [API keys](https://uiarc.dev/components/blocks/api-keys), [Ask your data](https://uiarc.dev/components/ask-your-data), [Availability picker](https://uiarc.dev/components/blocks/availability-picker), [Avatar](https://uiarc.dev/components/avatar), [Avatar group](https://uiarc.dev/components/avatar-group)
- [Avatar upload](https://uiarc.dev/components/avatar-upload), [Badge](https://uiarc.dev/components/badge), [Bar chart](https://uiarc.dev/components/bar-chart), [Billing overview](https://uiarc.dev/components/blocks/billing-overview), [Billing toggle](https://uiarc.dev/components/billing-toggle)
- [Black hole](https://uiarc.dev/components/black-hole), [Blog grid](https://uiarc.dev/components/blocks/blog-grid), [Booking pill](https://uiarc.dev/components/booking-pill), [Bottom sheet](https://uiarc.dev/components/bottom-sheet), [Branch graph](https://uiarc.dev/components/branch-graph)
- [Breadcrumb](https://uiarc.dev/components/breadcrumb), [Brush chart](https://uiarc.dev/components/brush-chart), [Budget variance](https://uiarc.dev/components/blocks/budget-variance), [Button](https://uiarc.dev/components/button), [Button group](https://uiarc.dev/components/button-group)
- [Calendar](https://uiarc.dev/components/calendar), [Call insights](https://uiarc.dev/components/blocks/call-insights), [Cancel flow](https://uiarc.dev/components/blocks/cancel-flow), [Card](https://uiarc.dev/components/card), [Card stack](https://uiarc.dev/components/card-stack)
- [Card to article](https://uiarc.dev/components/card-to-article), [Carousel](https://uiarc.dev/components/carousel), [Cart drawer](https://uiarc.dev/components/blocks/cart-drawer), [Catch up](https://uiarc.dev/components/blocks/catch-up), [Celebrate button](https://uiarc.dev/components/celebrate-button)
- [Centered login](https://uiarc.dev/components/blocks/login-centered), [Changelog feed](https://uiarc.dev/components/blocks/changelog-feed), [Charge session](https://uiarc.dev/components/charge-session), [Chat thread](https://uiarc.dev/components/chat-thread), [Checkbox](https://uiarc.dev/components/checkbox)
- [Checkout summary](https://uiarc.dev/components/blocks/checkout-summary), [Chip group](https://uiarc.dev/components/chip-group), [Choropleth explorer](https://uiarc.dev/components/blocks/choropleth-explorer), [Code block](https://uiarc.dev/components/code-block), [Code review](https://uiarc.dev/components/blocks/code-review)
- [Code suggestion](https://uiarc.dev/components/code-suggestion), [Cohort retention](https://uiarc.dev/components/blocks/cohort-retention), [Color picker](https://uiarc.dev/components/color-picker), [Combobox](https://uiarc.dev/components/combobox), [Command palette](https://uiarc.dev/components/blocks/command-palette)
- [Comment thread](https://uiarc.dev/components/comment-thread), [Comparison table](https://uiarc.dev/components/blocks/comparison-table), [Confirm morph](https://uiarc.dev/components/confirm-morph), [Confirm popover](https://uiarc.dev/components/confirm-popover), [Connected scatter](https://uiarc.dev/components/blocks/connected-scatter)
- [Connector setup](https://uiarc.dev/components/connector-setup), [Contact section](https://uiarc.dev/components/blocks/contact-section), [Context menu](https://uiarc.dev/components/context-menu), [Context window](https://uiarc.dev/components/context-window), [Control center](https://uiarc.dev/components/control-center)
- [Cookie consent](https://uiarc.dev/components/cookie-consent), [Copy button](https://uiarc.dev/components/copy-button), [Countdown](https://uiarc.dev/components/countdown), [Cover flow](https://uiarc.dev/components/cover-flow), [Credit top-up](https://uiarc.dev/components/blocks/credit-topup)
- [CTA section](https://uiarc.dev/components/blocks/cta-section), [Cube mascot](https://uiarc.dev/components/cube-mascot), [Cursor trail draw](https://uiarc.dev/components/cursor-trail-draw), [Customer galaxy](https://uiarc.dev/components/blocks/customer-galaxy), [Data flow](https://uiarc.dev/components/data-flow)
- [Data grid](https://uiarc.dev/components/data-grid), [Date picker](https://uiarc.dev/components/date-picker), [Date range picker](https://uiarc.dev/components/date-range-picker), [Date reel](https://uiarc.dev/components/date-reel), [Delivery tracker](https://uiarc.dev/components/blocks/delivery-tracker)
- [Dialog](https://uiarc.dev/components/dialog), [Dictation button](https://uiarc.dev/components/dictation-button), [DNS resolution](https://uiarc.dev/components/dns-resolution), [Dock](https://uiarc.dev/components/dock), [Docs sidebar](https://uiarc.dev/components/blocks/docs-sidebar)
- [Document extraction](https://uiarc.dev/components/blocks/document-extract), [Domain verify](https://uiarc.dev/components/blocks/domain-verify), [Donut chart](https://uiarc.dev/components/donut-chart), [Dot grid](https://uiarc.dev/components/dot-grid), [Drawer](https://uiarc.dev/components/drawer)
- [Dropdown menu](https://uiarc.dev/components/dropdown-menu), [Eclipse](https://uiarc.dev/components/theme-switch-eclipse), [Elastic slider](https://uiarc.dev/components/elastic-slider), [Emoji picker](https://uiarc.dev/components/emoji-picker), [Empty state](https://uiarc.dev/components/empty-state)
- [Empty states](https://uiarc.dev/components/blocks/empty-states), [Enrich column](https://uiarc.dev/components/enrich-column), [Environment variables](https://uiarc.dev/components/blocks/env-variables), [Eval suite](https://uiarc.dev/components/blocks/eval-suite), [Expandable card](https://uiarc.dev/components/expandable-card)
- [Expandable text](https://uiarc.dev/components/expandable-text), [Expanding button group](https://uiarc.dev/components/expanding-button-group), [Expanding search](https://uiarc.dev/components/expanding-search), [Exploded view](https://uiarc.dev/components/blocks/exploded-view), [FAQ section](https://uiarc.dev/components/blocks/faq-section)
- [Feature bento](https://uiarc.dev/components/blocks/feature-bento), [Feature voting](https://uiarc.dev/components/blocks/feature-voting), [Feedback board](https://uiarc.dev/components/blocks/feedback-board), [Feedback morph](https://uiarc.dev/components/feedback-morph), [File dropzone](https://uiarc.dev/components/file-dropzone)
- [File upload](https://uiarc.dev/components/blocks/file-upload), [Filter toolbar](https://uiarc.dev/components/filter-toolbar), [Floating button group](https://uiarc.dev/components/floating-button-group), [Funnel chart](https://uiarc.dev/components/funnel-chart), [Gantt timeline](https://uiarc.dev/components/screens/gantt-timeline)
- [Gauge](https://uiarc.dev/components/gauge), [Generation stats](https://uiarc.dev/components/generation-stats), [Ghost mascot](https://uiarc.dev/components/ghost-mascot), [Ghost text](https://uiarc.dev/components/ghost-text), [Glass card](https://uiarc.dev/components/glass-card)
- [Glass menu](https://uiarc.dev/components/glass-menu), [Glass segmented](https://uiarc.dev/components/glass-segmented), [Glass tab bar](https://uiarc.dev/components/glass-tabbar), [Goal tracker](https://uiarc.dev/components/blocks/goal-tracker), [Gravity well](https://uiarc.dev/components/gravity-well)
- [Help center](https://uiarc.dev/components/screens/help-center), [Hero section](https://uiarc.dev/components/blocks/hero-section), [Hero signup](https://uiarc.dev/components/blocks/hero-signup), [Hold to confirm](https://uiarc.dev/components/hold-to-confirm), [Holo card](https://uiarc.dev/components/holo-card)
- [Horizon chart](https://uiarc.dev/components/blocks/horizon-chart), [Hover card](https://uiarc.dev/components/hover-card), [Icon morph](https://uiarc.dev/components/icon-morph), [Image compare](https://uiarc.dev/components/image-compare), [Image generation](https://uiarc.dev/components/image-generation)
- [Image reveal](https://uiarc.dev/components/image-reveal), [Image trail](https://uiarc.dev/components/image-trail), [Immersive login](https://uiarc.dev/components/blocks/login-immersive), [Import wizard](https://uiarc.dev/components/blocks/import-wizard), [In-view title](https://uiarc.dev/components/in-view-title)
- [Inbox sidebar](https://uiarc.dev/components/blocks/inbox-sidebar), [Inbox triage](https://uiarc.dev/components/screens/inbox-triage), [Ink fluid](https://uiarc.dev/components/ink-fluid), [Inline edit](https://uiarc.dev/components/inline-edit), [Input](https://uiarc.dev/components/input)
- [Install snippet](https://uiarc.dev/components/install-snippet), [Integrations](https://uiarc.dev/components/blocks/integrations), [Invite people](https://uiarc.dev/components/blocks/invite-people), [Invoice studio](https://uiarc.dev/components/screens/invoice-studio), [Journey flow](https://uiarc.dev/components/blocks/journey-flow)
- [JSON viewer](https://uiarc.dev/components/json-viewer), [Kanban board](https://uiarc.dev/components/screens/kanban-board), [Keycap keyboard](https://uiarc.dev/components/keycap-keyboard), [Knowledge base](https://uiarc.dev/components/blocks/knowledge-base), [KPI drilldown](https://uiarc.dev/components/blocks/kpi-drilldown)
- [Layout morph](https://uiarc.dev/components/blocks/layout-morph), [Lead scoring](https://uiarc.dev/components/blocks/lead-scoring), [Lens range](https://uiarc.dev/components/lens-range), [Lightbox gallery](https://uiarc.dev/components/lightbox-gallery), [Line chart](https://uiarc.dev/components/line-chart)
- [Line replay](https://uiarc.dev/components/blocks/line-replay), [Link unfurl](https://uiarc.dev/components/link-unfurl), [Liquid tab bar](https://uiarc.dev/components/liquid-tab-bar), [Live checkout](https://uiarc.dev/components/blocks/checkout-live), [Live visitors](https://uiarc.dev/components/live-visitors)
- [LLM cost calculator](https://uiarc.dev/components/llm-cost-calculator), [Login split](https://uiarc.dev/components/blocks/login-split), [Logo marquee](https://uiarc.dev/components/blocks/logo-marquee), [Magic link](https://uiarc.dev/components/blocks/magic-link), [Market terminal](https://uiarc.dev/components/screens/market-terminal)
- [MCP servers](https://uiarc.dev/components/blocks/mcp-servers), [Media player](https://uiarc.dev/components/blocks/media-player), [Meeting summary](https://uiarc.dev/components/meeting-summary), [Mega menu morph](https://uiarc.dev/components/mega-menu-morph), [Mention input](https://uiarc.dev/components/mention-input)
- [Metric card](https://uiarc.dev/components/metric-card), [Metric explorer](https://uiarc.dev/components/blocks/metric-explorer), [Metric ticker](https://uiarc.dev/components/metric-ticker), [Metrics dashboard](https://uiarc.dev/components/screens/metrics-dashboard), [Mixture of experts](https://uiarc.dev/components/mixture-of-experts)
- [Model arena](https://uiarc.dev/components/blocks/model-arena), [Model card](https://uiarc.dev/components/model-card), [Model picker](https://uiarc.dev/components/blocks/model-picker), [Model training](https://uiarc.dev/components/model-training), [Money input](https://uiarc.dev/components/money-input)
- [Month calendar](https://uiarc.dev/components/screens/month-calendar), [Morph loader](https://uiarc.dev/components/morph-loader), [Morph nav](https://uiarc.dev/components/morph-nav), [Morph select](https://uiarc.dev/components/morph-select), [MRR waterfall](https://uiarc.dev/components/blocks/mrr-waterfall)
- [Multi-region failover](https://uiarc.dev/components/multi-region-failover), [Multi-select](https://uiarc.dev/components/multi-select), [Multi-step form](https://uiarc.dev/components/blocks/multi-step-form), [Newsletter signup](https://uiarc.dev/components/blocks/newsletter-signup), [Notification center](https://uiarc.dev/components/blocks/notification-center)
- [Now playing](https://uiarc.dev/components/now-playing), [Number field](https://uiarc.dev/components/number-field), [Onboarding checklist](https://uiarc.dev/components/onboarding-checklist), [Onboarding illustration](https://uiarc.dev/components/blocks/onboarding-illustration), [Onboarding survey](https://uiarc.dev/components/blocks/onboarding-survey)
- [Orbit logos](https://uiarc.dev/components/orbit-logos), [Orbit menu](https://uiarc.dev/components/orbit-menu), [OTP input](https://uiarc.dev/components/blocks/otp-input), [Page curl](https://uiarc.dev/components/page-curl), [Page header](https://uiarc.dev/components/blocks/page-header)
- [Pagination](https://uiarc.dev/components/pagination), [Password field](https://uiarc.dev/components/password-field), [Password strength](https://uiarc.dev/components/password-strength), [Payment flow](https://uiarc.dev/components/payment-flow), [Phone input](https://uiarc.dev/components/phone-input)
- [Photo grid](https://uiarc.dev/components/photo-grid), [PII redaction](https://uiarc.dev/components/pii-redaction), [Pivot builder](https://uiarc.dev/components/blocks/pivot-builder), [Pixel mascot](https://uiarc.dev/components/pixel-mascot), [Plan comparison](https://uiarc.dev/components/blocks/plan-comparison)
- [Popover](https://uiarc.dev/components/popover), [Presence stack](https://uiarc.dev/components/presence-stack), [Pricing calculator](https://uiarc.dev/components/blocks/pricing-calculator), [Prize wheel](https://uiarc.dev/components/prize-wheel), [Product detail](https://uiarc.dev/components/screens/product-detail)
- [Product gallery](https://uiarc.dev/components/product-gallery), [Product listing](https://uiarc.dev/components/screens/product-listing), [Profile page](https://uiarc.dev/components/blocks/profile-page), [Progress](https://uiarc.dev/components/progress), [Project board](https://uiarc.dev/components/screens/project-board)
- [Prompt cache](https://uiarc.dev/components/prompt-cache), [Prompt studio](https://uiarc.dev/components/blocks/prompt-studio), [Provider keys](https://uiarc.dev/components/provider-keys), [Provider status](https://uiarc.dev/components/provider-status), [Race bar chart](https://uiarc.dev/components/race-bar-chart)
- [Radar chart](https://uiarc.dev/components/radar-chart), [Radio cards](https://uiarc.dev/components/radio-cards), [Radio group](https://uiarc.dev/components/radio-group), [Range histogram slider](https://uiarc.dev/components/range-histogram-slider), [Rating](https://uiarc.dev/components/rating)
- [Reactions](https://uiarc.dev/components/reactions), [Realtime stream](https://uiarc.dev/components/realtime-stream), [Reasoning block](https://uiarc.dev/components/reasoning-block), [Reasoning tree](https://uiarc.dev/components/reasoning-tree), [Referral card](https://uiarc.dev/components/referral-card)
- [Release readiness](https://uiarc.dev/components/blocks/release-readiness), [Reorderable list](https://uiarc.dev/components/reorderable-list), [Reply draft](https://uiarc.dev/components/reply-draft), [Research run](https://uiarc.dev/components/blocks/research-run), [Resizable panels](https://uiarc.dev/components/resizable-panels)
- [Response feedback](https://uiarc.dev/components/response-feedback), [Revenue explorer](https://uiarc.dev/components/blocks/revenue-explorer), [Revenue globe](https://uiarc.dev/components/blocks/revenue-globe), [Rich text editor](https://uiarc.dev/components/rich-text-editor), [Ridgeline](https://uiarc.dev/components/ridgeline)
- [Rise](https://uiarc.dev/components/theme-switch-rise), [Roles and permissions](https://uiarc.dev/components/blocks/roles-permissions), [Ruler slider](https://uiarc.dev/components/ruler-slider), [Sand text](https://uiarc.dev/components/sand-text), [Sankey flow](https://uiarc.dev/components/sankey-flow)
- [Scroll area](https://uiarc.dev/components/scroll-area), [Scroll story](https://uiarc.dev/components/blocks/scroll-story), [Scrub input](https://uiarc.dev/components/scrub-input), [Search field](https://uiarc.dev/components/search-field), [Search results](https://uiarc.dev/components/blocks/search-results)
- [Seat manager](https://uiarc.dev/components/blocks/seat-manager), [Seat map](https://uiarc.dev/components/blocks/seat-map), [Security settings](https://uiarc.dev/components/blocks/security-settings), [Segmented control](https://uiarc.dev/components/segmented-control), [Select](https://uiarc.dev/components/select)
- [Selection toolbar](https://uiarc.dev/components/blocks/selection-toolbar), [Semantic zoom](https://uiarc.dev/components/blocks/semantic-zoom), [Settings command](https://uiarc.dev/components/blocks/settings-command), [Settings page](https://uiarc.dev/components/blocks/settings-page), [Share access](https://uiarc.dev/components/share-access)
- [Share sheet](https://uiarc.dev/components/share-sheet), [Sheet stack](https://uiarc.dev/components/sheet-stack), [Shortcut recorder](https://uiarc.dev/components/shortcut-recorder), [Sidebar rail](https://uiarc.dev/components/blocks/sidebar-rail), [Sign in](https://uiarc.dev/components/blocks/sign-in)
- [Sign up form](https://uiarc.dev/components/blocks/signup-form), [Signature pad](https://uiarc.dev/components/signature-pad), [Site footer](https://uiarc.dev/components/blocks/site-footer), [Site header](https://uiarc.dev/components/blocks/site-header), [Skeleton](https://uiarc.dev/components/skeleton)
- [Skeleton morph](https://uiarc.dev/components/skeleton-morph), [Slide to confirm](https://uiarc.dev/components/slide-to-confirm), [Slider](https://uiarc.dev/components/slider), [Slope chart](https://uiarc.dev/components/slope-chart), [Slot text](https://uiarc.dev/components/slot-text)
- [Small multiples](https://uiarc.dev/components/blocks/small-multiples), [Smart form fill](https://uiarc.dev/components/smart-form-fill), [Smart scheduler](https://uiarc.dev/components/blocks/smart-scheduler), [Social proof toast](https://uiarc.dev/components/social-proof-toast), [Sortable data table](https://uiarc.dev/components/sortable-data-table)
- [Source cards](https://uiarc.dev/components/source-cards), [Sparkline](https://uiarc.dev/components/sparkline), [Speculative decoding](https://uiarc.dev/components/speculative-decoding), [Speech player](https://uiarc.dev/components/speech-player), [Spend alert](https://uiarc.dev/components/blocks/spend-alert)
- [Split](https://uiarc.dev/components/theme-switch-split), [Split bar](https://uiarc.dev/components/split-bar), [Split button](https://uiarc.dev/components/split-button), [Spotlight grid](https://uiarc.dev/components/blocks/spotlight-grid), [Starter prompts](https://uiarc.dev/components/starter-prompts)
- [Stats band](https://uiarc.dev/components/blocks/stats-band), [Stepper](https://uiarc.dev/components/stepper), [Sticker peel](https://uiarc.dev/components/sticker-peel), [Streamgraph](https://uiarc.dev/components/streamgraph), [Stretch refresh](https://uiarc.dev/components/stretch-refresh)
- [Studio perspectives](https://uiarc.dev/components/blocks/testimonial-stage), [Sunburst](https://uiarc.dev/components/sunburst), [Support conversation](https://uiarc.dev/components/screens/support-conversation), [Support widget](https://uiarc.dev/components/blocks/support-widget), [Swipe actions](https://uiarc.dev/components/swipe-actions)
- [Switch](https://uiarc.dev/components/switch), [Table of contents progress](https://uiarc.dev/components/toc-progress), [Tabs](https://uiarc.dev/components/tabs), [Tag input](https://uiarc.dev/components/tag-input), [Task breakdown](https://uiarc.dev/components/blocks/task-breakdown)
- [Team directory](https://uiarc.dev/components/screens/team-directory), [Team members](https://uiarc.dev/components/blocks/team-members), [Team showcase](https://uiarc.dev/components/blocks/team-showcase), [Team switcher](https://uiarc.dev/components/team-switcher), [Text morph](https://uiarc.dev/components/text-morph)
- [Text reveal](https://uiarc.dev/components/text-reveal), [Text shimmer](https://uiarc.dev/components/text-shimmer), [Textarea](https://uiarc.dev/components/textarea), [Theme switcher](https://uiarc.dev/components/theme-switch), [Ticket router](https://uiarc.dev/components/ticket-router)
- [Ticket tear](https://uiarc.dev/components/ticket-tear), [Time dial](https://uiarc.dev/components/time-dial), [Time picker](https://uiarc.dev/components/time-picker), [Timeline](https://uiarc.dev/components/timeline), [TL;DR toggle](https://uiarc.dev/components/tldr-toggle)
- [Toast](https://uiarc.dev/components/toast), [Toast stack](https://uiarc.dev/components/toast-stack), [Toggle group](https://uiarc.dev/components/toggle-group), [Tone tuner](https://uiarc.dev/components/tone-tuner), [Tool call](https://uiarc.dev/components/tool-call)
- [Tooltip](https://uiarc.dev/components/tooltip), [Training run](https://uiarc.dev/components/training-run), [Tree table](https://uiarc.dev/components/tree-table), [Tree view](https://uiarc.dev/components/tree-view), [Treemap](https://uiarc.dev/components/treemap)
- [Trial banner](https://uiarc.dev/components/trial-banner), [Two-factor setup](https://uiarc.dev/components/blocks/two-factor-setup), [Typewriter terminal](https://uiarc.dev/components/typewriter-terminal), [Undo toast](https://uiarc.dev/components/undo-toast), [Upgrade prompt](https://uiarc.dev/components/upgrade-prompt)
- [Uptime status](https://uiarc.dev/components/blocks/uptime-status), [Usage billing](https://uiarc.dev/components/blocks/usage-billing), [Usage forecast](https://uiarc.dev/components/blocks/usage-forecast), [Usage meter](https://uiarc.dev/components/usage-meter), [Usage pricing](https://uiarc.dev/components/blocks/usage-pricing)
- [User menu](https://uiarc.dev/components/user-menu), [Vector search](https://uiarc.dev/components/vector-search), [Voice orb](https://uiarc.dev/components/voice-orb), [Voice recorder](https://uiarc.dev/components/voice-recorder), [Waffle chart](https://uiarc.dev/components/waffle-chart)
- [Wallet card](https://uiarc.dev/components/blocks/wallet-card), [Wallet stack](https://uiarc.dev/components/wallet-stack), [Webhook tester](https://uiarc.dev/components/blocks/webhook-tester), [Webhooks](https://uiarc.dev/components/blocks/webhooks), [Week calendar](https://uiarc.dev/components/screens/week-calendar)
- [Window range](https://uiarc.dev/components/window-range), [Workspace sidebar](https://uiarc.dev/components/blocks/workspace-sidebar)

### beUI Pro

161 entries. Public web and React Native catalog pages. A page can contain several preview variants.

- [404 Pages](https://pro.beui.dev/components/not-found-pages), [About](https://pro.beui.dev/components/about), [Accounts & history](https://pro.beui.dev/components/mobile/accounts-and-history), [Add & receive](https://pro.beui.dev/components/mobile/add-and-receive), [Agenda](https://pro.beui.dev/components/mobile/agenda)
- [Agent Builder](https://pro.beui.dev/components/agent-builder), [Agent Chat Input](https://pro.beui.dev/components/agent-chat-input), [Agent Plan](https://pro.beui.dev/components/agent-plan), [Agent questions](https://pro.beui.dev/components/mobile/agent-questions), [Agent tasks](https://pro.beui.dev/components/mobile/agent-tasks)
- [Agent Team](https://pro.beui.dev/components/agent-team), [Agent Traces](https://pro.beui.dev/components/agent-traces), [AI Agent Landing](https://pro.beui.dev/components/ai-landing), [AI Artifacts](https://pro.beui.dev/components/ai-artifacts), [AI Thinking Loaders](https://pro.beui.dev/components/ai-thinking-loader)
- [AI Workspace](https://pro.beui.dev/components/ai-workspace-landing), [Airdrop Claim](https://pro.beui.dev/components/airdrop-claim), [Analytics Landing](https://pro.beui.dev/components/analytics-landing), [Animated Dropdown](https://pro.beui.dev/components/animated-dropdown), [Animated Modal](https://pro.beui.dev/components/animated-modal)
- [Animated Select](https://pro.beui.dev/components/animated-select), [Animated Text](https://pro.beui.dev/components/animated-text), [Announcement Banners](https://pro.beui.dev/components/announcement-banners), [API Keys](https://pro.beui.dev/components/api-keys), [App Showcase](https://pro.beui.dev/components/app-showcase)
- [Approval Queue](https://pro.beui.dev/components/approval-queue), [Audit Trail](https://pro.beui.dev/components/audit-trail), [Auth](https://pro.beui.dev/components/auth), [Background Agents](https://pro.beui.dev/components/background-agents), [Bento Showcase](https://pro.beui.dev/components/bento-showcase)
- [Blog Pages](https://pro.beui.dev/components/blog-pages), [Blog Sections](https://pro.beui.dev/components/blog-sections), [Calendar](https://pro.beui.dev/components/calendar), [Card controls](https://pro.beui.dev/components/mobile/card-controls), [Cards](https://pro.beui.dev/components/cards)
- [Careers](https://pro.beui.dev/components/careers), [Case Studies](https://pro.beui.dev/components/case-studies), [Changelog Pages](https://pro.beui.dev/components/changelog-pages), [Charts](https://pro.beui.dev/components/charts), [Checkout Pages](https://pro.beui.dev/components/checkout-pages)
- [Command Palette](https://pro.beui.dev/components/command-palette), [Comparison](https://pro.beui.dev/components/comparison), [Contact](https://pro.beui.dev/components/contact), [Content Sections](https://pro.beui.dev/components/content-sections), [Context Window](https://pro.beui.dev/components/context-window)
- [Conversion Funnel](https://pro.beui.dev/components/conversion-funnel), [Cookie Consent](https://pro.beui.dev/components/cookie-consent), [Credit Usage](https://pro.beui.dev/components/credit-usage), [Crypto Agent](https://pro.beui.dev/components/crypto-agent), [Crypto Governance](https://pro.beui.dev/components/crypto-governance)
- [Crypto Landing](https://pro.beui.dev/components/crypto-landing), [Crypto Markets](https://pro.beui.dev/components/crypto-markets), [Crypto Wallet](https://pro.beui.dev/components/crypto-wallet), [CTA Sections](https://pro.beui.dev/components/cta-sections), [Dashboards](https://pro.beui.dev/components/dashboards)
- [Data Table](https://pro.beui.dev/components/data-table), [Data Tables](https://pro.beui.dev/components/data-tables), [Deep research](https://pro.beui.dev/components/mobile/deep-research), [Deployments](https://pro.beui.dev/components/deployments), [Devtool Landing](https://pro.beui.dev/components/devtool-landing)
- [Diff Review](https://pro.beui.dev/components/diff-review), [Docs Pages](https://pro.beui.dev/components/docs-pages), [Ecommerce](https://pro.beui.dev/components/ecommerce), [Ecommerce](https://pro.beui.dev/components/mobile/ecommerce), [Emoji Picker](https://pro.beui.dev/components/emoji-picker)
- [Empty & error states](https://pro.beui.dev/components/mobile/app-states), [Empty States](https://pro.beui.dev/components/empty-states), [Eval Results](https://pro.beui.dev/components/eval-results), [FAQ Blocks](https://pro.beui.dev/components/faq-blocks), [Feature Sections](https://pro.beui.dev/components/feature-sections)
- [File Manager](https://pro.beui.dev/components/file-manager), [File Upload](https://pro.beui.dev/components/file-upload), [Flip Card](https://pro.beui.dev/components/flip-card), [Folio Crypto Portfolio](https://pro.beui.dev/components/folio-finance-dashboard), [Footer Sections](https://pro.beui.dev/components/footer-sections)
- [Headers & menus](https://pro.beui.dev/components/mobile/headers-and-menus), [Hero Sections](https://pro.beui.dev/components/hero-sections), [Home dashboard](https://pro.beui.dev/components/mobile/home-dashboard), [How It Works](https://pro.beui.dev/components/how-it-works), [Hunch Prediction Markets](https://pro.beui.dev/components/hunch-social-prediction)
- [Image Galleries](https://pro.beui.dev/components/image-galleries), [Integrations](https://pro.beui.dev/components/integrations), [Invoice](https://pro.beui.dev/components/invoice), [Kanban Board](https://pro.beui.dev/components/kanban-board), [Knowledge Base](https://pro.beui.dev/components/knowledge-base)
- [KPI Overview](https://pro.beui.dev/components/kpi-overview), [Leaderboard](https://pro.beui.dev/components/leaderboard), [Leaderboard](https://pro.beui.dev/components/mobile/leaderboard), [Legal Pages](https://pro.beui.dev/components/legal-pages), [Live Collaboration](https://pro.beui.dev/components/collaboration)
- [Location permission](https://pro.beui.dev/components/mobile/location-permission), [Log Explorer](https://pro.beui.dev/components/log-explorer), [Log in](https://pro.beui.dev/components/mobile/log-in), [Logo Cloud](https://pro.beui.dev/components/logo-cloud), [Mascot](https://pro.beui.dev/components/mobile/mascot)
- [MCP Connectors](https://pro.beui.dev/components/mcp-connectors), [Messaging](https://pro.beui.dev/components/messaging), [Messaging](https://pro.beui.dev/components/mobile/messaging), [Mobile Crypto Landing](https://pro.beui.dev/components/mobile-crypto-landing), [Model Picker](https://pro.beui.dev/components/model-picker)
- [Morphic Card Modal](https://pro.beui.dev/components/morphic-card-modal), [Morphic Tooltip](https://pro.beui.dev/components/morphic-tooltip), [Navbar](https://pro.beui.dev/components/navbar), [Newsletter](https://pro.beui.dev/components/newsletter), [Notification Center](https://pro.beui.dev/components/notification-center)
- [Notifications](https://pro.beui.dev/components/mobile/notifications), [Onboarding](https://pro.beui.dev/components/onboarding), [Onboarding](https://pro.beui.dev/components/mobile/onboarding), [Order Tracking](https://pro.beui.dev/components/order-tracking), [Pair AI Workspace](https://pro.beui.dev/components/pair-ai-workspace)
- [Password & passcode](https://pro.beui.dev/components/mobile/password-and-passcode), [Paywalls](https://pro.beui.dev/components/mobile/paywalls), [Performance Report](https://pro.beui.dev/components/performance-report), [Personal Website](https://pro.beui.dev/components/personal-website), [Pricing](https://pro.beui.dev/components/pricing)
- [Pricing Pages](https://pro.beui.dev/components/pricing-pages), [Product Tour](https://pro.beui.dev/components/product-tour), [Profile](https://pro.beui.dev/components/mobile/profile), [Prompt input](https://pro.beui.dev/components/mobile/prompt-input), [Prompt Library](https://pro.beui.dev/components/prompt-library)
- [Questionnaire](https://pro.beui.dev/components/questionnaire), [Ratings](https://pro.beui.dev/components/mobile/ratings), [Receipt](https://pro.beui.dev/components/receipt), [Referral Rewards](https://pro.beui.dev/components/referral-rewards), [Research Sources](https://pro.beui.dev/components/research-sources)
- [Roadmap](https://pro.beui.dev/components/roadmap), [Search & filters](https://pro.beui.dev/components/mobile/search-and-filters), [Search Pages](https://pro.beui.dev/components/search-pages), [Send & split](https://pro.beui.dev/components/mobile/send-and-split), [Settings](https://pro.beui.dev/components/mobile/settings)
- [Settings Pages](https://pro.beui.dev/components/settings-pages), [Sidebar](https://pro.beui.dev/components/sidebar), [Sign up](https://pro.beui.dev/components/mobile/sign-up), [Social](https://pro.beui.dev/components/mobile/social), [Social Proof](https://pro.beui.dev/components/social-proof)
- [Stats](https://pro.beui.dev/components/stats), [Status Pages](https://pro.beui.dev/components/status-pages), [Step Form](https://pro.beui.dev/components/step-form), [Subscription](https://pro.beui.dev/components/mobile/subscription), [Swap & earn](https://pro.beui.dev/components/mobile/swap-and-earn)
- [Tab bars](https://pro.beui.dev/components/mobile/tab-bars), [Team](https://pro.beui.dev/components/team), [Team Invites](https://pro.beui.dev/components/team-invite), [Testimonials](https://pro.beui.dev/components/testimonials), [Tokenomics](https://pro.beui.dev/components/tokenomics)
- [Tool Approval](https://pro.beui.dev/components/tool-approval), [Trading Pages](https://pro.beui.dev/components/trading-pages), [Trust and Security](https://pro.beui.dev/components/trust-security), [Update app](https://pro.beui.dev/components/mobile/update-app), [Usage & context](https://pro.beui.dev/components/mobile/usage-and-context)
- [Usage Budget](https://pro.beui.dev/components/usage-budget), [Use Cases](https://pro.beui.dev/components/use-cases), [Voice Agent](https://pro.beui.dev/components/voice-agent), [Voice Conversation](https://pro.beui.dev/components/voice-conversation), [Voice mode](https://pro.beui.dev/components/mobile/voice-mode)
- [Waitlist Pages](https://pro.beui.dev/components/waitlist-pages), [Wallet & passes](https://pro.beui.dev/components/mobile/wallet-and-passes), [Weave Workflow Builder](https://pro.beui.dev/components/weave-workflow-builder), [Webhooks](https://pro.beui.dev/components/webhooks), [What We Offer](https://pro.beui.dev/components/what-we-offer)
- [What's New](https://pro.beui.dev/components/whats-new)

### Kobra

90 entries. Public component pages and preview titles. Use paid previews as inspiration.

- [Accordion](https://kobra.systems/components/accordion), [Advertisement](https://kobra.systems/components/advertisement), [Agent Map](https://kobra.systems/components/agent-map), [AI Editor](https://kobra.systems/components/ai-editor), [Alert](https://kobra.systems/components/alert)
- [Aspect Ratio](https://kobra.systems/components/aspect-ratio), [Attachment](https://kobra.systems/components/attachment), [Avatar](https://kobra.systems/components/avatar), [Badge](https://kobra.systems/components/badge), [Breadcrumb](https://kobra.systems/components/breadcrumb)
- [Button](https://kobra.systems/components/button), [Calendar](https://kobra.systems/components/calendar), [Card](https://kobra.systems/components/card), [Carousel](https://kobra.systems/components/carousel), [Chart](https://kobra.systems/components/chart)
- [Chat History](https://kobra.systems/components/chat-history), [Chat Input](https://kobra.systems/components/chat-input), [Checkbox](https://kobra.systems/components/checkbox), [Code Block](https://kobra.systems/components/code-block), [Collapsible](https://kobra.systems/components/collapsible)
- [Color Palette](https://kobra.systems/components/color-palette), [Color Picker](https://kobra.systems/components/color-picker), [Combobox](https://kobra.systems/components/combobox), [Command Menu](https://kobra.systems/components/command-menu), [Composer](https://kobra.systems/components/composer)
- [Context Menu](https://kobra.systems/components/context-menu), [Conversation](https://kobra.systems/components/conversation), [Conversion](https://kobra.systems/components/conversion), [CRM Table](https://kobra.systems/components/crm-table), [Dialog](https://kobra.systems/components/dialog)
- [Direction](https://kobra.systems/components/direction), [Document Agent](https://kobra.systems/components/document-agent), [Drawer](https://kobra.systems/components/drawer), [Dropdown Menu](https://kobra.systems/components/dropdown-menu), [Empty](https://kobra.systems/components/empty)
- [Filter Chips](https://kobra.systems/components/filter-chips), [Form](https://kobra.systems/components/form), [Grouped Table](https://kobra.systems/components/grouped-table), [Halftone Dots](https://kobra.systems/components/halftone-dots), [Hover Card](https://kobra.systems/components/hover-card)
- [Image Gallery](https://kobra.systems/components/image-gallery), [Image Generation](https://kobra.systems/components/image-generation), [Inline Citations](https://kobra.systems/components/inline-citations), [Input](https://kobra.systems/components/input), [Input Dissolve](https://kobra.systems/components/input-dissolve)
- [Input OTP](https://kobra.systems/components/input-otp), [Item](https://kobra.systems/components/item), [Kbd](https://kobra.systems/components/kbd), [Lightbox](https://kobra.systems/components/lightbox), [Logo Carousel](https://kobra.systems/components/logo-carousel)
- [Logo Picker](https://kobra.systems/components/logo-picker), [Magnetic Dropzone](https://kobra.systems/components/magnetic-dropzone), [Marker](https://kobra.systems/components/marker), [Menubar](https://kobra.systems/components/menubar), [Message](https://kobra.systems/components/message)
- [Morphing Icons](https://kobra.systems/components/morphing-icons), [Multi Select](https://kobra.systems/components/multi-select), [Navigation Menu](https://kobra.systems/components/navigation-menu), [Pagination](https://kobra.systems/components/pagination), [Plan Card](https://kobra.systems/components/plan-card)
- [Popover](https://kobra.systems/components/popover), [Product Cards](https://kobra.systems/components/product-cards), [Progress](https://kobra.systems/components/progress), [QR Code](https://kobra.systems/components/qr-code), [Question Card](https://kobra.systems/components/question-card)
- [Radio Group](https://kobra.systems/components/radio-group), [Reasoning Steps](https://kobra.systems/components/reasoning-steps), [Resizable](https://kobra.systems/components/resizable), [Scroll Area](https://kobra.systems/components/scroll-area), [Seat Map](https://kobra.systems/components/seat-map)
- [Select](https://kobra.systems/components/select), [Separator](https://kobra.systems/components/separator), [Sheet](https://kobra.systems/components/sheet), [Sidebar](https://kobra.systems/components/sidebar), [Skeleton](https://kobra.systems/components/skeleton)
- [Slider](https://kobra.systems/components/slider), [Sound](https://kobra.systems/components/sound), [Spinner](https://kobra.systems/components/spinner), [Streaming Text](https://kobra.systems/components/streaming-text), [Switch](https://kobra.systems/components/switch)
- [Table](https://kobra.systems/components/table), [Tabs](https://kobra.systems/components/tabs), [Task List](https://kobra.systems/components/task-list), [Textarea](https://kobra.systems/components/textarea), [Toast](https://kobra.systems/components/toast)
- [Toggle Group](https://kobra.systems/components/toggle-group), [Tooltip](https://kobra.systems/components/tooltip), [Trace Waterfall](https://kobra.systems/components/trace-waterfall), [Video](https://kobra.systems/components/video), [Weather](https://kobra.systems/components/weather)

### Wensity UI components

115 entries. Official component feed.

- [3D Image Carousel](https://ui.wensity.com/components/image-carousel-3d), [AI Agent UI](https://ui.wensity.com/components/ai-agent-ui), [AI Button](https://ui.wensity.com/components/ai-button), [AI Chat Interface](https://ui.wensity.com/components/ai-chat-interface), [AI Image Loading Animation](https://ui.wensity.com/components/ai-image-generator)
- [AI Model Selector](https://ui.wensity.com/components/model-context-switcher), [AI Orb](https://ui.wensity.com/components/ai-orb), [AI Prompt Input](https://ui.wensity.com/components/liquid-multimodal-input), [AI Typing Indicator](https://ui.wensity.com/components/ai-typing-indicator), [Animated 3D Folder](https://ui.wensity.com/components/lifted-archive-folder)
- [Animated Code Diff Viewer](https://ui.wensity.com/components/animated-code-diff), [Animated Hamburger Menu](https://ui.wensity.com/components/animated-hamburger-menu), [Animated Loading Skeleton](https://ui.wensity.com/components/generative-skeleton-mesh), [Animated MacBook](https://ui.wensity.com/components/macbook), [Animated Tabs](https://ui.wensity.com/components/animated-tabs)
- [Animated Terminal](https://ui.wensity.com/components/retro-terminal-emulator), [Apple Intelligence Glow](https://ui.wensity.com/components/apple-intelligence-glow), [Apple-Style Sticky Scroll](https://ui.wensity.com/components/apple-sticky-scroll-sequence), [Aurora Background](https://ui.wensity.com/components/ambient-aurora-canvas), [Bento Grid Layout](https://ui.wensity.com/components/bento-box-grid)
- [Blob Animation](https://ui.wensity.com/components/blob-animation), [Card Stack Carousel](https://ui.wensity.com/components/stack-reveal), [ChatGPT Orb](https://ui.wensity.com/components/chatgpt-orb), [Chrome Text](https://ui.wensity.com/components/chrome-text), [Color Archive Scroll](https://ui.wensity.com/components/color-archive-scroll)
- [Cool Button](https://ui.wensity.com/components/cool-button), [Count Up Animation](https://ui.wensity.com/components/count-up-animation), [Cover Flow Carousel](https://ui.wensity.com/components/cover-flow), [Cursor Trail](https://ui.wensity.com/components/cursor-trail), [Dark Mode Toggle](https://ui.wensity.com/components/dark-mode-toggle)
- [Dynamic Island Toast](https://ui.wensity.com/components/dynamic-island-toast), [Expanding Cards](https://ui.wensity.com/components/expanding-cards), [Fan Hover Card Stack](https://ui.wensity.com/components/fan-hover-card-stack), [File Uploader](https://ui.wensity.com/components/file-uploader), [Fluid Drag-and-Drop Kanban](https://ui.wensity.com/components/fluid-kanban-board)
- [Fluted Glass](https://ui.wensity.com/components/fluted-glass), [Follow Cursor Label](https://ui.wensity.com/components/follow-cursor-label), [Genie Effect](https://ui.wensity.com/components/genie-effect), [GitHub-Style Activity Grid](https://ui.wensity.com/components/github-activity-grid), [Glass Capsule Stack](https://ui.wensity.com/components/glass-hopper)
- [Glass Envelope](https://ui.wensity.com/components/glass-envelope), [Glass Stripes](https://ui.wensity.com/components/glass-stripes), [Globe Card](https://ui.wensity.com/components/globe-card), [Glowing Border](https://ui.wensity.com/components/glowing-border), [Gooey Dock](https://ui.wensity.com/components/gooey-dock)
- [Gooey Dropdown Menu](https://ui.wensity.com/components/gooey-dropdown), [Gooey Floating Toolbar](https://ui.wensity.com/components/gooey-toolbar), [Gooey Navigation Menu](https://ui.wensity.com/components/gooey-navigation-menu), [Gooey Range Slider](https://ui.wensity.com/components/gooey-slider), [Gooey Search Bar](https://ui.wensity.com/components/gooey-search)
- [Google-Style Search Bar](https://ui.wensity.com/components/google-search), [Gradient Grain](https://ui.wensity.com/components/gradient-grain), [Gradient Stripes](https://ui.wensity.com/components/gradient-blind-backdrop), [Hover Image Gallery](https://ui.wensity.com/components/hover-image-gallery), [Image Comparison Slider](https://ui.wensity.com/components/before-after-card)
- [Infinite Image Collage](https://ui.wensity.com/components/infinite-image-collage), [Infinite Marquee](https://ui.wensity.com/components/infinite-marquee), [Interactive 3D Book](https://ui.wensity.com/components/dimensional-book-cover), [Interactive 3D Globe](https://ui.wensity.com/components/interactive-globe), [iPhone Mockup](https://ui.wensity.com/components/iphone-mockup)
- [iPhone Mockup Hero](https://ui.wensity.com/components/iphone-mockup-hero), [iPhone Siri](https://ui.wensity.com/components/iphone-siri), [KPI Card with Sparkline](https://ui.wensity.com/components/metric-sparkline-card), [Line Fill Text](https://ui.wensity.com/components/line-fill-text), [Liquid Glass Button](https://ui.wensity.com/components/liquid-glass-button)
- [Liquid Glass Orb](https://ui.wensity.com/components/liquid-glass-orb), [Liquid Loading Animation](https://ui.wensity.com/components/liquid-loading-animation), [Liquid Metal Button](https://ui.wensity.com/components/liquid-metal-button), [Liquid Ripple Image](https://ui.wensity.com/components/liquid-ripple-image), [macOS Floating Dock](https://ui.wensity.com/components/macos-floating-dock)
- [Magic Keyboard](https://ui.wensity.com/components/magic-keyboard), [Magnifying Glass Lens](https://ui.wensity.com/components/magnifying-glass-lens), [Mechanical Keyboard](https://ui.wensity.com/components/mechanical-keyboard), [Morphing Shape Background](https://ui.wensity.com/components/morphing-shape-background), [Multi-Select Tag Input](https://ui.wensity.com/components/multi-select-token-pills)
- [Multi-Step Form Wizard](https://ui.wensity.com/components/multi-step-morphing-wizard), [Orbital Image Carousel](https://ui.wensity.com/components/orbital-image-carousel), [Particle Image](https://ui.wensity.com/components/particle-image), [Particle Text](https://ui.wensity.com/components/canvas-text), [Peel Effect](https://ui.wensity.com/components/peel-effect)
- [Perspective Marquee](https://ui.wensity.com/components/perspective-marquee), [Physics-Based Confetti Cannon](https://ui.wensity.com/components/confetti-cannon), [Preloader Animation](https://ui.wensity.com/components/preloader-animation), [Progressive Image Loading](https://ui.wensity.com/components/progressive-image-loading), [Refraction Glass Container](https://ui.wensity.com/components/refraction-glass-container)
- [Scroll Stack](https://ui.wensity.com/components/scroll-stack), [Scrubbable Video Reveal](https://ui.wensity.com/components/scrubbable-video-reveal), [Shimmering Skeleton Wrapper](https://ui.wensity.com/components/shimmering-skeleton-wrapper), [Siri Orb](https://ui.wensity.com/components/siri-orb), [Slide to Unlock](https://ui.wensity.com/components/slide-to-unlock)
- [Split-Flap Display](https://ui.wensity.com/components/split-flap-display), [Star Rating](https://ui.wensity.com/components/star-rating), [Subscription Tier Card](https://ui.wensity.com/components/subscription-tier-card), [SVG Fire](https://ui.wensity.com/components/svg-fire), [SVG Liquid Animation](https://ui.wensity.com/components/svg-liquid-animation)
- [Tactile Keyboard](https://ui.wensity.com/components/tactile-keyboard), [Text Blur Reveal](https://ui.wensity.com/components/text-blur-reveal), [Text Char Slide](https://ui.wensity.com/components/text-char-slide), [Text Chroma Reveal](https://ui.wensity.com/components/text-chroma-reveal), [Text Cycle](https://ui.wensity.com/components/text-cycle)
- [Text Flip](https://ui.wensity.com/components/text-flip), [Text Glitch](https://ui.wensity.com/components/text-glitch), [Text Highlight](https://ui.wensity.com/components/text-highlight), [Text Morphing](https://ui.wensity.com/components/text-morphing), [Text Motion](https://ui.wensity.com/components/text-motion)
- [Text Path](https://ui.wensity.com/components/text-path), [Text Ripple](https://ui.wensity.com/components/text-ripple), [Text Scribble](https://ui.wensity.com/components/text-scribble), [Text Shimmer](https://ui.wensity.com/components/text-shimmer), [Text Spectrum](https://ui.wensity.com/components/text-spectrum)
- [Text Word Flip](https://ui.wensity.com/components/text-word-flip), [Tinder-Style Swipe Cards](https://ui.wensity.com/components/stacked-swipe-deck), [Underline Animation](https://ui.wensity.com/components/underline-animation), [Voice Reactive Orb](https://ui.wensity.com/components/voice-aurora-wave), [Water Progress Bar](https://ui.wensity.com/components/water-progress-bar)

### Wensity UI primitives

57 entries. Official primitive feed.

- [Accordion](https://ui.wensity.com/primitives/accordion), [Alert](https://ui.wensity.com/primitives/alert), [Aspect Ratio](https://ui.wensity.com/primitives/aspect-ratio), [Attachment](https://ui.wensity.com/primitives/attachment), [Avatar](https://ui.wensity.com/primitives/avatar)
- [Badge](https://ui.wensity.com/primitives/badge), [Breadcrumb](https://ui.wensity.com/primitives/breadcrumb), [Button](https://ui.wensity.com/primitives/button), [Button Group](https://ui.wensity.com/primitives/button-group), [Calendar](https://ui.wensity.com/primitives/calendar)
- [Card](https://ui.wensity.com/primitives/card), [Carousel](https://ui.wensity.com/primitives/carousel), [Chart](https://ui.wensity.com/primitives/chart), [Checkbox](https://ui.wensity.com/primitives/checkbox), [Collapsible](https://ui.wensity.com/primitives/collapsible)
- [Color Picker](https://ui.wensity.com/primitives/color-picker), [Combobox](https://ui.wensity.com/primitives/combobox), [Command](https://ui.wensity.com/primitives/command), [Context Menu](https://ui.wensity.com/primitives/context-menu), [Data Table](https://ui.wensity.com/primitives/data-table)
- [Date Picker](https://ui.wensity.com/primitives/date-picker), [Dialog](https://ui.wensity.com/primitives/dialog), [Direction](https://ui.wensity.com/primitives/direction), [Drawer](https://ui.wensity.com/primitives/drawer), [Dropdown Menu](https://ui.wensity.com/primitives/dropdown-menu)
- [Empty State](https://ui.wensity.com/primitives/empty-state), [Field](https://ui.wensity.com/primitives/field), [Form Field](https://ui.wensity.com/primitives/form-field), [Hover Card](https://ui.wensity.com/primitives/hover-card), [Input](https://ui.wensity.com/primitives/input)
- [Input OTP](https://ui.wensity.com/primitives/input-otp), [Kbd](https://ui.wensity.com/primitives/kbd), [Label](https://ui.wensity.com/primitives/label), [Native Select](https://ui.wensity.com/primitives/native-select), [Navigation Menu](https://ui.wensity.com/primitives/navigation-menu)
- [Pagination](https://ui.wensity.com/primitives/pagination), [Popover](https://ui.wensity.com/primitives/popover), [Progress](https://ui.wensity.com/primitives/progress), [Radio Group](https://ui.wensity.com/primitives/radio-group), [Resizable](https://ui.wensity.com/primitives/resizable)
- [Scroll Area](https://ui.wensity.com/primitives/scroll-area), [Select](https://ui.wensity.com/primitives/select), [Separator](https://ui.wensity.com/primitives/separator), [Sheet](https://ui.wensity.com/primitives/sheet), [Sidebar](https://ui.wensity.com/primitives/sidebar)
- [Skeleton](https://ui.wensity.com/primitives/skeleton), [Slider](https://ui.wensity.com/primitives/slider), [Spinner](https://ui.wensity.com/primitives/spinner), [Status Indicator](https://ui.wensity.com/primitives/marker), [Switch](https://ui.wensity.com/primitives/switch)
- [Table](https://ui.wensity.com/primitives/table), [Tabs](https://ui.wensity.com/primitives/tabs), [Textarea](https://ui.wensity.com/primitives/text-area), [Toast](https://ui.wensity.com/primitives/toast), [Toggle](https://ui.wensity.com/primitives/toggle)
- [Tooltip](https://ui.wensity.com/primitives/tooltip), [Typography](https://ui.wensity.com/primitives/typography)

### Wensity UI blocks and templates

90 entries. Blocks and templates listed by Wensity.

- [Animated Background With Color Bands](https://ui.wensity.com/blocks/motion#animated-background-with-color-bands), [Animated Background With Contour Lines](https://ui.wensity.com/blocks/motion#animated-background-with-contour-lines), [Animated Background With Liquid Caustics](https://ui.wensity.com/blocks/motion#animated-background-with-liquid-caustics), [Animated Background With Noise Field](https://ui.wensity.com/blocks/motion#animated-background-with-noise-field), [Animated Background With Warp Tunnel](https://ui.wensity.com/blocks/motion#animated-background-with-warp-tunnel)
- [Bento Grid With Analytics Dashboard](https://ui.wensity.com/blocks/bento-grids#bento-grid-with-analytics-dashboard), [Bento Grid With Launch Specs](https://ui.wensity.com/blocks/bento-grids#bento-grid-with-launch-specs), [Bento Grid With Linked Product Tiles](https://ui.wensity.com/blocks/bento-grids#bento-grid-with-linked-product-tiles), [Bento Grid With Portfolio Profile](https://ui.wensity.com/blocks/bento-grids#bento-grid-with-portfolio-profile), [Bento Grid With Product Collection](https://ui.wensity.com/blocks/bento-grids#bento-grid-with-product-collection)
- [Comparison Section With Benchmark Matrix](https://ui.wensity.com/blocks/comparison-sections#comparison-section-with-benchmark-matrix), [Comparison Section With Compare Plans](https://ui.wensity.com/blocks/comparison-sections#comparison-section-with-compare-plans), [Comparison Section With Features Matrix](https://ui.wensity.com/blocks/comparison-sections#comparison-section-with-features-matrix), [Comparison Section With Leader Graph](https://ui.wensity.com/blocks/comparison-sections#comparison-section-with-leader-graph), [Comparison Section With Simple Pricing](https://ui.wensity.com/blocks/comparison-sections#comparison-section-with-simple-pricing)
- [Contact Section With Dashed Grid Form](https://ui.wensity.com/blocks/contact-sections#contact-section-with-dashed-grid-form), [Contact Section With Help Form Quote](https://ui.wensity.com/blocks/contact-sections#contact-section-with-help-form-quote), [Contact Section With Map Preview](https://ui.wensity.com/blocks/contact-sections#contact-section-with-map-preview), [Contact Section With Split Support Grid](https://ui.wensity.com/blocks/contact-sections#contact-section-with-split-support-grid), [Contact Section With Three Column Form](https://ui.wensity.com/blocks/contact-sections#contact-section-with-three-column-form)
- [CTA Section With Centered Contact Avatars](https://ui.wensity.com/blocks/cta-sections#cta-section-with-centered-contact-avatars), [CTA Section With Checklist And Cart Visual](https://ui.wensity.com/blocks/cta-sections#cta-section-with-checklist-and-cart-visual), [CTA Section With Floating Booking Icons](https://ui.wensity.com/blocks/cta-sections#cta-section-with-floating-booking-icons), [CTA Section With Frosted Glass Testimonial Card](https://ui.wensity.com/blocks/cta-sections#cta-section-with-frosted-glass-testimonial-card), [CTA Section With Instagram Thumbnail Grid](https://ui.wensity.com/blocks/cta-sections#cta-section-with-instagram-thumbnail-grid)
- [CTA Section With Overlapping Customer Avatars](https://ui.wensity.com/blocks/cta-sections#cta-section-with-overlapping-customer-avatars), [CTA Section With Scattered Avatars](https://ui.wensity.com/blocks/cta-sections#cta-section-with-scattered-avatars), [CTA Section With Split Booking And Stars](https://ui.wensity.com/blocks/cta-sections#cta-section-with-split-booking-and-stars), [CTA Section With Staggered Image Grid](https://ui.wensity.com/blocks/cta-sections#cta-section-with-staggered-image-grid), [CTA Section With Tilted Plan Cards](https://ui.wensity.com/blocks/cta-sections#cta-section-with-tilted-plan-cards)
- [Docs Site](https://ui.wensity.com/templates/docs-site), [FAQ Section With Accordion Call Card](https://ui.wensity.com/blocks/faq-sections#faq-section-with-accordion-call-card), [FAQ Section With Dashed Grid Pills](https://ui.wensity.com/blocks/faq-sections#faq-section-with-dashed-grid-pills), [FAQ Section With Illustration Accordion](https://ui.wensity.com/blocks/faq-sections#faq-section-with-illustration-accordion), [FAQ Section With Numbered Support Card](https://ui.wensity.com/blocks/faq-sections#faq-section-with-numbered-support-card)
- [FAQ Section With Photo Consult Panel](https://ui.wensity.com/blocks/faq-sections#faq-section-with-photo-consult-panel), [FAQ Section With Split Headline Accordion](https://ui.wensity.com/blocks/faq-sections#faq-section-with-split-headline-accordion), [Feature Section With Blurred Prompt Stage](https://ui.wensity.com/blocks/feature-sections#feature-section-with-blurred-prompt-stage), [Feature Section With Gradient Product Cards](https://ui.wensity.com/blocks/feature-sections#feature-section-with-gradient-product-cards), [Feature Section With Media Upload Stage](https://ui.wensity.com/blocks/feature-sections#feature-section-with-media-upload-stage)
- [Feature Section With Security Grid](https://ui.wensity.com/blocks/feature-sections#feature-section-with-security-grid), [Feature Section With Workspace Composer](https://ui.wensity.com/blocks/feature-sections#feature-section-with-workspace-composer), [Fintech Template](https://ui.wensity.com/templates/fintech-template), [Footer With Call To Action Band](https://ui.wensity.com/blocks/footers#footer-with-call-to-action-band), [Footer With Editorial Tagline](https://ui.wensity.com/blocks/footers#footer-with-editorial-tagline)
- [Footer With Four Column Links](https://ui.wensity.com/blocks/footers#footer-with-four-column-links), [Footer With Glowing Wordmark](https://ui.wensity.com/blocks/footers#footer-with-glowing-wordmark), [Footer With Newsletter Signup](https://ui.wensity.com/blocks/footers#footer-with-newsletter-signup), [Footer With Pixel Grid Wordmark](https://ui.wensity.com/blocks/footers#footer-with-pixel-grid-wordmark), [Footer With Stacked Layout](https://ui.wensity.com/blocks/footers#footer-with-stacked-layout)
- [Footer With Two Column Layout](https://ui.wensity.com/blocks/footers#footer-with-two-column-layout), [Hero Section With 3D Monolith](https://ui.wensity.com/blocks/hero-sections#hero-section-with-3d-monolith), [Hero Section With Animated Clouds](https://ui.wensity.com/blocks/hero-sections#hero-section-with-animated-clouds), [Hero Section With Black Hole](https://ui.wensity.com/blocks/hero-sections#hero-section-with-black-hole), [Hero Section With Eclipse Glow](https://ui.wensity.com/blocks/hero-sections#hero-section-with-eclipse-glow)
- [Hero Section With Morphing Photo Arc](https://ui.wensity.com/blocks/hero-sections#hero-section-with-morphing-photo-arc), [Hero Section With Radial Glow](https://ui.wensity.com/blocks/hero-sections#hero-section-with-radial-glow), [Hero Section With Rotating Words](https://ui.wensity.com/blocks/hero-sections#hero-section-with-rotating-words), [Hero Section With Spotlight Beam](https://ui.wensity.com/blocks/hero-sections#hero-section-with-spotlight-beam), [How It Works Section With Dotted Curve Steps](https://ui.wensity.com/blocks/how-it-works-sections#how-it-works-section-with-dotted-curve-steps)
- [How It Works Section With Pinned Notebook Notes](https://ui.wensity.com/blocks/how-it-works-sections#how-it-works-section-with-pinned-notebook-notes), [How It Works Section With Sticky Scroll Mockups](https://ui.wensity.com/blocks/how-it-works-sections#how-it-works-section-with-sticky-scroll-mockups), [How It Works Section With Taped Sticky Notes](https://ui.wensity.com/blocks/how-it-works-sections#how-it-works-section-with-taped-sticky-notes), [How It Works Section With Zigzag Timeline](https://ui.wensity.com/blocks/how-it-works-sections#how-it-works-section-with-zigzag-timeline), [Login Page With Centered Card](https://ui.wensity.com/blocks/login-pages#login-page-with-centered-card)
- [Login Page With Magic Link](https://ui.wensity.com/blocks/login-pages#login-page-with-magic-link), [Login Page With Minimal Form](https://ui.wensity.com/blocks/login-pages#login-page-with-minimal-form), [Login Page With Password Strength Meter](https://ui.wensity.com/blocks/login-pages#login-page-with-password-strength-meter), [Login Page With Split Screen Image](https://ui.wensity.com/blocks/login-pages#login-page-with-split-screen-image), [Minimalistic Portfolio](https://ui.wensity.com/templates/minimalistic-portfolio)
- [Navbar With Centered Links](https://ui.wensity.com/blocks/navbars#navbar-with-centered-links), [Navbar With Floating Pill](https://ui.wensity.com/blocks/navbars#navbar-with-floating-pill), [Navbar With Floating Pill Menu](https://ui.wensity.com/blocks/navbars#navbar-with-floating-pill-menu), [Navbar With Frosted Glass](https://ui.wensity.com/blocks/navbars#navbar-with-frosted-glass), [Navbar With Hover Pill Links](https://ui.wensity.com/blocks/navbars#navbar-with-hover-pill-links)
- [Navbar With Mega Menu Dropdown](https://ui.wensity.com/blocks/navbars#navbar-with-mega-menu-dropdown), [Pricing Section With Animated Clouds](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-animated-clouds), [Pricing Section With Comparison Table](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-comparison-table), [Pricing Section With Credit Plan Columns](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-credit-plan-columns), [Pricing Section With Included Price](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-included-price)
- [Pricing Section With Lifetime Highlight](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-lifetime-highlight), [Pricing Section With Nested Feature Lists](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-nested-feature-lists), [Pricing Section With Soft Gradient](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-soft-gradient), [Pricing Section With Usage Receipt](https://ui.wensity.com/blocks/pricing-sections#pricing-section-with-usage-receipt), [Social Proof Section With Company Story Tabs](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-company-story-tabs)
- [Social Proof Section With Feedback Gallery](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-feedback-gallery), [Social Proof Section With Inline Avatar Quotes](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-inline-avatar-quotes), [Social Proof Section With Metric Bento Grid](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-metric-bento-grid), [Social Proof Section With Morphing Logo Grid](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-morphing-logo-grid), [Social Proof Section With Morphing Wordmarks](https://ui.wensity.com/blocks/social-proof-sections#social-proof-section-with-morphing-wordmarks)

### Rare UI

30 entries. Public component pages. Check the project’s attribution and reuse terms before copying source.

- [AI Prompt Box](https://www.rareui.com/components/promptbox), [Animated counter](https://www.rareui.com/components/animatedcounter), [Bounce sidebar](https://www.rareui.com/components/bouncesidebar), [Code Block](https://www.rareui.com/components/codeblock), [Delete button](https://www.rareui.com/components/deletebutton)
- [Duration Picker](https://www.rareui.com/components/durationpicker), [Emoji reaction](https://www.rareui.com/components/emojireaction), [FAQ](https://www.rareui.com/components/faq), [Fluid Orb](https://www.rareui.com/components/fluidorb), [Folder component](https://www.rareui.com/components/foldercomponent)
- [GitHub activity](https://www.rareui.com/components/githubactivity), [Gooey nav](https://www.rareui.com/components/gooeynav), [Gravity Letters](https://www.rareui.com/components/gravityletters), [Grid Reveal](https://www.rareui.com/components/gridreveal), [Hook Sidebar](https://www.rareui.com/components/hooksidebar)
- [Inline AI Status](https://www.rareui.com/components/aistatus), [Matrix orb](https://www.rareui.com/components/matrixorb), [Notification bell](https://www.rareui.com/components/notificationbell), [OTP Input](https://www.rareui.com/components/otpinput), [Password input](https://www.rareui.com/components/passwordinput)
- [Proximity Sidebar](https://www.rareui.com/components/proximitysidebar), [Rail TOC](https://www.rareui.com/components/railtoc), [Scroll Progress](https://www.rareui.com/components/scrollprogressindicator), [Step player](https://www.rareui.com/components/stepplayer), [Streaming Response](https://www.rareui.com/components/streamingresponse)
- [Task list](https://www.rareui.com/components/tasklist), [Theme selector](https://www.rareui.com/components/themeselector), [Toast](https://www.rareui.com/components/toast), [Voice note](https://www.rareui.com/components/voicenote), [Web Search](https://www.rareui.com/components/websearch)

### Libraries.dev

11 entries. Visual libraries and input models. Model terms may differ from UI code terms.

- [Border beam](https://libraries.dev/beam), [Bot avatars](https://libraries.dev/bots), [Distortion waves](https://libraries.dev/waves), [Gooey](https://libraries.dev/gooey), [Image](https://libraries.dev/image)
- [Magnetic UI](https://libraries.dev/magnetic), [Metal](https://libraries.dev/metal), [Thinking orbs](https://libraries.dev/orbs), [Voice](https://libraries.dev/voice), [Voice position](https://libraries.dev/voice-position)
- [Voice ring](https://libraries.dev/voice-ring)

### UIStacks

282 entries. Published component pages from the public catalog.

- [Accordion](https://uistacks.dev/components/accordion), [Action bar](https://uistacks.dev/components/action-bar), [Action items](https://uistacks.dev/components/action-items), [Activity feed](https://uistacks.dev/components/activity-feed), [Activity heatmap](https://uistacks.dev/components/activity-heatmap)
- [Address autocomplete](https://uistacks.dev/components/address-autocomplete), [Agent card](https://uistacks.dev/components/agent-card), [Agent control frame](https://uistacks.dev/components/agent-control-frame), [Agent handoff](https://uistacks.dev/components/agent-handoff), [Agent map](https://uistacks.dev/components/agent-map)
- [Agent permissions](https://uistacks.dev/components/agent-permissions), [Agent roster](https://uistacks.dev/components/agent-roster), [AI column](https://uistacks.dev/components/ai-column), [AI form fill](https://uistacks.dev/components/ai-form-fill), [AI recap](https://uistacks.dev/components/ai-recap)
- [AI summary](https://uistacks.dev/components/ai-summary), [Alert banner](https://uistacks.dev/components/alert-banner), [Amount input](https://uistacks.dev/components/amount-input), [Annotated line](https://uistacks.dev/components/annotated-line), [Announcement pill](https://uistacks.dev/components/announcement-pill)
- [API key row](https://uistacks.dev/components/api-key-row), [App switcher](https://uistacks.dev/components/app-switcher), [Approval request](https://uistacks.dev/components/approval-request), [Artifact panel](https://uistacks.dev/components/artifact-panel), [ASCII field](https://uistacks.dev/components/ascii-field)
- [ASCII globe](https://uistacks.dev/components/ascii-globe), [ASCII image](https://uistacks.dev/components/ascii-image), [ASCII loader](https://uistacks.dev/components/ascii-loader), [ASCII text](https://uistacks.dev/components/ascii-text), [Assistant picker](https://uistacks.dev/components/assistant-picker)
- [Attachment](https://uistacks.dev/components/attachment), [Attempt compare](https://uistacks.dev/components/attempt-compare), [Attention queue](https://uistacks.dev/components/attention-queue), [Audio player](https://uistacks.dev/components/audio-player), [Automation card](https://uistacks.dev/components/automation-card)
- [Avatar](https://uistacks.dev/components/avatar), [Avatar stack](https://uistacks.dev/components/avatar-stack), [Badge](https://uistacks.dev/components/badge), [Balance card](https://uistacks.dev/components/balance-card), [Bell button](https://uistacks.dev/components/bell-button)
- [Billing plan card](https://uistacks.dev/components/billing-plan-card), [Board card](https://uistacks.dev/components/board-card), [Border beam](https://uistacks.dev/components/border-beam), [Bottom sheet](https://uistacks.dev/components/bottom-sheet), [Bottom tab bar](https://uistacks.dev/components/bottom-tab-bar)
- [Box plot](https://uistacks.dev/components/box-plot), [Branch switcher](https://uistacks.dev/components/branch-switcher), [Breadcrumbs](https://uistacks.dev/components/breadcrumbs), [Browser frame](https://uistacks.dev/components/browser-frame), [Budget bars](https://uistacks.dev/components/budget-bars)
- [Bullet chart](https://uistacks.dev/components/bullet-chart), [Button](https://uistacks.dev/components/button), [Candlestick](https://uistacks.dev/components/candlestick), [Card input](https://uistacks.dev/components/card-input), [Carousel](https://uistacks.dev/components/carousel)
- [Cart item](https://uistacks.dev/components/cart-item), [Cart summary](https://uistacks.dev/components/cart-summary), [Change preview](https://uistacks.dev/components/change-preview), [Changelog entry](https://uistacks.dev/components/changelog-entry), [Chart answer](https://uistacks.dev/components/chart-answer)
- [Checkbox](https://uistacks.dev/components/checkbox), [Checks list](https://uistacks.dev/components/checks-list), [Chip input](https://uistacks.dev/components/chip-input), [Citation](https://uistacks.dev/components/citation), [Citation row](https://uistacks.dev/components/citation-row)
- [Clarifying question](https://uistacks.dev/components/clarifying-question), [Coachmark](https://uistacks.dev/components/coachmark), [Code block](https://uistacks.dev/components/code-block), [Cohort table](https://uistacks.dev/components/cohort-table), [Color picker](https://uistacks.dev/components/color-picker)
- [Color swatch](https://uistacks.dev/components/color-swatch), [Combobox](https://uistacks.dev/components/combobox), [Command palette](https://uistacks.dev/components/command-palette), [Comment thread](https://uistacks.dev/components/comment-thread), [Compare bars](https://uistacks.dev/components/compare-bars)
- [Confetti](https://uistacks.dev/components/confetti), [Connect apps](https://uistacks.dev/components/connect-apps), [Connectors strip](https://uistacks.dev/components/connectors-strip), [Context menu](https://uistacks.dev/components/context-menu), [Context meter](https://uistacks.dev/components/context-meter)
- [Conversation list](https://uistacks.dev/components/conversation-list), [Copy button](https://uistacks.dev/components/copy-button), [Copy field](https://uistacks.dev/components/copy-field), [Copy-prompt box](https://uistacks.dev/components/copy-prompt-box), [Correction](https://uistacks.dev/components/correction)
- [Cost estimate](https://uistacks.dev/components/cost-estimate), [CTA banner](https://uistacks.dev/components/cta-banner), [Currency input](https://uistacks.dev/components/currency-input), [Cycle card](https://uistacks.dev/components/cycle-card), [Data table](https://uistacks.dev/components/data-table)
- [Date chip](https://uistacks.dev/components/date-chip), [Date picker](https://uistacks.dev/components/date-picker), [Date strip](https://uistacks.dev/components/date-strip), [Dialog](https://uistacks.dev/components/dialog), [Diff block](https://uistacks.dev/components/diff-block)
- [Display options](https://uistacks.dev/components/display-options), [Dock](https://uistacks.dev/components/dock), [Docked composer](https://uistacks.dev/components/prompt-composer-docked), [Document card](https://uistacks.dev/components/document-card), [Donut chart](https://uistacks.dev/components/donut-chart)
- [Dot field](https://uistacks.dev/components/dot-field), [Dot globe](https://uistacks.dev/components/dot-globe), [Dot map](https://uistacks.dev/components/dot-map), [Dropdown menu](https://uistacks.dev/components/dropdown-menu), [Effort slider](https://uistacks.dev/components/effort-slider)
- [Email draft](https://uistacks.dev/components/email-draft), [Empty state](https://uistacks.dev/components/empty-state), [Eval scorecard](https://uistacks.dev/components/eval-scorecard), [Expanding search](https://uistacks.dev/components/expanding-search), [Extracted fields](https://uistacks.dev/components/extracted-fields)
- [FAQ list](https://uistacks.dev/components/faq-list), [Feature grid](https://uistacks.dev/components/feature-grid), [Feedback](https://uistacks.dev/components/feedback), [File manager](https://uistacks.dev/components/file-manager), [File upload](https://uistacks.dev/components/file-upload)
- [Filter bar](https://uistacks.dev/components/filter-bar), [Filter chips](https://uistacks.dev/components/filter-chips), [Forecast alert](https://uistacks.dev/components/forecast-alert), [Forecast chart](https://uistacks.dev/components/forecast-chart), [Form wizard](https://uistacks.dev/components/form-wizard)
- [Funnel chart](https://uistacks.dev/components/funnel-chart), [Gantt chart](https://uistacks.dev/components/gantt-chart), [Gantt row](https://uistacks.dev/components/gantt-row), [Ghost autocomplete](https://uistacks.dev/components/ghost-autocomplete), [Grouped bar](https://uistacks.dev/components/grouped-bar)
- [Histogram range](https://uistacks.dev/components/histogram-range), [Hold to confirm](https://uistacks.dev/components/hold-to-confirm), [Hour heatmap](https://uistacks.dev/components/hour-heatmap), [Hover card](https://uistacks.dev/components/hover-card), [Icon button](https://uistacks.dev/components/icon-button)
- [Image cropper](https://uistacks.dev/components/image-cropper), [Image generations](https://uistacks.dev/components/image-generations), [Inline ask](https://uistacks.dev/components/inline-ask), [Inline edit](https://uistacks.dev/components/inline-edit), [Input](https://uistacks.dev/components/input)
- [Integration card](https://uistacks.dev/components/integration-card), [Interview card](https://uistacks.dev/components/interview-card), [Invoice editor](https://uistacks.dev/components/invoice-editor), [Issue list](https://uistacks.dev/components/issue-list), [Issue row](https://uistacks.dev/components/issue-row)
- [Kanban board](https://uistacks.dev/components/kanban-board), [Kbd](https://uistacks.dev/components/kbd), [Keypad](https://uistacks.dev/components/keypad), [Leaderboard](https://uistacks.dev/components/leaderboard), [Lightbox](https://uistacks.dev/components/lightbox)
- [Live cursors](https://uistacks.dev/components/live-cursors), [Live pill](https://uistacks.dev/components/live-pill), [Live runs](https://uistacks.dev/components/live-runs), [Live transcript](https://uistacks.dev/components/live-transcript), [MCP servers](https://uistacks.dev/components/mcp-servers)
- [Memory list](https://uistacks.dev/components/memory-list), [Mention prompt](https://uistacks.dev/components/mention-prompt), [Message](https://uistacks.dev/components/message), [Metric strip](https://uistacks.dev/components/metric-strip), [Mini prompt](https://uistacks.dev/components/mini-prompt)
- [Model card](https://uistacks.dev/components/model-card), [Model fallback](https://uistacks.dev/components/model-fallback), [Model picker](https://uistacks.dev/components/model-picker), [Month calendar](https://uistacks.dev/components/month-calendar), [Morph button](https://uistacks.dev/components/morph-button)
- [Multi-line chart](https://uistacks.dev/components/multi-line), [Newsletter signup](https://uistacks.dev/components/newsletter-signup), [NL filter](https://uistacks.dev/components/nl-filter), [Notification center](https://uistacks.dev/components/notification-center), [Number input](https://uistacks.dev/components/number-input)
- [Onboarding checklist](https://uistacks.dev/components/onboarding-checklist), [Order summary](https://uistacks.dev/components/order-summary), [Order tracker](https://uistacks.dev/components/order-tracker), [Org chart](https://uistacks.dev/components/org-chart), [OTP input](https://uistacks.dev/components/otp-input)
- [Pagination](https://uistacks.dev/components/pagination), [Password input](https://uistacks.dev/components/password-input), [Payment card](https://uistacks.dev/components/payment-card), [Payment picker](https://uistacks.dev/components/payment-picker), [People picker](https://uistacks.dev/components/people-picker)
- [Permission matrix](https://uistacks.dev/components/permission-matrix), [Phone input](https://uistacks.dev/components/phone-input), [Plan card](https://uistacks.dev/components/plan-card), [Policy block](https://uistacks.dev/components/policy-block), [Popover](https://uistacks.dev/components/popover)
- [Portfolio chart](https://uistacks.dev/components/portfolio-chart), [Preflight checks](https://uistacks.dev/components/preflight-checks), [Pricing calculator](https://uistacks.dev/components/pricing-calculator), [Pricing table](https://uistacks.dev/components/pricing-table), [Priority icon](https://uistacks.dev/components/priority-icon)
- [Product card](https://uistacks.dev/components/product-card), [Progress](https://uistacks.dev/components/progress), [Project card](https://uistacks.dev/components/project-card), [Prompt enhancer](https://uistacks.dev/components/prompt-enhancer), [Prompt input](https://uistacks.dev/components/prompt-input)
- [Prompt library](https://uistacks.dev/components/prompt-library), [Prompt versions](https://uistacks.dev/components/prompt-versions), [Prompt with attachments](https://uistacks.dev/components/prompt-attachments), [Property panel](https://uistacks.dev/components/property-panel), [Quantity stepper](https://uistacks.dev/components/quantity-stepper)
- [Radar chart](https://uistacks.dev/components/radar-chart), [Radio group](https://uistacks.dev/components/radio-group), [Rating](https://uistacks.dev/components/rating), [Reaction bar](https://uistacks.dev/components/reaction-bar), [Reaction button](https://uistacks.dev/components/reaction-button)
- [Receipt](https://uistacks.dev/components/receipt), [Recurring bills](https://uistacks.dev/components/recurring-bills), [Redacted text](https://uistacks.dev/components/redacted-text), [Relay timeline](https://uistacks.dev/components/relay-timeline), [Resizable panels](https://uistacks.dev/components/resizable-panels)
- [Restore points](https://uistacks.dev/components/restore-points), [Review stack](https://uistacks.dev/components/review-stack), [Rich text toolbar](https://uistacks.dev/components/rich-text-toolbar), [Ring stats](https://uistacks.dev/components/ring-stats), [Roadmap timeline](https://uistacks.dev/components/roadmap-timeline)
- [Rolling number](https://uistacks.dev/components/rolling-number), [Run card](https://uistacks.dev/components/run-card), [Run schedule](https://uistacks.dev/components/run-schedule), [Sankey chart](https://uistacks.dev/components/sankey-chart), [Scatter plot](https://uistacks.dev/components/scatter-plot)
- [Scroll-spy TOC](https://uistacks.dev/components/scroll-spy-toc), [Search input](https://uistacks.dev/components/search-input), [Search results](https://uistacks.dev/components/search-results), [Segmented control](https://uistacks.dev/components/segmented-control), [Select](https://uistacks.dev/components/select)
- [Session replay](https://uistacks.dev/components/session-replay), [Settings row](https://uistacks.dev/components/settings-row), [Share chat](https://uistacks.dev/components/share-chat), [Shiny text](https://uistacks.dev/components/shiny-text), [Shortcuts dialog](https://uistacks.dev/components/shortcuts-dialog)
- [Side sheet](https://uistacks.dev/components/side-sheet), [Sidebar nav](https://uistacks.dev/components/sidebar-nav), [Signature pad](https://uistacks.dev/components/signature-pad), [Since last visit](https://uistacks.dev/components/since-last-visit), [Skeleton](https://uistacks.dev/components/skeleton)
- [Slider](https://uistacks.dev/components/slider), [Sortable list](https://uistacks.dev/components/sortable-list), [Source viewer](https://uistacks.dev/components/source-viewer), [Sparkline table](https://uistacks.dev/components/sparkline-table), [Speed dial](https://uistacks.dev/components/speed-dial)
- [Spend breakdown](https://uistacks.dev/components/spend-breakdown), [Spend limit](https://uistacks.dev/components/spend-limit), [Split button](https://uistacks.dev/components/split-button), [Spotlight card](https://uistacks.dev/components/spotlight-card), [Stacked area](https://uistacks.dev/components/stacked-area)
- [Starter cards](https://uistacks.dev/components/starter-cards), [Stat card](https://uistacks.dev/components/stat-card), [Status icon](https://uistacks.dev/components/status-icon), [Step slider](https://uistacks.dev/components/step-slider), [Steps card](https://uistacks.dev/components/steps-card)
- [Subscription manager](https://uistacks.dev/components/subscription-manager), [Suggested edits](https://uistacks.dev/components/suggested-edits), [Suggestions](https://uistacks.dev/components/suggestions), [Supplier compare](https://uistacks.dev/components/supplier-compare), [Swap card](https://uistacks.dev/components/swap-card)
- [Swipe row](https://uistacks.dev/components/swipe-row), [Switch](https://uistacks.dev/components/switch), [Tabs](https://uistacks.dev/components/tabs), [Testimonial card](https://uistacks.dev/components/testimonial-card), [Text scramble](https://uistacks.dev/components/text-scramble)
- [Textarea](https://uistacks.dev/components/textarea), [Theme toggle](https://uistacks.dev/components/theme-toggle), [Thinking state](https://uistacks.dev/components/thinking-state), [Threshold gauge](https://uistacks.dev/components/threshold-gauge), [Time input](https://uistacks.dev/components/time-input)
- [Time slot picker](https://uistacks.dev/components/time-slot-picker), [Timeline](https://uistacks.dev/components/timeline), [Toast](https://uistacks.dev/components/toast), [Tool call](https://uistacks.dev/components/tool-call), [Tooltip](https://uistacks.dev/components/tooltip)
- [Trace waterfall](https://uistacks.dev/components/trace-waterfall), [Transaction list](https://uistacks.dev/components/transaction-list), [Translate panel](https://uistacks.dev/components/translate-panel), [Tree view](https://uistacks.dev/components/tree-view), [Treemap](https://uistacks.dev/components/treemap)
- [Trust level](https://uistacks.dev/components/trust-level), [Uptime bars](https://uistacks.dev/components/uptime-bars), [Usage meter](https://uistacks.dev/components/usage-meter), [Value stepper](https://uistacks.dev/components/value-stepper), [Version history](https://uistacks.dev/components/version-history)
- [Voice call](https://uistacks.dev/components/voice-call), [Voice prompt](https://uistacks.dev/components/voice-prompt), [Waffle chart](https://uistacks.dev/components/waffle-chart), [Watchlist](https://uistacks.dev/components/watchlist), [Waterfall chart](https://uistacks.dev/components/waterfall-chart)
- [Week calendar](https://uistacks.dev/components/week-calendar), [Wheel picker](https://uistacks.dev/components/wheel-picker)

### Base UI

37 entries. React component pages.

- [Accordion](https://base-ui.com/react/components/accordion), [Alert Dialog](https://base-ui.com/react/components/alert-dialog), [Autocomplete](https://base-ui.com/react/components/autocomplete), [Avatar](https://base-ui.com/react/components/avatar), [Button](https://base-ui.com/react/components/button)
- [Checkbox](https://base-ui.com/react/components/checkbox), [Checkbox Group](https://base-ui.com/react/components/checkbox-group), [Collapsible](https://base-ui.com/react/components/collapsible), [Combobox](https://base-ui.com/react/components/combobox), [Context Menu](https://base-ui.com/react/components/context-menu)
- [Dialog](https://base-ui.com/react/components/dialog), [Drawer](https://base-ui.com/react/components/drawer), [Field](https://base-ui.com/react/components/field), [Fieldset](https://base-ui.com/react/components/fieldset), [Form](https://base-ui.com/react/components/form)
- [Input](https://base-ui.com/react/components/input), [Menu](https://base-ui.com/react/components/menu), [Menubar](https://base-ui.com/react/components/menubar), [Meter](https://base-ui.com/react/components/meter), [Navigation Menu](https://base-ui.com/react/components/navigation-menu)
- [Number Field](https://base-ui.com/react/components/number-field), [OTP Field](https://base-ui.com/react/components/otp-field), [Popover](https://base-ui.com/react/components/popover), [Preview Card](https://base-ui.com/react/components/preview-card), [Progress](https://base-ui.com/react/components/progress)
- [Radio Group](https://base-ui.com/react/components/radio-group), [Scroll Area](https://base-ui.com/react/components/scroll-area), [Select](https://base-ui.com/react/components/select), [Separator](https://base-ui.com/react/components/separator), [Slider](https://base-ui.com/react/components/slider)
- [Switch](https://base-ui.com/react/components/switch), [Tabs](https://base-ui.com/react/components/tabs), [Toast](https://base-ui.com/react/components/toast), [Toggle](https://base-ui.com/react/components/toggle), [Toggle Group](https://base-ui.com/react/components/toggle-group)
- [Toolbar](https://base-ui.com/react/components/toolbar), [Tooltip](https://base-ui.com/react/components/tooltip)

### Recharts

61 entries. Public chart, series, axis and container component pages. Hooks are documented separately.

- [AnimationControllerProvider](https://recharts.github.io/en-US/api/AnimationControllerProvider/), [Area](https://recharts.github.io/en-US/api/Area/), [AreaChart](https://recharts.github.io/en-US/api/AreaChart/), [AreaRevealShape](https://recharts.github.io/en-US/api/AreaRevealShape/), [Bar](https://recharts.github.io/en-US/api/Bar/)
- [BarChart](https://recharts.github.io/en-US/api/BarChart/), [BarStack](https://recharts.github.io/en-US/api/BarStack/), [Brush](https://recharts.github.io/en-US/api/Brush/), [CartesianAxis](https://recharts.github.io/en-US/api/CartesianAxis/), [CartesianGrid](https://recharts.github.io/en-US/api/CartesianGrid/)
- [Cell](https://recharts.github.io/en-US/api/Cell/), [ComposedChart](https://recharts.github.io/en-US/api/ComposedChart/), [Cross](https://recharts.github.io/en-US/api/Cross/), [Curve](https://recharts.github.io/en-US/api/Curve/), [Customized](https://recharts.github.io/en-US/api/Customized/)
- [DefaultLegendContent](https://recharts.github.io/en-US/api/DefaultLegendContent/), [DefaultTooltipContent](https://recharts.github.io/en-US/api/DefaultTooltipContent/), [DefaultZIndexes](https://recharts.github.io/en-US/api/DefaultZIndexes/), [Dot](https://recharts.github.io/en-US/api/Dot/), [ErrorBar](https://recharts.github.io/en-US/api/ErrorBar/)
- [Funnel](https://recharts.github.io/en-US/api/Funnel/), [FunnelChart](https://recharts.github.io/en-US/api/FunnelChart/), [Global](https://recharts.github.io/en-US/api/Global/), [Label](https://recharts.github.io/en-US/api/Label/), [LabelList](https://recharts.github.io/en-US/api/LabelList/)
- [Layer](https://recharts.github.io/en-US/api/Layer/), [Legend](https://recharts.github.io/en-US/api/Legend/), [Line](https://recharts.github.io/en-US/api/Line/), [LineChart](https://recharts.github.io/en-US/api/LineChart/), [LineDrawShape](https://recharts.github.io/en-US/api/LineDrawShape/)
- [Pie](https://recharts.github.io/en-US/api/Pie/), [PieChart](https://recharts.github.io/en-US/api/PieChart/), [PolarAngleAxis](https://recharts.github.io/en-US/api/PolarAngleAxis/), [PolarGrid](https://recharts.github.io/en-US/api/PolarGrid/), [PolarRadiusAxis](https://recharts.github.io/en-US/api/PolarRadiusAxis/)
- [Polygon](https://recharts.github.io/en-US/api/Polygon/), [Radar](https://recharts.github.io/en-US/api/Radar/), [RadarChart](https://recharts.github.io/en-US/api/RadarChart/), [RadialBar](https://recharts.github.io/en-US/api/RadialBar/), [RadialBarChart](https://recharts.github.io/en-US/api/RadialBarChart/)
- [RechartsThemeProvider](https://recharts.github.io/en-US/api/RechartsThemeProvider/), [Rectangle](https://recharts.github.io/en-US/api/Rectangle/), [ReferenceArea](https://recharts.github.io/en-US/api/ReferenceArea/), [ReferenceDot](https://recharts.github.io/en-US/api/ReferenceDot/), [ReferenceLine](https://recharts.github.io/en-US/api/ReferenceLine/)
- [ResponsiveContainer](https://recharts.github.io/en-US/api/ResponsiveContainer/), [Sankey](https://recharts.github.io/en-US/api/Sankey/), [Scatter](https://recharts.github.io/en-US/api/Scatter/), [ScatterChart](https://recharts.github.io/en-US/api/ScatterChart/), [Sector](https://recharts.github.io/en-US/api/Sector/)
- [SunburstChart](https://recharts.github.io/en-US/api/SunburstChart/), [Surface](https://recharts.github.io/en-US/api/Surface/), [Symbols](https://recharts.github.io/en-US/api/Symbols/), [Text](https://recharts.github.io/en-US/api/Text/), [Tooltip](https://recharts.github.io/en-US/api/Tooltip/)
- [Trapezoid](https://recharts.github.io/en-US/api/Trapezoid/), [Treemap](https://recharts.github.io/en-US/api/Treemap/), [XAxis](https://recharts.github.io/en-US/api/XAxis/), [YAxis](https://recharts.github.io/en-US/api/YAxis/), [ZAxis](https://recharts.github.io/en-US/api/ZAxis/)
- [ZIndexLayer](https://recharts.github.io/en-US/api/ZIndexLayer/)

### Focused packages

| Package | UI components or primary UI surface |
| --- | --- |
| [cmdk](https://cmdk.paco.me) | `Command`, `Command.Dialog`, `Command.Input`, `Command.List`, `Command.Empty`, `Command.Loading`, `Command.Group`, `Command.Item`, `Command.Separator` |
| [Sonner](https://sonner.emilkowal.ski) | `Toaster` |
| [input-otp](https://input-otp.rodz.dev) | `OTPInput` |
| [Leva](https://github.com/pmndrs/leva) | `Leva`, `LevaPanel` |
| [dialkit](https://joshpuckett.me/dialkit) | `DialRoot`, `DialKit` |
| [Motion](https://motion.dev) | `motion`, `AnimatePresence`, `LayoutGroup`, `MotionConfig`, `Reorder.Group`, `Reorder.Item`, `LazyMotion` |
| [NumberFlow](https://number-flow.barvian.me) | `NumberFlow`, `NumberFlowGroup` |
| [torph](https://torph.lochie.me/) | `Torph` |
| [Cobe](https://cobe.vercel.app) | `Canvas globe` |
| [Liveline](https://github.com/benjitaylor/liveline) | `Liveline` |
| [dnd kit](https://dndkit.com) | `DragDropProvider`, `DragOverlay`, `DndContext`, `SortableContext` |
| [Virtuoso](https://virtuoso.dev) | `Virtuoso`, `VirtuosoGrid`, `TableVirtuoso`, `GroupedVirtuoso`, `GroupedTableVirtuoso`, `VirtuosoMessageList` |
| [next-themes](https://github.com/pacocoursey/next-themes) | `ThemeProvider` |

Satori renders markup to SVG. Shiki highlights code. Zustand manages state. clsx and cva compose class names. These packages expose APIs rather than a UI component catalog.

### Demos and design guides

| Source | Published UI examples or focus |
| --- | --- |
| [Accordee](https://demo.accordee.app/) | Assistant chat, model picker, tool activity, generated file actions, agent builder, App Library, workspace navigation. |
| [Relay Workflow OS](https://relay-workflow-os.vercel.app/) | Runs list, run timeline, approvals inbox, agents list, workflow builder, command palette, settings. |
| [Baobun Studio](https://baobun.studio/demo/agents/guidelines) | Agent identity, mark, color, typography, controls and interactive agent UI examples. |
| [Senior Frontend](https://www.aitmpl.com/component/skills/development/senior-frontend) | Review guidance for app UI, component states, responsiveness and accessibility. |
| [Marked](https://marked.dev/) | Reference discovery and collections organized by interactions such as hover, scroll and drag. |

These sites provide demos, examples or guidance rather than installable UI component inventories.

### 21st.dev community registry

The [public sitemap](https://21st.dev/sitemap.xml) lists 9,505 distinct author/component entries in this snapshot. The live registry can include additional entries. The names below are the published URL slugs, grouped by author. Multiple preview URLs under one author and component are collapsed into one entry. Find a component at `https://21st.dev/@author/components/slug`. [Browse the current registry](https://21st.dev/community/components).

<details>
<summary>Community component inventory by author</summary>

```text
@0threat2society02   creation-of-adam
@0xUrvish
  animated-collection, bento-card, bottom-menu, bucket, day-picker, delete-button, discover-button,
  discrete-tab, dynamic-toolbar, empty-testimonial, expandable-gallery, feature-carousel,
  fluid-expanding-grid, folder-interaction, inline-edit, list-item, magnified-bento, morphing-input,
  pricing-card, smooth-dropdown, stacked-list, vertical-tabs
@0xuser64bit
  code-block, image-compare, signal
@16inam06   chromatic-lens
@1haim   ambient-glare-shader
@1laruk24   volna
@1myfakename1   test
@21st
  abacus-count, accent-pill-title, accordion-zine-unfold, address-bar-cta, agent-steps, anamorphic-alignment,
  aperture-grid-reveal, app-card-pop, ascii-resolve, aurora-silk, automaton-rewind, badge-row,
  band-wipe-stack, bar-built-digits, bar-chart, bayer-dither-dissolve, bead-curtain-reveal, beat-word-slam,
  before-after-reveal, bento-feature-tour, big-bang, blur-dissolve, branch-tree, caustic-pool-logo,
  chat-thread, chip-grid, chroma-slam, circle-pack-word, cli-cascade, cloth-banner-drop, cmyk-pass-print,
  code-morph, code-output-split, command-palette-action, component-broll, condensation-swipe,
  constellation-logo, construction-lines-logo, constructivist-wedge, context-split-panel, counter-lookup,
  crossing-tape-bands, crown-splash-logo, cta-glow-card, cube-net-unfold, cursor-adaptive, cursor-chat,
  cursor-classic, cursor-click, cursor-comet, cursor-cta, cursor-dot-ring, cursor-drag, cursor-glass,
  cursor-gradient, cursor-halo, cursor-morph, cursor-name-tag, cursor-neon, cursor-pixel, cursor-sketch,
  cursor-spotlight, cursor-touch, de-stijl-partition, diagonal-wipe, diff-card, differential-growth-frame,
  document-transform, dot-field-drops, droste-recursion, droste-word-tunnel, eclipse-diamond-logo,
  embroidery-type, emulsion-brush-develop, engraved-line-render, environment-card-stack, extruded-buttons,
  ferrofluid-reach, fiber-optic-logo, file-drop, file-tree, flash-cut, flow-field-threads, focus-zoom,
  foil-seal-number, folded-paper-logo, font-shuffle, frame-to-icon, fresnel-lens-pass, frost-crystal-growth,
  funnel-pour, galton-board-chart, gerstner-color-rings, glow-bloom, glyph-scatter, gradient-mesh,
  gravitational-lens-logo, grid-leak, gyroscope-logo-lock, half-phone, halftone-dot-wave, hex-dump-decode,
  hold-to-confirm, holographic-foil-logo, hook-question, hourglass-count, hud-corners, icon-bloom,
  infinite-loop-cylinder, install-command, iron-filings-field, iso-stack, isometric-skyline,
  jacquard-weave-logo, karaoke-captions, kinetic-lines, kinetic-mobile-words, kinetic-title,
  label-maker-strip, language-editorial-gallery, language-kinetic-poster-backgrounds,
  language-kinetic-poster-cta, language-kinetic-poster-process, language-pixel-terminal-backgrounds,
  launch-intro, led-wall-pullback, lewitt-line-instructions, light-sweep, line-draw, line-spotlight,
  line-zoom-in, linocut-carve, liquid-fill-letters, lissajous-lock, logo-bug, logo-cloud-burst, logo-end-card,
  logo-marquee, logo-point-cloud, lower-third, lp-branch-merge-routing, lp-code-diff-review,
  lp-completion-ladder, lp-contextual-toolbar-anchor, lp-data-chart-comparison, lp-desktop-window-orbit,
  lp-device-exploded-ui-layers, lp-device-handoff, lp-document-page-fan, lp-ex-partner-braid,
  lp-ex-poster-grid, lp-ex-stroke-mark, lp-ex-voice-instrument, lp-image-variation-matrix,
  lp-inspector-parameter-edit, lp-integration-picker-grid, lp-loupe-inspection, lp-model-picker-stack,
  lp-notification-cascade, lp-panel-document-export, lp-parallel-task-fanout, lp-phone-notification-capture,
  lp-queue-conveyor, lp-rank-leaderboard-reveal, lp-report-format-carousel, lp-scroll-to-highlight,
  lp-source-output-mosaic, lp-terminal-browser-proof, lp-two-window-deep-focus, magnetic-button,
  magnetic-number-swarm, marquee-select, mask-sweep-title, mg-audio-audiogram, mg-audio-chart-climb,
  mg-audio-cover-reveal, mg-audio-guest-intro, mg-audio-karaoke, mg-audio-listen-everywhere, mg-audio-on-air,
  mg-audio-pull-quote, mg-audio-tour-dates, mg-audio-vinyl-drop, mg-ba-checklist, mg-ba-morph, mg-ba-split,
  mg-ba-time-bars, mg-ba-wipe, mg-beat-cut-grid, mg-beat-eq-title, mg-beat-waveform, mg-beauty-before-after,
  mg-beauty-booking, mg-beauty-ingredients, mg-beauty-location-cta, mg-beauty-price-menu,
  mg-beauty-promo-sticker, mg-beauty-reviews, mg-beauty-serum-hero, mg-beauty-stylist-intro,
  mg-beauty-swatch-fan, mg-cap-boxed, mg-cap-emphasis, mg-cap-karaoke, mg-cap-safe-zone, mg-cap-two-speakers,
  mg-cap-typewriter, mg-cap-word-pop, mg-code-cli-browser, mg-code-diff-accept, mg-code-install,
  mg-dev-browser, mg-dev-handoff, mg-dev-iso-stack, mg-dev-laptop, mg-dev-phone-feed, mg-dev-tablet,
  mg-edu-certificate, mg-edu-chalkboard, mg-edu-chapters, mg-edu-checklist, mg-edu-countdown,
  mg-edu-curriculum, mg-edu-flashcards, mg-edu-instructor, mg-edu-reels-quiz, mg-edu-testimonials,
  mg-event-agenda, mg-event-announce-reel, mg-event-badge-cta, mg-event-countdown, mg-event-hero-grid,
  mg-event-live-lower-third, mg-event-recap-stats, mg-event-speakers, mg-event-ticket, mg-event-venue-map,
  mg-fin-balance-chart, mg-fin-budget-bars, mg-fin-card-reveal, mg-fin-fx-board, mg-fin-invoice-paid,
  mg-fin-portfolio-donut, mg-fin-savings-ring, mg-fin-shield-cta, mg-fin-ticker, mg-fin-txn-feed,
  mg-fit-class-schedule, mg-fit-coach-intro, mg-fit-heart-zone, mg-fit-interval-timer, mg-fit-leaderboard,
  mg-fit-macros, mg-fit-rep-slam, mg-fit-rings-offer, mg-fit-step-streak, mg-fit-transformation,
  mg-fmt-reframe, mg-fmt-safe-zones, mg-food-booking-slots, mg-food-chalkboard-special,
  mg-food-delivery-route, mg-food-ingredients-drop, mg-food-menu-unfold, mg-food-neon-cta,
  mg-food-review-stars, mg-food-steam-bowl, mg-food-street-poster, mg-food-ticket-print, mg-hire-founder,
  mg-hire-jobcard, mg-hire-kinetic, mg-hire-manifesto, mg-hire-mosaic, mg-hire-perks, mg-hire-process,
  mg-hire-quote, mg-hire-rolescta, mg-hire-teamwall, mg-hook-chaos-order, mg-hook-countdown, mg-hook-glitch,
  mg-hook-question, mg-hook-stat-shock, mg-hook-strike, mg-hook-what-if, mg-logo-orbit, mg-logo-wall-assemble,
  mg-ppl-footage-title, mg-ppl-lower-third, mg-ppl-pip-switch, mg-ppl-split-presenter, mg-ppl-webcam-bubble,
  mg-pr-autozoom, mg-pr-callouts, mg-pr-cursor-click, mg-pr-focus-pull, mg-pr-loupe, mg-pr-prompt-result,
  mg-pr-scroll-page, mg-pr-shortcut, mg-pr-split-proof, mg-pr-spotlight, mg-pr-tilt-pan,
  mg-pr-vertical-reframe, mg-realty-agent, mg-realty-blueprint, mg-realty-listing, mg-realty-map,
  mg-realty-mortgage, mg-realty-reels, mg-realty-skyline, mg-realty-sold, mg-realty-staging, mg-realty-tour,
  mg-shop-add-to-cart, mg-shop-bundle, mg-shop-colorways, mg-shop-endcard, mg-shop-flash-sale,
  mg-shop-listing, mg-shop-price-slash, mg-shop-review-wall, mg-shop-turntable, mg-shop-unboxing,
  mg-wall-bento, mg-wall-changelog, mg-wall-coverflow, mg-wall-fan, mg-wall-iso-wave, mg-wall-marquee,
  mg-wall-one-to-many, mg-wall-pullback, mg-wall-shuffle, milestone-feed, multi-cursor, murmuration-logo,
  newton-cradle-steps, node-flow, number-ticker, odometer-rows, op-art-moire-word, orbit-ring,
  outline-fill-type, pen-annotate, pendulum-wave-line, penrose-bloom, phone-ring, phone-scroll, phone-shelf,
  phone-tumble, photo-grid-explode, photo-reveal, photo-stack, phrase-type-small, planet-ring-headline,
  polygon-lockup, polyrhythm-orbit-list, pop-up-book-spread, popover-open, post-card, price-roll,
  prism-slats-gallery, prism-spectrum-list, product-card, progress-fill, prompt-card, puzzle-grid-reveal,
  qr-end-card, quote-card, quote-wall, radial-bar-bloom, radial-workflow-cycle, rating-summary,
  reaction-diffusion-bloom, reflection-fold, ribbon-path-text, ridgeline-waves, riso-misregister-title,
  rotating-seal-badge, roulette-metric-stop, rubik-slice-twist, sand-logo-settle, sankey-flow-split,
  scramble-resolve, scroll-blueprint-screen, select-and-ask, selection-zoom, shadow-type-sculpture,
  shockwave-logo, side-panel, slit-scan-smear, soap-bubble-pop, speed-lines, split-flap-type,
  stacked-beat-lines, star-trail-logo, stat-slam, status-pill, sticker-bomb-slap, sticky-note-organize,
  stitched-screen-frame, strike-word, stroke-logo, sumi-brush-title, suprematist-drift, table-fill,
  tally-count, tape-measure-count, task-overwhelm, terminal, text-behind-subject, theme-match-cut,
  tilt-showcase, timeline-assembly, toast-cloud, trampoline-mesh, truchet-path-run, typewriter-caret,
  vasarely-bulge-grid, version-stepper, voice-document-cloud, vs-split, water-level-measure,
  watercolor-bleed-logo, wax-seal-logo, whip-phrases, window-collapse, wireframe-browser, word-clock-grid,
  word-curtain-wipe, word-cycler, word-swap, zoom-follow, zoom-through
@40973894   siri-wave
@5d99hgrqzk-wq   manu
@8starlabs
  open-in-chat, partition-bar
@98waseem16   sendmarc-blur
@9fedya   love-story
@a-rok   1-shader
@a.tkachenko84   111
@a00228812   shader-golden-rose
@a11ypros
  a11y-accordion, a11y-label, a11y-radio, a11y-tooltip
@aadarshm
  agent-id, receipt-printer
@aadilghani1
  abacus, api-key-vault, approval-pad, battery-stack, budget-rack, cash-machine, checkout-till,
  container-crane, cryo-stack, deploy-pipeline, desk-globe, ev-charger, firewall-rack, gpu-cluster,
  ground-station, infusion-pump, isokit-smart-meter, isokit-sound-board, metrics-board, parcel-locker,
  pill-sorter, quiz-buzzers, security-key, stamping-press, tally-counter, usage-meter, vault-door,
  vending-machine, wafer-probe, webhook-relay
@aadixc0de
  agent-lanes, agent-notification, ansi-output, approval-inbox, artifact, artifact-panel, artifact-versions,
  aspect-ratio-picker, attachment, audio-player, audio-visualizer, background-run, branch-navigator,
  calculator-widget, canvas, card-carousel, changed-files, chart, chat-header, chat-search, chat-sidebar,
  citation, code-block, command-palette, commit-card, comparison-table, composer-mobile, computer-view,
  connectors, contact-card, context-chips, context-meter, conversation, cost-display, custom-instructions,
  deploy-status, dictation-button, diff-viewer, dither-orb, document-viewer, drop-zone, empty-state,
  environment-variables, event-card, export-menu, file-card, file-tree, generation-settings, generation-stats,
  handoff, image, image-compare, image-edit-region, image-generation, image-grid, inline-chip,
  inline-suggestion, json-viewer, jsx-preview, keyboard-shortcuts, knowledge-base, link-preview,
  mcp-app-frame, media-gallery, memory-chip, memory-manager, mention-menu, message, message-actions,
  message-edit, message-error, message-feedback, message-parts, mic-selector, mode-switcher, model-picker,
  model-status, notebook-cell, onboarding, package-info, permission-mode, plan, product-card, prompt-input,
  prompt-template, pull-request-card, questionnaire, queued-messages, quick-replies, quote-reply, read-aloud,
  reasoning, reasoning-effort, research-progress, research-report, retrieved-chunks, rich-prompt-input,
  run-status, scroll-to-bottom, search-results, selection-toolbar, send-button, settings-panel, slash-menu,
  sources, sql-result, stack-trace, stat-card, streaming-caret, streaming-text, style-picker, subagent,
  suggestions, system-notice, system-prompt-editor, table, temporary-chat, terminal, test-results,
  thinking-indicator, thread-list, thread-summary, ticker-card, todo-list, tool-bash, tool-browser, tool-call,
  tool-file-edit, tool-file-read, tool-file-write, tool-image-gen, tool-mcp, tool-memory, tool-search-code,
  tool-web-fetch, tool-web-search, trace-group, transcript, upload-queue, video-generation, voice-controls,
  voice-orb, voice-session, waveform, weather-card, web-preview
@aakashmehra
  ai-composer, car-drop-menu, coffee-pour-menu, disc-reveal-list, foggy-window-wipe,
  holographic-business-card, liquid-glass-button, liquid-glass-login, nearby-walk-menu, nimbu-mirchi,
  receipt-printer, retro-slide-to-unlock, rotary-passcode, scroll-stacking-cards, skincare-product-shelf,
  smoke-login, sniper-scope, soda-machine, sports-car-dashboard-menu
@aarispathan15   book-slider
@aashkat9   silk-blend-gradient
@aatirchowdhary   neryonix
@aayush-duhan
  card-fan-carousel, cascade-text, halftone-trail, ink-reveal, liquid-gradient, liquid-morph-floating-menu
@abhi3hekk   social-stories
@abhijeetsde   sdasdsad
@abhinavcdev   3d-sliding-cards
@abhipreetpriyansh   ascii-cruex
@abhishek-mallick
  bars, chest, cube, iso-button, iso-card, iso-slider, iso-toggle-group, keys, laptop, nodes, pc-case, pulley,
  rack, reactor, skyline, stack, steps
@abishek1512
  button-1, carousel-card-1
@abui
  animated-chart, scroll-reveal-content-a, timeline
@abushaidislam7
  agency-bento-grid, animated-beam-integration, animated-tree-view, book-a-call-button, emotion-wheel,
  emotion-wheel-v2, fitness-bento-grid, fm-radio-tuner, gemini-code-1790431091111, grid-testimonials-marquee,
  interactive-eye-tracker, interactive-logo-grid, interactive-values-grid, morphing-island-navbar,
  orbit-sweep, orbiting-circles, photo-box, rolling-counter, schedule-calendar, segmented-mode-toggle,
  spatial-card-carousel, tactile-pagination, thermal-dial-widget, tier-badge, unlimited-design-hero
@abxlfazl__   animated-tab-bar
@adamstguide
  fluted-glass-shader, silky-moving-background
@addstack   keys
@AdiKodez
  ask-ai, model-picker
@adit-firdaus
  popover, steps
@aditya.nagpal   starry-nights
@admin-pstzxid
  21-contur-line, button-new-search, button-payment, button-sign-in, contour-line-mountain, contur-land-map,
  contur-line-map, loading-screen-glass, sign-in-water-effect-glass
@admin_104e75dd
  gold-rails, pink-blur, pink-bubble, sima-homes-swift
@admin_163f0598   flow-field-shader
@admin_5eaa986a   dark-mono
@adobe
  aria-css-checkboxgroup, aria-css-colorarea, aria-css-datepicker, aria-css-gridlist, aria-css-listbox,
  aria-css-searchfield, aria-css-switch, aria-css-taggroup, aria-css-tree, colorfield, css-progressbar,
  css-rangecalendar, css-segmentedcontrol, css-togglebutton, tailwind-alertdialog, tailwind-button,
  tailwind-commandpalette, tailwind-switch, tailwind-taggroup
@adrian.s.andersson   toolo-orb-shader
@adrian_3e13d56e   hsbm01
@adrielzimbril
  doodle-callout, generating-orb, gradient-file-upload, handle-reel, kanban, mesh-gradient, orb-bloop,
  thinking-orb, user-presence-avatar, voice-chat-widget
@Adurotimi   save-button
@afa.andres   silk-blend-gradient
@afvastien   butterfly
@agusmayol   show-more
@ahammed.bashar9   glow-horizon
@ahbarati73   my-shader-2026
@ahmedmayara
  ai-assistant-card, area-chart-analytics-card, authentication-card, camera-permission-request-card,
  category-bar-chart, conversion-funnel-area-chart, enable-2fa-card, fullscreen-calendar, notifications-menu,
  one-time-password-sign-in-card, stock-market-tracker-chart, total-sales-chart
@ai2
  accordion-underline, alert-dialog-layout, badges-styled, buttons-ripple, date-picker-compact,
  date-picker-preset, date-picker-tone, empty-styled, field-validation, file-input, input-group-glass,
  input-group-tone, input-otp-glass, inputs-otp, item-drag, item-media, item-motion, kbd-combo,
  progress-styled, radio-group-styled, radio-group-tone, scroll-area-gutter, skeleton-shapes, slider-marks,
  slider-minimal, toggle-group-multi, toggles-particle, toggles-styled
@aicanvas
  blind-pull-toggle, expanding-tabs, magnetic-logo-cluster, runway-loader, stack-tower
@aidankmcalister   confirm-switch
@aideathoughts
  waves-shader, white
@aika.mikkun0917   gradient-c1a9005a
@airbnb-visx
  annotation, axis, bar-group-vertical, bar-stac, bar-stack, brush, chords, curves, delaunay-triangulation,
  drag-and-draw, finance-chart, glyphs, gradients, heatmaps, legends, linktypes, patterns, pie-chart,
  radar-chart, radial-lines, split-line-path, streamgraph, threshold, toggle-nav, tooltip, treemap-chart,
  voronoi, word-cloud, zoom
@aiwhileyousleeping   orb-shader
@ajayk.igxact
  2-shader, c-shader
@ajith66310
  hero-scroll-video-pin-reveal, home-hero-landing-scroll-animation, imgtext-reveal-scroll-animation,
  inversion-circle-scroll-animation, lip-scroll-zoomin-animation, reveal-text, text-animation,
  woodpeck-hero-landing-animation, work-page-hero
@akashsingh890901-crypto   glassmorphism-navigation
@aksharsahilvlog   perpective
@al11o   inline-dropdown
@alain00
  group-chat, user-table
@aldrinjaison   waves-shader
@alexander-rukin   carousel
@alexisroe
  checkbox, chip, log, notification, number-input, segmented
@alexperezcedeno
  ai-mascot-input, interactive-folder-gallery, interactive-tech-stack-builder, lunar-gravity-card,
  magic-dust-shader, robot-hero, volumetric-studio
@alhelo122   red-golden-background
@Ali-Hussein-dev
  card, card-with-cross-patter, card-with-ellipsis-pattern, card-with-grid-ellipsis-pattern,
  card-with-grid-pattern, card-with-lines-patter, card-with-noise-patter
@AliFarooqDev   navbar
@alihamza91   dusk-crossing
@alisonjmarch   sun-gradient
@allanmesquitab   frorest-green
@almaz_3b6728d7
  roman-monolithic, roman-monolithic-2
@aloksivastava1025
  3-d-book-carousel-reading-mode, blue-shade-star-rating, copy-plus-dual-copy-button,
  cue-3d-book-carousel-reading-mode, cue-cell-to-card-calendar-expansion, cue-chained-spring-arc-carousel,
  cue-collapsing-cards-accordion, cue-dot-graph-card, cue-dot-matrix-cascade-typography,
  cue-dynamic-notch-activity-indicator, cue-expandable-book-search-palette, cue-fisheye-chromatic-card-grid,
  cue-flex-grow-benefits-reveal, cue-glossy-slider-call-button, cue-gooey-liquid-feedback-drop,
  cue-interactive-card-sphere, cue-isometric-mechanical-keycap, cue-live-waveform-audio-recorder,
  cue-minimal-ai-dev-workspace, cue-morphing-pill-duration-editor, cue-motionflow-feature-grid-showcase,
  cue-outline-inspector-panel, cue-phantom-infinite-gallery, cue-pixel-perfect-shop-onboarding,
  cue-scrollspy-line-navigation, cue-split-panel-image-synced-faq-features, cue-stacked-deck-scroll-reveal,
  cue-stacker-style-bento-grid, dot-graph-card, dynamic-island-feedback-notch,
  dynamic-notch-activity-indicator, expandable-book-search-palette, glossy-slider-call-button,
  grid-row-profile-expander, outline-inspector-panel, pixel-perfect-command-palette,
  pixel-perfect-shop-onboarding, sticky-cascade-services-timeline
@altered-data   sakura
@alwkala   callout
@Alwurts
  chat-input, chat-suggestions, editable-handle, model-selector, status-edge, tool, tool-invocation
@amankaushik481
  chip-filter, emoji-picker
@amanshakya1808
  animated-form, bot-detection, framework-agnostic, fraud-card, notification-center
@amanshakya307
  auralis, chromatic-fluid, cloudscape, onboard-card, text-morph, vault-lock, velaris
@amerinsky716   silk-blend-gradient
@amir24p   waves
@amiramiro14799   silk-shader
@amirrad8841   1-gradient
@amitgajare2
  option-wheel, proximity-sidebar
@amolj9238   ascidev
@anark17r
  ai-thiking-orb-and-input, code-background, data-rain, lumen-button
@andrehzh
  dither-art, dither-effect
@andrewlu0
  3d-icon-tabs-1, filters, pdf-viewer
@andrewpopov.2014   stuff
@anelkabag
  cta-1, hero4, navbar2
@animbits
  image-text, loaders-bars, loaders-gooey-blobs, loaders-liquid-progress, loaders-morphing, loaders-orbit,
  loaders-pulse, loaders-skeleton, loaders-spinner, specials-linear-carousel, specials-magnetic-drawer,
  text-blur-in, text-dia, text-fade-in, text-highlight, text-slide-up, text-split-reveal, text-svg-text-draw,
  text-word-carousel
@anish-1144   folder
@anishvyapari   e43wr
@ankitsharma2615   process-pillars
@anlearsurvet
  motion-blue-gradient, purple-gradient
@annah668
  theme-1, theme2
@annstav   mesh-drift-shader
@anonbreadwinner   all-about-the-benjamins
@anshuman008   faq-chat-accordion
@antalyabjh345   2tw
@antdesign
  breadcrumb, button-ant, dropdown, float-button, menu-1, pagination-ant
@antonio.salas22   malinois
@anubra266
  accordion-1, angle-slider, basic-slider, basic-tags-input, basic-toast, calendar-1, carousel-1, checkbox-1,
  collapsible-1, color-picker, combobox, countdown-timer, dialog-2, field-components, file-upload-1,
  floating-panel, listbox, menu-1, pagination, password-input, pin-input, popover-1, progress-1, qr-code,
  radio-group, rating-group, segment-group, select-1, signature-pad, steps, switch-1, tabs-component,
  timeline-animation, toggle-basic, toggle-group, tooltip-1, tree-view
@anurag-mishra22
  animated-glitch-text, animated-loading-skeleton, animated-reveal-text, animated-shiny-text, animated-text,
  animated-underline-text-one, circular-reveal-heading, dock-two, interactive-bento-gallery, loader-one,
  progress-indicator, testimonial, text-three
@apfertkz   venom-button
@appica-dev
  alert, autocomplete, avatar, background-pattern, border-beam, carousel, color-area, sparkline, text-animate,
  toc
@appvibed01   auth-switch
@aqualang89
  pull-lamp, speaking-orb
@araujo.dev996   normal-face
@arauzolander   bue-drift
@arazhaddadi   mesh-drift-shader
@arcoss2003   waves-shader
@arhamkhnz
  playful-todolist, radial-intro, radial-menu, spring-element
@arifuzzamanmoin   heximage
@arihantcodes_1f7b8c4d
  accordion-card, accordion-generative, accordion-ghost, account-access-card, activity-empty, ai-chat-card,
  alert-2, animated-drawer, animated-wave-footer, area-chart, audit-log-table, autosize-textarea-customize,
  avatar-1, avatar-stack, banner-tiers, bar-chart, base-button, beam-search, blueprint-tiers,
  calendar-heatmap, candlestick-chart, chat-empty-state, cohort-chart, command-search, conversation-list,
  dark-matrix, data-table, depth-chart, dual-range-slider, dynamic-island, event-calendar,
  expandable-action-bar, faq-tabs-card, feedback-card, floating-label, floating-navbar, footer-section,
  gradient-tiers, hold-to-confirm, http-status-code, image-preview, indicator-chart, ink, input-modal,
  insight-cards, inventory-table, kanban-board, kbd-key, large-name-footer, leaderboard-table, loading-button,
  login-card, login-card-1, market-chart, market-heatmap, memory-chips, metal-button, metal-prompt-bar,
  morph-button, multiple-selector, multistep-form, nav-list-card, navbars, orbital-letters, pie-chart,
  portfolio-chart, profile-dropdown, progress-with-value, project-empty, prompt-composer, quantity-stepper,
  radar-chart, radial-chart, receipt-tiers, responsive-modal, saved-empty, scratch-card, search-empty,
  skeleton, skeleton-reveal, spinner, stacked-circular-footer, star-rating, status-badge, streaming-text,
  tab-navbar, table-empty, task-checkbox, tree-nav, undo-pill, upload-empty, use-toast, webhook-empty
@arikchakma
  cromia-channels, cromia-color-picker, cromia-compact, cromia-swatches, unit-field
@arlanoska
  dia-gradient, embroidered-word-patches, midjourney-ascii, symbols-effect, vector-editor
@armandsalle   autocomplete
@arnoldlo619   chess
@arthur.gallo34   mesh-dashboard
@arthurproductdesign   mesh-portfolio
@arul_286c0cd5   simplex-noise-shader
@arunachalam
  adaptive-notch-navigation-bar, animated-file-tree, animated-table, animated-table-rows,
  animated-theme-toggle-button, animated-theme-toggler, bottom-nav-bar, branching-tree-nav,
  connected-carousel, cookie-banner, cookie-banner-1, corner-frame-animated-button-1,
  corner-frame-scramble-text, expandable-search-bar, feedback-toast, inverted-cursor, media-button,
  modern-animated-sign-in, morphing-arrow-button, outline-text, profile-card-testimonial-carousel,
  scroll-expansion-hero, sidebar-with-chrome-like-tabs, theme-wipe-toggle, thumbnail-button-video-player,
  toast, vertical-theme-wipe-toggle
@arunjdass
  ai-agent-processing-states, ai-planning, dashboard-sidebar, file-upload, focus-hero, fuji, kanban-board,
  neomorphism-metric-card
@aryaanantarkar-byte   voxcoach
@aryankumar06   dwar
@as7393881   chatbot-background
@asalami560   codeflower
@asanshay
  chat-message, chat-reasoning, chat-tool, loader, motion-blur-text, reveal
@ash_de90ff1a   silk-shader
@asherevolved
  aaa, asher-ascii, asherascii
@ashik-siddike   violet-flowing-silk-shader
@ashish.indora   red-in-black
@ashishrajwaniai01
  animated-pattern-cloud, asmr-background, balloons-pop-background, realistic-fog-background
@askgui   phyrs
@asteghlalj   ascii
@astralyxdev
  ab-test-results, anomaly-chart, attribution, budget-guard, cascader, checkout-summary, fmt, health-checks,
  ip-cluster, mask-input, mcp-capability-matrix, mcp-elicitation, mcp-resource-list, mcp-roots,
  migration-list, note-graph, odds-display, prompt-versions, rate-limit-meter, regex-tester, request-builder,
  result
@Astryxdesign
  astryx-alert-dialog, astryx-aspect-ratio, astryx-avatar, astryx-avatar-group, astryx-avatar-group-overflow,
  astryx-avatar-group-overflow-aloksivastava1025, astryx-avatar-status-dot-larsen66, astryx-badge,
  astryx-banner, astryx-base-typeahead, astryx-blockquote, astryx-bottom-sheet, astryx-bottom-sheet-switcher,
  astryx-breadcrumb-item-aloksivastava1025, astryx-breadcrumbs, astryx-button, astryx-button-group,
  astryx-calendar, astryx-card, astryx-carousel, astryx-center, astryx-chat-composer,
  astryx-chat-composer-drawer, astryx-chat-composer-input, astryx-chat-dictation-button, astryx-chat-layout,
  astryx-chat-layout-scroll-button, astryx-chat-message, astryx-chat-message-bubble, astryx-chat-message-list,
  astryx-chat-message-metadata, astryx-chat-send-button, astryx-chat-system-message,
  astryx-chat-tokenized-text, astryx-chat-tool-calls, astryx-checkbox-input, astryx-checkbox-list,
  astryx-checkbox-list-item, astryx-citation, astryx-clickable-card, astryx-code, astryx-code-block,
  astryx-collapsible, astryx-collapsible-group, astryx-command-palette-empty, astryx-toggle-button
@athenasolutionscompany   hero-background
@audiocn
  channel-strip, track-list, volume-control
@audriusnek   icey-night-shards
@aumbhusal   mt
@automate_flows
  adjustable-glass-dashboard, daytake-photo-landing, dimensional-workflow-hero, glassy-coverflow-carousel,
  interactive-workflow-blueprint, knockout-landing-page, liquid-glass-wordmark-footer
@avanishverma4
  3d-folder, 3d-tilt-card, accordion-2, animated-loader-1, bento-grid-01, button, checkbox-02, combo-box,
  dropdown-01, hover-image-preview, infinite-grid-integration, parallax-text-scroll, particle-effect-for-hero,
  pixel-hover-effect, thumbnail-carousel
@avansiva4   focuznow-hero
@awp.richardson   locked-matrix
@axai-kaizoku   animated-theme-toggle
@axelwesselgren
  plastic-button, sign-up-form
@ayhantkt   asaytech-ceo
@aymanch-03
  blog-posts, pricing-section, pricing-tab, user-dropdown
@ayoubmorsli2001
  ayoub-hero, erwsd
@ayushmxxn
  3d-flip-card, code-block, feature-section, flame-button, image-fan-carousel, image-stack-carousel,
  masonry-lightbox, mechanical-keyboard, newsletter, star-rating, tech-stack, testimonials, theme-toggle,
  thumbnail-carousel, toast-1, tubelight-navbar, type-testimonial, vintage-keyboard, voice-testimonial,
  waitlist
@azabroflovski
  checkbox, dialog, o-select, switch
@azharalishan43   blue-waves
@azier7172   xd
@b.vs.khutwad   magifying-glass
@badtzx0
  3d-wrapper, animated-card, animated-card-chart, animated-card-diagram, animated-keyboard, blur-reveal,
  border-beam, cloud-orbit, cursor-cards, dock, glowing-button, gradient-slide-button, like-button,
  shuffle-button, star-button, swipe-button
@bagherifarzad
  dot-matrix, gradient-mesh, noise-field
@baileyrosen3
  gem-smoke, notification-center
@balick
  expand-button, expandable-text, footer-01, interactive-grid, mask-reveal, newsletter-01, segmented-control,
  services-01, underline-link, wave-lines
@bandhuhitesh52003
  badge, breaker, icon-key, kbd, key, keycard, number-wheel, receipt, ticket-sheet, vigilance, wallet
@bange5694   man
@bankkroll
  acme-hero, auth-form-1, code-editor-sheet, commerce-hero, cookie-consent, file-upload-button, file-viewer,
  myna-hero, number-pad, pricing-card
@baozhouqi
  ai-chat-input, magnifier-lens
@bariluis75   liquid
@barriar398   barber
@bart-krakowski   thanos-snap-effect
@barvian
  activity-with-number-flow, number-flow, slider-number-flow
@base-ui   drawer-base
@bastianhjoergensen   bastian-2
@bayagbono   silk-blend-gradient
@bee4   spray-paint-canvas
@belalamrofficial   ai-chat-input-field
@BelkacemYerfa   datetime-picker
@beratberkayg
  ai-loader, animated-button, button, button-1, button-4, code-snippet, feature-card,
  glassmorphism-profile-card, glitch-text, hero, hero-1, highlight-card, iphone, modal-card, product-card-1,
  profile-card, radial-social-menu, roadmap-card, shader-hero, stat-card, subscription-card, wallet-card-2
@berlix
  checkbox, input, menu-vertical, split-text
@bevelui
  aurora-hero, lattice-hero, prism-hero
@bg997965   smoke-ring-cloud-shader
@bhomikproductivitylab
  sign-in-page, sign-up-page
@bidyut10
  add-to-cart-button, booking-slot-calendar, date-range-picker-card, download-button, honey-ember-background,
  sheen-pill-button, three-d-button
@bigbogiballer   pricing-section
@bilalkhanva   neuro-noise-sensation-shader
@binhu01   smoke-shader
@bklitai
  area-chart, bar-chart, candlestick-chart, funnel-chart, sankey-chart
@blackbambu   alignment-matrix
@blacksmith301   ai-hero-background
@boardui   social-button
@botsnew354   ia-siri-chat
@boudjadjasamira   story-scroll
@brentonybss2025
  aa, shadaer-azera-pay, shader-azerapay-site, shader-roxo, shader-vulto-pay
@brijr
  accordion-1, call-to-action-1, feature-modern, hero-modern, pricing-section
@brunninho.oliveira5   fundop-dimension
@brxscr
  sfondo-centra-cloud, sfondo-centrafit, sfondo-centrafit-2
@bshaik5   hallo
@bucharitesh
  magic-cursor, modern-verticle-progress, split-text-effect, view-magnifier
@builduilabs
  animated-counter, animated-tabs, animated-text, filesystem-item, slider
@buname   abe
@bundui
  animated-text, badge10, badge11, bubble4, bubble5, bubble6, button, carousel4, count-animation,
  dropdown-menu10, dropdown-menu11, dropdown-menu5, empty5, empty8, faq1, fireworks-show, floating-button,
  floating-paths, fluid-particles-background, geometric, item1, item7, magnetic-button, marquee-effect,
  navigation-menu4, pagination6, pagination8, pagination9, progress7, promo-section, scroll-area2,
  scroll-area3, scroll-area4, scroll-area6, scroll-progress-bar, slider4, sliding-number, stars, switch10,
  switch8, table1, table11, text-gradient-scroll, textarea-with-error, tilt-effect, toast1, toast10, toast11,
  toast2, toast3, toast6, toast7, toast8, todo-app1, wavy
@bygraveryan   candelstick
@bysages
  avatar-group, block-ui, spinner, switch, typography
@camilleia.pelisson
  earth, handart
@campsite
  system-theme, theme-toggle
@carolinaraulino
  ai-agent-mascot, draggable-widget-grid, grid-pulse, reactive-glow-grid, techstack
@carstenfson   bloom-field-gradient
@cdmorozov   dedsec
@cesaroeduardo   flip-card
@chamaac
  dancing-letters, electric-mist, gif-text, grid-bloom, how-it-works, light-speed, nebula, shimmer-button,
  synthesis, text-loop, water-caustic, waves
@chandreyee.style   guapdexploration1
@charith1283p   new1
@charl3x   star-pixel
@chetanverma16
  alert, animated-tabs, audio-player, avatar-group, calendar, dropdown-menu, floating-action-menu,
  input-with-tags, stacked-cards-interaction, stacking-navbar, status-cycle-button, switch, video-player,
  word-loader
@chettrinishal3   ziidstudio
@chillacollab   kaaba
@chowlol202
  animated-gradient-button, globe-hero, grain-gradient-hero-section, liquid-metal-hero, modern-timeline,
  onboarding-checklist
@chrisdalbano
  fz-accordion, fz-button, fz-table
@cinquinandy
  animated-hero-with-web-gl-glitter, lightning-split
@cipriantitire
  compass, engraved-client-plates, faq-drawer, machined-footer, mechanical-odometer, pull-cord-lamp
@cldgayo   iridescent-raymarched-glass-metaballs
@clemd04   trident
@clementjanssens   color-picker
@clevision
  accordion-1, axiom-formula-hero, basic-avatar, breadrcrumb, button-group, buttons, calendar-1, card-studio,
  checkbox-1, collapsible-1, combobox, file-upload, hero-section-01, input-otps, kiln-pixel-heat-hero,
  logo-cloud, radio-group-1, shadcn-studio-about-us-page-30, shadcn-studio-faq-component-21,
  shadcn-studio-hero-section-41, shadcn-studio-hero-section-44, shadcn-studio-testimonials-component-26,
  shadcn-studio-timeline-component-07, shadcn-studio-waitlist-01, switch-1, syntra-hero, text-area
@cloudyzero93   purp-wave-shader
@cnippet-dev
  aero-hero-1, aero-hero-3, announcement-banner, avatar-stack, billing-warning-alert-dialog, blogs,
  boxly-pricing-1, breadcrumb, button, changelog-carousel, checkbox, cnippet-accordion, cnippet-button,
  cnippet-chart, cnippet-collapsible, cnippet-empty, cnippet-switch, cnippet-table, cnippet-toggle,
  cnippet-toggle-group, cnippet-toolbar, context-menu, context-menu-icons, counting-number,
  date-picker-with-presets, davincho-hero-1, domain-input-group, faq-accordion-card, flow-hero-1,
  formatting-toolbar, incident-status-timeline, logout-confirmation-dialog, m-parallax-floating-3,
  m-random-letter-swap-1, m-random-letter-swap-2, m-text-cursor-proximity-1, m-text-generate-effect-2,
  m-text-highlight-3, m-variable-font-cursor-proximity-1, m-variable-font-cursor-proximity-2,
  m-variable-font-cursor-proximity-3, m-variable-font-hover-1, m-variable-font-hover-2,
  m-variable-font-hover-3, m-vertical-cut-reveal-2, menu, multi-level-collapsible-menu,
  onboarding-step-tracker, package-dependency-list, pagination-button-group, parallax-floating,
  password-strength-field, plan-addon-selector, popover, progress, promise-toast, random-letter-swap,
  rate-limit-alert-dialog, read-more-content-expander, role-permissions-picker, scroll-progress,
  scroll-reveal, scroll-reveal-2, scroll-swap-text, scroll-velocity-text, segmented-control-tabs, select,
  services-with-animated-hover-modal, settings-sidebar-accordion, splitting-text, sprint-planner-calendar,
  sprint-task-checklist, tabs-with-icons, team, text-generate-effect, text-gradient, text-loop, text-morph,
  text-reveal, text-roll, text-scramble, textarea, textarea-with-label, time-off-request-calendar, toast,
  v-accordion-10, v-accordion-11, v-accordion-4, v-accordion-5, v-accordion-6, v-accordion-8, v-accordion-9,
  v-alert-15, v-alert-3, v-alert-5, v-alert-6, v-alert-7, v-alert-dialog-8, v-breadcrumb-10, v-breadcrumb-12,
  v-breadcrumb-5, v-breadcrumb-6, v-breadcrumb-9, v-calendar-10, v-calendar-12, v-calendar-13, v-calendar-14,
  v-calendar-15, v-calendar-16, v-calendar-3, v-calendar-4, v-calendar-5, v-calendar-8, v-calendar-9,
  v-card-11, v-card-14, v-card-15, v-card-16, v-card-17, v-card-18, v-card-19, v-card-5, v-carousel-11,
  v-carousel-8, v-chart-4, v-checkbox-10, v-checkbox-11, v-checkbox-13, v-checkbox-4, v-checkbox-5,
  v-checkbox-6, v-checkbox-7, v-checkbox-8, v-checkbox-9, v-checkbox-group-14, v-checkbox-group-3,
  v-checkbox-group-5, v-checkbox-group-8, v-collapsible-15, v-collapsible-3, v-collapsible-4, v-collapsible-5,
  v-collapsible-7, v-collapsible-9, v-combobox-10, v-combobox-13, v-context-menu-14, v-context-menu-2,
  v-dialog-9, v-drawer-15, v-field-10, v-field-11, v-field-13, v-field-14, v-field-15, v-field-17, v-field-18,
  v-field-19, v-field-20, v-field-21, v-field-7, v-fieldset-10, v-fieldset-6, v-fieldset-7, v-fieldset-8,
  v-fieldset-9, v-form-11, v-form-12, v-form-13, v-form-6, v-form-7, v-form-8, v-form-9, v-group-11,
  v-group-13, v-group-15, v-group-16, v-group-17, v-group-18, v-group-7, v-label-11, v-label-12, v-label-13,
  v-label-14, v-label-15, v-label-7, v-label-8, v-label-9, v-menu-12, v-menu-15, v-meter-6, v-meter-7,
  v-meter-8, v-select-11, v-select-13, v-select-2, v-select-6, v-select-7, v-sheet-1, v-sheet-14, v-sheet-7,
  v-skeleton-10, v-skeleton-11, v-skeleton-12, v-skeleton-13, v-skeleton-4, v-skeleton-7, v-skeleton-8,
  v-skeleton-9, v-slider-11, v-spinner-14, v-spinner-6, v-spinner-7, v-switch-8, v-table-12, v-table-3,
  v-table-6, v-tabs-13, v-tabs-2, v-tabs-6, v-textarea-10, v-textarea-6, v-toast-15, v-toggle-10, v-toggle-11,
  v-toggle-14, v-toggle-15, v-toggle-2, v-toggle-9, v-toggle-group-3, v-toggle-group-4, v-toggle-group-7,
  v-toolbar-3, v-toolbar-8, v-tooltip-11, v-tooltip-12, v-tooltip-13, v-tooltip-7, vercep-feature-1,
  vertical-cut-reveal, zoom-level-toggle-group
@Codehagen
  action-button, button-group-with-icons, display-cards, floating-action-panel, hero, hero-badge, icons,
  popover, previous-next-button-group, pricing, timeline, use-expandable
@coderislive07
  ai-assistat, travel-connect-signin-1
@codeweb-dev
  animated-gradient, ghost-ether, image-trail, keyboard, tactile-highlight
@coltmanfre   metaballs-shader
@contentbit   pros-cons
@corr
  animated-spinner, area-chart, audit-log, key-value-list, notice-alert, pie-chart, presence-fade,
  scroll-blur, stepper
@coss.com
  alert, async-autocomplete, breadcrumb, calendar, checkbox, checkbox-group, combobox, coss-accordion,
  coss-autocomplete, coss-avatar, coss-badge, coss-button, drawer, field, form, frame, loading-button-spinner,
  menu, number-field, otp-field-separator, p-breadcrumb-4, p-breadcrumb-7, p-calendar-17, p-calendar-25,
  p-calendar-7, p-combobox-20, p-group-15, p-number-field-11, p-otp-field-10, p-otp-field-7, p-otp-field-9,
  p-separator-1, p-skeleton-1, p-slider-14, p-slider-21, p-slider-23, p-table-4, p-table-8, p-tabs-9,
  p-textarea-11, p-textarea-12, p-textarea-15, p-textarea-8, progress, slider, spinner, switch, table, tabs,
  tabs-count-badge, textarea, toggle, toolbar
@crafterui
  dither-helix-carousel, handwritten-response, hero-carousel, mercury-dial, molten-ring-carousel,
  spine-accordion, super-hover-list, username-reel, works-wheel
@creation2224   key-math
@criminode   cells
@critcoder   threejs-particles-waves
@crm.onpointnetwork   neonic-rings
@crysta1221
  attachment, button
@cubby-ui
  autocomplete, copy-button, timeline
@cult-ui
  3d-carousel, ai-blob-warp, bg-animated-button, bg-animated-fractal-dot-grid, color-picker, distorted-glass,
  dock, dynamic-island, edge-blur, expandable, family-button, feature-carousel, floating-panel, folded-card,
  glass-effect, grid-beam, halo-dropzone, halo-notification, halo-switch, halo-toggle-group, hero-color-panel,
  hero-dithering, hero-heatmap, hero-liquid-metal, hero-static-radial-gradient, kanban-board, logo-carousel,
  morph-surface, organic-card-small, pixel-heading-word, popover-form, prompt-composer, shift-card,
  side-panel-video, svg-shapes, tabs-illustration-vercel, texture-button, timer, typewriter, vote-tally,
  youtube-video-player
@cybergaz   neon-button
@dailydischq   email-categories
@daiwiikharihar
  3d-topology-mesh, aether-ribbon-mesh, aether-vortex, ai-chat-input, arc-spread-hero, aurora-curtain,
  bento-dashboard, block-text, brutalist-deck-loader, card-stack-loader, caution-tape-text,
  chladni-acoustic-grid, chladni-wave-field, cinematic-glow-toggle, cinematic-list, cinematic-orbit-hero,
  cinematic-studio-switch, circularium-ring, color-pairing-card, constellation-grid, constellation-vortex,
  cube-loader, curly-wave-poster, curtain-split-hero, cylinder3-d-ring, eclipse-corona, elastic-gallery,
  figma-brand-hero, flip-disk-matrix, fluid-flow-grid, glare-cards, glitch-text-animation, harmonic-wave,
  helix-chrono-matrix, hero-shutter-text, holographic-foil-card, hover-terminal, hyper-grid,
  hyperdimensional-voxel-cube, industrial-switch, iso-fader, isometric-hex-chart, kaleidoscope-symmetry,
  kinetic-dots-loader, kinetic-matrix, kinetic-particle-fabric, kinetic-team-hybrid, lattice-background,
  liquid-grid-text, loading-animations-demo, logo-cloud, lorenz-attractor, magnetic-puzzle, metaball-morph,
  moire-shear-field, murmuration-boids, neo-brutalist-kinetic-deck, neon-mesh, next-reveal, nvidia-dgx-pod,
  panoramic-spread-hero, perspective-tunnel-hero, phyllotaxis-bloom, pillar-grid, prismatic-display,
  profile-card, quantum-cloud-loader, quantum-flux, quantum-swarm, radial-burst, radial-spread-hero,
  reveal-image-mask, revenue-velocity, rolling-list, scroll-triggered-video-hero, singularity,
  sketchy-blueprint-text, slanted-spread-hero, spatial-depth-hero, spatial-product-showcase,
  split-axis-convergence, stack-spread, tensor-core-gpu, text-block-animation, text-reveal, tweet-card,
  voxel-matrix, voxel-topography-grid, wave-field, wave-text, waving-hand-poster, z-axis-vortex
@daniel__designs
  3d-ascii-model-viewer, gradient-shader-card
@Daniela_Muntyan   shader-clock
@danielleppy9   de-grade-s-bleu
@danielpetho
  animated-gradient-with-svg, basic-number-ticker, box-carousel, breathing-text, css-box, elastic-line,
  image-trail, letter-3d-swap, letter-swap, marquee-along-svg-path, parallax-floating, pixel-trail,
  random-letter-swap, scramble-hover, scroll-and-swap-text, stacking-cards, text-along-path,
  text-cursor-proximity, text-highlighter, text-rotate, typewriter, underline-animation,
  underline-to-background, use-debounced-dimensions, use-elastic-line-events, use-mouse-position,
  use-mouse-position-ref, use-mouse-vector, use-screen-size, variable-font-and-cursor,
  variable-font-hover-by-letter, variable-font-hover-by-random-letter, vertical-cut-reveal
@DanielWhit21874   slot-text
@daniyalsherafat1   waves-shader
@danjune1998
  perfect-by-idk, ug-sl-by-idk
@dariokuettel   spinner
@darkapoparka1   11
@darrell   meatball
@darshan-rajadhyaksha
  backdrop, dialog, input, switch
@daschinmoyy21   ascii-flower
@datafobik   datafobik
@davailospirasto   handwriting-text
@davekatague   valley-of-the-mind
@david-greenfieldlp   d60-hero
@dborg741   dither
@ddoemonn
  accordion, collapsible-banner, command-palette, context-menu, copy-button, drawer, dropdown, filter-grid,
  floating-label, hide-on-scroll, hold-to-confirm, inline-validation, like-burst, load-more, loading-button,
  logo-marquee, long-press, modal, new-items-pill, otp-input, pagination, password-strength, poll-results,
  popover, presence-avatars, press-depth, progress-bar, reading-progress, reorder-list, ripple, scroll-spy,
  segmented-control, show-more, skeleton-swap, slider-detents, snap-carousel, sortable-table, sticky-header,
  streaming-text, swipe-deck, tabs, tag-input, task-steps, text-reveal, tooltip-group, tree-view,
  typing-indicator, value-flash, wizard-steps
@debhyalok007   tid
@decodewithdeepak   modem-animated-footer
@deepa.kumawat   mesh-drift-shader
@deepaksslibra   fluid-menu
@deepraj21
  glass-accordion, glass-badge, glass-date-picker, glass-dock, glass-input, glass-knob, glass-message,
  glass-notification, glass-otp, glass-qrcode, glass-select, glass-sidebar, glass-snippet, glass-stepper,
  glass-switch, glass-tab-bar, glass-tabs, glass-terminal, glass-toast, glass-toolbar
@delhielectronicsstore01   image
@deltacomponents
  admonition, auth-form, basic-dropdown, modal-drop, mp3-player, product-card, scramble-text
@demonstrikk
  background, random, water-button
@dennysdionigi   apple-liquid-glass-switcher
@designali-in
  accordion-01-1, accordion-02-1, accordion-03, accordion-04, accordion-05, ai-actions, ai-gen,
  animated-canvas, animated-dots, animated-grid, animated-leaves, animated-spinner, animated-text, award,
  bento-grid, blobs, block-game, book-a-demo-1, book-a-demo-3, book-a-demo-4, bouncing-balls, browser,
  bubble-animation, button-border, button-rotate, button-rotate-1, button-soft-glow, calendar,
  call-to-action-01, canvas, canvas-effect, clock, color-picker, compare-2, cosmos-spectrum, custom-cursor,
  dock-tabs, dot-pattern, dot-sphere, financial-score-cards, finger-scan-button, fire-ball,
  floating-particles, fluid-dynamics, fluid-particle, gallery, gauge-1, git-hub-calendar, glowing-shadow,
  glsl-hills, gooey-marquee, graaadeints, gradient-blur, gradient-mesh, gradient-wave, grid-pattern,
  header-01, header-02, header-03, header-04, hero-01, hero-02, hero-03, hero-designali, hero-shader,
  image-zoom, interactive-canvas, interactive-dots, interactive-dots-1, interactive-grid, interactive-light,
  iphone-16-pro, keyboard, led-display, liquid-glass-button, liquid-glass-card, loading-overlay, login-page,
  logos-05, mac, macbook-pro, marquee, marquee-card, matrix-ripple, mechanical-waves, morphing-light,
  mouse-quadrant-tracker, navbar, network-animation, neural-noise, orbital-gallery-hero, particle-animation,
  particle-animation-1, particle-canvas, particle-canvas-1, particle-canvas-2, particle-hero,
  particle-text-effect, payment-card, pixel-animation, pixel-grid, radial-lines, rain, rainbow-text-effect,
  ripple-canvas, ripple-grid, safari, scroll-progress-1, shader-animation, shader-lines, shiny-button,
  simplex, snow-flakes, space-background, spark-effect, sphere, spreadsheet, stamp, starfield, starfield-1,
  stars-canvas, stats-2, studio-display-02, svg-follower, swirl, text-aimation, text-color, text-particle,
  text-wave-animation, theme, theme-button, theme-dropdown, theme-switch, theme-tabs, thermal-shader,
  typewriter, vector-field, vercel-hero, vercel-navbar, void-animation, warp, wave, wave-1, wave-animation,
  wave-animation-1, web-gl-shader
@designeryue   shader-b3e94fd7
@designevolve8
  background-water, color-panels-opening-shader, shader-25c74d5d
@dev.brijosh   final-cta-banner
@dev.shejanmahamud
  animated-toast, animated-tooltip, expanded-map, feedback-widget, shutter-text
@dev.yadhakim
  animated-state-icons, animated-weather-icons, elegant-carousel, interactive-globe
@devcse4011   c-block-art
@devendrababu9666   context-window-packer
@devetaigabbai   beautiful-simple-badges
@devmughal8   grained-gradient
@devongovett   react-aria-emoji-picker
@deymond.laplasa   neuroserver1
@dfernandez266   acg
@dg.singh252525   3-d-coverflow-carousel
@dgearsonu1
  dashboard-configuration, pricing-card, pricing-table
@dhanee.dx   spider-man
@dhileepkumargm
  3d-animation, 3d-cards-slider, 3d-interactive-card-gallery, 3d-perspective-card, abstract-glassy-shader,
  aether-anomaly, aether-flow, aether-flow-hero, ambient-aurora, anomalous-matter, anomalous-matter-hero,
  anomalous-matter-s, arctic-map-pattern, aura-core, aurora-background, aurora-background-1,
  aurora-background-2, aurora-card, aurora-flow-shader, aurora-hero, aurora-hero-bg, aurora-hero-bg-1,
  aurora-hero-bg-2, aurora-shader, aurora-voice-hero, celestial-bloom-shader, celestial-ink-shader,
  celestial-loom, celestial-orrery, celestial-resonance, celestial-sphere, celestial-sphere-shader,
  chrono-board, chronos-engine, chronos-engine-1, colorful-wave-pattern-1, community-testimonial,
  cosmic-aurora, cosmic-nebula, cosmic-ocean-shader, crypto-hero, crystal-cursor, crystal-shader,
  crystal-trail-background, crystalline-cube, crystalline-field-hero, cyber-matrix-hero,
  cybernetic-bento-grid, cybernetic-grid-shader, cybernetic-team-showcase, data-grid-hero, digital-aurora,
  digital-glitch, digital-loom-background, digital-petals-shader, dithered-shader-background-1,
  dynamic-waveform, ethereal-ink, field-lines-aurora, fire-nightmare-shader, floating-card-gallery,
  flowfield-glyphs-background, flowing-curtains, flowing-waves-shader, fluid-text-morph, fractal-bloom-tree,
  frosted-image-reveal, frosted-image-reveal-1, generative-art, generative-art-gallery, geometric-sphere,
  glass-refraction-hero, glass-shine-card, glitch-cursor, glowing-hero-background, gold-map-pattern,
  gooey-button, grid-glow-background, grid-shader, habit-faq-scroller, hello-vietnamese-effect, hero-section,
  hexagonal-puls-shader, holographic-card, holographic-interface, hyperdrive-hero, hyperspace-warp-drive,
  img-reveal, infinite-plane, interactive-3d-analytics-dashboard-card, interactive-3d-character,
  interactive-command-card, interactive-shader, interactive-synapse-network, interactive-waves,
  iridescent-braided-shader, island-pattern, kaleidoscopic-shader, kinetic-orb-loader, kinetic-scroll-gallery,
  light-up-shader, lining-waves-shader, liquid-aurora, liquid-crystal, liquid-crystal-shader,
  liquid-metal-vortex, liquid-neon-shader, liquid-reveal, liquid-shader, lissajous-nebula, living-ferrofluid,
  living-fluid-background, living-fluid-hero, living-nebula, living-nebula-1, living-nebula-2,
  living-origami-bg, living-vine-background, loading-animation, logo-scroller, magnetic-dock, martrix-shader,
  metaballs, modern-feature-grid, molten-core-shader, mountain-scene, mountainous-shader, multi-shape,
  multi-step-wizard, multiple-form, music-player-card, nebula-forgery, neno-shader, neon-crystal-city,
  neon-loader, neurons-hero, parallax-shader, particle-text-canvas, pattern-shader, pixel-rocket-voyager,
  premium-auth, prism-bloom-shader, profile-card, pulsar-grid-background, pulse-fit-hero,
  pulsing-geometric-dream, quantum-grid-hero, quantum-nebula, react-tailwind-image-gallery,
  reaction-diffusion-genesis, refer-and-win-banner, retrying, reward-categories, rhythmic-ripples-background,
  rocket-loader, scrolling-holographic-card-feed, sdf-dreamscape, sentinel-core, shader-animation,
  shatterable-glass-card, shutter-reveal, signal-authentication, sketchbook-reveal-card, sonic-waveform,
  spiral-shader, spotlight-background, symmetry-engine, synapse-background, tech-solutions-hero-section,
  terminal-bento-grid, text-effect, ultra-quality-data-table, ultra-quality-showcase-grid,
  vertical-logo-scroller, volumetric-glitch, warp-drive-shader, warp-gradient, warp-tunnel, wave-text-canvas,
  wavy-shader-animation, woven-light-hero
@dhmnpunit
  mac-os-dock, mac-os-menu-bar
@dhxwhy
  activity-heatmap, agent-tool-timeline-chat-input, airplane-window-gallery, allocation-slider,
  amber-ascii-code-rain-background, amber-glow-gradient-hero-background, avatar-status-ring, bar-race-chart,
  branching-reasoning-chat-input, breakdown-stat-card, calm-violet-silk-shader-hero-background,
  changelog-timeline, cited-answer-chat-input, color-filter-gallery, comparing-radio-cards,
  constellation-gallery, country-search-palette, delta-number-ticker, dialog-to-toast, domino-gallery,
  drag-select-checkbox-group, early-access-pass-cta, elevator-doors-gallery, expiring-badge,
  ferris-wheel-gallery, first-item-empty-state, flag-globe, highlight-testimonial-section, highlight-textarea,
  identifier-first-login, light-amber-aurora-shader-background, light-mint-cream-gradient-hero-background,
  lighthouse-gallery, live-activity-dock, live-notification-feed, live-preview-form, magic-link-otp-login,
  metro-map-gallery, mint-ascii-dot-field-light-background, morph-dialog, natural-language-date-picker,
  orbit-spotlight-gallery, outcome-spinner-loader, palette-picker-gallery, pendant-lamp-rail,
  picture-rail-gallery, plan-finder-pricing-table, product-rail-gallery, progressive-sign-up-form,
  qr-code-scan-login, radial-wedge-gallery, rail-panel-sidebar, read-along-text, resolving-alert-banner,
  scrub-pagination, skate-deck-rail, sliding-puzzle-gallery, spotlight-comparison-table, staged-progress-bar,
  status-dropdown-select, stretch-tabs, sun-moon-theme-toggle, sushi-conveyor-menu,
  teal-mist-waves-shader-background, team-lanyard-rail, testimonial-globe, thinking-prompt-input,
  two-plan-diff-pricing-table, undo-countdown-button, usage-slider-pricing-table, validation-checklist-input,
  violet-ascii-wave-hero-background, violet-aurora-gradient-hero-background, wordmark-reveal-footer,
  workspace-picker-login
@dialkit   dialkit
@diarmuradi
  faq-11, faq-13, faq-14, faq-6, faq-9, gloss-button, header-2, logo-orbit, message-scroller, new-password-1,
  new-password-2, pill-button, pricing-1, pricing-10, pricing-12, pricing-13, pricing-5, pricing-6, pricing-7,
  pricing-8, pricing-9, recovery-code-1, recovery-code-2, reset-password-1, reset-password-icon-card,
  sign-in-3, sign-up-1, sign-up-2, two-factor-1, verification-1
@diceui
  banner, circular-progress, compare-slider, kanban, marquee, mention, pending, scroller, sortable, stack,
  status, swap
@diegocavallaro8   uss
@digitalzone0707   dynamic-island-toc
@digogois2   p-shader
@dillionverma
  animated-beam, animated-circular-progress-bar, animated-gradient-text, animated-grid-pattern, animated-list,
  animated-shiny-text, animated-subscribe-button, avatar-circles, blur-fade, blur-in, border-beam, comic-text,
  confetti, cool-mode, dock, dot-pattern, fade-text, file-tree, flickering-grid, flip-text, globe,
  glyph-matrix, gradual-spacing, grid-pattern, hero-video-dialog, hyper-text, interactive-hover-button,
  interactive-icon-cloud, line-shadow-text, marquee, morphing-text, number-ticker, orbiting-circles,
  particles, pixel-image, pointer, progressive-blur, rainbow-button, retro-grid, ripple-button, safari,
  scratch-to-reveal, script-copy-button, scroll-based-velocity, shimmer-button, shine-border, shiny-button,
  smooth-cursor, sparkles-text, spinning-text, terminal, text-reveal, tweet-card, typing-animation,
  warp-background, word-fade-in, word-pull-up, word-rotate
@diogotesch
  bloom-field-gradient, bloom-field-gradient-2
@diriktv
  animated-counter, confetti-background, music-artwork
@dixant   tooltip
@dkhorzoghy   gradient
@dmwilliam0   plasma-shader
@dobotox   shader-0cfd140c
@dqnamo
  agent-dock, animated-banner, dynamic-button, game-of-life-loader, iridescent-foil, logo-trace-loader,
  model-selector, scramble-text, scroll-fade-list, signature
@drdruide   destructive-button
@drewbasadre   drew
@drewdog   builder-os-bento
@ds-spec   live-list
@dubinc
  banner, sidebar-news
@dumbrik44   silk-shader
@duuuk   a-ascii
@dyeansee   circular-theme-reveal
@ebnsina
  alarm-clock, calendar, code-block, command-palette, dialog, hourglass, inline-edit, radio-group,
  scroll-area, shaka-video, sign-in, sortable, split-button, stopwatch, timer, toggle-group, video-player,
  visualizer, voice-note
@Edil-ozi
  custom-checkbox, scroll-velocity, toggle
@eduardoamaral.ux   shader-dither
@educalvolpz
  accordion-2, agent-avatar, ai-approval, ai-artifact, ai-citation, ai-context-meter, ai-diff, ai-loader,
  ai-message, ai-reasoning, ai-response, ai-sources, ai-suggestions, ai-task-list, ai-tool-call,
  animated-file-upload, animated-input, animated-progress-bar, animated-tabs, animated-tags, animated-toggle,
  auth-form, basic-accordion, basic-modal, blur-out-up, bottom-up-letters, code-block, coverflow-carousel,
  cursor-follow, depth-parallax-words, dither-image, drawing-cursor, duration-picker, dynamic-island,
  fade-through, faq-3, faq-4, favicon-search, float-input, fluid-hover-highlight, github-stars-animation,
  glass-card, gravity-stars, hover-expand, hover-image-list, image-metadata-preview, inline-testimonials,
  interactive-image-selector, job-listing, liquid-metal, micro-scale-fade, modal, number-flow,
  orbital-image-wheel, otp-input, per-word-crossfade, pixel-flow-field, prism-sweep-transition, reveal-text,
  reviews-carousel, rolling-text, scrollable-card-stack, sdf-blob-transition, sdf-circle-transition,
  shader-reveal-luma-transition, shader-reveal-transition, shared-axis-y, short-slide-down, short-slide-right,
  siri-orb, smooth-button, social-selector, soft-blur-in, spring-scale-in, svg-clip-mask, switchboard-card,
  team-1, team-2, tweet-card, typewriter-text, wallet-card, warped-circle-transition
@educonnect.help49   d-ascii
@edwinvakayil
  ai-input, alert, b-popover, bento-builder, breadcrumbs, charts, checkbox-group, code-block, color-picker,
  combobox, dia-text, faq-pro, favicon-badge, file-tree, icon-bar, infinite-ribbon, morph-texts, new-badge,
  new-button, new-calendar, new-card, new-checkbox, new-hover-card, one-accordion, one-alert-dialog,
  one-avatar, one-toogle, origin-button, r-collapsible, r-dropdown, r-popover, r-progress, r-select, r-tabs,
  rolling-digits, shimmer-text, status-dot, text-inertia, the-button-group, the-checkbox-group, the-dialog,
  the-typewriter, theme-toggle, thinking-indicator, toggle-group, tooltip, verified-badge
@efferd
  app-store-button, auth-divider, auth-modal, auth-page, avatar-uploader, bento-pricing, bg-pattern,
  blog-section, blogs-3, comments, contact-card, contact-page, create-workspace-modal, cta-3, dialog,
  dotted-surface, drawer, falling-pattern, faqs-1, footer, footer-2, footer-section, gradient-background,
  gradient-dots, grid-card, grid-feature-cards, header-1, header-2, header-3, header-with-search, hero-1,
  hero-3, illuminated-hero, image-gallery, integrations-4-2, integrations-5, invite-member-modal, lazy-image,
  logo-cloud-2, logo-cloud-3, logo-cloud-4, logo-cloud-5, menu-toggle, menu-toggle-icon, minimal-auth-page,
  minimal-footer, modal, not-found-2, not-found-page-1, pattern-text, popover, pricing, pricing-4,
  pricing-card, search-modal, simple-header, single-pricing-card-1, smart-popover, spinner-1, sticky-footer,
  team-1, team-2, testimonials-1, testimonials-2, testimonials-3, testimonials-6, testimonials-section,
  text-disperse, toggle-theme, wave-path, workspaces, zoom-parallax
@ekmas   accordion
@eldoraui
  ipad, map
@elements-
  ai-artifact, ai-messages, chain-of-thought, conversation-tree, error-boundary-ui, json-viewer,
  loader-cli-spinner, loader-glitch-text, loader-helix, loader-morphing-blob, loader-signal-bars,
  loader-terminal-decode, message-bubble, prompt-diff, routing-indicator, schema-viewer, sources,
  stream-debugger, streaming-text, suggested-actions, tool-call, uploadthing-dropzone, uploadthing-image-grid,
  uploadthing-paste, uploadthing-progress, upstash-counter, upstash-leaderboard
@ElevenLabs-crawled
  audio-player, bar-visualizer, live-waveform, orb, response, shimmering-text, voice-picker, waveform
@eliaszaki   silk-blend
@enoughtools   bubble
@epandozi   mesh-drift-shader
@ephraimduncan
  ai-04, chat-02, command-menu-04, dialog, dialog-1, dialog-deactivate, dialog-info, dialog-modal,
  dialog-projectstarter, file-upload, file-upload-01, file-upload-03, file-upload-04, file-upload-1, form,
  form-1, form-2, form-layout, grid, info-dialog, login-03, login-05, login-06, login-08, login-1, login-2,
  login-3, login-signup, onboarding-01, onboarding-02, onboarding-03, onboarding-04, onboarding-05,
  onboarding-06, onboarding-07, registration, share-dialog, signup, stats-4, stats-cards-with-links, table-05,
  upload, upload-1, upload-advanced
@erikvalencia1
  animated-tabs-background, floating-dock-navigation, hero-odyssey, hover-button, hover-button-1,
  hover-link-animation, hover-text-glow, interactive-ripple-background, layer-parallax-hero, morphing-text,
  pricing-card-with-features, voice-recording
@esraafathy79295   shader-67130b9a
@ethan.dellisse   kdkdkzakdzjkfdadza
@eugeneshilow
  agentic-factory-3d, bench-matrix, bubble-field, delta-bars, dumbbell-range, dune-flow, frontier-board,
  heat-strip, leaderboard-bars, leaderboard-table, paired-bars, rank-bars, rank-slope, share-strip,
  stacked-activity, treemap, value-columns, verdict-stack
@evansliaudet   animated-select-1
@evilrabbit   lifeline
@extend
  bounding-box-citations, document-color-picker, layout-blocks
@extend-hq
  button, card, csv-viewer, dropdown-menu, file-system, file-upload, file-upload-2, pdf-viewer, scroll-area,
  select, xlsx-viewer
@extraemailhai06   mythos-red
@ezam0000
  collab, ezpz-chrome-type, ezpz-dither-portrait, ezpz-rubber-duck, ezpz-type-cube, ezpz-type-fold,
  ezpz-type-steps, ezpz-type-tunnel
@ezydong   shader-59f0538a
@f0rextasy
  action-sheet, address-form, alert-dialog, area-chart, audit-log, badge-printer-template, base64-tool,
  block-timeline, board-checklist, bottom-sheet, bubble-chart, cart-badge, checkbox, console-panel,
  countdown-v2, country-select, currency-select, data-table, diff-editor, email-input, feedback-vote,
  feedback-widget, field-array, file-image-preview, follower-list, form-builder, form-field, gallery-grid,
  gallery-lightbox, health-bar, hero, input-mask-phone, invite-modal, joystick, json-formatter, keypad,
  matchmaking-lobby, migration-banner, milestone-chart, mobile-menu, model-picker, month-picker, navbar,
  network-graph, newsletter-signup-ticket, nps-survey, order-card, page-empty, pagination-v2,
  password-strength, payment-methods, popover, profile-settings, progress, prompt-history, pull-refresh,
  push-permission, recurrence-picker, regex-visualizer, row-expand, sample-data, score-keeper,
  screenshot-frame, session-list, sidebar-v2, skeleton-v2, split-flap, stamp-seal, star-rating-input,
  stopwatch, stopwatch-v2, swipe-actions, tabbar-v2, theme-preset-picker, time-input, tour,
  tournament-bracket, train-departure-board, two-factor, watermark, webhook-log
@fadeichev2121
  fox-mascot-sign-in, orbit-delivery-hero, woven-glass-button
@fafaieefafaiee   silk-shader
@fanoflix   lamp-tooltip
@fatemayeasmin311   asthetic
@fatih-developer   curtain-theme-toggle
@federicotoscano611   orb-shader
@felipemenezes098
  accordion-01, accordion-07, accordion-14, badge-12, badge-13, banner-04, banner-09, breadcrumb-03, card-06,
  card-09, card-11, card-14, checkbox-02, checkbox-06, checkbox-07, checkbox-08, checkbox-09, checkbox-11,
  checkbox-12, collapsible-02, collapsible-05, comment-thread-1, comment-thread-3, content-04, content-06,
  content-07, content-09, content-11, cta-01, dialog-16, dropdown-10, dropdown-12, dropdown-14, dropdown-19,
  empty-04, feature-01, flexnative-breadcrumb, flexnative-select, flexnative-tabs, flexnative-tabs-more,
  flexnative-tooltip, hero-01, hero-02, hero-03, hero-04, hero-05, hero-07, hero-08, hero-09, hero-10,
  hero-12, hero-14, item-08, item-14, item-18, item-19, item-24, item-with-icon, notifications-1,
  notifications-2, notifications-3, one-button, one-clipboard, payment-1, payment-2, payment-3,
  reset-password-1, reset-password-2, rhf-advanced-01, rhf-fields-09, scroll-01, select-01, select-03,
  select-05, select-06, select-07, select-08, select-09, select-10, select-11, select-12, select-13,
  select-14, settings-1, settings-2, settings-3, share-access-2, sign-in-4, sign-in-6, skeleton-10,
  skeleton-13, skeleton-14, skeleton-15, skeleton-16, table-01, table-02, table-04, table-07, table-08,
  table-11, table-12, table-15, table-17, table-19, table-20, table-row-actions, table-row-selection, tabs-07,
  tabs-08, tabs-10, the-dialog, the-input, the-item-one, tooltip-07, tooltip-09, tsf-advanced-02,
  tsf-fields-04, tsf-fields-07, tsf-fields-09, tsf-recipes-03, tsf-recipes-04, tsf-rules-03,
  two-factor-setup-2, verify-identity-3
@felix-au
  bubble-float-cursor, constellation-cursor, dna-helix-cursor, matrix-rain-cursor, rainbow-comet-cursor,
  wind-stream-cursor
@fennerchadwick   footer
@filipz
  circle-animations-collection, circle-animations-collection-3, explorations-with-gsap-and-scroll-trigger,
  menu-animations, set-of-animations-4
@finn_4bbcd7bf   c2e812
@flohoeller
  agent-team, comment-thread, decision-inbox, empty-calendar, enrichment-orbit, filter-menu, integration-grid,
  notification-stack, profile-menu, progress-tracker, reaction-bar, side-folder, tab-overload, team-invite,
  tips-panel
@flohoeller_5a53e102
  email-draft, message-actions, otp-input, segmented-control, thinking-loader, tool-call-card
@flower0wine
  button-group, file-upload
@framecn
  ai-generate-overlay, blur-out-up, bounding-box-selector, format-morph, glass-code-block, message-bubble,
  shader-dithering, strikethrough-replace, terminal-to-browser-deploy, top-down-letters, tracking-in,
  zoom-through-transition
@fransederr
  ascii-voice-orb, grain-light-card, holo-vinyl, orbit-timeline
@frodev-cr   streamclick-wallpaper
@fuererayt   the-creation-of-adam
@fujidevv   github-activity
@fuma-nama
  accordion, banner, root-toggle, tabs, type-table, zoomable-image
@g13rt26   book
@gabporcius   background-rowds-shop-v1
@gabriellopes.ct07   vv
@gabrielrkmoura
  horse, neon
@galileouuu   test
@gamerjon00   signal-404
@garigarii
  halftone-shader, plasma-shader-cursor-push
@garrett_b432de00   shader-deep-aqua
@gauravchinku976   ee
@gaxocif204   preloader
@geekingdevil   2-ascii
@geekles007
  multiple-select, navbar, select
@georgehfc   mata-sede
@ghcpuman902   snappy-slider
@glasscn
  highlight-text, liquid-text, liquid-watch
@gonzalochale
  ai-chat-image-generation-1, commits-grid
@good-listener
  liquid-button, r3-f-macro-keypad, waves-shader
@goodmotion
  circle-reveal-loader, googly-eye-cursor, rubber-band-text, x-ray-figma-cursor, y2k-dreamy-text
@gooseui
  border-beam, features-grid
@gopalrajlohiya2   nsutx
@gordongedacheril1   almoayyed
@gpt-vis
  funnel, gpt-vis
@gravitty99
  black-and-white-shader, light-blue-plasma-shader-w-grain-interactive, red-plasma
@grootstudio
  blurred-marquee, cursor-trail, gradient-text-fill, logo-marquee, text-frame
@gughigug
  broken-by-design, elsewhere-hero, liquid-glass-accordion, liquid-glass-navbar, liquid-glass-toggle,
  liquid-sculpture-hero, scroll-locked-video-hero, shave-reveal-hero, sunset-skyline-hero, ufo-hero
@guranshbir2012   aurora-shader-green
@gurvinder-singh02   bold-on-hover
@gustavo.camara   pipo
@h0bb5
  bloom, cool-blob-effect, customizable-loader-spinner-transition, generative-art, zima-blue
@haassiib
  bar-chart, checkbox, month-range-picker, tabs-roving-focus
@hackergut
  ff, orgblu
@hagan44637   fluted-glass-folds-shader
@halaska-studio
  calendar, choicebox, combobox, dot-grid, file-tree, halaska-dialog, hover-card, input-otp, orb, popover,
  scroll-area, segmented-control, select, slider, switch, table
@ham7a311
  ask-bar, aura-field, bell-ring, caliper, cited-answer, confidence-ink, dither-flow, dither-portrait,
  dot-swarm, entry-ring-button, fan-deck-card, follow-toggle, fraction-checkbox, glass-blinds, glass-carousel,
  glass-orbs, glass-ribbons, glass-tiles, glyph-swell, halo-pointer, highlight-cursor, histogram-range,
  hour-dial-stats, hover-reel, intent-label, isobar, liquid-chrome, liquid-glass-cta, nib-trail, orbit-card,
  orbit-ring-stats, page-header, preset-keys, quickstart-checklist, ribbon-flow, ribbon-otp, ripple-tank,
  route-globe, ruler-picker, second-draft-text, signal-tiles, span-waterfall, spotlight-group, star-rate,
  star-trails, streak-field-stats, stream-reply, tally-button, thread-stepper, ticker-ring-cta, ticket-card,
  tideline-cta, time-window, unlit-gallery-404, upload-stack, uptime-ribbon, wave-mesh, wind-map, word-bank
@hamidonsol
  glitching-button, spotlight-table, text-scramble
@hammamikhairi   animated-gradient-background
@hannah_8c87af59   waves-shader
@hardcoretiff   dotgridshaderoncrack
@hardik0110
  download-hover-button, mini-calendar
@hardikkashiyani123456788
  argent-loop-infinite-slider, connoisseur-stack-interactor, experience-hero, flow-gradient-hero-section,
  lumina-interactive-list, sterling-gate-kinetic-navigation
@hari
  card-comment, flower-menu, reveal-images, scheduler, transaction-list
@hari7261
  faq-smooth, newsletter-terminal-card
@harmalbrar313
  harmal-singh, harmal-singh-2
@harshita.heloxone   xsdad
@harshjadhavconnect
  animated-gradient, auth-modal, circuit-board, collection-surfer, cursor-driven-particles-typography,
  dithered-logo, eye-tracking, gradient-hero-01, hero-geometric, hyper-text, image-trail,
  infinite-image-field, liquid-glass-carousel, magnet-lines, magnetic-dock, particle-galaxy, pixel-canvas,
  pixel-image-trail, scroll-choreography, silk-aurora, spectral-ribbon, split-flap-display,
  testimonial-marquee, text-repel, webgl-liquid, wheel-carousel
@harshjoshi9789   sih
@haydenbleasel
  ai-input, announcement, color-picker, cursor, data-table, dialog-stack, dropzone, gantt, image-crop, kanban,
  list, marquee, pill, rating, relative-time, sandbox, snippet, spinner, status, stories-carousel,
  theme-switcher, ticker, tree, video-player
@hazelgrace3026
  ocean-grain, silk-blend-gradient
@heatupsolucoes   flacoroque
@hedevelope   estimated-arrival
@heliarkiani   black-and-white-gradient
@hello_54e122be
  branches, cabinet, elevator, format, hairline-basket, hairline-dish, hairline-drawer, hairline-exploded,
  hairline-keyboard, hairline-lockers, hairline-loupe, hairline-phone, hairline-plot, hairline-query,
  hairline-riffle, hairline-router, hairline-slow, hairline-terminal, hub, laptop, padlock, patch, phosphor,
  plug-socket, rail, rebuild, relay, settle, sieve, terrain, turntable, vault
@hellocloud.webdev   ai-prompt-composer-with-model-selector
@helloweblisy   endless
@hero_ui
  heroui-accordion, heroui-alert, heroui-alert-dialog, heroui-autocomplete, heroui-avatar, heroui-badge,
  heroui-breadcrumbs, heroui-button, heroui-button-group, heroui-calendar, heroui-card, heroui-checkbox,
  heroui-checkbox-group, heroui-chip, heroui-close-button, heroui-color-area, heroui-color-field,
  heroui-color-picker, heroui-color-slider, heroui-color-swatch, heroui-color-swatch-picker, heroui-combo-box,
  heroui-date-field, heroui-date-picker, heroui-date-range-picker, heroui-description, heroui-disclosure,
  heroui-disclosure-group, heroui-drawer, heroui-dropdown, heroui-field-error, heroui-form, heroui-input,
  heroui-input-group, heroui-input-otp, heroui-label, heroui-list-box, heroui-meter, heroui-number-field,
  heroui-progress-bar, heroui-radio-group, heroui-range-calendar, heroui-scroll-shadow, heroui-search-field,
  heroui-select, heroui-separator, heroui-slider, heroui-spinner, heroui-switch, heroui-table,
  heroui-tag-group, heroui-text-area, heroui-time-field, heroui-toggle-button, heroui-toolbar, heroui-tooltip,
  skeleton, the-pagination
@hexui-sh
  faq-1, faq-2, footer-1
@heygaia
  bar-chart, knowledge-graph, line-chart, pie-chart, radar-chart, scatter-chart, tool-calls-section,
  wave-spinner
@heyquincy   cursor-dither-trail
@hihahihahoho
  circle-progress, use-item-overflow
@himanshutamoli24   abstract-cube-isometric-loader
@himansujha   magnetic-liquid-button
@hinedy   reveal-wave-image
@hochart.gabriel.svis   blue-halftone
@honestui   chromatic-text-reveal
@hrishwan   asset-banner
@hsuanyi-chou   multiple-selector
@httpsdesign-layercomja
  grainient-images-section, music-video-pin-stack, path-drawing-portfolio-hero, pixel-arc-loader,
  sakura-editorial-poster
@huahaoshang2000   art-gallery-girl
@hungduong-projects   flip-text
@hurerag24
  bolt-style-chat, hero-grid-section, interactive-hover-links, shifting-dropdown
@hyggemethat   tinder-like-swipe
@hyperiux
  arc-flow-carousel, arc-light, arrow-fill-button, ascii-band, block-transition, border-beam,
  cards-rotate-slider, chess-grid-transition, chromatic-text, circular-split-roll, depth-flip-text,
  dimensional-switch-slider, directional-menu, dot-transition, dotted-grid, dotted-trail-cursor, drop-text,
  elevate-navbar, ellipse-carousel, flickering-text, focus-text, fractal-glass, glowing-text, gooey-counter,
  gsap-card-flip, horizontal-feature-reveal, hover-stack, immersive-full-screen-nav,
  infinite-perspective-slider, information-drawer, interactive-blur-reveal, interactive-list-preview,
  link-button, liquid-glass-cursor, metallic-button, milky-way, numeric-tunnel, orbit-flip-slider,
  parallax-strip-slider, phantom-image-trail, pixel-text-fill, pixelated-image-effect, portal-carousel,
  rectangular-text-reveal, rolling-text, scramble-link-button, shiny-button, spider-particles, split-canvas,
  stack-loader, stack-spread, sticky-content-wrapper, text-convergence, timeline, typing-text,
  variable-text-proximity, zoom-slider
@iamsatish4564
  animated-profile-card, curtain-button, eclipse-button, micro-expander, morph-button,
  portfolio-and-image-gallery, prime-button
@iamtoribryan
  annotated-text, chat-composer, portfolio-banner, rich-text-editor, token-flow
@ibelick
  accordion, animated-background, animated-group, animated-number, animated-tabs, background-snippets,
  border-trail, carousel, code-block, cursor, disclosure, dock, feedback-bar, glow-effect,
  gradient-background-4, image-comparison, in-view, infinite-slider, jsx-preview,
  light-theme-tailwind-css-background-snippet, loader, magnetic, morphing-dialog, morphing-popover, popover,
  progressive-blur, prompt-input, prompt-suggestion, promt-input-with-actions, response-stream, scroll-button,
  scroll-progress, sliding-number, spinning-text, spotlight, system-message, tailwind-css-background-snippet,
  text-effect, text-loop, text-morph, text-roll, text-scramble, text-shimmer, text-shimmer-wave, tilt, tool,
  toolbar-dynamic, toolbar-expandable, transition-panel
@ibrandify
  anchored-action-menu, before-after-comparison, build-pipeline, copy-with-confirmation, delivery-progress,
  directional-text-button, donut-breakdown, editorial-service-list, favorite-toggle, featured-project-hero,
  focus-city, glowing-pricing-tiers, quote-crossfade, save-with-progress, scroll-timeline,
  searchable-question-index, single-open-accordion, source-lens, storage-district, thumbnail-image-viewer
@ibssibss7   elixr
@igorgalaxy50   custom-blue
@ikascom   animated-number
@indieworld00   nehir
@inference-sh
  code-block, sidebar-light, table-of-contents, youtube-embed, zoomable-image
@info-mdshakeeb
  image-cropper, image-uploader, preloader
@intentui
  bar-chart, color-area, color-slider, disclosure-group, field, file-trigger, file-trigger-13, keyboard,
  loader, pie-chart, progress-bar, progress-circle, radar-chart, radial-chart, toggle, toggle-group
@inv4rrow   mine
@isaiahbjork
  agent-plan, animated-card-options, animated-dashboard-card, animated-download, animated-hud-targeting-ui,
  animated-project-cards, animated-radial-chart, animated-status-badge, app-dashboard-shell, app-sign-in,
  audio-upload-card, bjork-chromatic-text, bjork-citation-chips, bjork-cohort-retention, bjork-decode-text,
  bjork-distribution-plot, bjork-drawdown-chart, bjork-dumbbell-chart, bjork-glyph-morph,
  bjork-ink-bleed-text, bjork-inline-ai-edit, bjork-lattice-orb, bjork-live-line, bjork-magnetic-letters,
  bjork-now-playing-card, bjork-response-feedback, bjork-scatter-brush, bjork-spreadsheet-grid,
  bjork-weight-wave, candlestick-chart, card-status-list, click-wheel, coach-scheduling-card,
  contacts-table-with-modal, diff-review, elastic-frame, event-countdown-card, financial-markets-table,
  glitchy-404-1, glow-rules, gradient-selector-card, grouped-bar-chart, gsap-draggable-rope, handoff-beam,
  hover-detail-card, hover-image-gallery, hud-area-chart-1, hud-button, hud-status-1, leads-data-table,
  liquid-text, marketing-feature-bento, marketing-pricing, message-dock, onboarding-stages, portfolio-gallery,
  prediction-market-card, primitive-avatar, primitive-badge, primitive-breadcrumb, primitive-button-group,
  primitive-calendar, primitive-checkbox, primitive-combobox, primitive-input, primitive-input-mask,
  primitive-pagination, primitive-sonner, primitive-tabs, primitive-textarea, product-reveal-card,
  profile-card, profile-hover-card, radial-command-ring, resizable-table, reveal-text, ruler-carousel,
  scatter-rewind, shader-aurora-veil, shader-kinetic-dots, spark-table, spec-sheet, streaming-message,
  stroke-draw-type, system-monitor, video-scroll-hero, video-upload-card, voice-powered-orb, weekly-kpi-chart
@ishamsu
  curved-menu, immersive-scroll-gallery, retro-testimonial, scroll-cards, smooth-scroll-hero
@itaizeilig   tetris-loader
@itsankitverma
  animated-menu-bar, dialog-box, error-404-page, file-uploader, path-morphing, scroll-linked-spring-animation,
  stack-card
@itsgui.brg
  city, city-2
@ivarunchaudhary   services-stack
@j1zuz
  empty, welcome
@jacopagan7-ui   jpag-manifesto
@jahed
  ai-agent-response, ai-chat-input, ai-prompt-box, ai-thinking-and-tool-calls, animated-3d-mac-book-air,
  animated-glow-card, animated-svg-text-path, apple-tahoe-liquid-glass-button, auth-fuse, auth-ui,
  beams-background, chatgpt-prompt-input, cinematic-landing-hero, cyber-button, dot-text,
  dotted-vignette-background, dynamic-hero, flip-countdown, flow-field-background, glass-button,
  glass-testimonial-swiper, glassmorphism-trust-hero, hero-1, hero-with-video, hover-glow-button,
  hover-text-reveal-1, image-swiper, interactive-text-particle, interactive-thermodynamic-grid,
  isometric-wave-grid-background, limelight-nav, logo-carousel, magnetic-cursor, material-design-3-button,
  material-design-3-expressive-slider, material-design-3-ripple, material-design-3-switch,
  material-ui-autocomplete-combobox-multi-select, material-ui-dropdown-menu, morhic-background, motion-footer,
  multi-type-ripple-buttons, noisy-gradient-backgrounds, parallax-cosmic-background, particle-wave,
  peak-mountain, pixel-cursor, pixel-perfect-hero, shader-button, shared-element-gallery, sign-in, sign-up,
  soft-gradient-background-animation, spiral-animation, spooky-smoke-animation, spotlight-card, sss,
  svg-blob-animation
@jahirulislamrayhan07
  animated-404-page, retro-space-shooter-git-hub-calendar
@jaimayo88
  art, option-1, slik
@jakapatb   7-segment-number
@jakob.visintin.dev   background
@jakobhoeg
  button, chat-bubble, message-loading
@jashshah854-a11y   bread-and-butter
@jasonmohab-ali
  alqemist-cta, alqemist-hero, alqemist-how-it-works, alqemist-interactive-demo, alqemist-security,
  alqemist-usp, qreatify-super-agent-card, whatsaas-app-shell
@jatin-yadav05
  3d-folder, analytics-bento, animated-ai-chat, animated-geometric-card, animated-radio, anime-navbar,
  audio-chat, book-a-call-button, bouncy-toggle, box-loader, clean-testimonial, click-trigger,
  click-trigger-particles, dark-gradient-background, design-testimonial, editorial-testimonial,
  elegant-dark-pattern, emoji-rating, etheral-shadow, expand-map, feature-spotlight, file-tree, flip-hover,
  fluid-canvas, github-inline-diff, grid-loading, icon-3d-hover, image-reveal, interactive-accordion,
  interactive-string, keyboard-keys, leather-button, lets-work-section, location-tag, magic-text-reveal,
  marketing-badges, mini-chart, minimal-dock, minimal-testimonial, morph-loading, morphing-cursor,
  morphing-spinner, multistep-form, notch-nav, old-television-shader, orbital-clock, pixel-trail,
  potfolio-text, premium-verification-widget, pricing-component, progress-bar, project-showcase,
  radial-orbital-timeline, reaction-chip, reveal-text, scale-letter, shimmer-bg-text, showcase-card-1,
  sign-in-card-2, skills-showcase, smoke-card, social-icons, split-testimonial, subtle-button, text-scramble,
  unique-testimonial, vapour-text-effect, vertical-image-stack
@javierdev0   order-tracking
@jdavisson87
  badge, switch, text-field
@jean.duthil13
  hero-scrub, mac-book-neo-hero
@jens.debacker5   portfolio-tester
@jeyajothi108   pixel-loader
@jfishfl   aa
@jh3yy_deleted
  impossible-checkbox, you-can-scroll
@jhoan.rhz   a-shader
@ji.okorafor   koinonia
@jitksaha   verified-badge
@jobsrip   trippin-spiral
@jod49034
  slideshow, tubes-curor
@johnmamanao
  bloom-text, facet-bloom-loader, horizon-page-loader, liquid-metal-shader, matrix-rain, mercury-rail-loader,
  ribbon-fold-loader, signal-reveal-text, tidal-type-text, toolchain-marquee
@johuniq
  ai-prompt-box, animated-theme-toggle, date-wheel-picker, joly-button, liquid-metal-button
@joinceleste   bloom-field-gradient
@joker4214   fluted-glass-waves-shader
@jolbol1
  button, button-1, calendar, checkbox, checkbox-1, date-picker, date-range-picker, datefield, dialog-2,
  field, file-trigger, file-trigger-2, grid-list, link, list-box, list-box-2, menu-1, numberfield, popover,
  popover-1, progress, range-calendar, searchfield, select, select-1, slider, switch, switch-1, table,
  table-2, tabs, tag-group, tag-group-2, timefield, toggle-button, toggle-group, tree-2
@jordan_51b6fc79   gradient-pixelated
@jorgevarelarz   laser-focus
@joseestevez520
  chart, progress-button
@joyco
  action-hint, chat, file-dropzone, hls-video-player, image-sequence, infinite-list, snake-game,
  space-invaders, spritesheet-sequencer, typewriter
@jshguo
  avatar-variants-interfacesds, interfaces-badge, interfaces-breadcrumb, interfaces-button, interfaces-card,
  interfaces-carousel, interfaces-checkbox, interfaces-collapsible, interfaces-hover-card,
  interfaces-input-otp, interfaces-progress, interfaces-select, interfaces-slider, interfaces-switch,
  interfaces-textarea
@jsnmhbl   path-to-resilience-orbital-timeline
@juan9987654321   adan-y-dios
@juaox   test
@julian.leistad   oki10
@julien_60b4c591
  hero-2, hero-j-v, new-hero-slower
@JurreHoutkamp
  hover-zoom, text-glow-hover, tilt-card
@justinlevinedotme   file-tree
@justinwalker   backroom
@justlloydeditor   choso-ascii
@k3menn
  simple-tabs-with-underline-and-bold-font, tabs-in-cell-for-navigation, tabs-like-bookmark
@kaan8588   muavin
@kaczmarekpa   warp-stripes-shader
@kahidiscordgfx   i-ascii
@kaif-ui
  cicular-navigation-bar, emoji-nav, infinite-slider-horizontal, macbook-keyboard, pendulum-component
@kamalesh   gaming-login
@kanchanasw
  checkbox, hover-card, pagination, prompt-input, radial-menu, sketch-button, tabs, textarea
@kapishdima
  infinite-bento-pan, inline-highlight, marker-highlight, remocn-perspective-marquee, tracking-in
@karinagarzatrevino   static-mesh-gradient-shader
@KarrixLee   unsave-popup
@karthikmudunuri
  animated-badge, animated-card, dynamic-square, header-02, orbit-rotation, testimonal-slider,
  testimonals-carousel
@karthiksivacharan   neon-nebula
@kateoparina5   gradient-42c2bb2f
@kauasodreas
  blur-text-effect, whisper-text
@kavikatiyar
  3d-card, alert, animated-card, article-cards, audiobook-card, bento-product-features, call-to-action-cta,
  card, card-1, card-2, card-3, card-4, card-5, card-6, card-7, card-8, card-9, cards-grid, chat-bubble,
  circular-progress-card, date-picker, email-client-card, interactive-broker-card, meeting-scheduler,
  newsletter-card, order-confirmation-card, order-history, performance-benchmark-card, price,
  product-detail-page, product-feature-card, progress, progress-card, project-detail-view, state, stats-card,
  stats-card-1, stock-portfolio-card, testimonial, testimonial-slider, testimonial-slider-1, tracker-card,
  tracker-card-1, trip-details-card
@kedhareswer
  3d-curved-carousel, agent-scan-carousel, alice-scroll-story, amour-sunrise-preloader,
  animator-title-preloader, anodized-ink, aperture-carousel, arc-card-carousel, astro-bubble-hero,
  astro-mission-band, badge-strip-footer, beam-wordmark-footer, blueprint-ink-reveal, breath-bloom,
  bunkum-wordmark-hero, card-deck-carousel, card-fan-preloader, case-stack-scroll, caustic-pool,
  cell-column-trend, checker-quilt-testimonials, chroma-glitch-preloader, cinema-grain-preloader,
  cloth-peel-reveal, code-curtain, cold-flame-drift, contribution-skyline, crumple-changelog,
  crumpled-paper-reveal, cutout-sentence, darwaza-preloader, deer-logo, disc-cascade-carousel,
  dish-orbit-carousel, distressed-denim, dither-sweep-navbar, doodle-crew-footer, doodle-crew-footer-sunny,
  dune-haul-footer, duotone-team-roster, ember-petal-preloader, engraved-ticket, etched-accretion,
  festivity-hero, flashlight-text-reveal, focus-pull-carousel, folio-fold-menu, foundation-primitives,
  frosted-hover, fruit-sticker-footer, gilded-gaze-footer, gilded-lotus-preloader, glass-cards, glass-clock,
  glass-folder-cards, glass-headline-hero, halftone-flow-hero, halftone-nebula, halftone-wordmark-footer,
  hoarfrost-pane, holo-card, holo-chrome-flow, hotel-showcase, hover-expand-gallery, index-list-carousel,
  ink-blot-carousel, ink-flow-carousel, ink-orbit-features, ink-orbit-hero, ink-orbit-pricing,
  ink-orbit-testimonials, ink-spill-theme-switch, isoline-bloom, isometric-lift-carousel,
  journal-spread-carousel, keycap-orb, kiln-wordmark-footer, lanyard-badge, led-matrix-sales,
  lens-zoom-carousel, light-shader, lilac-dusk-canopy, lunar-boarding-pass, lycoris-specimen, magic-hour,
  mascot-portfolio-hero, meadow-rise-footer, meridian-mist, minted-coin-scroll, mono-contrast-preloader,
  morph-gallery, mosaic-shader-background, mouse-trail, murmuration-wordmark, neon-katakana-preloader,
  noise-dissolve-reveal, old-masters-preloader, onyx-glyph-preloader, open-slot-booking,
  overprint-swarm-template, paper-curl-carousel, particle-animation, particle-dissolve-carousel,
  peacock-train-preloader, phosphor-crt-404, pigment-experience-ledger, pixel-headline,
  polaroid-line-carousel, prism-comet-preloader, prism-silk-footer, prompt-composer, pulse-stripe-hero,
  pushpin-tear-footer, raked-sand-garden, rangoli-preloader, rgb-glitch-carousel, ridgeline-dither-footer,
  rotating-flavor-slider, runway-lookbook, saffron-gaze-preloader, scanline-bloom, scrap-wall-archive,
  shutter-blinds-carousel, shutter-glyph-footer, signature-pen-footer, silhouette-wrap, silk-mesh-shader-hero,
  silk-spider-cursor, singularity-horizon, skeleton-key-preloader, slat-count-preloader, slit-type-faq,
  smiley, sneaker-product-hero, snow-ball-loading-spinner, split-photo-slider, staircase-carousel,
  starburst-thanks-footer, stardust-stage-preloader, stepped-morph-slider, sticker-slap-footer,
  sticker-swap-headline, string-tie-footer, strobe-diva-footer, sunlit-cutting-mat, ticket-stub-footer,
  tiger-tear-reveal, tile-scrollbar, tilt-cascade-carousel, tilt-stack-scroll, tumble-deck-showcase,
  type-remix-preloader, velvet-haze, venom-vial-preloader, viewfinder-flip-carousel, vinyl-halftone-preloader,
  water-ripple-carousel, waving-portfolio-landing, weight-sweep-preloader, weird-brief-cta, wild-hunt-footer,
  wordmark-newsletter-signup, zero-melt-preloader
@kemiljk   switch
@keshon   list
@kevingirelli
  animated-border, aurora, bar-chart, contact-form, corner-frame, dash-button, faq, flip-text, form,
  hover-reveal, magnetic, marquee, newsletter, not-found, pagination, pricing, qr-code, scramble-text, sheet,
  signature, spotlight, stepper, warp-gradient, wave-text, wipe-transition
@killolocoeurcy
  alinyxe, alinyxe-2
@kimjoonho   silk-shader
@kinfe123
  bento, colorful-pricing, hero-section-dark, herowith-logos, jelly-animated-hero, sliding-testimonial
@kingleonardjr19   blue-noise
@kingm172009   213
@kingmckay13   ocean-perk
@kiran47455   poba-shade
@kl-webmedia   button
@kleimeier.maurice   marbs123
@klyv-ui
  boids-flock, comment-thread, floating-panel, flow-field, fluid-canvas, game-of-life, gantt-chart,
  gooey-loader, gravity-tags, highlight-match, klyv-animated-beam, klyv-aurora-surface, klyv-border-beam,
  klyv-falling-sand, klyv-particle-field, klyv-retry-queue, klyv-shimmer-button, klyv-waveform, likert-scale,
  log-viewer, morphing-text, pareto-chart, presence-bar, profile-card, pull-to-refresh, radio, reveal,
  save-indicator, segmented-control, shader-canvas, spaced-repetition, sunburst-chart, time-slot-picker,
  toggle-group, tree-select
@kmchiii69   kim
@kokonutd
  action-search-bar, activity-card, ai-citations, ai-input, ai-input-with-file, ai-input-with-loading,
  ai-input-with-search, ai-input-with-suggestions, ai-loading, ai-text-loading, ai-tool-approval,
  ai-voice-input, animated-ai-input, apple-activity-ring, avatar-picker, background-circles, background-paths,
  beams-background, bento-grid, button-colorful, button-shiny, carousel-cards, chat-card, color-input, faq,
  faq-with-categories, glitch-text, hand-writing-text, hero-fashion, hold-and-release-button,
  interactive-checkout, kokonut-ai-autocomplete, kokonut-ai-diff-review, kokonut-bell-button,
  kokonut-clip-trimmer, kokonut-detent-dial, kokonut-dot-field, kokonut-drape-background,
  kokonut-focal-point-picker, kokonut-lightbox-grid, kokonut-marking-menu, kokonut-photo-straighten,
  kokonut-plucked-text, kokonut-pull-cord, kokonut-receipt-printer, kokonut-scroll-index,
  kokonut-spending-ring, kokonut-spoiler-text, kokonut-stack-panel, kokonut-status-island,
  kokonut-tear-button, kokonut-topo-background, kokonut-undo-button, loader, magnetize-button, matrix-text,
  modal-pricing, notification-stack, numeric-input, particle-button, password-input, pricing-cards,
  pricing-table, profile-dropdown, shape-landing-hero, sliced-text, smooth-drawer, social-card, swoosh-text,
  tag-input, team-invitation, text-rewind, type-writer, uptime-card, use-auto-resize-textarea, use-file-input,
  use-tags, v0-ai-chat, wave-text, wheel-picker, x-gradient-card
@koustubhayadiyala36
  action-searchbar, animated-menu, ascii-log-leet, circular-command-menu, fluid-dropdown, morphing-card-stack,
  real-time-analytics, trello-kanban-board
@kristen17
  course-design-cards, message-design-card-list, rounded-box
@kumail_ali_r
  circle-unique-load, core-header-navbar, core-spin-loader, prism-flux-loader, text-reveal-animation
@kuratlielia
  activity-heatmap, brush-chart, button-group, card-stack, chip-group, combobox, comment-thread,
  date-range-picker, expandable-card, expanding-button-group, filter-toolbar, hover-card, image-compare,
  line-chart, money-input, multi-select, reactions, ridgeline, segmented-control, signature-pad, slider,
  slope-chart, sortable-data-table, sparkline, split-button, stats-band, switch, tabs, text-reveal, timeline,
  usage-meter, user-menu
@kurket21   progressive-hero
@kushal.ict2022   mtfuji
@kvnkld
  ai-agent-input, code-block, file-diff, image-generation, inline-citations, orbs-helix, orbs-lens,
  orbs-morph, orbs-ring, task-list, thinking-reasoning, web-search
@kygsz29   lahit
@kyxjames23   111
@lailai0916
  dialog, share-card, window-panel
@larsen66
  admit-one-ticket, background-gradient-snippet, background-snippets-noise-effect11, bento-features,
  bento-monochrome, bento-monochrome-1, blueprint-gradient-mesh, border-beam, border-beam-button,
  border-beam-search, cue-expandable-share-card, expand-on-hover, expanded-tabs, glimm-easing,
  glimm-generate-data, glimm-spectrum-transition, hero-ascii, hero-ascii-one, hole-reveal-hero, metal-fx,
  metal-upgrade-button, navigation-menu, noise-dark-blue-gradient-with-squares, reui-button-group,
  reui-filters, reui-phone-input, thinking-orbs
@lavikatiyar
  activity-stats-card, alert-banner, alert-toast, audio-show-creator, bento-grid, card, card-1, card-11,
  card-2, card-3, card-4, card-5, card-6, card-7, card-8, card-9, cards, conversion-stats-card, cta-card,
  feature-card, feature-grid, form, freelancer-profile-card, growth-hero-section, hero-section,
  image-uploader, insurance-card, list, location-card, login, menu, offer-card, offers-carousel, pricing,
  progress-card, referral-card, reset-password-form, seat-selection, service-card
@laziekiki
  advanced-data-table-filter-builder, ai-reasoning-block, api-key-manager, compose, draggable-photo-stack,
  empty-state-kit, filter-token-bar, interactive-character-switcher-card, keyboard-shortcuts,
  lenticular-compare, morphing-scroll-navbar, photo-remix-grid, product-tour, selection-bubble-menu,
  smart-tag-input, streaming-chat-response, tier-list-maker, tool-call-inspector
@lbertoni115   kk
@Legacy
  earth-blaze, glyph-portal
@LegionWebDev
  allocation-echarts-sankey-chart, area-chart, background, bar-chart, cpu-architecture, echarts-sankey-chart,
  hover-trace-bar-chart, legion-web-dev, line-chart, monospace-bar-chart, pie-chart,
  pipeline-echarts-sankey-chart, radar-chart
@leitosurf151   surfer
@lensblocks   account-list-item
@leo.carre   black-gradient
@leonelsilva0601   silk-blend-gradient
@lepikhinb   sparkles
@limeplay
  media-provider, player-layout
@lina.sameer   scroll-area-1
@lipa88-mk   button
@liquefy-ui
  liquid-select, liquid-switch
@liveblocks   emoji-picker
@llaxmi   tilt-card
@ln-dev7
  animated-navigation-tabs, assignee-user, assisted-password-confirmation, aurora-ribbons, auto-layout-card,
  bento-01, bento-02, breadcrumb, button, cloth, contact-01, contact-16, cube-wave, dorpdown-navigation,
  dynamic-action, faqs-01, faqs-02, feedback-slider, flip-button, floating-button, follower-counter,
  footer-16, footer-17, gallery-02, globe, header-17, help-button, hero-24, how-it-works-01, how-it-works-02,
  how-it-works-09, indev-dialog, indev-inputui, indevui-card, indevui-checkbox, indevui-collapsible,
  indevui-context-menu, indevui-dropdown-menu, indevui-label, indevui-popover, indevui-select,
  indevui-separator, indevui-sheet, indevui-skeleton, indevui-switch, indevui-table, indevui-tabs,
  indevui-textarea, indevui-toaster, indevui-toggle, indevuitooltip, issue-context-menu, label-badges,
  label-selector, login-16, logo-cloud-16, mega-menu, member-list, members-table, post-scheduler, pricing-16,
  pricing-17, pricing-interaction, priority-selector, project-badge, project-selector, projects-table,
  register-02, register-16, settings, social-links, spend-migrator, status-selector, tag-input, tags-selector,
  tesseract, visualize-booking, vortex, warp-tunnel
@loading-ui
  accordion-loader, analyzing-image, arc, bars, bobbing-dots, bouncing-dots, comet-spinner, concentric-ring,
  conveyor-loop, dash-ring, diamond, dots, dots-ring, dual-arc, fade-arc, infinity, infinity-square-snake,
  infinity-track, morphing-infinity, orbit-ring, pulse-dot, ripple, satellite-ring, spiral, spokes,
  square-accordion, square-snake, swirling, symmetric-wave, text-blink, triple-dot-spinner, twin-orbit,
  typing, wandering-eyes, wave
@lokeshkaushal091   pink-smoke
@longjtyler   allan-array
@Loomix   cinematic-product-scroll-section
@lorenzobodoira11   hero-fusion-web
@louisfellipe97   daa
@louisstudios
  ascii-aquarium, assistant-wall, brick-digits, cell-count, chapter-player, chrome-arcs, cover-flow,
  dot-tiles, glass-peaks, glow-button, glow-rocker, led-badges, lens-clock, liquid-chrome, market-card,
  math-scramble, melt-mark, metaball-loader, neon-hello, neon-loop, neon-pulse, orb-loader, pattern-cards,
  peak-chart, peek-blob, quote-orbit, scratch-card, scribble-clock, soft-tabs, stream-search, thinking-pill,
  tool-wheel, tube-grid, warp-carousel, wave-type, wind-type
@lovesickfromthe6ix
  calculator, ethereal, full-screen-scroll-fx, horizon-hero-section, interactive-map, iphone-mockup,
  loading-animation, loading-animation-1, music-portfolio, music-reactive-hero-section, particle-hero,
  particle-text, revolution-hero, shader-animation, sign-in-flo, turbulent-flow, vhs-hero-section
@lran1028   smoky-button
@lucasbassetti
  animated-tooltip, magic-button, mask-button, multi-button, progress-fold-button
@lucasriveira24   green
@lucaszanini096
  waves-background, waves-background-2
@lukacho
  copy-to-clipboard, custom-cursor, image-swiper, marquee, tiles
@lukedarrendesigns
  aura, hi, stash
@lumesec
  geo-region-picker, geo-traceroute, px-accordion, px-bars, px-command, px-date, px-select, px-tabs,
  px-toaster, ui-dial
@luv-jeri
  line-chart, pixel-swap
@luv-jeri_c92deb60
  agent-state, animated-icon, bento-grid, dock, hero-button, meta-balls, particle-text, prompt-bond, shape,
  slider, theme-toggle, variable-proximity
@luxeascenttt   my
@lyanchouss
  asd, cta-with-marquee, cta-with-text-marquee, dark-grid, dock, fallback-card, hero-minimalism, login-signup,
  pricing-cards, processing-card, spinner-morph, spinning-sphere, theme-switch
@m.umairwaheedansari
  image-cursor-trail, landing-page, like-button, particles-bg, send-button, siri-orb, star-button,
  tags-select, tunnel-hero
@m2vipin   bloom-field-gradient
@m3marimuthum003   gradient-maru
@madichettyvishnu
  dark-mode, light-mode
@mahmoudilyan
  radio-card, switch
@makif.gozum   seve
@makviesainte
  builders-community-hero, contributors-section, country-accordion, hover-brand-logo, progress-metric-card,
  team-showcase
@malo_cc910e0f   silk-shader
@mamillecarlos
  metaballs-shader, shader-teal
@manfromexistence   liquid-glass
@manuarora700
  3d-card-effect, 3d-globe, 3d-marquee, animated-modal, animated-testimonials, animated-tooltip,
  aurora-background, background-beams, background-beams-with-collision, background-boxes, background-gradient,
  background-gradient-animation, background-ripple-effect, badge, bento-grid, canvas-reveal-effect,
  canvas-text, card-spotlight, card-stack, carousel, cloud-shader, code-block, colourful-text, compare,
  container-scroll-animation, container-text-flip, cover, diagram-card, direction-aware-hover, draggable-card,
  encrypted-text, evervault-card, feature-block-animated-card, feature-section-with-card-gradient,
  feature-section-with-hover-effects, file-upload, flip-words, floating-dock, focus-cards,
  framer-motion-switch, glare-card, glowing-background-stars-card, glowing-effect, glowing-stars, gooey-input,
  hero-highlight, hero-parallax, hero-section, hover-border-gradient, infinite-moving-cards, keyboard, lamp,
  layout-grid, lens, link-preview, liquid-glass, meteors, moving-border, navbar-menu, parallax-scroll,
  placeholders-and-vanish-input, pointer-highlight, pulse-beams, radar-effect, resizable-navbar,
  shooting-stars, sidebar, sparkles, spotlight, squiggly-text, squiggly-underline, sticky-banner,
  sticky-scroll-reveal, svg-mask-effect, text-flipping-board, text-generate-effect, text-hover-effect,
  text-reveal-card, timeline, tracing-beam, typewriter-effect, vortex, wavy-background, world-map
@manucadomingues
  pqp, shader-foda-rosa
@mapcn
  mapcn-marker-content, mapcn-marker-label, mapcn-marker-tooltip
@mara.stefana.ilie   hero-personal-website
@marcellinleclercq
  get-started-button, prompt-bar
@marcoaam.moreira   bw-liquid
@mariaspesotto   floral-gradient
@marvkr   card-resize
@massivocreativo   tree-massivo-corp
@matheusmartinsviana   bmw-art
@mathewsaju210
  radial-time-picker, trail-grid
@maudbenaddi
  notched-project-card, tool-mesh
@maxfu826   forest
@maxim.bort.devel
  chronicle-button, circular-testimonials, fishy-button, fishy-file-drop, info-card, metamorphic-loader,
  project-showcase, radio-group, shamayim-toggle-switch, simple-code-block, splashed-push-notifications,
  truncating-navbar
@mayurrawte
  accordion, loader, skeleton
@Mazyar kawa
  activity-dropdown, cpu-architecture, inverted-cursor, location-map, logo-loop, logo-timeline, text-roll,
  voxel-wall
@mbtrgurbuz   waves-header-green
@mclcuts   hi
@mdafsarx
  banner, counter-loader, hover-footer, tech-curosr
@mdimrulkayesovi   ff
@mechox31   test
@medanasknan
  god-rays-linear-shader, halftone-shader, neon-citi
@meenic   chat-preview
@meerbahadin10
  black-hole, glass-fold, stripe-like-gradient-shader
@mega-therion   rwy
@meghtrix
  background-components, background-gradient-glow, gradient-backgrounds, gradient-blur-bg, grid-background,
  radial-glow-background
@mengto
  ball-study, constellation-field, dimensional-field, dot-border-button, floating-dots-cta, fluid-field,
  flux-vortex, gallery, gateway-flow, generative-tree, glassmorphism-cta, globe-study, gradient-cta,
  halftone-flow, induction-button, launch-button, liquid-form, neon-sign, orbital-sphere, particle-drift,
  particle-wordmark, portal-field, recursive-erosion, semantic-bloom, skeuomorphic-toggle, spark-badge,
  spinning-border-button, tactile-button, topo-field, topology-field, void-field, wireframe-forms, woven-cloth
@meschacirung
  call-to-action, call-to-action-3, contact-form, content-2, content-7, content-block, faqs-component,
  features, features-1, features-2, features-3, features-4, features-8, features-9, footer, footer-2,
  footer-4, forgot-password, hero-section-6, integrations-3, integrations-5, integrations-component,
  integrations-three, login-1, login-2, logo-cloud-2, mist-integrations-2, mist-testimonials-5, sign-up,
  stats, veil-sign-up-2
@meshavie   bed-laptop-ascii
@meyerjulius673   green-silk-shader
@mhmhaseef88   silk-blend-gradient
@michaelvereb
  feedback-bar, loader
@michellegomes1984.mg   jesus-post
@michminlee   portfolio-1
@micka_design
  accordion, badge-fluid-functionalism, button, checkbox-group, color-picker, dialog, radio-group-base,
  select, slider, switch, table, tabs-base, tabs-subtle
@mikolajdobrucki
  cta-with-glow, cta-with-rectangle, hero-section, pricing
@miladjoodi   diff
@millaistudio
  m-tab-item, mcheckbox, mlist-item, msegmented-control, mswitch
@miloyaou   vivy
@minhxthanh
  3d-box-loader-animation, 3d-parallax-effect-on-hover, activity-dropdown, animated-background-lines,
  animated-feature-carousel, animated-infinity-background, animated-input, animated-scroll,
  animated-section-with-gradient-and-dynamic-lines, animated-shader-background, arc-gallery-hero-component,
  background-grid-beam, black-hole-vortex-animation, bubble-text, carousel-circular-image-gallery,
  circular-flip-card-gallery, copy-code-button, dance-text-animation, digital-serenity-animated-landing-page,
  drag-cards, dynamic-animated-hero-section-with-gradient, dynamic-text-slider,
  dynamic-wave-canvas-background, flip-gallery, glowing-input, gradient-card-showcase, gradient-menu,
  grid-hero-animated, hover-preview, image-comparison-slider, images-scrolling-animation,
  interactive-image-accordion, interactive-neural-vortex-background, interactive-particle-typography-1,
  interactive-scrolling-story-component, interactive-selector, lightning-text, liquid-effect-animation,
  login-form, mac-os-animated-shortcut-keyboard, menu-hover-effects, mouse-responsive-background,
  moving-dot-card, neon-orbs, otp-input, otp-verify, page-not-found, parallax-scrolling-effect, radio-button,
  scrolling-animation, shader-background, simple-ui, slide-tabs, spider-cursor,
  spinning-arc-logo-with-gradient-text-1, sticky-scroll-cards-section, svg-path-drawing-text-animation,
  text-animation, text-explode, theme-toggle-buttons, triangles-falling, waitlist-hero, weave-spinner
@mirukullacode
  chart-bar, chart-line, expand-input, fill-button, tweenly-ai-recorder, tweenly-chart-kpi,
  tweenly-chart-radial, tweenly-curved-carousel, tweenly-elastic-switch, tweenly-hero-background,
  tweenly-hover-media, tweenly-image-arc, tweenly-image-fan, tweenly-shine-button, tweenly-slide-button
@misbahansar   card-hover
@mishra.archana0148   whitecurd-original
@mishraathrav917   ass
@mjiu651   ff
@mkasiak   act-of-creation
@mluzetti11   oran-g
@mmrahmanbappi
  model-picker-prompt, tool-call-indicator
@mo040   mo-mosaic
@moazamtrade
  3d-gallery-photography, 3d-image-gallery, 3d-orbit-gallery, ai-models-preview, animate-card-animation,
  animated-generate-button-shadcn-tailwind, background-shader, background-shaders, background-shades,
  crypto-swap-card, feature, feature-shader-cards, glass-real-time-crypto-chart, hero-button-expendable,
  hero-dithering-card, hero-section-with-smooth-bg-shader, hover-animation-button, marquee-hover-button,
  neon-dither, paper-design-shader-background, pinky-news-letter, portfolio-hero-with-paper-shaders,
  sleek-hero-with-orb, stacked-panels-cursor-intereactive-component, text-hover-effect, the-infinite-grid,
  wireframe-dotted-globe, wrap-shader
@mohamedymay7
  lol, maestro
@mohammad.eska34   margin-frame-with-flowing-logos
@mohammadalhabil1999   time-picker
@mohammadshehadeh
  changelog-01, changelog-02, coming-soon-01, coming-soon-02, comparison-02, comparison-03, cookie-consent,
  cta-03, ecommerce-04, error-01, faq-05, faq-06, feature-07, feature-08, feature-10, feature-11, footer-02,
  integrations-07, json-viewer, k8s-pod-table, log-viewer, login-01, login-03, logo-cloud-03, logo-cloud-04,
  magnetic-button, message-thread, not-found-01, pdf-viewer, phone-input, prompt-input, rich-text-editor,
  server-card, tag-input, toc, usage-dashboard, video-player
@mohammed-saif-ibrahim   chart
@mohammedsahil0003   color-fill-card
@mohitsapat
  language-switcher-pill, navbar, phone-input, translation-widget
@mokshithgujjeti
  call-to-action, dev-tool-landing-page, features-card, featuresgrid, modern-landing-hero, pricing-section
@molecule-lab-rushil
  animate-checkbox, bouncing-dots, dialog, discussion, expandable-button, morphing-square, orbital-loader,
  spinning-circle, star-rating, swipe-row-1, vignette-grid-background, voice-input, warp-dialog, wave-loader,
  word-rotate
@mona_biasia   gradient-shimmer
@monkjin1983   ascii-811f593a
@monolythdev
  ai-agent-pipeline, stepped-logo-marquee
@montekkundan
  ascii-cube, ascii-pyramid, knot-animation
@motiondotdev
  motion-accordion, motion-add-to-basket, motion-along-path, motion-animate-presence-modes,
  motion-bobble-hover, motion-bounce-easing, motion-card-stack, motion-collision-hover-events-only,
  motion-color-picker, motion-confetti, motion-conic-gradient-pointer, motion-context-menu,
  motion-copy-button, motion-create-button, motion-cursor, motion-cursor-custom-content,
  motion-cursor-floating-target, motion-cursor-multifollow, motion-dots-morph-button,
  motion-drag-lock-direction, motion-enter-animation, motion-exit-animation, motion-floating-action-button,
  motion-follow-pointer, motion-hold-to-confirm, motion-html-content, motion-image-reveal-slider,
  motion-ios-slider, motion-keyframes, motion-keyframes-wildcards, motion-layout-animation, motion-line-graph,
  motion-loading-circle-spinner, motion-loading-fill-text, motion-loading-jumping-dots,
  motion-loading-line-reveal, motion-loading-progress-bar, motion-loading-pulse-dots, motion-loading-ripple,
  motion-material-design-ripple, motion-multi-state-badge, motion-number-counter, motion-path-drawing,
  motion-reorder-grid, motion-reorder-items, motion-scramble-text, motion-scramble-text-hover,
  motion-scroll-container, motion-scroll-hide-header, motion-scroll-horizontal,
  motion-scroll-linked-with-spring, motion-scroll-track-element, motion-scroll-word-reveal,
  motion-shared-layout-animation, motion-skeleton-shimmer, motion-split-text, motion-svg-viewbox,
  motion-tilt-card, motion-typewriter, motion-use-animation-frame, motion-use-presence-data
@moumensoliman
  action-dropdown, avatar-hover-card, avatar-with-name, caret-mention-popover, command-palette, delete-button,
  elastic-switch-shadcnui, expanding-search-dock-shadcnui, faq-section-shadcnui, floating-gradient-shadcnui,
  gallery-grid-block-shadcnui, glass-account-settings-card-shadcnui, glass-blog-card-shadcnui,
  glass-checkout-card-shadcnui, glassmorphism-listen-app-block-shadcnui,
  glassmorphism-minimal-metrics-block-shadcnui, glassmorphism-portfolio-block-shadcnui,
  glowy-waves-hero-shadcnui, gradient-animation-shadcnui, heart-favorite-shadcnui, hero-block-shadcnui,
  hero-section-shadcnui, holographic-wall-shadcnui, image-slider-card-shadcnui,
  interactive-logs-table-shadcnui, liquid-cursor, native-button, scroll-fade-effect, search-expand-nav,
  stocks-dashboard-shadcnui, synced-lyric-captions-shadcnui, team-section-block-shadcnui,
  unlimited-nested-menu, volume-component-shadcnui
@mr.kolosovalexander
  nova, nova-2, novaday
@MrCruzz   id-card-lanyard
@mrhyddenn   hover-button
@mrl-sch   sauce
@mruderman   oval-eggs
@mtorres6739   autoworks
@muhammad-binsalman
  animated-scan-loader, boxy-app-icons, ethereal-beams-hero, magic-keyboard-component, quantam-mysh-hero,
  rainbow-borders-button, shiny-borders-button, shiny-button, shiny-button-1, spider-verse-glitch-button,
  star-button, stardust-button, the-blueprint-of-digital-craft, vertical-volume-slider-with-mute-toggle,
  waitlist-landing-page-with-countdown-timer
@muhammetbilgin   cosmic-404
@munozaravenadiego   silk-blend-gradient
@muntasirszn   input
@murad-sinatra
  button, combobox, command-palette, drawer, event-calendar, loaders, mors-card, number-field, popover,
  slider, swatch, table, toggles, token-field, tooltip
@muthumariappan002   lavender-smooth
@mvp_Subha
  button-github, button-hover, footer-column, loader, pulsating-loader, terms-conditions
@my
  loader, pricing-table
@n03936827   silk-blend-gradient
@n1m4mz
  agent-trace, import-patchbay, lookout, moire-field, receipt-pricing, sonar-grid
@n38693842
  3d-card, animated-card, download-animation, gallery-animation, hero-section-1, loading-animation,
  mac-os-dock, ripple-button, text-animation
@nachzugler   roly-poly-figure
@nahapetyanhk
  igaming, igaming-final
@naturaldoc   space-login
@navedux
  illos-ai-chat-empty-state, illos-api-key-card, illos-audit-log-panel, illos-booking-card,
  illos-command-palette, illos-edge-hero, illos-email-signup, illos-feature-flag-card, illos-incident-banner,
  illos-knowledge-sources, illos-maintenance-page, illos-notifications-popover, illos-queue-empty-state,
  illos-settings-panel, illos-shader-feature-bento, illos-signin-alert, illos-stats-card, illos-status-card,
  illos-team-invite-card, illos-two-factor-setup, illos-upload-dropzone, illos-usage-pricing,
  illos-webhook-setup
@navidjaberi
  page-progress, spinner
@nayan_radadiya6
  first-place-leaderboard, timeline-rail
@nblairwalker
  m-ascii, n-ascii, nm
@ncdai
  apple-hello-effect, chevrons-up-down-icon, copy-button, glow-card-grid, hero-01, icon-swap,
  mobius-loop-icon, spinning-circular-text, team-01, testimonial, testimonial-2, theme-switcher-1,
  wheel-picker
@neebarp
  burn-away, iron-filings, matchbox-carousel, underwater-dashboard
@nellycyberpro   maomao
@nelwincatalogo   x-scroll
@nevsky118
  footer, not-found
@neweartheconomy   iris
@nextjsshop
  animated-arrow-button, arrow-dots-button, icon-accordion, nextjsshop-button, pixel-broke-button,
  pixel-button, sneaky-button, tags-breadcrumb
@nexxeondigitalsolutions-cmyk   wonder
@nicolassalok1   flavers
@nikhiljainsam   draggable-priority-list
@nikolas-sapa
  ascii-globe-spin, background-ascii-dither, background-ascii-flow, background-ascii-force-chains,
  background-ascii-nodal-lines, background-ascii-plasma, background-ascii-wake, background-gradient-shader,
  background-truchet-weave, border-chrome-ring, breadcrumb-fold, chart-area-aurora, chart-bar-halftone,
  chart-donut-halftone, chart-radar-dither, countdown-vapor-digits, dye-whorl, flamegraph-ascii-frames,
  hero-ascii-reaction-front, hero-ascii-schlieren, hero-ascii-tunnel, hero-burin-hatch, hero-dipole-field,
  hero-long-exposure, hero-recursive-type, hero-text-ring-funnel, hero-vortex-street, pole-shy,
  post-list-ascii-index, roller-break-reduce, scroll-caliper, terrain-erosion-carve, text-ascii-cascade,
  text-card-flick, text-ligature-melt, text-prism-split, toast-gravity-stack, toc-minimap-mercury,
  transition-ascii-dissolve, tree-box-drawing
@nkkbrrpochta   ascii-641821f9
@nlace-com   mesh-gradient-shader
@nomanjack
  glimm-autopilot, glimm-band-width, glimm-custom-palette, glimm-html-in-canvas, glimm-invoice-paid,
  glimm-publish, glimm-teammate-joins, glimm-theme, glimm-to-dos, glimm-transition, glimm-upgrade-to-pro,
  glimm-usage-reset
@norway81   dq
@notcoolmortal   ascii
@notshekharsahu   waves-shader
@notskyzzer   nice-bg
@npouliss   test
@nrmk13   aimo
@nuova.esperienza.1993   shader-anima
@nyxbui
  globe, stepper, timeline, video-modal, warp-background
@obaidqatan
  liquid-glass-accordion, liquid-glass-breadcrumb, liquid-glass-hover-card
@obscurepastas   background-1
@ocpalacellc   virt
@odysseyui
  components-ai-thought-chain, components-preloaders-greetings, components-pricings-pricing-6,
  components-primitives-avatar, components-texts-typewriter, primitives-buttons-liquid
@oeneco   dynamic-frame-layout
@og   blur-reveal-deck
@ohmfordev   hero
@ola.leandroaraujo   shader-r
@olaf.stolle   silk-shader
@olaniyanpaul012   ascii-background
@oldkong88   cartoon-button
@olewandowski1
  activity-1, activity-3, activity-4, article-5, blog-3, booking-2, centered-nav-header, changelog-2,
  charts-1, charts-2, charts-4, charts-5, coming-soon-1, coming-soon-3, coming-soon-4, comparison-2,
  comparison-3, cookie-consent-4, cookie-consent-5, empty-states-1, empty-states-4, error-1, error-2, error-3,
  error-4, error-5, features-2, features-4, footer-3, footer-4, gallery-4, how-it-works-2, integrations-1,
  kanban-1, logo-cloud-1, logo-cloud-3, menu-1, newsletter-1, newsletter-2, notifications-3, notifications-5,
  onboarding-1, onboarding-3, onboarding-4, onboarding-5, onboarding-6, oversized-404-numeral, page-header-2,
  page-header-5, pricing-3, pricing-4, roadmap-1, roadmap-3, roadmap-4, settings-1, table-2, table-3, team-1,
  team-2, team-members-data-table, testimonials-2, timeline-1, timeline-3, traffic-range-switcher
@olivier_1b6cd5bc
  accordion-1, avatar-1, breadcrumb-1, button-1, checkbox-group-1, collapsible-1, context-menu-1, dialog-2,
  input-1, menubar-1, navigation-menu-4, number-field-1, popover-1, preview-card, progress-1, radio-1,
  scroll-area-1, select-1, separator-1, slider-1, switch-1, tabs-1, toast-1, toggle-group, toolbar-1,
  tooltip-1
@olovajs
  orbiting-carousel-with-animated-icons, orbiting-skills
@om3gaholdings   rds-silk
@openstatusHQ
  datetime-picker, status-bar
@OrcDev   8bit-menubar
@originui
  accordion, alert-dialog, avatar, breadcrumb, button, calendar, calendar-rac, checkbox, command, dialog,
  dropdown-menu, hero-pill, image-crop, input, input-with-inner-tags, joined-pagination, label, multiselect,
  navigation-bar, navigation-menu, navigation-menu-4, newsletter-section, numbered-pagination, pagination,
  popover, radio-group, select, select-native, slider, stepper, table, tabs, text-pagination, textarea,
  tooltip, tree, use-character-limit, use-image-upload, use-pagination, use-slider-with-input
@orris.studio.au   mesh-drift-shader
@osagi
  ai-orb, assistant-composer, kpi-tile, otp-input, reasoning-thread, shader-art
@osiris-balonga
  date-wheel-picker, member-selector, story-viewer
@osmosupply
  draw-random-underline, looping-words-with-gsap, parallax-scrolling
@otatechie   dithered-footer
@otmanbsh3   bloom-field-gradient
@oui
  oui-text-area, oui-text-field
@out.agencia.comunicacao   a-shader
@owencope   green-border
@ozantekin
  back-button, bookmark-icon-button, brightness-control, get-started-button
@pabalomartin   7777
@pabitrabarmanaaa089   hehe
@paboene25   waterfall
@pacekit
  ai-response-writer, ai-suggestions, bouncing-text, gradient-shadow, mouse-wave-text, scramble-text,
  squash-text
@paceui
  dot-flow, dot-loader, draw-line-text, flip-reveal, form-textarea, layered-stack, liquid-cursor,
  liquid-glass, reveal-text, text-fall-button
@pankajvpande   test-shader-art
@panto
  dark-blue-hero-gardient, dark-purple-gardient, lime-green-gardient
@paper-design
  color-panels, color-panels-glass, color-panels-gradient, color-panels-opening, dithering, dithering-bugs,
  dithering-ripple, dithering-sine-wave, dithering-swirl, dithering-warp, dot-grid, dot-grid-tree-line,
  dot-grid-triangles, dot-grid-wallpaper, dot-orbit, dot-orbit-bubbles, dot-orbit-hallucinatory,
  dot-orbit-shine, fluted-glass, fluted-glass-abstract, fluted-glass-folds, fluted-glass-waves, gem-smoke,
  gem-smoke-circle, gem-smoke-daisy, gem-smoke-diamond, gem-smoke-metaballs, god-rays, god-rays-ether,
  god-rays-linear, god-rays-warp, grain-gradient, grain-gradient-truchet, halftone-cmyk, halftone-cmyk-drops,
  halftone-cmyk-newspaper, halftone-cmyk-vintage, halftone-dots, halftone-dots-led-screen,
  halftone-dots-mosaic, halftone-dots-round-and-square, heatmap, heatmap-sepia, image-dithering,
  image-dithering-natural, image-dithering-retro, liquid-metal, liquid-metal-backdrop, liquid-metal-noir,
  liquid-metal-stripes, mesh-gradient, mesh-gradient-beach, mesh-gradient-ink, mesh-gradient-purple,
  metaballs, metaballs-background, metaballs-ink-drops, metaballs-solar, neuro-noise, neuro-noise-bloodstream,
  neuro-noise-ghost, neuro-noise-sensation, paper-texture, paper-texture-abstract, paper-texture-cardboard,
  paper-waves, perlin-noise, perlin-noise-moss, perlin-noise-nintendo-water, perlin-noise-worms,
  pulsing-border, pulsing-border-circle, pulsing-border-northern-lights, pulsing-border-solid-line,
  simplex-noise, simplex-noise-bubblegum, simplex-noise-first-contact, simplex-noise-spots, smoke-ring,
  smoke-ring-cloud, smoke-ring-line, smoke-ring-solar, spiral, static-mesh-gradient, static-mesh-gradient-sea,
  static-mesh-gradient-sunset, static-radial-gradient, static-radial-gradient-cross-section,
  static-radial-gradient-lo-fi, static-radial-gradient-radial, swirl, swirl-opening, voronoi, voronoi-bubbles,
  voronoi-cells, voronoi-lights, warp, warp-cauldron-pot, warp-kelp, warp-live-ink, warp-nectar, warp-passion,
  water, water-abstract, water-slow-mo, water-streaming, waves-groovy, waves-ride-the-wave, waves-tangled-up
@parentbaptiste.p
  basmos, basmso
@parivajawat   mesh-gradient-shader
@parsavashghani10   didar
@pate1kiran
  code-pen-home-skeuomorphism-in-the-dark-button, daybreak-text-reveal, progressive-blur-modal
@patrick-xin
  autocomplete, expandable-dialog, morphing-dialog, onboarding-dialog, unsplash-gallery-dialog,
  vercel-notification-popover
@patrickthomasdunn1988
  bars, bloodline, blurred-blob, cool-ribs, copper, desert-drift, fire, ominous, ribbed, robot-flyby, shallow,
  snake-skin, sneak, tidal-cursor, wilderness
@paulbarbaste   paul-s-gradient
@paulchariswork   waves-shader
@paulkatz996
  mix, red-blue, spinny-thing
@pavlegosic.sales   dwd
@pdornelasribeiro80   fundo
@pearpages   popover
@pedro_65116d9c   favorites
@pedrolunet
  circular-dots, clock, dual, flip, linear-dots, ribbon, ring, slide, snake, spark, swirl, wave
@petrovich_dmitrii   my-first
@phandangkhoa96   momentum-lines
@phthao.1367   uu
@phucbm   moving-border
@pilapilun   hs-office
@pixajans06   k-ascii
@pixelfox.webstudio   silk-shader
@piyushxdev
  3d-parallax-unfurling-gallery, interactive-video-portfolio-scroller
@platejs
  block-list, block-selection, blockquote-node, caption, code-node, cursor-overlay, editor, heading-node,
  highlight-node, inline-combobox, kbd-node, link-node, math-base-kit, resize-handle, tag-node, toc-base-kit
@playerwarzone902   dsadas
@pmalay694
  ascii-field, balloon-button, fold-toolbar, halftone, halftone-horizon, oil-slick
@pmmis-cp   orb-flow-background
@pogotka   hero-anim-1
@porterlaforce
  chroma-entity, hurricane-season, lsd-chalkboard
@positronx   offer-button
@poyrazhawk
  ascii, kk
@ppramanik62
  accordion, notification-stack
@prashantsom75   scroll-morph-hero
@prayaniwork
  ascii-liquid-login, loading-animation, mesh-gradient
@prebuiltui
  about, autocomplete, avatar-square, badge-tag, breadcrumb, button-ui, cards, checkbox-1, combobox, cookies,
  dropdown-menu, faq-sections, feature-sections, footer-1, form-1, hero-section, image-gallery, login-form,
  pricing-cards, testimonial, toggle-switch
@preetbiswas2006   preet-shader
@preetsuthar17
  accordion-1, ai-chat-input, ai-error-handler, ai-thinking, ai-thinking-block, animated-counter,
  animated-dock, animated-tabs, animated-underline, auth-change-password, auth-email-change,
  auth-verify-email, avatar, avatar-group, basic-data-table, billing-upgrade-prompt, blurred-stagger-text,
  brand-scoller, breadcrumb, button, calender, card, card-1, checkbox, checkout-block, chip,
  clean-minimal-sign-in, command-menu, contact-support-block, draggable-list, drawer, dropdown-menu,
  expandable-tabs-1, faq-block, file-upload, full-screen-signup, gradient-tracing, hero-1, hero-2-1,
  hover-link-preview, infinite-text-marquee, input, input-otp, kbd, label, loader, magic-text, menubar,
  message-input-block, messaging-conversation, messaging-people-list, modern-stunning-sign-in,
  mouse-following-eyes, navbar-1, newsletter-signup, pagination, password-reset-block,
  password-strength-meter, password-update-block, phone-input, post-card, pricing-1, progress, radio,
  resizable, responsive-masonry-layout, scroll-area, select, selector-chips, separator, shining-text, sidebar,
  sign-up-block, skeleton, slider, spotlight-card, switch, system-status-block, tabs, task-filters,
  team-invite, testimonial-card, textarea, time-picker, timeline, toolbar, tooltip, tree, tree-view,
  typewriter-text, video-player, waitlist-form-1
@preston_12fc481c   pkakuk
@prisdvl   prisma
@prithuldas25   cfd
@productprod7   green-down
@profitegood   mesh-drift-shader
@properui
  command-menu, loading-indicator
@protechnologydxb
  page-2, vktred
@prozinhoo0o17   jjanaj
@prv.ctech   baby-blue
@pshopps04
  1s1s, is1s
@pulkitxm
  aurora-background, cursor-spotlight, fluid-cursor-trail, handwriting-svg, horizontal-scroll-gallery,
  infinite-circular-scroll, line-draw-svg, lqip-image, not-found-page, parallax-image, party-popper,
  scroll-linked-video-scrubber, stagger-reveal-grid
@pulseawan
  apple-calendar-picker, apple-color-picker, apple-emoji-picker, image-expansion, modern-login-signup
@pupilliluke   rook
@purestackstudio   drop-files
@purnavu-12
  buildwithme-border-trace-button, buildwithme-flowing-lines, buildwithme-magnetic-button,
  buildwithme-streaming-message
@qcrgrhmbg9   artezonafoda
@qiaozhi7426   111
@quentin.hoarau193   qweqw
@quordix
  quordix-hero, quordix-work-hero
@radiumcoders
  animated-testimonials, ascii-fluid, ash-burst-button, brutal-button, chrome-button, click-powerup,
  dither-button, dither-scan, dithered-404, evilbuttons-3d-button, evilbuttons-evil-eye-button,
  evilbuttons-hold-button, evilbuttons-morph-status-button, frame-button, gooey-color-picker, grid-button,
  highlight-button, live-orb, logo-burst, minimal-button, motion-btn, movie-pass, prompt-box, ring-tower,
  scroll-bars, shader-fire, shader-gradient, shader-metal, shiny-button, slide-to-detonate, snake-404,
  tangle-footer, thruster-button
@radu
  colorful-bento-grid, footer-taped-design, pricing-slider-loops
@rafa-porto
  ai-assistant-interface, publish-button, sign-in, to-do-card
@rahil1202
  aether-hero, aurora-flux, bell-notify, credit-card-form, fire-sphere, glass-video-hero,
  interactive-gradient-background, light-speed, metallic-business-card, neural-noise-cursor, prisma-hero,
  retro-dvd-tv, scanner-card-stream, scroll-hero-section, star-shockwaves, text-scrammble, tube-cursor,
  water-ripple-image
@ranjansharma.ind   standard-card
@ravikatiyar162
  3d-card, 3d-radio-group, 404-error-page, achievement-cards, advanced-ai-chat-input, ai-image-generator-hero,
  animated-feature-card, animated-hero, animated-hero-section-1, animated-hero-section-2,
  animated-profile-card, animated-shader-hero, app-download-section, asset-card, author-form-card,
  baggage-add-on, banner, battery-card, bento-gallery, bento-grid, bubble-button, button, card, card-1,
  card-10, card-11, card-12, card-13, card-14, card-15, card-16, card-17, card-18, card-19, card-2, card-20,
  card-21, card-22, card-23, card-24, card-25, card-26, card-3, card-4, card-5, card-6, card-7, card-8,
  card-9, card-grid, cards-1, carousel, circular-fan-speed-knob, circular-gallery, circular-gallery-2,
  color-palette, color-palette-card, community-hub-card, composer-input, connect-wallet-modal, contact,
  content-with-illustration, credit-debit-card, currency-exchange-card, dashboard, dashboard-1,
  delivery-scheduler, donut-chart, download-card, download-options-section, download-toast, economic-calendar,
  error, event-card, excel-style-table, expandable-skill-tags, fare-selector, feature-card, feature-card-1,
  feature-carousel, feature-highlight, feature-highlight-card, feature-section, feature-section-1,
  feature-spotlight, feedback-widget, file-transfer-card, file-upload-card, financial-dashboard, flight-card,
  flight-card-1, flight-search, flight-status-card, flight-ticket, floating-icons-hero-section, folder,
  folder-card, folding-cube-loader, footer, frame, frosted-card, glass-calendar, glass-radio-group,
  glowing-card, gradient-card, guest-selector, hero-1, hero-2, hero-3, hero-4, hero-5, hero-section-2,
  hero-section-3, hero-section-4, hero-section-5, hero-section-7, hero-section-8, hero-section-9,
  how-it-works, how-we-do-it-process-overview, icon-set, image-comparison-slider-horizontal,
  image-comparison-slider-vertical, image-showcase, image-slider, image-testimonial-grid, info-card, input,
  insurance-policy-card, integration-showcase, interactive-hero-backgrounds, interactive-list, item-card,
  line-graph-statistics, liquid-loader, loader, loader-1, loader-10, loader-11, loader-12, loader-13,
  loader-15, loader-2, loader-3, loader-4, loader-5, loader-6, loader-animation, manage-access-component,
  marquee-logo-scroller, masonry-grid, masonry-grid-with-scroll-animation, mentor-section, menu-item-card,
  minimalist-hero, mission-success-dialog, modern-hero-section, mouse-following-line, multi-step-form,
  music-player, music-player-card, newsletter-dialog, offer-carousel, onboarding, onboarding-card,
  onboarding-checklist, onboarding-form, onboarding-welcome-screen, orbiting-avatars, order-status-card,
  order-status-tracker, parallax-card, payment, payment-1, photo-stack, planner-card, presence-card, pricing,
  pricing-card-1, product-card, product-card-1, product-card-2, product-card-3, product-carousel,
  profile-card-1, profile-selector, project-card, project-data-table, promo-card,
  rain-and-lightening-hero-section, range-slider, redeem, registration-stepper, reward-card,
  ride-booking-form, ripple-pulse-loader, rotary-radio-switch, service-grid, services, services-card,
  share-card, shared-files, sign-in, sign-in-1, sky-toggle, sleep-tracker-card, social-media,
  solar-pulse-loader, sparks-carousel, star-wars-toggle-switch, stats-card, stats-card-1, stats-card-2,
  stats-widget, stock-card, stock-category-list, subscription-screen, swap-card, switch, task-list,
  team-section, team-section-1, team-showcase, testimonial, testimonial-2, testimonial-card-1, testimonials,
  text-arc-effect, ticket-confirmation-card, timesheet-confirmation, toggle-switch, tracker-card, trail-card,
  trend-card, user-profile-dropdown, video-generator-card, video-thumbnail-player, welcome, welcome-modal,
  workflow-builder-card, workout-card, workout-summary-card
@rayayush47   saddu
@RayMethula
  footer, testimonial-carousel
@re-cinq
  thinking-dots, thinking-indicator
@reach2saksham   aossie-logo
@reachwelch   just-playing
@reaviz
  area-chart, area-chart-2, area-chart-xs, areachart-multiseries, funnel-chart-big, heat-map-xl, hexagon-map,
  incident-bar-chart, incident-report-large, incident-report-middle, layered-chart-xl, stacked-diverging-bar
@redgrant111   sunrise-glow
@redpangilinan   credenza
@redrob-labs
  accordion, alert, citation, hero, memory-scope, message, meter, name-input, pagination, schedule-picker,
  status-card, switch, textarea, theme-switch
@reihanabta335   spider-man-bnd
@remcostoeten   interactive-empty-state
@reshaped
  perlin-noise, reshaped-alert, reshaped-autocomplete, reshaped-avatar, reshaped-badge, reshaped-breadcrumbs,
  reshaped-button, reshaped-calendar, reshaped-card, reshaped-carousel, reshaped-checkbox,
  reshaped-context-menu, reshaped-divider, reshaped-dropdown-menu, reshaped-file-upload, reshaped-link,
  reshaped-loader, reshaped-menu-item, reshaped-modal, reshaped-number-field, reshaped-pagination,
  reshaped-pin-field, reshaped-popover, reshaped-progress-bar, reshaped-progress-indicator, reshaped-radio,
  reshaped-select, reshaped-slider, reshaped-switch, reshaped-table, reshaped-tabs, reshaped-text-area,
  reshaped-text-field, reshaped-toast, reshaped-toggle-button, reshaped-toggle-button-group, reshaped-tooltip
@retroui
  area-chart, bar-chart, menu-style-default, popover, table
@reuelaraujo7
  menu, pedidosmenu-com
@reuno-ui
  ai-input, animated-number, apple-play-button, background-paper-shaders, background-plus, bg-gredient,
  blue-meshy-background, card-carousel, count-down-numbers, countdown-number, crypto-dashboard, css-link,
  hero, hero-section, joblisting-component, loop-animation-hook, mouse-follow-animations, music-toggle-btn,
  pagination, pearl-button, progressive-blur, shader-svg, share-button, shuffle-number, skiper39, skiper49,
  skiper67, skiper87, skiper89, skiper99, slide-button, special-card, stacked-dialog, svg-clip-path-mask,
  svg-follow-scroll, text-roll-navigation, text-scroll-animation, theme-toggle-buttons
@reynosobriam   opp
@rhllom
  3d-adaptive-navigation-bar, cinematic-theme-switcher
@ricaelmenezes3   portfolio
@ridemountainpig
  departures-board, flightcn-flight-airport, flightcn-flight-multi-route, flightcn-flight-routes,
  flightcn-satellite-orbit
@ringlabs
  animated-check-box, interactive-animated-arrow-icon
@riyan.besseghir   silk-black
@rjcuff2000   expandable-tabs
@rlzee   pricing
@rmahammad
  animated-dialog, animated-grid, animated-list, api-request-inspector, aurora-panel, border-beam-panel,
  comment-thread, compare-reveal, data-refresh-state, decrypt-text, deployment-pipeline, filmstrip-scrub,
  holo-card, kanban-card-movement, lens-card, loom-draft, luminous-topography, magnetic-dock, proximity-type,
  source-citation-rail, streaming-data-rows, torch-reveal
@robeerst   portrait-art
@robertlib
  checkbox, chip, collapsible-content, empty-state, form-error, progress, select, spinner, switch, timeline
@roccomilicic2
  chur-gradient, chur-websites
@rogermenezes2021   myphoto
@romanhaendler
  core-spinner, tree-view
@romanvasnev
  analytics-bento, dot-field, finance-bento, glass-prism-hero, holo-card, icon-folder, portfolio-hero,
  sign-up-flow, swipe-to-confirm, time-ruler, web3-bento
@romanvicus   green-nature
@rorogogogo   agent-wave-loader
@rpv   ad
@rrodriguezrr007   liminal-vincent-marcum
@rs101e   durham-coded
@rubra.001   areeb-asci
@rudrodip   async-select
@ruhith369
  bar-loader, block-loader, bouncing-circles-loader, health-stat-card, loader, loader-grid,
  loader-progressive-bar, loading-bottle, loading-lines, loading-radar
@ruixen.ui
  about-page, accordian, account-menu, action-hub-input, action-toolbar, advanced-image-uploader,
  ai-chat-input, alert-badge, animated-feature-spotlight3d, animated-highlight-text, animated-link,
  animated-number-flip, app-menu-bar, arc-preloader-hero, aurora-flow, aurora-waves, auth-dialog,
  avatar-notifications, avatar-smart-group, badge-button-combo, badge-tabs, behavioral-history-select,
  bottom-drawers, calendar-lume, calendar-planner, calendar-scheduler, calendar-twin, calendar-with-presets,
  capsule-tabs, card-hand-gallery, card-stack, case-studies, centered-feedback-drawer, chapter-scrubber,
  checklist-button, checkout-form, chrono-select, clean-tag-input, cloud-watch-form, color-emotion-select,
  column-collaboration-table, combined-featured-section, comparison-table, confetti-button,
  confirmation-button, container-text-scroll, contributors-overview-table, correct-number-input,
  countdown-button, coverflow-carousel, creat-account-form, creative-card, credit-card-dialog,
  credit-card-hero, daily-timeline-scheduler, date-time-input, date-time-picker, dock, dock-morph, docks,
  doctor-live-chat-card, drawer-inner-content, drilldown-menu, dropdown-multi-calendar,
  dropdown-range-date-picker, dynamic-status-button, elite-plan-card, emoji-radio-group, event-calendar,
  event-scheduler, expandable-content-button, fade-slide-tabs, falling-symbols-background,
  feature-accordion-section, feature-highlight-pro-card, feature-section, feature-section-1, feature-showcase,
  featured-crm-demo-section, featured-section-stats, features-detail, file-tree, file-tree-1, file-upload,
  fixed-header-footer-table, flexi-filter-table, flip-card, flip-clock, floating-icons-loader, floating-input,
  floating-nav, footer-1, futuristic-nav, gallery-hover-carousel, gamified-login-card, globe,
  globe-feature-section, glow-tree, gooey-dock, gooey-pagination, gradient-bold-card, gradient-chat-input,
  gradient-reveal-text, halo-reel, health-stat-card, heatmap-calendar, hero, hero-page, hero-preview-walls,
  hero-section-with-gradient, hero-section06, home-section, horizon-glow-hero, hover-gradient-nav-bar,
  hover-play-card, hybrid-tabs, icon-grid-button, icon-label-subtext-button, icon-pagination,
  identity-verification-dialog, image-cropper, image-stream-hero, inbox-calendar, info-cards-table,
  inline-analytics-table, inline-copy-input, input-with-select, integration-hero, integrations-section,
  interactive-button, interactive-image-gallery, job-slider, live-preview-style-select, load-ripple, loader,
  loading-circle, login-card, magnetic-dock, magnetic-tabs, mail-checker-input, minimal-payment-modal,
  minimisable-table, modern-payment-form, monthly-heatmap-calendar, morphing-page-dots, mouse-spark,
  multi-media-testimonial, multi-month-calendar, multi-orbit-semi-circle, multi-select-calendar-card,
  multi-step-button, neo-qrbutton-2, nested-dashboard-menu, newsletter-form, notification-button,
  notification-inbox-popover, notifications, notifications-1, notifications-alt, notifications-carousel,
  notifications-filter, notifications-toggle, notifications-with-actions, nova-qrbutton,
  order-tracking-parallax-card, otpdialog, otpinput, package-installer-tabs, phone-scroll-hero, pill-calendar,
  pill-morph-tabs, portfolio-scroll-grid, preview-switch-hero, pricing-module, pricnig-cards03,
  privacy-policy-modal, product-bounce-card, product-image-card, product-table, progress-button,
  progressive-flux-loader, project-progress-card, project-pulse-tracker, rating-scale-group,
  receding-text-plane, release-time-line, reorderable-table, review-filter-bars, ripple-circles,
  ripple-distortion, rising-glow, rotating-gradient-right, ruixen-accordian01, ruixen-bento-cards,
  ruixen-card-01, ruixen-card02, ruixen-carousel-wave, ruixen-contributors-table, ruixen-feature-section,
  ruixen-featured-image-section, ruixen-footer03, ruixen-gradient-footer, ruixen-hero-section-02,
  ruixen-menu-options, ruixen-mono-chat, ruixen-moon-chat, ruixen-popover-02, ruixen-pricing-04,
  ruixen-pricing05, ruixen-prompt-box, ruixen-stats, ruixen-table-basic, ruixen-upload-input, safari-01,
  scheduler, scroll-burn-text, scroll-faqaccordion, scroll-image-tunnel, scroll-pagination,
  scroll-portrait-wall, scroll-tilted-grid, search-with-category, segmented-button-group,
  sentiment-radio-group, service-changelog, shirt-parallax-card, side-panel-multi-calendar, sidebar-showcase,
  sign-in-card, sign-in-form, sketchpad-dropzone, sliding-pagination, sliding-tabs, smart-assist-input,
  smart-breadcrumb, smart-paste-input, social-auth-card, social-post-card, solar-loader, split-action-button,
  spotlight-background, stack-feature-section, stack-pagination, step-card, success-login-card, table-dialog,
  table-edit, table-with-dialog, team-access-card, text-reveal-faqs, three-dwall-calendar, tilted-dock,
  tilted-grid-hero, time-with-icon, timeline-02, toolbar-dock, tooltip-button, tour-popover,
  tree-node-tooltip, universal-date-picker, url-input, video-player-pro, voice-message-bubble,
  wave-background, waveform-player, wheel-pagination, worm-loader, zoom-depth-tabs
@rumen32215   silk-shader
@russellbloxwich
  chart, code-block, direction, field, layer-card, meter, sensitive-input, toast
@rxxndy   twitter-testimonial-cards
@ryanonline1234
  ink-headline, ink-hero, ink-reveal, ink-ridges
@rylenlobo   infinite-drag-scroll
@rynkovski
  3d-card-1, alert-dialog-icon, credit-card, error-alert-dialog, notification-alert-dialog, select
@saleshookai   antic-athena
@salmanwajahat640
  launching, launching-01
@sam344334   hero
@samardeepgamer
  bg, new
@samitkapoor
  apple-spotlight, circle-menu
@samsiavoshian2009
  backed-by-yc, feedback-prompt, globe, language-selector-dropdown, stack-flow-integrator
@samskanse09   1st-shader
@samson.mshelia   s1-asci-art
@samudanileo38   leonardo-primo-background-animato-1
@sarat-asymmetrica
  radio, tile-band, toggle
@satoriui
  dotted-modern, flip-clock, keyboard, kinetic-grid, slide-up-reveal, typewriter-loop
@saurabh-2607
  accordion, aceternity-button, animated-link, button, great-ui-aceternity-button, great-ui-animated-link,
  great-ui-animated-select, great-ui-ascii-image, great-ui-avatar-stack, great-ui-button,
  great-ui-cyber-glitch-shader, great-ui-deployment-checklist, great-ui-diagonal-marquee-carousel,
  great-ui-image-hover-reveal, great-ui-liquid-dissolve-shader, great-ui-liquid-ripple-shader,
  great-ui-macbook-mockup, great-ui-minimal-buttons, great-ui-minimal-buttons-larsen66,
  great-ui-mobile-mockup, great-ui-revision-timeline, great-ui-terminal-loader, great-ui-vinyl-album-card,
  great-ui-vortex-spiral-shader, minimal-buttons, terminal-loader
@savnitya   bull
@scosic99   main-shader-for-ai
@scrollxui
  barswave, contact-with-globe, cta-section-with-floating-gallery, dot-wave, download-with-columnlines,
  dualsparks, electric-text, features-with-panel, folder-tree, footer-with-minimal-outline, footer-with-suite,
  frequently-asked-questions-with-accordion, gravity, hero-with-cards, hero-with-pixelbackground, keyboard,
  login-minimal, logo-cloud-flipflow, logo-cloud-marquee, logo-stepper, modern-loader, motion-grid, particles,
  pixel-highlight, shiny-button, testimonials-with-carousel, testimonials-with-marquee,
  testimonials-with-verticalmarquee
@sean0205
  3d-testimonails, accordion, accordion-1, alert, alert-1, alert-with-action-buttons, area-charts-1,
  area-charts-2, attachment-composer-tray, avatar, badge-2, badge-variants, base-accordion, base-avatar-1,
  base-badge, base-button, base-input, base-menu, base-popover, breadcramb, button, button-1, c-alert-14,
  c-alert-18, c-alert-4, c-attachment-4, c-attachment-6, c-button-21, c-button-39, c-button-45, c-button-47,
  c-button-52, c-calendar-14, c-calendar-16, c-carousel-10, c-carousel-2, c-carousel-4, c-carousel-8,
  c-chart-1, c-chart-11, c-chart-13, c-chart-16, c-chart-18, c-chart-19, c-chart-20, c-chart-21, c-chart-24,
  c-chart-25, c-chart-3, c-chart-6, c-chart-9, c-checkbox-13, c-dialog-4, c-input-22, c-input-group-13,
  c-input-group-14, c-input-group-21, c-input-group-26, c-input-group-27, c-input-group-32, c-input-group-36,
  c-input-group-40, c-input-group-6, c-input-otp-1, c-input-otp-3, c-input-otp-5, c-message-2, c-message-3,
  c-message-7, c-number-field-4, c-pagination-11, c-pagination-6, c-progress-5, c-progress-6, c-progress-7,
  c-questionnaire-2, c-questionnaire-6, c-radio-group-11, c-radio-group-17, c-radio-group-8, c-rating-6,
  c-rating-8, c-scroll-area-5, c-select-14, c-select-2, c-select-23, c-select-33, c-separator-1,
  c-separator-3, c-separator-6, c-sonner-14, c-sonner-17, c-sortable-1, c-sortable-6, c-sortable-7,
  c-spinner-4, c-stepper-1, c-stepper-10, c-stepper-11, c-stepper-13, c-stepper-15, c-switch-14, c-switch-4,
  c-switch-6, c-switch-8, c-table-13, c-tabs-8, c-timeline-8, c-toggle-11, c-toggle-14, c-tooltip-2, card,
  carousel, category-search-input, chart, checkbox, checkbox-1, code, collapsible, command,
  company-search-input-group, context-menu, context-menu-1, data-grid-table, dialog, drawer, dropdown-menu,
  expanding-icon-button, file-upload, font-family-select, form, hover-card-1, icon-alert, input,
  item-action-list, kanban, kbd-1, line-charts-1, line-charts-2, line-charts-4, line-charts-5, line-charts-6,
  line-charts-8, line-charts-9, menubar, message-reply-actions, mono-alerts, navigation-menu,
  navigation-menu-1, number-field-form, otp-verification-card, outline-accordion, pagination,
  pagination-arrows, popover, pro-feature-alert, progress, progress-1, questionnaire-segmented-progress,
  rating, resizable, resizable-1, reui-aspect-ratio, reui-autocomplete, reui-color-picker-13, reui-combobox,
  reui-date-selector, reui-emoji-picker-3, reui-emoji-picker-5, reui-emoji-picker-6, reui-empty,
  reui-event-calendar, reui-field, reui-frame, reui-gantt, reui-icon-stack, reui-icon-tile, reui-input-group,
  reui-input-otp, reui-item, reui-native-select, reui-native-select-5, reui-number-field, reui-radio-group,
  reui-scrollspy, reui-signature-pad-4, reui-signature-pad-5, reui-spinner, reui-stepper-17, reui-stepper-18,
  reui-switch, reui-time-picker-10, reui-time-picker-13, reui-time-picker-3, reui-time-picker-4,
  reui-trace-10, reui-trace-11, reui-trace-15, reui-trace-16, scroll-area, search-input-group, select, sheet,
  signature-pad, skeleton, slider, sonner, sortable, sortable-nested-list, sortable-settings-priority,
  stacked-alerts-frame, statistics-card-10, statistics-card-2, statistics-card-7, stepper, svg-text,
  switch-with-description, table, tabs, textarea, toggle-1, toggle-group-1, tooltip, tree,
  week-number-calendar
@seansiddiki   ascii-clouds
@sebafermanelli   count-badge
@sefa.basnak   green-shader
@senommu
  ai-model-select, ai-prompt-input, button, git-hub-sky, input, letter-morph, line-shader-homlu-ui,
  terminal-pikachu, waves-shaders-homlu-ui
@sensewood8
  claude-style-chat-input, energy-beam, responsive-hero-banner
@serafimcloud
  absinthe, abstract-plasma, abstract-ripple, agent-chat, alert, alert-badge, amber-dusk, amethyst-bloom,
  amethyst-wash, amount-slider, animated-blur-number, animated-menu, animated-mosaic-portrait,
  attachment-button, badge-delta, balloons, banner, bash-tool, blue-light-swirl, brick-wall, bright-lagoon,
  button-retro, code-rain, color-carousel, command-menu, contact-cards, coral-gloom, cotton-bubblegum-lilac,
  crimson-veil, dead-channel, deep-horizon, dotted-dialog, dotted-veil, edit-tool, electric-aura,
  electric-bloom, electric-gaze, ember, ember-bloom, ember-drift, ember-footer-cta, empty-state,
  error-message, ethereal-whispers, fey-button, file-attachment, filter-badge, first-light, flicker-burst,
  flicker-cityscape, flicker-tower, floating-action-button, floral-veil, front-page, generic-tool,
  ghostly-embrace, golden-radiance-shimmer, gradient-button, halftone-vibe, help-popper, herbarium,
  hero-with-mockup, hover-effect, ink-garden, input-bar, iris-bloom, iris-petal, jade-sky, lapis-peach-swirl,
  marine-foam, marine-horizon, markdown, marquee, mcp-tool, mirrorball, mode-selector, model-picker,
  molten-cells, molten-pillars, mosaic, neon-mirage, ocean-rings, ocean-swirl, oceanic-currents,
  oceanic-currents-2, oceanic-depths, oceanic-glow, oceanic-shimmer, orchid-petal-sky, parallel-waves,
  phosphor, pixel-canvas, pixel-fire-button, plan-tool, plum-peach-butter, plum-sand-apricot, pulsing-grid,
  question-tool, redshift, retro-button, reverie, rosewood-blush, schematic, scroll-loop-inception,
  search-tool, send-button, shadow-blending, shadowplay, skywash, social-links, spinner, spiral-loader,
  splite, sprite, status-badge, steel-cone, subagent-tool, suggestions, sunset, sunset-bloom, sunset-blush,
  sunset-orb, switch, tag-selector, telegram-profile-header, testimonial-card, testimonials-with-marquee,
  text-shimmer, thinking-tool, to-do-item, todo-tool, tool-group, ultramarine, use-click-outside,
  use-debounce, user-message, vapor-halftone-portrait, verdant-swirl, vibrant-pulse-glow, vibrant-stream,
  vignette-bloom, violet-nocturne, violet-plasma, violet-radiance, violet-radiance-ii, violet-starlight,
  violet-swirl, warmth-ripple, watermelon-marigold, wave-separator
@serayudigital
  date-picker, theme-toggle
@serjobas   bloim-animation-background
@sh20raj
  admit-one-3-d-holographic-ticket, curved-text-loop, optimized-tilt-card, voxel-story-video-card,
  voxel-video-streak-card
@shadcn
  accordion, alert, alert-dialog, aspect-ratio, avatar, breadcrumb, button, button-group, calendar,
  calendar-date-and-time-picker, calendar-date-and-time-range, calendar-date-picker, calendar-date-time-range,
  calendar-input, calendar-language-date-picker, calendar-picker-in-a-drawer, calendar-variable-size,
  calendar-with-booked-days, calendar-with-day-button, calendar-with-disabled-days,
  calendar-with-disabled-weekends, calendar-with-event-slots, calendar-with-little-date,
  calendar-with-localisation, calendar-with-month-and-year-dropdown, calendar-with-range-selection,
  calendar-with-start-end-month, calendar-with-time-picker-inline, calendar-with-time-pressets,
  calendar-with-week-numbers, card, carousel, chart, chart-filter, checkbox, collapsible, command,
  context-menu, data-table, date-picker, dialog, drawer, dropdown-menu, dual-calendar, empty, field-1, form,
  hero-15, hover-card, icons, input, input-group, input-otp, item, kbd, label, menubar, message,
  multiple-months-calendar, multiple-months-range, navigation-menu, neuro-noise-stats, pagination, popover,
  progress, radio-group, range-selection-calendar, range-selection-calendar-with-min, scroll-area, select,
  separator, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group,
  tooltip
@shadcn-labs   jsx-email-progress
@shadcnblockscom
  about-3, accordion-feature-section, blog7, blog8, casestudy-5, changelog-1, cta-4, faq-5, faq3, feature-1,
  feature-2, feature-72, feature-73, footer-7, gallery4, gallery6, hero-195-1, list-2, login-1, modern-hero,
  shadcnblocks-com-cta10, shadcnblocks-com-feature108, shadcnblocks-com-footer2, shadcnblocks-com-hero115,
  shadcnblocks-com-hero45, shadcnblocks-com-navbar1, signup-1
@shadcncraft
  star-rating, tagline
@shadcndesign
  banner-1, cta-section-1, header-section-1
@shadcnmaps   nicaragua-map
@shadcnspace
  accordion-05, accordion-09, accordion-multi-level, accordion-space, action-dropdown-button-group,
  animated-list, animated-text-01, animated-text-02, animated-text-04, animated-text-09, animated-text-10,
  animated-text-11, animated-text-12, animated-tooltip, apple-dock, auto-growing-textarea, avatar-08,
  avatar-badge, avatar-border, avatar-one, basic, bento-grid-03, blog-01, breadcrumb-01, button-21, button-23,
  button-26, button-27, button-32, button-33, button-group-09, button-save, button-witn-icon, calendar-01,
  calendar-02, calendar-03, calendar-04, calendar-08, calendar-10, calendar-range-select, card-02, card-07,
  card-11, card-12, card-14, card-26, carousel-02, carousel-03, carousel-07, carousel-08, chart-02,
  checkbox-05, collapsible-01, collapsible-05, contact-01, contemt-tooltip, cta-01, custom-colors, default,
  dialog-04, download-01, dropdown-menu-01, dropdown-menu-03, dropdown-menu-04, error-tooltip, feature-24,
  feature-28, feedback-textarea, field-02, field-04, figma-file-button, file-upload-05, footer-01,
  heartbeat-effect-button, hero-01, hover-blog-card, input-group-01, input-otp-10, integration-card,
  invite-member-card, invite-team-card, kbd-01, kbd-04, marquee-01, marquee-03, number-ticker-02,
  number-ticker-05, number-ticker-06, number-ticker-08, onboarding-checklist-drawer, orbiting-circles-02,
  outline-with-icon, pagination-01, pricing-01, pricing-02, product-tour-popover, progress-02, progress-03,
  radio-group-animated, radio-group-card-vertical-demo, radio-group-colors-demo, radio-group-dashed-demo,
  radio-group-with-plan-cards, rating-02, required-textarea, rounded-tooltip, scroll-area-01, select-10,
  select-11, select-12, shadcn-accordion, sheet-01, sheet-02, shine-border, shine-border-02, shine-border-04,
  shine-border-06, shine-border-07, shine-hover, skeleton-03, slider-03, slider-04, slider-05, slider-06,
  slider-08, social-icon, sonner-05, spinner-10, spinning-text-02, stepper-01, stepper-02, stepper-03,
  stepper-04, table-01, tabs-03, tabs-10, team-01, team-02, textarea-08, textarea-09, textarea-with-button,
  textarea-with-characters-left, textarea-with-floating-label, textarea-with-icon, timeline-01, timeline-02,
  toggle-03, toggle-theme, tooltip-position, waitlist-01, with-description, with-icon, with-label
@shadcnstore
  app-1, changelog-4, cta-section-2, cta-section-3, datatable-1, login-page-1, logo-cloud-1, motion-confetti,
  motion-sliding-tabs, pricing-section-1, product-card-1, roadmap-1, spinning-number, statistic-2, team-1,
  team-2
@shadcnui-blocks
  breadcrumb-10, breadcrumb-11, card-06, card-07, card-08, carousel-01, carousel-02, carousel-03,
  changelog-01, controlled-textarea, cta-06, empty-state-02, empty-state-03, empty-state-04, features-01,
  footer-01, footer-04, hero-06, hero-07, integrations-02, logo-cloud-09, logo-cloud-10, logo-cloud-14,
  logo-cloud-15, members-02, members-03, navbar-02, navigation-menu-01, navigation-menu-05,
  navigation-menu-06, not-found-02, not-found-04, not-found-06, pagination-01, pagination-04, pagination-11,
  pagination-12, pagination-13, pagination-14, pagination-icon-label, progress-01, progress-10, select-07,
  stats-04, stats-05, stats-06, tabs-08, testimonials-13, timeline-01, timeline-02, timeline-05, timeline-06
@shailendrakumar19999
  404-page-not-found, accordion, animated-3d-card, animated-button, animated-shape, cosmic-plasma-web,
  date-picker, kanban, loding, map, menu, newsletter-signup, social-card, switch, table, tree-folder-structure
@Shatlyk1011
  3d-marquee, animated-dropdown, button-colorful, fancy-text-hover, gradient-borders-button,
  hover-border-gradient, interactive-hover-button, link-hover, motion-button, shimmer-button, shiny-button,
  social-button, team-member-card, typing-effect
@shehzammian919   quantum-pulse-loade
@shepovalovdenis   liquid-glass-logo-reveal
@sherpanorland   blue
@shingpahuileng   moto
@shivendra9795kumar
  halide-topo-hero, neural-access-login
@shixuanaa11   orbit-sweep-gradient
@shobky
  charts, text-editor-card
@shoota
  article, picture
@shotbydanb   green-grade
@shuding
  cobe-globe, cobe-globe-analytics, cobe-globe-bars, cobe-globe-cdn, cobe-globe-flights,
  cobe-globe-interactive, cobe-globe-labels, cobe-globe-live, cobe-globe-polaroids, cobe-globe-pulse,
  cobe-globe-satellites, cobe-globe-stickers, cobe-globe-weather
@shugar
  avatar, avatar-1, award-badge, book, button, button-1, calendar, checkbox, choicebox-1, collapse, combobox,
  command-menu, context-card, context-card-1, description, drawer, error, feedback, input, modal, note,
  pagination, progress, project-banner, relative-time-card, relative-time-card-1, relative-time-card-old,
  scroller-1, scroller-old, select, select-1, show-more-1, skeleton, snippet, snippet-1, spinner, spinner-1,
  split-button, switch, table, tabs, tabs-1, textarea, theme-switcher, theme-switcher-1, toast, toggle,
  tooltip
@sidiora-labs
  approval-card, auth-drawer, color-list, country-select, expandable-tabs, icon-accordion, morph-confirm,
  morphing-modal, motion-breadcrumb, motion-tooltip, not-found, number-field, preview-rail, project-showcase,
  range-slider-bubble, range-slider-inline, range-slider-wave, smooth-scroll, streaming-response, swap,
  swipeable-list, tilt-card, wallet-card
@sifan.s.f.zhao   waves-shader
@silver95
  qwdqwd, r-ascii, r-ascii-2
@silvestrefrigeriopro   hero
@simone.psychk   hero1
@singhavii1702   waves-shader
@singhkartik2628
  spider, spider-pixel
@sirwhod   icon-picker-3
@skaehdwn1014   mesh-drift-shader
@skovhm
  data-table-toolbar, uai-community-feed
@skyleen77
  animated-tabs, avatar-group, backgrounds-glyph, backgrounds-topography, base-collapsible,
  components-backgrounds-bubble, components-community-notification-list, components-headless-switch, cursor,
  flip-card, headless-tabs, icons-log-out, icons-menu, icons-message-circle-heart, icons-message-circle-off,
  icons-message-square-dashed, pin-list, primitives-animate-code-block, primitives-headless-dialog,
  radix-accordion, radix-collapsible, radix-dropdown-menu, scroll-progress, spring-element,
  stars-scrolling-wheel
@slaviknocolaid   interactive-changelog-with-dialog
@slide-cn
  slide-image, timeline, title-slide
@sliderrevolution
  cymatic-particle-hero, mood-board-carousel, shadow-light-slider
@sltowl
  matte-alert-feedback, matte-commands-menu, matte-corner-checkbox, matte-hours-slider, matte-meter-slider,
  matte-opacity-slider, matte-scrub-slider, matte-sound-toggle, matte-stack-feedback, matte-undo-feedback
@smammar
  anti-metal-button, music-player-widget, perspective-highlight, pixel-logo-grid, scroll-reel-testimonials
@Smit-Prajapati   glass-card
@snapcn.dev
  block-wordmark, hero-launch, reel-collage
@socolled
  ai-input-hero, animate-navigation, animated-section, animated-tags, arrow-cta, auth-form, box-carousel,
  complete-crypto-wallet-integration, dasdafdfsdfd, gradient-background-6,
  hero-section-with-responsive-navigation, interactive-feature-section-1, login-2, login-form, r3f-blob,
  star-on-github
@solaceui
  auth-section-1, auth-section-2, auth-section-3, chat-messages-2, footer-section-1, footer-section-3,
  footer-section-4, footer-section-5, hero-section-6, navbar-section-2, phone-mockups-1,
  testimonial-section-1, testimonial-section-2, testimonial-section-3, testimonial-section-4
@sona-ui   stagger-text
@sopo   hover-card
@soralabs
  base-alert-dialog, cursor-bubble, custom-cursor, dia-text-reveal, dock-nav, dual-wipe-reveal, number-flow,
  pixelated-image-reveal, scroll-gallery, section-cta, text-reveal-block, text-reveal-mask, text-roll,
  text-scramble, text-underline, typer
@sorianosantiagosam
  silk-shader, silk-shader-maro
@sosim2874   nnnnn
@spaceboydavey   scroll-navigation-menu
@spoonyvu   glow-menu
@spydiecy
  ai-swarm-visualization, cyberpunk-neon-folder, stacked-activity-cards
@ssychui
  ascii-turntable, balance-chart, candle-chart, dot-grid-lines, heat-calendar, historical-eps, macos-dock,
  market-heatmap, market-snapshot, market-watchlist, news-card, onboarding-checklist, preferences-card,
  price-target-fan, project-index, range-navigator, returns-calendar, rocks, sectors-donut, sma-chart,
  swap-ticket, trade-journal-table
@stackingsu
  cards-shader-effect, family-signin-drawer, text-shimmer-animation-on-hover
@starc007
  action-swap-cascade, agent-activity, agent-progress, animated-sidebar, arc-picker, be-ui-404-not-found,
  be-ui-action-swap, be-ui-animated-badge, be-ui-bouncy-accordion, be-ui-button, be-ui-command-palette,
  be-ui-create-menu, be-ui-drawer, be-ui-dynamic-island, be-ui-expanable-action-bar, be-ui-expandable-tabs,
  be-ui-file-upload, be-ui-marquee, be-ui-morphing-modal, be-ui-multi-chain-swap, be-ui-number-animation,
  be-ui-otp-input, be-ui-prediction-market, be-ui-range-slider, be-ui-swipeable-list, be-ui-text-animation,
  be-ui-theme-toggle, be-ui-tilt-card, beui-bottom-sheet, beui-checkbox, beui-dock, beui-radio-group,
  beui-switch, beui-tabs, beui-tooltip, bounce-sidebar, bump-chart, button-metallic, card-folder,
  center-morph-modal, citations, color-picker, color-selector, cylinder-carousel, date-range-picker,
  digit-swap, dock, expanding-arrow-button, feedback-widget, file-tree, heat-calendar, hold-action-button,
  image-generation, knockout-bracket, liquidity-heatmap, loader, morphing-search, multi-select,
  notification-stack, overflow-actions, reasoning-text, scroll-animation, select-morph, shader-background,
  slide-action-button, streaming-response, table-editable, todo-list, tool-approval, voice-orb
@strlrd-29
  use-copy-to-clipboard, use-debounce-callback, use-toggle
@studiostargazing   lsm
@stvenchg
  animated-vercel-like-button, unsaved-changes
@su2491251
  ai-floating-toolbar, apple-text-reveal, bar-sweep, bounce-dots, bouncing-dots, bouncing-lines,
  bouncing-square, breathe-ring, card-carousel, circular-bars, concentric-ring, conveyor-loop, cross-spinner,
  cursor-trail, dash-ring, dashed-spiral, dither-donut-chart, dither-growth-chart, dots-ring, dual-arc,
  dynamic-island, intersecting-rings, magnetic-dots, orbiting-circles-loader, page-transition,
  progress-indicator, pulse, spring-dot-matrix, spring-text-pop, square-grid, square-snake, square-spinner,
  stacked-bar-pulse, symmetric-wave, text-dots, triple-dot-spinner, twin-orbit, wave-dots, waveform-loader,
  zoom-in
@SubframeApp
  accordion-1, area-chart, avatar-2, breadcrumb, calendar-1, checkbox-1, checkbox-card, checkbox-group-1,
  context-menu-1
@sudharshanpanidev
  button, empty-state, select, stepper
@sumipghb   nepal-address-picker
@summix
  matrix01, matrix02
@sumonadotwork
  blog-cards, parallax-scroll-feature-section
@supabase   oauth-consent-react
@support_596fe4b8
  ai-composer, animated-countdown, animated-select-headline, aquarium-prompt, ask-nexus-input,
  beam-sweep-field, chain-of-thought, chat-messages, cinematic-logo-cloud, circular-carousel, dot-grid-hero,
  forge-ai-command-bar, hover-highlight-text, image-trail, images-badge, infinite-moving-cards,
  interactive-globe-explorer, logo-clouds, mac-keyboard, mercury-upload, orbit-footer, otp-input,
  shooting-stars-grid, starfield-hero, suggestions, terminal, text-reveal-card, three-d-folder,
  typewriter-effect
@suraj-xd
  claude-style-ai-input, google-drive-uploader-toast, liquid-glass, quick-tooltip-actions
@syeddhasnainn
  agent-status, approval-card, attachments, audio-player, background-inbox, category-dropdown, citations,
  code-block, color-picker, commit, cost-meter, edit-message, environment-variables, feedback-dialog,
  file-tree, follow-up, follow-up-suggestions, image-generation-loader, inline-citation, message-bubble,
  message-queue, message-scroller, model-picker, permission-grant, prompt-input, quota-banner,
  reasoning-effort, research-report, todo-list, tool-error, video-player
@t01033978876
  abyss, chaos, poppy-delirium, stan
@tahermaxse
  animated-footer, scroll-legend
@tailwind-admin
  animate-table-motion, dot-loader-motion, task-list
@talen-520   sine-wave-dots
@tanusahu9894
  minimal, minimal-2
@tatarlordor   night-shift
@te9nielweb   mounir
@team.marketwise   ok
@techexpertnk.02   robot-human
@tempforall9
  liquid-mosaic, thread-light, thread-paint
@temuulen21mvp
  bennet, kobe, kobe-are-you-ready-to-build-yourself, stairs-to-yourself
@terrae   controls
@thefathdev   win-98-button
@thegridcn
  cta-banner, data-stream, dropdown, energy-meter, grid, terminal, testimonial-card, thegridcn-pagination,
  video-player, waveform
@themeocean
  3d-animated-tilt-dynamic-glow-card, ai-chain-of-thought-reasoning-accordion,
  bento-grid-product-hero-with-live-metric-cards, floating-glassmorphic-navbar-with-morphing-pill-indicator,
  interactive-ai-agent-workflow-node-card, interactive-ai-chat-input-with-micro-interactions,
  interactive-ai-voice-assistant-audio-visualizer, interactive-expandable-notification-stack,
  interactive-tech-stack-bento-grid-with-hover-effects, mac-style-floating-dock,
  minimalist-spotlight-hero-with-kinetic-typography, modern-ai-saa-s-hero-with-interactive-live-preview,
  multi-state-action-button-with-micro-animations, nexus-3d-animated-login-futuristic-authentication-ui,
  sleek-ai-command-menu-cmdk-with-fuzzy-search, split-developer-hero-with-interactive-code-terminal
@themostevildwarf   grain-gradient
@theorcdev
  8bit-accordion, 8bit-advanced1, 8bit-advanced2, 8bit-advanced3, 8bit-alert, 8bit-badge, 8bit-breadcrumb,
  8bit-button, 8bit-carousel, 8bit-chart-area-step, 8bit-checkbox, 8bit-collapsible, 8bit-command, 8bit-cta1,
  8bit-difficulty-select, 8bit-drawer, 8bit-empty, 8bit-enemy-health-display, 8bit-faq1, 8bit-faq2, 8bit-faq3,
  8bit-game-faq1, 8bit-game-over, 8bit-game-progress, 8bit-health-bar, 8bit-hover-card, 8bit-input,
  8bit-input-otp, 8bit-item, 8bit-kbd, 8bit-label, 8bit-loading-screen, 8bit-login-form, 8bit-login-form-2,
  8bit-main-menu, 8bit-mana-bar, 8bit-menubar, 8bit-navigation-menu, 8bit-not-found1, 8bit-pagination,
  8bit-pause-menu, 8bit-progress, 8bit-radio-group, 8bit-resizable, 8bit-scroll-area, 8bit-select,
  8bit-skeleton, 8bit-slider, 8bit-spinner, 8bit-switch, 8bit-table, 8bit-tabs, 8bit-team1, 8bit-team2,
  8bit-textarea, 8bit-timeline2, 8bit-toast, 8bit-toggle, 8bit-toggle-group, 8bit-tooltip, 8bit-xp-bar
@theritikk   luma-spin
@theshanelevine
  approval-card, chat, loading-state, records-table, streaming-text, thinking
@theurabello27   mrx-brain-2
@theutkarshmail
  3-dots-loader, 3d-button, 3d-effect-loader, ai-loader, bluetooth-key, comment-reply, honeycomb-loader,
  lever-switch, rising-ball, slide-glow-button
@thiienu   a-shader
@thyagoresende
  test, test2
@tiam.haghshenas8   barcelona-mosaic
@tiemefgroup   neuro-noise-shader
@tigerabrodi
  input-with-feedback, smart-textbox
@timbrdnik   sweepsy
@timmikeladze
  bar-chart, debris-field, pumpjack, puzzle-cube, wellhead-tree
@tinkerers-labs
  burst, prompt-input
@tkachukkateryna14
  digit-stream, lamp
@tochny   glass-pagination
@tom_4a7b3838
  home-sat, house-cyber
@tom_ui
  animated-checkbox, animated-gradient, bars-spinner, blur-reveal, copy-button, exploding-input,
  fallback-avatar, flow-button, gradient-wave-text, highlighted-text, kbd, label-input, marquee,
  perspective-book, pop-button, qr-code, rich-button, shimmer-text, slide-up-text, special-text, spinner,
  text-marquee, tilt-card, tweet, words-stagger
@tomcronin
  nicoya, nicoya-2
@TomIsLoading
  clip-path-links, kanban, reveal-links, squishy-card, vertical-accordion
@tommyjepsen
  animated-hero, blog-section, blog-section-with-rich-preview, call-to-action, cases-with-infinite-scroll,
  faq-section, feature-section-with-bento-grid, feature-with-advantages, feature-with-image,
  feature-with-image-carousel, feature-with-image-comparison, hero-with-group-of-images-text-and-two-buttons,
  hero-with-image-text-and-two-buttons, hero-with-text-and-two-button, stats-section-with-text, testimonials
@tonyzebastian
  comet-hero, image-loading, image-sphere, image-stack, img-sphere
@tool-ui
  citation, message-draft
@tristanobernardelli   smoke-ring-solar-shader
@trophyso
  achievement-badge, achievement-card, achievement-list, achievement-unlocked, leaderboard-card,
  leaderboard-podium, leaderboard-rankings, points-chart, streak-badge
@tungdang9888
  aircraft-cabin, neon-mosaic
@uiable
  accordion-active-bg, accordion-multiple, alert-action, alert-dialog-small, alert-light-danger,
  alert-outlined-primary, attachment-states, attachment-vertical, block-bento-5, block-coming-soon-1,
  block-content-4, block-feature, block-feature-32, block-hero, block-portfolio-9, block-pricing-18,
  bubble-collapsible, button-animated, button-animated-gradient, button-copy, button-group-input,
  button-group-popover, calendar-basic, calendar-presets, card-tabs, chart-area, chart-example-legend,
  chart-pie, chart-tooltip, checkbox-table, checkbox-todo-list, component-search, content-16,
  date-picker-disabled, dialog-scrollable-content, drawer-sides, empty-background,
  feature-24-milestone-timeline, hero-17, input-badge, input-form, input-otp-alphanumeric,
  input-otp-controlled, item-image, kbd-button, kbd-function-keys, kbd-input-group, label-disabled,
  label-required, list-group-badge, list-group-custom-content, list-group-links, menubar-compact,
  message-attachment, message-header-footer, message-scroller, questionnaire, select-multi, sidebar-5,
  spinner-bars-scale, switch-color-options, tabs-line, text-highlight, toggle-group-animated-toolbar,
  tooltip-status, tree-view, uiable-breadcrumb-icon, uiable-breadcrumb-link, uiable-breadcrumb-page-header,
  uiable-sidebar-1, uiable-skeleton-card, uiable-skeleton-table, uiable-skeleton-text, uiable-sonner-position,
  uiable-spinner-border-warning, uiable-spinner-button, uiable-typography-inline-code,
  uiable-typography-small, welcome-banner
@uicapsule
  ascii-renderer, background-pixel-stars, background-shapes, formation, geometric-orb, gradient-orb,
  infinite-grid, screenshot-capture, voice-dictator
@uilayout.contact
  about-bento, about-section, about-section-1, advanced-stats, arrow-cursor, autoscroll-slider, button-1,
  button-2, button-3, button-4, button-5, button-6, button-7, button-magnetic, buyme-acoffee, card-hover-2,
  chat-form-dropzone, clip-path-image, clipped-image, code-block, conditiongrid, corporate-clippath,
  css-image-stacking, cursor-follower, cursor-gradient, customer-experience, default-swapy,
  delicate-ascii-dots, dot-particles, dots-pattern, faq-tabbed-explorer, feature-bento, feature-hero,
  feature-velocity, flowing-ribbons-effect, framer-carousel, framer-moveable-thumbnails,
  framer-normal-carousel, framer-thumbnail-carousel, framer-thumnbails, gallery-modal-accordion, growth-plans,
  hero-ai-value-proposition, hero-financial, hero-scroll-animation, hero-section, horizontal-scroll,
  image-mask, image-masking, image-mousetrail-without-component, image-reveal, imgpreview-dropzone,
  impact-experience, infinity-brand, linear-card, liquid-weather-glass, mesh-gradient-background2,
  mesh-gradient-background3, motion-number, motion-number-upvotes, multi-accordion, number-flow-trading,
  password-input, password-input-1, password-input-2, pricing, pricing-section, pricing-section-1,
  pricing-section-3, product-packs, progressive-carousel, r3f-blob, scroll-animation, scroll-text-marquee,
  sliding-ease, smooth-scroll, smooth-wavy-canvas, sparkles-title3, sparkles-title4, spotlight-cursor,
  stacking-card, stats-bento, stats-bold, sticky-scroll, swapy-draggable-card, tags-input-2,
  tailwind-image-accordion, testimonial, testimonial-1, testimonial-basic, text-marque, thumbnail-slider,
  tree-code-viewer, vertical-bars, vertical-thumbnail-autostart-slider, vertical-thumbnail-slider
@uionedesign   subh
@uniquesonu
  about-us-section, advanced-file-upload, amazing-button-component, analog-clock-component,
  animated-chip-tab-component, animated-fuzzy-overlay-effect, animated-hero-section, animated-hero-section-ui,
  animated-logo-rolodex, animated-shifting-tab-component, animated-staggered-dropdown,
  animated-svg-background, animated-text-with-staggered-effect, animated-to-do-list, bounce-card-features,
  cuisine-selector-chips, dashboard-activities, dashboard-overview, dashboard-with-collapsible-sidebar,
  data-table-filter, draggable-modal-component, empty-state-beautiful-accessible-no-data-states,
  floating-bubbles-background, futurastic-hero-section, glass-ui, glow-menu,
  hero-section-enterprise-ready-landing-page-hero-with-dual-ctas, hotel-card-ui-component, hover-text-effect,
  interactive-pricing-component, liquid-glass-boxes, loading-indicator, modern-animated-hero-section,
  modern-animated-multi-words, modern-background-paths, modern-hero, modern-hero-section,
  modern-hero-section-1, next-gen-pagination-accessible, otp-input-component, parallax-scrolling-text-effect,
  pixel-art-image-component, radial-animated-doodle, shimmer-button, sidebar, slide-tabs,
  squishy-card-component, suffle-hero, table-controls, text-parallax-content-scroll, unique-loader-components
@univolveit   jelly-fish
@unlumen
  animate-count, animate-digits, aurora-blur, clipped-circle, count-up, cursor, cursor-image-trail,
  expand-menu, floating-tooltip, github-graph, glow, highlight, horizontal-depth-fade, matrix,
  motion-navigation-menu, pixel-liquid-bg, primitives-animate-files, primitives-animate-pinned-list,
  scroll-reveal-image, side-by-side-slide, sidebar-001, tag, unlumen-animated-list,
  unlumen-motion-faqs-accordion, unlumen-orbiting-skills, vertical-marquee, video-ambient
@uploadcn   progress-ring-upload
@uplusion23   color-picker
@urata.junpei
  crab, crab-2
@urmauur
  file-card-collections, folder-components
@user_hardp
  suggestive-search, switch-button, user-avatars
@user_xn1cklas
  news-search, public-stats, qr-code-generator, weather-card
@usopp2324   sa7bi
@utilcn   upload-multiple-files
@uvain
  access-request-inbox, auth-forms-signin-signup, color-picker-hex-swatches, combobox-multi-create,
  command-menu-palette, data-table-bulk-actions, file-upload, folder-card, kanban-board, member-card,
  members-table, notification-panel, otp-input-verification, pastel-testimonial-section, revenue-charts-kpi,
  rich-text-editor-toolbar, share-file-dialog, signature-pad, tree-view-file-browser, web-shot-button
@uvcanvas   xenon-component
@vaib215
  3d-gallery-photography, 3d-orb, adaptive-pricing-section, auth-form, bento-pricing-component, category-list,
  color-change-card, cosmos-3d-orbit-gallery, dark-gradient-pricing, event-manager, expanding-cards, faq-tabs,
  flip-links, flow-hover-button, hero-with-product-mockup, hover-testimonial-card, link-shortner,
  logo-particles, pixeleted-404-not-found, reddit-nested-thread-reply, shuffle-grid, squishy-pricing,
  stack-overflow-q-a-interface, stagger-testimonials, todo-task-management, velocity-text, wet-paint-button
@vamshi1tsipvt   glow
@vamsiy78   segmented-control
@vayslend   arka
@vercel-crawled
  actions, announcement, code-block, controls, conversation, inline-citation, loader, message, question,
  sources, speech-input, suggestion, task
@vgpu
  adaptive-quality, agent-radiance-cascades, air-painting, anti-aliasing, batch-rendering, black-hole,
  clipping, earth, environment-map, fft-ocean, fft-ocean-surface, fluid, glass-fractal, instanced-rendering,
  mnist-classifier, nextjs-flare, optimized-black-hole, particle-orbit, radiance-cascades, raymarched-fractal,
  three-tsl, transmission, triangle-led-front, tsl-exports
@viandwi24   aspect-ratio
@victor-teles
  command-menu, thinking
@victordiazjauregui   aichat-button
@victorwelander
  expandable-tabs, gooey-text-morphing, nested-dialog, upgrade-banner
@vijayksingh
  meter, skeleton, spinner, textarea, weather
@vilqor
  guilloche-rosette, wordmark-footer
@vilseekumar
  caustics-shader, waves-shader
@vinicius.possato   agents-odyssey
@vinny_b0b96136   arch-gallery
@vinnysaivignesh111   b-shader
@vipersan02   halftone
@viterna
  2-gradient, blue-viterna
@vitor.prado.br   asociety
@vitorborsari11   prospect-gltich
@vnantes   shader-state
@vodichka.vldk
  acid-power, dark, reptile-smoke
@vovalopuh13
  cd-lens-reel, cd-steps-path, cd-team-fan, command-palette, db-orbit-goals, envelope-subscribe,
  faq-liquid-accordion, file-drop-physics, live-contact-form, m-a-v-e-n-aurora, notification-matrix,
  photo-review-form, pk-table-floor, pricing-plan-tilt, slot-week-picker, st-appearance-lab,
  testimonial-coverflow
@voxlet-ui
  button-download, flip-coin-button, magic-wand, space-box
@vuong105701   surf-bg-2
@w15020180982   test
@waleedkibhen
  glow-button, gradient-bar-hero-section, gradient-bars-background, image-auto-slider, matrix-code-rain,
  portfolio-hero, profile-card, progressive-blur-card, reading-text-reveal, retro-grid, saa-s-template,
  silk-background-animation, spotlight-button, underline-hero-section
@warren   blue-gold-mesh
@waseefanwar166   vedio-shader
@wasifgee0012   social-links
@wecr8cr8   dd
@wenflen   silk-becker
@wensity
  accordion, animated-hamburger-menu, animated-tabs, attachment, avatar, before-after-card, button,
  button-group, calendar, canvas-text, card, carousel, chart, collapsible, color-picker, command,
  context-menu, count-up-animation, data-table, date-picker, dialog, drawer, dropdown-menu, empty-state,
  field, file-uploader, github-activity-grid, hover-card, infinite-marquee, liquid-multimodal-input, marker,
  native-select, navigation-menu, popover, scroll-area, sidebar, slider, spinner, text-blur-reveal,
  text-char-slide, text-chroma-reveal, text-cycle, text-flip, text-glitch, text-morphing, text-motion,
  text-path, text-ripple, text-scribble, text-shimmer, text-spectrum, text-word-flip, toggle, tooltip,
  underline-animation, voice-aurora-wave
@whyte25
  animated-review-card, floating-elements
@william.rinaldi2008   repeat-start
@willjib12   mes-pour-mes-cartes
@witharc   logo-carousel
@wladusow2000   lawyer
@wlazlo.michal05
  black-red-white, red-black-vanila
@workout_scorpion
  hanzo-alarm-beacon, hanzo-biometric-braille, hanzo-camera-lens, hanzo-cctv-binary, hanzo-ember-bloom,
  hanzo-ember-smoke, hanzo-fire-alarm-code, hanzo-laser-curtain, hanzo-led-matrix, hanzo-network-led-dots,
  hanzo-radar-sweep, hanzo-red-silk, hanzo-secure-shield-hex
@workwithnoro   silk-shader
@wrapcoders   metric-switcher-trend-chart-demo
@wsmit22   willzoshader
@wunder-ui   popover
@xordev
  atc-shader, cathedral, fireflies-1, geode, gigabit, hive, lab, lanterns, launch, neutrino, nucleus,
  phosphor-30, radial-shader, raidal-2, starship-shader
@xubohuah
  aurora-card, bend-text, blur-text-animation, bubble-sketch, entropy, flickering-grid-demo2,
  flickering-grid-hero, flow-button, fluid-swirl-shader, generative-geometry, geometric-blur-mesh,
  ghost-404-page, ghost-404-page-1, layered-text, liquid-radio, neon-rgbtext-effect, particle-text-effect,
  simple-growth-tree, spiral-animation, text-glitch-effect, theme-switch-button, vaporize-animation-text,
  vector-field, vortex, wave-background
@xuweiyao233   ovone
@yadwinder
  bottom-menu, ios-spinner, toast-save, vercel-tabs
@yaleikadigital   footer-wisel
@yaoztorun
  adisyon-shader, istanblue
@yashsehgal   3d-button
@yashvw25   neon-flow
@yingwuyi6l6   particle-title
@yiranwangkk   summerlouver
@yogaprtamaa   seed
@yogesharc   thinking-orbs
@yoriichi680   kkmn
@youcefbnm
  animated-cards-stack, animated-slideshow, animated-toggle-layout-container, animated-video-on-scroll,
  card-curtain-reveal, cards-stack, cta-section-with-gallery, custom-cursor, globe, hero-animated,
  hero-gallery-scroll-animation, hero-video, image-player, parallax, price, product-card, quantity,
  reveal-on-hover, scroll-autoplay, scroll-trigger-animations, scroll-x-carousel, slideshow, story,
  team-section, text-scroll-read, text-stagger-hover, text-wavy, wavy-text-block
@yousuyi111   hands-robots
@yovan   square-wave-loader
@yura
  airlock-spaceship-hero, aurora-credit-card-bento, blackhole-hero-section, carousel-squeeze,
  ghibli-robot-hero, loader-tetris, orbital-hero-section, slot-headline, snake-loader
@yusufceng1z   ding-toast
@zacharywolk05   mesh-drift-shader
@zaiddagamseh   halftone-shader-hop-films
@zanwei
  ball-model-picker, chatgpt-model-selector, claude-model-selector, gradient-shimmer, liquid-connector,
  model-picker, shared-element-transition-dialog, status-indicator, table-of-content
@zarrar1133   my-art
@zelray   fintech-waves
@zendeurr.pro   mosaic-leaf
@zerotherm27-create   mesh-gradient
@zhiyuanlu79   gradient-d02073f9
@ziegfiroyt
  auth30, automation1, automation10, blog25, booking29, browser28, changelog28, cta69, ecommerce11,
  ecommerce15, ecommerce32, ecommerce4, ecommerce46, ecommerce5, error1, error2, error34, error6, error7,
  error8, error9, faq92, feature135, onboarding3, onboarding9, reveal1, reveal2, settings64, terminal1,
  testimonial1
@zochory
  animated-loading-svg-text-shimmer, copy-button-variants, prompt-input-dynamic-grow, toggle-switch-glass
@zweiundeins
  busy, echarts, theme-switch
@zxchecka812   demon
@zzzzshawn
  dotm-circular-12, dotm-circular-18, dotm-circular-20, dotm-circular-7, dotm-circular-8, dotm-square-2,
  dotm-square-4, dotm-triangle-13
```

</details>
