"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cx } from "@/lib/cx"

export interface NumberStepperProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function NumberStepper({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  className,
}: NumberStepperProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const controlled = controlledValue !== undefined
  const value = controlled ? controlledValue : internal

  const update = (next: number) => {
    if (min !== undefined && next < min) return
    if (max !== undefined && next > max) return
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  const decrement = () => update(value - step)
  const increment = () => update(value + step)

  const atMin = min !== undefined && value <= min
  const atMax = max !== undefined && value >= max

  return (
    <div className={cx("inline-flex items-center rounded-lg border border-border bg-input overflow-hidden", className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || atMin}
        aria-label="Decrease"
        className={cx(
          "flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors",
          "hover:bg-surface-2 hover:text-foreground",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="min-w-12 select-none px-2 text-center text-sm font-medium tabular-nums text-foreground">
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={disabled || atMax}
        aria-label="Increase"
        className={cx(
          "flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors",
          "hover:bg-surface-2 hover:text-foreground",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
