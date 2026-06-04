"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const radioStyles = cva(
  [
    "peer aspect-square shrink-0 rounded-full border transition-all outline-none",
    "focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "border-border hover:border-border-strong",
    "data-[state=checked]:border-foreground",
  ],
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

const indicatorStyles = cva(
  "flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "[&>span]:h-1.5 [&>span]:w-1.5",
        md: "[&>span]:h-2 [&>span]:w-2",
        lg: "[&>span]:h-2.5 [&>span]:w-2.5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function RadioGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cx("grid gap-2.5", className)}
      {...props}
    />
  )
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioStyles> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cx(radioStyles({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={indicatorStyles({ size })}>
        <span className="rounded-full bg-foreground block" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
