# Roadmap

What we intend to work on in the free, open-source part of StampUI. This is a direction, not a promise of dates. Items move to the issue tracker as they become concrete.

## Recently completed

- **Accessibility audit**: overlay components reviewed against the WAI-ARIA APG. `command.tsx` rewritten to the combobox-with-listbox pattern; icon-only controls that lacked an accessible name got one. See closed issues [#2](https://github.com/StampUI/ui/issues/2), [#3](https://github.com/StampUI/ui/issues/3).
- **Reduced-motion coverage**: every animated component now respects `prefers-reduced-motion`, via the Tailwind `motion-reduce:` variant or `usePrefersReducedMotion()` for RAF/SMIL/timer-driven animation. See [#4](https://github.com/StampUI/ui/issues/4).
- **RTL audit**: fixed physical-direction CSS in sidebar, menubar, navigation-menu, scroll-area, pagination, and a real keyboard-interaction bug in `resizable.tsx`. See [#6](https://github.com/StampUI/ui/issues/6).
- **Usage examples**: 10 short examples in [examples/](./examples), typechecked in CI.
- **Local preview harness**: [preview/](./preview), a Vite app that renders `examples/*.tsx` with the real design tokens. See [#9](https://github.com/StampUI/ui/issues/9).
- **CI depth**: typecheck, ESLint, and a vitest suite now all run on every push and PR.
- **Block manifest spec**: the four open RFC questions (integrity, shared-file conflicts, per-file versioning, framework identifiers) are decided; see [Decisions](./docs/block-manifest.md#decisions-2026-07-08).

## Near term

- **Integrity checksums**: implement the decided `sha256-` per-file field in `@stampui/blocks` and the CLI's install path.
- **Shared-file version tracking**: `stampui.lock.json` tracking `registry:ui` files the same way it tracks blocks, unblocks `stampui diff` (tracked in the [CLI repo](https://github.com/StampUI/cli/issues/1)).
- **registry-explorer.tsx**: finish or remove the half-built category/difficulty/status filter UI ([#10](https://github.com/StampUI/ui/issues/10)).
- **Disclosure chevron / drawer-sheet direction**: design decisions flagged in the RTL audit (whether collapse carets mirror under RTL, whether `Sheet`'s `side` prop should be direction-aware) still need a call.

## Medium term

- **Automated accessibility checks**: axe in CI, building on the manual APG audit.
- **Monorepo/workspace support** in the CLI: correct path resolution when running from a workspace root.
- **CLI update-conflict handling**: don't silently overwrite locally-edited blocks (tracked in the [CLI repo](https://github.com/StampUI/cli/issues/5)).

## Longer term / exploratory

- Visual regression testing for the free set
- Non-TypeScript (plain JS) install target in the CLI

## Not planned for this repo

- Pro/commercial blocks and templates: those live in the commercial catalog at [stampui.com](https://stampui.com) and fund the work above. The free set here stays MIT and maintained.
