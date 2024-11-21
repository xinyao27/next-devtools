'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { useEvent } from 'react-use'
import { mutate } from 'swr'
import { useRPCClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import 'xterm/css/xterm.css'

interface TerminalViewProps {
  id?: string
}
export default function TerminalView(props: TerminalViewProps) {
  const rpcClient = useRPCClient()
  const termRef = useRef<Terminal>()
  const fitAddonRef = useRef<FitAddon>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    termRef.current = new Terminal({
      convertEol: true,
      cols: 80,
      screenReaderMode: true,
    })
    fitAddonRef.current = new FitAddon()
    termRef.current.loadAddon(fitAddonRef.current)
    termRef.current.open(containerRef.current!)
    fitAddonRef.current.fit()

    if (props.id) {
      rpcClient?.getTerminal.query(props.id).then((terminal) => {
        if (terminal?.buffer) {
          termRef.current?.write(terminal.buffer)
        }
      })
    }

    const s = rpcClient?.onTerminalWrite.subscribe(undefined, {
      onData: ({ id, data }) => {
        if (id === props.id) {
          termRef.current?.write(data)
        }
      },
    })

    return () => {
      termRef.current?.dispose()
      s?.unsubscribe()
    }
  }, [props.id])
  useEvent('resize', () => {
    fitAddonRef.current?.fit()
  })

  function handleClear() {
    if (!props.id) return
    rpcClient?.runTerminalAction.mutate({
      id: props.id,
      action: 'clear',
    })
    termRef.current?.clear()
  }
  function handleRestart() {
    if (!props.id) return
    rpcClient?.runTerminalAction.mutate({
      id: props.id,
      action: 'restart',
    })
  }
  function handleTerminate() {
    if (!props.id) return
    rpcClient?.runTerminalAction.mutate({
      id: props.id,
      action: 'terminate',
    })
    mutate('getTerminals')
  }

  return (
    <>
      <div ref={containerRef} className="h-full w-full overflow-hidden bg-black p-2" />
      <div className="space-x-1 border-t p-2">
        <Button size="icon" title="Clear" variant="ghost" onClick={handleClear}>
          <i className="i-ri-delete-bin-line" />
        </Button>
        <Button size="icon" title="Restart" variant="ghost" onClick={handleRestart}>
          <i className="i-ri-restart-line" />
        </Button>
        <Button size="icon" title="Terminate" variant="ghost" onClick={handleTerminate}>
          <i className="i-ri-delete-back-2-line" />
        </Button>
      </div>
    </>
  )
}
