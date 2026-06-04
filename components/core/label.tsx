import * as React from "react"
import { cx } from "@/lib/cx"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cx(
          "block text-sm font-medium leading-none text-foreground",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-400 select-none" aria-hidden="true">*</span>
        )}
      </label>
    )
  },
)
Label.displayName = "Label"
