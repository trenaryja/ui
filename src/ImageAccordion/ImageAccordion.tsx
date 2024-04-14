import * as AccordionPrimitive from '@radix-ui/react-accordion'
import React from 'react'
import { cn } from '../utils'

export const ImageAccordion = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root className={cn('grid gap-2', className)} {...props} />
)

ImageAccordion.Item = ({
  src,
  style,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & { src: string }) => (
  <AccordionPrimitive.Item
    style={{ backgroundImage: `url('${src}')`, ...style }}
    className={cn('rounded bg-no-repeat bg-cover bg-center ', className)}
    {...props}
  />
)

ImageAccordion.Toggle = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div {...props} className={cn('select-none transition-transform duration-200 accordion-toggle px-2', className)}>
    {children || '▼'}
  </div>
)

ImageAccordion.Trigger = ({
  toggleContent,
  showToggle = true,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  showToggle?: boolean
  toggleContent?: React.ReactNode
}) => (
  <AccordionPrimitive.Header asChild>
    <AccordionPrimitive.Trigger
      className={cn(
        'w-full flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]_.accordion-toggle]:rotate-180 bg-no-repeat bg-center bg-cover ',
        className,
      )}
      {...props}
    >
      {children}
      {showToggle && <ImageAccordion.Toggle>{toggleContent}</ImageAccordion.Toggle>}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

ImageAccordion.Content = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn(
      'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  />
)
