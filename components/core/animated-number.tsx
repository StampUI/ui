"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

type Format = "default" | "compact" | "currency" | "percent"

export interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: Format
  currency?: string
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

function formatValue(n: number, format: Format, currency: string, decimals: number, prefix: string, suffix: string): string {
  let out: string
  if (format === "compact") {
    if (n >= 1_000_000) out = (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    else if (n >= 1_000) out = (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
    else out = Math.round(n).toString()
  } else if (format === "currency") {
    out = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: decimals }).format(n)
  } else if (format === "percent") {
    out = n.toFixed(decimals) + "%"
  } else {
    out = n.toFixed(decimals)
  }
  return prefix + out + suffix
}

const MAX_TWEEN_MS = 800

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
}

/**
 * Renders the real value on the server and on first client render (no zero flash,
 * no hydration mismatch). When `value` changes later, it tweens from the previously
 * displayed number to the new one (ease-out, capped at 800ms). With
 * prefers-reduced-motion it updates instantly.
 */
export function AnimatedNumber({
  value,
  duration = 600,
  format = "default",
  currency = "USD",
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const [current, setCurrent] = React.useState(value)
  const shownRef = React.useRef(value)

  React.useEffect(() => {
    const from = shownRef.current
    if (from === value) return

    // Reduced motion or a zero duration jumps straight to the value on the next frame.
    const ms = prefersReducedMotion() ? 0 : Math.min(Math.max(duration, 0), MAX_TWEEN_MS)

    let frame = 0
    const startTime = performance.now()
    const tick = (now: number) => {
      const t = ms === 0 ? 1 : Math.min((now - startTime) / ms, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = t < 1 ? from + (value - from) * eased : value
      shownRef.current = next
      setCurrent(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return (
    <span className={cx("tabular-nums", className)}>
      {formatValue(current, format, currency, decimals, prefix, suffix)}
    </span>
  )
}
