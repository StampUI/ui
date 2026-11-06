"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface ProgressRingProps {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  label?: string
  className?: string
}

export function ProgressRing({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 6,
  showValue = true,
  label,
  className,
}: ProgressRingProps) {
  const [current, setCurrent] = React.useState(0)
  React.useEffect(() => {
    const id = setTimeout(() => setCurrent(value), 60)
    return () => clearTimeout(id)
  }, [value])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(current / max, 0), 1)
  const offset = circumference - pct * circumference
  const center = size / 2

  return (
    <div className={cx("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      {showValue && (
        <span className="absolute text-xs font-medium tabular-nums">
          {Math.round(pct * 100)}%
        </span>
      )}
      {label && !showValue && (
        <span className="absolute text-xs font-medium">{label}</span>
      )}
    </div>
  )
}
