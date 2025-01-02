import { Panel, useReactFlow } from '@xyflow/react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  containerRef: React.RefObject<HTMLDivElement>
  onLayout: () => void
}

export function FlowControls({ containerRef, onLayout }: Props) {
  const { zoomIn, zoomOut, getZoom, fitView } = useReactFlow()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(getZoom() * 100)
  const [showZoomLevel, setShowZoomLevel] = useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const handleFullscreen = () => {
    const element = containerRef.current
    if (!element) return

    if (!document.fullscreenElement) {
      element.requestFullscreen()
      setIsFullscreen(true)
      fitView()
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  const handleZoomIn = async () => {
    await zoomIn({ duration: 500 })
    setZoomLevel(getZoom() * 100)

    if (timer.current) clearTimeout(timer.current)
    setShowZoomLevel(true)
    timer.current = setTimeout(() => {
      setShowZoomLevel(false)
    }, 5000)
  }
  const handleZoomOut = async () => {
    await zoomOut({ duration: 500 })
    setZoomLevel(getZoom() * 100)

    if (timer.current) clearTimeout(timer.current)
    setShowZoomLevel(true)
    timer.current = setTimeout(() => {
      setShowZoomLevel(false)
    }, 5000)
  }

  return (
    <Panel position="top-left">
      <div className="flex items-center">
        <div className="flex items-center -space-x-px">
          <Button
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            size="icon"
            variant="outline"
            onClick={handleFullscreen}
          >
            {isFullscreen ? (
              <i aria-hidden="true" className="i-ri-fullscreen-exit-line size-4" />
            ) : (
              <i aria-hidden="true" className="i-ri-fullscreen-line size-4" />
            )}
          </Button>
          <Button
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            size="icon"
            variant="outline"
            onClick={handleZoomIn}
          >
            <i aria-hidden="true" className="i-ri-zoom-in-line size-4" />
          </Button>
          <Button
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            size="icon"
            variant="outline"
            onClick={handleZoomOut}
          >
            <i aria-hidden="true" className="i-ri-zoom-out-line size-4" />
          </Button>
          <Button
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            size="icon"
            variant="outline"
            onClick={onLayout}
          >
            <i aria-hidden="true" className="i-ri-home-line size-4" />
          </Button>
        </div>

        <div className="ml-2 flex items-center">
          {showZoomLevel ? <span className="text-muted-foreground text-xs">{Math.round(zoomLevel)}%</span> : null}
        </div>
      </div>
    </Panel>
  )
}
