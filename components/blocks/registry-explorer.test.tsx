import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { RegistryExplorer } from "./registry-explorer"
import type { BlockManifest } from "../../types"

// registry-explorer reads the search term from next/navigation's
// useSearchParams; stub it so the component renders outside a Next app.
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}))

function block(partial: Partial<BlockManifest> & Pick<BlockManifest, "slug" | "title" | "category" | "status" | "difficulty">): BlockManifest {
  return {
    description: `${partial.title} description`,
    tags: [],
    version: "1.0.0",
    updatedAt: "2026-06-01",
    frameworks: ["react"],
    dependencies: [],
    files: [],
    tokens: [],
    supportsDarkMode: true,
    supportsLightMode: true,
    promptReady: false,
    ...partial,
  }
}

const blocks: BlockManifest[] = [
  block({ slug: "hero", title: "Hero", category: "Marketing", status: "free", difficulty: "beginner" }),
  block({ slug: "billing", title: "Billing", category: "Dashboard", status: "pro", difficulty: "advanced" }),
  block({ slug: "faq", title: "FAQ", category: "Marketing", status: "new", difficulty: "beginner" }),
]

describe("RegistryExplorer", () => {
  it("shows all blocks by default", () => {
    render(<RegistryExplorer initialBlocks={blocks} />)
    expect(screen.getByText("3 items")).toBeTruthy()
  })
})
