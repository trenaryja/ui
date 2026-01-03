import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export const Select = ({
	className,
	readOnly,
	tabIndex,
	...props
}: ComponentProps<'select'> & { readOnly?: boolean }) => (
	<select
		className={cn('select', { 'pointer-events-none bg-none': readOnly }, className)}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)

// TODO: add stories file
// TODO: options prop for simplification of children (make mutually exclusive of children, or no?)
// TODO: allowDeselect
// TODO: allowSearch
