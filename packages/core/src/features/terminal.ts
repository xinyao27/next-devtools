import { observable } from '@trpc/server/observable'
import type { Options } from 'execa'

export interface TerminalBase {
  id: string
  name: string
  description?: string
  icon: string
}
export interface TerminalState extends TerminalBase {
  buffer?: string

  restart(): void
  clear(): void
  terminate(): void
}
export type TerminalAction = 'restart' | 'clear' | 'terminate'
export interface TerminalWrite {
  id: string
  data: string
}
const terminals = new Map<string, TerminalState>()
export function getTerminals() {
  return Array.from(terminals.values()).filter((v) => v.id !== 'devtools:local-service')
}
export function getTerminal(id: string) {
  return terminals.get(id)
}
export function runTerminalAction(id: string, action: TerminalAction) {
  const terminal = terminals.get(id)
  if (!terminal) return false

  switch (action) {
    case 'restart':
      terminal.restart()
      return true
    case 'clear':
      terminal.clear()
      return true
    case 'terminate':
      terminal.terminate()
      return true
  }
}

export async function setupTerminal() {
  __NEXT_DEVTOOLS_EE__.on('terminal:register', (terminal) => {
    terminals.set(terminal.id, terminal)
    return terminal.id
  })
  __NEXT_DEVTOOLS_EE__.on('terminal:remove', ({ id }) => {
    if (!terminals.has(id)) return false
    terminals.delete(id)
    return true
  })
  __NEXT_DEVTOOLS_EE__.on('terminal:exit', ({ id }) => {
    const terminal = terminals.get(id)
    if (!terminal) return false
    return true
  })
}
export async function onTerminalWrite() {
  return observable<TerminalWrite>((emit) => {
    const handler = (data: TerminalWrite) => {
      const terminal = terminals.get(data.id)
      if (!terminal) return false

      if (!terminal.buffer) terminal.buffer = ''
      terminal.buffer += data.data

      emit.next(data)
      return true
    }
    __NEXT_DEVTOOLS_EE__.on('terminal:write', handler)
    return () => {
      __NEXT_DEVTOOLS_EE__.off('terminal:write', handler)
    }
  })
}

interface ExecuteCommandOptions {
  command: string
  args?: string[]
  options?: Options
}
export async function executeCommand(execaOptions: ExecuteCommandOptions, terminalOptions: TerminalBase) {
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

    __NEXT_DEVTOOLS_EE__.emit('terminal:write', {
      id,
      data: `> ${[execaOptions.command, ...(execaOptions.args || [])].join(' ')}\n\n`,
    })
    childProcess.stdout!.on('data', (data) => {
      __NEXT_DEVTOOLS_EE__.emit('terminal:write', { id, data: data.toString() })
    })
    childProcess.stderr!.on('data', (data) => {
      __NEXT_DEVTOOLS_EE__.emit('terminal:write', { id, data: data.toString() })
    })
    childProcess?.on('exit', (code) => {
      if (!restarting) {
        __NEXT_DEVTOOLS_EE__.emit('terminal:write', { id, data: `\n> process terminalated with ${code}\n` })
        __NEXT_DEVTOOLS_EE__.emit('terminal:exit', { id, code: code || 0 })
      }
    })

    return childProcess
  }

  register()

  let __process = start()

  function restart() {
    restarting = true
    __process.kill()

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
    __process?.kill()
    __NEXT_DEVTOOLS_EE__.emit('terminal:remove', { id })
  }

  function register() {
    __NEXT_DEVTOOLS_EE__.emit('terminal:register', {
      ...terminalOptions,
      restart,
      clear,
      terminate,
    })
  }

  return {
    getProcess() {
      return __process
    },
    terminate,
    restart,
    clear,
  }
}
