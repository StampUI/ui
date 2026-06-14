# StampUI

**Production-ready UI blocks for React and Next.js.**
Own your source code, no wrappers, no black boxes.

[![npm](https://img.shields.io/npm/v/%40stampui%2Fblocks?label=%40stampui%2Fblocks&color=000)](https://www.npmjs.com/package/@stampui/blocks)
[![CLI](https://img.shields.io/npm/v/stampui?label=stampui%20cli&color=000)](https://www.npmjs.com/package/stampui)
[![License](https://img.shields.io/github/license/StampUI/ui?color=000)](./LICENSE)

---

## What is StampUI?

StampUI is an open-source collection of UI components and blocks for React and Next.js. Every component is a real `.tsx` source file that gets stamped directly into your project via CLI. You own the code from the moment you add it.

- **No runtime dependency** on StampUI after install
- **Tailwind CSS v4** native, plain CSS variable token system
- **Dark and light mode** supported, dark-first design
- **65 free core components** plus 14 free blocks open source under MIT
- **CLI delivery** via `pnpm dlx stampui add <component>`
- **MCP server** for Cursor, Claude Code, and other AI editors

> **Pro blocks and full-page templates** (100+ blocks, 30 templates) are available at [stampui.com](https://stampui.com) under a commercial license. See [pricing](https://stampui.com/pricing).

---

## Quick Start

### 1. Initialize

```bash
pnpm dlx stampui init
```

### 2. Add a component

```bash
pnpm dlx stampui add button
pnpm dlx stampui add sidebar
```

### 3. Browse available components

```bash
pnpm dlx stampui list --free
pnpm dlx stampui search <query>
```

---

## MCP Server (AI editors)

Use StampUI inside Cursor or Claude Code with the MCP server:

```json
{
  "mcpServers": {
    "stampui": {
      "command": "npx",
      "args": ["-y", "@stampui/mcp"]
    }
  }
}
```

The agent can then `list_blocks`, `search_blocks`, and `stamp_block` directly from your editor.

---

## Requirements

- React 18 or 19
- Tailwind CSS v4
- TypeScript (recommended)
- Next.js App Router (recommended) or Vite

---

## Free Core Components

All 65 components below are free and open source under MIT.

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
[Table](https://stampui.com/blocks/components/table) · [Avatar](https://stampui.com/blocks/components/avatar) · [Avatar Stack](https://stampui.com/blocks/components/avatar-stack) · [Animated Number](https://stampui.com/blocks/components/animated-number) · [Animated Counter](https://stampui.com/blocks/components/animated-counter) · [Heatmap](https://stampui.com/blocks/components/heatmap)

### Navigation Utilities
[Calendar](https://stampui.com/blocks/components/calendar)

### Marketing
[Hero Section](https://stampui.com/blocks/components/hero-section) · [Pricing Section](https://stampui.com/blocks/components/pricing-section) · [Feature Grid](https://stampui.com/blocks/components/feature-grid) · [Stats Strip](https://stampui.com/blocks/components/stats-strip) · [Marquee](https://stampui.com/blocks/components/marquee)

### Feedback and Status
[Copy Button](https://stampui.com/blocks/components/copy-button) · [Confirm Action](https://stampui.com/blocks/components/confirm-action) · [Typing Indicator](https://stampui.com/blocks/components/typing-indicator)

---

## Free Blocks

14 composed blocks are free and open source. Each one is a self-contained section ready to stamp.

[Announcement Bar](https://stampui.com/blocks/piece/announcement-bar) · [Changelog Feed](https://stampui.com/blocks/piece/changelog-feed) · [Cookie Consent](https://stampui.com/blocks/piece/cookie-consent) · [CTA Banner](https://stampui.com/blocks/piece/cta-banner) · [Empty State](https://stampui.com/blocks/piece/empty-state) · [FAQ Accordion](https://stampui.com/blocks/piece/faq-accordion) · [Feature Comparison](https://stampui.com/blocks/piece/feature-comparison) · [Gradient Text](https://stampui.com/blocks/piece/gradient-text) · [Metrics Grid](https://stampui.com/blocks/piece/metrics-grid) · [Site Footer](https://stampui.com/blocks/piece/site-footer) · [Social Proof Bar](https://stampui.com/blocks/piece/social-proof-bar) · [Team Grid](https://stampui.com/blocks/piece/team-grid) · [Testimonials Wall](https://stampui.com/blocks/piece/testimonials-wall) · [Waitlist Section](https://stampui.com/blocks/piece/waitlist-section)

---

## Pro Blocks and Templates

100+ additional blocks and 30 full-page templates are available under a commercial license. They cover:

- **Dashboards** (analytics, usage, home, KPIs)
- **Billing and subscription** (plan selection, invoices, upgrade flows)
- **Authentication** (login, multi-step signup, MFA, recovery)
- **Settings** (profile, notifications, security, integrations, danger zone)
- **API and developer tools** (key management, rate limits, portal)
- **Team and org management** (member list, roles, invites)

See the full catalog at [stampui.com/blocks](https://stampui.com/blocks) and [pricing](https://stampui.com/pricing).

---

## Installation (manual)

Every component can be copied manually from [stampui.com](https://stampui.com). Each doc page includes the full source, a live playground, and a prop table.

---

## Project Structure

```
components/
  core/      UI primitives (65 free, 25 pro)
  blocks/    Composed blocks (14 free, 100+ pro)
```

---

## License

MIT for all components and blocks in this repository. See [LICENSE](./LICENSE).

Pro blocks and templates available at [stampui.com/pricing](https://stampui.com/pricing) are licensed separately.
