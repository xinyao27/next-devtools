import React, { useMemo } from 'react'
import { useDebounce } from 'react-use'
import { Input } from '@/components/ui/input'

export default function useSearchElement<T>(data: T[] | undefined, compare: (item: T, searchText: string) => boolean) {
  const [filteredData, setFilteredData] = React.useState<T[]>([])
  const [searchText, setSearchText] = React.useState('')
  useDebounce(
    () => {
      if (searchText) {
        const filtered = data?.filter((item) => compare(item, searchText))
        setFilteredData(filtered ?? [])
      } else {
        setFilteredData(data ?? [])
      }
    },
    200,
    [searchText],
  )

  const element = useMemo(() => {
    return (
      <div className="space-y-1 border-b p-4">
        <Input
          placeholder="Search..."
          prefix={<i className="i-ri-search-line text-muted-foreground h-4 w-4" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="text-sm opacity-50">
          {searchText ? <span>{filteredData.length} matched · </span> : null}
          <span>{data?.length} items in total</span>
        </div>
      </div>
    )
  }, [searchText, filteredData, data])

  return { element, filteredData }
}
