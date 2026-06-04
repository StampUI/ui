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
        "z-50 w-72 rounded-xl border border-border bg-card p-4 shadow-lg outline-none",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </RadixHoverCard.Portal>
))
HoverCardContent.displayName = "HoverCardContent"
