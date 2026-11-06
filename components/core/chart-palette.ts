"use client"

/**
 * Shared chart palette helpers (DECISION.md, docs/audit-2026-11/v4/palette).
 *
 * Colour comes from tokens split by job:
 * - identity `--chart-1..5` (which series), follows `data-chart`
 * - sequential `--chart-seq-1..5` (order / magnitude, strongest first)
 * - fixed graphite roles `--chart-neutral`, `--chart-context`,
 *   `--chart-other`, `--chart-track` (never follow `data-chart`)
 *
 * The palette is picked by `data-chart` on <html> (absent = graphite) or
 * on any ancestor, and a chart's `palette` prop overrides it locally by
 * setting `data-chart` on the chart root.
 */

import * as React from "react"

export type ChartPalette = "categorical" | "accent" | "graphite"

export const CHART_PALETTES: readonly ChartPalette[] = ["categorical", "accent", "graphite"]

export const DEFAULT_CHART_PALETTE: ChartPalette = "graphite"

/** Named-series cap on adjacency forms (donut, stack, grouped bar, labelled lines). */
export const PALETTE_CAP: Readonly<Record<ChartPalette, number>> = {
  categorical: 5,
  accent: 4,
  graphite: 3,
}

/** Named-series cap on all-pairs forms (scatter, bubble, small multiples). */
export const PALETTE_CAP_ALL_PAIRS: Readonly<Record<ChartPalette, number>> = {
  categorical: 3,
  accent: 3,
  graphite: 3,
}

export type ChartForm = "adjacency" | "all-pairs"

export function paletteCap(palette: ChartPalette, form: ChartForm = "adjacency"): number {
  return form === "all-pairs" ? PALETTE_CAP_ALL_PAIRS[palette] : PALETTE_CAP[palette]
}

/* ── Token references ─────────────────────────────────────────────────── */

/** Identity slots in fixed order. Never cycled. */
export const CHART_IDENTITY = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/** Sequential steps, strongest first. Ordinal forms only. */
export const CHART_SEQUENTIAL = [
  "var(--chart-seq-1)",
  "var(--chart-seq-2)",
  "var(--chart-seq-3)",
  "var(--chart-seq-4)",
  "var(--chart-seq-5)",
] as const

/** Supporting single-series marks, threshold base series, context bars. */
export const CHART_NEUTRAL = "var(--chart-neutral)"
/** Comparison lines (previous period, target, forecast); always dashed. */
export const CHART_CONTEXT = "var(--chart-context)"
/** The folded "Other" bucket, brush areas, compare bars; always labelled. */
export const CHART_OTHER = "var(--chart-other)"
/** Tracks, empty segments, remaining capacity; never data. */
export const CHART_TRACK = "var(--chart-track)"

export const OTHER_LABEL = "Other"

/** Identity colour for slot index `i` (0-based). Past slot 5 returns `--chart-other`. */
export function identityColor(i: number): string {
  return CHART_IDENTITY[i] ?? CHART_OTHER
}

/**
 * Sequential colour for step `i` of `n` ordered steps (0 = strongest).
 * Steps are spread across the 5-step ramp so the ends always use seq-1 and seq-5.
 */
export function sequentialColor(i: number, n: number = CHART_SEQUENTIAL.length): string {
  if (n <= 1) return CHART_SEQUENTIAL[0]
  const idx = Math.round((Math.min(Math.max(i, 0), n - 1) * (CHART_SEQUENTIAL.length - 1)) / (n - 1))
  return CHART_SEQUENTIAL[idx]
}

/** Sequential colour for a magnitude ratio in [0, 1] (1 = strongest, seq-1). */
export function sequentialColorForRatio(ratio: number): string {
  const r = Number.isFinite(ratio) ? Math.min(Math.max(ratio, 0), 1) : 0
  return CHART_SEQUENTIAL[Math.round((1 - r) * (CHART_SEQUENTIAL.length - 1))]
}

/* ── Palette resolution ───────────────────────────────────────────────── */

export function isChartPalette(value: unknown): value is ChartPalette {
  return value === "categorical" || value === "accent" || value === "graphite"
}

