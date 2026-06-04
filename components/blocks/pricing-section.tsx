"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cx } from "@/lib/cx"

interface PricingTier {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For side projects and personal use.",
    features: [
      "Up to 3 projects",
      "Core UI components",
      "Community support",
      "MIT license",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For teams shipping production products.",
    features: [
      "Unlimited projects",
      "All UI components",
      "Advanced blocks",
      "Priority support",
      "Private registry",
      "Team access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with custom requirements.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
      "Custom licensing",
      "Source audit",
    ],
    cta: "Contact Sales",
  },
]

interface PricingSectionProps {
  tiers?: PricingTier[]
  onSelect?: (tier: PricingTier) => void
}

export function PricingSection({ tiers = DEFAULT_TIERS, onSelect }: PricingSectionProps) {
  return (
    <section className="w-full py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Start free. Scale when you need to. No hidden fees, no per-seat traps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cx(
                "relative flex flex-col rounded-2xl border p-6 transition-shadow",
                tier.highlighted
                  ? "border-border-strong bg-surface-2 shadow-lg -mt-2 mb-[-0.5rem]"
                  : "border-border bg-card"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">{tier.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold tracking-tight">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground pb-1">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelect?.(tier)}
                className={cx(
                  "w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-surface-2 hover:bg-surface-3 text-foreground"
                )}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
