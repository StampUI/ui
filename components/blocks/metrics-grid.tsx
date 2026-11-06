"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cx } from "@/lib/cx"

export interface MetricChange {
  value: string
  direction: "up" | "down" | "neutral"
}

export interface MetricItem {
  label: string
  value: string
  change?: MetricChange
  icon?: LucideIcon
  description?: string
}

export interface MetricsGridProps {
  metrics?: MetricItem[]
  columns?: 2 | 3 | 4
  className?: string
}

const defaultMetrics: MetricItem[] = [
  {
    label: "Monthly revenue",
    value: "$48,290",
    change: { value: "+12.4%", direction: "up" },
  },
  {
    label: "Active users",
    value: "9,841",
    change: { value: "+3.1%", direction: "up" },
  },
  {
    label: "Churn rate",
    value: "2.3%",
    change: { value: "+0.4%", direction: "down" },
  },
  {
    label: "Avg. session",
    value: "4m 12s",
    change: { value: "0%", direction: "neutral" },
  },
]

const colClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

const changeStyles: Record<MetricChange["direction"], string> = {
  /* Positive movement stays neutral; only a move in the wrong direction gets color. */
  up: "text-foreground-soft",
  down: "text-danger",
  neutral: "text-muted-foreground",
}

export function MetricsGrid({
  metrics = defaultMetrics,
  columns = 4,
  className,
}: MetricsGridProps) {
  return (
    <div className={cx("w-full", className)}>
      {/* One surface, divided internally */}
      <div className={cx("grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border-soft bg-border-soft", colClass[columns])}>
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          const change = metric.change

          return (
            <div
              key={i}
              className="flex flex-col gap-2 bg-card px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </span>
                {Icon && (
                  <Icon
                    size={15}
                    className="text-muted-foreground opacity-60"
                    strokeWidth={1.5}
                  />
                )}
              </div>

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-xl font-medium leading-none tracking-tight tabular-nums text-foreground">
                  {metric.value}
                </p>
                  {change && (
                    <span
                      className={cx(
                        "text-xs font-medium tabular-nums",
                        changeStyles[change.direction]
                      )}
                    >
                      {change.value}
                    </span>
                  )}
              </div>
              {metric.description && (
                <span className="text-xs text-muted-foreground-soft">
                  {metric.description}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
