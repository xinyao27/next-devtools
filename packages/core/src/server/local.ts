import { clientDir } from '../dirs'
import { executeCommand, setupTerminal } from '../features/terminal'
import { setupService } from '../features/service'

export async function createLocalService(port: string) {
  setupTerminal()
  setupService()

  const terminalOptions = { id: 'devtools:local-service', name: 'Local Service', icon: 'i-ri-service-line' }

  let __process: any
  if (process.env.NODE_ENV === 'development') {
    __process = await executeCommand(
      {
        command: 'npx',
        args: ['next', 'dev'],
        options: {
          cwd: clientDir,
          env: { PORT: port },
        },
      },
      terminalOptions,
    )
  } else {
    __process = await executeCommand(
      {
        command: 'node',
        args: ['server.js'],
        options: {
          cwd: clientDir,
          env: { PORT: port },
        },
      },
      terminalOptions,
    )
  }

  process.on('SIGTERM', () => {
    __process.terminate()
  })
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    __process.terminate()
  })
}
