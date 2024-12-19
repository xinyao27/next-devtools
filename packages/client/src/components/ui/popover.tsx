'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    showArrow?: boolean
  }
>(({ className, align = 'center', sideOffset = 4, children, showArrow = true, ...props }, ref) => (
  <PopoverPrimitive.Portal
    container={document
      .querySelector('#next-devtools-toolbar')
      ?.shadowRoot?.querySelector('#next-devtools-toolbar-wrapper')}
  >
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'border-input bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] rounded-lg border p-4 shadow-lg shadow-black/5 outline-none',
        className,
      )}
      {...props}
    >
      {children}
      {showArrow ? (
        <PopoverPrimitive.Arrow className="fill-popover -my-px drop-shadow-[0_1px_0_hsl(var(--border))]" />
      ) : null}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
