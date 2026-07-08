"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cx } from "@/lib/cx"

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
  fromDate?: Date
  toDate?: Date
  className?: string
  initialMonth?: Date
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  fromDate,
  toDate,
  className,
  initialMonth,
}: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = React.useState(
    initialMonth?.getFullYear() ?? selected?.getFullYear() ?? today.getFullYear()
  )
  const [viewMonth, setViewMonth] = React.useState(
    initialMonth?.getMonth() ?? selected?.getMonth() ?? today.getMonth()
  )

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function isDisabled(date: Date) {
    if (disabled?.(date)) return true
    if (fromDate && date < fromDate) return true
    if (toDate && date > toDate) return true
    return false
  }

  return (
    <div className={cx("w-full select-none p-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const sel = selected && isSameDay(date, selected)
          const tod = isToday(date)
          const dis = isDisabled(date)
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={dis}
              onClick={() => !dis && onSelect?.(date)}
              className={cx(
                "flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors",
                "disabled:pointer-events-none disabled:opacity-30",
                sel
                  ? "bg-foreground text-background font-medium"
                  : tod
                    ? "border border-border font-medium text-foreground hover:bg-surface-2"
                    : "text-foreground hover:bg-surface-2"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
