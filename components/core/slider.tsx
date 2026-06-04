"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const sliderStyles = cva(
  "relative flex touch-none select-none items-center",
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "flex-col h-full min-h-[160px] w-auto",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  }
)

const trackStyles = cva(
  "relative grow overflow-hidden rounded-full bg-surface-3",
  {
    variants: {
      orientation: {
        horizontal: "h-1.5 w-full",
        vertical:   "h-full w-1.5",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      { orientation: "horizontal", size: "sm", className: "h-1" },
      { orientation: "horizontal", size: "lg", className: "h-2" },
      { orientation: "vertical",   size: "sm", className: "w-1" },
      { orientation: "vertical",   size: "lg", className: "w-2" },
    ],
    defaultVariants: { orientation: "horizontal", size: "md" },
  }
)

const thumbStyles = cva(
  [
    "block rounded-full bg-foreground ring-offset-background",
    "transition-all duration-100",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:scale-110",
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

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, "orientation">,
    VariantProps<typeof sliderStyles>,
    VariantProps<typeof thumbStyles> {
  orientation?: "horizontal" | "vertical"
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, orientation = "horizontal", size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cx(sliderStyles({ orientation }), className)}
    {...props}
  >
    <SliderPrimitive.Track className={trackStyles({ orientation, size })}>
      <SliderPrimitive.Range
        className={cx(
          "absolute bg-foreground",
          orientation === "horizontal" ? "h-full" : "w-full",
        )}
      />
    </SliderPrimitive.Track>
    {(props.defaultValue ?? props.value ?? [0]).map((_, i) => (
      <SliderPrimitive.Thumb key={i} className={thumbStyles({ size })} />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = "Slider"

export { Slider }
