"use client"

import * as React from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { cx } from "@/lib/cx"

export const Popover = RadixPopover.Root
export const PopoverTrigger = RadixPopover.Trigger
export const PopoverAnchor = RadixPopover.Anchor

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(({ className, align = "center", sideOffset = 8, ...props }, ref) => (
  <RadixPopover.Portal>
    <RadixPopover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cx(
        "popup-surface z-50 min-w-[200px] max-w-sm p-4 outline-none",
        className
      )}
      {...props}
    />
  </RadixPopover.Portal>
))
PopoverContent.displayName = "PopoverContent"

export const PopoverClose = RadixPopover.Close
