"use client"

import * as React from "react"
import * as RadixTabs from "@radix-ui/react-tabs"
import { cx } from "@/lib/cx"

export const Tabs = RadixTabs.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cx(
      "flex flex-wrap items-center gap-2 bg-transparent",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cx(
      "relative flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all outline-none border border-transparent",
      "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      "data-[state=active]:bg-surface-raised data-[state=active]:text-foreground data-[state=active]:border-border-strong data-[state=active]:font-medium",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cx(
      "mt-4 outline-none focus-visible:ring-1 focus-visible:ring-border-strong ",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"
