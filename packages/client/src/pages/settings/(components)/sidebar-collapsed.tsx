import { useShallow } from 'zustand/react/shallow'
import { useSettingsStore } from '@/store/settings'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function SideBarCollapsed() {
  const sidebarCollapsed = useSettingsStore(useShallow((state) => state.sidebarCollapsed))
  const setSettings = useSettingsStore((state) => state.setState)
  const handleChange = (value: 'collapsed' | 'expanded') => {
    setSettings({ sidebarCollapsed: value === 'collapsed' })
  }

  return (
    <section className="space-y-2">
      <h2 id="sidebar-collapsed">Sidebar Collapsed</h2>
      <div className="rounded border p-4">
        <ToggleGroup
          className="inline-flex gap-0 -space-x-px rounded shadow-sm shadow-black/5 rtl:space-x-reverse"
          type="single"
          value={sidebarCollapsed ? 'collapsed' : 'expanded'}
          variant="outline"
          onValueChange={handleChange}
        >
          <ToggleGroupItem
            className="rounded-none shadow-none first:rounded-s last:rounded-e focus-visible:z-10"
            value="expanded"
          >
            <i className="i-ri-sidebar-unfold-line mr-1.5 size-6" />
            <span>Expanded</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            className="rounded-none shadow-none first:rounded-s last:rounded-e focus-visible:z-10"
            value="collapsed"
          >
            <i className="i-ri-sidebar-fold-line mr-1.5 size-6" />
            <span>Collapsed</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </section>
  )
}
