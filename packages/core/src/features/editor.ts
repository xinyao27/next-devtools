import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'

import { Editor, editorCommands } from '@next-devtools/shared/types'

import { settingsStore } from '../store/settings'
import { executeCommand } from './terminal'

interface OpenInEditorOptions {
  column?: number | string
  editor?: Editor
  line?: number | string
  path: string
}

export async function openInEditor({ column, editor, line, path }: OpenInEditorOptions) {
  if (!path) throw new Error('Path is required')

  editor = editor ?? settingsStore.getState().editor
  if (!editor) throw new Error('Editor is required')
  // verify editor is valid
  if (!Object.values(Editor).includes(editor)) throw new Error(`Invalid editor: ${editor}`)

  const terminalOptions = { icon: 'i-ri-file-code-line', id: 'devtools:open-in-editor', name: 'Open in Editor' }
  if (line !== undefined && column !== undefined) {
    executeCommand({ args: ['-g', `${path}:${line}:${column}`], command: editorCommands[editor] }, terminalOptions)
  } else {
    executeCommand({ args: [path], command: editorCommands[editor] }, terminalOptions)
  }
}

export function setupEditorRpc(_: NextDevtoolsServerContext) {
  return {
    openInEditor,
  } satisfies Partial<ServerFunctions>
}
