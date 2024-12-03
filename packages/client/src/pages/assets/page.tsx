'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '@/lib/client'
import AllAssets from './(components)/all-assets'

export default function Page() {
  const { data } = useQuery({
    queryKey: ['getStaticAssets'],
    queryFn: () => rpcClient.getStaticAssets(),
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
