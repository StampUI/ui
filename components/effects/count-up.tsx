"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { useEntrance } from "@/components/effects/use-entrance"

export interface CountUpProps {
  /** The number to land on. */
  value: number
  /** Where the count starts when it scrolls into view. */
  from?: number
  /** Count duration in ms, ease-out. */
  duration?: number
  /** Digits after the decimal point. */
  decimals?: number
  prefix?: string
  suffix?: string
  /** Locale for grouping and the decimal mark. */
  locale?: string
  className?: string
}

/**
 * A number that counts up once when it scrolls into view (ease-out, 800ms).
 * The real value is rendered on the server and stays put when the number is
 * already on screen at load, so it never flashes back to zero. Grouping and
 * decimals come from Intl.NumberFormat; digits are tabular so the width holds.
 * Reduced motion shows the value at once.
 */
export function CountUp({
  value,
  from = 0,
  duration = 800,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-US",
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const phase = useEntrance(ref)
  const [shown, setShown] = React.useState(from)

  React.useEffect(() => {
    if (phase !== "play") return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setShown(from + (value - from) * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, value, from, duration])

  const current = phase === "armed" ? from : phase === "idle" ? value : shown
  const format = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      <span className="sr-only">{prefix + format.format(value) + suffix}</span>
      <span aria-hidden>{prefix + format.format(current) + suffix}</span>
    </span>
  )
}
