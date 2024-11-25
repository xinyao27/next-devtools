import { Editor, editorCommands } from '@next-devtools/shared/types/settings'
import { settingsStore } from '../store/settings'
import { executeCommand } from './terminal'

interface OpenInEditorOptions {
  path: string
  line?: number | string
  column?: number | string
  editor?: Editor
}

export async function openInEditor({ path, line, column, editor }: OpenInEditorOptions) {
  if (!path) throw new Error('Path is required')

  editor = editor ?? settingsStore.getState().editor
  if (!editor) throw new Error('Editor is required')
  // verify editor is valid
  if (!Object.values(Editor).includes(editor)) throw new Error(`Invalid editor: ${editor}`)

  const terminalOptions = { id: 'devtools:open-in-editor', name: 'Open in Editor', icon: 'i-ri-file-code-line' }
  if (line !== undefined && column !== undefined) {
    executeCommand({ command: editorCommands[editor], args: ['-g', `${path}:${line}:${column}`] }, terminalOptions)
  } else {
    executeCommand({ command: editorCommands[editor], args: [path] }, terminalOptions)
  }
}
