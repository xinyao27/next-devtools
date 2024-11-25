'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import useConnect from '@/hooks/use-connect'
import { useSettingsStore } from '@/store/settings'

export default function Page() {
  const router = useRouter()
  const connected = useConnect()

  React.useEffect(() => {
    if (connected) {
      useSettingsStore.getState().setup()

      if (document.visibilityState === 'visible') {
        router.replace('/overview')
      }
    }
  }, [connected])

  return null
}
