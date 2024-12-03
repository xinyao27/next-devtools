import { useNavigate, useRouteError } from 'react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/ui/code-block'

export default function ErrorPage() {
  const error: any = useRouteError()
  const navigate = useNavigate()
  if (error) console.error(error)

  const handleRetry = () => {
    navigate(0) // 0 for refresh
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-3" id="error-page">
      <Card className="min-w-[50vw] max-w-[80vw]">
        <CardHeader>
          <CardTitle>Oops!</CardTitle>
          <CardDescription>Sorry, an unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? <CodeBlock>{error.error?.stack ?? error.error?.message ?? error.toString()}</CodeBlock> : null}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleRetry}>
            <i className="i-ri-refresh-line mr-1 size-4" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
