import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const badgeStyles = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-foreground border border-border",
        secondary: "bg-surface-2 text-muted-foreground border border-border-soft",
        success: "bg-green-950/60 text-green-400 border border-green-900/50",
        warning: "bg-yellow-950/60 text-yellow-400 border border-yellow-900/50",
        danger: "bg-red-950/60 text-red-400 border border-red-900/50",
        info: "bg-blue-950/60 text-blue-400 border border-blue-900/50",
        outline: "bg-transparent text-muted-foreground border border-border",
        neutral: "bg-surface-2 text-muted-foreground border border-border-soft",
        free: "bg-surface-2 text-muted-foreground border border-border-soft",
        pro: "bg-surface-3 text-foreground border border-border-strong",
        new: "bg-surface-raised text-foreground border border-border",
        signal: "bg-surface-3 text-foreground border border-border-strong",
        locked: "bg-surface-3 text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cx(badgeStyles({ variant }), className)} {...props} />
  )
}
