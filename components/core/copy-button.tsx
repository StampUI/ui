"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cx } from "@/lib/cx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/core/tooltip"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (!hasCopied) return
    const t = setTimeout(() => setHasCopied(false), 2000)
    return () => clearTimeout(t)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cx(
            "inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-fast ease-out hover:bg-muted hover:text-foreground",
            className
          )}
          onClick={() => {
            navigator.clipboard.writeText(value)
            setHasCopied(true)
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? (
            <Check className="h-3.5 w-3.5 animate-fade-in" />
          ) : (
            <Copy className="h-3.5 w-3.5 animate-fade-in" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {hasCopied ? "Copied!" : "Copy"}
      </TooltipContent>
    </Tooltip>
  )
}
