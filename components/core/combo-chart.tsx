"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cx } from "@/lib/cx"
import {
  CHART_IDENTITY,
  CHART_NEUTRAL,
  CHART_OTHER,
  chartPaletteAttr,
  type ChartPalette,
} from "@/components/core/chart-palette"
// Local copy of chart.tsx's compact formatter: combo-chart is free and must not
// import the Pro chart module. 12000 -> 12K.
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const formatCompact = (value: number) => compactNumber.format(value)

/**
 * ComboChart: bars and a line on one time axis, each with its own scale and
 * formatter (requests vs error rate, signups vs conversion).
 *
 * Bars are supporting context (--chart-neutral), the line is the subject
 * (--chart-1). With a `threshold` the line drops to --chart-neutral (and the
 * bars to --chart-other) so only the crossing segment takes status colour.
 */

export type ComboDatum = Record<string, string | number | null | undefined>

export interface ComboSeries {
  key: string
  label: string
  /** Formats this series in ticks, tooltip, legend and the data table. Falls back to `valueFormatter`. */
  format?: (value: number) => string
}

export interface ComboThreshold {
  /** Limit on the line's scale. Line segments above it take `tone`. */
  value: number
  /** Short label drawn at the right edge, e.g. "SLO 1%". Defaults to the formatted value. */
  label?: string
  tone?: "warning" | "danger"
}

export interface ComboChartProps {
  data: ComboDatum[]
  xKey: string
  bar: ComboSeries
  line: ComboSeries
  threshold?: ComboThreshold
  /** Give the line its own axis on the right. Default `true`; `false` shares the left axis. */
  rightAxis?: boolean
  /** Fallback formatter for both series. Default: compact ticks, full numbers elsewhere. */
  valueFormatter?: (value: number) => string
  /** Formats x values in ticks, tooltip header and the data table. */
  xFormatter?: (value: string | number) => string
  /** Legend under the plot with the bar total and the line average. Default `true`. */
  showLegend?: boolean
  /** Plot height in px. Default `240`. */
  height?: number
  loading?: boolean
  emptyMessage?: string
  ariaLabel?: string
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
  className?: string
}

// ── Shared chart anatomy (matches the core chart spec, section 5) ────────────

const AXIS_TICK = { fontSize: 11, fill: "var(--muted-foreground-soft)" }
const MOTION = { animationDuration: 220, animationEasing: "ease-out" } as const
const TONE = { warning: "var(--warning)", danger: "var(--danger)" } as const

const fullNumber = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })

/** Threshold value label: right edge, just above the rule, with a card halo so a crossing line never hides it. */
function ThresholdLabel({ viewBox, value }: { viewBox?: { x?: number; y?: number; width?: number }; value?: string }) {
  if (!viewBox || viewBox.x == null || viewBox.y == null || viewBox.width == null) return null
  return (
    <text
      x={viewBox.x + viewBox.width - 4}
      y={viewBox.y - 6}
      textAnchor="end"
      fontSize={11}
      fill="var(--muted-foreground)"
      stroke="var(--card)"
      strokeWidth={3}
      paintOrder="stroke"
    >
      {value}
    </text>
  )
}

function toNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null
}

/** Four even steps from zero to a round maximum, so both axes share grid lines. */
function niceTicks(max: number, steps = 4): number[] {
  if (!(max > 0)) return [0, 1, 2, 3, 4].slice(0, steps + 1)
  const raw = max / steps
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 2.5, 5, 10].find((m) => m * mag >= raw) ?? 10) * mag
  return Array.from({ length: steps + 1 }, (_, i) => Number((i * step).toPrecision(12)))
}

type SwatchKind = "square" | "line" | "dashed"

function Swatch({ kind, color }: { kind: SwatchKind; color: string }) {
  if (kind === "square") return <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
  if (kind === "dashed")
    return (
      <span className="flex w-2.5 shrink-0 gap-0.5">
        <span className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: color }} />
        <span className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: color }} />
      </span>
    )
  return <span className="h-0.5 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
}

interface TooltipRow {
  label: string
  value: string
  color: string
  kind: SwatchKind
  tone?: string
}

