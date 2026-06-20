"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface OrbitTrailProps {
  size?: number
  className?: string
}

export function OrbitTrail({ size = 64, className }: OrbitTrailProps) {
  return (
    <div className={cx("inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* inner orbit: fast, radius 10 */}
        <circle cx="42" cy="32" r="3.5" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="0.85s" repeatCount="indefinite" />
        </circle>
        {/* mid orbit: medium, radius 16 */}
        <circle cx="48" cy="32" r="2.8" fill="currentColor" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="120 32 32" to="480 32 32" dur="1.4s" repeatCount="indefinite" />
        </circle>
        {/* outer orbit: slow, radius 22 */}
        <circle cx="54" cy="32" r="2" fill="currentColor" opacity="0.45">
          <animateTransform attributeName="transform" type="rotate" from="240 32 32" to="600 32 32" dur="2.1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
