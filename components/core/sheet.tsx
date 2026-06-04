"use client"

import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

export const Sheet = RadixDialog.Root
export const SheetTrigger = RadixDialog.Trigger
export const SheetClose = RadixDialog.Close
export const SheetPortal = RadixDialog.Portal

export const SheetOverlay = React.forwardRef<
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
SheetOverlay.displayName = "SheetOverlay"

const sheetContentStyles = cva(
  [
    "fixed z-50 bg-card border-border shadow-xl outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-300",
  ],
  {
    variants: {
      side: {
        right: [
          "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        left: [
          "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        top: [
          "inset-x-0 top-0 w-full border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        bottom: [
          "inset-x-0 bottom-0 w-full rounded-t-2xl border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content>,
    VariantProps<typeof sheetContentStyles> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  SheetContentProps
>(({ className, side, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <SheetOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cx(sheetContentStyles({ side }), className)}
      {...props}
    >
      {children}
      <RadixDialog.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-border-strong ">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
))
SheetContent.displayName = "SheetContent"

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex items-center justify-end gap-2 p-6 pt-0 mt-auto", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title ref={ref} className={cx("text-base font-semibold leading-tight text-foreground", className)} {...props} />
))
SheetTitle.displayName = "SheetTitle"

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description ref={ref} className={cx("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
))
SheetDescription.displayName = "SheetDescription"

export const SheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />
)
SheetBody.displayName = "SheetBody"
