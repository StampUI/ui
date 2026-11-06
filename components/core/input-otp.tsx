"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface InputOTPProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  inputClassName?: string
  type?: "text" | "password" | "number"
  pattern?: "numeric" | "alphanumeric" | "any"
}

export function InputOTP({
  length = 6,
  value = "",
  onChange,
  disabled,
  className,
  inputClassName,
  pattern = "numeric",
}: InputOTPProps) {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([])

  const chars = Array.from({ length }, (_, i) => value[i] ?? "")

  function isAllowed(char: string) {
    if (pattern === "numeric") return /^\d$/.test(char)
    if (pattern === "alphanumeric") return /^[a-zA-Z0-9]$/.test(char)
    return char.length === 1
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (chars[i]) {
        const next = [...chars]
        next[i] = ""
        onChange?.(next.join(""))
      } else if (i > 0) {
        inputs.current[i - 1]?.focus()
        const next = [...chars]
        next[i - 1] = ""
        onChange?.(next.join(""))
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault()
      inputs.current[i - 1]?.focus()
    } else if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault()
      inputs.current[i + 1]?.focus()
    }
  }

  function handleInput(i: number, e: React.FormEvent<HTMLInputElement>) {
    const val = e.currentTarget.value.slice(-1)
    if (!val) return
    if (!isAllowed(val)) return
    const next = [...chars]
    next[i] = val
    onChange?.(next.join(""))
    if (i < length - 1) inputs.current[i + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").slice(0, length)
    const allowed = [...pasted].filter(isAllowed)
    const next = Array.from({ length }, (_, i) => allowed[i] ?? "")
    onChange?.(next.join(""))
    const lastFilled = Math.min(allowed.length, length - 1)
    inputs.current[lastFilled]?.focus()
  }

  return (
    <div className={cx("flex items-center gap-2", className)} onPaste={handlePaste}>
      {chars.map((char, i) => (
        <React.Fragment key={i}>
          {i === length / 2 && length % 2 === 0 && length > 4 && (
            <span className="text-muted-foreground">–</span>
          )}
          <input
            ref={(el) => { inputs.current[i] = el }}
            type="text"
            inputMode={pattern === "numeric" ? "numeric" : "text"}
            maxLength={1}
            value={char}
            disabled={disabled}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onInput={(e) => handleInput(i, e)}
            onChange={() => {}}
            className={cx(
              "h-10 w-10 rounded-lg border border-border bg-surface-2 text-center text-sm font-medium outline-none transition-colors caret-transparent",
              "hover:border-border-strong",
              "focus-visible:ring-1 focus-visible:ring-border-strong ",
              "disabled:cursor-not-allowed disabled:opacity-50",
              char && "border-border-strong",
              inputClassName
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
