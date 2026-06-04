# StampUI

**Production-ready UI blocks for React and Next.js.**  
Own your source code, no wrappers, no black boxes.

[![npm](https://img.shields.io/npm/v/%40stampui%2Fblocks?label=%40stampui%2Fblocks&color=000)](https://www.npmjs.com/package/@stampui/blocks)
[![CLI](https://img.shields.io/npm/v/stampui?label=stampui%20cli&color=000)](https://www.npmjs.com/package/stampui)
[![License](https://img.shields.io/github/license/StampUI/ui?color=000)](./LICENSE)

---

## What is StampUI?

StampUI is an open-source collection of UI components and blocks for React and Next.js. Every component is a real `.tsx` source file that gets stamped directly into your project. You own the code from the moment you add it.

- **No runtime dependency** on StampUI after install
- **Tailwind CSS v4** native, token-based design system
- **Dark and light mode** supported out of the box
- **94 free components** covering primitives, marketing blocks, and AI-native patterns
- **CLI delivery** via `pnpm dlx stampui add <component>`

---

## Quick Start

### 1. Initialize

```bash
pnpm dlx stampui init
```

### 2. Add a component

```bash
pnpm dlx stampui add button
pnpm dlx stampui add data-table
pnpm dlx stampui add token-stream
```

### 3. Browse

```bash
pnpm dlx stampui list
pnpm dlx stampui search <query>
```

---

## Requirements

- React 18 or 19
- Tailwind CSS v4
- TypeScript (recommended)
- Next.js App Router (recommended) or Vite

---

## Components

All 94 components below are free and open source. Click any component to see live preview and docs.

### Primitives
[Button](https://stampui.com/blocks/components/button) · [Button Group](https://stampui.com/blocks/components/button-group) · [Badge](https://stampui.com/blocks/components/badge) · [Label](https://stampui.com/blocks/components/label) · [Separator](https://stampui.com/blocks/components/separator) · [Kbd](https://stampui.com/blocks/components/kbd)

### Inputs and Forms
[Input](https://stampui.com/blocks/components/input) · [Textarea](https://stampui.com/blocks/components/textarea) · [Password Input](https://stampui.com/blocks/components/password-input) · [Checkbox](https://stampui.com/blocks/components/checkbox) · [Radio Group](https://stampui.com/blocks/components/radio-group) · [Switch](https://stampui.com/blocks/components/switch) · [Slider](https://stampui.com/blocks/components/slider) · [Select](https://stampui.com/blocks/components/select) · [Native Select](https://stampui.com/blocks/components/native-select) · [Combobox](https://stampui.com/blocks/components/combobox) · [Multi Select](https://stampui.com/blocks/components/multi-select) · [Date Picker](https://stampui.com/blocks/components/date-picker) · [Field](https://stampui.com/blocks/components/field) · [Input Group](https://stampui.com/blocks/components/input-group) · [Number Stepper](https://stampui.com/blocks/components/number-stepper) · [Tag Input](https://stampui.com/blocks/components/tag-input) · [Toggle](https://stampui.com/blocks/components/toggle) · [Toggle Group](https://stampui.com/blocks/components/toggle-group) · [Inline Edit](https://stampui.com/blocks/components/inline-edit)

### Layout
[Card](https://stampui.com/blocks/components/card) · [Aspect Ratio](https://stampui.com/blocks/components/aspect-ratio) · [Scroll Area](https://stampui.com/blocks/components/scroll-area) · [Resizable](https://stampui.com/blocks/components/resizable) · [Collapsible](https://stampui.com/blocks/components/collapsible) · [Accordion](https://stampui.com/blocks/components/accordion) · [Tabs](https://stampui.com/blocks/components/tabs) · [Sidebar](https://stampui.com/blocks/components/sidebar)

### Overlay
[Dialog](https://stampui.com/blocks/components/dialog) · [Drawer](https://stampui.com/blocks/components/drawer) · [Sheet](https://stampui.com/blocks/components/sheet) · [Popover](https://stampui.com/blocks/components/popover) · [Tooltip](https://stampui.com/blocks/components/tooltip) · [Hover Card](https://stampui.com/blocks/components/hover-card) · [Context Menu](https://stampui.com/blocks/components/context-menu) · [Dropdown Menu](https://stampui.com/blocks/components/dropdown-menu) · [Alert Dialog](https://stampui.com/blocks/components/alert-dialog) · [Sonner](https://stampui.com/blocks/components/sonner) · [Command](https://stampui.com/blocks/components/command) · [Command Box](https://stampui.com/blocks/components/command-box)

### Navigation
[Breadcrumb](https://stampui.com/blocks/components/breadcrumb) · [Menubar](https://stampui.com/blocks/components/menubar) · [Navigation Menu](https://stampui.com/blocks/components/navigation-menu) · [Pagination](https://stampui.com/blocks/components/pagination)

### Feedback
[Alert](https://stampui.com/blocks/components/alert) · [Skeleton](https://stampui.com/blocks/components/skeleton) · [Spinner](https://stampui.com/blocks/components/spinner) · [Progress](https://stampui.com/blocks/components/progress) · [Progress Ring](https://stampui.com/blocks/components/progress-ring) · [Status Pulse](https://stampui.com/blocks/components/status-pulse) · [Empty](https://stampui.com/blocks/components/empty) · [Empty State](https://stampui.com/blocks/components/empty-state)

### Data Display
[Table](https://stampui.com/blocks/components/table) · [Avatar](https://stampui.com/blocks/components/avatar) · [Avatar Stack](https://stampui.com/blocks/components/avatar-stack) · [Animated Number](https://stampui.com/blocks/components/animated-number) · [Animated Counter](https://stampui.com/blocks/components/animated-counter)

### Marketing
[Hero Section](https://stampui.com/blocks/components/hero-section) · [Pricing Section](https://stampui.com/blocks/components/pricing-section) · [Feature Grid](https://stampui.com/blocks/components/feature-grid) · [Stats Strip](https://stampui.com/blocks/components/stats-strip) · [Social Proof Bar](https://stampui.com/blocks/components/social-proof-bar) · [Testimonials Wall](https://stampui.com/blocks/components/testimonials-wall) · [CTA Banner](https://stampui.com/blocks/components/cta-banner) · [Announcement Bar](https://stampui.com/blocks/components/announcement-bar) · [Waitlist Section](https://stampui.com/blocks/components/waitlist-section) · [FAQ Accordion](https://stampui.com/blocks/components/faq-accordion) · [Feature Comparison](https://stampui.com/blocks/components/feature-comparison) · [Site Footer](https://stampui.com/blocks/components/site-footer) · [Team Grid](https://stampui.com/blocks/components/team-grid) · [Metrics Grid](https://stampui.com/blocks/components/metrics-grid)

### AI and Streaming
[Token Stream](https://stampui.com/blocks/components/token-stream) · [Prompt Input](https://stampui.com/blocks/components/prompt-input) · [Typing Indicator](https://stampui.com/blocks/components/typing-indicator) · [Typewriter Text](https://stampui.com/blocks/components/typewriter-text)

### Utilities
[Copy Button](https://stampui.com/blocks/components/copy-button) · [Confirm Action](https://stampui.com/blocks/components/confirm-action) · [Cookie Consent](https://stampui.com/blocks/components/cookie-consent) · [Changelog Feed](https://stampui.com/blocks/components/changelog-feed) · [Gradient Text](https://stampui.com/blocks/components/gradient-text) · [Marquee](https://stampui.com/blocks/components/marquee) · [Error Page](https://stampui.com/blocks/components/error-page) · [Usage Card](https://stampui.com/blocks/components/usage-card) · [Loading Card](https://stampui.com/blocks/components/loading-card) · [Loading Dots](https://stampui.com/blocks/components/loading-dots) · [Signal Arc](https://stampui.com/blocks/components/signal-arc) · [Orbit Trail](https://stampui.com/blocks/components/orbit-trail) · [Grid Wave](https://stampui.com/blocks/components/grid-wave)

---

## Manual Installation

Every component can be copied manually from [stampui.com](https://stampui.com). Each docs page includes the full source.

---

## Project Structure

```
components/
  core/      UI primitives
  blocks/    Composed blocks and marketing sections
```

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT. See [LICENSE](./LICENSE).
