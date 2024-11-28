import React from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSettingsStore } from '@/store/settings'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/client'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Directory() {
  const componentDirectory = useSettingsStore(useShallow((state) => state.componentDirectory))
  const setState = useSettingsStore((state) => state.setState)
  const { data: internalStore } = api.getInternalStore.useQuery()
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ componentDirectory: event.target.value })
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
              placeholder="/src/components"
              type="text"
              value={componentDirectory ?? ''}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
