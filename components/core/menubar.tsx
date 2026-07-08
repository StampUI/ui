"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

// ── Context ────────────────────────────────────────────────────────────────

interface MenubarCtx { open: string | null; setOpen: (id: string | null) => void }
const MenubarContext = React.createContext<MenubarCtx>({ open: null, setOpen: () => {} })

// ── Root ──────────────────────────────────────────────────────────────────

export type MenubarProps = React.HTMLAttributes<HTMLDivElement>

export function Menubar({ className, children, ...props }: MenubarProps) {
  const [open, setOpen] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    const close = () => setOpen(null)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  return (
    <MenubarContext.Provider value={{ open, setOpen }}>
      <div
        role="menubar"
        className={cx("flex items-center gap-1 rounded-lg border border-border bg-background p-1", className)}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  )
}

// ── Menu ──────────────────────────────────────────────────────────────────

export interface MenubarMenuProps { id: string; trigger: React.ReactNode; children: React.ReactNode }

export function MenubarMenu({ id, trigger, children }: MenubarMenuProps) {
  const { open, setOpen } = React.useContext(MenubarContext)
  const isOpen = open === id

  return (
    <div className="relative">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(e) => { e.stopPropagation(); setOpen(isOpen ? null : id) }}
        className={cx(
          "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors select-none",
          isOpen
            ? "bg-surface-2 text-foreground"
            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
        )}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1 z-50 min-w-40 rounded-lg border border-border bg-background p-1 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  )
}

// ── Item ──────────────────────────────────────────────────────────────────

export interface MenubarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
  shortcut?: string
}

export function MenubarItem({ className, children, inset, shortcut, ...props }: MenubarItemProps) {
  const { setOpen } = React.useContext(MenubarContext)
  return (
    <button
      type="button"
      role="menuitem"
      onClick={(e) => { props.onClick?.(e); setOpen(null) }}
      className={cx(
        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground",
        "transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {shortcut && <span className="text-xs text-muted-foreground font-mono">{shortcut}</span>}
    </button>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────

export function MenubarSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cx("my-1 h-px bg-border", className)} />
}

// ── Label ─────────────────────────────────────────────────────────────────

export function MenubarLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("px-2 py-1 text-xs font-semibold text-muted-foreground", className)}>
      {children}
    </div>
  )
}
