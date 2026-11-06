"use client"

import * as React from "react"
import { useReducedMotion } from "@/components/core/reveal"

/**
 * - "idle":  server render and hydration. The effect shows its resting state
 *            (CSS effects let their keyframes run from first paint, JS effects
 *            show the final value), so nothing depends on JavaScript.
 * - "armed": mounted below the fold (or remounted after hydration). The effect
 *            holds its start state until it scrolls into view.
 * - "play":  in view. The effect runs once and ends on its final state.
 */
export type EntrancePhase = "idle" | "armed" | "play"

// Components that mount after hydration (client navigation, a replay) can
// start armed without a flash, because no server markup was painted for them.
let hydrated = false

export interface EntranceOptions {
  /**
   * When the element is already on screen at hydration: true plays the effect
   * right away, false keeps the resting state (use false when the start state
   * would flash, e.g. a number jumping back to 0).
   */
  playOnScreen?: boolean
}

/** Shared entrance trigger for the effects. Reduced motion always stays "idle". */
export function useEntrance(
  ref: React.RefObject<HTMLElement | null>,
  { playOnScreen = false }: EntranceOptions = {}
): EntrancePhase {
  const reduced = useReducedMotion()
  const [phase, setPhase] = React.useState<EntrancePhase>(() => (hydrated ? "armed" : "idle"))
  const initial = React.useRef(phase)

  React.useEffect(() => {
    hydrated = true
    const el = ref.current
    if (!el) return
    // Reduced motion is handled by the return value below.
    if (reduced) return
    const rect = el.getBoundingClientRect()
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0
    if (onScreen || typeof IntersectionObserver === "undefined") {
      if (initial.current === "armed" || playOnScreen) setPhase("play")
      return
    }
    setPhase("armed")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPhase("play")
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, reduced, playOnScreen])

  return reduced ? "idle" : phase
}
