import * as React from "react"
import { CopyButton } from "@/components/core/copy-button"
import { cx } from "@/lib/cx"

interface CommandBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string
}

export function CommandBox({ command, className, ...props }: CommandBoxProps) {
  return (
    <div
      className={cx(
        "relative flex w-full max-w-sm items-center justify-between rounded-lg border bg-muted/50 py-2 pl-4 pr-2 font-mono text-sm text-foreground",
        className
      )}
      {...props}
    >
      <span className="truncate pr-4">$ {command}</span>
      <CopyButton value={command} />
    </div>
  )
}
