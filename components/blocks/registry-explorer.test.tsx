import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

describe("RegistryExplorer filters", () => {
  it("shows all blocks by default", () => {
    render(<RegistryExplorer initialBlocks={blocks} />)
    expect(screen.getByText("3 items")).toBeTruthy()
  })

  it("filters by tier when a tier chip is pressed", async () => {
    const user = userEvent.setup()
    render(<RegistryExplorer initialBlocks={blocks} />)

    // The "Tier" group has a "pro" chip; pressing it narrows to 1 block.
    const tierGroup = screen.getByText("Tier").parentElement as HTMLElement
    await user.click(within(tierGroup).getByRole("button", { name: "pro" }))

    expect(screen.getByText("1 items")).toBeTruthy()
    expect(within(tierGroup).getByRole("button", { name: "pro" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("filters by category", async () => {
    const user = userEvent.setup()
    render(<RegistryExplorer initialBlocks={blocks} />)

    const categoryGroup = screen.getByText("Category").parentElement as HTMLElement
    await user.click(within(categoryGroup).getByRole("button", { name: "Marketing" }))

    expect(screen.getByText("2 items")).toBeTruthy()
  })

  it("combines filters (Marketing + beginner narrows further than either alone)", async () => {
    const user = userEvent.setup()
    render(<RegistryExplorer initialBlocks={blocks} />)

    const categoryGroup = screen.getByText("Category").parentElement as HTMLElement
    const difficultyGroup = screen.getByText("Difficulty").parentElement as HTMLElement
    await user.click(within(categoryGroup).getByRole("button", { name: "Marketing" }))
    await user.click(within(difficultyGroup).getByRole("button", { name: "advanced" }))

    // Marketing has no advanced block, so the empty state appears.
    expect(screen.getByText("No blocks found")).toBeTruthy()
  })

  it("clear filters resets to all blocks", async () => {
    const user = userEvent.setup()
    render(<RegistryExplorer initialBlocks={blocks} />)

    const tierGroup = screen.getByText("Tier").parentElement as HTMLElement
    await user.click(within(tierGroup).getByRole("button", { name: "pro" }))
    expect(screen.getByText("1 items")).toBeTruthy()

    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(screen.getByText("3 items")).toBeTruthy()
  })

  it("does not show a clear-filters control when no filter is active", () => {
    render(<RegistryExplorer initialBlocks={blocks} />)
    expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull()
  })
})
