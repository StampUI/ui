"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/core/accordion"
import { Reveal } from "@/components/core/reveal"
import { cx } from "@/lib/cx"

export interface FaqItem {
  question: string
  /** Plain text, so the same string can go into the FAQPage JSON-LD. */
  answer: string
}

export interface FaqSectionProps {
  eyebrow?: string
  headline?: React.ReactNode
  description?: React.ReactNode
  items?: FaqItem[]
  /** Emit FAQPage structured data built from `items`. Turn it off if the page already has one. */
  jsonLd?: boolean
  className?: string
}

/** schema.org FAQPage object for a list of questions. Reuse it wherever the same list renders. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "How do I add a component to my project?",
    answer:
      "Run npx stampui add followed by the component name. The CLI copies the source and every core file it imports into your project and prints the npm packages to install.",
  },
  {
    question: "Do I own the code after installing?",
    answer:
      "Yes. Every component is plain TypeScript and React source copied into your project. There is no runtime package to keep in sync and no lock-in.",
  },
  {
    question: "Can I use StampUI in client projects?",
    answer: "Yes. Personal and Team licenses both cover unlimited personal, commercial and client projects.",
  },
  {
    question: "Does StampUI support light mode?",
    answer:
      "Yes. Every component ships in dark and light from the same tokens. Dark is the default.",
  },
  {
    question: "What happens if StampUI is not a fit?",
    answer: "Refund within 14 days if you have not installed Pro code yet. Reply to your purchase email to ask for one.",
  },
]

export function FaqSection({
  eyebrow = "FAQ",
  headline = "Questions, answered.",
  description = "Still stuck? Email support@stampui.com and a person replies within 48 hours.",
  items = DEFAULT_ITEMS,
  jsonLd = true,
  className,
}: FaqSectionProps) {
  return (
    <section className={cx("w-full bg-background", className)}>
      {jsonLd && items.length > 0 && (
        <script
          type="application/ld+json"
          // Escape "<" so an answer can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)).replace(/</g, "\\u003c") }}
        />
      )}
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16 lg:px-8 lg:py-24">
        <Reveal className="min-w-0">
          {eyebrow && <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{headline}</h2>
          {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>}
        </Reveal>

        <Reveal delay={60} className="min-w-0">
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger className="min-h-12 text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="leading-relaxed">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
