"use client"

import * as React from "react"
import { cx } from "@/lib/cx"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export interface TeamMember {
  name: string
  role: string
  bio?: string
  avatarUrl?: string
  socials?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface TeamGridProps {
  members?: TeamMember[]
  title?: string
  columns?: 2 | 3 | 4
  className?: string
}

const colClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const defaultMembers: TeamMember[] = [
  {
    name: "Aria Voss",
    role: "Engineering Lead",
    bio: "Builds distributed systems and spends too much time in the terminal.",
    socials: { github: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Tomás Reyes",
    role: "Product Designer",
    bio: "Turns complex workflows into calm, focused interfaces.",
    socials: { github: "#", linkedin: "#" },
  },
  {
    name: "Lena Krüger",
    role: "Developer Advocate",
    bio: "Writes docs, builds demos, and advocates for sensible APIs.",
    socials: { github: "#", twitter: "#" },
  },
  {
    name: "Jin Park",
    role: "Infrastructure",
    bio: "Keeps the lights on and the deploys green.",
    socials: { github: "#", linkedin: "#" },
  },
  {
    name: "Priya Nair",
    role: "Frontend Engineer",
    bio: "Crafts accessible, performant component systems.",
    socials: { github: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Sam Okafor",
    role: "Backend Engineer",
    bio: "API design, data modeling, and strong opinions about naming.",
    socials: { github: "#" },
  },
]

export function TeamGrid({
  members = defaultMembers,
  title,
  columns = 3,
  className,
}: TeamGridProps) {
  return (
    <section className={cx("w-full py-16 px-6 bg-background", className)}>
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-10">
            {title}
          </h2>
        )}
        <div className={cx("grid grid-cols-1 gap-4", colClass[columns])}>
          {members.map((member, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-[180ms] ease-out hover:border-border-strong hover:bg-surface-2"
            >
              <div className="flex items-center gap-3">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-xl border border-border bg-surface-2 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
              </div>

              {member.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              )}

              {member.socials && (
                <div className="flex items-center gap-2 mt-auto pt-1">
                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-foreground"
                      aria-label={`${member.name} on GitHub`}
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-foreground"
                      aria-label={`${member.name} on Twitter`}
                    >
                      <TwitterIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-foreground"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <LinkedinIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
