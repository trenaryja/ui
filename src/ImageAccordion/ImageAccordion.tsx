import * as AccordionPrimitive from '@radix-ui/react-accordion'
import React from 'react'

export const ImageAccordion = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root className={'grid gap-2 ' + className} {...props} />
)

ImageAccordion.AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item> & { src: string },
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & { src: string }
>(({ src, style, className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    style={{ backgroundImage: `url('${src}')`, ...style }}
    className={`rounded ` + className}
    {...props}
  />
))

ImageAccordion.AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={
        'flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>p.trigger]:rotate-180 bg-no-repeat bg-center bg-cover ' +
        className
      }
      {...props}
    >
      {children}
      <p className='select-none transition-transform duration-200 trigger px-2'>▼</p>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))

ImageAccordion.AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    {...props}
  >
    <div className={'pb-4 pt-0 ' + className}>{children}</div>
  </AccordionPrimitive.Content>
))