function TooltipCard({ title, rows }: { title: string; rows: TooltipRow[] }) {
  return (
    <div className="min-w-[160px] rounded-lg border border-border-strong bg-popover px-2.5 py-2 text-xs shadow-[var(--shadow-float)]">
      <p className="font-medium text-foreground">{title}</p>
      <div className="-mx-2.5 my-1.5 h-px bg-border" />
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <Swatch kind={r.kind} color={r.color} />
            <span className="text-muted-foreground">{r.label}</span>
            <span
              className="ml-auto pl-4 font-medium tabular-nums text-foreground"
              style={r.tone ? { color: r.tone } : undefined}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Vertical 1px crosshair, snapped to the active x (works for bar and line cursors). */
function Crosshair(props: {
  points?: { x: number; y: number }[]
  x?: number
  y?: number
  width?: number
  height?: number
}) {
  const { points, x, y, width, height } = props
  let cx0: number | undefined
  let top: number | undefined
  let bottom: number | undefined
  if (points && points.length >= 2) {
    cx0 = points[0].x
    top = Math.min(points[0].y, points[1].y)
    bottom = Math.max(points[0].y, points[1].y)
  } else if (x != null && width != null && y != null && height != null) {
    cx0 = x + width / 2
    top = y
    bottom = y + height
  }
  if (cx0 == null || top == null || bottom == null) return null
  return <line x1={cx0} x2={cx0} y1={top} y2={bottom} stroke="var(--border-strong)" strokeWidth={1} />
}

/** Frame kept for loading and empty states: same height, grid and axis gutters. */
function StateFrame({ height, loading, message }: { height: number; loading: boolean; message: string }) {
  const bars = [46, 58, 52, 64, 61, 72, 68, 77, 70, 82, 79, 88]
  return (
    <div className="relative" style={{ height }} aria-busy={loading || undefined}>
      <div className="absolute inset-x-10 top-2 bottom-7 flex flex-col justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-px bg-border" />
        ))}
      </div>
      <div className="absolute top-1 bottom-6 left-0 flex w-7 flex-col justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 w-6 rounded-[2px] bg-surface-2" />
        ))}
      </div>
      <div className="absolute inset-x-10 bottom-0 flex h-3 justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 w-8 rounded-[2px] bg-surface-2" />
        ))}
      </div>
      {loading ? (
        <div className="absolute inset-x-12 top-2 bottom-7 flex animate-[pulse_1.2s_ease-in-out_infinite] items-end gap-[3%] motion-reduce:animate-none">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[2px] bg-surface-2" style={{ height: `${h}%` }} />
          ))}
        </div>
      ) : (
        <p className="absolute inset-x-10 top-2 bottom-7 flex items-center justify-center text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  )
}

// ── ComboChart ───────────────────────────────────────────────────────────────

