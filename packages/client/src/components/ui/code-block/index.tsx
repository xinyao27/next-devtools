'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import * as React from 'react'
import { useCopyToClipboard } from 'react-use'
import { generate, tokenize } from 'sugar-high'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import './styles.css'

export interface CodeProps {
  className?: string
  code?: string
  codes?: {
    code: string
    label: string
  }[]
  fileName?: string
  language?: string
  lineNumbers?: boolean
  showLanguage?: boolean
}
const SingleCodeBlock = ({
  className,
  code,
  fileName,
  language,
  lineNumbers = false,
  showLanguage = false,
  ...rest
}: Omit<CodeProps, 'codes'>) => {
  const parentRef = React.useRef<HTMLPreElement>(null)
  const [copied, setCopied] = React.useState(false)
  const [, copyToClipboard] = useCopyToClipboard()
  const handleCopy = React.useCallback((code: string) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    copyToClipboard(code)
  }, [])
  const match = React.useMemo(() => /language-(?<lang>\w+)/.exec(className || ''), [className])
  const lang = React.useMemo(() => language || match?.[1], [language, match?.[1]])
  const lines = React.useMemo(() => generate(tokenize(code ?? '')), [code, match])
  const rowVirtualizer = useVirtualizer({
    count: lines.length,
    estimateSize: () => 20,
    getScrollElement: () => parentRef.current,
    overscan: 5,
  })
  const node = (
    <pre
      className="max-h-96 w-full overflow-auto whitespace-pre p-4"
      ref={parentRef}
    >
      <code
        {...rest}
        className={cn('relative block [overflow-wrap:break-word]', className)}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const line = lines[virtualRow.index]
          const LineTag = line.tagName as any
          return (
            <LineTag
              className={cn(line.properties.className, lineNumbers && 'sh__line-number')}
              key={virtualRow.index}
              style={{
                height: `${virtualRow.size}px`,
                left: 0,
                position: 'absolute',
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: '100%',
              }}
            >
              {line.children.map((child: any, index: number) => (
                <child.tagName
                  className={child.properties.className}
                  key={index}
                  style={child.properties.style}
                >
                  {child.children[0].value}
                </child.tagName>
              ))}
            </LineTag>
          )
        })}
      </code>
    </pre>
  )

  const copyNode = (
    <Button
      className={cn(
        'absolute right-2 top-2 z-10 opacity-0 transition-all ease-in-out',
        code && 'group-hover:opacity-100',
      )}
      disabled={!code}
      onClick={() => handleCopy(code!)}
      size="icon"
      variant="secondary"
    >
      {copied ? (
        <i className="i-ri-check-line size-4 text-green-500" />
      ) : (
        <i className="i-ri-clipboard-line text-foreground size-4" />
      )}
    </Button>
  )

  return (
    <div className="border-accent group relative min-h-12 w-full overflow-hidden rounded-sm border">
      {fileName ? (
        <span className="text-muted-foreground absolute left-2 top-1 z-10 select-none text-xs">{fileName}</span>
      ) : null}
      {lang && showLanguage ? (
        <span className="text-muted-foreground absolute right-2 top-1 z-10 text-xs opacity-100 transition-all ease-in-out group-hover:opacity-0">
          {lang}
        </span>
      ) : null}
      {copyNode}
      {node}
    </div>
  )
}

const CodeBlock = (props: CodeProps) => {
  const { codes, ...rest } = props

  const multipleCodes = codes && codes.length > 1
  const [selected, setSelected] = React.useState<string>(codes?.[0].label ?? '')

  if (multipleCodes) {
    return (
      <Tabs
        className="w-full space-y-0"
        defaultValue={selected}
        onValueChange={setSelected}
      >
        <TabsList className="w-full justify-start border-b-transparent">
          {codes.map((code) => (
            <TabsTrigger
              key={code.label}
              value={code.label}
            >
              {code.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {codes.map((code) => (
          <TabsContent
            key={code.label}
            value={code.label}
          >
            <SingleCodeBlock
              code={code.code}
              {...rest}
            />
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  return <SingleCodeBlock {...rest} />
}

export default CodeBlock
