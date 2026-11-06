import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const badgeStyles = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-foreground border border-border",
        secondary: "bg-surface-2 text-muted-foreground border border-border-soft",
        success: "border bg-success-soft text-success border-success/20",
        warning: "border bg-warning-soft text-warning border-warning/20",
        danger: "border bg-danger-soft text-danger border-danger/20",
        info: "bg-surface-2 text-muted-foreground border border-border",
        outline: "bg-transparent text-muted-foreground border border-border",
        neutral: "bg-surface-2 text-muted-foreground border border-border-soft",
        free: "bg-surface-2 text-muted-foreground border border-border-soft",
        pro: "bg-surface-3 text-foreground border border-border-strong",
        new: "bg-surface-raised text-foreground border border-border",
        signal: "bg-surface-3 text-foreground border border-border-strong",
        locked: "bg-surface-3 text-muted-foreground border border-border",
        /* Legacy hue names, kept for API compatibility. Mapped to graphite or the nearest status token. */
        purple: "bg-surface-3 text-foreground border border-border-strong",
        orange: "border bg-warning-soft text-warning border-warning/20",
        pink:   "bg-surface-2 text-muted-foreground border border-border",
        teal:   "border bg-success-soft text-success border-success/20",
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
