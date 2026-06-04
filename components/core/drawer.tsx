"use client"

import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cx } from "@/lib/cx"

export const Drawer = RadixDialog.Root
export const DrawerTrigger = RadixDialog.Trigger
export const DrawerClose = RadixDialog.Close
export const DrawerPortal = RadixDialog.Portal

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cx(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = "DrawerOverlay"

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <DrawerOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cx(
        "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-border bg-card pb-safe shadow-xl outline-none",
        "max-h-[85svh]",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-300",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-3 mb-2 h-1.5 w-10 shrink-0 rounded-full bg-border" />
      {children}
      <RadixDialog.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-border-strong ">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
))
DrawerContent.displayName = "DrawerContent"

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex flex-col gap-1.5 px-6 pb-3", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex flex-col gap-2 px-6 pt-0 pb-6 mt-auto", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title ref={ref} className={cx("text-base font-semibold leading-tight text-foreground", className)} {...props} />
))
DrawerTitle.displayName = "DrawerTitle"

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description ref={ref} className={cx("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
))
DrawerDescription.displayName = "DrawerDescription"

export const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex-1 overflow-y-auto px-6 py-2", className)} {...props} />
)
DrawerBody.displayName = "DrawerBody"
