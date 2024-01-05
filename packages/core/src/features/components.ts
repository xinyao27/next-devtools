import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import fg from 'fast-glob'
import { type WebpackOptionsNormalized } from 'webpack'
import { type Component } from '@next-devtools/shared'

let cache: Component[]

export async function getComponents(options: WebpackOptionsNormalized) {
  if (cache) {
    return cache
  }
  const root = options.context!
  const isSrcDirectory = existsSync(join(root, '/src'))
  const codeRoot = isSrcDirectory ? join(root, '/src') : root
  const componentPath = join(codeRoot, '/components')
  const files = await fg(['**/*.(tsx|js|jsx)'], {
    cwd: componentPath,
    onlyFiles: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })

  const parse = await import('react-docgen').then(m => m.parse)
  cache = await Promise.all(files.map(async (file: string) => {
    const filePath = resolve(componentPath, file)
    const stat = await fs.lstat(filePath)
    const raw = await fs.readFile(filePath, 'utf-8')
    const [doc] = parse(raw)
    return {
      file,
      filePath,
      type: 'component',
      size: stat.size,
      mtime: stat.mtimeMs,

      description: doc.description,
      displayName: doc.displayName,
    }
  }))

  return cache
}
