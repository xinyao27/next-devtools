'use client'

import { useEffect, useRef } from 'react'
import { useEvent } from 'react-use'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { Button } from '@/components/ui/button'
import { getQueryClient, rpcClient } from '@/lib/client'

import 'xterm/css/xterm.css'

import { useTerminalStore } from '@/store/terminal'

interface TerminalViewProps {
  id: null | string
}
const runTerminalAction = rpcClient.runTerminalAction
export default function TerminalView(props: TerminalViewProps) {
  const termRef = useRef<Terminal>()
  const fitAddonRef = useRef<FitAddon>()
  const containerRef = useRef<HTMLDivElement>(null)

  const terminal = useTerminalStore((state) => state.terminals.find((t) => t.id === props.id))

  useEffect(() => {
    if (terminal?.buffer) {
      termRef.current?.write(terminal.buffer)
    }
  }, [terminal])

  useEffect(() => {
    termRef.current = new Terminal({
      cols: 80,
      convertEol: true,
      screenReaderMode: true,
    })
    fitAddonRef.current = new FitAddon()
    termRef.current.loadAddon(fitAddonRef.current)
    termRef.current.open(containerRef.current!)
    fitAddonRef.current.fit()

    // if (props.id) {
    //   rpcClient.getTerminal(props.id).then((terminal) => {
    //     if (terminal?.buffer) {
    //       termRef.current?.write(terminal.buffer)
    //     }
    //   })
    // }

    return () => {
      termRef.current?.dispose()
    }
  }, [props.id])
  useEvent('resize', () => {
    fitAddonRef.current?.fit()
  })

  function handleClear() {
    if (!props.id) return
    runTerminalAction(props.id, 'clear')
    termRef.current?.clear()
  }
  function handleRestart() {
    if (!props.id) return
    runTerminalAction(props.id, 'restart')
  }
  function handleTerminate() {
    if (!props.id) return
    runTerminalAction(props.id, 'terminate')
    const queryClient = getQueryClient()
    queryClient.invalidateQueries({ queryKey: ['getTerminals'] })
  }

  return (
    <>
      <div
        className="h-full w-full overflow-hidden bg-black p-2"
        ref={containerRef}
      />
      <div className="space-x-1 border-t p-2">
        <Button
          onClick={handleClear}
          size="icon"
          title="Clear"
          variant="ghost"
        >
          <i className="i-ri-delete-bin-line" />
        </Button>
        <Button
          onClick={handleRestart}
          size="icon"
          title="Restart"
          variant="ghost"
        >
          <i className="i-ri-restart-line" />
        </Button>
        <Button
          onClick={handleTerminate}
          size="icon"
          title="Terminate"
          variant="ghost"
        >
          <i className="i-ri-delete-back-2-line" />
        </Button>
      </div>
    </>
  )
}
