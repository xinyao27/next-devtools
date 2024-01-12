import { executeCommand } from './terminal'

export async function openInVscode(options: { path: string; line?: number | string; column?: number | string }) {
  if (!options.path) throw new Error('Path is required')

  const terminalOptions = { id: 'devtools:open-in-vscode', name: 'Open in VSCode', icon: 'i-ri-file-code-line' }
  if (options?.line !== undefined && options?.column !== undefined) {
    executeCommand(
      { command: 'code', args: ['-g', `${options.path}:${options.line}:${options.column}`] },
      terminalOptions,
    )
  } else {
    executeCommand({ command: 'code', args: [options.path] }, terminalOptions)
  }
}
