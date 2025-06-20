import { useShallow } from 'zustand/react/shallow'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/store/settings'

const options = [
  { label: 'Tiny', value: 12 },
  { label: 'Small', value: 14 },
  { label: 'Normal', value: 15 },
  { label: 'Large', value: 16 },
  { label: 'Huge', value: 18 },
]

export default function UIScale() {
  const uiScale = useSettingsStore(useShallow((state) => state.uiScale))
  const setSettings = useSettingsStore((state) => state.setState)
  const handleChange = (value: string) => {
    setSettings({ uiScale: Number.parseInt(value) })
  }

  return (
    <section className="space-y-2">
      <h2 id="ui-scale">UI Scale</h2>
      <div className="rounded border p-4">
        <Select
          onValueChange={handleChange}
          value={uiScale?.toString()}
        >
          <SelectTrigger
            className="[&>span_i]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_i]:shrink-0"
            id="select-35"
          >
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span>i]:text-muted-foreground/80 [&_*[role=option]>span>i]:shrink-0 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value.toString()}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
