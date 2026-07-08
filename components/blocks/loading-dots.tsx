"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface LoadingDotsProps {
  variant?: "bounce" | "pulse" | "bars"
  size?: "sm" | "md" | "lg"
  className?: string
}

const dotSizes = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-3 w-3",
}

const barHeights = {
  sm: "h-4",
  md: "h-5",
  lg: "h-7",
}

export function LoadingDots({
  variant = "bounce",
  size = "md",
  className,
}: LoadingDotsProps) {
  if (variant === "bounce") {
    return (
      <div className={cx("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cx("rounded-full bg-foreground animate-bounce motion-reduce:animate-none", dotSizes[size])}
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cx("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cx("rounded-full bg-foreground animate-pulse motion-reduce:animate-none", dotSizes[size])}
            style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1.2s" }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cx("flex items-center gap-1", className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cx("w-1 rounded-sm bg-foreground origin-bottom animate-[bars_1s_ease-in-out_infinite] motion-reduce:animate-none", barHeights[size])}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  )
}
