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
    <button
      className={cn('group flex cursor-pointer items-center gap-2 transition hover:underline', className)}
      onClick={() => handleOpenInVscode(value)}
    >
      {children}
      <div className="group-hover:text-primary hidden items-center transition group-hover:flex" title="Open in vscode">
        <i className="i-ri-share-box-line h-4 w-4" />
      </div>
    </button>
  )
}
