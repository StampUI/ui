"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

export interface GridWaveProps {
  size?: number
  className?: string
}

export function GridWave({ size = 64, className }: GridWaveProps) {
  const count = 4
  const spacing = 14
  const r = 3
  const start = (64 - (count - 1) * spacing) / 2
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className={cx("inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {Array.from({ length: count }, (_, row) =>
          Array.from({ length: count }, (_, col) => {
            const delay = ((row + col) * 0.14).toFixed(2)
            return (
              <circle
                key={`${row}-${col}`}
                cx={start + col * spacing}
                cy={start + row * spacing}
                r={r}
                fill="currentColor"
              >
                {!reducedMotion && (
                  <>
                    <animate attributeName="opacity" values="0.12;1;0.12" dur="1.3s" begin={`${delay}s`} repeatCount="indefinite" />
                    <animate attributeName="r" values={`${r * 0.6};${r};${r * 0.6}`} dur="1.3s" begin={`${delay}s`} repeatCount="indefinite" />
                  </>
                )}
              </circle>
            )
          })
        )}
      </svg>
    </div>
  )
}
