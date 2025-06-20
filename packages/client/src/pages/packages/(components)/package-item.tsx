import type { Package } from '@next-devtools/shared/types'

import { useQuery } from '@tanstack/react-query'

import NpmVersionCheck from '@/components/npm-version-check'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { rpcClient } from '@/lib/client'
import { cn } from '@/lib/utils'

interface Props {
  data: Package
}
export default function PackageItem({ data }: Props) {
  const npmBase = 'https://www.npmjs.com/package/'
  const { data: packageInfo, isLoading } = useQuery({
    queryFn: () => rpcClient.getPackageInfo(data.name),
    queryKey: ['getPackageInfo', data.name],
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="grid grid-cols-[1fr_80px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>
            {!data.name ? (
              <Skeleton className="h-4" />
            ) : (
              <a
                className="hover:underline"
                href={npmBase + data.name}
                target="_blank"
              >
                {data.name}
              </a>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {isLoading ? <Skeleton className="h-4" /> : packageInfo?.description}
          </CardDescription>
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <a
              aria-label="Star on GitHub"
              className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'w-full px-3')}
              href={packageInfo?.repository?.url ?? ''}
              target="_blank"
            >
              <i className="i-ri-star-line mr-2 size-4" />
              Star
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center truncate text-sm">
            <i className="i-ri-box-3-line mr-2 size-4 flex-none" />
            <NpmVersionCheck
              options={{ dev: data.type === 'devDependencies' }}
              packageName={data.name}
              showVersionPrefix={false}
              version={data.version}
            />
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : packageInfo?.homepage ? (
            <a
              className="text-muted-foreground flex items-center truncate text-sm hover:underline"
              href={packageInfo?.homepage}
              target="_blank"
            >
              <i className="i-ri-link mr-2 size-4 flex-none" />
              {packageInfo?.homepage}
            </a>
          ) : null}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : packageInfo?.repository?.url ? (
            <a
              className="text-muted-foreground flex items-center truncate text-sm hover:underline"
              href={packageInfo?.repository?.url}
              target="_blank"
            >
              <i className="i-ri-github-fill mr-2 size-4 flex-none" />
              {packageInfo?.repository?.url}
            </a>
          ) : null}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : packageInfo?.license ? (
            <div className="text-muted-foreground flex items-center text-sm">
              <i className="i-ri-scales-3-line mr-2 size-4 flex-none" />
              {packageInfo?.license.name || packageInfo?.license}
            </div>
          ) : null}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : packageInfo?.language ? (
            <div className="text-muted-foreground flex items-center text-sm">
              <i className="i-ri-circle-line mr-2 size-4 fill-sky-400 text-sky-400" />
              {packageInfo?.language}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
