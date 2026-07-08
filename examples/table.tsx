import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/core/table"
import { Badge } from "@/components/core/badge"

const deploys = [
  { id: "a1b2c3d", branch: "main", status: "ready" as const },
  { id: "e4f5a6b", branch: "feat/auth-tokens", status: "building" as const },
  { id: "c7d8e9f", branch: "fix/webhook-retry", status: "failed" as const },
]

export function TableExample() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Deployment</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deploys.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-mono tabular-nums">{d.id}</TableCell>
            <TableCell>{d.branch}</TableCell>
            <TableCell>
              <Badge variant={d.status === "ready" ? "success" : d.status === "failed" ? "danger" : "warning"}>
                {d.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
