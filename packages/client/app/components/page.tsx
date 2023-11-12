'use client'

import React from 'react'
import useSWR from 'swr'
import useSearchElement from '@/hooks/use-search-element'
import { rpcClient } from '../client'
import AllComponents from './(components)/all-components'

export default function Page() {
  const { data } = useSWR('getComponents', () => rpcClient.getComponents.query())
  const { element, filteredData } = useSearchElement(data, (item, searchText) => item?.displayName?.toLowerCase().includes(searchText.toLowerCase()))

  return (
    <div>
      {element}

      {
        filteredData.length > 0 && (
          <AllComponents
            data={filteredData}
          />
        )
      }
    </div>
  )
}
