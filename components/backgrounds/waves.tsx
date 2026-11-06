"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

/**
 * Waves: layered sine lines that rise and settle like a slow swell, drawn as
 * thin strokes. The pointer lifts the lines nearest to it.
 */

export interface WavesProps {
  /** Motion multiplier. 0 holds the lines still. */
  speed?: number
  /** Line count multiplier. */
  density?: number
  /** "mono" draws in --foreground, "chart" bands the lines by --chart-1..3. */
  palette?: Palette
  /** Fade toward the page: "edges", "center" (clear zone for a headline), "bottom" or "none". */
  mask?: Mask
  /** Overall strength of the effect, 0 to 1. */
  opacity?: number
  /** The pointer lifts the lines near the cursor. */
  interactive?: boolean
  className?: string
}

export function Waves({
  speed = 1,
  density = 1,
  palette = "mono",
  mask = "edges",
  opacity = 0.8,
  interactive = true,
  className,
}: WavesProps) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    return mount(ref.current, { speed, interactive }, wavesScene({ density, palette, mask, opacity }))
  }, [speed, density, palette, mask, opacity, interactive])
  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  )
}

const LEVELS = 12
const STEP = 6
const CHUNK = 8

function wavesScene(o: { density: number; palette: Palette; mask: Mask; opacity: number }): Scene {
  return {
    draw(f) {
      const { ctx, w, h, t } = f
      const n = Math.max(8, Math.round(22 * o.density))
      const groups = o.palette === "chart" ? 3 : 1
      const batches = levels(LEVELS * groups)
      const amp = Math.min(70, h * 0.09)
      const k1 = TAU / Math.max(420, w * 0.55)
      const k2 = TAU / Math.max(260, w * 0.32)

      for (let i = 0; i < n; i++) {
        const q = i / (n - 1)
        const base = h * (0.18 + 0.7 * q)
        const lift = 0.45 + 0.55 * Math.sin(q * Math.PI)
        const g = groups > 1 ? Math.min(2, Math.floor(q * 3)) : 0
        const depth = 0.45 + 0.55 * q
        let path: Path2D | null = null
        let chunkLevel = -1
        let count = 0
        let prev: [number, number] | null = null
        for (let x = -STEP; x <= w + STEP; x += STEP) {
          let y =
            base +
            amp * lift * (0.62 * Math.sin(x * k1 + t * 0.32 + i * 0.38) + 0.38 * Math.sin(x * k2 - t * 0.21 + i * 0.23))
          if (f.pa > 0.01) {
            const dx = (x - f.px) / 150
            const dy = (base - f.py) / 140
            y -= 26 * f.pa * Math.exp(-(dx * dx + dy * dy))
          }
          if (count === 0) {
            const l = Math.round(depth * maskAt(o.mask, (x + (STEP * CHUNK) / 2) / w, base / h) * (LEVELS - 1))
            chunkLevel = l
            path = l > 0 ? batches.at(g * LEVELS + l) : null
            if (path && prev) path.moveTo(prev[0], prev[1])
            else if (path) path.moveTo(x, y)
          }
          if (path && chunkLevel > 0) path.lineTo(x, y)
          prev = [x, y]
          count = (count + 1) % CHUNK
        }
      }

      ctx.lineWidth = 1
      batches.stroke(ctx, (l) => {
        const g = Math.floor(l / LEVELS)
        ctx.strokeStyle = paint(groups > 1 ? f.chart[g] : f.ink)
        return o.opacity * 0.55 * ((l % LEVELS) / (LEVELS - 1))
      })
    },
  }
}

// ── Runtime ──────────────────────────────────────────────────────────────────
// Shared by every StampUI background and inlined so this file stands alone:
// canvas 2D with a devicePixelRatio cap, a 40 fps cap, pause offscreen and in
// hidden tabs, one still frame under prefers-reduced-motion, colours read from
// the theme tokens and re-read when data-theme or data-chart changes.

type Rgb = [number, number, number]
type Mask = "edges" | "bottom" | "center" | "none"
type Palette = "mono" | "chart"

interface Frame {
  ctx: CanvasRenderingContext2D
  /** Canvas size in CSS pixels. */
  w: number
  h: number
  /** Seconds of motion, scaled by `speed`; frozen while paused. */
  t: number
  /** Pointer position in CSS pixels and its presence, eased from 0 to 1. */
  px: number
  py: number
  pa: number
  /** --foreground, --muted-foreground and --chart-1..5 of the active theme. */
  ink: Rgb
  soft: Rgb
  chart: Rgb[]
  /** True for the single frame drawn under prefers-reduced-motion. */
  still: boolean
}

interface Scene {
  draw: (f: Frame) => void
  resize?: (w: number, h: number) => void
}

const FPS = 40
const DPR_CAP = 2
/** Motion starts a few seconds in, so the first frame is never empty. */
const T_START = 8

const TAU = Math.PI * 2

