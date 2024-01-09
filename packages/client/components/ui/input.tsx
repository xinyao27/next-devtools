import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, prefix, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex items-center space-x-2 h-9 w-full px-3 py-1 rounded-md border border-input transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-ring',
        { 'cursor-not-allowed opacity-50': props.disabled },
        className,
      )}
    >
      {prefix}
      <input
        ref={ref}
        className="flex-1 w-full h-full rounded-md text-sm bg-transparent outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        type={type}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
