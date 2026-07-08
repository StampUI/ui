import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cx } from "@/lib/cx"

const itemClass = cx(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  "h-9 min-w-9 px-2 border border-border",
  "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  "disabled:pointer-events-none disabled:opacity-40",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
)

const activeClass = "bg-foreground text-background border-foreground hover:bg-foreground hover:text-background"

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  className?: string
}

function getPages(page: number, total: number, sibling: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const left = Math.max(2, page - sibling)
  const right = Math.min(total - 1, page + sibling)
  const pages: (number | "…")[] = [1]
  if (left > 2) pages.push("…")
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push("…")
  pages.push(total)
  return pages
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  const pages = getPages(page, totalPages, siblingCount)

  return (
    <nav role="navigation" aria-label="Pagination" className={cx("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange?.(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={itemClass}
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className={cx(itemClass, "cursor-default border-transparent")}>
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange?.(p as number)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cx(itemClass, p === page && activeClass)}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange?.(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={itemClass}
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </nav>
  )
}
