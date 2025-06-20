import type { NextDevtoolsServerContext } from '@next-devtools/shared/types'

import { TEMP_DIR } from '@next-devtools/shared/constants'
import fs from 'fs-extra'
import http from 'node:http'
import path from 'node:path'
import sirv from 'sirv'

export async function createStaticServer(ctx: NextDevtoolsServerContext) {
  const dir = path.join(ctx.context.dir, TEMP_DIR)

  if (!(await fs.exists(dir))) {
    await fs.mkdir(dir)
  }

  const server = http.createServer(sirv(dir, { dev: true, single: false }))

  const app = server.listen(ctx.context.staticServerPort)

  process.on('SIGTERM', () => {
    app.close()
  })
  __NEXT_DEVTOOLS_EE__.on('project:restart', () => {
    app.close()
  })
}
