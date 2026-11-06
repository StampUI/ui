# Local preview harness

A minimal Vite app for contributors to render the [examples/](../examples) live while working on a component. Dev-only; not part of the published component source and not published anywhere.

```bash
cd preview
npm install
npm run dev
```

Opens a page with every file in `examples/` listed in a sidebar; click one to render it. Uses the real design tokens: `src/globals.css` carries the exact stylesheet `npx stampui init` writes, so what you see here matches an installed project. A theme switch in the sidebar flips between dark (the default) and light (`data-theme="light"`), useful for the before/after screenshots CONTRIBUTING asks for on visual PRs.

To preview a component that doesn't have an `examples/` file yet, add one first (see [examples/README.md](../examples/README.md)); the harness picks up any file matching `examples/*.tsx` automatically via `import.meta.glob`, no wiring needed.

## Scope

Only renders `examples/*.tsx`, not arbitrary files under `components/`. Some components depend on Next.js APIs this harness doesn't provide (`registry-explorer.tsx` uses `next/navigation`, `hero-centered.tsx` uses `next/link`, and `components/docs/code-block.tsx` is an async server component); write an example that doesn't require them, or extend the harness if you need to preview one of those specifically.

## Build

`npm run build` produces a static `dist/` you can serve to sanity-check the production build resolves cleanly; it's not deployed anywhere.
