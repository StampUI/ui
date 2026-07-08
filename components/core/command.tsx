"use client"

import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Search, X } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Root ──────────────────────────────────────────────────────────────────────
//
// CommandInput and CommandList/CommandItem are siblings, so the roving
// "active" selection (APG Editable Combobox with List Autocomplete: focus
// stays on the input, ArrowUp/ArrowDown move a virtual selection reported via
// aria-activedescendant) is coordinated through this context rather than
// through DOM focus.

interface CommandItemEntry {
  id: string
  disabled?: boolean
  select: () => void
}

interface CommandCtx {
  listId: string
  activeId: string | null
  register: (entry: CommandItemEntry) => () => void
  move: (delta: 1 | -1) => void
  moveToEdge: (edge: "start" | "end") => void
  selectActive: () => void
}

const CommandContext = React.createContext<CommandCtx | null>(null)

function useCommandContext(componentName: string): CommandCtx {
  const ctx = React.useContext(CommandContext)
  if (!ctx) {
    throw new Error(`${componentName} must be used inside <Command>`)
  }
  return ctx
}

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Command({ open, onOpenChange, children, className }: CommandProps) {
  const listId = React.useId()
  const itemsRef = React.useRef<CommandItemEntry[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const register = React.useCallback((entry: CommandItemEntry) => {
    itemsRef.current.push(entry)
    setActiveId((current) => current ?? enabledItems(itemsRef.current)[0]?.id ?? null)
    return () => {
      itemsRef.current = itemsRef.current.filter((i) => i.id !== entry.id)
      setActiveId((current) => (current === entry.id ? enabledItems(itemsRef.current)[0]?.id ?? null : current))
    }
  }, [])

  const move = React.useCallback((delta: 1 | -1) => {
    const items = enabledItems(itemsRef.current)
    if (items.length === 0) return
    const currentIndex = items.findIndex((i) => i.id === activeId)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + delta + items.length) % items.length
    setActiveId(items[nextIndex].id)
  }, [activeId])

  const moveToEdge = React.useCallback((edge: "start" | "end") => {
    const items = enabledItems(itemsRef.current)
    if (items.length === 0) return
    setActiveId(edge === "start" ? items[0].id : items[items.length - 1].id)
  }, [])

  const selectActive = React.useCallback(() => {
    itemsRef.current.find((i) => i.id === activeId)?.select()
  }, [activeId])

  const ctx = React.useMemo<CommandCtx>(
    () => ({ listId, activeId, register, move, moveToEdge, selectActive }),
    [listId, activeId, register, move, moveToEdge, selectActive]
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

function enabledItems(items: CommandItemEntry[]): CommandItemEntry[] {
  return items.filter((i) => !i.disabled)
}

export const CommandTrigger = RadixDialog.Trigger

// ── Dialog shell ──────────────────────────────────────────────────────────────

export const CommandDialog = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
    <RadixDialog.Content
      ref={ref}
      className={cx(
        "fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-border bg-card shadow-2xl outline-none overflow-hidden",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-4",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
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
  const { listId, activeId, move, moveToEdge, selectActive } = useCommandContext("CommandInput")

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        move(1)
        break
      case "ArrowUp":
        e.preventDefault()
        move(-1)
        break
      case "Home":
        e.preventDefault()
        moveToEdge("start")
        break
      case "End":
        e.preventDefault()
        moveToEdge("end")
        break
      case "Enter":
        e.preventDefault()
        selectActive()
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
        aria-controls={listId}
        aria-activedescendant={activeId ?? undefined}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
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
  const { listId } = useCommandContext("CommandList")
  return (
    <div id={listId} role="listbox" className={cx("max-h-72 overflow-y-auto py-2", className)}>
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
  const { activeId, register } = useCommandContext("CommandItem")
  const id = React.useId()
  const isActive = activeId === id

  // Keep the latest onSelect/disabled in a ref so the registration effect
  // below can run once per mount instead of re-registering (and briefly
  // dropping out of the active-item list) whenever a parent re-render hands
  // CommandItem a new inline onSelect closure.
  const latest = React.useRef({ onSelect, disabled })
  React.useEffect(() => {
    latest.current = { onSelect, disabled }
  })

  React.useEffect(
    () => register({
      id,
      get disabled() { return latest.current.disabled },
      select: () => !latest.current.disabled && latest.current.onSelect?.(),
    }),
    [id, register]
  )

  return (
    <div
      id={id}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      // Not in the page Tab order: per the APG combobox-with-listbox pattern,
      // keyboard users navigate options from CommandInput (ArrowUp/Down +
      // Enter) via aria-activedescendant, not by tabbing to each option.
      tabIndex={-1}
      onClick={() => !disabled && onSelect?.()}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground outline-none transition-colors cursor-default",
        isActive ? "bg-surface-2" : "hover:bg-surface-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <span className="flex-1 text-left">{children}</span>
      {shortcut && (
        <kbd className="pointer-events-none ml-auto flex h-5 items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-[10px] text-muted-foreground">
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
