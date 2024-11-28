'use client'

import { useEffect } from 'react'
import { diffApply } from '@next-devtools/shared/utils'
import { useShallow } from 'zustand/react/shallow'
import { useLatest } from 'react-use'
import { api } from '@/lib/client'
import { useNetworkStore } from '@/store/network'

export default function Initial() {
  // network
  const data = useNetworkStore(useShallow((state) => state.requests))
  const dataLatest = useLatest(data)
  const setData = useNetworkStore((state) => state.set)

  const { data: initialNetworkRequests } = api.getNetworkRequests.useQuery()
  useEffect(() => {
    if (initialNetworkRequests) {
      setData(initialNetworkRequests)
    }
  }, [initialNetworkRequests])

  api.onNetworkUpdate.useSubscription(undefined, {
    onData: (differences) => {
      const current = dataLatest.current
      const newData = diffApply(current, differences)
      setData(newData)
    },
  })

  return <div className="hidden" />
}
