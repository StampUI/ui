# Guidelines for AI coding agents

StampUI components are designed to be edited, by people and by AI coding tools. Once stamped into a project they are the user's code, and users routinely ask agents to restyle, extend, or refactor them. These rules keep those edits safe and consistent. They apply both to agents editing installed components in a user's project and to agents preparing contributions to this repo.

## Do

- **Preserve named exports.** Every component uses named exports (`export function Button`). Renaming or switching to default exports breaks the documented import paths and the CLI's printed import hints.
- **Use design tokens for color.** Components color themselves through the CSS variable token system (`bg-background`, `bg-card`, `bg-surface-2`, `text-foreground`, `text-muted-foreground`, `border-border`, and status tokens like `danger`, `success`, `warning`). To change a color scheme, change the token values in the project's CSS, not the class names in every component.
- **Use `cx()` for conditional classes.** Import it from `@/lib/cx` (clsx + tailwind-merge). Template-literal class concatenation defeats tailwind-merge and produces conflicting classes.
- **Keep components self-contained.** A component should keep working when copied to another project along with `lib/cx.ts` and its npm dependencies. Don't introduce imports from app-specific modules.
- **Keep the file readable.** These components are meant to be read and owned by their user. Prefer straightforward JSX over clever indirection; keep prop interfaces explicit and exported.

## Avoid

- **Hardcoded hex/rgb colors in `className`.** If a design genuinely needs a new color role, add a token.
- **New runtime dependencies without a reason.** Most visual changes need no new package. Adding one (or a heavier alternative to an existing one) changes the install cost of the block for every future user; do it only when the functionality is impossible otherwise, and mention it prominently.
- **Removing accessibility behavior.** Focus traps, `aria-*` attributes, keyboard handlers, and Radix primitives are load-bearing. Restyle freely, but don't strip semantics to simplify markup.
- **`any` types and `@ts-ignore`.** The whole repo typechecks with `strict: true` (`npm run typecheck`); keep it that way.
- **Editing generated regions of a user's project** such as `stampui.lock.json` version entries; the CLI maintains that file.

## Useful facts

- All components are `"use client"` React function components in TypeScript.
- Styling is Tailwind CSS v4; there is no CSS-in-JS.
- Interactive primitives (dialog, menu, select, tooltip, etc.) wrap Radix UI; look at the Radix docs for behavior questions before reimplementing.
- The machine-readable registry (slugs, versions, files, dependencies per block) is documented in [docs/block-manifest.md](./docs/block-manifest.md) and exposed to MCP clients by [`@stampui/mcp`](https://www.npmjs.com/package/@stampui/mcp).
