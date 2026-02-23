import type { ClassNames } from '@/types'
import { cn } from '@/utils'
import type { ComponentProps, ReactNode } from 'react'

export type FieldsetProps = ClassNames<'legend'> &
	ComponentProps<'fieldset'> & {
		legend?: ReactNode
	}

export const Fieldset = ({ legend, children, className, classNames, ...props }: FieldsetProps) => (
	<fieldset className={cn('fieldset', className)} {...props}>
		{legend && <legend className={cn('fieldset-legend', classNames?.legend)}>{legend}</legend>}
		{children}
	</fieldset>
)
