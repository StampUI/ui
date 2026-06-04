"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Root ──────────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
}

export function Sidebar({ className, collapsed = false, children, ...props }: SidebarProps) {
  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cx(
        "flex flex-col gap-1 py-4 transition-all duration-200",
        collapsed ? "w-14" : "w-60",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// ── Section ───────────────────────────────────────────────────────────────

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  collapsed?: boolean
}

export function SidebarSection({ title, collapsed, className, children, ...props }: SidebarSectionProps) {
  return (
    <div className={cx("flex flex-col gap-0.5", className)} {...props}>
      {title && !collapsed && (
        <p className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

// ── Item ──────────────────────────────────────────────────────────────────

export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label: string
  active?: boolean
  badge?: React.ReactNode
  collapsed?: boolean
  href?: string
}

export function SidebarItem({ icon, label, active, badge, collapsed, href, className, ...props }: SidebarItemProps) {
  const Tag = href ? "a" : "button"
  return (
    <Tag
      {...(href ? { href } : { type: "button" })}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cx(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full",
        active
          ? "bg-surface-2 text-foreground"
          : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...(props as any)}
    >
      {icon && <span className="shrink-0 text-[1em]">{icon}</span>}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge && <span className="shrink-0">{badge}</span>}
    </Tag>
  )
}

// ── Collapsible group ─────────────────────────────────────────────────────

export interface SidebarGroupProps {
  icon?: React.ReactNode
  label: string
  defaultOpen?: boolean
  collapsed?: boolean
  className?: string
  children: React.ReactNode
}

export function SidebarGroup({ icon, label, defaultOpen = false, collapsed, className, children }: SidebarGroupProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className={cx("flex flex-col gap-0.5", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2/60 hover:text-foreground transition-colors w-full",
          collapsed && "justify-center px-2"
        )}
      >
        {icon && <span className="shrink-0 text-[1em]">{icon}</span>}
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            <ChevronRight className={cx("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-90")} />
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-3 border-l border-border pl-3 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={cx("mx-3 my-2 h-px bg-border", className)} />
}
