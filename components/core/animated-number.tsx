"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

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

export function AnimatedNumber({
  value,
  duration = 1400,
  format = "default",
  currency = "USD",
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const [current, setCurrent] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement>(null)
  const triggered = React.useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          if (reducedMotion) {
            setCurrent(value)
            return
          }
          const startTime = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 4)
            setCurrent(eased * value)
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration, reducedMotion])

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {formatValue(current, format, currency, decimals, prefix, suffix)}
    </span>
  )
}
