import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const inputStyles = cva(
  "flex w-full rounded-lg text-sm transition-all outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        surface: "bg-input border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-border-strong focus:bg-surface-3",
        command: "bg-transparent border-0 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 shadow-none focus:outline-none rounded-none",
        minimal: "bg-transparent border-b border-border px-0 py-2 text-foreground placeholder:text-muted-foreground/50 rounded-none focus:outline-none focus:border-border-strong",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputStyles> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        autoComplete="off"
        spellCheck="false"
        className={cx(inputStyles({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
