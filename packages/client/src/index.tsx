'use client'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { NextDevtoolsContext } from '@next-devtools/shared/context'
import Resizable from '@/components/resizable'
import { router } from '@/routes'
import styles from '@/globals.css?inline'
import { useSettingsStore } from './store/settings'
import type { NextDevtoolsContextValue } from '@next-devtools/shared/context'

let mounted = false

export const Toolbar = (props: NextDevtoolsContextValue) => {
  let root: HTMLDivElement | null = null
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (root) return

    root = document.createElement('div')
    if (document.body.contains(root)) return
    root.id = 'next-devtools-toolbar'
    root.style.zIndex = '2147483645'

    const shadow = root.attachShadow({ mode: 'open' })
    const reactRoot = createRoot(shadow)
    reactRoot.render(
      <NextDevtoolsContext.Provider value={props}>
        <div className="fixed z-[8999]" id="next-devtools-toolbar-root">
          <Resizable>{router}</Resizable>
        </div>
      </NextDevtoolsContext.Provider>,
    )

    const style = document.createElement('style')
    style.textContent = styles
    shadow.append(style)
    document.body.append(root)

    return () => {
      root?.remove()
      root = null
    }
  }, [props])

  useEffect(() => {
    if (mounted) return
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
    // eslint-disable-next-line no-console
    console.info(
      `%c 🔨 Next Devtools %c Press Shift + ${isMac ? 'Option' : 'Alt'} + D to open NextDevTools %c`,
      'background:#c391e6; padding: 2px 1px; color: #FFF',
      'background:#c391e660; padding: 2px 1px; color: #FFF',
      'background:transparent',
    )
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyD' && event.shiftKey && event.altKey) {
        useSettingsStore.getState().toggleToolbar()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    mounted = true
  }, [])

  return null
}