function readTokens(host: HTMLElement) {
  const probe = document.createElement("span")
  probe.style.display = "none"
  host.appendChild(probe)
  const read = (name: string): Rgb => {
    probe.style.color = `var(${name})`
    const value = getComputedStyle(probe).color
    const n = (value.match(/[\d.]+/g) ?? ["128", "128", "128"]).map(Number)
    const k = value.startsWith("color(") ? 255 : 1
    return [n[0] * k, n[1] * k, n[2] * k]
  }
  const tokens = {
    ink: read("--foreground"),
    soft: read("--muted-foreground"),
    chart: [1, 2, 3, 4, 5].map((i) => read(`--chart-${i}`)),
  }
  probe.remove()
  return tokens
}

/** A token colour as a canvas fill; alpha goes through globalAlpha. */
function paint(c: Rgb) {
  return "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")
}

function smooth(v: number) {
  const x = v < 0 ? 0 : v > 1 ? 1 : v
  return x * x * (3 - 2 * x)
}

/** Shape of the canvas being drawn, read by maskAt. */
const view = { aspect: 1.6 }

/**
 * How much of the effect shows at a point (nx, ny in 0..1). Every mask fades
 * the edges into the page; "center" also clears a calm zone for a headline,
 * "bottom" dissolves toward the content below.
 */
function maskAt(mask: Mask, nx: number, ny: number) {
  if (mask === "none") return 1
  const edges = smooth(nx / 0.16) * smooth((1 - nx) / 0.16) * smooth(ny / 0.2) * smooth((1 - ny) / 0.24)
  if (mask === "bottom") return edges * smooth((1 - ny) / 0.75)
  if (mask === "center") {
    // Portrait screens wrap the headline across the full width.
    const dx = (nx - 0.5) / (view.aspect < 1 ? 0.7 : 0.3)
    const dy = (ny - 0.48) / (view.aspect < 1 ? 0.2 : 0.24)
    return edges * (1 - 0.9 * Math.exp(-(dx * dx + dy * dy)))
  }
  return edges
}

function mount(canvas: HTMLCanvasElement, opts: { speed: number; interactive: boolean }, scene: Scene) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}
  const host = canvas.parentElement ?? canvas
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  let tokens = readTokens(host)
  let w = 0
  let h = 0
  let raf = 0
  let last = 0
  let t = T_START
  let onScreen = true
  let px = -1e4
  let py = -1e4
  let pa = 0
  let pTarget = 0

  const render = (still: boolean) => {
    if (!w || !h) return
    ctx.clearRect(0, 0, w, h)
    ctx.globalAlpha = 1
    view.aspect = w / h
    scene.draw({ ctx, w, h, t, px, py, pa: still ? 0 : pa, ...tokens, still })
    ctx.globalAlpha = 1
  }
  const running = () => onScreen && !document.hidden && !motion.matches
  const tick = (now: number) => {
    raf = 0
    if (!running()) return
    raf = requestAnimationFrame(tick)
    if (last && now - last < 1000 / FPS - 2) return
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
    last = now
    t += dt * opts.speed
    pa += (pTarget - pa) * Math.min(1, dt * 5)
    render(false)
  }
  const sync = () => {
    if (motion.matches) {
      cancelAnimationFrame(raf)
      raf = 0
      render(true)
    } else if (running() && !raf) {
      last = 0
      raf = requestAnimationFrame(tick)
    }
  }
  const resize = () => {
    const nw = canvas.clientWidth
    const nh = canvas.clientHeight
    if (nw === w && nh === h) return
    w = nw
    h = nh
    const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1)
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    scene.resize?.(w, h)
    render(motion.matches)
  }
  const retheme = () => {
    tokens = readTokens(host)
    if (!raf) render(motion.matches)
  }
  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    px = e.clientX - rect.left
    py = e.clientY - rect.top
    pTarget = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height ? 1 : 0
  }
  const onLeave = () => {
    pTarget = 0
  }

  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    sync()
  })
  io.observe(canvas)
  const mo = new MutationObserver(retheme)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-chart", "class", "style"] })
  document.addEventListener("visibilitychange", sync)
  motion.addEventListener("change", sync)
  if (opts.interactive) {
    window.addEventListener("pointermove", onPointer, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
  }
  sync()

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    mo.disconnect()
    document.removeEventListener("visibilitychange", sync)
    motion.removeEventListener("change", sync)
    window.removeEventListener("pointermove", onPointer)
    document.documentElement.removeEventListener("pointerleave", onLeave)
  }
}

/** Batches marks by alpha level: one fill or stroke per level instead of per mark. */
function levels(n: number) {
  const paths: (Path2D | null)[] = new Array(n).fill(null)
  return {
    at(l: number) {
      return (paths[l] ??= new Path2D())
    },
    fill(ctx: CanvasRenderingContext2D, alpha: (l: number) => number) {
      for (let l = 0; l < n; l++) {
        const p = paths[l]
        if (!p) continue
        ctx.globalAlpha = alpha(l)
        ctx.fill(p)
      }
    },
    stroke(ctx: CanvasRenderingContext2D, alpha: (l: number) => number) {
      for (let l = 0; l < n; l++) {
        const p = paths[l]
        if (!p) continue
        ctx.globalAlpha = alpha(l)
        ctx.stroke(p)
      }
    },
  }
}
