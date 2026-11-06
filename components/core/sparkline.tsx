"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { CHART_NEUTRAL, chartPaletteAttr, type ChartPalette } from "@/components/core/chart-palette"

/**
 * Sparkline: a word-sized trend for KPI tiles and table rows.
 *
 * Plain SVG and absolutely positioned spans, no chart library, so a table
 * with a hundred rows stays cheap. The line scales to the container width
 * (non-scaling stroke keeps it a hairline), markers are HTML so they stay
 * round at any aspect ratio.
 */

export type SparklineVariant = "line" | "area" | "bar"

export interface SparklineProps {
  /** Series values, oldest first. */
  data: number[]
  /** Mark style. `area` adds a flat 8% fill under the line. Default `"line"`. */
  variant?: SparklineVariant
  /** Height in px. Keep between 24 and 40. Width always fills the container. Default `32`. */
  height?: number
  /** Line width in px (line and area). Default `1.5`. */
  strokeWidth?: number
  /** Mark color as a CSS color or variable. Default `var(--chart-neutral)` (a supporting series). Pass `var(--chart-1)` when the sparkline is the panel's subject. */
  color?: string
  /** Color of the last point and the last bar. Defaults to `color`; with one colour the other bars step back in opacity so the last one reads first. */
  accentColor?: string
  /** Show a dot on the last point (line and area). Default `true`. */
  showLastPoint?: boolean
  /** Highlight the last bar with `accentColor` (bar). Default `true`. */
  highlightLast?: boolean
  /** Mark the lowest and highest points with small dots (line and area). Default `false`. */
  showMinMax?: boolean
  /** Draw a dashed horizontal reference line at this value (target, limit, average). */
  referenceValue?: number
  /**
   * Color for the part of the series past `referenceValue`, e.g. `var(--danger)`.
   * Only for a real threshold the reader must act on; leave unset otherwise.
   */
  alertColor?: string
  /** Which side of `referenceValue` is the alert zone. Default `"above"`. */
  alertWhen?: "above" | "below"
  /** Show a crosshair and value tooltip on hover. Default `false` (keep off in dense tables). */
  interactive?: boolean
  /** Per-point labels for the tooltip, e.g. dates. Same length as `data`. */
  labels?: string[]
  /** Formats values in the tooltip and the aria-label. Default compact (12.4K). */
  formatValue?: (value: number) => string
  /** What the series measures, used in the aria-label. Default `"Trend"`. */
  label?: string
  /** Chart palette for this sparkline. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const defaultFormat = (v: number) => compact.format(v)

/** Builds the screen reader summary: first, last, change, low and high. */
function describe(data: number[], label: string, format: (v: number) => string) {
  if (data.length === 0) return `${label}: no data`
  const first = data[0]
  const last = data[data.length - 1]
  const min = Math.min(...data)
  const max = Math.max(...data)
  const delta = last - first
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "unchanged"
  const pct = first !== 0 && delta !== 0 ? ` ${Math.abs((delta / Math.abs(first)) * 100).toFixed(1)}%` : ""
  return `${label} over ${data.length} points: from ${format(first)} to ${format(last)}, ${direction}${pct}. Low ${format(min)}, high ${format(max)}.`
}

export function Sparkline({
  data,
  variant = "line",
  height = 32,
  strokeWidth = 1.5,
  color,
  accentColor,
  showLastPoint = true,
  highlightLast = true,
  showMinMax = false,
  referenceValue,
  alertColor,
  alertWhen = "above",
  interactive = false,
  labels,
  formatValue = defaultFormat,
  label = "Trend",
  palette,
  className,
}: SparklineProps) {
  const [active, setActive] = React.useState<number | null>(null)
  const plotRef = React.useRef<HTMLDivElement>(null)

  const n = data.length
  const isBar = variant === "bar"
  const markColor = color ?? CHART_NEUTRAL
  const accent = accentColor ?? markColor
  // One colour for every bar: emphasis on the highlighted bar comes from the others stepping back.
  const dimRest = isBar && accent === markColor
  const clipId = `spark-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`
  const hasAlert = alertColor != null && referenceValue != null
  const inAlert = (v: number) =>
    alertColor != null && referenceValue != null && (alertWhen === "above" ? v > referenceValue : v < referenceValue)
  const pointColor = (v: number) => (inAlert(v) ? alertColor! : accent)

  // Domain: bars always include zero; lines fit the data (and the reference).
  const values = referenceValue != null ? [...data, referenceValue] : data
  let lo = n ? Math.min(...values) : 0
  let hi = n ? Math.max(...values) : 1
  if (isBar) {
    lo = Math.min(0, lo)
    hi = Math.max(0, hi)
  }
  if (lo === hi) {
    lo -= 1
    hi += 1
  }
  const y = (v: number) => ((hi - v) / (hi - lo)) * 100
  const x = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100)

