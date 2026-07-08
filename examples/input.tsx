import * as React from "react"
import { Input } from "@/components/core/input"
import { Label } from "@/components/core/label"

export function InputExample() {
  const [email, setEmail] = React.useState("")

  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )
}
