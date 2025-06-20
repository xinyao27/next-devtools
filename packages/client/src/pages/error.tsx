import { useNavigate, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CodeBlock from '@/components/ui/code-block'

export default function ErrorPage() {
  const error: any = useRouteError()
  const navigate = useNavigate()
  if (error) console.error(error)

  const handleRetry = () => {
    navigate(0) // 0 for refresh
  }

  return (
    <div
      className="bg-background flex h-full flex-col items-center justify-center gap-2 px-3"
      id="error-page"
    >
      <Card className="min-w-[50vw] max-w-[80vw]">
        <CardHeader>
          <CardTitle>Oops!</CardTitle>
          <CardDescription>Sorry, an unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? <CodeBlock code={error.error?.stack ?? error.error?.message ?? error.toString()} /> : null}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={handleRetry}
            size="sm"
            variant="secondary"
          >
            <i className="i-ri-refresh-line mr-1 size-4" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