/** Resolve the palette for an element: nearest `[data-chart]` ancestor (incl. self), else <html>, else graphite. */
export function resolveChartPalette(el: Element | null | undefined): ChartPalette {
  if (typeof document === "undefined") return DEFAULT_CHART_PALETTE
  const host = el?.closest("[data-chart]") ?? document.documentElement
  const value = host.getAttribute("data-chart")
  return isChartPalette(value) ? value : DEFAULT_CHART_PALETTE
}

/** Spread onto a chart root so a `palette` prop scopes the tokens to that chart. */
export function chartPaletteAttr(palette?: ChartPalette): { "data-chart"?: ChartPalette } {
  return palette ? { "data-chart": palette } : {}
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Resolve the active palette: the `palette` prop, else `ref.current.closest("[data-chart]")`,
 * else <html data-chart>, else "graphite". Re-resolves when any `data-chart` attribute changes.
 */
export function useChartPalette(
  ref: React.RefObject<Element | null>,
  palette?: ChartPalette,
): ChartPalette {
  const [resolved, setResolved] = React.useState<ChartPalette>(palette ?? DEFAULT_CHART_PALETTE)

  useIsoLayoutEffect(() => {
    if (palette) {
      setResolved(palette)
      return
    }
    const update = () => setResolved(resolveChartPalette(ref.current))
    update()
    if (typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-chart"],
      subtree: true,
    })
    return () => observer.disconnect()
  }, [palette, ref])

  return resolved
}

/* ── Fold to Other ────────────────────────────────────────────────────── */

export interface FoldResult<T> {
  /** Kept entities, in their original order. */
  kept: T[]
  /** Folded entities (smallest), in their original order. Empty when nothing folded. */
  folded: T[]
}

/**
 * Keep the `cap` largest entities (by `getValue`) and fold the rest.
 * Kept entities keep their original order, so slot assignment follows the
 * entity, never its rank. Nothing folds when `items.length <= cap`.
 */
export function foldToOther<T>(
  items: readonly T[],
  cap: number,
  getValue: (item: T) => number,
): FoldResult<T> {
  if (items.length <= cap) return { kept: [...items], folded: [] }
  const ranked = items
    .map((item, index) => ({ index, value: Math.abs(getValue(item) || 0) }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
  const keep = new Set(ranked.slice(0, Math.max(cap, 0)).map((r) => r.index))
  const kept: T[] = []
  const folded: T[] = []
  items.forEach((item, index) => (keep.has(index) ? kept : folded).push(item))
  return { kept, folded }
}

export interface FoldSeriesResult<R> {
  data: R[]
  /** Kept keys in original order, plus `otherKey` last when anything folded. */
  keys: string[]
  folded: string[]
  otherKey: string | null
}

/**
 * Fold series keys of row-shaped data past `cap`. The folded keys are summed
 * per row into `otherKey`. Ranking is by the total of each key across rows.
 */
export function foldSeries<R extends object>(
  data: readonly R[],
  keys: readonly string[],
  cap: number,
  otherKey: string = OTHER_LABEL,
): FoldSeriesResult<R> {
  const num = (row: R, key: string) => {
    const v = (row as Record<string, unknown>)[key]
    return typeof v === "number" && Number.isFinite(v) ? v : 0
  }
  const { kept, folded } = foldToOther(keys, cap, (key) =>
    data.reduce((sum, row) => sum + Math.abs(num(row, key)), 0),
  )
  if (folded.length === 0) return { data: [...data], keys: [...keys], folded: [], otherKey: null }
  const rows = data.map((row) => {
    const next: Record<string, unknown> = { ...(row as Record<string, unknown>) }
    for (const key of folded) delete next[key]
    next[otherKey] = folded.reduce((sum, key) => sum + num(row, key), 0)
    return next as R
  })
  return { data: rows, keys: [...kept, otherKey], folded, otherKey }
}

/** Colour for the `i`th kept key in a folded series list (`otherKey` gets `--chart-other`). */
export function foldedSeriesColor(key: string, i: number, otherKey: string | null): string {
  return otherKey !== null && key === otherKey ? CHART_OTHER : identityColor(i)
}
