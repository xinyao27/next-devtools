'use client'

import React from 'react'
import useSearchElement from '@/hooks/use-search-element'
import { api } from '@/lib/client'
import AllPackages from './(components)/all-packages'

export default function Page() {
  const { data } = api.getPackages.useQuery()
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
