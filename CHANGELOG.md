# Changelog

Notable changes to the free component set and this repository. Component-level versions live in the block manifests (see [docs/block-manifest.md](./docs/block-manifest.md)).

## 2026-11-07

Fixes that earlier lived only in this repo now ship in `@stampui/blocks` itself, so `npx stampui add` installs them too. The sources here are again byte-identical to the package.

- `command.tsx` follows the WAI-ARIA APG combobox-with-listbox pattern: focus stays on the input, ArrowUp/ArrowDown/Home/End move the active option (reported via `aria-activedescendant`, disabled options skipped, wrapping at the ends), Enter selects it. Option order follows the DOM, so it stays correct while a query filters the list, and pointer hover moves the active option. `CommandList` and `CommandItem` still render without a `Command` root. Test suite restored and extended.
- RTL: logical-direction classes in sidebar, menubar, navigation-menu, scroll-area and pagination. `resizable.tsx` swaps the Left/Right arrow keys under `dir="rtl"` and inverts pointer drags there too. RTL arrow test restored.
- `aria-label`s on icon-only controls: calendar month navigation, command clear-search, collapsed sidebar items and groups.
- `prefers-reduced-motion`: orbit-trail, signal-arc and grid-wave drop their SMIL animations, typewriter-text shows the first word, animated-counter shows the final value (all via `useReducedMotion` from `reveal`, now a registry dependency of those blocks); loading-dots, typing-indicator, status-pulse, marquee, gradient-text and progress-ring use `motion-reduce:` utilities, and marquee hides its duplicate track.
- registry-explorer: category, tier and difficulty filter chips (`aria-pressed`) with a clear-filters control; the empty state resets filters instead of navigating away. Filter tests restored.

## 2026-11-06

Free sources synced with `@stampui/blocks` 2.1.0. The repo now holds 130 free files, exactly what `npx stampui add` installs.

- Every free source supports the dark (default) and light themes from the same tokens. Light is `data-theme="light"` on `<html>`.
- Free charts: bar-list, sparkline, heatmap, meter and combo-chart, sharing the new `chart-palette` util (graphite by default, categorical and accent opt-in via `data-chart`).
- combo-chart no longer imports the Pro chart module, so it installs without a license.
- Free effects (reveal, motion-gate, text-reveal, shimmer-text, count-up, use-entrance) and backgrounds (dot-grid-ripple, grid-pulse, waves).
- New core components: carousel, input-otp, number-input, copy-input, rating, segmented-control, shortcut, color-swatch, loading-bar, reading-progress.
- New blocks: hero-centered, faq-section, newsletter-inline, stat-cards, terminal-block, login-email, signup-simple, forgot-password, and code-block (`components/docs/`, with `lib/highlight.ts`).
- Tooltip works without an app-level TooltipProvider.
- `types.ts`: `BlockManifest` gains `registryDependencies`.
- Preview harness uses the exact CLI theme stylesheet and can switch between dark and light.
- Tooling: `recharts` and `@shikijs/*` added to devDependencies, `eslint-plugin-react-hooks` 7, `lib/use-reduced-motion.ts` removed (Reveal ships `useReducedMotion`).
- A few fixes made only in this repo (command combobox, RTL, filter chips, icon-only `aria-label`s, reduced motion in the small motion blocks) were briefly missing from this sync; they were moved into `@stampui/blocks` and are back as of 2026-11-07.

## Earlier repository work (before 2026-11-06)

- Repository is now self-contained: added `lib/cx.ts` and `types.ts`, which components referenced but which were missing from the public source
- All 94 component and block files typecheck standalone (`npm run typecheck`), enforced by CI; ESLint added alongside it
- Accessibility: added `aria-label`s to icon-only controls that lacked one (calendar nav, command clear-search, sidebar collapse toggle); all animated components now respect `prefers-reduced-motion`; `command.tsx` rewritten to the WAI-ARIA APG combobox-with-listbox pattern with keyboard navigation, covered by a new test suite (vitest + Testing Library)
- RTL: fixed physical-direction CSS in sidebar, menubar, navigation-menu, scroll-area, and pagination; fixed a real keyboard-interaction bug in `resizable.tsx` where Left/Right arrow meaning didn't swap under `dir="rtl"` (WAI-ARIA APG separator pattern)
- Added `examples/` with usage snippets for the 10 most-installed components
- Block manifest spec: resolved the four open RFC questions (integrity, shared-file conflicts, per-file versioning, framework identifiers), see `docs/block-manifest.md`
- Documentation: rewritten README, AGENTS.md (guidelines for AI coding agents), ROADMAP.md, SECURITY.md, block manifest specification (`docs/block-manifest.md`)
- Expanded issue templates (accessibility, documentation, component request, RFC)

## 2026-06-20

- Free block sources synced with the released `@stampui/blocks` 2.x package (copy and comment polish)

## 2026-06-14

- README updated with accurate counts, free block list, MCP server, and the free/pro boundary

## 2026-06-12

- Pro block sources removed from the public repository; the repo now contains only the MIT free set

## 2026-06-04

- Initial public release: free component and block source files under MIT
