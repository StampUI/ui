"use client"

import * as React from "react"
import { useEntrance } from "@/components/effects/use-entrance"

type TextRevealTag = "h1" | "h2" | "h3" | "p" | "span" | "div"

export interface TextRevealProps {
  /** Plain text. Words wrap like normal text. */
  text: string
  /** Element to render. Keeps headings semantic. */
  as?: TextRevealTag
  /** Animate word by word or character by character. */
  by?: "word" | "char"
  /** Delay between items in ms. Long texts compress it so the whole line lands within about half a second. */
  stagger?: number
  /** Duration of one item in ms. */
  duration?: number
  /** Delay before the first item in ms. */
  delay?: number
  /** Soft 4px blur on the way in. Off gives a plain fade and rise. */
  blurIn?: boolean
  id?: string
  className?: string
}

const CSS = `
@keyframes stp-text-reveal { from { opacity: 0; transform: translateY(0.3em); } }
@keyframes stp-text-reveal-blur { from { opacity: 0; filter: blur(4px); transform: translateY(0.3em); } }
@media (prefers-reduced-motion: no-preference) {
  .stp-text-reveal-item { animation: stp-text-reveal var(--stp-duration, 500ms) cubic-bezier(0.2, 0, 0, 1) both; }
  [data-blur="true"] .stp-text-reveal-item { animation-name: stp-text-reveal-blur; }
  [data-phase="armed"] .stp-text-reveal-item { animation: none; opacity: 0; }
}
`

/** Longest total stagger, so long headlines never drag. */
const MAX_SPREAD = 520

/**
 * Text that settles in word by word (or character by character) with a short
 * fade, rise and blur. The keyframes run from first paint, so the effect needs
 * no JavaScript on load; below the fold it waits until the text scrolls into
 * view. Screen readers get the plain text once. Reduced motion shows it still.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  by = "word",
  stagger,
  duration = 500,
  delay = 0,
  blurIn = true,
  id,
  className,
}: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null)
  const phase = useEntrance(ref)

  const words = text.split(/\s+/).filter(Boolean)
  const count = by === "char" ? words.join("").length : words.length
  const step = Math.min(stagger ?? (by === "char" ? 18 : 45), count > 1 ? MAX_SPREAD / (count - 1) : 0)

  let index = 0
  const item = (content: string, key: React.Key) => (
    <span
      key={key}
      className="stp-text-reveal-item inline-block"
      style={{ animationDelay: `${Math.round(delay + index++ * step)}ms` }}
    >
      {content}
    </span>
  )

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      data-phase={phase}
      data-blur={blurIn}
      className={className}
      style={{ "--stp-duration": `${duration}ms` } as React.CSSProperties}
    >
      <style href="stp-text-reveal" precedence="default">{CSS}</style>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <React.Fragment key={w}>
            {w > 0 && " "}
            {by === "char" ? (
              <span className="inline-block whitespace-nowrap">{[...word].map((ch, c) => item(ch, c))}</span>
            ) : (
              item(word, w)
            )}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  )
}

