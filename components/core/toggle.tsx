"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium",
    "transition-all duration-[150ms] ease-out outline-none",
    "focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        outline: [
          "border border-border bg-transparent text-muted-foreground",
          "hover:bg-surface-2 hover:text-foreground hover:border-border-strong",
          "data-[state=on]:bg-surface-2 data-[state=on]:text-foreground data-[state=on]:border-border-strong",
        ],
        ghost: [
          "bg-transparent text-muted-foreground",
          "hover:bg-surface-2 hover:text-foreground",
          "data-[state=on]:bg-surface-2 data-[state=on]:text-foreground",
        ],
        solid: [
          "border border-border bg-transparent text-muted-foreground",
          "hover:bg-surface-2 hover:text-foreground",
          "data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground",
        ],
      },
      size: {
        sm:   "h-8 px-3 text-xs rounded-md",
        md:   "h-9 px-4",
        lg:   "h-10 px-5 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cx(toggleVariants({ variant, size }), className)}
    {...props}
  />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
