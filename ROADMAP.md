# Roadmap

What we intend to work on in the free, open-source part of StampUI. This is a direction, not a promise of dates. Items move to the issue tracker as they become concrete; several already have open issues.

## Near term

- **Accessibility audit**: systematic review of all components against the WAI-ARIA Authoring Practices, starting with overlay components (dialog, drawer, sheet, command). Findings filed and fixed per component.
- **Reduced-motion coverage**: verify every animated component respects `prefers-reduced-motion`.
- **Usage examples**: short, copyable usage snippets for the most-installed components, in this repo rather than only on stampui.com.
- **CI depth**: today CI typechecks all components; add lint and, over time, automated axe checks.

## Medium term

- **Block manifest spec v1**: stabilize and version the open manifest format ([docs/block-manifest.md](./docs/block-manifest.md)) so third-party registries and tools can implement it.
- **`stampui diff`**: show what changed upstream before `update` overwrites local edits (tracked in the [CLI repo](https://github.com/StampUI/cli)).
- **Monorepo/workspace support** in the CLI: correct path resolution when running from a workspace root.
- **RTL audit** for layout primitives.

## Longer term / exploratory

- Component tests (behavioral, not snapshot) for the primitives with the most logic
- Visual regression testing for the free set
- Non-TypeScript (plain JS) install target in the CLI

## Not planned for this repo

- Pro/commercial blocks and templates: those live in the commercial catalog at [stampui.com](https://stampui.com) and fund the work above. The free set here stays MIT and maintained.
