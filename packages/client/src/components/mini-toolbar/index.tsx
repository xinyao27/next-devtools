'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ToolbarPosition } from '@next-devtools/shared/types'
import { useNavigate } from 'react-router'
import Logo from '@/components/logo'
import { rpcClient } from '@/lib/client'
import { useSettingsStore } from '@/store/settings'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import FpsCounter from './fps-counter'
import MemoryUsage from './memory-usage'

export default function MiniToolbar() {
  const navigate = useNavigate()
  const toolbarPosition = useSettingsStore((state) => state.toolbarPosition)
  const toggleToolbar = useSettingsStore((state) => state.toggleToolbar)
  const setToolbarPosition = useSettingsStore((state) => state.setToolbarPosition)
  const [positionToggleOpen, setPositionToggleOpen] = React.useState(false)

  const isHorizontal = toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Bottom
  const isVertical = toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right
  const tooltipSide = React.useMemo(() => {
    switch (toolbarPosition) {
      case ToolbarPosition.Top:
        return 'bottom'
      case ToolbarPosition.Bottom:
        return 'top'
      case ToolbarPosition.Left:
        return 'right'
      case ToolbarPosition.Right:
        return 'left'
    }
  }, [toolbarPosition])

  const buttonClass = cn(
    'bg-sidebar cursor-pointer transition-all duration-200 flex gap-2 text-xs flex-nowrap hover:shadow-inner hover:bg-accent',
    {
      'h-full px-4 py-2 items-center': isHorizontal,
      'w-full px-2 py-4 justify-center': isVertical,
    },
  )

  const { data } = useQuery({
    queryKey: ['getOverviewData'],
    queryFn: () => rpcClient?.getOverviewData(),
  })

  const logoElement = (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn('bg-sidebar sticky left-0 top-0 z-10 flex items-center justify-center gap-1', {
            'h-full border-l px-4': isHorizontal,
            'border-b py-3': isVertical,
          })}
        >
          <Logo className="size-5" />
          <span className={cn('select-none text-sm font-medium', isVertical && 'hidden')}>Next Devtools</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>Next Devtools</TooltipContent>
    </Tooltip>
  )
  const toggleFullscreenElement = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(buttonClass, 'bg-sidebar', {
            'border-r': isHorizontal,
            'border-t': isVertical,
          })}
          onClick={toggleToolbar}
        >
          <i className="i-ri-fullscreen-line size-4 opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>Fullscreen</TooltipContent>
    </Tooltip>
  )

  return (
    <ScrollArea
      className={cn('bg-sidebar relative whitespace-nowrap [&>div>div]:!block [&>div>div]:size-full', {
        'h-full': isHorizontal,
        'size-full': isVertical,
      })}
    >
      <div
        className={cn('flex', {
          'h-full flex-row': isHorizontal,
          'h-full w-full flex-col': isVertical,
        })}
      >
        {isVertical ? logoElement : toggleFullscreenElement}

        <div
          className={cn('flex grow', {
            'h-full flex-row': isHorizontal,
            'w-full flex-col': isVertical,
          })}
        >
          {/* FPS */}
          <FpsCounter
            className={buttonClass}
            isHorizontal={isHorizontal}
            isVertical={isVertical}
            tooltipSide={tooltipSide}
          />

          {/* Memory Usage */}
          <MemoryUsage
            className={buttonClass}
            isHorizontal={isHorizontal}
            isVertical={isVertical}
            tooltipSide={tooltipSide}
          />

          {/* routes */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(buttonClass, {
                  'border-r': isHorizontal,
                  'flex-col items-center border-b': isVertical,
                })}
                onClick={() => {
                  navigate('/routes')
                  toggleToolbar()
                }}
              >
                <i className="i-ri-node-tree size-4 opacity-60" />
                <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="ROUTES">
                  ROUTES
                </span>
                <span className="text-nowrap opacity-70">
                  <span className="font-medium">{data?.routes.length ?? 0}</span>{' '}
                  <span className={cn(isVertical && 'hidden')}>Routes</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>{data?.routes.length ?? 0} Routes</TooltipContent>
          </Tooltip>

          {/* components */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(buttonClass, {
                  'border-r': isHorizontal,
                  'flex-col items-center border-b': isVertical,
                })}
                onClick={() => {
                  navigate('/routes')
                  toggleToolbar()
                }}
              >
                <i className="i-ri-box-1-line size-4 opacity-60" />
                <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="COMPONENTS">
                  COMPONENTS
                </span>
                <span className="text-nowrap opacity-70">
                  <span className="font-medium">{data?.components.length ?? 0}</span>{' '}
                  <span className={cn(isVertical && 'hidden')}>Components</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>{data?.components.length ?? 0} Components</TooltipContent>
          </Tooltip>

          {/* assets */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(buttonClass, {
                  'border-r': isHorizontal,
                  'flex-col items-center border-b': isVertical,
                })}
                onClick={() => {
                  navigate('/assets')
                  toggleToolbar()
                }}
              >
                <i className="i-ri-gallery-line size-4 opacity-60" />
                <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="ASSETS">
                  ASSETS
                </span>
                <span className="text-nowrap opacity-70">
                  <span className="font-medium">{data?.assets.length ?? 0}</span>{' '}
                  <span className={cn(isVertical && 'hidden')}>Assets</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>{data?.assets.length ?? 0} Assets</TooltipContent>
          </Tooltip>

          {/* packages */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(buttonClass, {
                  'border-r': isHorizontal,
                  'flex-col items-center border-b': isVertical,
                })}
                onClick={() => {
                  navigate('/packages')
                  toggleToolbar()
                }}
              >
                <i className="i-ri-box-3-line size-4 opacity-60" />
                <span className={cn('hidden opacity-60', isHorizontal && 'block')} data-label="PACKAGES">
                  PACKAGES
                </span>
                <span className="text-nowrap opacity-70">
                  <span className="font-medium">{data?.packages.length ?? 0}</span>{' '}
                  <span className={cn(isVertical && 'hidden')}>Packages</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>{data?.packages.length ?? 0} Packages</TooltipContent>
          </Tooltip>
        </div>

        <div
          className={cn('sticky z-10 flex', {
            'right-0 h-full flex-row items-center': isHorizontal,
            'bottom-0 w-full flex-col justify-center': isVertical,
          })}
        >
          {/* switch toolbar position */}
          <Collapsible
            open={positionToggleOpen}
            className={cn('flex h-full', {
              'h-full flex-row-reverse items-center': isHorizontal,
              'w-full flex-col-reverse justify-center': isVertical,
            })}
            onOpenChange={setPositionToggleOpen}
          >
            <CollapsibleTrigger asChild>
              <button
                title="Switch Toolbar Position"
                className={cn(buttonClass, 'transition-transform duration-200 [&[data-state=open]>i]:rotate-180', {
                  'border-l': isHorizontal,
                  'border-t': isVertical,
                })}
              >
                {isHorizontal ? (
                  <i className="i-ri-arrow-left-s-line size-4 opacity-60" />
                ) : (
                  <i className="i-ri-arrow-up-s-line size-4 opacity-60" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={cn({
                'h-full': isHorizontal,
                'w-full': isVertical,
              })}
            >
              <div
                className={cn('flex', {
                  'h-full flex-row items-center': isHorizontal,
                  'w-full flex-col justify-center': isVertical,
                })}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      title="Top"
                      className={cn(buttonClass, {
                        'h-full border-l': isHorizontal,
                        'w-full border-t': isVertical,
                      })}
                      onClick={() => {
                        setToolbarPosition(ToolbarPosition.Top)
                        setPositionToggleOpen(false)
                      }}
                    >
                      <i className="i-ri-layout-top-2-line size-4 opacity-60" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={tooltipSide}>Top</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      title="Bottom"
                      className={cn(buttonClass, {
                        'border-l': isHorizontal,
                        'border-t': isVertical,
                      })}
                      onClick={() => {
                        setToolbarPosition(ToolbarPosition.Bottom)
                        setPositionToggleOpen(false)
                      }}
                    >
                      <i className="i-ri-layout-bottom-2-line size-4 opacity-60" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={tooltipSide}>Bottom</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      title="Left"
                      className={cn(buttonClass, {
                        'border-l': isHorizontal,
                        'border-t': isVertical,
                      })}
                      onClick={() => {
                        setToolbarPosition(ToolbarPosition.Left)
                        setPositionToggleOpen(false)
                      }}
                    >
                      <i className="i-ri-layout-left-2-line size-4 opacity-60" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={tooltipSide}>Left</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      title="Right"
                      className={cn(buttonClass, {
                        'border-l': isHorizontal,
                        'border-t': isVertical,
                      })}
                      onClick={() => {
                        setToolbarPosition(ToolbarPosition.Right)
                        setPositionToggleOpen(false)
                      }}
                    >
                      <i className="i-ri-layout-right-2-line size-4 opacity-60" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={tooltipSide}>Right</TooltipContent>
                </Tooltip>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* toggle full */}
          {isHorizontal ? logoElement : toggleFullscreenElement}
        </div>
      </div>

      {isHorizontal ? <ScrollBar orientation="horizontal" /> : null}
      {isVertical ? <ScrollBar orientation="vertical" /> : null}
    </ScrollArea>
  )
}
