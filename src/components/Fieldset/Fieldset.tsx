import { cn } from '@/utils'
import type { ComponentProps, ReactNode } from 'react'

export type FieldsetProps = ComponentProps<'fieldset'> & {
	legend?: ReactNode
	legendClassName?: string
}

export const Fieldset = ({ legend, children, className, legendClassName, ...props }: FieldsetProps) => (
	<fieldset className={cn('fieldset', className)} {...props}>
		{legend && <legend className={cn('fieldset-legend', legendClassName)}>{legend}</legend>}
		{children}
	</fieldset>
)

// TODO: add stories file
