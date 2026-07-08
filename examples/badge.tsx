import { Badge } from "@/components/core/badge"

export function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="outline">v2.0.0</Badge>
      <Badge variant="pro">Pro</Badge>
    </div>
  )
}
