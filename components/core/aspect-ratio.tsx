import * as React from "react"
import { cx } from "@/lib/cx"

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{ aspectRatio: String(ratio), ...style }}
      className={cx("w-full overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AspectRatio.displayName = "AspectRatio"
