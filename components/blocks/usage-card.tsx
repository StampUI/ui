"use client"

import * as React from "react"
import { Zap, Database, Users, ArrowUpRight } from "lucide-react"
import { cx } from "@/lib/cx"

interface UsageMetric {
  label: string
  used: number
  limit: number
  unit?: string
  icon?: React.ReactNode
}

const DEFAULT_METRICS: UsageMetric[] = [
  {
    label: "API Requests",
    used: 48200,
    limit: 100000,
    unit: "req",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  {
    label: "Storage",
    used: 2.4,
    limit: 10,
    unit: "GB",
    icon: <Database className="h-3.5 w-3.5" />,
  },
  {
    label: "Seats",
    used: 3,
    limit: 5,
    unit: "users",
    icon: <Users className="h-3.5 w-3.5" />,
  },
]

interface UsageCardProps {
  plan?: string
  renewsAt?: string
  metrics?: UsageMetric[]
  onUpgrade?: () => void
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function UsageBar({ pct }: { pct: number }) {
  const clamped = Math.min(pct, 100)
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
      <div
        className={cx(
          "h-full rounded-full transition-all",
          clamped >= 90 ? "bg-danger" : clamped >= 70 ? "bg-warning" : "bg-primary"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function UsageCard({
  plan = "Pro",
  renewsAt,
  metrics = DEFAULT_METRICS,
  onUpgrade,
}: UsageCardProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Current Plan</p>
          <p className="text-lg font-semibold">{plan}</p>
          {renewsAt && (
            <p className="text-xs text-muted-foreground mt-0.5">Renews {renewsAt}</p>
          )}
        </div>
        {onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium hover:bg-surface-3 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong"
          >
            Upgrade
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {metrics.map((m) => {
          const pct = (m.used / m.limit) * 100
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {m.icon}
                  <span>{m.label}</span>
                </div>
                <span className="text-xs font-mono text-foreground">
                  {formatNumber(m.used)}{m.unit && ` ${m.unit}`}
                  <span className="text-muted-foreground"> / {formatNumber(m.limit)}{m.unit && ` ${m.unit}`}</span>
                </span>
              </div>
              <UsageBar pct={pct} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
