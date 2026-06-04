"use client"

import * as React from "react"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
  onCustomize?: () => void
  title?: string
  description?: string
  className?: string
}

export function CookieConsent({
  onAccept,
  onDecline,
  onCustomize,
  title = "We use cookies",
  description = "We use cookies to improve your experience, analyze site traffic, and serve personalized content. You can accept all cookies or manage your preferences.",
  className,
}: CookieConsentProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cx(
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t border-[#23252A] bg-[#09090B]",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#FAFAFA] mb-0.5">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onCustomize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCustomize}
                className="text-xs"
              >
                Customize
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onDecline}
              className="text-xs"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAccept}
              className="text-xs"
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
