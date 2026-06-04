"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface GradientTextProps {
  children: React.ReactNode
  colors?: string[]
  speed?: number
  animate?: boolean
  as?: keyof React.JSX.IntrinsicElements
  className?: string
}

export function GradientText({
  children,
  colors = ["#FAFAFA", "#71717A", "#FAFAFA"],
  speed = 4,
  animate = true,
  as: Tag = "span" as keyof React.JSX.IntrinsicElements,
  className,
}: GradientTextProps) {
  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "300% 100%",
    ...(animate ? { animation: `gradient-pan ${speed}s linear infinite` } : {}),
  }

  const Component = Tag as React.ElementType

  return (
    <Component
      className={cx("bg-clip-text text-transparent", className)}
      style={style}
    >
      {children}
    </Component>
  )
}
