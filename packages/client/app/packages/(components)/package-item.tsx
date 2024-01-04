import { type Package } from '@next-devtools/shared'
import Link from 'next/link'
import useSWR from 'swr'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useRPCClient } from '@/app/client'

interface Props {
  data: Package
}
export default function PackageItem({ data }: Props) {
  const rpcClient = useRPCClient()
  const npmBase = 'https://www.npmjs.com/package/'
  const { data: packageInfo, isLoading } = useSWR(`getPackageInfo/${data.name}`, data ? () => rpcClient.current?.getPackageInfo.query(data.name) : null)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="grid grid-cols-[1fr_80px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>
            {
              !data.name
                ? <Skeleton className="h-4" />
                : (
                  <Link
                    className="hover:underline"
                    href={npmBase + data.name}
                    target="_blank"
                  >
                    {data.name}
                  </Link>
                  )
              }
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {
              isLoading
                ? <Skeleton className="h-4" />
                : packageInfo?.description
            }
          </CardDescription>
        </div>
        <div>
          {
            isLoading
              ? <Skeleton className="w-full h-8" />
              : (
                <Link
                  aria-label="Star on GitHub"
                  className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'px-3 w-full')}
                  href={packageInfo?.repository?.url ?? ''}
                  target="_blank"
                >
                  <i className="w-4 h-4 mr-2 i-ri-star-line" />
                  Star
                </Link>
                )
          }
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {
            isLoading
              ? <Skeleton className="w-full h-4" />
              : packageInfo?.homepage
                ? (
                  <Link
                    className="flex items-center text-sm truncate text-muted-foreground hover:underline"
                    href={packageInfo?.homepage}
                    target="_blank"
                  >
                    <i className="w-4 h-4 mr-2 i-ri-link" />
                    {packageInfo?.homepage}
                  </Link>
                  )
                : null
          }
          {
            isLoading
              ? <Skeleton className="w-full h-4" />
              : packageInfo?.repository?.url
                ? (
                  <Link
                    className="flex items-center text-sm truncate text-muted-foreground hover:underline"
                    href={packageInfo?.repository?.url}
                    target="_blank"
                  >
                    <i className="w-4 h-4 mr-2 i-ri-github-fill" />
                    {packageInfo?.repository?.url}
                  </Link>
                  )
                : null
          }
          {
            isLoading
              ? <Skeleton className="w-full h-4" />
              : packageInfo?.license
                ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <i className="w-4 h-4 mr-2 i-ri-scales-3-line" />
                    {packageInfo?.license.name || packageInfo?.license}
                  </div>
                  )
                : null
          }
          {
            isLoading
              ? <Skeleton className="w-full h-4" />
              : packageInfo?.language
                ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <i className="w-4 h-4 mr-2 i-ri-circle-line fill-sky-400 text-sky-400" />
                    {packageInfo?.language}
                  </div>
                  )
                : null
          }
        </div>
      </CardContent>
    </Card>
  )
}
