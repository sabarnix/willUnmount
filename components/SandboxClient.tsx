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
const SCRIPT_FILE = '/script.js'
const BASE_FILE = '/base.css'

/**
 * Page chrome every demo needs but nobody wants to read. Kept out of the
 * visible styles.css so each demo only shows the rules the post is about.
 *
 * The colour scheme comes from the site theme rather than the OS preference:
 * the iframe sits on a Sandpack surface, so following prefers-color-scheme
 * paints black text on a dark panel whenever the two disagree.
 */
function buildBaseCss(dark: boolean) {
  const theme = dark ? defaultDark : defaultLight
  return `:root {
  color-scheme: ${dark ? 'dark' : 'light'};
}

body {
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  max-width: 640px;
  margin: 1.5rem auto;
  padding: 0 1.2rem 2rem;
  line-height: 1.5;
  background: ${theme.colors.surface1};
  color: ${dark ? '#e5e5e5' : '#1a1a1a'};
}
`
}

/**
 * The static template must serve /index.html, so we generate it from the
 * markup the reader actually sees and keep it hidden.
 */
function buildEntry(markup: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${BASE_FILE}" />
    <link rel="stylesheet" href="${STYLES_FILE}" />
  </head>
  <body>
${markup}
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

    const entry = buildEntry(markup)
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
  previewHeight?: number
  editorHeight?: number
  activeFile?: string
}

export default function SandboxClient({
  html,
  css,
  js,
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

  const files = {
    [ENTRY_FILE]: { code: buildEntry(html), hidden: true },
    [BASE_FILE]: { code: buildBaseCss(dark), hidden: true },
    [MARKUP_FILE]: { code: html },
    [STYLES_FILE]: { code: css },
    [SCRIPT_FILE]: { code: js },
  }

  return (
    <div className="my-6">
      <SandpackProvider
        template="static"
        files={files}
        theme={dark ? 'dark' : 'light'}
        options={{
          visibleFiles: [MARKUP_FILE, STYLES_FILE, SCRIPT_FILE],
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
