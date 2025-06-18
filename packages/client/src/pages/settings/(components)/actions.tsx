import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getQueryClient } from '@/lib/client'

export default function Actions() {
  const queryClient = getQueryClient()

  const handleReloadPage = React.useCallback(() => {
    window.location.reload()
  }, [])

  const handleRefetchData = React.useCallback(() => {
    queryClient.invalidateQueries()
    toast.success('Data refetched')
  }, [queryClient])

  return (
    <section className="space-y-2">
      <h2 id="actions">Actions</h2>
      <div className="flex flex-wrap gap-2 rounded border p-4">
        <Button
          onClick={handleReloadPage}
          variant="outline"
        >
          <i className="i-ri-refresh-line mr-2 size-4" />
          Reload Page
        </Button>

        <Button
          onClick={handleRefetchData}
          variant="outline"
        >
          <i className="i-ri-refresh-line mr-2 size-4" />
          Refetch Data
        </Button>
      </div>
    </section>
  )
}
