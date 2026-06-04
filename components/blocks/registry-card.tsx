import * as React from "react"
import { Terminal, ArrowRight } from "lucide-react"
import { Badge } from "@/components/core/badge"
import { cx } from "@/lib/cx"
import { CopyButton } from "@/components/core/copy-button"
import type { BlockManifest } from "../../types"

export interface RegistryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  block: BlockManifest
}

/** Intentional fallback for blocks without a generated preview asset. */
function BlockPreviewFallback({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-2">
      <div className="w-32 h-20 rounded-lg border border-border-soft bg-surface flex flex-col gap-2 p-3">
        <div className="h-2 w-3/4 rounded-sm bg-border-strong/60" />
        <div className="h-2 w-1/2 rounded-sm bg-border-strong/40" />
        <div className="mt-auto h-5 w-full rounded-md bg-border-strong/30" />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground/60">{slug}.tsx</span>
    </div>
  )
}

export function RegistryCard({
  block,
  className,
  ...props
}: RegistryCardProps) {
  const { title, slug, description, category, status, previewPath, difficulty, frameworks, dependencies, promptReady, version, licenseRequired } = block
  const isGated = licenseRequired || status === "pro" || status === "locked"

  return (
    <div
      className={cx(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-card-foreground transition-all hover:border-border-strong",
        className
      )}
      {...props}
    >
      <a href={`/blocks/${slug}`} className="block relative aspect-video w-full overflow-hidden border-b border-border bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-border-strong">
        {previewPath ? (
          <img
            src={previewPath}
            alt={`${title} preview`}
            className="object-contain w-full h-full p-3"
          />
        ) : (
          <BlockPreviewFallback slug={slug} />
        )}

        <div className="absolute top-3 right-3 flex gap-1.5">
          {isGated && (
            <Badge variant="pro" className="bg-[#09090B] text-[10px] tracking-widest font-mono">
              PRO
            </Badge>
          )}
          {status === "new" && !isGated && (
            <Badge variant="new" className="bg-[#09090B] text-[10px] tracking-widest font-mono">
              NEW
            </Badge>
          )}
          {promptReady && (
            <Badge variant="neutral" className="bg-[#09090B] text-[10px] font-mono hidden group-hover:inline-flex">
              Prompt Ready
            </Badge>
          )}
        </div>
        </a>

      <div className="flex flex-1 flex-col p-4">
        <a href={`/blocks/${slug}`} className="outline-none focus-visible:underline">
          <h3 className="font-semibold text-sm leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </a>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-[10px] font-mono text-muted-foreground h-4">
          <span className="text-border-strong">v{version}</span>
          <span className="text-border-strong">·</span>
          <span>{category}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-md px-2.5 py-1.5 w-[190px] flex-none group/cmd cursor-text">
            <Terminal className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <code className="text-[10px] font-mono text-muted-foreground truncate flex-1">
              stampui add {slug}
            </code>
            <CopyButton value={`pnpm dlx stampui add ${slug}`} className="h-5 w-5 opacity-0 group-hover/cmd:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <a href={`/blocks/${slug}`} className="text-xs font-medium text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out translate-x-1 group-hover:translate-x-0 flex-shrink-0">
            View <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
