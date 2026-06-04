import * as React from "react"
import { cx } from "@/lib/cx"

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
  sm: { ring: "h-6 w-6 text-[9px] border-[1.5px]", offset: "-ml-1.5" },
  md: { ring: "h-8 w-8 text-[11px] border-2", offset: "-ml-2" },
  lg: { ring: "h-10 w-10 text-xs border-2", offset: "-ml-2.5" },
}

export function AvatarStack({ users, max = 4, size = "md", className }: AvatarStackProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - max
  const { ring, offset } = sizes[size]

  return (
    <div className={cx("flex items-center", className)}>
      {visible.map((user, i) => (
        <div
          key={i}
          title={user.name}
          className={cx(
            "relative inline-flex shrink-0 items-center justify-center rounded-full border-background bg-surface-2 font-medium text-foreground overflow-hidden",
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
      ))}
      {overflow > 0 && (
        <div
          className={cx(
            "relative inline-flex shrink-0 items-center justify-center rounded-full border-background bg-surface-3 font-medium text-muted-foreground",
            ring,
            offset
          )}
          title={`${overflow} more`}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
