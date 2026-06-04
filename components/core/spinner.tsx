import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const spinnerStyles = cva(
  "animate-spin text-muted-foreground",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      variant: {
        default: "text-muted-foreground",
        primary: "text-foreground",
        white:   "text-white",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
)

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGElement>, "color">,
    VariantProps<typeof spinnerStyles> {
  label?: string
}

export function Spinner({ className, size, variant, label = "Loading...", ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cx(spinnerStyles({ size, variant }), className)}
      {...props}
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 60"
        opacity="0.25"
      />
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 60"
      />
    </svg>
  )
}
