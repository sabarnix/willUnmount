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
 * Server component: reads a demo's source files at build time and hands them to
 * the client editor. Keeping the source on disk means Prettier formats it like
 * any other file in the repo.
 *
 * styles.css holds only the rules the post is about; the structural CSS lives in
 * an optional layout.css, and demos/demo.css is shared by every demo.
 */
export default function Sandbox({ demo, ...rest }: SandboxProps) {
  const demosDir = path.join(process.cwd(), 'demos')
  const dir = path.join(demosDir, demo)
  const read = (file: string) => fs.readFileSync(file, 'utf8').trim()
  const readIfPresent = (file: string) => (fs.existsSync(file) ? read(file) : undefined)

  return (
    <SandboxClient
      html={read(path.join(dir, 'markup.html'))}
      css={read(path.join(dir, 'styles.css'))}
      js={read(path.join(dir, 'script.js'))}
      layout={readIfPresent(path.join(dir, 'layout.css'))}
      demoCss={read(path.join(demosDir, 'demo.css'))}
      demoJs={read(path.join(demosDir, 'demo.js'))}
      {...rest}
    />
  )
}
