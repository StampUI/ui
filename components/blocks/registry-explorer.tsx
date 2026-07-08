"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Command } from "lucide-react"
import { cx } from "@/lib/cx"
import { RegistryCard } from "./registry-card"
import type { BlockManifest } from "../../types"

export interface RegistryExplorerProps {
  initialBlocks: (BlockManifest & { name?: string; previewThumbnail?: string })[]
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string
  options: string[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={active === option}
            onClick={() => onChange(option)}
            className={cx(
              "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong",
              active === option
                ? "border-border-strong bg-surface-3 text-foreground"
                : "border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:border-border-strong"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export function RegistryExplorer({ initialBlocks }: RegistryExplorerProps) {
  const searchParams = useSearchParams()
  const search = searchParams?.get("q") || ""
  const [activeCategory, setActiveCategory] = React.useState<string>("All")
  const [activeDifficulty, setActiveDifficulty] = React.useState<string>("All")
  const [activeStatus, setActiveStatus] = React.useState<string>("All")


  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(initialBlocks.map((b) => b.category)))],
    [initialBlocks]
  )
  const difficulties = ["All", "beginner", "intermediate", "advanced"]
  const statuses = ["All", "free", "pro", "new"]

  const hasActiveFilters =
    activeCategory !== "All" || activeDifficulty !== "All" || activeStatus !== "All"

  function clearFilters() {
    setActiveCategory("All")
    setActiveDifficulty("All")
    setActiveStatus("All")
  }

  const filteredBlocks = React.useMemo(() => {
    return initialBlocks.filter((block) => {
      const matchesSearch = block.title.toLowerCase().includes(search.toLowerCase()) || 
                            block.slug.toLowerCase().includes(search.toLowerCase()) ||
                            block.description.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = activeCategory === "All" || block.category === activeCategory
      const matchesDifficulty = activeDifficulty === "All" || block.difficulty === activeDifficulty
      const matchesStatus = activeStatus === "All" || block.status === activeStatus

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    })
  }, [initialBlocks, search, activeCategory, activeDifficulty, activeStatus])

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Blocks Registry</h1>
            <span className="text-xs font-mono bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full border border-border">
              {filteredBlocks.length} items
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong rounded-md px-2 py-1"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <FilterGroup label="Category" options={categories} active={activeCategory} onChange={setActiveCategory} />
          <FilterGroup label="Tier" options={statuses} active={activeStatus} onChange={setActiveStatus} />
          <FilterGroup label="Difficulty" options={difficulties} active={activeDifficulty} onChange={setActiveDifficulty} />
        </div>
      </div>
        {filteredBlocks.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBlocks.map((block) => (
              <RegistryCard key={block.slug} block={block} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl">
            <Command className="h-8 w-8 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No blocks found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              We couldn't find any blocks matching your current filters. Try adjusting your search or clearing filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 text-sm text-foreground font-medium underline underline-offset-4 decoration-border-strong hover:decoration-foreground"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
    </div>
  )
}
