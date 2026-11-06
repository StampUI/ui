"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

// ── Context ───────────────────────────────────────────────────────────────────

interface PanelGroupContextValue {
  direction: "horizontal" | "vertical"
  sizes: number[]
  setSizes: React.Dispatch<React.SetStateAction<number[]>>
  minSizes: number[]
}

const PanelGroupContext = React.createContext<PanelGroupContextValue | null>(null)

function usePanelGroup() {
  const ctx = React.useContext(PanelGroupContext)
  if (!ctx) throw new Error("ResizablePanel/ResizableHandle must be inside ResizablePanelGroup")
  return ctx
}

// ── PanelGroup ─────────────────────────────────────────────────────────────────

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"
  defaultSizes?: number[]
}

export function ResizablePanelGroup({
  className,
  direction = "horizontal",
  defaultSizes,
  children,
  ...props
}: ResizablePanelGroupProps) {
  // Count panel children to compute default sizes
  const childArray = React.Children.toArray(children)
  const panelCount = childArray.filter(
    (c) => React.isValidElement(c) && (c.type as { displayName?: string }).displayName === "ResizablePanel"
  ).length

  const initialSizes = React.useMemo(() => {
    if (defaultSizes && defaultSizes.length === panelCount) return defaultSizes
    const n = Math.max(panelCount, 1)
    return Array<number>(n).fill(100 / n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally mount-only

  const [sizes, setSizes] = React.useState<number[]>(initialSizes)

  const minSizes = React.useMemo(() => {
    const mins: number[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type as { displayName?: string }).displayName === "ResizablePanel") {
        mins.push((child.props as ResizablePanelProps).minSize ?? 10)
      }
    })
    return mins
  }, [children])

  // Inject panel/handle indexes via cloneElement so consumers don't need explicit index props
  let panelIdx = 0
  let handleIdx = 0
  const enhanced = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const displayName = (child.type as { displayName?: string }).displayName
    if (displayName === "ResizablePanel") {
      return React.cloneElement(child as React.ReactElement<ResizablePanelProps>, {
        _index: panelIdx++,
      })
    }
    if (displayName === "ResizableHandle") {
      return React.cloneElement(child as React.ReactElement<ResizableHandleProps>, {
        _index: handleIdx++,
      })
    }
    return child
  })

  return (
    <PanelGroupContext.Provider value={{ direction, sizes, setSizes, minSizes }}>
      <div
        className={cx(
          "flex h-full w-full overflow-hidden",
          direction === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        data-panel-group-direction={direction}
        {...props}
      >
        {enhanced}
      </div>
    </PanelGroupContext.Provider>
  )
}
ResizablePanelGroup.displayName = "ResizablePanelGroup"

// ── Panel ──────────────────────────────────────────────────────────────────────

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  minSize?: number
  /** Injected automatically by ResizablePanelGroup, do not pass manually. */
  _index?: number
}

