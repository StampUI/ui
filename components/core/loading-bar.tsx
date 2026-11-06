"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

/**
 * StampUI LoadingBar Component
 *
 * Top-of-page (or contained) linear progress indicator.
 * Use for async route transitions, API calls, and long operations.
 *
 * Indeterminate: sliding animation across the bar.
 * Determinate:   fills from left based on progress prop (0-100).
 *
 * When loading transitions false the bar completes then fades out.
 */

const barStyles = cva(
  "origin-left bg-foreground",
  {
    variants: {
      thickness: {
        thin:  "h-[2px]",
        md:    "h-[3px]",
        thick: "h-1",
      },
    },
    defaultVariants: { thickness: "md" },
  }
)

export interface LoadingBarProps extends VariantProps<typeof barStyles> {
  /** Controls visibility and animation state. */
  loading: boolean
  /** 0-100. If provided, renders a determinate bar instead of animated. */
  progress?: number
  /**
   * Position relative to nearest positioned ancestor instead of fixed to the viewport.
   * Use in playgrounds and contained layouts.
   */
  contained?: boolean
  className?: string
}

export function LoadingBar({
  loading,
  progress,
  thickness,
  contained = false,
  className,
}: LoadingBarProps) {
  const [visible, setVisible]       = React.useState(loading)
  const [completing, setCompleting] = React.useState(false)

  React.useEffect(() => {
    if (loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs bar visibility to the loading prop
      setVisible(true)
      setCompleting(false)
    } else {
      // Briefly show full bar then fade out
      setCompleting(true)
      const t = setTimeout(() => {
        setVisible(false)
        setCompleting(false)
      }, 260)
      return () => clearTimeout(t)
    }
  }, [loading])

  if (!visible) return null

  const isDeterminate = progress !== undefined
  const fillPercent   = completing ? 100 : (isDeterminate ? Math.min(100, Math.max(0, progress!)) : null)

  return (
    <>
      {/* Keyframe injection for indeterminate animation */}
      <style>{`
        @keyframes stampui-loading-bar {
          0%   { transform: translateX(-100%) scaleX(0.3); }
          50%  { transform: translateX(60%)   scaleX(1.0); }
          100% { transform: translateX(210%)  scaleX(0.3); }
        }
      `}</style>
      <div
        aria-hidden
        className={cx(
          "z-[9999] w-full overflow-hidden",
          contained ? "absolute inset-x-0 top-0" : "fixed inset-x-0 top-0",
          thickness === "thin"  ? "h-[2px]" :
          thickness === "thick" ? "h-1"     : "h-[3px]",
          className,
        )}
      >
        {isDeterminate || completing ? (
          <div
            className={cx(
              barStyles({ thickness }),
              "w-full transition-transform duration-slow ease-out",
              completing && "opacity-0 transition-opacity duration-slow",
            )}
            style={{ transform: `scaleX(${(fillPercent ?? 0) / 100})` }}
          />
        ) : (
          <div
            className={cx(barStyles({ thickness }), "w-1/2")}
            style={{ animation: "stampui-loading-bar 1.4s var(--ease-out) infinite" }}
          />
        )}
      </div>
    </>
  )
}
