import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/client'
import type { Asset } from '@next-devtools/shared/types/features'

interface AssetProps {
  data: Asset
}
export default function AssetsImage({ data }: AssetProps) {
  const { data: assetInfo, isLoading } = api.getStaticAssetInfo.useQuery(data.filePath)

  return isLoading ? (
    <Skeleton style={{ width: 32, height: 32 }} />
  ) : (
    <Image alt={data.file} height={32} src={assetInfo!} width={32} />
  )
}
