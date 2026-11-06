"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"
import { toggleVariants } from "@/components/core/toggle"

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  variant: "outline",
  size: "md",
})

type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

interface IndicatorRect {
  left: number
  top: number
  width: number
  height: number
  radius: string
}

/**
 * Single-select groups get a sliding indicator: one surface that moves to the
 * pressed item (duration-slow, ease-out) instead of each item swapping its own
 * background. Until it is measured the items keep their own on-state styles,
 * so server render and multi-select groups look exactly as before.
 */
function ToggleGroup({ className, variant, size, children, ...props }: ToggleGroupProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [rect, setRect] = React.useState<IndicatorRect | null>(null)
  const [settled, setSettled] = React.useState(false)
  const single = props.type === "single"

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!single || !root) return

    const measure = () => {
      const active = root.querySelector<HTMLElement>(':scope > div > [data-state="on"]')
      if (!active) return setRect(null)
      setRect({
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
        radius: getComputedStyle(active).borderRadius,
      })
    }
    measure()

    const mutations = new MutationObserver(measure)
    mutations.observe(root, { subtree: true, attributes: true, attributeFilter: ["data-state"] })
    const resize = new ResizeObserver(measure)
    resize.observe(root)
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [single])

  // Enable the slide only after the first placement, so it never flies in from 0,0.
  React.useEffect(() => {
    if (!rect || settled) return
    const frame = requestAnimationFrame(() => setSettled(true))
    return () => cancelAnimationFrame(frame)
  }, [rect, settled])

  const indicatorVariant = variant ?? "outline"

  return (
    <ToggleGroupPrimitive.Root
      ref={rootRef}
      data-indicator={rect ? "" : undefined}
      className={cx(
        "relative flex items-center",
        "[&[data-indicator]>div>[data-state=on]]:bg-transparent",
        className,
      )}
      {...props}
    >
      {rect && (
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute",
            settled && "transition-[left,top,width,height] duration-slow ease-out",
            indicatorVariant === "solid" ? "bg-foreground" : "bg-surface-2",
          )}
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            borderRadius: rect.radius,
          }}
        />
      )}
      {/* display: contents keeps the items as flex children of the root while
          the indicator stays out of their :first-child / :last-child count. */}
      <div className="contents">
        <ToggleGroupContext.Provider value={{ variant, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </div>
    </ToggleGroupPrimitive.Root>
  )
}
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cx(
        toggleVariants({ variant: variant ?? context.variant, size: size ?? context.size }),
        // connected group: collapse borders between siblings
        "relative rounded-none first:rounded-l-lg last:rounded-r-lg",
        "border-r-0 last:border-r",
        "[&[data-size=sm]]:first:rounded-l-md [&[data-size=sm]]:last:rounded-r-md",
        className,
      )}
      {...props}
    />
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
