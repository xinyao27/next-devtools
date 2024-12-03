import { useTheme } from 'next-themes'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import UiDark from '@/assets/ui-dark.webp'
import UiLight from '@/assets/ui-light.webp'
import UiSystem from '@/assets/ui-system.webp'

const items = [
  { id: 'light', value: 'light', label: 'Light', image: UiLight },
  { id: 'dark', value: 'dark', label: 'Dark', image: UiDark },
  { id: 'system', value: 'system', label: 'System', image: UiSystem },
]

export default function Theme() {
  const { theme, setTheme } = useTheme()

  return (
    <section className="space-y-2">
      <h2 id="theme">Theme</h2>
      <div className="rounded border p-4">
        <fieldset className="space-y-4">
          <RadioGroup className="flex gap-3" value={theme} onValueChange={setTheme}>
            {items.map((item) => (
              <label key={item.id}>
                <RadioGroupItem className="peer sr-only after:absolute after:inset-0" id={item.id} value={item.value} />
                <img
                  alt={item.label}
                  className="border-input peer-[:focus-visible]:outline-ring/70 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-lg border shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50"
                  height={70}
                  src={item.image}
                  width={88}
                />
                <span className="peer-data-[state=unchecked]:text-muted-foreground/60 group mt-2 flex items-center gap-1">
                  <i aria-hidden="true" className="i-ri-check-line peer-data-[state=unchecked]:group-[]:hidden" />
                  <i aria-hidden="true" className="i-ri-subtract-line peer-data-[state=checked]:group-[]:hidden" />
                  <span className="text-xs font-medium">{item.label}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      </div>
    </section>
  )
}
