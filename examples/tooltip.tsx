import { Info } from "lucide-react"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/core/tooltip"

// TooltipProvider should wrap your app once (e.g. in the root layout), not
// every Tooltip instance. It is included here so this example renders
// standalone.
export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label="What is a license key?">
          <Info className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          Your license key unlocks pro blocks in the CLI.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
