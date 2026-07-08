# Changelog

Notable changes to the free component set and this repository. Component-level versions live in the block manifests (see [docs/block-manifest.md](./docs/block-manifest.md)).

## Unreleased

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
