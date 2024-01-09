import React from 'react'

interface Props {
  children: React.ReactNode
}
export default function Line({ children }: Props) {
  return <div className="group h-8 px-2 flex items-center gap-2 rounded hover:bg-secondary transition">{children}</div>
}
