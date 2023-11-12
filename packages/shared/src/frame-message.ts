const CLIENT_SOURCE = 'next-devtools-client'
const FRAME_SOURCE = 'next-devtools-frame'

export type FrameMessageFunctions = Record<string, (...args: any[]) => any>

export function createFrameMessageHandler(fns: FrameMessageFunctions, ref: React.RefObject<HTMLIFrameElement>) {
  const handler = (event: MessageEvent) => {
    const { type, payload, source, timestamp } = event.data
    if (source !== CLIENT_SOURCE) return
    if (!type || !payload || !timestamp) return

    if (type in fns) {
      const result = fns[type](...(payload || []))
      if (ref.current) {
        ref.current.contentWindow?.postMessage({ source: FRAME_SOURCE, type, payload: result, timestamp }, '*')
      }
      return result
    }
  }
  window?.addEventListener('message', handler, false)
  window?.addEventListener('beforeunload', () => {
    window?.removeEventListener('message', handler, false)
  })
}

const blackList = ['$$typeof']
export function createFrameMessageClient<T extends FrameMessageFunctions>() {
  const client = new Proxy({} as T, {
    get(_, type: string) {
      if (blackList.includes(type)) return

      return (...args: any[]) => new Promise((resolve) => {
        const timestamp = new Date().getDate()
        parent.postMessage({ source: CLIENT_SOURCE, type, payload: args, timestamp }, '*')
        window.addEventListener('message', (event) => {
          const { type: eventType, payload, timestamp: eventTimestamp } = event.data
          if (eventType === type && eventTimestamp === timestamp) {
            resolve(payload)
          }
        })
      })
    },
  }) as T
  return client
}

export interface FrameMessageHandler extends FrameMessageFunctions {
  getRoute: () => string
  pushRoute: (href: string) => void
  backRoute: (href: string) => void
}
