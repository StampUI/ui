"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"
import { Star } from "lucide-react"

const rootStyles = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
      md: "gap-1 [&_svg]:h-5 [&_svg]:w-5",
      lg: "gap-1 [&_svg]:h-6 [&_svg]:w-6",
    },
  },
  defaultVariants: { size: "md" },
})

export interface RatingProps extends VariantProps<typeof rootStyles> {
  value?: number
  defaultValue?: number
  max?: number
  readOnly?: boolean
  onChange?: (value: number) => void
  icon?: React.ElementType
  /** Tailwind classes applied to the icon when filled. Defaults to yellow stars. */
  activeClassName?: string
  className?: string
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  readOnly = false,
  size,
  onChange,
  icon: Icon = Star,
  activeClassName = "fill-foreground text-foreground",
  className,
}: RatingProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [hovered, setHovered] = React.useState<number | null>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internal
  const display = hovered !== null ? hovered : value

  const handleClick = (star: number) => {
    if (readOnly) return
    const next = star === value ? 0 : star
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div
      className={cx(rootStyles({ size }), className)}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= display
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            aria-label={`Rate ${star} of ${max}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            className={cx(
              "outline-none rounded-sm focus-visible:ring-1 focus-visible:ring-border-strong",
              !readOnly && "cursor-pointer",
              readOnly && "cursor-default pointer-events-none",
            )}
          >
            <Icon
              className={cx(
                "transition-colors duration-100",
                filled
                  ? activeClassName
                  : "fill-transparent text-muted-foreground/30",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
