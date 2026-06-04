import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "@/lib/cx"

/**
 * Floyka Button Component
 *
 * Design tokens used (defined in globals.css / tailwind.config):
 *   --foreground        #FAFAFA  (primary text)
 *   --background        #070708  (main bg)
 *   --surface-2         #09090B  (raised surface)
 *   --border            #23252A  (default border)
 *   --border-strong     slightly brighter graphite
 *   --muted-foreground  dimmed text
 *
 * Variants follow Floyka design rules:
 *   - primary  → white bg / dark text (the only "colored" action)
 *   - outline  → transparent bg / border / foreground text
 *   - ghost    → transparent bg / muted text, subtle hover
 *   - danger   → danger-tinted surface, used for destructive actions
 *
 * All variants:
 *   - rounded-lg (12px radius per design rules)
 *   - no glow, no thick borders, no scale animations
 *   - 150-200ms ease-out transitions
 *   - focus-visible ring uses ring-border-strong (NOT blue/neon)
 */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg text-sm font-medium",
    "transition-all duration-[150ms] ease-out",
    "outline-none focus-visible:ring-1 focus-visible:ring-border-strong ",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        sm:        "h-8 px-3 text-xs rounded-md gap-1.5",
        md:        "h-9 px-4",
        lg:        "h-10 px-5 text-base",
        icon:      "h-9 w-9 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
      variant: {
        /** Primary — white bg, dark text. The strongest CTA. */
        primary:
          "bg-foreground text-background hover:bg-foreground/90",

        /** Outline — bordered, transparent. Secondary actions. */
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-border-strong",

        /** Ghost — no border, no bg. Nav actions, icon rows. */
        ghost:
          "bg-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground",

        /** Danger — destructive action. Subtle tinted surface. */
        danger:
          "bg-transparent border border-border text-foreground hover:bg-red-950/40 hover:border-red-900/50",

        /** Rounded — pill-shaped outline. Decorative / marketing CTAs. */
        rounded:
          "border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-border-strong rounded-full",

        /** Dashed — dashed border. Draft states, placeholder actions. */
        dashed:
          "border border-dashed border-border bg-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground hover:border-border-strong",

        /** Dashed Rounded — pill shape with dashed border. */
        "dashed-rounded":
          "border border-dashed border-border bg-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground hover:border-border-strong rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button renders as a `Slot` — allowing you to pass any
   * child element (e.g. `<a>` or Next.js `<Link>`) while keeping all
   * button styles applied.
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cx(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
