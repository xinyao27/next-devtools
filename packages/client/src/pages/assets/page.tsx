'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '@/lib/client'

import AllAssets from './(components)/all-assets'

export default function Page() {
  const { data } = useQuery({
    queryFn: () => rpcClient.getStaticAssets(),
    queryKey: ['getStaticAssets'],
  })
  const { element, filteredData } = useSearchElement(data, (item, searchText) =>
    item?.file?.toLowerCase().includes(searchText.toLowerCase()),
  )

  return (
    <div>
      {element}

      {filteredData.length > 0 && <AllAssets data={filteredData} />}
    </div>
  )
}
