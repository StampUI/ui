"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
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
    label: "Monthly Revenue",
    value: "$48,290",
    change: { value: "+12.4%", direction: "up" },
    description: "vs. last month",
  },
  {
    label: "Active Users",
    value: "9,841",
    change: { value: "+3.1%", direction: "up" },
    description: "vs. last month",
  },
  {
    label: "Churn Rate",
    value: "2.3%",
    change: { value: "+0.4%", direction: "down" },
    description: "vs. last month",
  },
  {
    label: "Avg. Session",
    value: "4m 12s",
    change: { value: "0%", direction: "neutral" },
    description: "vs. last month",
  },
]

const colClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

const changeStyles: Record<MetricChange["direction"], string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-muted-foreground",
}

const ChangeIcon: Record<MetricChange["direction"], LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

export function MetricsGrid({
  metrics = defaultMetrics,
  columns = 4,
  className,
}: MetricsGridProps) {
  return (
    <div className={cx("w-full", className)}>
      <div className={cx("grid grid-cols-1 gap-4", colClass[columns])}>
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          const change = metric.change
          const ChangeIconComp = change ? ChangeIcon[change.direction] : null

          return (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-[#23252A] bg-[#09090B] p-5 transition-colors duration-150 ease-out hover:border-[#2e3035] hover:bg-[#0c0c0f]"
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

              <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                {metric.value}
              </p>

              {(change || metric.description) && (
                <div className="flex items-center gap-1.5">
                  {change && ChangeIconComp && (
                    <ChangeIconComp
                      size={13}
                      className={changeStyles[change.direction]}
                      strokeWidth={2}
                    />
                  )}
                  {change && (
                    <span
                      className={cx(
                        "text-xs font-medium",
                        changeStyles[change.direction]
                      )}
                    >
                      {change.value}
                    </span>
                  )}
                  {metric.description && (
                    <span className="text-xs text-muted-foreground">
                      {metric.description}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
