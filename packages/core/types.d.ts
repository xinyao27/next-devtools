export { AppRouter } from './dist/types'

declare global {
  import type { EventEmitter } from 'node:events'
  // eslint-disable-next-line vars-on-top, no-var
  var __NEXT_DEVTOOLS_EE__: EventEmitter
}
