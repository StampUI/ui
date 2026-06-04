"use client"

import * as React from "react"
import { Github, Twitter, Linkedin } from "lucide-react"
import { cx } from "@/lib/cx"

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
  members: TeamMember[]
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
    <section className={cx("w-full py-16 px-6 bg-[#070708]", className)}>
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="text-2xl font-semibold text-[#FAFAFA] tracking-tight mb-10">
            {title}
          </h2>
        )}
        <div className={cx("grid grid-cols-1 gap-4", colClass[columns])}>
          {members.map((member, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-[#23252A] bg-[#09090B] p-5 transition-colors duration-[180ms] ease-out hover:border-[#2e3138] hover:bg-[#101114]"
            >
              <div className="flex items-center gap-3">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="h-10 w-10 rounded-xl object-cover border border-[#23252A] shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-xl border border-[#23252A] bg-[#101114] flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#FAFAFA] truncate">{member.name}</p>
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
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-[#FAFAFA]"
                      aria-label={`${member.name} on GitHub`}
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-[#FAFAFA]"
                      aria-label={`${member.name} on Twitter`}
                    >
                      <Twitter size={14} />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-[150ms] ease-out hover:text-[#FAFAFA]"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin size={14} />
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
