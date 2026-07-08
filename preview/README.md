# Local preview harness

A minimal Vite app for contributors to render the [examples/](../examples) live while working on a component. Dev-only; not part of the published component source and not published anywhere.

```bash
cd preview
npm install
npm run dev
```

Opens a page with every file in `examples/` listed in a sidebar; click one to render it. Uses the real dark-mode design tokens (kept in sync with `apps/web/app/globals.css` in the main site, see the comment in `src/globals.css`), so what you see here matches production, useful for the before/after screenshots CONTRIBUTING asks for on visual PRs.

To preview a component that doesn't have an `examples/` file yet, add one first (see [examples/README.md](../examples/README.md)); the harness picks up any file matching `examples/*.tsx` automatically via `import.meta.glob`, no wiring needed.

## Scope

Only renders `examples/*.tsx`, not arbitrary files under `components/`. Some components (`registry-explorer.tsx`, and anything using `next/navigation`) depend on Next.js APIs this harness doesn't provide; write an example that doesn't require them, or extend the harness if you need to preview one of those specifically.

## Build

`npm run build` produces a static `dist/` you can serve to sanity-check the production build resolves cleanly; it's not deployed anywhere.
