import { getPort } from 'get-port-please'
import { LOCAL_CLIENT_PORT } from '@next-devtools/shared'
import { clientDir } from '../dirs'
import { executeCommand, setupTerminal } from '../features/terminal'

export async function createLocalService() {
  setupTerminal()

  const terminalOptions = { id: 'devtools:local-service', name: 'Local Service', icon: 'i-ri-service-line' }
  const PORT = (await getPort({ port: Number(LOCAL_CLIENT_PORT) })).toString()
  if (process.env.DEV) {
    executeCommand(
      {
        command: 'npx',
        args: ['next', 'dev'],
        options: {
          cwd: clientDir,
          env: { PORT },
        },
      },
      terminalOptions,
    )
  } else {
    executeCommand(
      {
        command: 'node',
        args: ['server.js'],
        options: {
          cwd: clientDir,
          env: { PORT },
        },
      },
      terminalOptions,
    )
  }
}
