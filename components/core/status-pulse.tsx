import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const dotStyles = cva("relative inline-flex rounded-full shrink-0", {
  variants: {
    status: {
      online: "bg-green-500",
      offline: "bg-muted-foreground/40",
      processing: "bg-yellow-400",
      error: "bg-red-500",
      warning: "bg-orange-400",
      unread: "bg-primary",
      success: "bg-green-500",
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5",
    },
  },
  defaultVariants: { status: "online", size: "md" },
})

const pingStyles = cva("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping motion-reduce:animate-none", {
  variants: {
    status: {
      online: "bg-green-500",
      offline: "hidden",
      processing: "bg-yellow-400",
      error: "bg-red-500",
      warning: "bg-orange-400",
      unread: "hidden",
      success: "bg-green-500",
    },
  },
  defaultVariants: { status: "online" },
})

const labels: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  processing: "Processing",
  error: "Error",
  warning: "Warning",
  unread: "Unread",
  success: "Success",
}

export interface StatusPulseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dotStyles> {
  label?: string | boolean
  pulse?: boolean
}

export function StatusPulse({ status, size, label, pulse = true, className, ...props }: StatusPulseProps) {
  const showLabel = label === true ? labels[status ?? "online"] : label

  return (
    <div className={cx("inline-flex items-center gap-1.5", className)} {...props}>
      <span className="relative inline-flex items-center justify-center">
        {pulse && status !== "offline" && (
          <span className={pingStyles({ status })} />
        )}
        <span className={dotStyles({ status, size })} />
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{showLabel}</span>
      )}
    </div>
  )
}
