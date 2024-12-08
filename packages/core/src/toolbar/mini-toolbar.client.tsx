'use client'

import React from 'react'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getQueryClient, rpcClient } from './client'
import type { FrameStatus } from '@next-devtools/shared/utils'

interface MiniToolbarProps {
  setFrameStatus: React.Dispatch<React.SetStateAction<FrameStatus>>
}

function MiniToolbarContent({ setFrameStatus }: MiniToolbarProps) {
  const { data } = useQuery({
    queryKey: ['getOverviewData'],
    queryFn: () => rpcClient.getOverviewData(),
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        overflowY: 'hidden',
        overflowX: 'auto',
        position: 'relative',
      }}
    >
      {/* toggle full */}
      <button
        style={{
          position: 'sticky',
          left: 0,
          borderRight: '1px solid var(--next-devtools-widget-border)',
          background: 'var(--next-devtools-widget-bg)',
          zIndex: 1,
        }}
        onClick={() => setFrameStatus('full')}
      >
        <FullScreenIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {/* routes */}
        <button>
          <RoutesIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
          <span data-label="ROUTES" style={{ opacity: 0.6 }}>
            ROUTES
          </span>
          <span style={{ opacity: 0.7 }}>{data?.routes.length ?? 0} Routes</span>
        </button>

        {/* components */}
        <button>
          <ComponentsIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
          <span data-label="COMPONENTS" style={{ opacity: 0.6 }}>
            COMPONENTS
          </span>
          <span style={{ opacity: 0.7 }}>{data?.components.length ?? 0} Components</span>
        </button>

        {/* assets */}
        <button>
          <AssetsIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
          <span data-label="ASSETS" style={{ opacity: 0.6 }}>
            ASSETS
          </span>
          <span style={{ opacity: 0.7 }}>{data?.assets.length ?? 0} Assets</span>
        </button>

        {/* packages */}
        <button>
          <PackagesIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
          <span data-label="PACKAGES" style={{ opacity: 0.6 }}>
            PACKAGES
          </span>
          <span style={{ opacity: 0.7 }}>{data?.packages.length ?? 0} Packages</span>
        </button>
      </div>

      {/* toggle hide */}
      <button
        style={{
          position: 'sticky',
          right: 0,
          borderLeft: '1px solid var(--next-devtools-widget-border)',
          background: 'var(--next-devtools-widget-bg)',
          zIndex: 1,
        }}
        onClick={() => setFrameStatus('hide')}
      >
        <HideIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
      </button>
    </div>
  )
}

export default function MiniToolbar({ setFrameStatus }: MiniToolbarProps) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <MiniToolbarContent setFrameStatus={setFrameStatus} />
    </QueryClientProvider>
  )
}

function FullScreenIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z" />
    </svg>
  )
}
function HideIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z" />
    </svg>
  )
}
function RoutesIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C10.5523 2 11 2.44772 11 3V7C11 7.55228 10.5523 8 10 8H8V10H13V9C13 8.44772 13.4477 8 14 8H20C20.5523 8 21 8.44772 21 9V13C21 13.5523 20.5523 14 20 14H14C13.4477 14 13 13.5523 13 13V12H8V18H13V17C13 16.4477 13.4477 16 14 16H20C20.5523 16 21 16.4477 21 17V21C21 21.5523 20.5523 22 20 22H14C13.4477 22 13 21.5523 13 21V20H7C6.44772 20 6 19.5523 6 19V8H4C3.44772 8 3 7.55228 3 7V3C3 2.44772 3.44772 2 4 2H10ZM19 18H15V20H19V18ZM19 10H15V12H19V10ZM9 4H5V6H9V4Z" />
    </svg>
  )
}
function ComponentsIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM5.49388 7.0777L13.0001 11.4234V20.11L19.5 16.3469V7.65311L12 3.311L5.49388 7.0777ZM4.5 8.81329V16.3469L11.0001 20.1101V12.5765L4.5 8.81329Z" />
    </svg>
  )
}
function AssetsIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 13C18.3221 13 16.7514 13.4592 15.4068 14.2587C16.5908 15.6438 17.5269 17.2471 18.1465 19H20V13ZM16.0037 19C14.0446 14.3021 9.4079 11 4 11V19H16.0037ZM4 9C7.82914 9 11.3232 10.4348 13.9738 12.7961C15.7047 11.6605 17.7752 11 20 11V3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H6V1H8V5H4V9ZM18 1V5H10V3H16V1H18ZM16.5 10C15.6716 10 15 9.32843 15 8.5C15 7.67157 15.6716 7 16.5 7C17.3284 7 18 7.67157 18 8.5C18 9.32843 17.3284 10 16.5 10Z" />
    </svg>
  )
}
function PackagesIcon({ className, style }: React.SVGProps<HTMLOrSVGElement>) {
  return (
    <svg className={className} fill="currentColor" style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM5.49388 7.0777L12.0001 10.8444L18.5062 7.07774L12 3.311L5.49388 7.0777ZM4.5 8.81329V16.3469L11.0001 20.1101V12.5765L4.5 8.81329ZM13.0001 20.11L19.5 16.3469V8.81337L13.0001 12.5765V20.11Z" />
    </svg>
  )
}
