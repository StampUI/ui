"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

export interface SignalArcProps {
  size?: number
  className?: string
}

export function SignalArc({ size = 64, className }: SignalArcProps) {
  const reducedMotion = usePrefersReducedMotion()
  const rings = [
    { r: 6, dur: "1.6s", begin: "0s" },
    { r: 6, dur: "1.6s", begin: "0.4s" },
    { r: 6, dur: "1.6s", begin: "0.8s" },
    { r: 6, dur: "1.6s", begin: "1.2s" },
  ]

  return (
    <div className={cx("inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="3" fill="currentColor" />
        {rings.map((ring, i) => (
          <circle key={i} cx="32" cy="32" r={ring.r} stroke="currentColor" strokeWidth="1.5" fill="none">
            {!reducedMotion && (
              <>
                <animate attributeName="r" values={`${ring.r};28`} dur={ring.dur} begin={ring.begin} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.8 1" />
                <animate attributeName="opacity" values="0.8;0" dur={ring.dur} begin={ring.begin} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.8 1" />
              </>
            )}
          </circle>
        ))}
      </svg>
    </div>
  )
}
