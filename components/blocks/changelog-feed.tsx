"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface ChangelogEntry {
  version: string
  date: string
  title: string
  description: string
  tags?: string[]
  type: "feature" | "fix" | "breaking"
}

export interface ChangelogFeedProps {
  entries?: ChangelogEntry[]
  className?: string
}

const TYPE_STYLES: Record<ChangelogEntry["type"], string> = {
  feature: "bg-[#101114] text-[#FAFAFA] border-[#23252A]",
  fix: "bg-[#101114] text-muted-foreground border-[#23252A]",
  breaking: "bg-[#101114] text-muted-foreground border-[#23252A] font-semibold",
}

const TYPE_LABELS: Record<ChangelogEntry["type"], string> = {
  feature: "Feature",
  fix: "Fix",
  breaking: "Breaking",
}

const DEFAULT_ENTRIES: ChangelogEntry[] = [
  {
    version: "v1.4.0",
    date: "May 14, 2025",
    title: "Block registry search",
    description: "Full-text search across all blocks with keyboard navigation and instant previews.",
    tags: ["search", "dx"],
    type: "feature",
  },
  {
    version: "v1.3.2",
    date: "May 8, 2025",
    title: "Fix dark mode flicker on hydration",
    description: "Resolved a flash of unstyled content when the page first loads in dark mode.",
    tags: ["ssr"],
    type: "fix",
  },
  {
    version: "v1.3.0",
    date: "Apr 29, 2025",
    title: "Stamp CLI v2",
    description: "Redesigned CLI with interactive prompts, dry-run mode, and conflict detection.",
    tags: ["cli"],
    type: "breaking",
  },
]

export function ChangelogFeed({
  entries = DEFAULT_ENTRIES,
  className,
}: ChangelogFeedProps) {
  return (
    <section className={cx("w-full py-16 px-6", className)}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-[#FAFAFA] mb-10">
          Changelog
        </h2>

        <div className="relative border-l border-[#23252A] pl-8 flex flex-col gap-10">
          {entries.map((entry, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-[#23252A] border border-[#23252A] ring-4 ring-[#070708]" />

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-medium text-[#FAFAFA] bg-[#101114] border border-[#23252A] px-2 py-0.5 rounded-md">
                  {entry.version}
                </span>
                <span
                  className={cx(
                    "text-xs font-medium border px-2 py-0.5 rounded-md",
                    TYPE_STYLES[entry.type]
                  )}
                >
                  {TYPE_LABELS[entry.type]}
                </span>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
              </div>

              <h3 className="text-base font-semibold text-[#FAFAFA] leading-snug">
                {entry.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {entry.description}
              </p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-muted-foreground bg-[#09090B] border border-[#23252A] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
