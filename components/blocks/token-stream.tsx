"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface TokenStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  speed?: number
  onComplete?: () => void
}

export function TokenStream({
  content,
  speed = 15,
  onComplete,
  className,
  ...props
}: TokenStreamProps) {
  const [displayedContent, setDisplayedContent] = React.useState("")
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [content, currentIndex, speed, onComplete])

  return (
    <div className={cx("block leading-relaxed", className)} {...props}>
      <span className="whitespace-pre-wrap">{displayedContent}</span>
      {currentIndex < content.length && (
        <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[1px] animate-[blink_1s_step-end_infinite] bg-foreground align-text-bottom" />
      )}
    </div>
  )
}
