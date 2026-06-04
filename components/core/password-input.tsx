"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cx } from "@/lib/cx"

function getStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4
}

const strengthConfig = [
  { label: "", color: "bg-border" },
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-orange-400" },
  { label: "Good", color: "bg-yellow-400" },
  { label: "Strong", color: "bg-green-500" },
]

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onChange, value, defaultValue, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState((defaultValue as string) ?? "")

    const controlled = value !== undefined
    const password = controlled ? (value as string) : internalValue
    const strength = showStrength ? getStrength(password) : 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setInternalValue(e.target.value)
      onChange?.(e)
    }

    return (
      <div className="w-full space-y-2">
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            value={controlled ? value : internalValue}
            onChange={handleChange}
            autoComplete={props.autoComplete || "new-password"}
            data-1p-ignore="true"
            data-lpignore="true"
            className={cx(
              "flex w-full rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-border-strong disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {showStrength && password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cx(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    strength >= level ? strengthConfig[strength].color : "bg-border"
                  )}
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {strengthConfig[strength].label}
            </p>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"
