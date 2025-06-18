import React from 'react'

import { rpcClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  children?: React.ReactNode
  className?: string
  disableLine?: boolean
  value: string
}
const openInEditor = rpcClient.openInEditor
export default function OpenInEditor({ children, className, disableLine, value }: Props) {
  return (
    <button
      className={cn('group flex cursor-pointer items-center gap-2 text-left transition hover:underline', className)}
      onClick={() => {
        if (disableLine) return
        openInEditor({ path: value })
      }}
    >
      {children}
      <div
        className="group-hover:text-primary hidden items-center transition group-hover:flex"
        onClick={() => openInEditor({ path: value })}
        role="button"
        title="Open in editor"
      >
        <i className="i-ri-share-box-line size-4" />
      </div>
    </button>
  )
}
