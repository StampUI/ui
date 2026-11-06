import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

// ── Symbol map ─────────────────────────────────────────────────────────────────

const SYMBOLS: Record<string, string> = {
  cmd: "⌘", command: "⌘", meta: "⌘",
  ctrl: "⌃", control: "⌃",
  alt: "⌥", option: "⌥",
  shift: "⇧",
  enter: "↵", return: "↵",
  backspace: "⌫",
  delete: "⌦",
  escape: "⎋", esc: "⎋",
  tab: "⇥",
  up: "↑", down: "↓", left: "←", right: "→",
  space: "Space",
  capslock: "⇪",
  pageup: "⇞", pagedown: "⇟",
  home: "↖", end: "↘",
}

function resolveKey(key: string): string {
  return SYMBOLS[key.toLowerCase()] ?? key.toUpperCase()
}

// ── Key styles ─────────────────────────────────────────────────────────────────

const keyStyles = cva(
  "inline-flex items-center justify-center rounded border font-mono leading-none select-none",
  {
    variants: {
      size: {
        sm: "h-5 min-w-[1.25rem] px-1 text-xs border-b-2",
        md: "h-6 min-w-[1.5rem] px-1.5 text-xs border-b-2",
        lg: "h-7 min-w-[1.75rem] px-2 text-sm border-b-[3px]",
      },
      variant: {
        default: "bg-surface-2 text-foreground border-border shadow-sm",
        ghost: "bg-transparent text-muted-foreground border-border-soft",
        solid: "bg-surface-3 text-foreground border-border-strong shadow-sm",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
)

// ── Shortcut ───────────────────────────────────────────────────────────────────

export interface ShortcutProps extends VariantProps<typeof keyStyles> {
  /** Pass a string like "cmd+k" or an array like ["cmd","k"] */
  keys: string | string[]
  /** Displayed between keys; defaults to "+" */
  separator?: string
  className?: string
}

export function Shortcut({ keys, size, variant, separator = "+", className }: ShortcutProps) {
  const parts = Array.isArray(keys)
    ? keys
    : keys.split("+").map((k) => k.trim())

  return (
    <span className={cx("inline-flex items-center gap-0.5", className)}>
      {parts.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="mx-0.5 select-none text-xs text-muted-foreground/50">
              {separator}
            </span>
          )}
          <kbd className={keyStyles({ size, variant })}>
            {resolveKey(key)}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  )
}
