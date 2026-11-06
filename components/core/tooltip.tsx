"use client"

import * as React from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import { cx } from "@/lib/cx"

// Radix throws when a Tooltip has no Provider above it. A fresh app has none,
// so Tooltip brings its own unless an app-level TooltipProvider is present
// (which keeps the shared delay and skip-delay grouping).
const HasProvider = React.createContext(false)

export function TooltipProvider(props: React.ComponentProps<typeof RadixTooltip.Provider>) {
  return (
    <HasProvider.Provider value>
      <RadixTooltip.Provider {...props} />
    </HasProvider.Provider>
  )
}

export function Tooltip(props: React.ComponentProps<typeof RadixTooltip.Root>) {
  const provided = React.useContext(HasProvider)
  const root = <RadixTooltip.Root {...props} />
  return provided ? root : <RadixTooltip.Provider delayDuration={300}>{root}</RadixTooltip.Provider>
}
export const TooltipTrigger = RadixTooltip.Trigger

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RadixTooltip.Portal>
    <RadixTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cx(
        "popup-surface z-50 max-w-xs overflow-hidden px-3 py-1.5 text-xs",
        className
      )}
      {...props}
    />
  </RadixTooltip.Portal>
))
TooltipContent.displayName = "TooltipContent"
