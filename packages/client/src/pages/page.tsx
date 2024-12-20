'use client'

import React from 'react'
import { useNavigate } from 'react-router'
import useConnect from '@/hooks/use-connect'
import { useSettingsStore } from '@/store/settings'

export default function Page() {
  const navigate = useNavigate()
  const connected = useConnect()
  const setup = useSettingsStore((state) => state.setup)

  React.useEffect(() => {
    if (connected) {
      setup()

      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          navigate('/overview')
        }
      }, 1000)

      return () => clearInterval(interval)
    }
    return () => {}
  }, [connected])

  return null
}
