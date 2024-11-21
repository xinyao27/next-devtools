import Image from 'next/image'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { useRPCClient } from '@/lib/client'
import type { Asset } from '@next-devtools/shared'

interface AssetProps {
  data: Asset
}
export default function AssetsImage({ data }: AssetProps) {
  const rpcClient = useRPCClient()
  const { data: assetInfo, isLoading } = useSWR(
    `getStaticAssetInfo/${data.filePath}`,
    data ? () => rpcClient?.getStaticAssetInfo.query(data.filePath) : null,
  )

  return isLoading ? (
    <Skeleton style={{ width: 32, height: 32 }} />
  ) : (
    <Image alt={data.file} height={32} src={assetInfo!} width={32} />
  )
}
