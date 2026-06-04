import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const skeletonStyles = cva(
  "animate-pulse bg-surface-3",
  {
    variants: {
      variant: {
        default: "rounded-lg",
        circle:  "rounded-full",
        text:    "rounded",
        pill:    "rounded-full",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonStyles> {}

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cx(skeletonStyles({ variant }), className)}
      aria-hidden="true"
      {...props}
    />
  )
}
