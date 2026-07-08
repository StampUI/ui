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
    <div
      className={cx("overflow-hidden [--marquee-gap:var(--gap)] flex w-full", className)}
      style={{ "--gap": `${gap}px` } as React.CSSProperties}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - var(--gap) / 2)); }
        }
        @keyframes marquee-right {
          from { transform: translateX(calc(-50% - var(--gap) / 2)); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-marquee-track] { animation: none !important; }
          [data-marquee-clone] { display: none; }
        }
      `}</style>
      <div
        data-marquee-track
        className={cx(
          "flex min-w-full shrink-0 items-center",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          gap: `${gap}px`,
          animationName: animation,
          animationDuration: duration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div data-marquee-clone className="flex shrink-0 items-center" style={{ gap: `${gap}px` }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
