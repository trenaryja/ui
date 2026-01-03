import { cn, isIn } from '@/utils'
import type { ComponentProps } from 'react'

const BaseInput = ({ className, readOnly, tabIndex, ...props }: ComponentProps<'input'>) => (
	<input
		className={cn(
			{
				'pointer-events-none cursor-default': readOnly && isIn(props.type, ['checkbox', 'toggle', 'range', 'radio']),
			},
			className,
		)}
		readOnly={readOnly}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput className={cn('input', className)} {...props} />
)

export const Checkbox = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='checkbox' className={cn('checkbox', className)} {...props} />
)

export const Toggle = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='checkbox' className={cn('toggle', className)} {...props} />
)

export const Range = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='range' className={cn('range', className)} {...props} />
)

export const Radio = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='radio' className={cn('radio', className)} {...props} />
)

// TODO: add stories file
