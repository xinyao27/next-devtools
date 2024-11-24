import React from 'react'
import { Button } from '@/components/ui/button'

export default function Actions() {
  // const handleRefetchData = () => {

  // }

  const handleReloadPage = () => {
    // router.refresh()
    window.location.reload()
  }

  return (
    <section className="space-y-2">
      <h2 id="actions">Actions</h2>
      <div className="rounded border p-4">
        {/* <Button>Refetch Data</Button> */}
        <Button variant="outline" onClick={handleReloadPage}>
          <i className="i-ri-refresh-line mr-2 size-4" />
          Reload Page
        </Button>
      </div>
    </section>
  )
}
