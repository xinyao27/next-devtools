import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { rpcClient } from '@/lib/client'

import { Badge } from './ui/badge'

interface NpmVersionCheckProps {
  options?: any
  packageName: string
  showVersion?: boolean
  showVersionPrefix?: boolean
  version?: string
}
export default function NpmVersionCheck({
  options,
  packageName,
  showVersion = true,
  showVersionPrefix = true,
  version,
}: NpmVersionCheckProps) {
  const navigate = useNavigate()
  const { data } = useQuery({
    queryFn: () => rpcClient.checkPackageVersion(packageName, version),
    queryKey: ['checkPackageVersion', packageName, version],
  })

  async function handleUpdate() {
    if (data?.isOutdated) {
      await rpcClient.updatePackageVersion(packageName, options)
      toast(`Package ${packageName} is updating...`, {
        action: {
          label: 'Navigate',
          onClick: () => navigate('/terminal'),
        },
        description: 'You can jump to the terminal page to check the update progress.',
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
        <Badge
          className="cursor-pointer"
          onClick={handleUpdate}
          variant="secondary"
        >
          {data.isOutdated ? 'updates available' : 'latest'}
        </Badge>
      ) : null}
    </span>
  )
}
