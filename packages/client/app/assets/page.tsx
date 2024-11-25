'use client'

import React from 'react'
import useSearchElement from '@/hooks/use-search-element'
import { api } from '@/lib/client'
import AllAssets from './(components)/all-assets'

export default function Page() {
  const { data } = api.getStaticAssets.useQuery()
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
