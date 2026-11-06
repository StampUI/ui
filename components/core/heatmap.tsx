"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { chartPaletteAttr, type ChartPalette } from "@/components/core/chart-palette"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/core/tooltip"

// ── Shared types ─────────────────────────────────────────────────────────────

/** A single value cell in any heatmap. value is the raw measured count. */
export interface HeatmapCellDatum {
  /** Raw measured value (e.g. contributions, requests, sessions). */
  value: number
  /** Tooltip label shown alongside the value, e.g. a date or "Mon 14:00". */
  label?: string
  /** Optional override label for the value noun in the tooltip, default "value". */
  unit?: string
}

/** 0..4, the discrete intensity bucket (ordinal, reads --chart-seq-*). */
export type IntensityLevel = 0 | 1 | 2 | 3 | 4

/** Maps a raw value to a level given the dataset's scale. */
export type IntensityScale = (value: number) => IntensityLevel

// ── Intensity bucketing ──────────────────────────────────────────────────────

/**
 * Fixed thresholds, preserves the legacy activity-heatmap buckets.
 * 0 => empty, 1..2 => 1, 3..5 => 2, 6..8 => 3, 9+ => 4
 */
export function intensityLevelFixed(value: number): IntensityLevel {
  if (value <= 0) return 0
  if (value <= 2) return 1
  if (value <= 5) return 2
  if (value <= 8) return 3
  return 4
}

/**
 * Relative thresholds, buckets by fraction of the dataset max.
 * 0 => empty, (0, .25] => 1, (.25, .5] => 2, (.5, .75] => 3, (.75, 1] => 4
 * max must be > 0; callers pass the dataset max.
 */
export function intensityLevelRelative(value: number, max: number): IntensityLevel {
  if (value <= 0 || max <= 0) return 0
  const r = value / max
  if (r <= 0.25) return 1
  if (r <= 0.5) return 2
  if (r <= 0.75) return 3
  return 4
}

/**
 * The single source of truth for level -> className. Levels read the
 * sequential ramp (never identity slots) and skip --chart-seq-4: it is the one
 * step where neither --foreground nor --background clears 4.5:1 in both
 * themes, so every level keeps a legible value label (see INTENSITY_TEXT_CLASS).
 */
export const INTENSITY_CLASS: Record<IntensityLevel, string> = {
  0: "bg-surface-2 border border-border/50",
  1: "bg-chart-seq-5",
  2: "bg-chart-seq-3",
  3: "bg-chart-seq-2",
  4: "bg-chart-seq-1",
}

/** Text on a filled level: >= 4.5:1 in both themes and in every palette. */
export const INTENSITY_TEXT_CLASS: Record<IntensityLevel, string> = {
  0: "text-muted-foreground",
  1: "text-foreground",
  2: "text-background",
  3: "text-background",
  4: "text-background",
}

export function intensityClass(level: IntensityLevel): string {
  return INTENSITY_CLASS[level]
}

// ── Shared primitives ────────────────────────────────────────────────────────

/** One cell. Wraps a div in a Tooltip when tooltip content is provided. */
export interface HeatmapCellProps {
  level: IntensityLevel
  /** When set, the cell is wrapped in a Tooltip. */
  tooltip?: React.ReactNode
  /** sm = h-3 w-3 (default), xs = h-2.5 w-2.5 */
  size?: "sm" | "xs"
  /**
   * When true the cell takes w-full instead of the fixed size width.
   * Use inside fluid CalendarHeatmap so cells stretch to fill column width.
   */
  fluid?: boolean
  className?: string
  /** Required for a11y when interactive. */
  ariaLabel?: string
}

