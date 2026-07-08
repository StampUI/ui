# StampUI

**Source-owned UI blocks for React and Next.js.**
Own your source code, no wrappers, no black boxes.

[![CI](https://github.com/StampUI/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/StampUI/ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40stampui%2Fblocks?label=%40stampui%2Fblocks&color=000)](https://www.npmjs.com/package/@stampui/blocks)
[![CLI](https://img.shields.io/npm/v/stampui?label=stampui%20cli&color=000)](https://www.npmjs.com/package/stampui)
[![License](https://img.shields.io/github/license/StampUI/ui?color=000)](./LICENSE)

---

## What is StampUI?

StampUI is a collection of UI components and blocks for React and Next.js, delivered as real `.tsx` source files. Instead of installing a component library as a runtime dependency, you stamp the source into your project with the [CLI](https://github.com/StampUI/cli) and own it from that moment on.

This repository contains the complete free set: **94 MIT-licensed source files** (64 core components, 30 composed blocks), exactly as the CLI installs them. It typechecks standalone (`npm run typecheck`), so what you see here is what lands in your repo.

- **No runtime dependency** on StampUI after install
- **Tailwind CSS v4** native, plain CSS variable token system
- **Dark and light mode** supported, dark-first design
- **CLI delivery** via `npx stampui add <component>`
- **MCP server** so AI editors can browse and install blocks directly

## Quick start

```bash
npx stampui init
npx stampui add button
npx stampui add faq-accordion
```

Then import from your own codebase:

```tsx
import { Button } from "@/components/core/button"
import { FaqAccordion } from "@/components/blocks/faq-accordion"
```

You can also copy any file from this repo by hand; each component is self-contained apart from `lib/cx.ts` and its listed npm dependencies. Every component has a doc page with a live playground and prop table at [stampui.com](https://stampui.com).

**Requirements**: React 18 or 19, Tailwind CSS v4, TypeScript recommended, Next.js App Router or Vite.

## Why source-owned UI?

A component you can't read is a component you can't change. Runtime component libraries make you configure through props and fight through escape hatches; when the abstraction doesn't fit, you're stuck. With source in your repo:

- You fix bugs and change behavior directly, no upstream release needed
- There is no version upgrade that can break your UI without your involvement
- The `stampui.lock.json` written by the CLI still lets you pull upstream updates deliberately (`stampui update`), so copied code isn't a dead end

## Using StampUI with AI coding agents

Source-owned components suit AI-assisted workflows for a plain mechanical reason: coding agents work on files in your repository. A StampUI component is such a file, so Claude Code, Cursor, or Copilot can inspect, refactor, restyle, and extend it exactly like code you wrote yourself, with no opaque package boundary in the way.

- **MCP server**: [`@stampui/mcp`](https://www.npmjs.com/package/@stampui/mcp) exposes `list_blocks`, `search_blocks`, `get_block`, and `stamp_block`, so an agent can discover and install blocks without leaving the editor.
- **Predictable conventions**: every component uses the same patterns (design tokens only, `cx()` for conditional classes, named exports), which keeps agent-made edits consistent. See [AGENTS.md](./AGENTS.md) for editing guidelines aimed at agents.
- **Deterministic structure**: components live at stable paths (`components/core/*`, `components/blocks/*`) that the block manifest documents, so tooling can reason about what is installed. The manifest format is documented in [docs/block-manifest.md](./docs/block-manifest.md).

## Accessibility

Current state, honestly: interactive primitives (dialogs, menus, selects, tooltips, and similar) are built on [Radix UI](https://www.radix-ui.com) primitives, which handle focus management, ARIA attributes, and keyboard interaction. Custom components target readable contrast in both themes and subtle motion.

Not yet done, and tracked as open issues rather than claimed:

- A systematic audit of all components against the WAI-ARIA Authoring Practices
- Verified `prefers-reduced-motion` coverage for every animated component
- Automated accessibility checks (axe) in CI
- An RTL support audit for layout primitives

If you hit an accessibility problem, please use the accessibility issue template; these reports are prioritized.

## Open source vs Pro

Everything in this repository is MIT licensed and stays MIT. StampUI also has a commercial catalog: pro blocks and full-page templates sold at [stampui.com](https://stampui.com), delivered through a licensed registry. That commercial side is what funds the maintenance of this free core.

The boundary, stated plainly:

- The free components and blocks in this repo are MIT and will remain free.
- Pro/commercial source is not in this repo and will not be added to it.
- We don't promise that every future component or template will be open source; we do promise the existing free surface stays free, maintained, and complete enough to be useful on its own rather than a demo of the paid product.

## How this relates to stampui.com

stampui.com is the documentation and catalog site: live previews, prop tables, playgrounds, and the commercial templates. This repo is the source of the free set that the site documents and the CLI installs. Bug fixes and improvements to free components land here.

## Compared to shadcn/ui

shadcn/ui established copy-source distribution for React components, and StampUI deliberately follows the same philosophy; if you use shadcn happily, you don't need StampUI. The differences are emphasis:

- An opinionated, dark-first monochrome design system out of the box, rather than a neutral base to theme
- Composed blocks and full-page structures, not only primitives
- A lock file and `stampui update` flow, so installed code has an upgrade path
- MCP-first distribution for AI editors

## Repository structure

```
components/
  core/      64 primitives and small components (MIT)
  blocks/    30 composed sections and blocks (MIT)
lib/
  cx.ts      class utility used by all components (clsx + tailwind-merge)
types.ts     shared types (BlockManifest and friends)
docs/        block manifest specification
```

## Free component index

Everything below is MIT, in this repository, and installable by slug with `npx stampui add <slug>`.

### Primitives
[Button](https://stampui.com/blocks/components/button) · [Button Group](https://stampui.com/blocks/components/button-group) · [Badge](https://stampui.com/blocks/components/badge) · [Label](https://stampui.com/blocks/components/label) · [Separator](https://stampui.com/blocks/components/separator) · [Kbd](https://stampui.com/blocks/components/kbd)

### Inputs and Forms
[Input](https://stampui.com/blocks/components/input) · [Textarea](https://stampui.com/blocks/components/textarea) · [Password Input](https://stampui.com/blocks/components/password-input) · [Checkbox](https://stampui.com/blocks/components/checkbox) · [Radio Group](https://stampui.com/blocks/components/radio-group) · [Switch](https://stampui.com/blocks/components/switch) · [Slider](https://stampui.com/blocks/components/slider) · [Select](https://stampui.com/blocks/components/select) · [Native Select](https://stampui.com/blocks/components/native-select) · [Combobox](https://stampui.com/blocks/components/combobox) · [Multi Select](https://stampui.com/blocks/components/multi-select) · [Date Picker](https://stampui.com/blocks/components/date-picker) · [Field](https://stampui.com/blocks/components/field) · [Input Group](https://stampui.com/blocks/components/input-group) · [Number Stepper](https://stampui.com/blocks/components/number-stepper) · [Tag Input](https://stampui.com/blocks/components/tag-input) · [Toggle](https://stampui.com/blocks/components/toggle) · [Toggle Group](https://stampui.com/blocks/components/toggle-group) · [Inline Edit](https://stampui.com/blocks/components/inline-edit)

### Layout
[Card](https://stampui.com/blocks/components/card) · [Aspect Ratio](https://stampui.com/blocks/components/aspect-ratio) · [Scroll Area](https://stampui.com/blocks/components/scroll-area) · [Resizable](https://stampui.com/blocks/components/resizable) · [Collapsible](https://stampui.com/blocks/components/collapsible) · [Accordion](https://stampui.com/blocks/components/accordion) · [Tabs](https://stampui.com/blocks/components/tabs) · [Sidebar](https://stampui.com/blocks/components/sidebar)

### Overlay
[Dialog](https://stampui.com/blocks/components/dialog) · [Drawer](https://stampui.com/blocks/components/drawer) · [Sheet](https://stampui.com/blocks/components/sheet) · [Popover](https://stampui.com/blocks/components/popover) · [Tooltip](https://stampui.com/blocks/components/tooltip) · [Hover Card](https://stampui.com/blocks/components/hover-card) · [Context Menu](https://stampui.com/blocks/components/context-menu) · [Dropdown Menu](https://stampui.com/blocks/components/dropdown-menu) · [Alert Dialog](https://stampui.com/blocks/components/alert-dialog) · [Sonner](https://stampui.com/blocks/components/sonner) · [Command](https://stampui.com/blocks/components/command) · [Command Box](https://stampui.com/blocks/components/command-box)

### Navigation
[Breadcrumb](https://stampui.com/blocks/components/breadcrumb) · [Menubar](https://stampui.com/blocks/components/menubar) · [Navigation Menu](https://stampui.com/blocks/components/navigation-menu) · [Pagination](https://stampui.com/blocks/components/pagination) · [Calendar](https://stampui.com/blocks/components/calendar)

### Feedback
[Alert](https://stampui.com/blocks/components/alert) · [Skeleton](https://stampui.com/blocks/components/skeleton) · [Spinner](https://stampui.com/blocks/components/spinner) · [Progress](https://stampui.com/blocks/components/progress) · [Progress Ring](https://stampui.com/blocks/components/progress-ring) · [Status Pulse](https://stampui.com/blocks/components/status-pulse) · [Empty](https://stampui.com/blocks/components/empty) · [Empty State](https://stampui.com/blocks/components/empty-state) · [Copy Button](https://stampui.com/blocks/components/copy-button) · [Confirm Action](https://stampui.com/blocks/components/confirm-action) · [Typing Indicator](https://stampui.com/blocks/components/typing-indicator)

### Data Display
[Table](https://stampui.com/blocks/components/table) · [Avatar](https://stampui.com/blocks/components/avatar) · [Avatar Stack](https://stampui.com/blocks/components/avatar-stack) · [Animated Number](https://stampui.com/blocks/components/animated-number) · [Animated Counter](https://stampui.com/blocks/components/animated-counter) · [Heatmap](https://stampui.com/blocks/components/heatmap)

### Marketing
[Hero Section](https://stampui.com/blocks/components/hero-section) · [Pricing Section](https://stampui.com/blocks/components/pricing-section) · [Feature Grid](https://stampui.com/blocks/components/feature-grid) · [Stats Strip](https://stampui.com/blocks/components/stats-strip) · [Marquee](https://stampui.com/blocks/components/marquee)

### Free Blocks
[Announcement Bar](https://stampui.com/blocks/piece/announcement-bar) · [Changelog Feed](https://stampui.com/blocks/piece/changelog-feed) · [Cookie Consent](https://stampui.com/blocks/piece/cookie-consent) · [CTA Banner](https://stampui.com/blocks/piece/cta-banner) · [Empty State](https://stampui.com/blocks/piece/empty-state) · [FAQ Accordion](https://stampui.com/blocks/piece/faq-accordion) · [Feature Comparison](https://stampui.com/blocks/piece/feature-comparison) · [Gradient Text](https://stampui.com/blocks/piece/gradient-text) · [Metrics Grid](https://stampui.com/blocks/piece/metrics-grid) · [Site Footer](https://stampui.com/blocks/piece/site-footer) · [Social Proof Bar](https://stampui.com/blocks/piece/social-proof-bar) · [Team Grid](https://stampui.com/blocks/piece/team-grid) · [Testimonials Wall](https://stampui.com/blocks/piece/testimonials-wall) · [Waitlist Section](https://stampui.com/blocks/piece/waitlist-section)

Plus utility and showcase blocks in [`components/blocks/`](./components/blocks) (loading states, animated text, registry explorer, and more).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the design rules, development setup, and how contributions flow. The [ROADMAP.md](./ROADMAP.md) lists where the project is headed; issues labeled `good first issue` are a reasonable starting point.

## License

MIT for everything in this repository. See [LICENSE](./LICENSE).

Pro blocks and templates at [stampui.com](https://stampui.com/pricing) are licensed separately and are not part of this repository.
