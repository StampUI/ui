"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cx } from "@/lib/cx"

export interface AnnouncementCTA {
  label: string
  href?: string
  onClick?: () => void
}

export interface AnnouncementBarProps {
  message: string
  cta?: AnnouncementCTA
  variant?: "info" | "warning" | "success"
  dismissible?: boolean
  className?: string
}

const variantStyles: Record<
  NonNullable<AnnouncementBarProps["variant"]>,
  { bar: string; label: string }
> = {
  info: {
    bar: "bg-[#09090B] border-b border-[#23252A]",
    label: "text-muted-foreground",
  },
  warning: {
    bar: "bg-[#09090B] border-b border-[#23252A]",
    label: "text-[#FAFAFA] font-medium",
  },
  success: {
    bar: "bg-[#09090B] border-b border-[#23252A]",
    label: "text-muted-foreground",
  },
}

export function AnnouncementBar({
  message,
  cta,
  variant = "info",
  dismissible = false,
  className,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  const styles = variantStyles[variant]

  return (
    <div
      className={cx(
        "relative w-full px-4 py-2.5",
        styles.bar,
        className
      )}
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        <p className={cx("text-xs leading-snug", styles.label)}>
          {message}
        </p>

        {cta && (
          <>
            <span className="shrink-0 text-[#23252A]" aria-hidden>
              ·
            </span>
            {cta.href ? (
              <a
                href={cta.href}
                className="shrink-0 text-xs font-semibold text-[#FAFAFA] underline-offset-2 hover:underline transition-colors duration-150 ease-out"
              >
                {cta.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={cta.onClick}
                className="shrink-0 text-xs font-semibold text-[#FAFAFA] underline-offset-2 hover:underline transition-colors duration-150 ease-out"
              >
                {cta.label}
              </button>
            )}
          </>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-out hover:bg-[#101114] hover:text-[#FAFAFA]"
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
