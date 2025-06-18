import type { Asset } from '@next-devtools/shared/types'

import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { rpcClient } from '@/lib/client'

interface AssetProps {
  data: Asset
}
export default function AssetsImage({ data }: AssetProps) {
  const { data: assetInfo, isLoading } = useQuery({
    queryFn: () => rpcClient.getStaticAssetInfo(data.filePath),
    queryKey: ['getStaticAssetInfo', data.filePath],
  })

  return isLoading ? (
    <Skeleton style={{ height: 32, width: 32 }} />
  ) : (
    <img
      alt={data.file}
      height={32}
      src={assetInfo!}
      width={32}
    />
  )
}
