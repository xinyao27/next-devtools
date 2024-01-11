import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'
import { Badge } from './ui/badge'

interface NpmVersionCheckProps {
  packageName: string
  version?: string
  showVersion?: boolean
}
export default function NpmVersionCheck({ packageName, version, showVersion = true }: NpmVersionCheckProps) {
  const rpcClient = useRPCClient()
  const { data, isLoading } = useSWR(
    `checkPackageVersion/${packageName}@${version}`,
    () => rpcClient.current?.checkPackageVersion.query({ name: packageName, current: version }),
  )

  if (isLoading) return null

  return (
    <span className="inline-flex gap-2">
      {showVersion ? <code>v{data?.current}</code> : null}
      {data?.latest ? <Badge variant="secondary">{data.isOutdated ? 'updates availabel' : 'latest'}</Badge> : null}
    </span>
  )
}
