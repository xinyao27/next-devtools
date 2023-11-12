import React from 'react'

interface Props {
  children: React.ReactNode
}
export default function TagComponent({ children }: Props) {
  return (
    <code className="text-sm font-mono">
      <span className="mr-1 opacity-20">{'<'}</span>{children}<span className="ml-1 opacity-20">{'/>'}</span>
    </code>
  )
}
