import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3.5 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-surface-2 border-border text-foreground",
        info: "bg-surface-2 border-border text-foreground",
        warning: "bg-surface-2 border-border text-foreground",
        success: "bg-surface-2 border-border text-foreground",
        danger: "bg-surface-2 border-danger/30 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cx(alertVariants({ variant }), className)} {...props} />
  )
)
Alert.displayName = "Alert"

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cx("font-medium leading-none tracking-tight mb-1", className)} {...props} />
))
AlertTitle.displayName = "AlertTitle"

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cx("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"
