# Contributing to StampUI

Thank you for your interest in contributing. This document covers how the repos relate, how to set up locally, and what we expect in issues and pull requests.

## How the repos relate (read this first)

StampUI includes a public MIT open-source core and a commercial catalog:

- **This repo (`StampUI/ui`)**: the free MIT components and blocks, exactly as the CLI installs them.
- **[`StampUI/cli`](https://github.com/StampUI/cli)**: the CLI, MIT, developed in the open.
- **Commercial catalog**: pro blocks and templates sold at [stampui.com](https://stampui.com). They live outside the public repos and fund the maintenance of the free core.

Contributions to the public repos should only target the MIT open-source surface. Do not submit PRs that include paid/pro source code, private registry data, license-gated files, or commercial catalog content. If your PR reimplements something that exists in the pro catalog, that's fine as long as it is your own work; what we can't accept is copied pro source.

The maintainer also develops against an internal monorepo that contains the commercial side. Changes merged here are upstreamed there by the maintainer before any sync back, so **merged community PRs are not overwritten** and your authorship stays in the git history and [CONTRIBUTORS.md](./CONTRIBUTORS.md).

## Development setup

The repo is self-contained and typechecks standalone:

```bash
git clone https://github.com/StampUI/ui
cd ui
npm install
npm run typecheck
```

There is no preview app in this repo yet. To see a component render, drop it into any Next.js or Vite project with Tailwind CSS v4 (or a fresh `npx stampui init` project) along with `lib/cx.ts`. Every component's live playground is on [stampui.com](https://stampui.com). A local preview harness is on the roadmap.

## Ways to contribute

- **Bug reports**: something renders incorrectly or breaks at a certain screen size
- **Accessibility issues and fixes**: these are prioritized; use the accessibility template
- **Fixes**: typos, prop type corrections, behavior bugs
- **New components**: primitives or blocks that fit the design system (propose first, see below)
- **Documentation**: usage examples, clearer descriptions, edge cases

## Design system rules

StampUI is dark-first, token-based, and intentionally minimal. Browse [stampui.com](https://stampui.com) to understand the visual system before contributing. Contributions that deviate from it will not be accepted.

- No hardcoded hex values in `className`; use design tokens only (`bg-surface-2`, `text-muted-foreground`, etc.)
- Conditional classNames always use `cx()` from `@/lib/cx`, never template literals
- No gradients, glassmorphism, glow effects, or colorful shadows
- Hover states are subtle surface or border shifts only
- All components are `"use client"` and self-contained

## TypeScript expectations

- `strict` mode; `npm run typecheck` must pass (CI enforces this)
- No `any` in exported props or interfaces, no `@ts-ignore`
- Named exports only, no default exports
- Explicit, exported prop interfaces

## Accessibility expectations

- Don't remove ARIA attributes, focus management, or keyboard handlers to simplify markup
- Interactive elements must be reachable and operable by keyboard
- Icon-only controls need an accessible name (`aria-label` or visually hidden text)
- Animations should respect `prefers-reduced-motion`. Two mechanisms depending on how the animation is built:
  - CSS via Tailwind utility classes (`animate-bounce`, `animate-pulse`, arbitrary `animate-[...]`): add the `motion-reduce:animate-none` variant. No JS needed.
  - RAF loops, SVG SMIL (`<animate>`, `<animateTransform>`), or JS timers: use `usePrefersReducedMotion()` from `lib/use-reduced-motion.ts`.
  - Policy: purely decorative/ambient loops (orbit-trail, marquee, gradient pans, cursor blinks) stop entirely. Status/feedback indicators (typing dots, status pulse, loading spinners) keep the shape visible but stop moving, since removing them would remove information. Value-driven tweens (animated numbers, progress rings) jump straight to the final value instead of easing.
- If you're fixing an a11y issue, say which WAI-ARIA pattern or WCAG criterion it addresses if you know it; if you don't, describe the observed problem and we'll map it

## Submitting a pull request

1. Fork and branch from `main`
2. Keep changes focused: one component or fix per PR
3. `npm run typecheck` passes
4. **Visual changes include before/after screenshots** (dark mode at minimum; light mode too if the component supports it)
5. Describe what changed and why; link the issue if one exists
6. Update usage docs/examples if the public API of a component changed

Review process: the maintainer reviews PRs, usually within a few days. Small fixes merge quickly; new components go through the proposal discussion first. CI must be green before merge.

## Proposing a new component

Open a [component request](./.github/ISSUE_TEMPLATE/component_request.md) before building anything. A good proposal answers:

- What problem does this solve?
- Why is it not covered by an existing component?
- What does the API look like (props sketch)?

Check the [free component index](./README.md#free-component-index) and the [stampui.com catalog](https://stampui.com/blocks) first: proposals that duplicate an existing free component will be closed, and if the idea overlaps a pro block we'll say so in the issue up front rather than after you've built it.

## Commit messages

Imperative, lowercase, short:

```
fix: button disabled state opacity
add: number-stepper component
docs: usage examples for dialog
```

## Code of conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
