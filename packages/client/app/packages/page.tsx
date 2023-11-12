'use client'

import React from 'react'
import useSWR from 'swr'
import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '../client'
import AllPackages from './(components)/all-packages'

export default function Page() {
  const { data } = useSWR('getPackages', () => rpcClient.getPackages.query())
  const { element, filteredData } = useSearchElement(data, (item, searchText) => item?.name?.toLowerCase().includes(searchText.toLowerCase()))

  return (
    <div>
      {element}

      {
        filteredData.length > 0 && (
          <AllPackages data={filteredData} />
        )
      }
    </div>
  )
}
