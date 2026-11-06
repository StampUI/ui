"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const barStyles = cva(
  "fixed top-0 left-0 z-[9999] w-full origin-left",
  {
    variants: {
      color: {
        default: "bg-foreground/75",
        primary: "bg-foreground",
        /* Legacy names, kept for API compatibility. Solid monochrome fills. */
        gradient: "bg-foreground/50",
        warm: "bg-muted-foreground",
      },
      thickness: {
        thin: "h-[2px]",
        md: "h-[3px]",
        thick: "h-1",
      },
    },
    defaultVariants: { color: "default", thickness: "md" },
  }
)

export interface ReadingProgressProps extends VariantProps<typeof barStyles> {
  /** CSS selector of the scrollable container. Defaults to the window. */
  target?: string
  className?: string
}

export function ReadingProgress({ color, thickness, target, className }: ReadingProgressProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const container = target ? document.querySelector(target) : null

    const handleScroll = () => {
      if (container) {
        const el = container as HTMLElement
        const pct = el.scrollHeight - el.clientHeight > 0
          ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
          : 0
        setProgress(Math.min(100, Math.max(0, pct)))
      } else {
        const root = document.documentElement
        const pct = root.scrollHeight - root.clientHeight > 0
          ? (window.scrollY / (root.scrollHeight - root.clientHeight)) * 100
          : 0
        setProgress(Math.min(100, Math.max(0, pct)))
      }
    }

    const source: EventTarget = container ?? window
    source.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => source.removeEventListener("scroll", handleScroll)
  }, [target])

  return (
    <div
      aria-hidden
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx(barStyles({ color, thickness }), "transition-transform duration-75 ease-out", className)}
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  )
}
