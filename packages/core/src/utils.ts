import type { EventEmitter } from 'node:events'

export function getGlobalThis() {
  return globalThis
}

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __NEXT_DEVTOOLS_EE__: EventEmitter
}
