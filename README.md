# StampUI

**A monochrome UI system for React and Next.js, in dark (the default) and light.**
Source you own: no wrappers, no runtime package.

[![CI](https://github.com/StampUI/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/StampUI/ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40stampui%2Fblocks?label=%40stampui%2Fblocks&color=000)](https://www.npmjs.com/package/@stampui/blocks)
[![CLI](https://img.shields.io/npm/v/stampui?label=stampui%20cli&color=000)](https://www.npmjs.com/package/stampui)
[![License](https://img.shields.io/github/license/StampUI/ui?color=000)](./LICENSE)

---

## What is StampUI?

StampUI is a set of components, charts, effects, backgrounds and blocks for React and Next.js, delivered as plain `.tsx` source. You copy the source into your project with the [CLI](https://www.npmjs.com/package/stampui) and own it from that point on. Start with the free set here, and add Pro blocks and Pages from [stampui.com](https://stampui.com/pricing) when you need complete product screens.

This repository is the complete free set: **130 MIT source files**, exactly what `npx stampui add` installs (synced with `@stampui/blocks` 2.1.0). It typechecks standalone (`npm run typecheck`), so what you read here is what lands in your repo.

- **Dark and light themes** from one token set. Dark is the default; `data-theme="light"` on `<html>` switches every component.
- **Monochrome by design**: one neutral graphite ramp, status colour only where something needs attention.
- **Charts** (bar list, sparkline, heatmap, meter, combo chart) in a graphite palette by default, with categorical and accent palettes as opt-in.
- **Effects and backgrounds**: text reveal, shimmer, count-up, reveal on scroll, and animated canvas backgrounds. All respect `prefers-reduced-motion`.
- **Tailwind CSS v4**, plain CSS variable tokens, no CSS-in-JS.
- **No runtime dependency** on StampUI after install.

## Quick start

```bash
npx stampui init           # writes stampui-theme.css (dark and light tokens) and lib/cx
npx stampui add button
npx stampui add combo-chart
```

Import `stampui-theme.css` after `@import "tailwindcss";` in your entry stylesheet, then import components from your own codebase:

```tsx
import { Button } from "@/components/core/button"
import { ComboChart } from "@/components/core/combo-chart"
```

`add` copies the component and every StampUI file it imports, then prints the npm packages to install with your package manager.

You can also copy a file from this repo by hand: each one needs `lib/cx.ts`, the theme tokens, and the npm packages it imports. Docs, live previews and prop tables are at [stampui.com/docs](https://stampui.com/docs).

**Requirements**: React 18 or 19, Tailwind CSS v4, TypeScript recommended, Next.js App Router or Vite.

## Theme

`npx stampui init` writes the tokens; [preview/src/globals.css](./preview/src/globals.css) carries the same stylesheet if you want to read it here.

- **Dark** is the default and lives on `:root`.
- **Light** lives on `:root[data-theme="light"]` and swaps every token. With next-themes, use `attribute="data-theme"`.
- Components only use token utilities (`bg-card`, `text-muted-foreground`, `border-border-soft`, `bg-success-soft`, ...), so they never need to know which theme is active. There are no `dark:` variants.
- **Chart palettes**: graphite (monochrome) by default. Set `data-chart="categorical"` or `data-chart="accent"` on `<html>`, or pass a chart's `palette` prop, to opt in to colour. The shared logic lives in `components/core/chart-palette.ts`.

To restyle, change token values in your CSS, not class names in every component. Details: [stampui.com/docs/theming](https://stampui.com/docs/theming) and [chart palettes](https://stampui.com/docs/chart-palettes).

## Why source you own?

A component you can't read is a component you can't change. With the source in your repo:

- You fix bugs and change behavior directly, no upstream release needed
- No version upgrade can change your UI without you
- `stampui.lock.json` still records what you installed, so `stampui update` can pull upstream changes when you choose to

## Using StampUI with coding agents

Coding agents work on files in your repository, and a StampUI component is such a file, so an agent can read, restyle and extend it like code you wrote yourself.

- **Predictable conventions**: design tokens only, `cx()` for conditional classes, named exports. See [AGENTS.md](./AGENTS.md).
- **Stable paths**: `components/core/*`, `components/blocks/*`, `components/effects/*`, `components/backgrounds/*`, documented by the block manifest ([docs/block-manifest.md](./docs/block-manifest.md)).
- **Machine-readable docs**: [stampui.com/llms.txt](https://stampui.com/llms.txt).
- **MCP server**: planned, not released yet. Until it ships, use the CLI and llms.txt.

## Accessibility

Interactive primitives (dialogs, menus, selects, tooltips and similar) are built on [Radix UI](https://www.radix-ui.com), which handles focus management, ARIA attributes and keyboard interaction. Text tokens are chosen to pass contrast in both themes. Effects and backgrounds respect `prefers-reduced-motion`.

Not done yet, and tracked rather than claimed:

- A systematic audit of every component against the WAI-ARIA Authoring Practices (including the command palette combobox pattern and accessible names on icon-only controls)
- An RTL audit of layout primitives (sidebar, menubar, navigation menu, resizable)
- `prefers-reduced-motion` for the small motion blocks (orbit trail, signal arc, grid wave, loading dots, typewriter text, animated counter) and marquee
- Automated accessibility checks (axe) in CI

If you hit an accessibility problem, please use the accessibility issue template; those reports are prioritized.

## Free and Pro

Everything in this repository is MIT licensed and stays MIT. StampUI also sells Pro blocks and full Pages at [stampui.com](https://stampui.com/pricing), delivered through a licensed registry (`npx stampui login`). That funds the maintenance of the free set.

- Free components and blocks need no account, and the ones here will stay free.
- Pro source is not in this repository and will not be added to it.
- Not every future component will be free, but the free set stays maintained and useful on its own.

## How this relates to stampui.com

stampui.com is the docs and catalog: live previews, prop tables, theming and chart palette docs, and the Pro catalog. This repository is the source of the free set that the site documents and the CLI installs.

## Repository structure

```
components/
  core/         81 primitives, form controls, overlays, navigation, feedback and charts
  blocks/       38 composed sections: marketing, auth, app and motion
  effects/      5 text, number and entrance effects
  backgrounds/  3 animated backgrounds
  docs/         2 code block components (Shiki highlighting)
lib/
  cx.ts         class utility used by every component (clsx + tailwind-merge)
  highlight.ts  Shiki highlighter used by the code block
types.ts        shared types (BlockManifest and friends)
docs/           block manifest specification
examples/       short usage snippets for commonly installed components
preview/        local Vite harness that renders examples/ in both themes
```

The full list with descriptions is in [components/core/README.md](./components/core/README.md) and [components/blocks/README.md](./components/blocks/README.md).

## Free component index

Everything below is MIT, in this repository, and installable with `npx stampui add <slug>`.

### Primitives
Button · Button Group · Badge · Label · Separator · Kbd · Shortcut · Card · Aspect Ratio · Color Swatch

### Inputs and forms
Input · Textarea · Password Input · Copy Input · Input OTP · Number Input · Number Stepper · Checkbox · Radio Group · Switch · Slider · Rating · Segmented Control · Select · Native Select · Combobox · Multi Select · Date Picker · Calendar · Field · Input Group · Tag Input · Toggle · Toggle Group · Inline Edit

### Layout and navigation
Scroll Area · Resizable · Collapsible · Accordion · Tabs · Carousel · Sidebar · Breadcrumb · Menubar · Navigation Menu · Pagination

### Overlays
Dialog · Alert Dialog · Drawer · Sheet · Popover · Tooltip · Hover Card · Context Menu · Dropdown Menu · Sonner · Command · Command Box

### Feedback
Alert · Skeleton · Spinner · Progress · Loading Bar · Reading Progress · Status Pulse · Empty · Copy Button · Confirm Action · Typing Indicator

### Data display and charts
Table · Avatar · Avatar Stack · Animated Number · Marquee · Bar List · Sparkline · Heatmap · Meter · Combo Chart · Chart Palette · Code Block

### Effects and backgrounds
Reveal · Text Reveal · Shimmer Text · Count Up · Motion Gate · useEntrance · Dot Grid Ripple · Grid Pulse · Waves

### Blocks
Hero Section · Hero Centered · Feature Grid · Feature Comparison · Pricing Section · Stats Strip · Stat Cards · Metrics Grid · Social Proof Bar · Testimonials Wall · Team Grid · FAQ Accordion · FAQ Section · CTA Banner · Newsletter Inline · Waitlist Section · Announcement Bar · Changelog Feed · Site Footer · Cookie Consent · Email Login · Simple Signup · Forgot Password · Empty State · Error Page · Terminal Block · Usage Card · Registry Explorer

Plus small motion blocks (loading card, loading dots, progress ring, orbit trail, signal arc, grid wave, typewriter text, animated counter, gradient text).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the design rules, development setup, and how contributions flow. [ROADMAP.md](./ROADMAP.md) lists where the project is headed; issues labeled `good first issue` are a reasonable starting point.

## License

MIT for everything in this repository. See [LICENSE](./LICENSE).

Pro blocks and Pages at [stampui.com](https://stampui.com/pricing) are licensed separately and are not part of this repository.
