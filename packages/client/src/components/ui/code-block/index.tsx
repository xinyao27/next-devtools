'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { generate, tokenize } from 'sugar-high'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, Clipboard } from 'lucide-react'
import { useCopyToClipboard } from 'react-use'
import { cn } from '@/lib/utils'
import { Button } from '../button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'

import './styles.css'

export interface CodeProps {
  code?: string
  codes?: {
    label: string
    code: string
  }[]
  className?: string
  language?: string
  fileName?: string
  lineNumbers?: boolean
  showLanguage?: boolean
}
const SingleCodeBlock = ({
  code,
  className,
  language,
  fileName,
  lineNumbers = false,
  showLanguage = false,
  ...rest
}: Omit<CodeProps, 'codes'>) => {
  const parentRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()
  const handleCopy = useCallback((code: string) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    copyToClipboard(code)
  }, [])
  const match = useMemo(() => /language-(?<lang>\w+)/.exec(className || ''), [className])
  const lang = useMemo(() => language || match?.[1], [language, match?.[1]])
  const lines = useMemo(() => generate(tokenize(code ?? '')), [code, match])
  const rowVirtualizer = useVirtualizer({
    count: lines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
    overscan: 5,
  })
  const node = (
    <pre ref={parentRef} className="max-h-96 w-full overflow-auto whitespace-pre p-4">
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
              key={virtualRow.index}
              className={cn(line.properties.className, lineNumbers && 'sh__line-number')}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {line.children.map((child: any, index: number) => (
                <child.tagName
                  key={index}
                  className={child.properties.className}
                  style={child.properties.style.split(';').reduce((acc: any, curr: string) => {
                    const [key, value] = curr.split(':')
                    acc[key] = value
                    return acc
                  }, {} as any)}
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
      disabled={!code}
      size="icon"
      variant="secondary"
      className={cn(
        'absolute right-2 top-2 z-10 opacity-0 transition-all duration-300 ease-in-out',
        code && 'group-hover:opacity-100',
      )}
      onClick={() => handleCopy(code!)}
    >
      {copied ? <Check className="size-4 text-green-500" /> : <Clipboard className="text-foreground size-4" />}
    </Button>
  )

  return (
    <div className="border-accent group relative min-h-12 w-full overflow-hidden rounded-sm border">
      {fileName ? (
        <span className="text-muted-foreground absolute left-2 top-1 z-10 select-none text-xs">{fileName}</span>
      ) : null}
      {lang && showLanguage ? (
        <span className="text-muted-foreground absolute right-2 top-1 z-10 text-xs opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0">
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
  const [selected, setSelected] = useState<string>(codes?.[0].label ?? '')

  if (multipleCodes) {
    return (
      <Tabs className="w-full space-y-0" defaultValue={selected} onValueChange={setSelected}>
        <TabsList className="w-full justify-start border-b-transparent">
          {codes.map((code) => (
            <TabsTrigger key={code.label} value={code.label}>
              {code.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {codes.map((code) => (
          <TabsContent key={code.label} value={code.label}>
            <SingleCodeBlock code={code.code} {...rest} />
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  return <SingleCodeBlock {...props} />
}

export default CodeBlock
