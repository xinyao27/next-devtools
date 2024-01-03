import React from 'react'
import { useRPCClient } from '@/app/client'

interface Props {
  value: string
  children?: React.ReactNode
}
export default function OpenInVscode({ value, children }: Props) {
  const rpcClient = useRPCClient()
  const handleOpenInVscode = React.useCallback((path: string) => {
    rpcClient.current.openInVscode.mutate({ path })
  }, [])

  return (
    <div
      className="flex items-center gap-2 transition cursor-pointer group hover:underline"
    >
      {children}
      <button
        className="items-center hidden transition opacity-50 group-hover:flex hover:opacity-100 hover:text-primary"
        title="Open in vscode"
        onClick={() => handleOpenInVscode(value)}
      >
        <i className="w-4 h-4 i-ri-share-box-line" />
      </button>
    </div>
  )
}
