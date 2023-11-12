import { getPort } from 'get-port-please'
import { LOCAL_CLIENT_PORT } from '@next-devtools/shared'
import { clientDir } from '../dirs'

export async function createLocalService() {
  const PORT = (await getPort({ port: Number(LOCAL_CLIENT_PORT) })).toString()
  const { execa } = await import('execa')
  execa('npx', ['next', 'dev'], {
    cwd: clientDir,
    stdio: 'inherit',
    env: { NODE_ENV: 'development', PORT },
  })
}
