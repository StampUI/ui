"use client"

import * as React from "react"
import { Github, Twitter, MessageSquare, Linkedin } from "lucide-react"
import { cx } from "@/lib/cx"

export interface FooterLinkItem {
  label: string
  href: string
}

export interface FooterLinkGroup {
  title: string
  items: FooterLinkItem[]
}

export interface FooterLink {
  label: string
  href: string
  groups?: FooterLinkGroup[]
}

export type SocialPlatform = "github" | "twitter" | "discord" | "linkedin"

export interface FooterSocial {
  icon: SocialPlatform
  href: string
}

export interface SiteFooterProps {
  brand?: { name: string; href?: string }
  links?: FooterLink[]
  socials?: FooterSocial[]
  copyright?: string
  className?: string
}

const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  github: <Github size={16} />,
  twitter: <Twitter size={16} />,
  discord: <MessageSquare size={16} />,
  linkedin: <Linkedin size={16} />,
}

const DEFAULT_LINKS: FooterLink[] = [
  {
    label: "Product",
    href: "#",
    groups: [
      {
        title: "Product",
        items: [
          { label: "Blocks", href: "/blocks" },
          { label: "Components", href: "/blocks/components" },
          { label: "Changelog", href: "/changelog" },
          { label: "Roadmap", href: "/roadmap" },
        ],
      },
    ],
  },
  {
    label: "Developers",
    href: "#",
    groups: [
      {
        title: "Developers",
        items: [
          { label: "Documentation", href: "/docs" },
          { label: "CLI Reference", href: "/docs/cli" },
          { label: "GitHub", href: "https://github.com" },
        ],
      },
    ],
  },
  {
    label: "Company",
    href: "#",
    groups: [
      {
        title: "Company",
        items: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
  },
]

function resolveColumns(links: FooterLink[]): FooterLinkGroup[] {
  const cols: FooterLinkGroup[] = []
  for (const link of links) {
    if (link.groups && link.groups.length > 0) {
      cols.push(...link.groups)
    } else {
      cols.push({ title: link.label, items: [{ label: link.label, href: link.href }] })
    }
  }
  return cols
}

export function SiteFooter({
  brand = { name: "StampUI", href: "/" },
  links = DEFAULT_LINKS,
  socials = [
    { icon: "github", href: "https://github.com" },
    { icon: "twitter", href: "https://twitter.com" },
    { icon: "discord", href: "https://discord.com" },
  ],
  copyright,
  className,
}: SiteFooterProps) {
  const columns = resolveColumns(links)
  const year = new Date().getFullYear()

  return (
    <footer
      className={cx(
        "w-full border-t border-[#23252A] bg-[#070708] px-6 pt-14 pb-10",
        className
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-[auto_1fr] gap-10 md:gap-16">
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            {brand.href ? (
              <a
                href={brand.href}
                className="text-sm font-semibold text-[#FAFAFA] transition-colors duration-[170ms] ease-out hover:text-[#FAFAFA]/70"
              >
                {brand.name}
              </a>
            ) : (
              <span className="text-sm font-semibold text-[#FAFAFA]">{brand.name}</span>
            )}

            {socials && socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      "flex items-center justify-center w-8 h-8 rounded-xl",
                      "border border-[#23252A] bg-[#09090B] text-muted-foreground",
                      "transition-colors duration-[170ms] ease-out",
                      "hover:border-[#FAFAFA]/20 hover:text-[#FAFAFA]"
                    )}
                  >
                    {SOCIAL_ICONS[s.icon]}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-2">
                  {col.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href={item.href}
                        className={cx(
                          "text-sm text-muted-foreground",
                          "transition-colors duration-[170ms] ease-out",
                          "hover:text-[#FAFAFA]"
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#23252A]">
          <p className="text-xs text-muted-foreground">
            {copyright ?? `© ${year} ${brand.name}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