export function HeatmapCell({ level, tooltip, size = "sm", fluid = false, className, ariaLabel }: HeatmapCellProps) {
  const cell = (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cx(
        "rounded-[2px] cursor-default transition-opacity duration-150 ease-out hover:opacity-70 motion-reduce:transition-none",
        fluid
          ? "w-full aspect-square"
          : (size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3"),
        intensityClass(level),
        className
      )}
    />
  )

  if (tooltip == null) return cell

  return (
    <Tooltip>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

/** Less [] [] [] [] [] More strip. */
export interface HeatmapLegendProps {
  /** default "Less" */
  lessLabel?: string
  /** default "More" */
  moreLabel?: string
  className?: string
}

const LEGEND_LEVELS: IntensityLevel[] = [0, 1, 2, 3, 4]

export function HeatmapLegend({ lessLabel = "Less", moreLabel = "More", className }: HeatmapLegendProps) {
  return (
    <div className={cx("flex items-center gap-1.5", className)}>
      <span className="text-xs text-muted-foreground mr-1">{lessLabel}</span>
      {LEGEND_LEVELS.map((level) => (
        <div key={level} className={cx("h-3 w-3 rounded-[2px]", intensityClass(level))} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{moreLabel}</span>
    </div>
  )
}

// ── Tooltip content helper ───────────────────────────────────────────────────

function CellTooltip({ value, unit, suffix }: { value: number; unit: string; suffix?: string }) {
  return (
    <>
      <span className="font-medium">
        {value} {unit}
      </span>
      {suffix ? <span className="text-muted-foreground ml-1">{suffix}</span> : null}
    </>
  )
}

// ── Calendar ─────────────────────────────────────────────────────────────────

const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DEFAULT_CAL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export interface CalendarHeatmapProps {
  /** 52 columns x 7 rows. Outer = weeks, inner = days (Sun..Sat). */
  weeks: HeatmapCellDatum[][]
  /** 12 short month names for the top axis. */
  monthLabels?: string[]
  /** 7 short day names for the left axis (every other shown). */
  dayLabels?: string[]
  /** Value to level mapper. */
  scale?: IntensityScale
  /** Render the Less/More legend row. */
  showLegend?: boolean
  /** Noun used in cell tooltips. */
  tooltipUnit?: string
  /** Inner min-w-[Npx] to drive horizontal scroll. */
  minWidth?: number
  /**
   * Cell geometry. sm = h-3 w-3 (12px, default), xs = h-2.5 w-2.5 (10px).
   * Use xs when embedding in a narrower PreviewFrame or compact context.
   */
  cellSize?: "sm" | "xs"
  /**
   * When true, week columns become flex-1 and cells stretch to w-full,
   * filling the available container width instead of using fixed cell sizes.
   * Disables horizontal scroll. Use when the card should fill its parent.
   */
  fluid?: boolean
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

export function CalendarHeatmap({
  weeks,
  monthLabels = DEFAULT_MONTHS,
  dayLabels = DEFAULT_CAL_DAYS,
  scale = intensityLevelFixed,
  showLegend = true,
  tooltipUnit = "contributions",
  minWidth = 640,
  cellSize = "sm",
  fluid = false,
  palette,
  className,
}: CalendarHeatmapProps) {
  const isXs = cellSize === "xs"
  const gap  = isXs ? "gap-[3px]" : "gap-1"
  const cellH = isXs ? "h-2.5" : "h-3"

  return (
    <TooltipProvider delayDuration={100}>
      {/* fluid = stretch to fill container; default = fixed-size cells with horizontal scroll */}
      <div {...chartPaletteAttr(palette)} className={cx(fluid ? "w-full max-w-[760px] mx-auto" : "w-full overflow-x-auto", className)}>
        <div
          className="space-y-2"
          style={fluid ? undefined : { width: "fit-content", marginInline: "auto" }}
        >
          {/* Month labels */}
          <div className={cx("flex pl-8", gap)}>
            {weeks.map((week, wi) => {
              const first = week[0]?.label ? new Date(week[0].label) : null
              const isFirstWeekOfMonth = first ? first.getDate() <= 7 : false
              return (
                <div
                  key={wi}
                  className={cx(
                    "shrink-0 text-xs leading-none text-muted-foreground",
                    fluid ? "flex-1 min-w-0" : (isXs ? "w-2.5" : "w-3"),
                  )}
                >
                  {first && isFirstWeekOfMonth ? monthLabels[first.getMonth()] : ""}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className={cx("flex", gap, fluid && "w-full")}>
            {/* Day labels gutter */}
            <div className={cx("flex flex-col mr-1", gap)}>
              {dayLabels.map((day, i) => (
                <div key={day} className={cx("text-xs leading-none text-muted-foreground flex items-center", fluid ? "flex-1 min-h-0" : cellH)}>
                  {i % 2 === 1 ? day : ""}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className={cx("flex flex-col", gap, fluid ? "flex-1 min-w-0" : "")}>
                {week.map((day, di) => {
                  const level = scale(day.value)
                  const unit = day.unit ?? tooltipUnit
                  return (
                    <HeatmapCell
                      key={di}
                      level={level}
                      size={cellSize}
                      fluid={fluid}
                      ariaLabel={day.label ? `${day.value} ${unit} on ${day.label}` : `${day.value} ${unit}`}
                      tooltip={<CellTooltip value={day.value} unit={unit} suffix={day.label ? `on ${day.label}` : undefined} />}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          {showLegend ? <HeatmapLegend className="pl-8 pt-1" /> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}

// ── Punch Card ───────────────────────────────────────────────────────────────

const DEFAULT_PUNCH_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DEFAULT_HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21]

export interface PunchCardHeatmapProps {
  /** 7 rows (days) x 24 cols (hours). */
  matrix: HeatmapCellDatum[][]
  /** 7 row labels on the left axis. */
  dayLabels?: string[]
  /** Hour ticks shown on the top axis. */
  hourLabels?: number[]
  /** Value to level mapper. Defaults to relative scale bound to matrix max. */
  scale?: IntensityScale
  /** Render legend. */
  showLegend?: boolean
  /** Tooltip noun. */
  tooltipUnit?: string
  /** Inner min width for scroll. */
  minWidth?: number
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

export function PunchCardHeatmap({
  matrix,
  dayLabels = DEFAULT_PUNCH_DAYS,
  hourLabels = DEFAULT_HOUR_LABELS,
  scale,
  showLegend = true,
  tooltipUnit = "events",
  minWidth = 560,
  palette,
  className,
}: PunchCardHeatmapProps) {
  const max = React.useMemo(() => {
    let m = 0
    for (const row of matrix) for (const cell of row) if (cell.value > m) m = cell.value
    return m
  }, [matrix])
  const resolveLevel = scale ?? ((value: number) => intensityLevelRelative(value, max))
  const hourTicks = new Set(hourLabels)
  const cols = matrix[0]?.length ?? 24

  return (
    <TooltipProvider delayDuration={100}>
      <div {...chartPaletteAttr(palette)} className={cx("w-full overflow-x-auto", className)}>
        <div className="space-y-2" style={{ width: "fit-content", marginInline: "auto" }}>
          {/* Hour labels */}
          <div className="flex gap-1 pl-10">
            {Array.from({ length: cols }, (_, h) => (
              <div key={h} className="w-3 shrink-0 text-xs leading-none text-muted-foreground">
                {hourTicks.has(h) ? h : ""}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="flex flex-col gap-1">
            {matrix.map((row, ri) => (
              <div key={ri} className="flex items-center gap-1">
                <div className="w-9 shrink-0 text-xs leading-none text-muted-foreground text-right pr-1">
                  {dayLabels[ri] ?? ""}
                </div>
                {row.map((cell, ci) => {
                  const level = resolveLevel(cell.value)
                  const unit = cell.unit ?? tooltipUnit
                  const hour = String(ci).padStart(2, "0")
                  const day = dayLabels[ri] ?? ""
                  return (
                    <HeatmapCell
                      key={ci}
                      level={level}
                      ariaLabel={`${cell.value} ${unit} on ${day} at ${hour}:00`}
                      tooltip={<CellTooltip value={cell.value} unit={unit} suffix={`on ${day} at ${hour}:00`} />}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          {showLegend ? <HeatmapLegend className="pl-10 pt-1" /> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}

// ── Month ────────────────────────────────────────────────────────────────────

const WEEKDAY_LETTERS_SUN = ["S", "M", "T", "W", "T", "F", "S"]
const WEEKDAY_LETTERS_MON = ["M", "T", "W", "T", "F", "S", "S"]

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

export interface MonthHeatmapProps {
  /** Calendar year. Defaults to the current year. */
  year?: number
  /** 0-indexed month (0 = Jan). Defaults to the current month. */
  month?: number
  /** Map of "YYYY-MM-DD" -> value. Missing dates render as empty. */
  data: Record<string, number>
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1
  /** Value to level mapper. */
  scale?: IntensityScale
  /** Show the weekday header row. */
  showWeekdayLabels?: boolean
  /** Render legend. */
  showLegend?: boolean
  /** Tooltip noun. */
  tooltipUnit?: string
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

export function MonthHeatmap({
  year,
  month,
  data,
  weekStartsOn = 0,
  scale = intensityLevelFixed,
  showWeekdayLabels = true,
  showLegend = true,
  tooltipUnit = "events",
  palette,
  className,
}: MonthHeatmapProps) {
  const now = new Date()
  const y = year ?? now.getFullYear()
  const m = month ?? now.getMonth()

  const firstWeekday = new Date(y, m, 1).getDay() // 0 = Sun
  const offset = weekStartsOn === 1 ? (firstWeekday + 6) % 7 : firstWeekday
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const weekdayLetters = weekStartsOn === 1 ? WEEKDAY_LETTERS_MON : WEEKDAY_LETTERS_SUN

  // Build a fixed 42-cell (6x7) array. null = out-of-month spacer.
  const cells: (number | null)[] = []
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1
    cells.push(dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null)
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div {...chartPaletteAttr(palette)} className={cx("inline-flex flex-col gap-2", className)}>
        {showWeekdayLabels ? (
          <div className="grid grid-cols-7 gap-1">
            {weekdayLetters.map((letter, i) => (
              <div key={i} className="h-3 w-3 text-xs leading-none text-muted-foreground flex items-center justify-center">
                {letter}
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-7 gap-1">
          {cells.map((dayNum, i) => {
            if (dayNum == null) {
              return <div key={i} className="h-3 w-3 opacity-0 pointer-events-none" />
            }
            const dateKey = `${y}-${pad2(m + 1)}-${pad2(dayNum)}`
            const value = data[dateKey] ?? 0
            const level = scale(value)
            return (
              <HeatmapCell
                key={i}
                level={level}
                ariaLabel={`${value} ${tooltipUnit} on ${dateKey}`}
                tooltip={<CellTooltip value={value} unit={tooltipUnit} suffix={`on ${dateKey}`} />}
              />
            )
          })}
        </div>

        {showLegend ? <HeatmapLegend className="pt-1" /> : null}
      </div>
    </TooltipProvider>
  )
}

// ── Matrix ───────────────────────────────────────────────────────────────────

export interface MatrixHeatmapProps {
  /** Row axis labels (e.g. cohorts "Jan", "Feb"). */
  rows: string[]
  /** Column axis labels (e.g. "M0".."M5"). */
  columns: string[]
  /** rows.length x columns.length values. Use null for empty/future cells. */
  data: (number | null)[][]
  /** Renders the in-cell value text (e.g. v => `${v}%`). */
  format?: (v: number) => string
  /** Value to level mapper. Defaults to relative scale bound to data max. */
  scale?: IntensityScale
  /** Print the value inside each cell. Defaults to false. */
  showValues?: boolean
  /** Currently selected cell coordinates. */
  selectedCell?: { row: number; col: number } | null
  /** Called when a non-empty cell is clicked. */
  onCellClick?: (row: number, col: number, value: number) => void
  /** Render the legend. */
  showLegend?: boolean
  /** Optional caption under the grid. */
  caption?: string
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

export function MatrixHeatmap({
  rows,
  columns,
  data,
  format = String,
  scale,
  showValues = false,
  selectedCell,
  onCellClick,
  showLegend = false,
  caption,
  palette,
  className,
}: MatrixHeatmapProps) {
  const max = React.useMemo(() => {
    let m = 0
    for (const row of data) for (const v of row) if (v !== null && v > m) m = v
    return m
  }, [data])
  const resolveLevel = scale ?? ((value: number) => intensityLevelRelative(value, max))

  return (
    <TooltipProvider delayDuration={80}>
      <div {...chartPaletteAttr(palette)} className={cx("inline-flex flex-col gap-2", className)}>
        {/* Column labels */}
        <div className="flex gap-2">
          <div className="w-12 shrink-0" />
          {columns.map((col) => (
            <div key={col} className="flex-1 min-w-[44px] text-center text-xs font-medium text-muted-foreground">
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1.5">
          {rows.map((rowLabel, ri) => (
            <div key={rowLabel} className="flex items-center gap-2">
              <div className="w-12 shrink-0 text-right text-xs text-muted-foreground pr-1.5">{rowLabel}</div>
              {columns.map((colLabel, ci) => {
                const value = data[ri]?.[ci] ?? null
                const isEmpty = value === null
                const level = isEmpty ? (0 as IntensityLevel) : resolveLevel(value)
                const isSelected = selectedCell?.row === ri && selectedCell?.col === ci
                const textColor = INTENSITY_TEXT_CLASS[level]

                const cell = (
                  <div
                    role={isEmpty ? "presentation" : "button"}
                    tabIndex={isEmpty ? undefined : 0}
                    aria-label={isEmpty ? undefined : `${rowLabel} · ${colLabel}: ${format(value)}`}
                    aria-pressed={isEmpty ? undefined : isSelected}
                    onClick={() => { if (!isEmpty) onCellClick?.(ri, ci, value) }}
                    onKeyDown={(e) => {
                      if (!isEmpty && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault()
                        onCellClick?.(ri, ci, value)
                      }
                    }}
                    className={cx(
                      "h-10 flex-1 min-w-[44px] rounded-md flex items-center justify-center transition-all duration-150 ease-out motion-reduce:transition-none select-none",
                      isEmpty
                        ? "bg-surface-2/50 border border-border/20"
                        : cx(
                            intensityClass(level),
                            onCellClick && "cursor-pointer",
                            isSelected
                              ? "ring-2 ring-foreground/50"
                              : "hover:ring-1 hover:ring-foreground/25"
                          )
                    )}
                  >
                    {showValues && !isEmpty ? (
                      <span className={cx("text-xs font-medium tabular-nums", textColor)}>
                        {format(value)}
                      </span>
                    ) : null}
                  </div>
                )

                if (isEmpty) return <React.Fragment key={colLabel}>{cell}</React.Fragment>

                return (
                  <Tooltip key={colLabel}>
                    <TooltipTrigger asChild>{cell}</TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium">{rowLabel} · {colLabel}</span>
                        <span className="text-xs text-muted-foreground">Retention: {format(value)}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>

        {showLegend ? <HeatmapLegend className="pt-1" /> : null}
        {caption ? (
          <p className="text-xs text-muted-foreground text-center pt-2">{caption}</p>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

// ── MiniHeatmap ──────────────────────────────────────────────────────────────

export interface MiniHeatmapProps {
  /** Flat series, rendered as a single horizontal strip. */
  values: number[]
  /** Value to level mapper. Defaults to relative scale bound to values max. */
  scale?: IntensityScale
  /** Cell geometry. */
  cellSize?: "xs" | "sm"
  /** If true, each cell gets an index/value tooltip. */
  tooltip?: boolean
  /** Tooltip noun. */
  tooltipUnit?: string
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

export function MiniHeatmap({
  values,
  scale,
  cellSize = "xs",
  tooltip = false,
  tooltipUnit = "events",
  palette,
  className,
}: MiniHeatmapProps) {
  const max = React.useMemo(() => values.reduce((m, v) => (v > m ? v : m), 0), [values])
  const resolveLevel = scale ?? ((value: number) => intensityLevelRelative(value, max))

  const strip = (
    <div {...chartPaletteAttr(palette)} className={cx("inline-flex items-center gap-0.5", className)}>
      {values.map((value, i) => {
        const level = resolveLevel(value)
        return (
          <HeatmapCell
            key={i}
            level={level}
            size={cellSize}
            ariaLabel={`${value} ${tooltipUnit}`}
            tooltip={tooltip ? <CellTooltip value={value} unit={tooltipUnit} /> : undefined}
          />
        )
      })}
    </div>
  )

  if (!tooltip) return strip
  return <TooltipProvider delayDuration={100}>{strip}</TooltipProvider>
}
