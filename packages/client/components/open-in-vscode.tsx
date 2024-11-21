import React from 'react'
import { useRPCClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  children?: React.ReactNode
  className?: string
}
export default function OpenInVscode({ value, children, className }: Props) {
  const rpcClient = useRPCClient()
  const handleOpenInVscode = React.useCallback((path: string) => {
    rpcClient?.openInVscode.mutate({ path })
  }, [])

  return (
    <div className={cn('group flex cursor-pointer items-center gap-2 transition hover:underline', className)}>
      {children}
      <button
        className="hover:text-primary hidden items-center opacity-50 transition hover:opacity-100 group-hover:flex"
        title="Open in vscode"
        onClick={() => handleOpenInVscode(value)}
      >
        <i className="i-ri-share-box-line h-4 w-4" />
      </button>
    </div>
  )
}
