"use client"

import * as React from "react"
import { Check, Copy, Eye, EyeOff } from "lucide-react"
import { cx } from "@/lib/cx"

/**
 * StampUI CopyInput Component
 *
 * Read-only input with integrated copy-to-clipboard button.
 * Use for API keys, tokens, webhook URLs, and embed codes.
 *
 * Props:
 *   value      - the string to display and copy
 *   masked     - show bullets with an eye/eye-off reveal toggle
 *   label      - optional label rendered above
 *   className  - extra classes on the wrapper
 */

export interface CopyInputProps {
  value: string
  masked?: boolean
  label?: string
  className?: string
}

export function CopyInput({ value, masked = false, label, className }: CopyInputProps) {
  const [copied, setCopied] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayValue = masked && !revealed ? "•".repeat(Math.min(value.length, 28)) : value

  return (
    <div className={cx("space-y-1.5 w-full", className)}>
      {label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <div className="flex h-9 w-full items-center overflow-hidden rounded-lg border border-border bg-input transition-colors focus-within:border-border-strong">
        <input
          readOnly
          value={displayValue}
          aria-label={label ?? "Copy value"}
          className="flex-1 min-w-0 bg-transparent px-3 font-mono text-xs text-foreground/80 outline-none select-all cursor-default"
        />
        {masked && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide" : "Reveal"}
            className="flex h-full shrink-0 items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground border-l border-border"
          >
            {revealed ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy to clipboard"
          className="flex h-full shrink-0 items-center gap-1.5 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground border-l border-border"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}
