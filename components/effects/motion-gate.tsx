"use client"

import * as React from "react"
import { Reveal, Stagger, type RevealProps, type StaggerProps } from "@/components/core/reveal"
import { TextReveal, type TextRevealProps } from "@/components/effects/text-reveal"

// The opt-in motion layer of the marketing blocks. Each block takes an
// `animate` prop (default true) and passes it here; with animate off these
// render the same markup with no motion, so layout never depends on it.

export function RevealIf({ animate, delay, ...props }: RevealProps & { animate: boolean }) {
  return animate ? <Reveal delay={delay} {...props} /> : <div {...props} />
}

export function StaggerIf({ animate, itemClassName, children, ...props }: StaggerProps & { animate: boolean }) {
  if (animate) return <Stagger itemClassName={itemClassName} {...props}>{children}</Stagger>
  return (
    <div {...props}>
      {React.Children.toArray(children).map((child, i) => (
        <div key={React.isValidElement(child) && child.key != null ? child.key : i} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  )
}

interface HeadlineProps extends Omit<TextRevealProps, "text" | "as"> {
  animate: boolean
  as: "h1" | "h2" | "p"
  children: React.ReactNode
}

/** A heading that uses TextReveal when animate is on and the content is plain text; rich content renders as is. */
export function RevealText({ animate, as: Tag, children, id, className, ...props }: HeadlineProps) {
  if (animate && typeof children === "string") {
    return <TextReveal as={Tag} text={children} id={id} className={className} {...props} />
  }
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}
