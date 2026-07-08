/**
 * The tier of a block. Determines CLI install behavior and registry visibility.
 * - free: Publicly installable by anyone.
 * - pro: Requires a valid StampUI license key.
 * - new: Recently published free block.
 * - locked: Explicitly gated (e.g. not yet released).
 */
export type BlockStatus = "free" | "pro" | "new" | "locked"

/**
 * A single file reference included in a block install.
 */
export interface BlockFile {
  path: string
  type: "block" | "util" | "hook" | "registry:ui"
}

/**
 * The canonical manifest for a StampUI registry block.
 * This is the single source of truth consumed by the CLI, web registry, and preview system.
 */
export interface BlockManifest {
  // --- Identity ---
  slug: string
  title: string
  description: string
  category: string
  tags: string[]

  // --- Versioning ---
  version: string            // semver, e.g. "1.0.0"
  updatedAt: string          // ISO 8601 date, e.g. "2026-05-09"
  minCliVersion?: string     // Minimum CLI version required, e.g. "1.0.0"
  changelog?: string[]       // Human-readable change notes for this version

  // --- Licensing ---
  status: BlockStatus
  licenseRequired?: boolean  // Explicit flag for pro/enterprise blocks

  // --- Technical ---
  difficulty: "beginner" | "intermediate" | "advanced"
  frameworks: string[]
  dependencies: string[]
  files: BlockFile[]
  tokens: string[]

  // --- Capabilities ---
  supportsDarkMode: boolean
  supportsLightMode: boolean
  promptReady: boolean

  // --- Preview ---
  /** Relative path to a local preview asset, e.g. /previews/token-stream.svg */
  previewPath?: string

  /** CLI and Web specific logic, populated at runtime if needed */
  source?: string
}
