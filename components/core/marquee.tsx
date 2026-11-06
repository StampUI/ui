import * as React from "react"
import { cx } from "@/lib/cx"

export interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  gap?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  gap = 16,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const duration = `${speed}s`
  const animation = direction === "left" ? "marquee-left" : "marquee-right"

  return (
    <div className={cx("overflow-hidden flex w-full", className)}>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
      <div
        className={cx(
          // Reduced motion stops the loop (the inline animation needs !important)
          // and hides the duplicate copy below so nothing shows twice.
          "flex shrink-0 motion-reduce:animate-none!",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationName: animation,
          animationDuration: duration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {/* paddingRight on each copy = gap, so every copy carries its own
            trailing space. Total = 2×copy_width → -50% shifts exactly
            one copy, keeping uniform gap at the loop boundary. */}
        <div
          className="flex shrink-0 items-center"
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
        >
          {children}
        </div>
        <div
          className="flex shrink-0 items-center motion-reduce:hidden"
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  )
}
