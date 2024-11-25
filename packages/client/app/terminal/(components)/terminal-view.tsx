'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { useEvent } from 'react-use'
import { api } from '@/lib/client'
import { Button } from '@/components/ui/button'
import 'xterm/css/xterm.css'

interface TerminalViewProps {
  id?: string
}
export default function TerminalView(props: TerminalViewProps) {
  const termRef = useRef<Terminal>()
  const fitAddonRef = useRef<FitAddon>()
  const containerRef = useRef<HTMLDivElement>(null)
  const utils = api.useUtils()
  const { mutate: runTerminalAction } = api.runTerminalAction.useMutation()
  api.onTerminalWrite.useSubscription(undefined, {
    onData: ({ id, data }) => {
      if (id === props.id) {
        termRef.current?.write(data)
      }
    },
  })

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
      utils.getTerminal.fetch(props.id).then((terminal) => {
        if (terminal?.buffer) {
          termRef.current?.write(terminal.buffer)
        }
      })
    }

    return () => {
      termRef.current?.dispose()
    }
  }, [props.id])
  useEvent('resize', () => {
    fitAddonRef.current?.fit()
  })

  function handleClear() {
    if (!props.id) return
    runTerminalAction({
      id: props.id,
      action: 'clear',
    })
    termRef.current?.clear()
  }
  function handleRestart() {
    if (!props.id) return
    runTerminalAction({
      id: props.id,
      action: 'restart',
    })
  }
  function handleTerminate() {
    if (!props.id) return
    runTerminalAction({
      id: props.id,
      action: 'terminate',
    })
    utils.getTerminals.invalidate()
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
