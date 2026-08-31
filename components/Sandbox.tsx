import fs from 'fs'
import path from 'path'
import SandboxClient from './SandboxClient'

interface SandboxProps {
  /** Directory name under demos/, e.g. "chips" for demos/chips/. */
  demo: string
  previewHeight?: number
  editorHeight?: number
  activeFile?: string
}

/**
 * Server component: reads a demo's three source files at build time and hands
 * them to the client editor. Keeping the source on disk means Prettier formats
 * it like any other file in the repo.
 */
export default function Sandbox({ demo, ...rest }: SandboxProps) {
  const dir = path.join(process.cwd(), 'demos', demo)
  const read = (file: string) => fs.readFileSync(path.join(dir, file), 'utf8').trim()

  return (
    <SandboxClient
      html={read('markup.html')}
      css={read('styles.css')}
      js={read('script.js')}
      {...rest}
    />
  )
}
