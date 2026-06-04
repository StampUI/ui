"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cx } from "@/lib/cx"

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string
}

function Separator({ className, orientation = "horizontal", decorative = true, label, ...props }: SeparatorProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className="flex items-center gap-3">
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation={orientation}
          className={cx("flex-1 shrink-0 bg-border", "h-px", className)}
          {...props}
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap select-none">{label}</span>
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation={orientation}
          className={cx("flex-1 shrink-0 bg-border", "h-px", className)}
        />
      </div>
    )
  }

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cx(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  )
}
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
