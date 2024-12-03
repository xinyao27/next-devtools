'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '@/lib/client'
import AllPackages from './(components)/all-packages'

export default function Page() {
  const { data } = useQuery({
    queryKey: ['getPackages'],
    queryFn: () => rpcClient.getPackages(),
  })
  const { element, filteredData } = useSearchElement(data, (item, searchText) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase()),
  )

  return (
    <div>
      {element}

      {filteredData.length > 0 && <AllPackages data={filteredData} />}
    </div>
  )
}
