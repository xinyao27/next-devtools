import React from 'react'
import useSWR from 'swr'
import { Input } from '@/components/ui/input'
import { useMessageClient } from '@/lib/client'

export default function CurrentRoute() {
  const messageClient = useMessageClient()
  const { data, mutate } = useSWR('getRoute', () => messageClient.getRoute())
  const [currentRoute, setCurrentRoute] = React.useState(data || '')
  React.useEffect(() => {
    if (data) setCurrentRoute(data)
  }, [data])

  return (
    <div className="space-y-1 border-b p-4">
      <div>
        {data === currentRoute ? (
          <span className="opacity-50">Current Route</span>
        ) : (
          <div>
            <span className="opacity-50">Navigate from</span> <span>{data}</span> <span className="opacity-50">to</span>
          </div>
        )}
      </div>
      <Input
        value={currentRoute}
        onChange={(e) => setCurrentRoute(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            messageClient.pushRoute(currentRoute)
            setTimeout(() => {
              mutate()
            }, 300)
          }
        }}
      />
      <div className="text-sm opacity-50">Edit path above to navigate</div>
    </div>
  )
}
