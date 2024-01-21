import * as AccordionPrimitive from '@radix-ui/react-accordion'
import React from 'react'
import { cn } from '../utils'

export const ImageAccordion = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root className={cn('grid gap-2', className)} {...props} />
)

ImageAccordion.Item = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item> & { src: string },
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & { src: string }
>(({ src, style, className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    style={{ backgroundImage: `url('${src}')`, ...style }}
    className={cn('rounded bg-no-repeat bg-cover bg-center ', className)}
    {...props}
  />
))

ImageAccordion.Toggle = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn('select-none transition-transform duration-200 accordion-toggle px-2', className)}
    >
      {children || '▼'}
    </div>
  ),
)

ImageAccordion.Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    showToggle?: boolean
    toggleContent?: React.ReactNode
  }
>(({ toggleContent, showToggle = true, className, children, ...props }, ref) => (
  <AccordionPrimitive.Header asChild>
    <AccordionPrimitive.Trigger
      ref={ref}
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
))

ImageAccordion.Content = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  />
))
