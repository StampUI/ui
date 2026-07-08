import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { ButtonExample } from "./button"
import { BadgeExample } from "./badge"
import { CardExample } from "./card"
import { InputExample } from "./input"
import { DialogExample } from "./dialog"
import { DropdownMenuExample } from "./dropdown-menu"
import { SelectExample } from "./select"
import { TabsExample } from "./tabs"
import { TableExample } from "./table"
import { TooltipExample } from "./tooltip"

// These are exactly what preview/ renders (via import.meta.glob over this
// directory). Rendering each one here catches a mounting error, e.g. a
// missing required prop or a Radix primitive used outside its required
// context, that npm run typecheck cannot: TypeScript checks the shape of
// props, not whether the tree actually mounts.
const examples = [
  ["ButtonExample", ButtonExample],
  ["BadgeExample", BadgeExample],
  ["CardExample", CardExample],
  ["InputExample", InputExample],
  ["DialogExample", DialogExample],
  ["DropdownMenuExample", DropdownMenuExample],
  ["SelectExample", SelectExample],
  ["TabsExample", TabsExample],
  ["TableExample", TableExample],
  ["TooltipExample", TooltipExample],
] as const

describe("examples render without throwing", () => {
  it.each(examples)("%s mounts", (_name, Example) => {
    expect(() => render(<Example />)).not.toThrow()
  })
})
