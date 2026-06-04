"use client"

import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "next-themes"

export { toast } from "sonner"

export function Toaster() {
  const { resolvedTheme } = useTheme()
  return (
    <SonnerToaster
      theme={resolvedTheme as "light" | "dark" | undefined}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group border border-border bg-card text-foreground shadow-lg rounded-xl text-sm font-medium gap-3 px-4 py-3",
          description: "text-muted-foreground text-xs",
          actionButton: "bg-foreground text-background text-xs font-medium rounded-md px-2.5 py-1 hover:bg-foreground/90",
          cancelButton: "bg-surface-2 text-muted-foreground text-xs font-medium rounded-md px-2.5 py-1 hover:bg-surface-3",
          error: "border-danger/30",
          success: "border-border",
          warning: "border-border",
          info: "border-border",
        },
      }}
    />
  )
}