export function ResizablePanel({
  className,
  children,
  minSize = 10,
  _index = 0,
  style,
  ...props
}: ResizablePanelProps) {
  const { direction, sizes } = usePanelGroup()
  const size = sizes[_index] ?? 100 / Math.max(sizes.length, 1)

  const sizeStyle: React.CSSProperties =
    direction === "horizontal"
      ? { width: `${size}%`, minWidth: `${minSize}%`, flexShrink: 0 }
      : { height: `${size}%`, minHeight: `${minSize}%`, flexShrink: 0 }

  return (
    <div
      className={cx("overflow-auto min-w-0 min-h-0", className)}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
ResizablePanel.displayName = "ResizablePanel"

// ── Handle ─────────────────────────────────────────────────────────────────────

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean
  /** Injected automatically by ResizablePanelGroup, do not pass manually. */
  _index?: number
}

export function ResizableHandle({
  className,
  withHandle = true,
  _index = 0,
  ...props
}: ResizableHandleProps) {
  const { direction, sizes, setSizes, minSizes } = usePanelGroup()
  const handleRef = React.useRef<HTMLDivElement>(null)
  const sizesRef = React.useRef(sizes)
  React.useLayoutEffect(() => {
    sizesRef.current = sizes
  }, [sizes])

  const isDragging = React.useRef(false)
  const dragStartPos = React.useRef(0)
  const dragStartSizes = React.useRef<number[]>([])

  function clampSizes(rawSizes: number[], a: number, b: number, newA: number): number[] {
    const total = rawSizes[a] + rawSizes[b]
    const minA = minSizes[a] ?? 10
    const minB = minSizes[b] ?? 10
    let sa = newA
    let sb = total - sa
    if (sa < minA) { sa = minA; sb = total - minA }
    if (sb < minB) { sb = minB; sa = total - minB }
    const next = [...rawSizes]
    next[a] = sa
    next[b] = sb
    return next
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!handleRef.current) return
    handleRef.current.setPointerCapture(e.pointerId)
    isDragging.current = true
    dragStartPos.current = direction === "horizontal" ? e.clientX : e.clientY
    dragStartSizes.current = [...sizesRef.current]
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return
    const container = handleRef.current?.parentElement
    if (!container) return
    const rect = container.getBoundingClientRect()
    const totalPx = direction === "horizontal" ? rect.width : rect.height
    if (totalPx === 0) return
    const a = _index
    const b = _index + 1
    if (b >= dragStartSizes.current.length) return
    const currentPos = direction === "horizontal" ? e.clientX : e.clientY
    // Under dir="rtl" a horizontal group lays out right to left, so moving
    // the pointer right shrinks the first panel instead of growing it.
    const rtl = direction === "horizontal" && handleRef.current?.closest("[dir]")?.getAttribute("dir") === "rtl"
    const deltaPct = ((currentPos - dragStartPos.current) / totalPx) * 100 * (rtl ? -1 : 1)
    const newA = (dragStartSizes.current[a] ?? 0) + deltaPct
    setSizes((prev) => clampSizes(prev, a, b, newA))
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return
    isDragging.current = false
    handleRef.current?.releasePointerCapture(e.pointerId)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = 2
    // WAI-ARIA APG separator pattern: under right-to-left the physical
    // Left/Right keys swap meaning, so a key still moves the boundary toward
    // the same side of the screen. dir only mirrors the inline axis, so
    // vertical groups are unaffected. The nearest dir attribute is read
    // instead of getComputedStyle, which jsdom does not cascade.
    const isRtl =
      direction === "horizontal" &&
      handleRef.current?.closest("[dir]")?.getAttribute("dir") === "rtl"
    const isForward =
      direction === "horizontal" ? e.key === (isRtl ? "ArrowLeft" : "ArrowRight") : e.key === "ArrowDown"
    const isBack =
      direction === "horizontal" ? e.key === (isRtl ? "ArrowRight" : "ArrowLeft") : e.key === "ArrowUp"
    if (!isForward && !isBack) return
    e.preventDefault()
    const delta = isForward ? step : -step
    const a = _index
    const b = _index + 1
    setSizes((prev) => {
      if (b >= prev.length) return prev
      return clampSizes(prev, a, b, prev[a] + delta)
    })
  }

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      className={cx(
        "group relative flex shrink-0 items-center justify-center select-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong",
        direction === "horizontal"
          ? "w-px h-full cursor-col-resize"
          : "h-px w-full cursor-row-resize",
        className
      )}
      {...props}
    >
      {/* 1px visual divider */}
      <div
        className={cx(
          "absolute bg-border transition-colors group-hover:bg-border-strong group-active:bg-border-strong",
          direction === "horizontal"
            ? "inset-y-0 left-1/2 -translate-x-1/2 w-px"
            : "inset-x-0 top-1/2 -translate-y-1/2 h-px"
        )}
      />
      {withHandle && (
        <div className="relative z-10 flex h-5 w-3.5 items-center justify-center rounded border border-border bg-surface-2 shadow-sm">
          <svg
            width="6"
            height="12"
            viewBox="0 0 6 12"
            fill="none"
            className={cx(
              "text-muted-foreground",
              direction === "vertical" && "rotate-90"
            )}
          >
            <circle cx="1" cy="3" r="1" fill="currentColor" />
            <circle cx="5" cy="3" r="1" fill="currentColor" />
            <circle cx="1" cy="6" r="1" fill="currentColor" />
            <circle cx="5" cy="6" r="1" fill="currentColor" />
            <circle cx="1" cy="9" r="1" fill="currentColor" />
            <circle cx="5" cy="9" r="1" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  )
}
ResizableHandle.displayName = "ResizableHandle"
