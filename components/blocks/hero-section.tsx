import * as React from "react"
import { Badge } from "@/components/core/badge"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface HeroSectionProps {
  eyebrow?: string
  headline?: string
  subtext?: string
  primaryCta?: { label: string; href?: string; onClick?: () => void }
  secondaryCta?: { label: string; href?: string; onClick?: () => void }
  align?: "left" | "center"
  className?: string
}

export function HeroSection({
  eyebrow = "Now in public beta",
  headline = "Your app works.\nNow make it look shipped.",
  subtext = "Production-ready UI blocks stamped directly into your project. No runtime, no lock-in, just clean code you own.",
  primaryCta = { label: "Browse Blocks", href: "/blocks" },
  secondaryCta = { label: "View Components", href: "/blocks/components" },
  align = "center",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cx(
        "w-full py-24 px-6",
        align === "center" && "flex flex-col items-center text-center",
        align === "left" && "flex flex-col items-start text-left max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <Badge variant="neutral" className="mb-6 font-mono text-xs tracking-wider">
          {eyebrow}
        </Badge>
      )}

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight whitespace-pre-line max-w-3xl">
        {headline}
      </h1>

      {subtext && (
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          {subtext}
        </p>
      )}

      <div className={cx("mt-10 flex flex-wrap gap-3", align === "center" && "justify-center")}>
        {primaryCta && (
          <Button
            asChild={!!primaryCta.href}
            onClick={primaryCta.onClick}
            size="lg"
          >
            {primaryCta.href ? <a href={primaryCta.href}>{primaryCta.label}</a> : <span>{primaryCta.label}</span>}
          </Button>
        )}
        {secondaryCta && (
          <Button
            asChild={!!secondaryCta.href}
            onClick={secondaryCta.onClick}
            variant="outline"
            size="lg"
          >
            {secondaryCta.href ? <a href={secondaryCta.href}>{secondaryCta.label}</a> : <span>{secondaryCta.label}</span>}
          </Button>
        )}
      </div>
    </section>
  )
}
