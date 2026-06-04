import * as React from "react"
import { cx } from "@/lib/cx"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-orientation={orientation}
      className={cx(
        "inline-flex",
        orientation === "horizontal"
          ? [
              "flex-row",
              "[&>*:not(:first-child)]:border-l-0",
              "[&>*:not(:first-child)]:rounded-l-none",
              "[&>*:not(:last-child)]:rounded-r-none",
            ]
          : [
              "flex-col",
              "[&>*:not(:first-child)]:border-t-0",
              "[&>*:not(:first-child)]:rounded-t-none",
              "[&>*:not(:last-child)]:rounded-b-none",
            ],
        className,
      )}
      {...props}
    />
  )
}
