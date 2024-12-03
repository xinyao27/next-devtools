import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { rpcClient } from '@/lib/client'
import { Badge } from './ui/badge'

interface NpmVersionCheckProps {
  packageName: string
  version?: string
  showVersion?: boolean
  showVersionPrefix?: boolean
  options?: any
}
export default function NpmVersionCheck({
  packageName,
  version,
  showVersion = true,
  showVersionPrefix = true,
  options,
}: NpmVersionCheckProps) {
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['checkPackageVersion', packageName, version],
    queryFn: () => rpcClient.checkPackageVersion(packageName, version),
  })

  async function handleUpdate() {
    if (data?.isOutdated) {
      await rpcClient.updatePackageVersion(packageName, options)
      toast(`Package ${packageName} is updating...`, {
        description: 'You can jump to the terminal page to check the update progress.',
        action: {
          label: 'Navigate',
          onClick: () => navigate('/terminal'),
        },
      })
    }
  }

  return (
    <span className="inline-flex gap-2">
      {showVersion ? (
        <code>
          {showVersionPrefix ? 'v' : ''}
          {version || data?.current}
        </code>
      ) : null}
      {data?.latest ? (
        <Badge className="cursor-pointer" variant="secondary" onClick={handleUpdate}>
          {data.isOutdated ? 'updates available' : 'latest'}
        </Badge>
      ) : null}
    </span>
  )
}
