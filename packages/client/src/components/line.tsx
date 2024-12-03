import React from 'react'

interface Props {
  children: React.ReactNode
}
export default function Line({ children }: Props) {
  return <div className="hover:bg-secondary group flex h-8 items-center gap-2 rounded px-2 transition">{children}</div>
}
