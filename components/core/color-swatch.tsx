"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"
import { Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/core/tooltip"

// ── Swatch ─────────────────────────────────────────────────────────────────────

const swatchStyles = cva(
  "group relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-lg border border-border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong ",
  {
    variants: {
      size: {
        sm: "h-7 w-7 rounded-md",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20 rounded-xl",
      },
    },
    defaultVariants: { size: "md" },
  }
)

export interface ColorSwatchProps extends VariantProps<typeof swatchStyles> {
  color: string
  label?: string
  copyValue?: string
  showLabel?: boolean
  onClick?: () => void
  className?: string
}

export function ColorSwatch({
  color,
  label,
  copyValue,
  size,
  showLabel = false,
  onClick,
  className,
}: ColorSwatchProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue ?? color)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cx("inline-flex flex-col items-center gap-1.5", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Copy color ${label ?? color}`}
            className={swatchStyles({ size })}
            style={{ backgroundColor: color }}
            onClick={onClick ?? handleCopy}
          >
            <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
              {copied
                ? <Check className="h-3.5 w-3.5 text-foreground" />
                : <Copy className="h-3 w-3 text-foreground" />
              }
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? "Copied!" : `Copy ${label ?? color}`}
        </TooltipContent>
      </Tooltip>
      {showLabel && (
        <span className="text-xs font-mono text-muted-foreground">{label ?? color}</span>
      )}
    </div>
  )
}

// ── Palette ────────────────────────────────────────────────────────────────────

export interface PaletteColor {
  color: string
  label?: string
}

export interface ColorPaletteProps {
  colors: PaletteColor[]
  size?: ColorSwatchProps["size"]
  showLabels?: boolean
  className?: string
}

export function ColorPalette({ colors, size, showLabels = false, className }: ColorPaletteProps) {
  return (
    <div className={cx("flex flex-wrap gap-2", className)}>
      {colors.map((c, i) => (
        <ColorSwatch key={i} color={c.color} label={c.label} size={size} showLabel={showLabels} />
      ))}
    </div>
  )
}
