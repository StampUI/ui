"use client"

import * as React from "react"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface CtaAction {
  label: string
  href?: string
  onClick?: () => void
}

export interface CtaBannerProps {
  headline?: string
  subtext?: string
  primaryCta?: CtaAction
  secondaryCta?: CtaAction
  className?: string
}

export function CtaBanner({
  headline = "Ready to stamp your first block?",
  subtext = "Copy production-ready components into your project in seconds. No lock-in, no runtime.",
  primaryCta = { label: "Get Started", href: "/blocks" },
  secondaryCta = { label: "Read the Docs", href: "/docs" },
  className,
}: CtaBannerProps) {
  return (
    <section
      className={cx(
        "w-full border-t border-[#23252A] py-20 px-6",
        "flex flex-col items-center text-center",
        className
      )}
    >
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA] max-w-xl leading-tight">
        {headline}
      </h2>

      {subtext && (
        <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
          {subtext}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {primaryCta && (
          <Button
            asChild={!!primaryCta.href}
            onClick={primaryCta.onClick}
            size="lg"
          >
            {primaryCta.href ? (
              <a href={primaryCta.href}>{primaryCta.label}</a>
            ) : (
              <span>{primaryCta.label}</span>
            )}
          </Button>
        )}
        {secondaryCta && (
          <Button
            asChild={!!secondaryCta.href}
            onClick={secondaryCta.onClick}
            variant="outline"
            size="lg"
          >
            {secondaryCta.href ? (
              <a href={secondaryCta.href}>{secondaryCta.label}</a>
            ) : (
              <span>{secondaryCta.label}</span>
            )}
          </Button>
        )}
      </div>
    </section>
  )
}
