import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function useSearchElement<T>(
  data: T[] | undefined,
  compare: (item: T, searchText: string) => boolean,
  props?: {
    className?: string
  },
) {
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [searchText, setSearchText] = useState('')

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

  useEffect(() => {
    if (data?.length && !searchText) {
      setFilteredData(data ?? [])
    }
  }, [data, searchText])

  const element = useMemo(() => {
    return (
      <div className={cn('space-y-1 border-b p-4', props?.className)}>
        <div className="relative">
          <Input
            className="peer ps-9"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <i className="i-ri-search-line size-4" />
          </div>
        </div>

        <div className="text-sm opacity-50">
          {searchText ? <span>{filteredData.length} matched · </span> : null}
          <span>{data?.length} items in total</span>
        </div>
      </div>
    )
  }, [searchText, filteredData, data])

  return { element, filteredData }
}
