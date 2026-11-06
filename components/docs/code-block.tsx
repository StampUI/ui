import * as React from "react"
import { highlight } from "@/lib/highlight"
import { CopyButton } from "@/components/core/copy-button"
import { ScrollArea } from "@/components/core/scroll-area"
import { cx } from "@/lib/cx"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  wrapperClassName?: string
}

export async function CodeBlock({ code, language = "tsx", filename, wrapperClassName }: CodeBlockProps) {
  const html = await highlight(code, language)

  return (
    <div className={cx("relative group rounded-xl border border-border overflow-hidden", wrapperClassName)}>
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">{filename ?? language}</span>
        <CopyButton value={code} className="opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <ScrollArea orientation="horizontal" className="text-sm bg-surface">
        <div
          className="[&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:!m-0 [&>pre]:leading-relaxed [&>pre]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </div>
  )
}
