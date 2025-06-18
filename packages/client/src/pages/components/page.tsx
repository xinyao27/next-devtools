'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '@/lib/client'

import AllComponents from './(components)/all-components'

export default function Page() {
  const { data } = useQuery({
    queryFn: () => rpcClient.getComponents(),
    queryKey: ['getComponents'],
  })
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
