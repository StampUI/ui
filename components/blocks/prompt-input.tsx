"use client"

import * as React from "react"
import { Paperclip, ArrowUp } from "lucide-react"
import { cx } from "@/lib/cx"
import { Button } from "@/components/core/button"

export interface PromptInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit"> {
  onValueSubmit?: (value: string) => void
}

export const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ className, onValueSubmit, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    const [value, setValue] = React.useState("")

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      if (internalRef.current) {
        internalRef.current.style.height = "auto"
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
      }
      if (props.onChange) props.onChange(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (value.trim() && onValueSubmit) {
          onValueSubmit(value)
          setValue("")
          if (internalRef.current) internalRef.current.style.height = "auto"
        }
      }
      if (props.onKeyDown) props.onKeyDown(e)
    }

    return (
      <div className={cx("flex w-full flex-col rounded-xl border border-border bg-card shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50", className)}>
        <textarea
          ref={(node) => {
            internalRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
          }}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Send a message..."
          className="max-h-64 min-h-[44px] w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          {...props}
        />
        <div className="flex items-center justify-end gap-1 px-2 pb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            variant={value.trim() ? "primary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-lg transition-colors"
            disabled={!value.trim()}
            onClick={() => {
              if (value.trim() && onValueSubmit) {
                onValueSubmit(value)
                setValue("")
                if (internalRef.current) internalRef.current.style.height = "auto"
              }
            }}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    )
  }
)
PromptInput.displayName = "PromptInput"
