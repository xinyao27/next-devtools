import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { rpcClient } from '@/lib/client'
import { useSettingsStore } from '@/store/settings'

export default function Directory() {
  const componentDirectory = useSettingsStore(useShallow((state) => state.componentDirectory))
  const setSettings = useSettingsStore((state) => state.setState)
  const { data: internalStore } = useQuery({
    queryFn: () => rpcClient.getInternalStore(),
    queryKey: ['getInternalStore'],
  })
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ componentDirectory: event.target.value })
  }

  return (
    <section className="space-y-2">
      <h2 id="select-editor">Directory</h2>
      <div className="rounded border p-4">
        <div className="grid grid-cols-12 rounded shadow-sm shadow-black/5">
          <div className="border-input bg-background text-muted-foreground col-span-4 flex items-center rounded-s border px-3 text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate [direction:rtl]">{internalStore?.root ?? '/'}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{internalStore?.root ?? '/'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="col-span-8">
            <Input
              className="-ms-px rounded-s-none shadow-none"
              onChange={handleValueChange}
              placeholder="/src/components"
              type="text"
              value={componentDirectory ?? ''}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
