# Contributing to StampUI

Thank you for your interest in contributing. This document covers how to report bugs, propose new components, and submit pull requests.

---

## Ways to Contribute

- **Bug reports** — something renders incorrectly or breaks at a certain screen size
- **Fixes** — typos, prop type corrections, accessibility improvements
- **New components** — primitives or utility blocks that fit the design system
- **Documentation** — clearer descriptions, better examples, missing edge cases

---

## Before You Start

Browse [stampui.com](https://stampui.com) to understand the component library and visual system. StampUI is dark-first, token-based, and intentionally minimal. Contributions that deviate from the design system will not be accepted.

Key rules:
- No hardcoded hex values in `className` — use design tokens only (`bg-surface-2`, `text-muted-foreground`, etc.)
- Conditional classNames always use `cx()`, never template literals
- No gradients, glassmorphism, glow effects, or colorful shadows
- Hover states are subtle surface or border shifts only
- All components must be `"use client"` and self-contained

---

## Reporting a Bug

Use the [Bug Report](./.github/ISSUE_TEMPLATE/bug_report.md) template. Include:
- Component name and version
- What you expected vs what happened
- A minimal reproduction (StackBlitz or CodeSandbox link is ideal)

---

## Proposing a New Component

Open a [Feature Request](./.github/ISSUE_TEMPLATE/feature_request.md) before building anything. Proposals that duplicate an existing component or violate the design system will be closed.

A good proposal answers:
- What problem does this solve?
- Why is it not covered by an existing component?
- What does the API look like?

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`
2. Keep changes focused — one component or fix per PR
3. Write a clear description: what changed and why

---

## Code Style

- TypeScript only — no `.js` files
- No `any` types, no `@ts-ignore`
- Named exports only — no default exports
- No comments explaining what the code does — only comments for non-obvious constraints

---

## Commit Messages

Use the imperative form, lowercase, short:

```
fix: button disabled state opacity
add: number-stepper component
update: card shadow tokens
```

---

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
