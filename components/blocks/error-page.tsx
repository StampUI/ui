"use client"

import * as React from "react"
import { Button } from "@/components/core/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/core/select"
import { cx } from "@/lib/cx"

// ── Error state (reusable content) ──────────────────────────────────────────

export interface ErrorStateProps {
  /** Small mono status code, e.g. "404" or "500 · err_8f3k2x". */
  code: string
  title: string
  description: React.ReactNode
  /** Buttons or links rendered under the description. Keep it to two. */
  actions?: React.ReactNode
  /** Alternative to actions. */
  children?: React.ReactNode
  className?: string
}

// Quiet status screen: a small mono code, a medium title, one sentence of
// context and at most two actions. Fills its flex parent and centers the
// content vertically.
export function ErrorState({
  code,
  title,
  description,
  actions,
  children,
  className,
}: ErrorStateProps) {
  const content = actions ?? children
  return (
    <div className={cx("mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24", className)}>
      <p className="font-mono text-sm tabular-nums text-muted-foreground-soft">{code}</p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {content && <div className="mt-6 flex flex-wrap items-center gap-4">{content}</div>}
    </div>
  )
}

// ── Page variants ────────────────────────────────────────────────────────────

export type ErrorVariant = "404" | "403" | "500" | "maintenance"

type VariantConfig = {
  label: string
  code: string
  title: string
  description: string
  primaryCta: string
  secondaryCta?: string
}

const VARIANTS: Record<ErrorVariant, VariantConfig> = {
  "404": {
    label: "404, Not found",
    code: "404",
    title: "This page does not exist",
    description: "The link may be outdated or mistyped. Check the URL or head back to your workspace.",
    primaryCta: "Back to dashboard",
    secondaryCta: "Go back",
  },
  "403": {
    label: "403, Forbidden",
    code: "403",
    title: "You do not have access to this project",
    description: "Ask a workspace admin to add you to Northwind Platform, or switch to an account that has access.",
    primaryCta: "Request access",
    secondaryCta: "Switch account",
  },
  "500": {
    label: "500, Server error",
    code: "500 · err_8f3k2x",
    title: "This page failed to load",
    description: "Something broke on our side. Try again, and if it keeps happening, contact support with the code above.",
    primaryCta: "Try again",
    secondaryCta: "Back to dashboard",
  },
  "maintenance": {
    label: "503, Maintenance",
    code: "503",
    title: "Down for scheduled maintenance",
    description: "We are upgrading the database cluster. Expected back by 14:30 UTC, follow progress on the status page.",
    primaryCta: "Refresh",
    secondaryCta: "View status",
  },
}

const VARIANT_ORDER: ErrorVariant[] = ["404", "403", "500", "maintenance"]

// ── Main component ────────────────────────────────────────────────────────────

export function ErrorPage({ defaultVariant = "404" }: { defaultVariant?: ErrorVariant }) {
  const [variant, setVariant] = React.useState<ErrorVariant>(defaultVariant)
  const v = VARIANTS[variant]

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background">
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
            S
          </span>
          <span className="truncate text-sm font-semibold text-foreground">StampUI</span>
        </div>
        <Select value={variant} onValueChange={(val) => setVariant(val as ErrorVariant)}>
          <SelectTrigger aria-label="Preview variant" className="h-7 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VARIANT_ORDER.map((key) => (
              <SelectItem key={key} value={key}>{VARIANTS[key].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <main className="flex flex-1 min-h-0 flex-col overflow-y-auto">
        <ErrorState
          code={v.code}
          title={v.title}
          description={v.description}
          actions={
            <>
              <Button size="sm">{v.primaryCta}</Button>
              {v.secondaryCta && (
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
                >
                  {v.secondaryCta}
                </button>
              )}
            </>
          }
        />
      </main>
    </div>
  )
}
