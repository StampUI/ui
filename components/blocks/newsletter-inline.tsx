"use client"

import * as React from "react"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { cx } from "@/lib/cx"

export interface NewsletterInlineProps {
  /** Short bold lead, rendered before the description. */
  title?: React.ReactNode
  /** One line of copy next to the form. */
  description?: React.ReactNode
  /** POST endpoint that receives `{ email, company }` as JSON. Ignored when `onSubmit` is set. */
  action?: string
  /** Handle the email yourself (e.g. call your own API). Throw to show `errorMessage`. */
  onSubmit?: (email: string) => Promise<void> | void
  placeholder?: string
  buttonLabel?: string
  successMessage?: React.ReactNode
  /** Fallback error when the endpoint returns no `error` message. */
  errorMessage?: string
  className?: string
}

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterInline({
  title,
  description = "Get one email when new Pages ship. No spam.",
  action = "/api/subscribe",
  onSubmit,
  placeholder = "you@company.com",
  buttonLabel = "Subscribe",
  successMessage = "You are on the list. Check your inbox for the next release.",
  errorMessage = "Could not subscribe right now. Try again later.",
  className,
}: NewsletterInlineProps) {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [error, setError] = React.useState("")
  const honeypotRef = React.useRef<HTMLInputElement>(null)
  const id = React.useId()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    setError("")
    try {
      if (onSubmit) {
        await onSubmit(email.trim())
      } else {
        const res = await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), company: honeypotRef.current?.value ?? "" }),
        })
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error || errorMessage)
        }
      }
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : errorMessage)
      setStatus("error")
    }
  }

  return (
    <div className={cx("flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6", className)}>
      <p id={`${id}-desc`} className="text-sm text-muted-foreground">
        {title && <span className="font-medium text-foreground">{title} </span>}
        {description}
      </p>

      {status === "success" ? (
        <p role="status" className="text-sm text-foreground-soft">
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-1.5 md:w-auto">
          <div className="flex w-full gap-2">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <Input
              id={`${id}-email`}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              aria-describedby={`${id}-desc`}
              aria-invalid={status === "error" || undefined}
              className="h-9 min-w-0 flex-1 md:w-64"
            />
            {/* Honeypot: hidden from people, filled by naive bots. */}
            <input
              ref={honeypotRef}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            <Button type="submit" variant="outline" disabled={status === "loading"} className="shrink-0">
              {status === "loading" ? "Subscribing" : buttonLabel}
            </Button>
          </div>
          {status === "error" && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
