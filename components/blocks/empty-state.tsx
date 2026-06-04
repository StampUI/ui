"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface EmptyStateAction {
  label: string
  onClick?: () => void
  href?: string
}

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center text-center px-6 py-16",
        className
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#23252A] bg-[#09090B]">
        <Icon size={24} className="text-muted-foreground" strokeWidth={1.5} />
      </div>

      <h3 className="text-sm font-semibold text-[#FAFAFA] mb-1.5">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}

      {action && (
        <div className={cx(!description && "mt-6")}>
          {action.href ? (
            <Button variant="outline" size="sm" asChild>
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
