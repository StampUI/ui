# Changelog

Notable changes to the free component set and this repository. Component-level versions live in the block manifests (see [docs/block-manifest.md](./docs/block-manifest.md)).

## Unreleased

- Repository is now self-contained: added `lib/cx.ts` and `types.ts`, which components referenced but which were missing from the public source
- All 94 component and block files typecheck standalone (`npm run typecheck`), enforced by CI
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
