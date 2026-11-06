"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { chartPaletteAttr, type ChartPalette } from "@/components/core/chart-palette"

/**
 * Meter: one value against a known maximum (seats, storage, a rate-limit
 * window). With `thresholds` the fill is --chart-neutral and only the part
 * past a threshold takes the warning or danger tone, so a healthy meter is
 * entirely gray. Without thresholds the fill is the sequential --chart-seq-3. Optional
 * segmented (tick) style for a denser, tracker-like read.
 */

export interface MeterThresholds {
  /** Value (same units as `value`) from which the fill turns `--warning`. */
  warning?: number
  /** Value from which the fill turns `--danger`. */
  danger?: number
}

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Current value. `null` renders the empty state. */
  value: number | null
  /** Maximum, e.g. the plan limit. */
  max: number
  /** Limits in value units. Only the part of the fill past a limit is coloured. */
  thresholds?: MeterThresholds
  /** Render as N ticks instead of a continuous bar. */
  segments?: number
  /** Header left, e.g. "Seats". */
  label?: React.ReactNode
  /** Line under the bar, e.g. "Resets July 1". */
  sublabel?: React.ReactNode
  /** Formats value and max in the header and the accessible text. */
  valueFormatter?: (value: number) => string
  /** Show "value / max" in the header. Default `true`. */
  showValue?: boolean
  /** Draw a tick at each threshold position (bar style only). Default `true`. */
  showThresholds?: boolean
  /** Bar height in px. Default `6` (bar) or `20` (segments). */
  height?: number
  /** Keep the frame and pulse the track. */
  loading?: boolean
  /** Shown under the empty track when `value` is `null`. */
  emptyMessage?: string
  /** Accessible name. Falls back to `label` when it is a string. */
  ariaLabel?: string
  /** Chart palette for this chart. Defaults to the nearest `data-chart` (absent = graphite). */
  palette?: ChartPalette
}

type Tone = "neutral" | "warning" | "danger"

const TONE_FILL: Record<Tone, string> = {
  neutral: "bg-chart-neutral",
  warning: "bg-warning",
  danger: "bg-danger",
}

const defaultFormatter = (v: number) => v.toLocaleString("en-US")

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function toneAt(v: number, t?: MeterThresholds): Tone {
  if (t?.danger != null && v >= t.danger) return "danger"
  if (t?.warning != null && v >= t.warning) return "warning"
  return "neutral"
}

export function Meter({
  value,
  max,
  thresholds,
  segments,
  label,
  sublabel,
  valueFormatter = defaultFormatter,
  showValue = true,
  showThresholds = true,
  height,
  loading = false,
  emptyMessage = "No usage recorded yet.",
  ariaLabel,
  palette,
  className,
  ...props
}: MeterProps) {
  const isEmpty = !loading && value == null
  const v = value ?? 0
  const safeMax = max > 0 ? max : 1
  const pct = (n: number) => (clamp(n, 0, safeMax) / safeMax) * 100
  const tone = value == null ? "neutral" : toneAt(v, thresholds)
  const barHeight = height ?? (segments ? 20 : 6)
  // Threshold guard: with limits the base fill is --chart-neutral; without, the meter reads the sequential ramp.
  const hasLimits = thresholds?.warning != null || thresholds?.danger != null
  const fillClass = (t: Tone) => (t === "neutral" && !hasLimits ? "bg-chart-seq-3" : TONE_FILL[t])

  // Fill pieces: gray up to the first limit, then each limit's tone. Pieces past the value are dropped.
  const stops: { from: number; tone: Tone }[] = [{ from: 0, tone: "neutral" }]
  if (thresholds?.warning != null) stops.push({ from: thresholds.warning, tone: "warning" })
  if (thresholds?.danger != null) stops.push({ from: thresholds.danger, tone: "danger" })
  stops.sort((a, b) => a.from - b.from)
  const pieces = stops
    .map((s, i) => ({ tone: s.tone, from: s.from, to: Math.min(v, stops[i + 1]?.from ?? Infinity) }))
    .filter((p) => p.to > p.from)

  // Segmented meters show limits through tick colour, so ticks are not overdrawn.
  const limitMarks = showThresholds && !segments
    ? [thresholds?.warning, thresholds?.danger].filter((t): t is number => t != null && t > 0 && t < safeMax)
    : []

  const name = ariaLabel ?? (typeof label === "string" ? label : "Meter")
  const toneText = tone === "danger" ? ", over the danger limit" : tone === "warning" ? ", over the warning limit" : ""
  const valueText = value == null ? emptyMessage : `${valueFormatter(v)} of ${valueFormatter(max)}${toneText}`

  return (
    <div {...chartPaletteAttr(palette)} className={cx("w-full min-w-0", className)} {...props}>
      {(label != null || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
          <span className="min-w-0 truncate text-muted-foreground">{label}</span>
          {showValue && (
            <span className="shrink-0 tabular-nums">
              {loading ? (
                <span className="inline-block h-3 w-14 animate-pulse rounded-sm bg-surface-3 align-middle motion-reduce:animate-none" />
              ) : isEmpty ? (
                <span className="text-muted-foreground-soft">{`- / ${valueFormatter(max)}`}</span>
              ) : (
                <>
                  <span
                    className={cx(
                      "font-medium",
                      tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-foreground",
                    )}
                  >
                    {valueFormatter(v)}
                  </span>
                  <span className="text-muted-foreground-soft">{` / ${valueFormatter(max)}`}</span>
                </>
              )}
            </span>
          )}
        </div>
      )}

      <div
        role="meter"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value == null ? undefined : v}
        aria-valuetext={loading ? "Loading" : valueText}
        aria-busy={loading || undefined}
        className="relative"
        style={{ height: barHeight }}
      >
        {segments ? (
          <div className="flex h-full w-full gap-[2px]">
            {Array.from({ length: segments }, (_, i) => {
              const start = (i / segments) * safeMax
              const filled = !loading && value != null && v >= start + safeMax / segments / 2
              return (
                <span
                  key={i}
                  className={cx(
                    "h-full min-w-0 flex-1 rounded-[1px]",
                    filled ? fillClass(toneAt(start, thresholds)) : "bg-foreground/[0.08]",
                    loading && "animate-pulse motion-reduce:animate-none",
                  )}
                />
              )
            })}
          </div>
        ) : (
          <div
            className={cx(
              "relative h-full w-full overflow-hidden rounded-full bg-foreground/[0.08]",
              loading && "animate-pulse motion-reduce:animate-none",
            )}
          >
            {!loading &&
              pieces.map((p) => (
                <span
                  key={p.tone}
                  className={cx("absolute inset-y-0 transition-[width] duration-200 ease-out motion-reduce:transition-none", fillClass(p.tone))}
                  style={{ left: `${pct(p.from)}%`, width: `${pct(p.to) - pct(p.from)}%` }}
                />
              ))}
          </div>
        )}
        {limitMarks.map((t) => (
          <span
            key={t}
            aria-hidden
            className="absolute -top-[3px] -bottom-[3px] w-px -translate-x-1/2 bg-muted-foreground-soft"
            style={{ left: `${pct(t)}%` }}
          />
        ))}
      </div>

      {(sublabel != null || isEmpty) && (
        <p className="mt-2 truncate text-xs text-muted-foreground-soft">{isEmpty ? emptyMessage : sublabel}</p>
      )}
    </div>
  )
}
