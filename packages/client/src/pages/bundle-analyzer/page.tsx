'use client'

import { STATIC_BASE_PATH } from '@next-devtools/shared/constants'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/ui/code-block'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { rpcClient } from '@/lib/client'

export default function Page() {
  const navigate = useNavigate()
  const { data: internalStore } = useQuery({
    queryFn: () => rpcClient.getInternalStore(),
    queryKey: ['getInternalStore'],
  })
  const [selectedTab, setSelectedTab] = useState('client')
  const analyzeDir = useMemo(() => {
    return internalStore?.root ? `${STATIC_BASE_PATH}/analyze/${selectedTab}.html` : '#'
  }, [internalStore, selectedTab])

  async function handleBuild() {
    await rpcClient.runAnalyzeBuild()
    navigate('/terminal')
  }

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          className="space-y-4 p-4"
          defaultSize={20}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="w-full"
                variant="secondary"
              >
                <i className="i-ri-pie-chart-box-line mr-2" />
                Start a new build
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Start bundle analyzer build?</SheetTitle>
                <SheetDescription className="opacity-50">
                  <div>
                    After the build is completed, the project will be restarted, then return to the bundle analyzer page
                    to view the analysis results.
                  </div>
                  <div>The following command will be executed in your terminal:</div>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-2">
                <CodeBlock code="ANALYZE=true npx next build" />
              </div>

              <SheetFooter className="mt-8">
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    onClick={handleBuild}
                    variant="default"
                  >
                    Build
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Separator />

          <div className="flex flex-col gap-1">
            <Button
              onClick={() => setSelectedTab('client')}
              variant={selectedTab === 'client' ? 'default' : 'ghost'}
            >
              Client
            </Button>
            <Button
              onClick={() => setSelectedTab('edge')}
              variant={selectedTab === 'edge' ? 'default' : 'ghost'}
            >
              Edge
            </Button>
            <Button
              onClick={() => setSelectedTab('nodejs')}
              variant={selectedTab === 'nodejs' ? 'default' : 'ghost'}
            >
              Nodejs
            </Button>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="dark:bg-grid-small-white/[0.3] bg-grid-small-black/[0.1]"
          defaultSize={80}
        >
          <iframe
            className="h-full w-full border-none"
            src={analyzeDir}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
