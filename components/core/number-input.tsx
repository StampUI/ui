"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cx } from "@/lib/cx"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue"> {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Use inside InputGroup, removes own border/bg */
  bare?: boolean
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min,
      max,
      step = 1,
      disabled,
      bare = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<number>(defaultValue)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internal

    const clamp = (v: number) => {
      if (min !== undefined && v < min) return min
      if (max !== undefined && v > max) return max
      return v
    }

    const update = (next: number) => {
      const clamped = clamp(next)
      if (!isControlled) setInternal(clamped)
      onChange?.(clamped)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (raw === "" || raw === "-") {
        if (!isControlled) setInternal(0)
        onChange?.(0)
        return
      }
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) update(parsed)
    }

    return (
      <div
        className={cx(
          "flex w-full items-center",
          !bare && "rounded-lg border border-border bg-input focus-within:border-border-strong focus-within:bg-surface-3 transition-all",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input
          ref={ref}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          className={cx(
            "flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-foreground",
            "placeholder:text-muted-foreground outline-none",
            "disabled:cursor-not-allowed",
            // hide native spinner (belt + suspenders alongside global CSS)
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          )}
          {...props}
        />

        {/* Custom spinner buttons */}
        <div className="flex flex-col border-l border-border">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increase"
            disabled={disabled || (max !== undefined && value >= max)}
            onClick={() => update(value + step)}
            className={cx(
              "flex h-[18px] w-7 items-center justify-center text-muted-foreground",
              "hover:bg-surface-2 hover:text-foreground transition-colors",
              "border-b border-border",
              "disabled:opacity-40 disabled:pointer-events-none",
            )}
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrease"
            disabled={disabled || (min !== undefined && value <= min)}
            onClick={() => update(value - step)}
            className={cx(
              "flex h-[18px] w-7 items-center justify-center text-muted-foreground",
              "hover:bg-surface-2 hover:text-foreground transition-colors",
              "disabled:opacity-40 disabled:pointer-events-none",
            )}
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  },
)
NumberInput.displayName = "NumberInput"
