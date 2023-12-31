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

interface Props {
  data: Package
}
export default function PackageItem({ data }: Props) {
  const npmBase = 'https://www.npmjs.com/package/'
  const { data: packageInfo, isLoading } = useSWR(data ? `/api/packages/${data.name}` : null)

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
                  <i className="i-ri-star-line mr-2 h-4 w-4" />
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
                    className="text-sm text-muted-foreground flex items-center truncate hover:underline"
                    href={packageInfo?.homepage}
                    target="_blank"
                  >
                    <i className="i-ri-link mr-2 h-4 w-4" />
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
                    className="text-sm text-muted-foreground flex items-center truncate hover:underline"
                    href={packageInfo?.repository?.url}
                    target="_blank"
                  >
                    <i className="i-ri-github-fill mr-2 h-4 w-4" />
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
                    <i className="i-ri-scales-3-line mr-2 h-4 w-4" />
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
                    <i className="i-ri-circle-line mr-2 h-4 w-4 fill-sky-400 text-sky-400" />
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
