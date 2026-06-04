"use client"

import * as React from "react"
import * as RadixCollapsible from "@radix-ui/react-collapsible"
import { cx } from "@/lib/cx"

export const Collapsible = RadixCollapsible.Root

export const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof RadixCollapsible.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixCollapsible.Trigger>
>(({ className, ...props }, ref) => (
  <RadixCollapsible.Trigger ref={ref} className={cx("outline-none", className)} {...props} />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

export const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof RadixCollapsible.Content>,
  React.ComponentPropsWithoutRef<typeof RadixCollapsible.Content>
>(({ className, ...props }, ref) => (
  <RadixCollapsible.Content
    ref={ref}
    className={cx(
      "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
      className
    )}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"
