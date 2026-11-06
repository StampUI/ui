"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { CHART_IDENTITY, chartPaletteAttr, type ChartPalette } from "@/components/core/chart-palette"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BarListItem {
  /** Row label, e.g. a page path, a traffic source or a customer name. */
  name: string
  /** Numeric value that sets the bar length and the right-aligned figure. */
  value: number
  /** Stable key. Defaults to `name`. */
  key?: string
  /** Optional leading icon or favicon (16px works best). */
  icon?: React.ReactNode
  /** Makes the whole row a link. */
  href?: string
  /** Secondary figure shown before the value (overrides the computed share). */
  secondary?: string
}

export interface BarListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Rows to render. */
  data: BarListItem[]
  /** Formats the right-aligned value. Defaults to `toLocaleString("en-US")`. */
  valueFormatter?: (value: number) => string
  /** Row order. `"none"` keeps the input order. */
  sortOrder?: "descending" | "ascending" | "none"
  /** Show each row's share of the total as a secondary figure. */
  showShare?: boolean
  /** Rows visible before the "Show all" toggle appears. */
  limit?: number
  /** Optional column header for the label column, e.g. "Page". */
  nameLabel?: string
  /** Optional column header for the value column, e.g. "Visitors". */
  valueLabel?: string
  /** Called when a row is activated. Makes every row a button (unless it has an `href`). */
  onSelect?: (item: BarListItem, index: number) => void
  /** Accessible name for the list. */
  label?: string
  /** Chart palette for this list. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultFormatter = (value: number) => value.toLocaleString("en-US")

// One series, the panel's subject: --chart-1 at one flat low opacity, so the
// label on top keeps full text contrast in both themes.
const BAR_FILL = CHART_IDENTITY[0]

function formatShare(share: number) {
  if (share > 0 && share < 0.01) return "<1%"
  const pct = share * 100
  return `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`
}

// ── BarList ───────────────────────────────────────────────────────────────────

/**
 * Ranked rows where each row carries a horizontal bar behind its label.
 * Use it for top pages, traffic sources, top customers: any ranking where
 * the label matters as much as the number.
 */
export function BarList({
  data,
  valueFormatter = defaultFormatter,
  sortOrder = "descending",
  showShare = false,
  limit,
  nameLabel,
  valueLabel,
  onSelect,
  label,
  palette,
  className,
  ...props
}: BarListProps) {
  const [expanded, setExpanded] = React.useState(false)
  const listId = React.useId()

  const sorted = React.useMemo(() => {
    if (sortOrder === "none") return data
    const copy = [...data]
    copy.sort((a, b) => (sortOrder === "descending" ? b.value - a.value : a.value - b.value))
    return copy
  }, [data, sortOrder])

  const max = Math.max(0, ...sorted.map((d) => d.value))
  const total = sorted.reduce((sum, d) => sum + Math.max(0, d.value), 0)
  const canCollapse = limit !== undefined && sorted.length > limit
  const visible = canCollapse && !expanded ? sorted.slice(0, limit) : sorted

  return (
    <div {...chartPaletteAttr(palette)} className={cx("w-full min-w-0", className)} {...props}>
      {(nameLabel || valueLabel) && (
        <div className="mb-1.5 flex items-center justify-between gap-4 pl-2 text-xs text-muted-foreground-soft" aria-hidden>
          <span>{nameLabel}</span>
          <span>{valueLabel}</span>
        </div>
      )}

      <ul id={listId} role="list" aria-label={label} className="space-y-1">
        {visible.map((item, index) => {
          const width = max > 0 ? Math.max(0, item.value) / max : 0
          const secondary = item.secondary ?? (showShare && total > 0 ? formatShare(Math.max(0, item.value) / total) : undefined)
          const formatted = valueFormatter(item.value)
          const accessibleName = `${item.name}, ${formatted}${secondary ? `, ${secondary}` : ""}`
          const interactive = Boolean(item.href || onSelect)

          const content = (
            <>
              <div className="relative flex h-8 min-w-0 flex-1 items-center">
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-md opacity-30 transition-[width] duration-200 ease-out motion-reduce:transition-none"
                  style={{ width: `${width * 100}%`, minWidth: item.value > 0 ? 2 : 0, backgroundColor: BAR_FILL }}
                />
                <span className="relative flex min-w-0 items-center gap-2 px-2">
                  {item.icon && (
                    <span aria-hidden className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate text-sm text-foreground">{item.name}</span>
                </span>
              </div>
              <span aria-hidden className="flex shrink-0 items-baseline justify-end gap-3 pl-2 tabular-nums">
                {secondary && <span className="w-11 text-right text-xs text-muted-foreground-soft">{secondary}</span>}
                <span className="min-w-12 text-right text-sm font-medium text-foreground-soft transition-colors duration-150 ease-out group-hover:text-foreground">
                  {formatted}
                </span>
              </span>
            </>
          )

          const rowClass = cx(
            "group flex w-full min-w-0 items-center gap-2 rounded-md text-left",
            interactive &&
              "cursor-pointer outline-none transition-colors duration-150 ease-out hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none",
          )

          return (
            <li key={item.key ?? item.name}>
              {item.href ? (
                <a
                  href={item.href}
                  aria-label={accessibleName}
                  className={rowClass}
                  onClick={onSelect ? () => onSelect(item, index) : undefined}
                >
                  {content}
                </a>
              ) : onSelect ? (
                <button type="button" aria-label={accessibleName} className={rowClass} onClick={() => onSelect(item, index)}>
                  {content}
                </button>
              ) : (
                <div className={rowClass}>
                  <span className="sr-only">{accessibleName}</span>
                  <span aria-hidden className="contents">{content}</span>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {canCollapse && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className={cx(
            "mt-2 flex h-8 w-full items-center justify-center rounded-md text-xs font-medium text-muted-foreground outline-none",
            "transition-colors duration-150 ease-out hover:bg-surface-2 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none",
          )}
        >
          {expanded ? "Show less" : `Show all ${sorted.length}`}
        </button>
      )}
    </div>
  )
}
