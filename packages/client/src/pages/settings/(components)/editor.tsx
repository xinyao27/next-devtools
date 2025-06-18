import type { Editor } from '@next-devtools/shared/types'

import { useShallow } from 'zustand/react/shallow'

import LogoCursor from '@/assets/cursor.svg'
import LogoVSCode from '@/assets/vscode.png'
import LogoWindsurf from '@/assets/windsurf.svg'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSettingsStore } from '@/store/settings'

const editors = [
  {
    id: 'vscode',
    image: LogoVSCode,
    label: 'VSCode',
    uriScheme: 'vscode',
    value: 'vscode',
  },
  {
    id: 'cursor',
    image: LogoCursor,
    label: 'Cursor',
    uriScheme: 'cursor',
    value: 'cursor',
  },
  {
    id: 'windsurf',
    image: LogoWindsurf,
    label: 'Windsurf',
    uriScheme: 'windsurf',
    value: 'windsurf',
  },
]

export default function EditorComponent() {
  const editor = useSettingsStore(useShallow((state) => state.editor))
  const setSettings = useSettingsStore((state) => state.setState)

  const handleChange = (value: Editor) => {
    setSettings({ editor: value })
  }

  return (
    <section className="space-y-2">
      <h2 id="select-editor">Editor</h2>
      <div className="rounded border p-4">
        <RadioGroup
          className="grid-cols-3"
          onValueChange={handleChange}
          value={editor}
        >
          {editors.map((editor) => (
            <label
              className="has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent has-focus-visible:outline-ring/70 text-muted-foreground/60 has-data-[state=checked]:text-foreground has-focus-visible:outline has-focus-visible:outline-2 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-transparent px-2 py-3 text-center outline-offset-2 transition-colors"
              key={editor.id}
            >
              <RadioGroupItem
                className="sr-only after:absolute after:inset-0"
                id={editor.id}
                value={editor.value}
              />
              <img
                alt={editor.label}
                height={48}
                src={editor.image}
                width={48}
              />
              <p className="text-xs font-medium leading-none">{editor.label}</p>
            </label>
          ))}
        </RadioGroup>
      </div>
    </section>
  )
}
