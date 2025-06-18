import React from 'react'
import { useCopyToClipboard } from 'react-use'

import { useToast } from '@/components/ui/use-toast'

interface Props {
  children?: React.ReactNode
  value?: string
}
export default function CopyToClipboard({ children, value }: Props) {
  const { toast } = useToast()
  const [state, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)
  const handleCopy = React.useCallback(
    (text?: string) => {
      if (!text) return

      copy(text)
      toast({
        description: state.error ? state.error.message : text,
        title: state.error ? 'Failed to copy !' : 'Copied !',
        variant: state.error ? 'destructive' : 'default',
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
    [state],
  )

  return (
    <div className="group flex items-center gap-2">
      {children}
      <button
        className="hover:text-primary hidden items-center opacity-50 transition hover:opacity-100 group-hover:flex"
        onClick={() => handleCopy(value)}
        title="Copy to clipboard"
      >
        {copied ? (
          state.error ? (
            <i className="i-ri-error-warning-line size-4 text-red-500" />
          ) : (
            state.value && <i className="i-ri-check-line size-4 text-green-500" />
          )
        ) : (
          <i className="i-ri-file-copy-line size-4" />
        )}
      </button>
    </div>
  )
}
