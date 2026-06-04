"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cx } from "@/lib/cx"

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  max?: number
  disabled?: boolean
  className?: string
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tag…",
  max,
  disabled = false,
  className,
}: TagInputProps) {
  const [tags, setTags] = React.useState<string[]>(value ?? [])
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const update = (next: string[]) => {
    setTags(next)
    onChange?.(next)
  }

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || tags.includes(trimmed) || (max !== undefined && tags.length >= max)) return
    update([...tags, trimmed])
    setInput("")
  }

  const remove = (index: number) => {
    update(tags.filter((_, i) => i !== index))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      add()
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      remove(tags.length - 1)
    }
  }

  return (
    <div
      className={cx(
        "flex flex-wrap gap-1.5 min-h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm transition-colors",
        "focus-within:border-border-strong",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-md bg-surface-2 border border-border px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(i) }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ""}
        disabled={disabled || (max !== undefined && tags.length >= max)}
        className="flex-1 min-w-20 bg-transparent outline-none placeholder:text-muted-foreground/50 text-foreground disabled:cursor-not-allowed"
      />
    </div>
  )
}
