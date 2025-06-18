import type { VariantProps } from 'class-variance-authority'

// Copy Pasta from: https://github.com/sadmann7/shadcn-table/blob/main/src/components/kbd.tsx#L54
import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const kbdVariants = cva(
  'select-none rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal font-mono shadow-sm disabled:opacity-50',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground',
        outline: 'bg-background text-foreground',
      },
    },
  },
)

export interface KbdProps extends React.ComponentPropsWithoutRef<'kbd'>, VariantProps<typeof kbdVariants> {
  /**
   * The title of the `abbr` element inside the `kbd` element.
   * @default undefined
   * @type string | undefined
   * @example title="Command"
   */
  abbrTitle?: string
}

const Kbd = React.forwardRef<HTMLUnknownElement, KbdProps>(
  ({ abbrTitle, children, className, variant, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ className, variant }))}
        ref={ref}
        {...props}
      >
        {abbrTitle ? (
          <abbr
            className="no-underline"
            title={abbrTitle}
          >
            {children}
          </abbr>
        ) : (
          children
        )}
      </kbd>
    )
  },
)
Kbd.displayName = 'Kbd'

export { Kbd }
