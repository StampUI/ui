"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const switchStyles = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
    "transition-all duration-200 ease-out outline-none",
    "focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[state=unchecked]:bg-surface-3",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        md: "h-5 w-9",
        lg: "h-6 w-11",
      },
      color: {
        default: "data-[state=checked]:bg-foreground",
        success: "data-[state=checked]:bg-green-600",
        danger:  "data-[state=checked]:bg-red-600",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  }
)

const thumbStyles = cva(
  [
    "pointer-events-none block rounded-full bg-background shadow-sm ring-0",
    "transition-transform duration-200 ease-out",
    "data-[state=unchecked]:translate-x-0",
  ],
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
        md: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "color">,
    VariantProps<typeof switchStyles> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, color, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cx(switchStyles({ size, color }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className={thumbStyles({ size })} />
  </SwitchPrimitive.Root>
))
Switch.displayName = "Switch"

export { Switch }
