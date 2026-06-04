"use client"

import * as React from "react"
import * as RadixProgress from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const trackStyles = cva(
  "relative overflow-hidden rounded-full bg-surface-3 border border-border/20",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const indicatorStyles = cva(
  "h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-foreground",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof RadixProgress.Root>,
    VariantProps<typeof trackStyles>,
    VariantProps<typeof indicatorStyles> {}

export const Progress = React.forwardRef<
  React.ElementRef<typeof RadixProgress.Root>,
  ProgressProps
>(({ className, size, variant, value, max = 100, ...props }, ref) => (
  <RadixProgress.Root
    ref={ref}
    value={value}
    max={max}
    className={cx(trackStyles({ size }), className)}
    {...props}
  >
    <RadixProgress.Indicator
      className={cx(indicatorStyles({ variant }))}
      style={{ transform: `translateX(-${100 - ((value ?? 0) / (max ?? 100)) * 100}%)` }}
    />
  </RadixProgress.Root>
))
Progress.displayName = "Progress"
