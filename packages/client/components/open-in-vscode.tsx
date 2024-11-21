import React from 'react'
import { useRPCClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  children?: React.ReactNode
  className?: string
  disableLine?: boolean
}
export default function OpenInVscode({ value, children, className, disableLine }: Props) {
  const rpcClient = useRPCClient()
  const handleOpenInVscode = React.useCallback((path: string) => {
    rpcClient?.openInVscode.mutate({ path })
  }, [])

  return (
    <button
      className={cn('group flex cursor-pointer items-center gap-2 transition hover:underline', className)}
      onClick={() => {
        if (disableLine) return
        handleOpenInVscode(value)
      }}
    >
      {children}
      <div
        className="group-hover:text-primary hidden items-center transition group-hover:flex"
        role="button"
        title="Open in vscode"
        onClick={() => handleOpenInVscode(value)}
      >
        <i className="i-ri-share-box-line h-4 w-4" />
      </div>
    </button>
  )
}
