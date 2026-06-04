import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const cardStyles = cva(
  "flex flex-col rounded-xl overflow-hidden text-card-foreground",
  {
    variants: {
      variant: {
        surface: "bg-card border border-border",
        elevated: "bg-surface-2 border border-border-strong",
        command: "bg-surface-3 border border-border-strong",
        preview: "bg-surface-2 border border-dashed border-border-soft",
        muted: "bg-muted border border-transparent",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardStyles> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cx(cardStyles({ variant }), className)} {...props} />
  )
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("px-6 py-5 flex flex-col gap-1.5", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cx("text-base font-semibold leading-tight text-foreground", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("px-6 pb-6 flex-1", className)} {...props} />
  )
)
CardBody.displayName = "CardBody"

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("px-6 py-4 bg-muted/10 border-t border-border/50 flex items-center", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"
