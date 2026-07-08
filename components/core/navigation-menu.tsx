"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Context ───────────────────────────────────────────────────────────────

interface NavMenuCtx { open: string | null; setOpen: (id: string | null) => void }
const NavMenuContext = React.createContext<NavMenuCtx>({ open: null, setOpen: () => {} })

// ── Root ──────────────────────────────────────────────────────────────────

export type NavigationMenuProps = React.HTMLAttributes<HTMLElement>

export function NavigationMenu({ className, children, ...props }: NavigationMenuProps) {
  const [open, setOpen] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    const close = () => setOpen(null)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  return (
    <NavMenuContext.Provider value={{ open, setOpen }}>
      <nav
        aria-label="Navigation"
        className={cx("relative flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </nav>
    </NavMenuContext.Provider>
  )
}

// ── Item (link only) ──────────────────────────────────────────────────────

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

export function NavigationMenuLink({ className, active, children, ...props }: NavigationMenuLinkProps) {
  return (
    <a
      data-active={active || undefined}
      className={cx(
        "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        active ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground hover:bg-surface-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

// ── Item with dropdown ────────────────────────────────────────────────────

export interface NavigationMenuItemProps {
  id: string
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function NavigationMenuItem({ id, trigger, children, className }: NavigationMenuItemProps) {
  const { open, setOpen } = React.useContext(NavMenuContext)
  const isOpen = open === id

  return (
    <div className={cx("relative", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => { e.stopPropagation(); setOpen(isOpen ? null : id) }}
        className={cx(
          "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors select-none",
          isOpen ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
        )}
      >
        {trigger}
        <ChevronDown className={cx("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute start-0 top-full mt-1.5 z-50 min-w-48 rounded-xl border border-border bg-background p-2 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  )
}

// ── Dropdown content items ────────────────────────────────────────────────

export interface NavigationMenuContentItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function NavigationMenuContentItem({ title, description, icon, className, ...props }: NavigationMenuContentItemProps) {
  return (
    <a
      className={cx(
        "flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-2 group cursor-pointer",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</div>}
      </div>
    </a>
  )
}
