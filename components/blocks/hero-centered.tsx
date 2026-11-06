"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/core/button"
import { CommandBox } from "@/components/core/command-box"
import { RevealIf, RevealText, StaggerIf } from "@/components/effects/motion-gate"
import { cx } from "@/lib/cx"

export interface HeroCenteredAction {
  label: string
  href: string
}

export interface HeroCenteredProps {
  /** Optional line above the headline. */
  eyebrow?: React.ReactNode
  headline?: React.ReactNode
  description?: React.ReactNode
  /** Shown in a copyable CommandBox. Pass null to hide it. */
  command?: string | null
  primaryCta?: HeroCenteredAction
  secondaryCta?: HeroCenteredAction | null
  /** Short facts under the CTAs, one check mark each. */
  highlights?: string[]
  /**
   * "default" is the full hero. "minimal" is a larger headline, one line, the
   * primary CTA and the command side by side; eyebrow, secondary CTA and
   * highlights are not rendered.
   */
  variant?: "default" | "minimal"
  /** Faded line grid behind the copy. Defaults to on for the minimal variant without a background. */
  grid?: boolean
  /**
   * Decorative layer behind the copy, e.g. a component from components/backgrounds.
   * It fills the section and takes no pointer events or layout space.
   */
  background?: React.ReactNode
  /** id for the headline, so the section is labelled by it. */
  headlineId?: string
  /** Opt-in motion layer: headline text reveal and section fade-ins. Off renders the same markup still. */
  animate?: boolean
  className?: string
}

/**
 * Monochrome line grid, faded out toward the edges with an SVG mask so the
 * hero copy sits on a calm center. Decorative only.
 */
function HeroGrid() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-border">
      <defs>
        <pattern id="hero-centered-grid" width="48" height="48" patternUnits="userSpaceOnUse" x="50%" y="-1">
          <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <radialGradient id="hero-centered-fade" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="55%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-centered-mask">
          <rect width="100%" height="100%" fill="url(#hero-centered-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-centered-grid)" mask="url(#hero-centered-mask)" />
    </svg>
  )
}

export function HeroCentered({
  eyebrow = "For React and Next.js",
  headline = "Dark interfaces, stamped into your repo.",
  description = "Copy production-ready components and blocks into your project with one command. Plain TypeScript and React source, no runtime package to keep in sync.",
  command = "npx stampui init",
  primaryCta = { label: "Browse components", href: "/blocks/components" },
  secondaryCta = { label: "Read the docs", href: "/docs" },
  highlights = ["React 18 and 19", "Tailwind CSS tokens", "TypeScript source"],
  variant = "default",
  grid,
  background,
  headlineId = "hero-centered-title",
  animate = true,
  className,
}: HeroCenteredProps) {
  const showGrid = grid ?? (variant === "minimal" && !background)
  const backdrop = background ? (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {background}
    </div>
  ) : null

  if (variant === "minimal") {
    return (
      <section aria-labelledby={headlineId} className={cx("relative isolate w-full overflow-hidden bg-background", className)}>
        {backdrop}
        {showGrid && <HeroGrid />}
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
          <RevealText
            animate={animate}
            as="h1"
            id={headlineId}
            className="max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {headline}
          </RevealText>

          <RevealText
            animate={animate}
            as="p"
            blurIn={false}
            delay={280}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {description}
          </RevealText>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="h-11 w-full px-5 sm:w-auto">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            {command && <CommandBox command={command} className="h-11 w-full bg-card sm:w-64" />}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby={headlineId} className={cx("relative isolate w-full overflow-hidden bg-background", className)}>
      {backdrop}
      {showGrid && <HeroGrid />}
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
        <RevealIf animate={animate} className="flex w-full flex-col items-center">
          {eyebrow && (
            <p className="mb-5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <RevealText
            animate={animate}
            as="h1"
            id={headlineId}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {headline}
          </RevealText>
          <RevealText
            animate={animate}
            as="p"
            blurIn={false}
            delay={280}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {description}
          </RevealText>

          {command && (
            <CommandBox
              command={command}
              className="mt-8 max-w-xs py-1 [&_button]:size-10 [&_button]:shrink-0"
            />
          )}

          <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="h-11 px-5">
              <a href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight />
              </a>
            </Button>
            {secondaryCta && (
              <Button asChild variant="outline" className="h-11 px-5">
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            )}
          </div>
        </RevealIf>

        {highlights.length > 0 && (
          <StaggerIf animate={animate} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-foreground" aria-hidden />
                {item}
              </span>
            ))}
          </StaggerIf>
        )}
      </div>
    </section>
  )
}
