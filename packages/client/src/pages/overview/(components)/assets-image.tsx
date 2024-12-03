import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { rpcClient } from '@/lib/client'
import type { Asset } from '@next-devtools/shared/types'

interface AssetProps {
  data: Asset
}
export default function AssetsImage({ data }: AssetProps) {
  const { data: assetInfo, isLoading } = useQuery({
    queryKey: ['getStaticAssetInfo', data.filePath],
    queryFn: () => rpcClient.getStaticAssetInfo(data.filePath),
  })

  return isLoading ? (
    <Skeleton style={{ width: 32, height: 32 }} />
  ) : (
    <img alt={data.file} height={32} src={assetInfo!} width={32} />
  )
}
