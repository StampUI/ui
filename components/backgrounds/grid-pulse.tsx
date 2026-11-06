"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

/**
 * Grid pulse: a fine square grid where soft waves of light travel from cell
 * to cell, a few cells blink on their own, and the cell under the pointer
 * lights up. Reads as a quiet infrastructure or status surface.
 */

export interface GridPulseProps {
  /** Motion multiplier. 0 holds the grid still. */
  speed?: number
  /** Cell density multiplier. Higher means smaller cells. */
  density?: number
  /** "mono" draws in --foreground, "chart" colours each wave by --chart-1..3. */
  palette?: Palette
  /** Fade toward the page: "edges", "center" (clear zone for a headline), "bottom" or "none". */
  mask?: Mask
  /** Overall strength of the effect, 0 to 1. */
  opacity?: number
  /** Cells light up under the pointer. */
  interactive?: boolean
  className?: string
}

export function GridPulse({
  speed = 1,
  density = 1,
  palette = "mono",
  mask = "edges",
  opacity = 0.8,
  interactive = true,
  className,
}: GridPulseProps) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    if (!ref.current) return
    return mount(ref.current, { speed, interactive }, gridPulseScene({ density, palette, mask, opacity }))
  }, [speed, density, palette, mask, opacity, interactive])
  return (
    <div aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  )
}

const LEVELS = 12
const WAVE_LIFE = 4.5
const WAVE_SLOTS = 2

function gridPulseScene(o: { density: number; palette: Palette; mask: Mask; opacity: number }): Scene {
  return {
    draw(f) {
      const { ctx, w, h, t } = f
      const size = Math.max(20, Math.round(44 / o.density))
      const cols = Math.ceil(w / size) + 1
      const rows = Math.ceil(h / size) + 1
      const ox = ((w % size) - size) / 2
      const oy = ((h % size) - size) / 2

      const waves: { c: number; r: number; age: number; g: number }[] = []
      for (let k = 0; k < WAVE_SLOTS; k++) {
        const period = WAVE_LIFE * 1.5
        const local = t + k * (period / WAVE_SLOTS)
        const cycle = Math.floor(local / period)
        const age = local - cycle * period
        if (age > WAVE_LIFE) continue
        waves.push({ c: Math.floor(hash(k, cycle) * cols), r: Math.floor(hash(cycle, k + 3) * rows), age, g: (k + cycle) % 3 })
      }

      const groups = o.palette === "chart" ? 4 : 1
      const cells = levels(LEVELS * groups)
      const lines = levels(LEVELS)
      const pc = (f.px - ox) / size
      const pr = (f.py - oy) / size

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = ox + i * size
          const y = oy + j * size
          const m = maskAt(o.mask, (x + size / 2) / w, (y + size / 2) / h)
          const lm = Math.round(m * (LEVELS - 1))
          if (lm > 0) {
            const p = lines.at(lm)
            p.moveTo(x, y + 0.5)
            p.lineTo(x + size, y + 0.5)
            p.moveTo(x + 0.5, y)
            p.lineTo(x + 0.5, y + size)
          }
          let v = 0
          let g = 0
          for (const wv of waves) {
            const life = wv.age / WAVE_LIFE
            const d = Math.hypot(i - wv.c, j - wv.r) - wv.age * 4.2
            const c = 0.7 * (1 - life) * Math.exp(-(d * d) / 1.6)
            if (c > 0.1) g = wv.g + 1
            v += c
          }
          const blink = Math.sin(t * 0.7 + hash(i, j) * TAU)
          if (blink > 0.96 && hash(j, i) > 0.82) v += (blink - 0.96) * 14
          if (f.pa > 0.01) {
            const d = Math.hypot(i + 0.5 - pc, j + 0.5 - pr)
            v += 0.7 * f.pa * Math.exp(-(d * d) / 1.2)
          }
          const l = Math.min(LEVELS - 1, Math.round(v * m * (LEVELS - 1)))
          if (l < 1) continue
          cells.at((groups > 1 ? g : 0) * LEVELS + l).rect(x + 2, y + 2, size - 3, size - 3)
        }
      }

      ctx.lineWidth = 1
      ctx.strokeStyle = paint(f.ink)
      lines.stroke(ctx, (l) => o.opacity * 0.14 * (l / (LEVELS - 1)))
      cells.fill(ctx, (l) => {
        const g = Math.floor(l / LEVELS)
        ctx.fillStyle = paint(g === 0 ? f.ink : f.chart[g - 1])
        return o.opacity * 0.34 * ((l % LEVELS) / (LEVELS - 1))
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
