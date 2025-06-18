import type { Component, NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'
import type { Config, NodePath } from 'react-docgen'
import type Documentation from 'react-docgen/dist/Documentation'
import type { ComponentNode } from 'react-docgen/dist/resolver'

import fg from 'fast-glob'
import fs from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { internalStore } from '../store/internal'
import { settingsStore } from '../store/settings'

type Plugins = NonNullable<NonNullable<NonNullable<Config['babelOptions']>['parserOpts']>['plugins']>
const defaultPlugins: Plugins = [
  'jsx',
  'asyncDoExpressions',
  'decimal',
  'decorators',
  'decoratorAutoAccessors',
  'destructuringPrivate',
  'doExpressions',
  'explicitResourceManagement',
  'exportDefaultFrom',
  'functionBind',
  'functionSent',
  'importAssertions',
  'importReflection',
  'moduleBlocks',
  'partialApplication',
  ['pipelineOperator', { proposal: 'minimal' }],
  'recordAndTuple',
  'regexpUnicodeSets',
  'throwExpressions',
  'typescript',
]

export async function getComponents() {
  const { builtinHandlers, builtinResolvers, parse } = await import('react-docgen')
  const { ChainResolver, FindAllDefinitionsResolver, FindAnnotatedDefinitionsResolver } = builtinResolvers
  const resolver = new ChainResolver([new FindAnnotatedDefinitionsResolver(), new FindAllDefinitionsResolver()], {
    chainingLogic: ChainResolver.Logic.ALL,
  })
  // handle the case where displayName is empty
  const displayNameHandler = (documentation: Documentation, componentDefinition: NodePath<ComponentNode>) => {
    builtinHandlers.displayNameHandler(documentation, componentDefinition)
    if (!documentation.get('displayName')) {
      const variableDeclarator = componentDefinition.parentPath
      if (variableDeclarator.node.type === 'VariableDeclarator') {
        const componentName = variableDeclarator.node.id.type === 'Identifier' ? variableDeclarator.node.id.name : null
        if (componentName) {
          documentation.set('displayName', componentName)
        }
      }
    }
  }

  try {
    const { root } = internalStore.getState()
    const componentDirectory = settingsStore.getState().componentDirectory
    const componentPath = join(root, componentDirectory)
    const files = await fg(['**/*.(tsx|js|jsx)'], {
      cwd: componentPath,
      ignore: ['**/node_modules/**', '**/dist/**'],
      onlyFiles: true,
    })
    return (
      await Promise.all(
        files.map(async (file: string) => {
          try {
            const filePath = resolve(componentPath, file)
            const publicPath = filePath.replace(root, '')
            const stat = await fs.lstat(filePath)
            const raw = await fs.readFile(filePath, 'utf-8')
            const documentations = parse(raw, {
              babelOptions: {
                babelrc: false,
                babelrcRoots: false,
                configFile: false,
                filename: filePath,
                parserOpts: {
                  plugins: [...defaultPlugins],
                },
              },
              handlers: [displayNameHandler],
              resolver,
            })
            return {
              documentations,
              file,
              filePath,
              mtime: stat.mtimeMs,
              publicPath,
              size: stat.size,

              type: 'component',
            }
          } catch (error) {
            console.error(file, error)
            return null
          }
        }),
      )
    ).filter(Boolean) as Component[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export function setupComponentsRpc(_: NextDevtoolsServerContext) {
  return {
    getComponents,
  } satisfies Partial<ServerFunctions>
}
