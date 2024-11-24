import { useSnapshot } from 'valtio'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { settingsStore } from '@/store/settings'

const options = [
  { value: 12, label: 'Tiny' },
  { value: 14, label: 'Small' },
  { value: 15, label: 'Normal' },
  { value: 16, label: 'Large' },
  { value: 18, label: 'Huge' },
]

export default function UIScale() {
  const { uiScale } = useSnapshot(settingsStore)

  const handleChange = (value: string) => {
    settingsStore.uiScale = Number.parseInt(value)
  }

  return (
    <section className="space-y-2">
      <h2 id="ui-scale">UI Scale</h2>
      <div className="rounded border p-4">
        <Select value={uiScale.toString()} onValueChange={handleChange}>
          <SelectTrigger
            className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
            id="select-35"
          >
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
