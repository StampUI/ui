"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

interface TypewriterTextProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

type Phase = "typing" | "pausing" | "deleting"

export function TypewriterText({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  className,
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = React.useState(0)
  const [displayed, setDisplayed] = React.useState("")
  const [phase, setPhase] = React.useState<Phase>("typing")

  React.useEffect(() => {
    const word = words[wordIndex]

    if (phase === "typing") {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typingSpeed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase("pausing"), typingSpeed)
        return () => clearTimeout(t)
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), pauseDuration)
      return () => clearTimeout(t)
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed)
        return () => clearTimeout(t)
      } else {
        setWordIndex((i) => (i + 1) % words.length)
        setPhase("typing")
      }
    }
  }, [phase, displayed, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={cx(className)}>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-current animate-[blink_1s_step-end_infinite] align-text-bottom ml-0.5 rounded-sm" />
    </span>
  )
}
