import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { Input } from '@/components/ui/input'
import { useNextDevtoolsContent } from '@/hooks/use-next-devtools-context'
import { getQueryClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface CurrentRouteProps {
  actions?: React.ReactNode
  className?: string
}

export default function CurrentRoute({ actions, className }: CurrentRouteProps) {
  const { getRoute, pushRoute } = useNextDevtoolsContent()
  const { data } = useQuery({
    queryFn: () => getRoute(),
    queryKey: ['getRoute'],
  })
  const [currentRoute, setCurrentRoute] = React.useState(data || '')

  const handleNavigate = (route: string) => {
    pushRoute(route)
    setTimeout(() => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({ queryKey: ['getRoute'] })
    }, 300)
  }

  React.useEffect(() => {
    if (data) setCurrentRoute(data)
  }, [data])

  return (
    <div className={cn('space-y-1 border-b p-4', className)}>
      <div>
        {data === currentRoute ? (
          <span className="opacity-50">Current Route</span>
        ) : (
          <div>
            <span className="opacity-50">Navigate from</span> <span>{data}</span> <span className="opacity-50">to</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          onChange={(e) => setCurrentRoute(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNavigate(currentRoute)
            }
          }}
          value={currentRoute}
        />
        {actions}
      </div>
      <div className="text-sm opacity-50">Edit path above to navigate</div>
    </div>
  )
}
