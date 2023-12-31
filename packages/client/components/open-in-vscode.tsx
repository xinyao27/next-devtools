import React from 'react'
import { rpcClient } from '@/app/client'

interface Props {
  value: string
  children?: React.ReactNode
}
export default function OpenInVscode({ value, children }: Props) {
  const handleOpenInVscode = React.useCallback((path: string) => {
    rpcClient.openInVscode.mutate({ path })
  }, [])

  return (
    <div
      className="group hover:underline flex items-center gap-2 cursor-pointer transition"
    >
      {children}
      <button
        className="hidden group-hover:flex items-center opacity-50 hover:opacity-100 hover:text-primary transition"
        title="Open in vscode"
        onClick={() => handleOpenInVscode(value)}
      >
        <i className="i-ri-share-box-line w-4 h-4" />
      </button>
    </div>
  )
}
