"use client"

import * as React from "react"
import * as RadixScrollArea from "@radix-ui/react-scroll-area"
import { cx } from "@/lib/cx"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea.Root> {
  orientation?: "vertical" | "horizontal" | "both"
}

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.Viewport>,
  ScrollAreaProps
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <RadixScrollArea.Root className={cx("relative overflow-hidden", className)} {...props}>
    <RadixScrollArea.Viewport ref={ref} className="h-full w-full rounded-[inherit]">
      {children}
    </RadixScrollArea.Viewport>
    {(orientation === "vertical" || orientation === "both") && (
      <RadixScrollArea.Scrollbar
        orientation="vertical"
        className="flex touch-none select-none transition-colors w-2.5 border-s border-s-transparent p-px"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-border hover:bg-border-strong transition-colors" />
      </RadixScrollArea.Scrollbar>
    )}
    {(orientation === "horizontal" || orientation === "both") && (
      <RadixScrollArea.Scrollbar
        orientation="horizontal"
        className="flex touch-none select-none transition-colors h-2.5 flex-col border-t border-t-transparent p-px"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-border hover:bg-border-strong transition-colors" />
      </RadixScrollArea.Scrollbar>
    )}
    <RadixScrollArea.Corner />
  </RadixScrollArea.Root>
))
ScrollArea.displayName = "ScrollArea"
