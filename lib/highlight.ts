// Use @shikijs/core + selective lang imports instead of the main "shiki" package.
// The main "shiki" bundles ALL 200+ language grammars (~9.8 MB in the server bundle).
// By importing only the grammars we need, we reduce that to ~870 KB.
import { createHighlighterCore } from "@shikijs/core"
import type { HighlighterCore } from "@shikijs/core"
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript"
import tsx from "@shikijs/langs/tsx"
import jsx from "@shikijs/langs/jsx"
import typescript from "@shikijs/langs/typescript"
import javascript from "@shikijs/langs/javascript"
import shellscript from "@shikijs/langs/shellscript"
import json from "@shikijs/langs/json"
import css from "@shikijs/langs/css"
import githubDark from "@shikijs/themes/github-dark"
import githubLight from "@shikijs/themes/github-light"

// Maps incoming lang aliases to the grammar name we loaded
const LANG_MAP: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  bash: "shellscript",
  shell: "shellscript",
  text: "plaintext",
}

const LOADED_LANGS = new Set(["tsx", "jsx", "typescript", "javascript", "shellscript", "json", "css"])

let promise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!promise) {
    promise = createHighlighterCore({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      themes: [githubDark as any, githubLight as any],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      langs: [tsx as any, jsx as any, typescript as any, javascript as any, shellscript as any, json as any, css as any],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
  }
  return promise
}

export async function highlight(code: string, lang = "tsx"): Promise<string> {
  try {
    const hl = await getHighlighter()
    const resolved = LANG_MAP[lang] ?? lang
    const safeLang = LOADED_LANGS.has(resolved) ? resolved : "plaintext"
    return hl.codeToHtml(code, {
      lang: safeLang,
      // Dark colours inline (the default theme); the light colour rides along
      // as --shiki-light and globals.css swaps to it under data-theme="light".
      themes: { dark: "github-dark", light: "github-light" },
      defaultColor: "dark",
    })
  } catch {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    return `<pre class="shiki"><code>${escaped}</code></pre>`
  }
}
