import { existsSync } from 'node:fs'
import { join, parse, sep } from 'node:path'
import fg from 'fast-glob'
import { type Context } from '@next-devtools/shared'

interface Opts {
  pageExtensions: string[]
  directory: string
}

function processing(paths: string[], opts: Opts) {
  return (
    paths
      // filter page extensions
      .filter(file => opts.pageExtensions.some(ext => file.endsWith(ext)))
      // remove duplicates from file extension removal (eg foo.ts and foo.test.ts)
      .filter((file, idx, array) => array.indexOf(file) === idx)
      .map((file) => {
        return {
          filePath: file,
          // remove page directory path
          // remove file extensions (.tsx, .test.tsx)
          file: file.replace(/(\.\w+)+$/, '').replace(opts.directory, ''),
        }
      })
  )
}

export function getApiRoutes(files: string[], opts: Opts) {
  const paths = processing(files, opts)
  return (
    paths
      .filter(({ file }) => file.startsWith('api'))
      .map(({ file, filePath }) => ({ file: file.endsWith('/route') ? file.replace(/\/route$/, '') : file, filePath }))
  )
}

export function getAppRoutes(files: string[], opts: Opts) {
  const paths = processing(files, opts)
  return (
    paths
      .filter(({ file }) => parse(file).name === 'page')
      .map(({ file, filePath }) =>
        ({
          file: file
            .split(sep)
            .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')))
            .filter(file => parse(file).name !== 'page')
            .join(sep),
          filePath,
        }))
      .map(({ file, filePath }) => ({ file: file === '' ? '/' : `/${file}`, filePath }))
  )
}

export function getPageRoutes(files: string[], opts: Opts) {
  const NEXTJS_NON_ROUTABLE = ['/_app', '/_document', '/_error', '/middleware']
  const paths = processing(files, opts)
  return (
    paths
      .map(({ file, filePath }) => {
        file = file.replace(/index$/, '')
        file = file.endsWith('/') && file.length > 2 ? file.slice(0, -1) : file
        file = `/${file}`
        return {
          file,
          filePath,
        }
      })
      .filter(({ file }) => !NEXTJS_NON_ROUTABLE.includes(file))
      .filter(({ file }) => !file.includes('/api/'))
  )
}

export async function getRoutes(context: Context) {
  const root = context.dir
  const isApp = existsSync(join(root, '/app'))
  const isPages = existsSync(join(root, '/pages'))
  const routePath = join(root, isApp ? '/app' : isPages ? '/pages' : '/app')
  const pageExtensions = ['tsx', 'ts', 'jsx', 'js']
  const files = await fg(['**/*.(tsx|js|jsx)'], {
    cwd: routePath,
    onlyFiles: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })
  const routes = (isApp ? getAppRoutes : isPages ? getPageRoutes : getAppRoutes)(files, {
    pageExtensions,
    directory: routePath,
  })
  const apiRoutes = getApiRoutes(files, {
    pageExtensions,
    directory: routePath,
  })

  const result = {
    type: isApp ? 'app' : isPages ? 'pages' : 'app',
    routes: routes.map(route => ({
      path: join(routePath, route.filePath),
      route: route.file,
    })),
    apiRoutes: apiRoutes.map(route => ({
      path: join(routePath, route.filePath),
      route: route.file,
    })),
  }

  return result
}
