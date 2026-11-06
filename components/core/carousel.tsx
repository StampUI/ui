"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cx } from "@/lib/cx"

// ── Context ───────────────────────────────────────────────────────────────────

interface CarouselContextValue {
  current: number
  count: number
  setCount: (n: number) => void
  canPrev: boolean
  canNext: boolean
  prev: () => void
  next: () => void
  goTo: (index: number) => void
  loop: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("Must be inside Carousel")
  return ctx
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface CarouselProps {
  children: React.ReactNode
  loop?: boolean
  autoPlay?: number
  className?: string
}

export function Carousel({ children, loop = false, autoPlay, className }: CarouselProps) {
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const canPrev = loop || current > 0
  const canNext = loop || current < count - 1

  function prev() {
    setCurrent((c) => loop ? (c - 1 + count) % count : Math.max(0, c - 1))
  }
  function next() {
    setCurrent((c) => loop ? (c + 1) % count : Math.min(count - 1, c + 1))
  }
  function goTo(index: number) {
    setCurrent(Math.max(0, Math.min(count - 1, index)))
  }

  React.useEffect(() => {
    if (!autoPlay || count === 0) return
    const t = setInterval(next, autoPlay)
    return () => clearInterval(t)
  }, [autoPlay, count, current])

  return (
    <CarouselContext.Provider value={{ current, count, setCount, canPrev, canNext, prev, next, goTo, loop }}>
      <div className={cx("relative", className)} data-carousel>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

export function CarouselContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { current, setCount } = useCarousel()
  const items = React.Children.toArray(children)

  React.useEffect(() => {
    setCount(items.length)
  }, [items.length])

  return (
    <div className={cx("overflow-hidden", className)}>
      <div
        data-carousel-content
        className="flex transition-transform duration-slow ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((child, i) => (
          <div key={i} className="w-full shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Item ──────────────────────────────────────────────────────────────────────

export function CarouselItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("w-full", className)}>{children}</div>
}

// ── Controls ──────────────────────────────────────────────────────────────────

export function CarouselPrevious({ className }: { className?: string }) {
  const { prev, canPrev } = useCarousel()
  return (
    <button
      onClick={prev}
      disabled={!canPrev}
      className={cx(
        "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors",
        "hover:bg-surface-2 disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </button>
  )
}

export function CarouselNext({ className }: { className?: string }) {
  const { next, canNext } = useCarousel()
  return (
    <button
      onClick={next}
      disabled={!canNext}
      className={cx(
        "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-colors",
        "hover:bg-surface-2 disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next</span>
    </button>
  )
}

// ── Dots ──────────────────────────────────────────────────────────────────────

export function CarouselDots({ className }: { className?: string }) {
  const { current, count, goTo } = useCarousel()
  return (
    <div className={cx("flex items-center gap-1.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={cx(
            "h-1.5 rounded-full transition-all duration-200",
            i === current ? "w-4 bg-foreground" : "w-1.5 bg-border-strong hover:bg-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}

// ── Counter ───────────────────────────────────────────────────────────────────

export function CarouselCounter({ className }: { className?: string }) {
  const { current, count } = useCarousel()
  return (
    <span className={cx("text-xs text-muted-foreground", className)}>
      {current + 1} / {count}
    </span>
  )
}
