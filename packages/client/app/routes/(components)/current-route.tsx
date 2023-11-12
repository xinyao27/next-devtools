import React from 'react'
import useSWR from 'swr'
import { Input } from '@/components/ui/input'
import { messageClient } from '@/app/client'

export default function CurrentRoute() {
  const { data, mutate } = useSWR('getRoute', () => messageClient.getRoute())
  const [currentRoute, setCurrentRoute] = React.useState(data || '')
  React.useEffect(() => {
    if (data) {
      setCurrentRoute(data)
    }
  }, [data])

  return (
    <div className="p-4 space-y-1 border-b">
      <div>
        {
          data === currentRoute
            ? (
              <span className="opacity-50">Current Route</span>
              )
            : (
              <div><span className="opacity-50">Navigate from</span> <span>{data}</span> <span className="opacity-50">to</span></div>
              )
        }
      </div>
      <Input
        value={currentRoute}
        onChange={e => setCurrentRoute(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            messageClient.pushRoute(currentRoute)
            setTimeout(() => {
              mutate()
            }, 300)
          }
        }}
      />
      <div className="opacity-50 text-sm">Edit path above to navigate</div>
    </div>
  )
}
