'use client'

import React from 'react'
import { useNavigate } from 'react-router'

import useConnect from '@/hooks/use-connect'

export default function Page() {
  const navigate = useNavigate()
  const connected = useConnect()

  React.useEffect(() => {
    if (connected) {
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
