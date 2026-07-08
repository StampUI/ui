import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const typingIndicatorVariants = cva(
  "inline-flex items-center gap-1",
  {
    variants: {
      variant: {
        bare: "bg-transparent p-0",
        bubble: "bg-surface-2 border border-border px-3 py-2 rounded-2xl rounded-bl-sm",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "bubble",
      size: "md",
    },
  }
)

export interface TypingIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof typingIndicatorVariants> {
  label?: string
}

export function TypingIndicator({
  className,
  variant,
  size,
  label = "Typing…",
  ...props
}: TypingIndicatorProps) {
  const dotSize = size === "sm" ? "h-1 w-1" : size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5"

  return (
    <span
      role="status"
      aria-label={label}
      className={cx(typingIndicatorVariants({ variant, size }), className)}
      {...props}
    >
      <span className="flex items-center gap-1 h-3">
        <span 
          className={cx("bg-foreground/70 rounded-full animate-bounce motion-reduce:animate-none shrink-0", dotSize)}
          style={{ animationDelay: "0ms" }} 
        />
        <span 
          className={cx("bg-foreground/70 rounded-full animate-bounce motion-reduce:animate-none shrink-0", dotSize)}
          style={{ animationDelay: "150ms" }} 
        />
        <span 
          className={cx("bg-foreground/70 rounded-full animate-bounce motion-reduce:animate-none shrink-0", dotSize)}
          style={{ animationDelay: "300ms" }} 
        />
      </span>
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}
