'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      {...props}
    />
  )
}

function AccordionContent({ children, className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b last:border-b-0', className)}
      data-slot="accordion-item"
      {...props}
    />
  )
}

function AccordionTrigger({ children, className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>i]:rotate-180',
          className,
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <i className="i-ri-arrow-down-s-line text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
