"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/core/card"
import { Badge } from "@/components/core/badge"
import { Separator } from "@/components/core/separator"

interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
}

const stats: Stat[] = [
  { label: "Total revenue",    value: "$48,295", change: "+12.5%", trend: "up"   },
  { label: "Active users",     value: "3,842",   change: "+8.1%",  trend: "up"   },
  { label: "Conversion rate",  value: "4.6%",    change: "-0.4%",  trend: "down" },
  { label: "Avg. order value", value: "$127",    change: "+3.2%",  trend: "up"   },
]

export function StatCards() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <Badge variant="neutral">Last 30 days vs previous</Badge>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border-soft">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1.5 bg-card p-3">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <p className="text-lg font-medium tracking-tight tabular-nums text-foreground">{stat.value}</p>
                <span className={`text-xs font-medium tabular-nums ${stat.trend === "up" ? "text-foreground-soft" : "text-danger"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <p className="text-xs text-muted-foreground text-center">
          Updated just now · <span className="text-foreground cursor-pointer hover:underline">View full report</span>
        </p>
      </CardBody>
    </Card>
  )
}
