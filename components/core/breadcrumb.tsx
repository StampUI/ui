import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cx } from "@/lib/cx"

export function Breadcrumb({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return <nav aria-label="breadcrumb" className={className} {...props} />
}

export function BreadcrumbList({ className, ...props }: React.ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className={cx("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)} {...props} />
  )
}

export function BreadcrumbItem({ className, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return <li className={cx("inline-flex items-center gap-1.5", className)} {...props} />
}

export function BreadcrumbLink({
  className,
  asChild,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp className={cx("transition-colors hover:text-foreground", className)} {...props} />
  )
}

export function BreadcrumbPage({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="link"
      aria-current="page"
      aria-disabled="true"
      className={cx("font-medium text-foreground", className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <li role="presentation" aria-hidden="true" className={cx("text-muted-foreground", className)}>
      {children ?? <ChevronRight className="h-3.5 w-3.5" />}
    </li>
  )
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cx("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  )
}
