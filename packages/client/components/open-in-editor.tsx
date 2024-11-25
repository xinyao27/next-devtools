import React from 'react'
import { api } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  children?: React.ReactNode
  className?: string
  disableLine?: boolean
}
export default function OpenInEditor({ value, children, className, disableLine }: Props) {
  const { mutate: openInEditor } = api.openInEditor.useMutation()

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
        role="button"
        title="Open in vscode"
        onClick={() => openInEditor({ path: value })}
      >
        <i className="i-ri-share-box-line size-4" />
      </div>
    </button>
  )
}
