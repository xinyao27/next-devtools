import Image from 'next/image'
import { useShallow } from 'zustand/react/shallow'
import { useSettingsStore } from '@/store/settings'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import LogoVSCode from '@/public/vscode.png'
import LogoCursor from '@/public/cursor.svg'
import LogoWindsurf from '@/public/windsurf.svg'
import type { Editor } from '@next-devtools/shared/types/settings'

const editors = [
  {
    id: 'vscode',
    value: 'vscode',
    label: 'VSCode',
    image: LogoVSCode,
    uriScheme: 'vscode',
  },
  {
    id: 'cursor',
    value: 'cursor',
    label: 'Cursor',
    image: LogoCursor,
    uriScheme: 'cursor',
  },
  {
    id: 'windsurf',
    value: 'windsurf',
    label: 'Windsurf',
    image: LogoWindsurf,
    uriScheme: 'windsurf',
  },
]

export default function EditorComponent() {
  const editor = useSettingsStore(useShallow((state) => state.editor))

  const handleChange = (value: Editor) => {
    useSettingsStore.setState({ editor: value })
  }

  return (
    <section className="space-y-2">
      <h2 id="select-editor">Editor</h2>
      <div className="rounded border p-4">
        <RadioGroup className="grid-cols-3" value={editor} onValueChange={handleChange}>
          {editors.map((editor) => (
            <label
              key={editor.id}
              className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[:focus-visible]:outline-ring/70 text-muted-foreground/60 has-[[data-state=checked]]:text-foreground relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-transparent px-2 py-3 text-center outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2"
            >
              <RadioGroupItem className="sr-only after:absolute after:inset-0" id={editor.id} value={editor.value} />
              <Image alt={editor.label} height={48} src={editor.image} width={48} />
              <p className="text-xs font-medium leading-none">{editor.label}</p>
            </label>
          ))}
        </RadioGroup>
      </div>
    </section>
  )
}
