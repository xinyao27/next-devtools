'use client'

import React from 'react'
import useSWR from 'swr'
import useSearchElement from '@/hooks/use-search-element'
import { useRPCClient } from '@/lib/client'
import AllComponents from './(components)/all-components'

export default function Page() {
  const rpcClient = useRPCClient()
  const { data } = useSWR('getComponents', () => rpcClient?.getComponents.query())
  const { element, filteredData } = useSearchElement(data, (item, searchText) => {
    if (!item || !item.file) return false
    return item.file.toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div>
      {element}

      {filteredData.length > 0 && <AllComponents data={filteredData} />}
    </div>
  )
}
