"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CopyButton } from "@/components/core/copy-button"
import { Button } from "@/components/core/button"
import { ScrollArea } from "@/components/core/scroll-area"

interface CollapsibleCodeProps {
  highlightedHtml?: string
  rawCode?: string
  code?: string
  language?: string
  previewLines?: number
}

export function CollapsibleCode({
  highlightedHtml,
  rawCode,
  code,
  language = "tsx",
  previewLines = 20,
}: CollapsibleCodeProps) {
  const [expanded, setExpanded] = React.useState(false)
  const renderedCode = highlightedHtml ?? code ?? ""
  const copyCode = rawCode ?? code ?? renderedCode
  const lineCount = copyCode.split("\n").length
  const isLong = lineCount > previewLines

  // text-sm (14px) * leading-relaxed (1.625) ≈ 22.75px/line + p-4 top+bottom = 32px
  const collapsedHeight = previewLines * 23 + 32

  return (
    <div className="relative group rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <CopyButton value={copyCode} className="opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div
        className={!expanded && isLong ? "relative overflow-hidden mask-b-from-[calc(100%-4rem)]" : "relative overflow-hidden"}
        style={!expanded && isLong ? { maxHeight: `${collapsedHeight}px` } : undefined}
      >
        <ScrollArea orientation="horizontal" className="text-sm bg-surface">
          <div
            className="[&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:!m-0 [&>pre]:leading-relaxed [&>pre]:font-mono"
            dangerouslySetInnerHTML={{ __html: renderedCode }}
          />
        </ScrollArea>
      </div>

      {isLong && (
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full rounded-none border-t border-border py-2.5 h-auto text-xs"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" />Collapse</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" />Show full source ({lineCount} lines)</>
          )}
        </Button>
      )}
    </div>
  )
}
