import { useShallow } from 'zustand/react/shallow'
import { ToolbarPosition } from '@next-devtools/shared/types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings'

const items = [
  { id: 'top', value: ToolbarPosition.Top, label: 'Top', icon: 'i-ri-layout-top-2-line' },
  { id: 'bottom', value: ToolbarPosition.Bottom, label: 'Bottom', icon: 'i-ri-layout-bottom-2-line' },
  { id: 'left', value: ToolbarPosition.Left, label: 'Left', icon: 'i-ri-layout-left-2-line' },
  { id: 'right', value: ToolbarPosition.Right, label: 'Right', icon: 'i-ri-layout-right-2-line' },
]

export default function ToolbarPositionComponent() {
  return (
    <section className="space-y-2">
      <h2 id="toolbar-position">Toolbar Position</h2>
      <div className="rounded border p-4">
        <ToolbarPositionToggle />
      </div>
    </section>
  )
}

export function ToolbarPositionToggle() {
  const toolbarPosition = useSettingsStore(useShallow((state) => state.toolbarPosition))
  const setToolbarPosition = useSettingsStore((state) => state.setToolbarPosition)

  return (
    <RadioGroup className="grid-cols-4" value={toolbarPosition} onValueChange={setToolbarPosition}>
      {items.map((item) => (
        <label
          key={item.id}
          className="border-input has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[:focus-visible]:outline-ring/70 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2"
        >
          <RadioGroupItem className="sr-only after:absolute after:inset-0" id={item.id} value={item.value} />
          <i aria-hidden="true" className={cn(item.icon, 'size-5 opacity-60')} />
          <p className="text-foreground text-xs font-medium leading-none">{item.label}</p>
        </label>
      ))}
    </RadioGroup>
  )
}
