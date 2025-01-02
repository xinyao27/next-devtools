import { join, parse } from 'node:path'
import fs from 'fs-extra'
import { internalStore } from '../store/internal'
import type { NextDevtoolsServerContext, Route, ServerFunctions } from '@next-devtools/shared/types'

async function detectClientDirective(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const firstLine = content.split('\n')[0].trim()
    return firstLine === "'use client'" || firstLine === '"use client"' || firstLine === '`use client`'
  } catch {
    return false
  }
}

async function buildRouteTree(rootDir: string): Promise<Route[]> {
  let idCounter = 1
  const nextJsFilePattern = /\.(js|jsx|ts|tsx)$/

  const treeNodes: Route[] = [
    {
      id: 0,
      route: '/',
      name: parse(rootDir).base,
      parentNode: null,
      path: rootDir,
      contents: [],
      render: 'server',
    },
  ]

  // Constants for file patterns
  const NEXT_ROUTE_FILE_PATTERN = /^(page|layout|template|route|loading|error|not-found)\.(js|jsx|ts|tsx)$/
  const IGNORED_DIRECTORIES = new Set(['.', '..', 'node_modules'])

  // Helper function to check if a file is a Next.js route file
  function isNextRouteFile(fileName: string): boolean {
    return nextJsFilePattern.test(fileName) && NEXT_ROUTE_FILE_PATTERN.test(fileName)
  }

  // Helper function to check if directory or its children contain route files
  async function hasRouteFiles(directory: string): Promise<boolean> {
    const items = await fs.readdir(directory, { withFileTypes: true })

    // Check if current directory has any route files
    if (items.some((item) => !item.isDirectory() && isNextRouteFile(item.name))) {
      return true
    }

    // Recursively check subdirectories
    for (const item of items) {
      if (
        item.isDirectory() &&
        !IGNORED_DIRECTORIES.has(item.name) &&
        (await hasRouteFiles(join(directory, item.name)))
      ) {
        return true
      }
    }

    return false
  }

  // Create a new route node for the tree
  function createRouteNode(path: string, name: string, parentId: number, parentNode?: Route): Route {
    return {
      id: idCounter++,
      route: `${parentNode?.id === 0 ? '' : parentNode?.route}/${name}`,
      name,
      parentNode: parentId,
      path,
      contents: [],
      render: 'server',
    }
  }

  async function scanDirectoryContents(dir: string, parentId: number): Promise<void> {
    const entities = await fs.readdir(dir, { withFileTypes: true })

    for (const entity of entities) {
      if (entity.name.startsWith('.') || entity.name === 'node_modules') continue

      const fullPath = join(dir, entity.name)
      const parentNode = treeNodes.find((node) => node.id === parentId)

      if (entity.isDirectory()) {
        await handleDirectory(entity, fullPath, parentId, parentNode)
      } else if (isNextRouteFile(entity.name)) {
        await handleRouteFile(entity.name, fullPath, parentId)
      }
    }
  }

  // Handle directory processing
  async function handleDirectory(
    entity: fs.Dirent,
    fullPath: string,
    parentId: number,
    parentNode?: Route,
  ): Promise<void> {
    const isValidRoute = parentId === 0 || (await hasRouteFiles(fullPath))

    if (isValidRoute) {
      const newNode = createRouteNode(fullPath, entity.name, parentId, parentNode)
      treeNodes.push(newNode)
      await scanDirectoryContents(fullPath, newNode.id)
    }
  }

  // Handle route file processing
  async function handleRouteFile(fileName: string, fullPath: string, parentId: number): Promise<void> {
    treeNodes[parentId].contents.push(fileName)
    if (await detectClientDirective(fullPath)) {
      treeNodes[parentId].render = 'client'
    }
  }

  await scanDirectoryContents(rootDir, 0)
  return treeNodes
}

export async function getRoutes() {
  const { isApp, isPages, routePath } = internalStore.getState()

  const routes = await buildRouteTree(routePath)

  const result = {
    type: isApp ? 'app' : isPages ? 'pages' : 'app',
    routes,
  } as const

  return result
}

export function setupRoutesRpc(_: NextDevtoolsServerContext) {
  return {
    getRoutes,
  } satisfies Partial<ServerFunctions>
}
