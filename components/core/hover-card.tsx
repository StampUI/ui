"use client"

import * as React from "react"
import * as RadixHoverCard from "@radix-ui/react-hover-card"
import { cx } from "@/lib/cx"

export const HoverCard = RadixHoverCard.Root
export const HoverCardTrigger = RadixHoverCard.Trigger

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof RadixHoverCard.Content>,
  React.ComponentPropsWithoutRef<typeof RadixHoverCard.Content>
>(({ className, align = "center", sideOffset = 8, ...props }, ref) => (
  <RadixHoverCard.Portal>
    <RadixHoverCard.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cx(
        "popup-surface z-50 w-72 p-4 outline-none",
        className
      )}
      {...props}
    />
  </RadixHoverCard.Portal>
))
HoverCardContent.displayName = "HoverCardContent"
