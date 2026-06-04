import * as React from "react"
import { Separator } from "@/components/core/separator"
import { cx } from "@/lib/cx"

export interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
}

export interface StatsStripProps {
  stats?: Stat[]
  layout?: "strip" | "grid"
  className?: string
}

const defaultStats: Stat[] = [
  { value: 65, suffix: "+", label: "Components", description: "Accessible UI primitives" },
  { value: 8, label: "Page Blocks", description: "Production-ready layouts" },
  { value: 10, label: "Minute Setup", description: "From zero to shipped" },
  { value: 0, label: "Runtime Deps", description: "Code you fully own" },
]

function AnimatedValue({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement>(null)
  const started = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplayed(Math.round(eased * value))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayed}{suffix}
    </span>
  )
}

export function StatsStrip({ stats = defaultStats, layout = "strip", className }: StatsStripProps) {
  if (layout === "strip") {
    return (
      <section className={cx("w-full border-y border-border bg-surface-2/30 py-10 px-6", className)}>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-0 divide-x divide-border">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center px-10 py-2">
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  <AnimatedValue value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </span>
                <span className="mt-1 text-sm font-medium text-foreground">{stat.label}</span>
                {stat.description && (
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cx("w-full py-16 px-6", className)}>
      <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              <AnimatedValue value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </span>
            <Separator className="my-3 w-8" />
            <span className="text-sm font-medium text-foreground">{stat.label}</span>
            {stat.description && (
              <span className="text-xs text-muted-foreground mt-0.5">{stat.description}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
