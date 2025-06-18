import type { NextDevtoolsServerContext, ServerFunctions } from '@next-devtools/shared/types'
import type { Options, Subprocess } from 'execa'

import { getGlobalThis } from '../utils'

const globalThis = getGlobalThis()

export type TerminalAction = 'clear' | 'restart' | 'terminate'
export interface TerminalBase {
  description?: string
  icon: string
  id: string
  name: string
}
export interface TerminalState extends TerminalBase {
  buffer?: string

  clear: () => void
  restart: () => void
  terminate: () => void
}
export interface TerminalWrite {
  data: string
  id: string
}
const terminals = new Map<string, TerminalState>()
interface ExecuteCommandOptions {
  args?: string[]
  command: string
  options?: Options & { onExit?: (code: number) => void }
}
export async function executeCommand(
  execaOptions: ExecuteCommandOptions,
  terminalOptions: TerminalBase,
): Promise<{
  clear: () => void
  getProcess: () => Subprocess
  restart: () => void
  terminate: () => void
}> {
  const { execa } = await import('execa')
  let restarting = false
  const id = terminalOptions.id

  function start() {
    const childProcess = execa(execaOptions.command, execaOptions.args, {
      reject: false,
      ...execaOptions.options,
      env: {
        COLORS: 'true',
        FORCE_COLOR: 'true',
        ...execaOptions.options?.env,
      },
    })

    globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:write', {
      data: `> ${[execaOptions.command, ...(execaOptions.args || [])].join(' ')}\n\n`,
      id,
    })
    childProcess.stdout!.on('data', (data) => {
      globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:write', { data: data.toString(), id })
    })
    childProcess.stderr!.on('data', (data) => {
      globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:write', { data: data.toString(), id })
    })
    childProcess?.on('exit', (code) => {
      if (!restarting) {
        execaOptions.options?.onExit?.(code || 0)
        globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:write', {
          data: `\n> process terminalated with ${code}\n`,
          id,
        })
        globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:exit', { code: code || 0, id })
      }
    })

    return childProcess
  }

  register()

  let __process = start()

  function restart() {
    restarting = true
    __process.kill('SIGTERM')

    clear()

    __process = start()
    restarting = false
  }

  function clear() {
    const terminal = terminals.get(id)
    if (!terminal) return false
    terminal.buffer = ''
    register()
    return true
  }

  function terminate() {
    restarting = false
    __process?.kill('SIGTERM')
    globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:remove', { id })
  }

  function register() {
    globalThis.__NEXT_DEVTOOLS_EE__.emit('terminal:register', {
      ...terminalOptions,
      clear,
      restart,
      terminate,
    })
  }

  return {
    clear,
    getProcess() {
      return __process
    },
    restart,
    terminate,
  }
}
export function getTerminal(id: string) {
  return terminals.get(id)
}

export function getTerminals() {
  return Array.from(terminals.values()).filter((v) => v.id !== 'devtools:local-service')
}

export function runTerminalAction(id: string, action: TerminalAction) {
  const terminal = terminals.get(id)
  if (!terminal) return false

  switch (action) {
    case 'clear':
      terminal.clear()
      return true
    case 'restart':
      terminal.restart()
      return true
    case 'terminate':
      terminal.terminate()
      return true
  }
}
export async function setupTerminal() {
  globalThis.__NEXT_DEVTOOLS_EE__.on('terminal:register', (terminal) => {
    terminals.set(terminal.id, terminal)
    return terminal.id
  })
  globalThis.__NEXT_DEVTOOLS_EE__.on('terminal:remove', ({ id }) => {
    if (!terminals.has(id)) return false
    terminals.delete(id)
    return true
  })
  globalThis.__NEXT_DEVTOOLS_EE__.on('terminal:exit', ({ id }) => {
    const terminal = terminals.get(id)
    if (!terminal) return false
    return true
  })
  globalThis.__NEXT_DEVTOOLS_EE__.on('terminal:write', (data) => {
    const terminal = terminals.get(data.id)
    if (!terminal) return

    if (!terminal.buffer) terminal.buffer = ''
    terminal.buffer += data.data

    globalThis.__NEXT_DEVTOOLS_RPC__?.broadcast.onTerminalWrite(data)
  })
}

export function setupTerminalRpc({ context }: NextDevtoolsServerContext) {
  return {
    executeCommand: async (
      input: ExecuteCommandOptions & {
        description?: string
        icon: string
        id: string
        name: string
      },
    ) => {
      await executeCommand(
        {
          args: input.args,
          command: input.command,
          options: { cwd: context.dir, ...input.options },
        },
        {
          description: input.description,
          icon: input.icon,
          id: input.id,
          name: input.name,
        },
      )
    },
    getTerminal: async (id: string) => await getTerminal(id),
    getTerminals: async () => await getTerminals(),
    runTerminalAction: async (id: string, action: TerminalAction) => await runTerminalAction(id, action),
  } satisfies Partial<ServerFunctions>
}
