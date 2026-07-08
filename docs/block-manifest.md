# Block manifest specification

Status: **draft, pre-1.0**. The format described here is what the `stampui` CLI, the stampui.com registry, and the `@stampui/mcp` server consume today. It may change before being frozen as v1; changes will be noted in the [CHANGELOG](../CHANGELOG.md). Feedback is welcome via the RFC issue template.

## What a block manifest is

A block manifest is a JSON-compatible record describing one installable unit of UI: a component, a composed block, or a template. It answers, machine-readably:

- what the block is (identity and description)
- which source files make it up and where they go in a target project
- what npm dependencies those files need
- which version is current, so installed copies can be updated
- whether it is freely installable or requires a commercial license

The canonical TypeScript definition ships in the MIT [`@stampui/blocks`](https://www.npmjs.com/package/@stampui/blocks) package and is mirrored in this repo at [`types.ts`](../types.ts) (`BlockManifest`). The full free registry is exported there as `manifests` (a `Record<string, BlockManifest>`) and `blockList`.

## Example

A real free block, as it appears in the registry:

```json
{
  "slug": "faq-accordion",
  "title": "FAQ Accordion",
  "description": "Animated expand/collapse FAQ list with plus/minus icons and optional section heading.",
  "category": "Marketing",
  "tags": ["faq", "accordion", "marketing", "landing"],

  "version": "1.0.0",
  "updatedAt": "2026-05-30",
  "changelog": ["Initial release"],

  "status": "free",

  "difficulty": "beginner",
  "frameworks": ["nextjs", "react", "vite"],
  "dependencies": ["lucide-react"],
  "files": [
    { "path": "components/blocks/faq-accordion.tsx", "type": "block" }
  ],
  "tokens": ["foreground", "muted-foreground", "border"],

  "supportsDarkMode": true,
  "supportsLightMode": true,
  "promptReady": true
}
```

## Fields

### Identity (required)

| Field | Type | Meaning |
|-------|------|---------|
| `slug` | `string` | Unique kebab-case identifier; the argument to `stampui add <slug>` |
| `title` | `string` | Human-readable name |
| `description` | `string` | One or two sentences; used by search and by MCP clients |
| `category` | `string` | Grouping used by `stampui list` (e.g. `UI`, `Marketing`) |
| `tags` | `string[]` | Free-text search keywords |

### Versioning (required except where marked)

| Field | Type | Meaning |
|-------|------|---------|
| `version` | `string` | Semver for this block. `stampui update` compares it with the version recorded in the project's `stampui.lock.json` |
| `updatedAt` | `string` | ISO 8601 date of the last change |
| `minCliVersion` | `string` (optional) | Minimum CLI version required to install correctly |
| `changelog` | `string[]` (optional) | Human-readable change notes |

### Licensing (required)

| Field | Type | Meaning |
|-------|------|---------|
| `status` | `"free" \| "pro" \| "new" \| "locked"` | `free` and `new` install from the public MIT package with no account. `pro` and `locked` require a commercial license; their **source never appears in public manifests or packages**, only their metadata does |
| `licenseRequired` | `boolean` (optional) | Explicit flag for gated blocks |

### Technical (required)

| Field | Type | Meaning |
|-------|------|---------|
| `difficulty` | `"beginner" \| "intermediate" \| "advanced"` | Rough integration effort |
| `frameworks` | `string[]` | Environments the block is verified in (`nextjs`, `react`, `vite`) |
| `dependencies` | `string[]` | npm packages the block's source imports (beyond React itself). The CLI prints an install command for these; it does not install them silently |
| `files` | `BlockFile[]` | The source files that make up the block; see below |
| `tokens` | `string[]` | Design tokens (CSS variables) the block consumes; useful for theming tools |

Each `BlockFile` is:

```ts
interface BlockFile {
  path: string                                      // target path relative to the project root
  type: "block" | "util" | "hook" | "registry:ui"   // role of the file
}
```

`path` doubles as the source location (inside the free package) and the destination (inside the user's project). Paths are always relative; implementations must reject absolute paths and `..` segments when writing files. `registry:ui` marks a shared core primitive that other blocks may also depend on; installers should treat an already-present file of this type as satisfied rather than overwriting it blindly.

### Capabilities and preview (optional)

| Field | Type | Meaning |
|-------|------|---------|
| `supportsDarkMode` / `supportsLightMode` | `boolean` | Theme coverage |
| `promptReady` | `boolean` | The block's doc page provides an AI-prompt description suitable for pasting into a coding agent |
| `previewPath` | `string` (optional) | Relative path to a preview asset |
| `source` | `string` (optional) | Populated at runtime by tooling; never stored in the registry for gated blocks |

## How installation works against a manifest

1. Resolve the slug in the manifest map.
2. If `status` is `free`/`new`: copy each `files[].path` from the public package into the project at the same relative path.
3. If `status` is `pro`/`locked`: request the files from the licensed registry over HTTPS with the user's license key; the server decides access. Public tooling must not attempt to bypass this.
4. Record `{ version, installedAt }` under the slug in `stampui.lock.json`.
5. Surface `dependencies` to the user.

Updates repeat the same flow for blocks whose lock-file version is behind the manifest version, after user confirmation.

## Consuming the manifest from agents and tools

- **npm**: `import { manifests, blockList } from "@stampui/blocks"` gives the full free registry with types.
- **MCP**: [`@stampui/mcp`](https://www.npmjs.com/package/@stampui/mcp) exposes `list_blocks`, `search_blocks`, `get_block`, and `stamp_block` over the Model Context Protocol, so agents can query the same data conversationally.
- **Free vs pro from a tool's perspective**: for `free` blocks, everything including source is public. For `pro` blocks, only the metadata above is visible; tools should show the block exists and how to get a license, nothing more.

## Implementing the format in a third-party registry

Nothing in the format is specific to StampUI's catalog. A third-party registry needs:

1. A manifest map keyed by slug, with the required fields above.
2. A source store where `files[].path` can be resolved (an npm package, a git repo, or an HTTP endpoint).
3. Optionally, an authenticated endpoint for gated content, keyed however you like; the manifest only needs `status` to say that gating exists.

If you implement it, open an RFC issue; interoperability questions (e.g. integrity checksums, which the format does not have yet) are exactly what we want to resolve before freezing v1.

## Known gaps (pre-1.0)

- No integrity/checksum field yet; installers trust the source store
- No per-file version, only per-block
- No declared conflict semantics when two blocks share a `registry:ui` file at different versions
- Framework identifiers are informal strings
