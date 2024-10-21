import useSWR from 'swr'
import { useRPCClient } from '@/lib/client'
import { Badge } from './ui/badge'

interface NpmVersionCheckProps {
  packageName: string
  version?: string
  showVersion?: boolean
  showVersionPrefix?: boolean
}
export default function NpmVersionCheck({
  packageName,
  version,
  showVersion = true,
  showVersionPrefix = true,
}: NpmVersionCheckProps) {
  const rpcClient = useRPCClient()
  const { data } = useSWR(
    `checkPackageVersion/${packageName}@${version}`,
    () => rpcClient.current?.checkPackageVersion.query({ name: packageName, current: version }),
  )

  return (
    <span className="inline-flex gap-2">
      {showVersion ? (
        <code>
          {showVersionPrefix ? 'v' : ''}
          {version || data?.current}
        </code>
      ) : null}
      {data?.latest ? <Badge variant="secondary">{data.isOutdated ? 'updates available' : 'latest'}</Badge> : null}
    </span>
  )
}
