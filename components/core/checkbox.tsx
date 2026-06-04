"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const checkboxStyles = cva(
  [
    "peer shrink-0 rounded border transition-all outline-none",
    "focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground",
    "data-[state=indeterminate]:border-foreground data-[state=indeterminate]:bg-foreground",
    "border-border hover:border-border-strong",
  ],
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const indicatorStyles = cva("flex items-center justify-center text-background", {
  variants: {
    size: {
      sm: "[&>svg]:h-2.5 [&>svg]:w-2.5",
      md: "[&>svg]:h-3 [&>svg]:w-3",
      lg: "[&>svg]:h-3.5 [&>svg]:w-3.5",
    },
  },
  defaultVariants: { size: "md" },
})

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxStyles> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cx(checkboxStyles({ size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={indicatorStyles({ size })}>
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,6 5,9 10,3" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
