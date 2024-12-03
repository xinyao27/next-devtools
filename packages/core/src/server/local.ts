import { ip } from 'address'
import { clientDir } from '../dirs'
import { executeCommand } from '../features/terminal'
import { setupService } from '../features/service'
import { isDev } from '../utils'

export async function createLocalService() {
  setupService()

  const terminalOptions = { id: 'devtools:local-service', name: 'Local Service', icon: 'i-ri-service-line' }

  let __process: any
  if (isDev) {
    const localClientHost = ip('lo') || 'localhost'
    __process = await executeCommand(
      {
        command: 'npx',
        args: ['vite', '--host', localClientHost],
        options: {
          cwd: clientDir,
        },
      },
      terminalOptions,
    )
  } else {
    __process = await executeCommand(
      {
        command: 'node',
        args: ['index.js'], // TODO: fix
        options: {
          cwd: clientDir,
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
