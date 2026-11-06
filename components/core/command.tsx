"use client"

import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Search, X } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Root ──────────────────────────────────────────────────────────────────────
//
// CommandInput and CommandList/CommandItem are siblings, so the active option
// is coordinated through context rather than DOM focus (APG combobox with a
// listbox popup): focus stays on the input, ArrowUp/ArrowDown/Home/End move a
// virtual selection reported via aria-activedescendant, and Enter selects it.
// Option order is read from the DOM, so filtering never scrambles it.

interface CommandCtx {
  listId: string
  activeId: string | null
  setActiveId: (id: string | null) => void
  /** Keeps the active option valid after the option list changes. */
  syncActive: () => void
  move: (delta: 1 | -1) => void
  moveToEdge: (edge: "start" | "end") => void
  selectActive: () => void
}

const CommandContext = React.createContext<CommandCtx | null>(null)

function enabledOptions(listId: string): HTMLElement[] {
  const list = typeof document === "undefined" ? null : document.getElementById(listId)
  if (!list) return []
  return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')).filter(
    (el) => el.getAttribute("aria-disabled") !== "true"
  )
}

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Command({ open, onOpenChange, children, className }: CommandProps) {
  const listId = React.useId()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const syncActive = React.useCallback(() => {
    const options = enabledOptions(listId)
    setActiveId((current) =>
      current && options.some((el) => el.id === current) ? current : options[0]?.id ?? null
    )
  }, [listId])

  const move = React.useCallback(
    (delta: 1 | -1) => {
      const options = enabledOptions(listId)
      if (options.length === 0) return
      const index = options.findIndex((el) => el.id === activeId)
      const next =
        index === -1
          ? delta === 1 ? 0 : options.length - 1
          : (index + delta + options.length) % options.length
      setActiveId(options[next].id)
    },
    [listId, activeId]
  )

  const moveToEdge = React.useCallback(
    (edge: "start" | "end") => {
      const options = enabledOptions(listId)
      if (options.length === 0) return
      setActiveId(options[edge === "start" ? 0 : options.length - 1].id)
    },
    [listId]
  )

  const selectActive = React.useCallback(() => {
    if (activeId) document.getElementById(activeId)?.click()
  }, [activeId])

  const ctx = React.useMemo<CommandCtx>(
    () => ({ listId, activeId, setActiveId, syncActive, move, moveToEdge, selectActive }),
    [listId, activeId, syncActive, move, moveToEdge, selectActive]
  )

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <CommandContext.Provider value={ctx}>
        <div className={className}>
          {children}
        </div>
      </CommandContext.Provider>
    </RadixDialog.Root>
  )
}

export const CommandTrigger = RadixDialog.Trigger

// ── Dialog shell ──────────────────────────────────────────────────────────────

export const CommandDialog = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-overlay ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
    <RadixDialog.Content
      ref={ref}
      className={cx(
        "popup-surface fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 outline-none overflow-hidden",
        className
      )}
      {...props}
    >
      <RadixDialog.Title className="sr-only">Command menu</RadixDialog.Title>
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
))
CommandDialog.displayName = "CommandDialog"

// ── Search input ───────────────────────────────────────────────────────────────

export interface CommandInputProps {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function CommandInput({ placeholder = "Search...", value, onValueChange }: CommandInputProps) {
  const ctx = React.useContext(CommandContext)

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!ctx) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        ctx.move(1)
        break
      case "ArrowUp":
        e.preventDefault()
        ctx.move(-1)
        break
      case "Home":
        e.preventDefault()
        ctx.moveToEdge("start")
        break
      case "End":
        e.preventDefault()
        ctx.moveToEdge("end")
        break
      case "Enter":
        e.preventDefault()
        ctx.selectActive()
        break
    }
  }

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        role="combobox"
        aria-expanded="true"
        aria-controls={ctx?.listId}
        aria-activedescendant={ctx?.activeId ?? undefined}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          // A new query starts again from the first match.
          ctx?.setActiveId(null)
          onValueChange?.(e.target.value)
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange?.("")}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ── List ───────────────────────────────────────────────────────────────────────

export function CommandList({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(CommandContext)
  const syncActive = ctx?.syncActive

  // Runs after every render: options mount, unmount and filter with the query,
  // so the active option falls back to the first enabled one when it disappears.
  React.useEffect(() => {
    syncActive?.()
  })

  return (
    <div id={ctx?.listId} role="listbox" className={cx("max-h-72 overflow-y-auto py-2", className)}>
      {children}
    </div>
  )
}

// ── Empty ─────────────────────────────────────────────────────────────────────

export function CommandEmpty({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("px-4 py-8 text-center text-sm text-muted-foreground", className)}>
      {children ?? "No results found."}
    </div>
  )
}

// ── Group ─────────────────────────────────────────────────────────────────────

export function CommandGroup({ heading, children, className }: { heading?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("px-2", className)}>
      {heading && (
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</p>
      )}
      {children}
    </div>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────────

export function CommandSeparator({ className }: { className?: string }) {
  return <div className={cx("my-1 h-px bg-border mx-2", className)} />
}

// ── Item ──────────────────────────────────────────────────────────────────────

export interface CommandItemProps {
  children: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
  className?: string
  shortcut?: string
}

export function CommandItem({ children, onSelect, disabled, className, shortcut }: CommandItemProps) {
  const ctx = React.useContext(CommandContext)
  const id = React.useId()
  const ref = React.useRef<HTMLDivElement>(null)
  const isActive = ctx?.activeId === id

  // Keyboard moves can reach options below the fold of the scrolling list.
  React.useEffect(() => {
    if (isActive) ref.current?.scrollIntoView?.({ block: "nearest" })
  }, [isActive])

  return (
    <div
      ref={ref}
      id={id}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      // Not in the Tab order: keyboard users move through options from
      // CommandInput (ArrowUp/ArrowDown + Enter) via aria-activedescendant.
      tabIndex={-1}
      onClick={() => {
        if (!disabled) onSelect?.()
      }}
      // Pointer hover moves the active option too, so mouse and keyboard agree.
      onMouseMove={() => {
        if (ctx && !disabled && !isActive) ctx.setActiveId(id)
      }}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm text-foreground outline-none transition-colors cursor-default",
        isActive ? "bg-surface-2" : "hover:bg-surface-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
      {shortcut && (
        <kbd className="pointer-events-none ms-auto flex h-5 items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-xs text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}

// ── Footer hint ───────────────────────────────────────────────────────────────

export function CommandFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex items-center gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground", className)}>
      {children ?? (
        <>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 font-mono">esc</kbd> close</span>
        </>
      )}
    </div>
  )
}
