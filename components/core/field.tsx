import * as React from "react"
import * as RadixLabel from "@radix-ui/react-label"
import { cx } from "@/lib/cx"

export const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("flex flex-col gap-1.5", className)} {...props} />
  )
)
Field.displayName = "Field"

export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentPropsWithoutRef<typeof RadixLabel.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={cx("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-muted-foreground">*</span>}
  </RadixLabel.Root>
))
FieldLabel.displayName = "FieldLabel"

export const FieldHint = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx("text-xs text-muted-foreground", className)} {...props} />
  )
)
FieldHint.displayName = "FieldHint"

export const FieldError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx("text-xs text-danger font-medium", className)} {...props} />
  )
)
FieldError.displayName = "FieldError"
