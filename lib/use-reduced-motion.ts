"use client"

import * as React from "react"

/**
 * Tracks the user's prefers-reduced-motion setting. SSR-safe: returns false
 * on the server and during the first client render, then syncs.
 *
 * For animations driven by Tailwind utility classes (animate-bounce,
 * animate-pulse, etc.), prefer the `motion-reduce:` variant directly in
 * className instead of this hook; it needs no JS and can't flash. Reach for
 * this hook when the animation is not a plain CSS class: requestAnimationFrame
 * loops, SVG SMIL <animate>/<animateTransform>, or JS-driven timers.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}