  const points = n === 1 ? [`0 ${y(data[0])}`, `100 ${y(data[0])}`] : data.map((v, i) => `${x(i)} ${y(v)}`)
  const linePath = isBar || n === 0 ? "" : `M${points.join("L")}`

  const minIndex = n ? data.indexOf(Math.min(...data)) : -1
  const maxIndex = n ? data.indexOf(Math.max(...data)) : -1
  const hasMarkers = !isBar && (showLastPoint || showMinMax || interactive)

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = plotRef.current
    if (!el || n === 0) return
    const rect = el.getBoundingClientRect()
    const t = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setActive(isBar ? Math.min(n - 1, Math.floor(t * n)) : Math.round(t * (n - 1)))
  }

  const activeX = active == null ? 0 : isBar ? ((active + 0.5) / n) * 100 : x(active)

  return (
    <div
      role="img"
      aria-label={describe(data, label, formatValue)}
      {...chartPaletteAttr(palette)}
      className={cx("relative w-full", className)}
      style={{ height }}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? () => setActive(null) : undefined}
    >
      {/* Plot box. Inset when markers are drawn so dots are never clipped. */}
      <div
        ref={plotRef}
        aria-hidden="true"
        className={cx("absolute", hasMarkers ? "inset-[3px]" : isBar ? "inset-0" : "inset-x-0 inset-y-px")}
      >
        {referenceValue != null && (
          <div
            className="absolute inset-x-0 border-t border-dashed border-muted-foreground-soft"
            style={{ top: `${y(referenceValue)}%` }}
          />
        )}

        {isBar ? (
          <div className="absolute inset-0 flex gap-px">
            {data.map((v, i) => {
              const top = Math.min(y(v), y(0))
              const h = Math.abs(y(v) - y(0))
              const highlighted = active != null ? i === active : highlightLast && i === n - 1
              return (
                <div key={i} className="relative h-full min-w-0 flex-1">
                  <div
                    className="absolute inset-x-0 rounded-[1px] transition-colors duration-150 ease-out motion-reduce:transition-none"
                    style={{
                      top: `${top}%`,
                      height: `${h}%`,
                      minHeight: 1,
                      backgroundColor: inAlert(v) ? alertColor : highlighted ? accent : markColor,
                      opacity: dimRest && !highlighted && !inAlert(v) && (active != null || highlightLast) ? 0.55 : undefined,
                    }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          n > 0 && (
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {variant === "area" && (
                <path d={`${linePath}L100 100L0 100Z`} fill={markColor} fillOpacity={0.08} stroke="none" />
              )}
              <path
                d={linePath}
                fill="none"
                stroke={markColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {hasAlert && (
                <>
                  <clipPath id={clipId}>
                    {alertWhen === "above" ? (
                      <rect x={-10} y={-50} width={120} height={y(referenceValue ?? 0) + 50} />
                    ) : (
                      <rect x={-10} y={y(referenceValue ?? 0)} width={120} height={150} />
                    )}
                  </clipPath>
                  <path
                    d={linePath}
                    fill="none"
                    stroke={alertColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    clipPath={`url(#${clipId})`}
                  />
                </>
              )}
            </svg>
          )
        )}

        {!isBar && showMinMax && n > 1 && (
          <>
            <Dot left={x(minIndex)} top={y(data[minIndex])} size={4} color={markColor} />
            <Dot left={x(maxIndex)} top={y(data[maxIndex])} size={4} color={markColor} />
          </>
        )}

        {!isBar && showLastPoint && n > 0 && active == null && (
          <Dot left={x(n - 1)} top={y(data[n - 1])} size={5} color={pointColor(data[n - 1])} />
        )}

        {!isBar && active != null && (
          <>
            <div className="absolute inset-y-0 border-l border-border-strong" style={{ left: `${activeX}%` }} />
            <Dot left={activeX} top={y(data[active])} size={5} color={pointColor(data[active])} />
          </>
        )}
      </div>

      {active != null && (
        <div
          aria-hidden="true"
          className="popup-surface pointer-events-none absolute bottom-full z-10 mb-1.5 whitespace-nowrap px-2 py-1 text-xs"
          style={{
            left: `${activeX}%`,
            transform: `translateX(${activeX < 15 ? "0" : activeX > 85 ? "-100%" : "-50%"})`,
          }}
        >
          {labels?.[active] && <span className="mr-2 text-muted-foreground">{labels[active]}</span>}
          <span className="font-medium tabular-nums text-foreground">{formatValue(data[active])}</span>
        </div>
      )}
    </div>
  )
}

function Dot({ left, top, size, color }: { left: number; top: number; size: number; color: string }) {
  return (
    <span
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: color,
      }}
    />
  )
}
