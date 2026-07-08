import { ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/core/button"

export function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Continue</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="danger">
        <Trash2 />
        Delete
      </Button>
      <Button size="sm" variant="outline">
        Learn more
        <ArrowRight />
      </Button>
      <Button disabled>Processing…</Button>
    </div>
  )
}
