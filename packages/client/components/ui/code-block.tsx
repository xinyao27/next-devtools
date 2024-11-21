import * as React from 'react'

interface Props {
  children: React.ReactNode
}
export default function CodeBlock({ children }: Props) {
  return (
    <pre className="rounded border p-2">
      <code>{children}</code>
    </pre>
  )
}
