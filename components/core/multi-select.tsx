"use client"

import * as React from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { Check, ChevronDown, X } from "lucide-react"
import { cx } from "@/lib/cx"

export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxDisplay?: number
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  disabled,
  className,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const listId = React.useId()

  function toggle(optionValue: string) {
    if (!onValueChange) return
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue))
    } else {
      onValueChange([...value, optionValue])
    }
  }

  function remove(optionValue: string, e: React.MouseEvent) {
    e.stopPropagation()
    onValueChange?.(value.filter((v) => v !== optionValue))
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  const visibleLabels = selectedLabels.slice(0, maxDisplay)
  const overflow = selectedLabels.length - maxDisplay

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-label={selectedLabels.length ? selectedLabels.join(", ") : placeholder}
          className={cx(
            "flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none",
            "hover:border-border-strong transition-colors text-left",
            "focus-visible:ring-1 focus-visible:ring-border-strong ",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {visibleLabels.map((label, i) => (
                  <span
                    key={value[i]}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium"
                  >
                    {label}
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      onClick={(e) => remove(value[i], e)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="inline-flex items-center rounded-md bg-surface-3 px-2 py-0.5 text-xs text-muted-foreground">
                    +{overflow} more
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown className={cx("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
      </RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] max-h-60 overflow-auto rounded-xl border border-border bg-card p-1.5 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {options.map((option) => {
            const selected = value.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                onClick={() => toggle(option.value)}
                className={cx(
                  "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors",
                  "hover:bg-surface-2 focus-visible:bg-surface-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  selected && "font-medium text-foreground"
                )}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded border border-border shrink-0">
                  {selected && <Check className="h-3 w-3" />}
                </span>
                {option.label}
              </button>
            )
          })}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
