import { useMount } from 'react-use'
import { useSettingsStore } from '@/store/settings'

export default function Initial() {
  useMount(() => {
    useSettingsStore.getState().setup()
  })
  return <div className="i-ri-search-line hidden" />
}
