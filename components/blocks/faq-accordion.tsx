"use client"

import * as React from "react"
import { Plus, Minus } from "lucide-react"
import { cx } from "@/lib/cx"

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqAccordionProps {
  items?: FaqItem[]
  title?: string
  className?: string
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "Do I need to install a runtime?",
    answer: "No. StampUI copies source files directly into your project. There is no runtime dependency — you own every line of code after stamping.",
  },
  {
    question: "What frameworks are supported?",
    answer: "Next.js 13+ (App Router), Remix, and any React project using Tailwind CSS. Vite-based setups work with minor config adjustments.",
  },
  {
    question: "Can I customize the components after stamping?",
    answer: "Yes, and that's the point. Once stamped, components are plain TypeScript/React files in your codebase. Modify them freely without worrying about upstream conflicts.",
  },
  {
    question: "Is there a free tier?",
    answer: "All blocks are free to stamp and use in personal or commercial projects. A pro plan unlocks private block collections and team sharing.",
  },
]

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-b border-[#23252A] last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "w-full flex items-center justify-between gap-4 py-5 text-left",
          "text-sm font-medium text-[#FAFAFA] leading-snug",
          "transition-colors duration-[170ms] ease-out",
          "hover:text-[#FAFAFA]/80"
        )}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="shrink-0 text-muted-foreground">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <div
        className={cx(
          "overflow-hidden transition-all duration-[200ms] ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}

export function FaqAccordion({
  items = DEFAULT_ITEMS,
  title = "Frequently asked questions",
  className,
}: FaqAccordionProps) {
  return (
    <section className={cx("w-full py-16 px-6", className)}>
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-[#FAFAFA] mb-8">
            {title}
          </h2>
        )}

        <div className="rounded-xl border border-[#23252A] bg-[#09090B] px-6">
          {items.map((item, i) => (
            <AccordionItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
