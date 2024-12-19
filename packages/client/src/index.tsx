'use client'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { NextDevtoolsContext } from '@next-devtools/shared/context'
import Resizable from '@/components/resizable'
import { router } from '@/routes'
import styles from '@/globals.css?inline'
import type { NextDevtoolsContextValue } from '@next-devtools/shared/context'

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

  return null
}
