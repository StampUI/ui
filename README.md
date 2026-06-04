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

This detects your project setup (Next.js, React, Vite) and writes a `stampui.config.json`.

### 2. Add a component

```bash
pnpm dlx stampui add button
pnpm dlx stampui add data-table
pnpm dlx stampui add token-stream
```

The source file is copied directly into your project. Edit it freely.

### 3. Browse components

```bash
pnpm dlx stampui list
pnpm dlx stampui search <query>
```

Or visit [stampui.com](https://stampui.com) for live previews and docs.

---

## Requirements

- React 18 or 19
- Tailwind CSS v4
- TypeScript (recommended)
- Next.js App Router (recommended) or Vite

---

## Components

All 94 components below are free and open source.

### Primitives
`button` `button-group` `badge` `label` `separator` `kbd`

### Inputs and Forms
`input` `textarea` `password-input` `checkbox` `radio-group` `switch` `slider` `select` `native-select` `combobox` `multi-select` `date-picker` `field` `input-group` `number-stepper` `tag-input` `toggle` `toggle-group` `inline-edit`

### Layout
`card` `aspect-ratio` `scroll-area` `resizable` `collapsible` `accordion` `tabs` `sidebar`

### Overlay
`dialog` `drawer` `sheet` `popover` `tooltip` `hover-card` `context-menu` `dropdown-menu` `alert-dialog` `sonner` `command` `command-box`

### Navigation
`breadcrumb` `menubar` `navigation-menu` `pagination`

### Feedback
`alert` `skeleton` `spinner` `progress` `progress-ring` `status-pulse` `loading-card` `loading-dots` `empty` `empty-state`

### Data Display
`table` `avatar` `avatar-stack` `animated-number` `animated-counter`

### Marketing
`hero-section` `pricing-section` `feature-grid` `stats-strip` `social-proof-bar` `testimonials-wall` `cta-banner` `announcement-bar` `waitlist-section` `faq-accordion` `feature-comparison` `site-footer` `team-grid` `metrics-grid`

### AI and Streaming
`token-stream` `prompt-input` `typing-indicator` `typewriter-text`

### Utilities
`copy-button` `confirm-action` `cookie-consent` `changelog-feed` `gradient-text` `marquee` `error-page` `registry-explorer`

---

## Manual Installation

If you prefer not to use the CLI, each component can be copied manually from [stampui.com](https://stampui.com). Every docs page includes the full source.

---

## Project Structure

```
packages/
  blocks/      Source files for all components and blocks
  cli/         stampui CLI (published as "stampui" on npm)
apps/
  web/         Documentation site at stampui.com
```

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT. See [LICENSE](./LICENSE).
