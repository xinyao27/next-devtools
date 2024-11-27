'use client'

import { useCallback, useMemo, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import { createHighlighter } from 'shiki'
import vesperPurpleTheme from 'vesper-purple-theme'
import { cn } from '@/lib/utils'
import { Button } from './button'
import type { Highlighter } from 'shiki'

const theme = vesperPurpleTheme.dark
theme.colors['editor.background'] = 'transparent'

let highlighter: Highlighter | undefined
  // eslint-disable-next-line unicorn/prefer-top-level-await
;(async () => {
  highlighter = await createHighlighter({
    langs: ['tsx', 'jsx', 'json'],
    themes: [theme],
  })
})()

export interface CodeProps {
  children?: string
  className?: string
  language?: string
  fileName?: string
}
const CodeBlock = ({ children, className, language, fileName, ...rest }: CodeProps) => {
  const [copied, setCopied] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()
  const handleCopy = useCallback((text: string) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    copyToClipboard(text)
  }, [])
  const match = useMemo(() => /language-(?<lang>\w+)/.exec(className || ''), [className])
  const lang = useMemo(() => language || match?.[1], [language, match?.[1]])
  const html = useMemo(() => {
    try {
      return highlighter
        ? highlighter.codeToHtml(children ?? '', {
            lang: match?.[1] ?? 'tsx',
            theme: 'Vesper Purple Dark',
          })
        : ''
    } catch (error) {
      console.error(error)
      return children ?? ''
    }
  }, [children, highlighter, match])
  const node = (
    <div
      {...rest}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      className={cn(
        'code-container relative max-h-96 overflow-auto [&>pre>code]:block [&>pre>code]:w-fit [&>pre>code]:bg-transparent [&>pre>code]:px-4 [&>pre]:m-0 [&>pre]:whitespace-pre [&>pre]:py-2',
        className,
      )}
    />
  )
  const copyNode = (
    <Button
      disabled={!children}
      size="icon"
      variant="outline"
      className={cn(
        'absolute right-2 top-2 z-10 opacity-0 transition-all duration-300 ease-in-out',
        children && 'group-hover:opacity-100',
      )}
      onClick={() => handleCopy(children!)}
    >
      {copied ? (
        <i className="i-ri-check-line size-4 text-green-500" />
      ) : (
        <i className="i-ri-clipboard-line text-foreground/60 size-4" />
      )}
    </Button>
  )

  return (
    <div className="border-accent group relative min-h-12 overflow-hidden rounded border">
      {fileName ? (
        <span className="text-muted-foreground absolute left-2 top-1 z-10 select-none text-xs">{fileName}</span>
      ) : null}
      {lang ? (
        <span className="text-muted-foreground absolute right-2 top-1 z-10 text-xs opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0">
          {lang}
        </span>
      ) : null}
      {copyNode}
      {node}
    </div>
  )
}

export default CodeBlock
