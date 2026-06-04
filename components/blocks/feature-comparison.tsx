"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface ComparisonPlan {
  name: string
  highlighted?: boolean
}

export interface ComparisonFeature {
  label: string
  values: (boolean | string)[]
}

export interface FeatureComparisonProps {
  plans?: ComparisonPlan[]
  features?: ComparisonFeature[]
  className?: string
}

const defaultPlans: ComparisonPlan[] = [
  { name: "Free" },
  { name: "Pro", highlighted: true },
  { name: "Team" },
]

const defaultFeatures: ComparisonFeature[] = [
  { label: "Components", values: ["50", "200+", "200+"] },
  { label: "CLI access", values: [true, true, true] },
  { label: "Custom themes", values: [false, true, true] },
  { label: "Team seats", values: ["1", "1", "Unlimited"] },
  { label: "Priority support", values: [false, false, true] },
  { label: "Private blocks", values: [false, true, true] },
  { label: "Analytics", values: [false, false, true] },
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="text-[#FAFAFA] text-sm font-medium">✓</span>
    ) : (
      <span className="text-muted-foreground text-sm opacity-40">—</span>
    )
  }
  return <span className="text-sm text-[#FAFAFA]">{value}</span>
}

export function FeatureComparison({
  plans = defaultPlans,
  features = defaultFeatures,
  className,
}: FeatureComparisonProps) {
  return (
    <div className={cx("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th className="w-[40%] pb-4 pr-4 text-left">
              <span className="sr-only">Feature</span>
            </th>
            {plans.map((plan, i) => (
              <th
                key={i}
                className={cx(
                  "pb-4 px-4 text-center text-sm font-semibold text-[#FAFAFA]",
                  plan.highlighted && "rounded-t-xl bg-[#101114]"
                )}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, fi) => {
            const isLast = fi === features.length - 1
            return (
              <tr
                key={fi}
                className="border-t border-[#23252A] transition-colors duration-150 ease-out hover:bg-[#09090B]"
              >
                <td
                  className={cx(
                    "py-3 pr-4 text-sm text-muted-foreground",
                    isLast && "pb-4"
                  )}
                >
                  {feature.label}
                </td>
                {plans.map((plan, pi) => (
                  <td
                    key={pi}
                    className={cx(
                      "px-4 py-3 text-center",
                      plan.highlighted && "bg-[#101114]",
                      isLast && plan.highlighted && "rounded-b-xl pb-4"
                    )}
                  >
                    <CellValue value={feature.values[pi] ?? false} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
