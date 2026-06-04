"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface LoadingCardProps {
  showAvatar?: boolean
  lines?: number
  showAction?: boolean
  className?: string
}

const shimmerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.8s ease-in-out infinite",
}

function Bone({ className }: { className?: string }) {
  return <div className={cx("rounded-md", className)} style={shimmerStyle} />
}

export function LoadingCard({
  showAvatar = true,
  lines = 3,
  showAction = false,
  className,
}: LoadingCardProps) {
  return (
    <div className={cx("rounded-xl border border-border bg-card p-5 space-y-4", className)}>
      {showAvatar && (
        <div className="flex items-center gap-3">
          <Bone className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-3 w-2/5" />
            <Bone className="h-2.5 w-1/3" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Bone key={i} className={cx("h-2.5", i === lines - 1 ? "w-3/4" : "w-full")} />
        ))}
      </div>
      {showAction && <Bone className="h-8 w-20 rounded-lg" />}
    </div>
  )
}
