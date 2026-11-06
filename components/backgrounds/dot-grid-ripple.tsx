"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

/**
 * Dot grid ripple: a quiet, regular dot grid. Slow ripples cross it now and
 * then, and the pointer works like a lens that lifts the dots beneath it.
 * The simplest background in the set and a safe default for any section.
 */

export interface DotGridRippleProps {
  /** Motion multiplier. 0 holds the grid still. */
  speed?: number
  /** Dot density multiplier. Higher means a tighter grid. */
  density?: number
  /** "mono" draws in --foreground, "chart" colours each ripple by --chart-1..3. */
  palette?: Palette
  /** Fade toward the page: "edges", "center" (clear zone for a headline), "bottom" or "none". */
  mask?: Mask
  /** Overall strength of the effect, 0 to 1. */
  opacity?: number
  /** The pointer lifts the dots under the cursor. */
  interactive?: boolean
  className?: string
}

export function DotGridRipple({
  speed = 1,
  density = 1,
  palette = "mono",
  mask = "edges",
  opacity = 0.8,
  interactive = true,
  className,
}: DotGridRippleProps) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    return mount(ref.current, { speed, interactive }, dotGridScene({ density, palette, mask, opacity }))
  }, [speed, density, palette, mask, opacity, interactive])
  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  )
}

const LEVELS = 14
const RIPPLE_LIFE = 5
const RIPPLE_SLOTS = 2

function dotGridScene(o: { density: number; palette: Palette; mask: Mask; opacity: number }): Scene {
  return {
    draw(f) {
      const { ctx, w, h, t } = f
      const gap = Math.max(12, Math.round(22 / o.density))
      const reach = Math.hypot(w, h) * 0.55
      const ripples: { x: number; y: number; age: number; g: number }[] = []
      for (let k = 0; k < RIPPLE_SLOTS; k++) {
        const period = RIPPLE_LIFE * 1.6
        const local = t + k * (period / RIPPLE_SLOTS)
        const cycle = Math.floor(local / period)
        const age = local - cycle * period
        if (age > RIPPLE_LIFE) continue
        ripples.push({ x: (0.2 + 0.6 * hash(k, cycle)) * w, y: (0.2 + 0.6 * hash(cycle, k + 7)) * h, age, g: (k + cycle) % 3 })
      }

      const groups = o.palette === "chart" ? 4 : 1
      const batches = levels(LEVELS * groups)
      const lens = 130
      const cols = Math.ceil(w / gap) + 1
      const rows = Math.ceil(h / gap) + 1
      const ox = (w - (cols - 1) * gap) / 2
      const oy = (h - (rows - 1) * gap) / 2

      for (let j = 0; j < rows; j++) {
        const y = oy + j * gap
        for (let i = 0; i < cols; i++) {
          const x = ox + i * gap
          let v = 0.16
          let g = 0
          for (const rp of ripples) {
            const life = rp.age / RIPPLE_LIFE
            const front = (rp.age / RIPPLE_LIFE) * reach
            const d = (Math.hypot(x - rp.x, y - rp.y) - front) / (gap * 3)
            const c = 1.05 * (1 - life) * (1 - life) * Math.exp(-d * d)
            if (c > 0.12) g = rp.g + 1
            v += c
          }
          if (f.pa > 0.01) {
            const d = Math.hypot(x - f.px, y - f.py) / lens
            if (d < 1) v += 0.9 * f.pa * (1 - d) * (1 - d)
          }
          const l = Math.min(LEVELS - 1, Math.round(v * maskAt(o.mask, x / w, y / h) * (LEVELS - 1)))
          if (l < 1) continue
          const rad = 0.8 + 1.5 * (l / (LEVELS - 1))
          const p = batches.at((groups > 1 ? g : 0) * LEVELS + l)
          p.moveTo(x + rad, y)
          p.arc(x, y, rad, 0, TAU)
        }
      }

      batches.fill(ctx, (l) => {
        const g = Math.floor(l / LEVELS)
        ctx.fillStyle = paint(g === 0 ? f.ink : f.chart[g - 1])
        return o.opacity * (0.12 + 0.88 * ((l % LEVELS) / (LEVELS - 1)))
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

/** Deterministic 0..1 from two integers, so time-driven events need no state. */
function hash(a: number, b: number) {
  let x = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35)
  x ^= x >>> 15
  x = Math.imul(x, 0x2c1b3c6d)
  x ^= x >>> 12
  return (x >>> 0) / 4294967296
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
