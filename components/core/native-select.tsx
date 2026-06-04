import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cx } from "@/lib/cx"

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative inline-flex w-full">
      <select
        ref={ref}
        className={cx(
          "h-9 w-full appearance-none rounded-lg border border-border bg-surface-2 px-3 pr-8 py-2 text-sm text-foreground outline-none",
          "hover:border-border-strong transition-colors",
          "focus-visible:ring-1 focus-visible:ring-border-strong ",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
)
NativeSelect.displayName = "NativeSelect"
