"use client"

import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"
import { Search, X } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Root ──────────────────────────────────────────────────────────────────────

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function Command({ open, onOpenChange, children, className }: CommandProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <div className={className}>
        {children}
      </div>
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
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button onClick={() => onValueChange?.("")} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ── List ───────────────────────────────────────────────────────────────────────

export function CommandList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("max-h-72 overflow-y-auto py-2", className)}>
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
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cx(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground outline-none transition-colors",
        "hover:bg-surface-2 focus:bg-surface-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <span className="flex-1 text-left">{children}</span>
      {shortcut && (
        <kbd className="pointer-events-none ml-auto flex h-5 items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-[10px] text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </button>
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
