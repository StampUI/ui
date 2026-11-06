"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const rootStyles = cva(
  "inline-flex items-center bg-surface-2 border border-border rounded-xl p-0.5 relative",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: { size: "md" },
  }
)

const itemStyles = cva(
  "relative z-10 inline-flex items-center justify-center gap-1.5 font-medium text-muted-foreground transition-colors duration-150 rounded-[10px] select-none cursor-pointer whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-sm",
      },
      active: {
        true: "text-foreground",
        false: "hover:text-foreground/70",
      },
    },
    defaultVariants: { size: "md", active: false },
  }
)

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  icon?: React.ElementType
  disabled?: boolean
}

export interface SegmentedControlProps extends VariantProps<typeof rootStyles> {
  options: SegmentedOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

export function SegmentedControl({
  options,
  value: controlled,
  defaultValue,
  onChange,
  size,
  className,
}: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value ?? "")
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

  const updateIndicator = React.useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const activeEl = container.querySelector<HTMLElement>("[data-active='true']")
    if (activeEl) {
      setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
    }
  }, [])

  React.useEffect(() => {
    updateIndicator()
  }, [value, updateIndicator])

  // Also update on mount after paint
  React.useEffect(() => {
    const raf = requestAnimationFrame(updateIndicator)
    return () => cancelAnimationFrame(raf)
  }, [updateIndicator])

  const select = (opt: SegmentedOption) => {
    if (opt.disabled) return
    if (!isControlled) setInternal(opt.value)
    onChange?.(opt.value)
  }

  return (
    <div ref={containerRef} className={cx(rootStyles({ size }), className)}>
      {/* Sliding pill indicator */}
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 rounded-[10px] bg-background border border-border shadow-sm transition-all duration-200 ease-out pointer-events-none"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            disabled={opt.disabled}
            onClick={() => select(opt)}
            className={cx(
              itemStyles({ size, active }),
              opt.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
