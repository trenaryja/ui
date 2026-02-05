import { cn, isIn } from '@/utils'
import type { ComponentProps } from 'react'

export const BaseInput = ({ autoFocus, className, readOnly, tabIndex, ...props }: ComponentProps<'input'>) => (
	<input
		autoFocus={autoFocus}
		{...(autoFocus && { autofocus: '' })} // Also set HTML attribute for native dialog autofocus detection
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
