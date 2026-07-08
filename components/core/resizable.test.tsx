import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable"

function Split({ dir }: { dir?: "ltr" | "rtl" }) {
  return (
    <div dir={dir}>
      <ResizablePanelGroup defaultSizes={[50, 50]}>
        <ResizablePanel data-testid="panel-a">A</ResizablePanel>
        <ResizableHandle aria-label="Resize" />
        <ResizablePanel data-testid="panel-b">B</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function panelWidth(el: HTMLElement) {
  return parseFloat(el.style.width)
}

describe("ResizableHandle keyboard interaction and RTL", () => {
  it("ArrowRight grows the first panel in LTR", async () => {
    const user = userEvent.setup()
    render(<Split dir="ltr" />)
    const handle = screen.getByRole("separator")
    const panelA = screen.getByTestId("panel-a")
    const before = panelWidth(panelA)

    handle.focus()
    await user.keyboard("{ArrowRight}")

    expect(panelWidth(panelA)).toBeGreaterThan(before)
  })

  it("ArrowLeft shrinks the first panel in LTR", async () => {
    const user = userEvent.setup()
    render(<Split dir="ltr" />)
    const handle = screen.getByRole("separator")
    const panelA = screen.getByTestId("panel-a")
    const before = panelWidth(panelA)

    handle.focus()
    await user.keyboard("{ArrowLeft}")

    expect(panelWidth(panelA)).toBeLessThan(before)
  })

  it("ArrowRight and ArrowLeft swap meaning under dir=rtl (WAI-ARIA APG)", async () => {
    const user = userEvent.setup()
    render(<Split dir="rtl" />)
    const handle = screen.getByRole("separator")
    const panelA = screen.getByTestId("panel-a")
    const before = panelWidth(panelA)

    handle.focus()
    await user.keyboard("{ArrowRight}")
    expect(panelWidth(panelA)).toBeLessThan(before) // opposite of the LTR case above

    const afterRight = panelWidth(panelA)
    await user.keyboard("{ArrowLeft}{ArrowLeft}")
    expect(panelWidth(panelA)).toBeGreaterThan(afterRight)
  })
})
