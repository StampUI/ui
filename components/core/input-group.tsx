import * as React from "react"
import { cx } from "@/lib/cx"

interface InputGroupProps {
  left?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InputGroup({ left, right, children, className }: InputGroupProps) {
  return (
    <div
      className={cx(
        "flex items-center w-full rounded-lg border border-border bg-input",
        "focus-within:border-border-strong focus-within:bg-surface-3",
        "transition-all",
        className,
      )}
    >
      {left && (
        <div className="flex shrink-0 items-center border-r border-border px-3 py-2 text-sm text-muted-foreground select-none">
          {left}
        </div>
      )}
      <div className="flex-1 min-w-0 [&>input]:border-0 [&>input]:bg-transparent [&>input]:focus:bg-transparent [&>input]:focus:border-0 [&>input]:rounded-none [&>input]:shadow-none">
        {children}
      </div>
      {right && (
        <div className="flex shrink-0 items-center border-l border-border px-3 py-2 text-sm text-muted-foreground select-none">
          {right}
        </div>
      )}
    </div>
  )
}

type InputAddonProps = React.HTMLAttributes<HTMLSpanElement>

export function InputAddon({ className, ...props }: InputAddonProps) {
  return (
    <span
      className={cx("text-sm text-muted-foreground font-mono", className)}
      {...props}
    />
  )
}
