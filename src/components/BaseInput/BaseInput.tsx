import { cn, isIn } from '@/utils'
import type { ComponentProps } from 'react'

export const BaseInput = ({ className, readOnly, tabIndex, ...props }: ComponentProps<'input'>) => (
	<input
		className={cn(
			readOnly && {
				'pointer-events-none cursor-default': isIn(props.type, ['checkbox', 'toggle', 'range', 'radio']),
				'caret-transparent outline-none': !isIn(props.type, ['checkbox', 'toggle', 'range', 'radio']),
			},
			className,
		)}
		readOnly={readOnly}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)
