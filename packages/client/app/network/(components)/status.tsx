import { cn } from '@/lib/utils'

interface StatusProps {
  className?: string

  status: number
}

export default function Status({ className, status }: StatusProps) {
  return (
    <div
      className={cn(
        {
          'text-green-500': status >= 200 && status < 300,
          'text-yellow-500': status >= 300 && status < 400,
          'text-red-500': status >= 400,
        },
        className,
      )}
    >
      {status}
    </div>
  )
}
