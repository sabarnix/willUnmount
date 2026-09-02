'use client'

import { useEffect, useSyncExternalStore } from 'react'
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  defaultDark,
  defaultLight,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { useTheme } from 'next-themes'

const ENTRY_FILE = '/index.html'
const MARKUP_FILE = '/markup.html'
const STYLES_FILE = '/styles.css'
const LAYOUT_FILE = '/layout.css'
const SCRIPT_FILE = '/script.js'
const DEMO_FILE = '/demo.css'
const DEMO_JS_FILE = '/demo.js'
const BASE_FILE = '/base.css'

const DAISYUI_CSS = 'https://cdn.jsdelivr.net/npm/daisyui@5'
const TAILWIND_BROWSER_JS = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'

/**
 * Bridges daisyUI's theme to the panel the preview sits on. The colour scheme
 * comes from the site theme rather than the OS preference: the iframe sits on a
 * Sandpack surface, so following prefers-color-scheme paints black text on a
 * dark panel whenever the two disagree.
 */
function buildBaseCss(dark: boolean) {
  const theme = dark ? defaultDark : defaultLight
  // :root[data-theme] outranks daisyUI's own theme blocks, which key off [data-theme=…].
  return `:root[data-theme] {
  color-scheme: ${dark ? 'dark' : 'light'};
  background-color: ${theme.colors.surface1};
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
}
`
}

/**
 * The static template must serve /index.html, so we generate it from the
 * markup the reader actually sees and keep it hidden. data-theme is daisyUI's
 * own theming hook, switching between its built-in light and dark themes.
 */
function buildEntry(markup: string, dark: boolean) {
  return `<!doctype html>
<html lang="en" data-theme="${dark ? 'dark' : 'light'}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${DAISYUI_CSS}" />
    <script src="${TAILWIND_BROWSER_JS}"></script>
    <link rel="stylesheet" href="${BASE_FILE}" />
    <link rel="stylesheet" href="${DEMO_FILE}" />
    <link rel="stylesheet" href="${LAYOUT_FILE}" />
    <link rel="stylesheet" href="${STYLES_FILE}" />
  </head>
  <body>
    <main>
${markup}
    </main>
    <script src="${DEMO_JS_FILE}"></script>
    <script src="${SCRIPT_FILE}"></script>
  </body>
</html>
`
}

const emptySubscribe = () => () => {}

/** Keeps the two hidden files in step with the markup tab and the site theme. */
function SyncGenerated({ dark }: { dark: boolean }) {
  const { sandpack } = useSandpack()
  const markup = sandpack.files[MARKUP_FILE]?.code ?? ''

  useEffect(() => {
    const { files, updateFile } = sandpack
    const updates: Record<string, string> = {}

    const entry = buildEntry(markup, dark)
    if (files[ENTRY_FILE]?.code !== entry) updates[ENTRY_FILE] = entry

    const base = buildBaseCss(dark)
    if (files[BASE_FILE]?.code !== base) updates[BASE_FILE] = base

    if (Object.keys(updates).length > 0) updateFile(updates)
  }, [sandpack, markup, dark])

  return null
}

interface SandboxClientProps {
  html: string
  css: string
  js: string
  /** Shared demos/demo.css — hidden, every demo gets it. */
  demoCss: string
  /** Shared demos/demo.js — hidden, every demo gets it. */
  demoJs: string
  /** Optional demos/<name>/layout.css — a visible tab, but never the active one. */
  layout?: string
  previewHeight?: number
  editorHeight?: number
  activeFile?: string
}

export default function SandboxClient({
  html,
  css,
  js,
  demoCss,
  demoJs,
  layout,
  previewHeight = 340,
  editorHeight = 360,
  activeFile = STYLES_FILE,
}: SandboxClientProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const dark = mounted && resolvedTheme === 'dark'

  // Always served so the entry's <link> never 404s; only a tab when it has content.
  const files = {
    [ENTRY_FILE]: { code: buildEntry(html, dark), hidden: true },
    [BASE_FILE]: { code: buildBaseCss(dark), hidden: true },
    [DEMO_FILE]: { code: demoCss, hidden: true },
    [DEMO_JS_FILE]: { code: demoJs, hidden: true },
    [LAYOUT_FILE]: { code: layout ?? '', hidden: !layout },
    [MARKUP_FILE]: { code: html },
    [STYLES_FILE]: { code: css },
    [SCRIPT_FILE]: { code: js },
  }

  const visibleFiles = [MARKUP_FILE, STYLES_FILE, ...(layout ? [LAYOUT_FILE] : []), SCRIPT_FILE]

  return (
    <div className="my-6">
      <SandpackProvider
        template="static"
        files={files}
        theme={dark ? 'dark' : 'light'}
        options={{
          visibleFiles,
          activeFile,
          initMode: 'user-visible',
          recompileDelay: 400,
        }}
      >
        <SyncGenerated dark={dark} />
        <SandpackLayout style={{ flexDirection: 'column' }}>
          <SandpackPreview
            style={{ height: previewHeight, width: '100%', flex: '0 0 auto' }}
            showOpenInCodeSandbox={false}
            showRefreshButton
          />
          <SandpackCodeEditor
            style={{ height: editorHeight, width: '100%', flex: '0 0 auto' }}
            showTabs
            showLineNumbers
            wrapContent
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}
