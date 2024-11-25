import http from 'node:http'
import path from 'node:path'
import fs from 'fs-extra'
import sirv from 'sirv'
import { TEMP_DIR } from '@next-devtools/shared/constants'
import type { Context } from './router'

export async function createStaticServer(context: Context, port: string) {
  const dir = path.join(context.dir, TEMP_DIR)

  if (!(await fs.exists(dir))) {
    await fs.mkdir(dir)
  }

  const server = http.createServer(sirv(dir, { dev: true, single: false }))

  const app = server.listen(port)

  process.on('SIGTERM', () => {
    app.close()
  })
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    app.close()
  })
}
