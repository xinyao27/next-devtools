import { ip } from 'address'

import { clientDir } from '../dirs'
import { setupService } from '../features/service'
import { executeCommand } from '../features/terminal'
import { isDev } from '../utils'

export async function createLocalService() {
  setupService()

  const terminalOptions = { icon: 'i-ri-service-line', id: 'devtools:local-service', name: 'Local Service' }

  let __process: any
  if (isDev) {
    const localClientHost = ip('lo') || 'localhost'
    __process = await executeCommand(
      {
        args: ['vite', '--host', localClientHost],
        command: 'npx',
        options: {
          cwd: clientDir,
        },
      },
      terminalOptions,
    )
  } else {
    __process = await executeCommand(
      {
        args: ['index.js'], // TODO: fix
        command: 'node',
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
