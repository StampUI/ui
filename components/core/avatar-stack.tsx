"use client"

import * as React from "react"
import { cx } from "@/lib/cx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/core/tooltip"

export interface AvatarStackUser {
  name: string
  src?: string
}

export interface AvatarStackProps {
  users: AvatarStackUser[]
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: { ring: "h-6 w-6 text-xs border-[1.5px]", offset: "-ml-1.5 group-hover/stack:-ml-1" },
  md: { ring: "h-8 w-8 text-xs border-2", offset: "-ml-2 group-hover/stack:-ml-1.5" },
  lg: { ring: "h-10 w-10 text-xs border-2", offset: "-ml-2.5 group-hover/stack:-ml-2" },
}

export function AvatarStack({ users, max = 4, size = "md", className }: AvatarStackProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max
  const { ring, offset } = sizes[size]

  return (
    <div className={cx("group/stack flex items-center", className)}>
      {visible.map((user, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <div
              className={cx(
                "relative inline-flex shrink-0 items-center justify-center rounded-full border-background bg-surface-2 font-medium text-foreground overflow-hidden transition-[margin] duration-base ease-out",
                ring,
                i > 0 && offset
              )}
              style={{ zIndex: visible.length - i }}
            >
              {user.src ? (
                <img src={user.src} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="select-none">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>{user.name}</TooltipContent>
        </Tooltip>
      ))}
      {overflow > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cx(
                "relative inline-flex shrink-0 items-center justify-center rounded-full border-background bg-surface-3 font-medium text-muted-foreground transition-[margin] duration-base ease-out",
                ring,
                offset
              )}
            >
              +{overflow}
            </div>
          </TooltipTrigger>
          <TooltipContent>{overflow} more people</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
