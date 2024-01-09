'use client'

import React from 'react'
import useSWR from 'swr'
import useSearchElement from '@/hooks/use-search-element'
import { useRPCClient } from '@/lib/client'
import AllComponents from './(components)/all-components'

export default function Page() {
  const rpcClient = useRPCClient()
  const { data } = useSWR('getComponents', () => rpcClient.current?.getComponents.query())
  const { element, filteredData } = useSearchElement(data, (item, searchText) => {
    if (!item || !item.displayName) return false
    return item.displayName.toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div>
      {element}

      {filteredData.length > 0 && <AllComponents data={filteredData} />}
    </div>
  )
}
