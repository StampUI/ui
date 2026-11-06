"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

// ── Reduced motion ────────────────────────────────────────────────────────
// Lives here (not in lib/) so a CLI install of Reveal needs nothing but cx.

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/**
 * True when the OS asks for reduced motion. Follows the setting live.
 * Returns false on the server and during hydration, so markup always matches.
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}

/** Delay between staggered items, in ms. */
const STAGGER_STEP = 40
/** Items past this index share the last delay, so long lists never lag behind. */
const STAGGER_MAX = 8

type Phase = "static" | "hidden" | "shown"

/**
 * Server render and first client render are "static": the content is simply
 * visible, so nothing depends on JavaScript and nothing shifts. After mount,
 * content that is still below the viewport is hidden and fades in (6px rise)
 * once it scrolls into view. Content already on screen, browsers without
 * IntersectionObserver, and prefers-reduced-motion all stay static.
 */
function useRevealPhase(ref: React.RefObject<HTMLElement | null>): Phase {
  const reduced = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>("static")

  React.useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === "undefined") return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setPhase("hidden")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPhase("shown")
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, reduced])

  // The reduced-motion query can resolve after hydration; never leave content hidden.
  return reduced ? "static" : phase
}

function phaseClass(phase: Phase) {
  if (phase === "hidden") return "opacity-0 translate-y-1.5"
  if (phase === "shown") {
    return "opacity-100 translate-y-0 transition-[opacity,translate] duration-slow ease-out motion-reduce:transition-none"
  }
  return undefined
}

// ── Reveal ────────────────────────────────────────────────────────────────

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Extra delay before the fade starts, in ms. */
  delay?: number
}

export function Reveal({ delay = 0, className, style, children, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const phase = useRevealPhase(ref)

  return (
    <div
      ref={ref}
      className={cx(phaseClass(phase), className)}
      style={phase === "shown" && delay > 0 ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...props}
    >
      {children}
    </div>
  )
}

// ── Stagger ───────────────────────────────────────────────────────────────

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Class for the wrapper around each child (e.g. `h-full` in a grid). */
  itemClassName?: string
}

/**
 * Reveals its children one after another, 40ms apart, when the group scrolls
 * into view. Each child is wrapped in a div, so put layout classes (grid,
 * flex, gap) on Stagger itself.
 */
export function Stagger({ itemClassName, className, children, ...props }: StaggerProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const phase = useRevealPhase(ref)
  const items = React.Children.toArray(children)

  return (
    <div ref={ref} className={className} {...props}>
      {items.map((child, i) => {
        const delay = Math.min(i, STAGGER_MAX - 1) * STAGGER_STEP
        return (
          <div
            key={React.isValidElement(child) && child.key != null ? child.key : i}
            className={cx(phaseClass(phase), itemClassName)}
            style={phase === "shown" && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
