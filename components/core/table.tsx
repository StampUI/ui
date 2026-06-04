import * as React from "react"
import { cx } from "@/lib/cx"

export interface TableProps extends React.ComponentPropsWithoutRef<"table"> {
  containerClassName?: string
}

export function Table({
  className,
  containerClassName,
  ...props
}: TableProps) {
  return (
    <div className={cx("w-full overflow-x-auto rounded-xl border border-border", containerClassName)}>
      <table
        className={cx("w-full text-sm", className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      className={cx("bg-surface-2 border-b border-border", className)}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cx("divide-y divide-border", className)} {...props} />
}

export function TableFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"tfoot">) {
  return (
    <tfoot
      className={cx(
        "border-t border-border bg-surface-2 font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TableRow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className={cx("transition-colors hover:bg-surface-2/60", className)}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={cx(
        "px-4 py-3 text-left text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className={cx("px-4 py-3 text-sm text-foreground", className)}
      {...props}
    />
  )
}

export function TableCaption({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"caption">) {
  return (
    <caption
      className={cx(
        "mt-3 text-xs text-muted-foreground text-center",
        className
      )}
      {...props}
    />
  )
}
