import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const textareaStyles = cva(
  "flex w-full rounded-lg text-sm transition-all outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      variant: {
        surface:
          "bg-input border border-border px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-border-strong focus:bg-surface-3",
        minimal:
          "bg-transparent border-b border-border px-0 py-2 text-foreground placeholder:text-muted-foreground/50 rounded-none focus:outline-none focus:border-border-strong",
      },
      resize: {
        none:     "resize-none",
        vertical: "resize-y",
        both:     "resize",
      },
    },
    defaultVariants: {
      variant: "surface",
      resize: "none",
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "resize">,
    VariantProps<typeof textareaStyles> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, resize, rows = 4, ...props }, ref) => {
    return (
      <textarea
        rows={rows}
        className={cx(textareaStyles({ variant, resize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"
