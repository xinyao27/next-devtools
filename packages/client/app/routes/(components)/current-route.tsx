import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { getQueryClient, useMessageClient } from '@/lib/client'

export default function CurrentRoute() {
  const messageClient = useMessageClient()
  const { data } = useQuery({
    queryKey: ['getRoute'],
    queryFn: () => messageClient.getRoute(),
  })
  const [currentRoute, setCurrentRoute] = React.useState(data || '')

  const handleNavigate = (route: string) => {
    messageClient.pushRoute(route)
    setTimeout(() => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: ['getRoute'] })
    }, 300)
  }

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
            handleNavigate(currentRoute)
          }
        }}
      />
      <div className="text-sm opacity-50">Edit path above to navigate</div>
    </div>
  )
}
