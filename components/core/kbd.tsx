import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const kbdStyles = cva(
  [
    "inline-flex items-center justify-center",
    "font-mono font-medium select-none",
    "rounded border border-border bg-surface-2",
    "text-muted-foreground",
    "shadow-[0_1px_0_1px_theme(colors.border)]",
  ],
  {
    variants: {
      size: {
        sm: "h-5 min-w-5 px-1 text-[10px]",
        md: "h-6 min-w-6 px-1.5 text-xs",
        lg: "h-7 min-w-7 px-2 text-sm",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdStyles> {}

export function Kbd({ className, size, ...props }: KbdProps) {
  return <kbd className={cx(kbdStyles({ size }), className)} {...props} />
}

interface KeyComboProps {
  keys: string[]
  size?: VariantProps<typeof kbdStyles>["size"]
  className?: string
}

export function KeyCombo({ keys, size, className }: KeyComboProps) {
  return (
    <span className={cx("inline-flex items-center gap-1", className)}>
      {keys.map((key, i) => (
        <Kbd key={i} size={size}>{key}</Kbd>
      ))}
    </span>
  )
}
