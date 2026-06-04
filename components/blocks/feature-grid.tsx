import * as React from "react"
import { cx } from "@/lib/cx"

export interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

export interface FeatureGridProps {
  eyebrow?: string
  headline?: string
  subtext?: string
  features?: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

const defaultFeatures: Feature[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Instant Install",
    description: "One CLI command stamps any block directly into your project. No config, no setup, no runtime dependency.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Full Source Ownership",
    description: "The code lands in your repo. No dependency to maintain, no upstream surprises. Customize it freely.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    title: "AI-Ready Prompts",
    description: "Every block ships with optimized prompts for Cursor, Claude, v0, and Bolt. Describe what you want, get it built.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Accessible by Default",
    description: "Built on Radix UI primitives. Keyboard navigation, ARIA attributes, and screen reader support out of the box.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: "Dark Mode Native",
    description: "Every component is built with CSS variables and supports dark mode out of the box. No extra config.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Themeable",
    description: "Token-based design system. Change one CSS variable, every component updates. Consistent without effort.",
  },
]

const colClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

export function FeatureGrid({
  eyebrow = "Why StampUI",
  headline = "Built for how you actually ship",
  subtext,
  features = defaultFeatures,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <section className={cx("w-full py-24 px-6", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          {eyebrow && (
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">{eyebrow}</p>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{headline}</h2>
          {subtext && (
            <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">{subtext}</p>
          )}
        </div>

        <div className={cx("grid grid-cols-1 gap-8", colClass[columns])}>
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-foreground">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
