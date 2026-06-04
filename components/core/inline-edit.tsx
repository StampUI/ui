"use client"

import * as React from "react"
import { Check, X, Pencil } from "lucide-react"
import { cx } from "@/lib/cx"

export interface InlineEditProps {
  value: string
  onSave?: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  as?: "p" | "h1" | "h2" | "h3" | "span"
}

export function InlineEdit({
  value: initialValue,
  onSave,
  placeholder = "Click to edit…",
  className,
  inputClassName,
  as: Tag = "p",
}: InlineEditProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(initialValue)
  const [value, setValue] = React.useState(initialValue)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const startEdit = () => {
    setDraft(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      setValue(trimmed)
      onSave?.(trimmed)
    }
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") save()
    if (e.key === "Escape") cancel()
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={save}
          className={cx(
            "flex-1 rounded-md border border-border-strong bg-surface-2 px-2 py-1 text-sm text-foreground outline-none focus:border-border-strong",
            inputClassName
          )}
          autoFocus
        />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); save() }}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          aria-label="Save"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); cancel() }}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          aria-label="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={cx("group flex items-center gap-1.5 cursor-pointer", className)}
      onClick={startEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && startEdit()}
      aria-label="Click to edit"
    >
      <Tag className={cx(!value && "text-muted-foreground/50 italic")}>
        {value || placeholder}
      </Tag>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  )
}
