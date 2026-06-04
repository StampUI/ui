"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface TestimonialAuthor {
  name: string
  role: string
  avatarUrl?: string
}

export interface TestimonialItem {
  quote: string
  author: TestimonialAuthor
}

export interface TestimonialsWallProps {
  items?: TestimonialItem[]
  title?: string
  className?: string
}

const defaultItems: TestimonialItem[] = [
  {
    quote: "StampUI cut our component scaffolding time in half. Every block lands exactly where we need it, with zero runtime overhead.",
    author: { name: "Alex Rivera", role: "Staff Engineer, Vercel" },
  },
  {
    quote: "Finally a component library that doesn't fight our design system. We own the code, we change what we want.",
    author: { name: "Priya Nair", role: "Frontend Lead, Linear" },
  },
  {
    quote: "The dark-mode polish is remarkable. We shipped our dashboard in two days instead of two weeks.",
    author: { name: "Jordan Kim", role: "Product Engineer, Resend" },
  },
  {
    quote: "I've tried every UI library. StampUI is the only one I've never had to fight against.",
    author: { name: "Sam Okafor", role: "CTO, Liveblocks" },
  },
  {
    quote: "Using the CLI from the terminal while on a call and shipping production UI. This is the workflow I wanted.",
    author: { name: "Taylor Chen", role: "Senior Engineer, PlanetScale" },
  },
  {
    quote: "Every team member can now stamp a block and own it immediately. Onboarding velocity is through the roof.",
    author: { name: "Dana Walsh", role: "Engineering Manager, Railway" },
  },
]

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ")
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2)
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#101114] border border-[#23252A] text-xs font-semibold text-[#FAFAFA] select-none">
      {initials.toUpperCase()}
    </span>
  )
}

export function TestimonialsWall({
  items = defaultItems,
  title,
  className,
}: TestimonialsWallProps) {
  return (
    <section className={cx("w-full py-24 px-6", className)}>
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-[#FAFAFA]">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-5 rounded-xl border border-[#23252A] bg-[#09090B] p-5"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {item.author.avatarUrl ? (
                  <img
                    src={item.author.avatarUrl}
                    alt={item.author.name}
                    className="h-8 w-8 shrink-0 rounded-full border border-[#23252A] object-cover"
                  />
                ) : (
                  <Initials name={item.author.name} />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#FAFAFA]">
                    {item.author.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.author.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
