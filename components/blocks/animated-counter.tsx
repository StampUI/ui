"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  onComplete?: () => void
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  onComplete,
}: AnimatedCounterProps) {
  const [value, setValue] = React.useState(from)
  const startTimeRef = React.useRef<number | null>(null)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    startTimeRef.current = null
    const startValue = from

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    function step(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = startValue + (to - startValue) * eased
      setValue(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setValue(to)
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [from, to, duration, decimals, onComplete])

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={cx("tabular-nums", className)}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
