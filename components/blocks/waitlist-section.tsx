"use client"

import * as React from "react"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface WaitlistSectionProps {
  headline?: string
  subtext?: string
  placeholder?: string
  buttonLabel?: string
  count?: number
  className?: string
}

export function WaitlistSection({
  headline = "Be first to get access.",
  subtext = "We're rolling out access gradually. Drop your email to reserve your spot.",
  placeholder = "you@company.com",
  buttonLabel = "Join Waitlist",
  count = 2847,
  className,
}: WaitlistSectionProps) {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.")
      return
    }
    setError("")
    setSubmitted(true)
  }

  const formattedCount = count.toLocaleString()

  return (
    <section
      className={cx(
        "w-full py-20 px-6 flex flex-col items-center text-center",
        className
      )}
    >
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA] max-w-xl leading-tight">
        {headline}
      </h2>

      {subtext && (
        <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
          {subtext}
        </p>
      )}

      <div className="mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FAFAFA]/40" />
        <span className="text-xs text-muted-foreground font-medium">
          {formattedCount} developers waiting
        </span>
      </div>

      {submitted ? (
        <div className="mt-8 px-6 py-4 rounded-xl border border-[#23252A] bg-[#09090B] text-sm text-[#FAFAFA] font-medium">
          You&apos;re on the list. We&apos;ll reach out soon.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-md flex flex-col sm:flex-row gap-2"
          noValidate
        >
          <div className="flex-1 flex flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("")
              }}
              placeholder={placeholder}
              className={cx(
                "h-10 w-full rounded-xl border bg-[#101114] px-4 text-sm text-[#FAFAFA] placeholder:text-muted-foreground outline-none",
                "transition-colors duration-[170ms] ease-out",
                "focus:border-[#FAFAFA]/20",
                error ? "border-red-500/60" : "border-[#23252A]"
              )}
            />
            {error && (
              <span className="mt-1.5 text-xs text-red-400 text-left">{error}</span>
            )}
          </div>
          <Button type="submit" className="h-10 shrink-0">
            {buttonLabel}
          </Button>
        </form>
      )}
    </section>
  )
}
