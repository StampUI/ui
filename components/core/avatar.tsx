"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

const avatarStyles = cva(
  "relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: { size: "md", shape: "circle" },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarStyles> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cx(avatarStyles({ size, shape }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cx("aspect-square h-full w-full object-cover animate-fade-in", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cx(
      "flex h-full w-full items-center justify-center",
      "bg-surface-3 text-muted-foreground font-medium",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const groupOverflowStyles = cva(
  "relative flex shrink-0 items-center justify-center rounded-full bg-surface-3 border-background font-medium text-muted-foreground",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs border-2",
        sm: "h-8 w-8 text-xs border-2",
        md: "h-10 w-10 text-xs border-2",
        lg: "h-12 w-12 text-sm border-[2.5px]",
        xl: "h-16 w-16 text-base border-[3px]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

function AvatarGroup({ children, max, size = "md", className, ...props }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const shown = max ? childArray.slice(0, max) : childArray
  const overflow = max ? childArray.length - max : 0

  return (
    <div className={cx("flex -space-x-2", className)} {...props}>
      {shown}
      {overflow > 0 && (
        <div className={groupOverflowStyles({ size })}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }
