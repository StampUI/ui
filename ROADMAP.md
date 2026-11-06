# Roadmap

What we intend to work on in the free, open-source part of StampUI. This is a direction, not a promise of dates. Items move to the issue tracker as they become concrete.

## Recently completed

- **Dark and light themes**: every free source now ships in dark (the default) and light from one token set, switched with `data-theme="light"`.
- **Free charts**: bar list, sparkline, heatmap, meter and combo chart, with a graphite palette by default and categorical and accent palettes as opt-in (`data-chart`).
- **Effects and backgrounds**: reveal, text reveal, shimmer text, count-up, motion gate, and three animated backgrounds, all respecting `prefers-reduced-motion`.
- **Sync with `@stampui/blocks` 2.1.0**: this repo now holds the exact 130 free files the CLI installs.
- **Usage examples and preview harness**: [examples/](./examples) typechecked in CI, rendered by [preview/](./preview) in both themes.
- **CI depth**: typecheck, ESLint and a vitest suite run on every push and PR.
- **Block manifest spec**: the four open RFC questions (integrity, shared-file conflicts, per-file versioning, framework identifiers) are decided; see [Decisions](./docs/block-manifest.md#decisions-2026-07-08).

## Near term

- **Re-land fixes dropped in the 2.1.0 sync**: these were made only in this repo and are not yet in the synced sources. They need to land upstream so the CLI ships them too:
  - `command.tsx` to the WAI-ARIA APG combobox-with-listbox pattern, with its test suite
  - RTL: logical-direction CSS in sidebar, menubar, navigation menu, scroll area and pagination; Left/Right arrow meaning in `resizable.tsx` under `dir="rtl"`
  - `aria-label`s on icon-only controls (calendar navigation, command clear-search, sidebar collapse toggle)
  - `prefers-reduced-motion` in the small motion blocks and marquee
  - registry-explorer filter chips (category, difficulty, tier)
- **Integrity checksums**: implement the decided `sha256-` per-file field in `@stampui/blocks` and the CLI's install path.
- **Shared-file version tracking**: `stampui.lock.json` tracking `registry:ui` files the same way it tracks blocks, which unblocks `stampui diff`.
- **MCP server**: planned, not released yet. It will let MCP clients search and stamp blocks; until then use the CLI and [llms.txt](https://stampui.com/llms.txt).

## Medium term

- **Automated accessibility checks**: axe in CI, in both themes.
- **Monorepo/workspace support** in the CLI: correct path resolution when running from a workspace root.
- **CLI update-conflict handling**: don't silently overwrite locally edited blocks.
- **Disclosure chevron / drawer-sheet direction**: whether collapse carets mirror under RTL, and whether `Sheet`'s `side` prop should be direction-aware.

## Longer term / exploratory

- Visual regression testing for the free set, in dark and light
- Non-TypeScript (plain JS) install target in the CLI

## Not planned for this repo

- Pro blocks and Pages: those live in the Pro catalog at [stampui.com](https://stampui.com/pricing) and fund the work above. The free set here stays MIT and maintained.