export function ComboChart({
  data,
  xKey,
  bar,
  line,
  threshold,
  rightAxis = true,
  valueFormatter,
  xFormatter = (v) => String(v),
  showLegend = true,
  height = 240,
  loading = false,
  emptyMessage = "No data for this period",
  ariaLabel,
  palette,
  className,
}: ComboChartProps) {
  const [hover, setHover] = React.useState<number | null>(null)
  const [keyIndex, setKeyIndex] = React.useState<number | null>(null)
  const [isolated, setIsolated] = React.useState<"bar" | "line" | null>(null)
  const [pinned, setPinned] = React.useState<"bar" | "line" | null>(null)
  const gradientId = `combo-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`

  const fmtBar = bar.format ?? valueFormatter ?? fullNumber
  const fmtLine = line.format ?? valueFormatter ?? fullNumber
  const tickBar = bar.format ?? valueFormatter ?? formatCompact
  const tickLine = line.format ?? valueFormatter ?? formatCompact

  const n = data.length
  const barValues = data.map((d) => toNumber(d[bar.key]))
  const lineValues = data.map((d) => toNumber(d[line.key]))
  const barNums = barValues.filter((v): v is number => v != null)
  const lineNums = lineValues.filter((v): v is number => v != null)
  const isEmpty = barNums.length === 0 && lineNums.length === 0
  const label = ariaLabel ?? `${bar.label} and ${line.label}`

  // Axis scales: explicit round ticks so left and right axes share the grid.
  const tone = threshold ? TONE[threshold.tone ?? "danger"] : undefined
  // Threshold guard: with a threshold the line is the base series in --chart-neutral.
  const LINE_COLOR = threshold ? CHART_NEUTRAL : CHART_IDENTITY[0]
  const BAR_COLOR = threshold ? CHART_OTHER : CHART_NEUTRAL
  const barMax = Math.max(0, ...barNums)
  const lineMax = Math.max(0, ...lineNums, threshold ? threshold.value * 1.15 : 0)
  const leftTicks = niceTicks(rightAxis ? barMax : Math.max(barMax, lineMax))
  const rightTicks = niceTicks(lineMax)
  const lineAxis = rightAxis ? "right" : "left"

  // Threshold split: a hard two-stop stroke over the line's own bounding box.
  // Monotone curves never overshoot, so the box spans exactly min..max.
  const lineMin = lineNums.length ? Math.min(...lineNums) : 0
  const lineTop = lineNums.length ? Math.max(...lineNums) : 0
  const above = (v: number | null) => threshold != null && v != null && v > threshold.value
  let lineStroke = LINE_COLOR
  let splitOffset: number | null = null
  if (threshold && tone && lineNums.length) {
    if (lineMin > threshold.value) lineStroke = tone
    else if (lineTop > threshold.value && lineTop > lineMin) {
      splitOffset = (lineTop - threshold.value) / (lineTop - lineMin)
      lineStroke = `url(#${gradientId})`
    }
  }

  const active = keyIndex ?? hover
  const focus = isolated ?? pinned
  const lineOpacity = focus === "bar" ? 0.25 : 1
  const barOpacity = (i: number) => (focus === "line" ? 0.25 : active == null || active === i ? 1 : 0.4)

  const describe = (i: number) => {
    const d = data[i]
    const b = barValues[i]
    const l = lineValues[i]
    return `${xFormatter(d[xKey] as string | number)}: ${bar.label} ${b == null ? "no data" : fmtBar(b)}, ${line.label} ${
      l == null ? "no data" : fmtLine(l)
    }${above(l) ? `, above ${threshold?.label ?? fmtLine(threshold?.value ?? 0)}` : ""}`
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (n === 0) return
    const next = (() => {
      switch (e.key) {
        case "ArrowRight":
          return keyIndex == null ? 0 : Math.min(n - 1, keyIndex + 1)
        case "ArrowLeft":
          return keyIndex == null ? n - 1 : Math.max(0, keyIndex - 1)
        case "Home":
          return 0
        case "End":
          return n - 1
        case "Escape":
          return null
        default:
          return undefined
      }
    })()
    if (next === undefined) return
    e.preventDefault()
    setKeyIndex(next)
  }

  const barTotal = barNums.reduce((s, v) => s + v, 0)
  const lineAvg = lineNums.length ? lineNums.reduce((s, v) => s + v, 0) / lineNums.length : 0

  const renderTooltip = ({ active: on, label: x }: { active?: boolean; label?: string | number }) => {
    const i = data.findIndex((d) => d[xKey] === x)
    if (!on || i < 0) return null
    const b = barValues[i]
    const l = lineValues[i]
    return (
      <TooltipCard
        title={xFormatter(x as string | number)}
        rows={[
          { label: bar.label, value: b == null ? "No data" : fmtBar(b), color: BAR_COLOR, kind: "square" },
          {
            label: line.label,
            value: l == null ? "No data" : fmtLine(l),
            color: above(l) && tone ? tone : LINE_COLOR,
            kind: "line",
            tone: above(l) ? tone : undefined,
          },
        ]}
      />
    )
  }

  return (
    <div {...chartPaletteAttr(palette)} className={cx("w-full tabular-nums", className)}>
      {loading || isEmpty ? (
        <StateFrame height={height} loading={loading} message={emptyMessage} />
      ) : (
        <div
          role="group"
          aria-roledescription="chart"
          aria-label={`${label}. Use the arrow keys to move between ${n} points.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setKeyIndex(null)}
          onPointerMove={() => keyIndex != null && setKeyIndex(null)}
          className="rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card [&_*:focus]:outline-none"
          style={{ height }}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height }}>
            <ComposedChart
              data={data}
              accessibilityLayer={false}
              margin={{ top: 8, right: rightAxis ? 0 : 4, bottom: 0, left: 0 }}
              barCategoryGap="28%"
              onMouseMove={(s) => setHover(s.activeTooltipIndex == null ? null : Number(s.activeTooltipIndex))}
              onMouseLeave={() => setHover(null)}
            >
              {splitOffset != null && tone && (
                <defs>
                  {/* Two solid tones split at the threshold, not a colour ramp. */}
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={0} stopColor={tone} />
                    <stop offset={splitOffset} stopColor={tone} />
                    <stop offset={splitOffset} stopColor={LINE_COLOR} />
                    <stop offset={1} stopColor={LINE_COLOR} />
                  </linearGradient>
                </defs>
              )}
              <CartesianGrid stroke="var(--border)" vertical={false} yAxisId="left" />
              <XAxis
                dataKey={xKey}
                tick={AXIS_TICK}
                tickFormatter={xFormatter}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                minTickGap={24}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={AXIS_TICK}
                tickFormatter={rightAxis ? tickBar : tickLine}
                ticks={leftTicks}
                domain={[0, leftTicks[leftTicks.length - 1]]}
                axisLine={false}
                tickLine={false}
                width="auto"
              />
              {rightAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={AXIS_TICK}
                  tickFormatter={tickLine}
                  ticks={rightTicks}
                  domain={[0, rightTicks[rightTicks.length - 1]]}
                  axisLine={false}
                  tickLine={false}
                  width="auto"
                />
              )}
              <Tooltip
                content={renderTooltip}
                cursor={<Crosshair />}
                isAnimationActive={false}
                offset={14}
                active={keyIndex != null ? true : undefined}
                defaultIndex={keyIndex ?? undefined}
              />
              <Bar
                yAxisId="left"
                dataKey={bar.key}
                name={bar.label}
                fill={BAR_COLOR}
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
                activeBar={false}
                shape={(p: React.ComponentProps<typeof Rectangle> & { index?: number }) => (
                  <Rectangle
                    {...p}
                    fillOpacity={barOpacity(p.index ?? -1)}
                    className="transition-[fill-opacity] duration-150 ease-out motion-reduce:transition-none"
                  />
                )}
                {...MOTION}
              />
              {threshold && (
                <ReferenceLine
                  yAxisId={lineAxis}
                  y={threshold.value}
                  stroke="var(--muted-foreground-soft)"
                  strokeDasharray="3 3"
                  label={<ThresholdLabel value={threshold.label ?? fmtLine(threshold.value)} />}
                />
              )}
              <Line
                yAxisId={lineAxis}
                dataKey={line.key}
                name={line.label}
                type="monotone"
                stroke={lineStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeOpacity={lineOpacity}
                dot={false}
                activeDot={(p: { cx?: number; cy?: number; value?: unknown }) =>
                  p.cx == null || p.cy == null ? (
                    <g />
                  ) : (
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r={4}
                      fill={above(toNumber(p.value)) && tone ? tone : LINE_COLOR}
                      stroke="var(--card)"
                      strokeWidth={2}
                    />
                  )
                }
                {...MOTION}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-3 text-xs">
          {(
            [
              { id: "bar", s: bar, kind: "square", color: BAR_COLOR, value: `${fmtBar(barTotal)} total` },
              { id: "line", s: line, kind: "line", color: LINE_COLOR, value: `${fmtLine(lineAvg)} avg` },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={pinned === item.id}
              onMouseEnter={() => setIsolated(item.id)}
              onMouseLeave={() => setIsolated(null)}
              onFocus={() => setIsolated(item.id)}
              onBlur={() => setIsolated(null)}
              onClick={() => setPinned((p) => (p === item.id ? null : item.id))}
              className={cx(
                "flex items-center gap-1.5 rounded-sm outline-none transition-opacity duration-150 ease-out focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none",
                focus != null && focus !== item.id && "opacity-40",
              )}
            >
              <Swatch kind={item.kind} color={item.color} />
              <span className="text-muted-foreground">{item.s.label}</span>
              {!loading && !isEmpty && <span className="font-medium text-foreground-soft">{item.value}</span>}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {keyIndex != null && !isEmpty ? describe(keyIndex) : ""}
      </p>
      {!loading && !isEmpty && (
        <table className="sr-only">
          <caption>{label}</caption>
          <thead>
            <tr>
              <th scope="col">{xKey}</th>
              <th scope="col">{bar.label}</th>
              <th scope="col">{line.label}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <th scope="row">{xFormatter(d[xKey] as string | number)}</th>
                <td>{barValues[i] == null ? "" : fmtBar(barValues[i] as number)}</td>
                <td>{lineValues[i] == null ? "" : fmtLine(lineValues[i] as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
