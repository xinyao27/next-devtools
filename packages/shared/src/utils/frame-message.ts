import type { SEOMetadata } from '../types'

const CLIENT_SOURCE = 'next-devtools-client'
const FRAME_SOURCE = 'next-devtools-frame'

export type FrameMessageFunctions = Record<string, (...args: any[]) => any>

export function createFrameMessageHandler(fns: FrameMessageFunctions, ref: React.RefObject<HTMLIFrameElement>) {
  const handler = async (event: MessageEvent) => {
    const { type, payload, source, timestamp } = event.data
    if (source !== CLIENT_SOURCE) return
    if (!type || !payload || !timestamp) return

    if (type in fns) {
      const result = await fns[type](...(payload || []))
      if (ref.current) {
        const message = { source: FRAME_SOURCE, type, payload: result, timestamp }
        ref.current.contentWindow?.postMessage(message, '*')
      }

      return result
    }
  }
  window?.addEventListener('message', handler, false)
  window?.addEventListener('beforeunload', () => {
    window?.removeEventListener('message', handler, false)
  })
  const unsubscribe = () => {
    window?.removeEventListener('message', handler, false)
  }
  return unsubscribe
}

const blackList = ['$$typeof']
export function createFrameMessageClient<T extends FrameMessageFunctions>() {
  const client = new Proxy({} as T, {
    get(_, type: string) {
      if (blackList.includes(type)) return
      return (...args: any[]) =>
        new Promise((resolve) => {
          const timestamp = new Date().getDate()
          parent.postMessage({ source: CLIENT_SOURCE, type, payload: args, timestamp }, '*')
          window.addEventListener('message', (event) => {
            const { type: eventType, payload, timestamp: eventTimestamp } = event.data
            if (eventType === type && eventTimestamp === timestamp) resolve(payload)
          })
        })
    },
  }) as T
  return client
}

export interface FrameMessageHandler extends FrameMessageFunctions {
  // routes
  getRoute: () => Promise<string>
  pushRoute: (href: string) => Promise<void>
  backRoute: (href: string) => Promise<void>
  // seo
  getSEOMetadata: (route?: string) => Promise<SEOMetadata>
}
