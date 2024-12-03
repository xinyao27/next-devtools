import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  value?: string
  children?: React.ReactNode
}
export default function CopyToClipboard({ value, children }: Props) {
  const { toast } = useToast()
  const [state, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)
  const handleCopy = React.useCallback(
    (text?: string) => {
      if (!text) return

      copy(text)
      toast({
        variant: state.error ? 'destructive' : 'default',
        title: state.error ? 'Failed to copy !' : 'Copied !',
        description: state.error ? state.error.message : text,
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
        title="Copy to clipboard"
        onClick={() => handleCopy(value)}
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
