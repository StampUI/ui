"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface ShimmerTextProps {
  /** Short status text, e.g. "Generating report". */
  text: string
  /** While true the sheen loops. Set false when the work is done: the text settles on the foreground colour. */
  active?: boolean
  /** One full cycle in ms. */
  duration?: number
  className?: string
}

const CSS = `
@keyframes stp-shimmer-text {
  0%, 36%, 100% { color: var(--muted-foreground); }
  18% { color: var(--foreground); }
}
@media (prefers-reduced-motion: no-preference) {
  .stp-shimmer-char { animation: stp-shimmer-text var(--stp-duration, 2400ms) ease-in-out infinite; }
}
`

/**
 * A quiet sheen that travels across status text while something is working.
 * No gradient and no glow: each character steps from the muted to the
 * foreground tone and back, offset by its position, so a soft band of
 * contrast moves left to right. Reduced motion shows the muted text still.
 */
export function ShimmerText({ text, active = true, duration = 2400, className }: ShimmerTextProps) {
  if (!active) return <span className={cx("text-foreground", className)}>{text}</span>

  const chars = [...text]
  // The band crosses the text in the first ~60% of the cycle, then rests.
  const spread = duration * 0.6
  return (
    <span
      className={cx("text-muted-foreground", className)}
      style={{ "--stp-duration": `${duration}ms` } as React.CSSProperties}
    >
      <style href="stp-shimmer-text" precedence="default">{CSS}</style>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {chars.map((ch, i) => (
          <span
            key={i}
            className="stp-shimmer-char"
            style={{ animationDelay: `${Math.round((i / Math.max(chars.length, 1)) * spread)}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  )
}
