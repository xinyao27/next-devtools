import React from 'react'

interface Props {
  className?: string
  theme?: 'light' | 'dark'
}
export function ReactLogo({ className, theme = 'dark' }: Props) {
  const fill = React.useMemo(() => (theme === 'dark' ? '#fff' : '#000'), [theme])

  return (
    <svg
      className={className}
      fill={fill}
      height="100%"
      viewBox="-10.5 -9.45 21 18.9"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="0" fill="currentColor" r="2" />
      <g fill="none" stroke="currentColor" stroke-width="1">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  )
}
