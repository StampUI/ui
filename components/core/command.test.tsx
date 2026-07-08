import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "./command"

function Palette({ onSelect }: { onSelect: (v: string) => void }) {
  const [value, setValue] = React.useState("")
  return (
    <Command>
      <CommandInput value={value} onValueChange={setValue} />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => onSelect("alpha")}>Alpha</CommandItem>
          <CommandItem onSelect={() => onSelect("beta")}>Beta</CommandItem>
          <CommandItem disabled onSelect={() => onSelect("gamma")}>Gamma (disabled)</CommandItem>
          <CommandItem onSelect={() => onSelect("delta")}>Delta</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

describe("Command keyboard navigation", () => {
  it("exposes a combobox input wired to a listbox via aria-controls", () => {
    render(<Palette onSelect={() => {}} />)
    const input = screen.getByRole("combobox")
    const list = screen.getByRole("listbox")
    expect(input.getAttribute("aria-controls")).toBe(list.id)
  })

  it("activates the first enabled item by default and reports it via aria-activedescendant", () => {
    render(<Palette onSelect={() => {}} />)
    const input = screen.getByRole("combobox")
    const alpha = screen.getByRole("option", { name: "Alpha" })
    expect(input.getAttribute("aria-activedescendant")).toBe(alpha.id)
    expect(alpha.getAttribute("aria-selected")).toBe("true")
  })

  it("moves the active item with ArrowDown and skips disabled items", async () => {
    const user = userEvent.setup()
    render(<Palette onSelect={() => {}} />)
    const input = screen.getByRole("combobox")
    input.focus()

    await user.keyboard("{ArrowDown}")
    const beta = screen.getByRole("option", { name: "Beta" })
    expect(input.getAttribute("aria-activedescendant")).toBe(beta.id)

    // Gamma is disabled: ArrowDown from Beta should skip straight to Delta.
    await user.keyboard("{ArrowDown}")
    const delta = screen.getByRole("option", { name: "Delta" })
    expect(input.getAttribute("aria-activedescendant")).toBe(delta.id)
  })

  it("wraps from the last enabled item back to the first with ArrowDown", async () => {
    const user = userEvent.setup()
    render(<Palette onSelect={() => {}} />)
    const input = screen.getByRole("combobox")
    input.focus()

    await user.keyboard("{ArrowDown}{ArrowDown}") // Alpha -> Beta -> Delta (Gamma skipped)
    await user.keyboard("{ArrowDown}") // wrap back to Alpha
    const alpha = screen.getByRole("option", { name: "Alpha" })
    expect(input.getAttribute("aria-activedescendant")).toBe(alpha.id)
  })

  it("ArrowUp from the first item wraps to the last enabled item", async () => {
    const user = userEvent.setup()
    render(<Palette onSelect={() => {}} />)
    const input = screen.getByRole("combobox")
    input.focus()

    await user.keyboard("{ArrowUp}")
    const delta = screen.getByRole("option", { name: "Delta" })
    expect(input.getAttribute("aria-activedescendant")).toBe(delta.id)
  })

  it("Enter selects the active item without moving focus off the input", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Palette onSelect={onSelect} />)
    const input = screen.getByRole("combobox")
    input.focus()

    await user.keyboard("{ArrowDown}{Enter}") // Alpha -> Beta, select Beta
    expect(onSelect).toHaveBeenCalledWith("beta")
    expect(document.activeElement).toBe(input)
  })

  it("clicking the disabled item does not select it", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Palette onSelect={onSelect} />)
    const gamma = screen.getByRole("option", { name: "Gamma (disabled)" })
    await user.click(gamma)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("clicking an item selects it (pointer users, no keyboard involved)", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Palette onSelect={onSelect} />)
    await user.click(screen.getByRole("option", { name: "Delta" }))
    expect(onSelect).toHaveBeenCalledWith("delta")
  })

  it("options are not in the page Tab order (combobox owns keyboard interaction)", () => {
    render(<Palette onSelect={() => {}} />)
    const alpha = screen.getByRole("option", { name: "Alpha" })
    expect(alpha.getAttribute("tabindex")).toBe("-1")
  })
})
