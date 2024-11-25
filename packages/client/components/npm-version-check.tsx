import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/client'
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
  const router = useRouter()
  const { data } = api.checkPackageVersion.useQuery({ name: packageName, current: version })
  const { mutateAsync: updatePackageVersion } = api.updatePackageVersion.useMutation()

  async function handleUpdate() {
    if (data?.isOutdated) {
      await updatePackageVersion({ name: packageName, options })
      toast(`Package ${packageName} is updating...`, {
        description: 'You can jump to the terminal page to check the update progress.',
        action: {
          label: 'Navigate',
          onClick: () => router.push('/terminal'),
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
