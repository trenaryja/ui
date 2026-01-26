import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export const Select = ({
	className,
	readOnly,
	tabIndex,
	nativeDropdown,
	...props
}: ComponentProps<'select'> & { readOnly?: boolean; nativeDropdown?: boolean }) => (
	<select
		className={cn('select', { 'pointer-events-none bg-none': readOnly, 'appearance-none': nativeDropdown }, className)}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)

// TODO: options prop for simplification of children (make mutually exclusive of children, or no?)
// TODO: allowDeselect
// TODO: allowSearch
