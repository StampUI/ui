"use client"

import * as React from "react"
import { Terminal } from "lucide-react"
import { Card, CardBody } from "@/components/core/card"
import { Badge } from "@/components/core/badge"
import { ScrollArea } from "@/components/core/scroll-area"

type LineType = "command" | "output" | "success" | "error"

interface Line {
  id: number
  type: LineType
  text: string
}

const RESPONSES: Record<string, Line[]> = {
  help: [
    { id: 0, type: "output", text: "Available commands:" },
    { id: 0, type: "output", text: "  ls           List directory contents" },
    { id: 0, type: "output", text: "  pwd          Print working directory" },
    { id: 0, type: "output", text: "  git status   Show git status" },
    { id: 0, type: "output", text: "  npm install  Install dependencies" },
    { id: 0, type: "output", text: "  npm run dev  Start dev server" },
    { id: 0, type: "output", text: "  clear        Clear terminal" },
  ],
  ls: [
    { id: 0, type: "output", text: "app/  components/  lib/  public/  package.json  tsconfig.json" },
  ],
  pwd: [
    { id: 0, type: "output", text: "/home/user/stampui" },
  ],
  "git status": [
    { id: 0, type: "output", text: "On branch main" },
    { id: 0, type: "output", text: "Your branch is up to date with 'origin/main'." },
    { id: 0, type: "output", text: "" },
    { id: 0, type: "success", text: "nothing to commit, working tree clean" },
  ],
  "npm install": [
    { id: 0, type: "output", text: "npm warn deprecated inflight@1.0.6" },
    { id: 0, type: "output", text: "" },
    { id: 0, type: "output", text: "added 847 packages in 12s" },
    { id: 0, type: "success", text: "✓ 847 packages installed" },
  ],
  "npm run dev": [
    { id: 0, type: "output", text: "  ▲ Next.js 15.3.0" },
    { id: 0, type: "output", text: "  - Local:   http://localhost:3000" },
    { id: 0, type: "output", text: "  - Network: http://192.168.1.42:3000" },
    { id: 0, type: "output", text: "" },
    { id: 0, type: "success", text: "✓ Ready in 1842ms" },
  ],
}

const INITIAL: Line[] = [
  { id: 1, type: "output", text: "StampUI Terminal ,  type 'help' to see commands" },
]

let nextId = 100

export function TerminalBlock() {
  const [lines,      setLines]      = React.useState<Line[]>(INITIAL)
  const [input,      setInput]      = React.useState("")
  const [history,    setHistory]    = React.useState<string[]>([])
  const [historyIdx, setHistoryIdx] = React.useState(-1)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const inputRef    = React.useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom whenever lines change
  React.useEffect(() => {
    const el = viewportRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  function runCommand(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return

    if (cmd === "clear") {
      setLines([])
      setHistory((h) => [cmd, ...h])
      setHistoryIdx(-1)
      setInput("")
      return
    }

    const cmdLine: Line = { id: nextId++, type: "command", text: cmd }
    const response = (RESPONSES[cmd] ?? [{ id: 0, type: "error", text: `zsh: command not found: ${cmd}` }])
      .map((l) => ({ ...l, id: nextId++ }))

    setLines((prev) => [...prev, cmdLine, ...response])
    setHistory((h) => [cmd, ...h])
    setHistoryIdx(-1)
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = historyIdx + 1
      if (idx < history.length) {
        setHistoryIdx(idx)
        setInput(history[idx])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = historyIdx - 1
      if (idx < 0) { setHistoryIdx(-1); setInput("") }
      else          { setHistoryIdx(idx); setInput(history[idx]) }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-surface-3" />
          <span className="h-3 w-3 rounded-full bg-surface-3" />
          <span className="h-3 w-3 rounded-full bg-surface-3" />
        </div>
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">stampui, zsh</span>
        </div>
        <Badge variant="neutral" className="text-[10px] px-1.5 py-0">zsh</Badge>
      </div>

      {/* Terminal body */}
      <CardBody
        className="p-0 bg-surface-3 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <ScrollArea ref={viewportRef} className="h-56">
          <div className="p-4 space-y-0.5 font-mono text-xs">
            {lines.map((line) => (
              <div
                key={line.id}
                className={
                  line.type === "command" ? "flex items-start gap-2" :
                  line.type === "error"   ? "text-danger pl-4" :
                  line.type === "success" ? "text-success pl-4" :
                  "text-muted-foreground pl-4"
                }
              >
                {line.type === "command" && (
                  <span className="text-muted-foreground shrink-0 select-none">❯</span>
                )}
                <span className={line.type === "command" ? "text-foreground" : ""}>
                  {line.text || " "}
                </span>
              </div>
            ))}

            {/* Active prompt */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0 select-none">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground caret-foreground font-mono text-xs"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        </ScrollArea>
      </CardBody>
    </Card>
  )
}
