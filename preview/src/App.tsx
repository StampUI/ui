import * as React from "react"

// Vite discovers every examples/*.tsx file at build time; each is expected
// to export exactly one named component.
const modules = import.meta.glob("../../examples/*.tsx", { eager: true }) as Record<
  string,
  Record<string, React.ComponentType>
>

interface Entry {
  name: string
  Component: React.ComponentType
}

const entries: Entry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fileName = path.split("/").pop()?.replace(".tsx", "") ?? path
    const exportName = Object.keys(mod)[0]
    return { name: fileName, Component: mod[exportName] }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export function App() {
  const [selected, setSelected] = React.useState(entries[0]?.name)
  const active = entries.find((e) => e.name === selected) ?? entries[0]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <nav className="w-56 shrink-0 overflow-y-auto border-r border-border p-3">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          examples/
        </p>
        {entries.map((e) => (
          <button
            key={e.name}
            onClick={() => setSelected(e.name)}
            className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
              e.name === active?.name
                ? "bg-surface-2 text-foreground"
                : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
            }`}
          >
            {e.name}
          </button>
        ))}
      </nav>
      <main className="flex flex-1 items-center justify-center overflow-auto p-10">
        {active ? <active.Component /> : <p className="text-muted-foreground">No examples found.</p>}
      </main>
    </div>
  )
}
