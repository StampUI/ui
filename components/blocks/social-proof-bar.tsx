"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

export interface LogoItem {
  name: string
  src?: string
  href?: string
}

export interface SocialProofBarProps {
  label?: string
  logos?: LogoItem[]
  className?: string
}

const defaultLogos: LogoItem[] = [
  { name: "Vercel" },
  { name: "Linear" },
  { name: "Resend" },
  { name: "PlanetScale" },
  { name: "Railway" },
  { name: "Liveblocks" },
]

function LogoEntry({ item }: { item: LogoItem }) {
  const inner = item.src ? (
    <img
      src={item.src}
      alt={item.name}
      className="h-5 w-auto object-contain opacity-50 transition-opacity duration-150 ease-out group-hover:opacity-75"
    />
  ) : (
    <span className="text-xs font-semibold tracking-wide text-muted-foreground opacity-60 transition-opacity duration-150 ease-out group-hover:opacity-90">
      {item.name}
    </span>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center"
        aria-label={item.name}
      >
        {inner}
      </a>
    )
  }

  return <div className="group flex items-center">{inner}</div>
}

export function SocialProofBar({
  label = "Trusted by teams at",
  logos = defaultLogos,
  className,
}: SocialProofBarProps) {
  return (
    <div className={cx("w-full", className)}>
      <div className="border-t border-[#23252A]" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:gap-8">
        {label && (
          <p className="shrink-0 text-xs text-muted-foreground opacity-60 sm:whitespace-nowrap">
            {label}
          </p>
        )}
        {label && (
          <div className="hidden h-4 w-px bg-[#23252A] sm:block" aria-hidden />
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:justify-start">
          {logos.map((logo, i) => (
            <LogoEntry key={i} item={logo} />
          ))}
        </div>
      </div>
      <div className="border-b border-[#23252A]" />
    </div>
  )
}
