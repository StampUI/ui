"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Check, Command } from "lucide-react"
import { cx } from "@/lib/cx"
import { RegistryCard } from "./registry-card"
import type { BlockManifest } from "../../types"

export interface RegistryExplorerProps {
  initialBlocks: (BlockManifest & { name?: string; previewThumbnail?: string })[]
}

export function RegistryExplorer({ initialBlocks }: RegistryExplorerProps) {
  const searchParams = useSearchParams()
  const search = searchParams?.get("q") || ""
  const [activeCategory, setActiveCategory] = React.useState<string>("All")
  const [activeDifficulty, setActiveDifficulty] = React.useState<string>("All")
  const [activeStatus, setActiveStatus] = React.useState<string>("All")


  const categories = ["All", ...Array.from(new Set(initialBlocks.map(b => b.category)))]
  const difficulties = ["All", "beginner", "intermediate", "advanced"]
  const statuses = ["All", "free", "pro", "new"]

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
            <button 
              onClick={() => {
                window.location.href = "/blocks"
              }}
              className="mt-6 text-sm text-foreground font-medium underline underline-offset-4 decoration-border-strong hover:decoration-foreground"
            >
              Clear all filters
            </button>
          </div>
        )}
    </div>
  )
}
