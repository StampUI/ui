"use client"

import * as React from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { CalendarDays } from "lucide-react"
import { cx } from "@/lib/cx"
import { Calendar, type CalendarProps } from "@/components/core/calendar"

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export interface DatePickerProps extends Omit<CalendarProps, "className" | "disabled"> {
  placeholder?: string
  disabled?: CalendarProps["disabled"] | boolean
  className?: string
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date...",
  disabled,
  fromDate,
  toDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const isDisabledTrigger = typeof disabled === "boolean" ? disabled : false
  const disabledFn = typeof disabled === "function" ? disabled : undefined

  function handleSelect(date: Date) {
    onSelect?.(date)
    setOpen(false)
  }

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          type="button"
          disabled={isDisabledTrigger}
          className={cx(
            "flex h-9 w-full items-center justify-start gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none",
            "hover:border-border-strong transition-colors text-left",
            "focus-visible:ring-1 focus-visible:ring-border-strong ",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{selected ? formatDate(selected) : placeholder}</span>
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-72 rounded-xl border border-border bg-card shadow-lg outline-none animate-in fade-in-0 zoom-in-95"
        >
          <Calendar
            selected={selected}
            onSelect={handleSelect}
            disabled={disabledFn}
            fromDate={fromDate}
            toDate={toDate}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
