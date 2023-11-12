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
  const handleCopy = React.useCallback((text?: string) => {
    if (!text) return

    copy(text)
    toast({
      variant: state.error ? 'destructive' : 'default',
      title: state.error ? 'Failed to copy !' : 'Copied !',
      description: state.error ? state.error.message : text,
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [state])

  return (
    <div className="group flex items-center gap-2">
      {children}
      <button
        className="hidden group-hover:flex items-center opacity-50 hover:opacity-100 hover:text-primary transition"
        title="Copy to clipboard"
        onClick={() => handleCopy(value)}
      >
        {
          copied
            ? state.error
              ? <i className="i-ri-error-warning-line w-4 h-4 text-red-500" />
              : state.value && <i className="i-ri-check-line w-4 h-4 text-green-500" />
            : <i className="i-ri-file-copy-line w-4 h-4" />
        }
      </button>
    </div>
  )
}
