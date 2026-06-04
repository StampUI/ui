"use client"

import * as React from "react"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface ErrorPageAction {
  label: string
  href?: string
  onClick?: () => void
}

export interface ErrorPageProps {
  code?: string | number
  title?: string
  description?: string
  action?: ErrorPageAction
  className?: string
}

export function ErrorPage({
  code = "404",
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved.",
  action = { label: "Back to home", href: "/" },
  className,
}: ErrorPageProps) {
  return (
    <div
      className={cx(
        "min-h-screen w-full bg-[#070708] flex flex-col items-center justify-center px-6",
        className
      )}
    >
      <div className="flex flex-col items-center text-center max-w-sm">
        <span
          className="text-[96px] font-bold leading-none tracking-tighter text-muted-foreground/30 select-none tabular-nums"
          aria-hidden="true"
        >
          {code}
        </span>

        <h1 className="mt-4 text-xl font-semibold text-[#FAFAFA] tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {action && (
          <div className="mt-8">
            {action.href ? (
              <Button variant="outline" size="md" asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button variant="outline" size="md" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
