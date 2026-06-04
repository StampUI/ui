"use client"

import * as React from "react"
import * as RadixAccordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cx } from "@/lib/cx"

export const Accordion = RadixAccordion.Root

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(({ className, ...props }, ref) => (
  <RadixAccordion.Item
    ref={ref}
    className={cx(
      "overflow-hidden rounded-xl border border-border/50 bg-card mb-3 last:mb-0 transition-colors data-[state=open]:border-primary/30",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Header className="flex">
    <RadixAccordion.Trigger
      ref={ref}
      className={cx(
        "flex flex-1 items-center justify-between px-5 py-4 text-left font-medium text-foreground outline-none transition-all hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-1 focus-visible:ring-border-strong",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out" />
    </RadixAccordion.Trigger>
  </RadixAccordion.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content
    ref={ref}
    className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cx("px-5 pb-4 pt-1", className)}>{children}</div>
  </RadixAccordion.Content>
))
AccordionContent.displayName = "AccordionContent"
