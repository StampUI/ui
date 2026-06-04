"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        destructive: "bg-red-500 text-white hover:bg-red-600",
        warning: "bg-orange-400 text-white hover:bg-orange-500",
      },
    },
    defaultVariants: { variant: "destructive" },
  }
)

export interface ConfirmActionProps extends VariantProps<typeof buttonStyles> {
  label?: string
  confirmLabel?: string
  onConfirm?: () => void
  timeout?: number
  disabled?: boolean
  className?: string
}

export function ConfirmAction({
  label = "Delete",
  confirmLabel = "Are you sure?",
  onConfirm,
  timeout = 3000,
  variant,
  disabled = false,
  className,
}: ConfirmActionProps) {
  const [pending, setPending] = React.useState(false)
  const [progress, setProgress] = React.useState(100)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const startRef = React.useRef<number | null>(null)

  const reset = React.useCallback(() => {
    setPending(false)
    setProgress(100)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = null
  }, [])

  const tick = React.useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts
    const elapsed = ts - startRef.current
    const remaining = Math.max(0, 1 - elapsed / timeout)
    setProgress(remaining * 100)
    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [timeout])

  const handleClick = () => {
    if (!pending) {
      setPending(true)
      startRef.current = null
      rafRef.current = requestAnimationFrame(tick)
      timerRef.current = setTimeout(reset, timeout)
    } else {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      reset()
      onConfirm?.()
    }
  }

  React.useEffect(() => () => { reset() }, [reset])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cx(buttonStyles({ variant }), "relative overflow-hidden", className)}
    >
      {pending && (
        <span
          className="absolute left-0 top-0 h-full bg-white/20 transition-none"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative">{pending ? confirmLabel : label}</span>
    </button>
  )
}
