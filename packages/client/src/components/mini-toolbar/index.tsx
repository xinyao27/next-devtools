'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ToolbarDefaultSize, ToolbarPosition } from '@next-devtools/shared/types'
import { rpcClient } from '@/lib/client'
import { useSettingsStore } from '@/store/settings'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import FpsCounter from './fps-counter'

export default function MiniToolbar() {
  const toolbarPosition = useSettingsStore((state) => state.toolbarPosition)
  const setToolbarSize = useSettingsStore((state) => state.setToolbarSize)
  const setToolbarPosition = useSettingsStore((state) => state.setToolbarPosition)

  const isHorizontal = toolbarPosition === ToolbarPosition.Top || toolbarPosition === ToolbarPosition.Bottom
  const isVertical = toolbarPosition === ToolbarPosition.Left || toolbarPosition === ToolbarPosition.Right
  const buttonClass = cn(
    'bg-sidebar cursor-pointer transition-all duration-200 flex gap-2 text-xs flex-nowrap hover:shadow-inner hover:bg-sidebar/80',
    {
      'h-full px-4 py-2 items-center': isHorizontal,
      'w-full px-2 py-4 justify-center': isVertical,
    },
  )

  const { data } = useQuery({
    queryKey: ['getOverviewData'],
    queryFn: () => rpcClient?.getOverviewData(),
  })

  return (
    <div
      className={cn('no-scrollbar bg-sidebar relative flex', {
        'h-full flex-row overflow-x-auto overflow-y-hidden': isHorizontal,
        'h-full w-full flex-col overflow-y-auto overflow-x-hidden': isVertical,
      })}
    >
      {/* toggle full */}
      <button
        aria-label="Fullscreen"
        title="Fullscreen"
        className={cn(buttonClass, 'sticky', {
          'left-0 top-0 border-r': isHorizontal,
          'left-0 top-0 border-b': isVertical,
        })}
        onClick={() => setToolbarSize(ToolbarDefaultSize[toolbarPosition].height as number)}
      >
        <i className="i-ri-fullscreen-line size-4 opacity-60" />
      </button>

      <div
        className={cn('flex flex-1', {
          'h-full flex-row': isHorizontal,
          'w-full flex-col': isVertical,
        })}
      >
        {/* FPS */}
        <FpsCounter className={buttonClass} isHorizontal={isHorizontal} isVertical={isVertical} />

        {/* routes */}
        <button
          aria-label={`${data?.routes.length ?? 0} Routes`}
          title={`${data?.routes.length ?? 0} Routes`}
          className={cn(buttonClass, {
            'border-r': isHorizontal,
            'flex-col items-center border-b': isVertical,
          })}
        >
          <i className="i-ri-node-tree size-4 opacity-60" />
          <span className="hidden opacity-60 md:block" data-label="ROUTES">
            ROUTES
          </span>
          <span className="text-nowrap opacity-70">
            <span className="font-medium">{data?.routes.length ?? 0}</span>{' '}
            <span className={cn(isVertical && 'hidden')}>Routes</span>
          </span>
        </button>

        {/* components */}
        <button
          aria-label={`${data?.components.length ?? 0} Components`}
          title={`${data?.components.length ?? 0} Components`}
          className={cn(buttonClass, {
            'border-r': isHorizontal,
            'flex-col items-center border-b': isVertical,
          })}
        >
          <i className="i-ri-box-1-line size-4 opacity-60" />
          <span className="hidden opacity-60 md:block" data-label="COMPONENTS">
            COMPONENTS
          </span>
          <span className="text-nowrap opacity-70">
            <span className="font-medium">{data?.components.length ?? 0}</span>{' '}
            <span className={cn(isVertical && 'hidden')}>Components</span>
          </span>
        </button>

        {/* assets */}
        <button
          aria-label={`${data?.assets.length ?? 0} Assets`}
          title={`${data?.assets.length ?? 0} Assets`}
          className={cn(buttonClass, {
            'border-r': isHorizontal,
            'flex-col items-center border-b': isVertical,
          })}
        >
          <i className="i-ri-gallery-line size-4 opacity-60" />
          <span className="hidden opacity-60 md:block" data-label="ASSETS">
            ASSETS
          </span>
          <span className="text-nowrap opacity-70">
            <span className="font-medium">{data?.assets.length ?? 0}</span>{' '}
            <span className={cn(isVertical && 'hidden')}>Assets</span>
          </span>
        </button>

        {/* packages */}
        <button
          aria-label={`${data?.packages.length ?? 0} Packages`}
          title={`${data?.packages.length ?? 0} Packages`}
          className={cn(buttonClass, {
            'border-r': isHorizontal,
            'flex-col items-center border-b': isVertical,
          })}
        >
          <i className="i-ri-box-3-line size-4 opacity-60" />
          <span className="hidden opacity-60 md:block" data-label="PACKAGES">
            PACKAGES
          </span>
          <span className="text-nowrap opacity-70">
            <span className="font-medium">{data?.packages.length ?? 0}</span>{' '}
            <span className={cn(isVertical && 'hidden')}>Packages</span>
          </span>
        </button>
      </div>

      <div
        className={cn('sticky z-10 flex', {
          'right-0 h-full flex-row items-center': isHorizontal,
          'bottom-0 w-full flex-col justify-center': isVertical,
        })}
      >
        {/* switch toolbar position */}
        <Collapsible
          className={cn('flex h-full', {
            'h-full flex-row-reverse items-center': isHorizontal,
            'w-full flex-col-reverse justify-center': isVertical,
          })}
        >
          <CollapsibleTrigger asChild>
            <button
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
              <button
                className={cn(buttonClass, {
                  'h-full border-l': isHorizontal,
                  'w-full border-t': isVertical,
                })}
                onClick={() => setToolbarPosition(ToolbarPosition.Top)}
              >
                <i className="i-ri-layout-top-2-line size-4 opacity-60" />
              </button>

              <button
                className={cn(buttonClass, {
                  'border-l': isHorizontal,
                  'border-t': isVertical,
                })}
                onClick={() => setToolbarPosition(ToolbarPosition.Bottom)}
              >
                <i className="i-ri-layout-bottom-2-line size-4 opacity-60" />
              </button>

              <button
                className={cn(buttonClass, {
                  'border-l': isHorizontal,
                  'border-t': isVertical,
                })}
                onClick={() => setToolbarPosition(ToolbarPosition.Left)}
              >
                <i className="i-ri-layout-left-2-line size-4 opacity-60" />
              </button>

              <button
                className={cn(buttonClass, {
                  'border-l': isHorizontal,
                  'border-t': isVertical,
                })}
                onClick={() => setToolbarPosition(ToolbarPosition.Right)}
              >
                <i className="i-ri-layout-right-2-line size-4 opacity-60" />
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
