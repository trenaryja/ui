import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export type SelectProps = ComponentProps<'select'> & { readOnly?: boolean; nativeDropdown?: boolean }

export const Select = ({ className, readOnly, tabIndex, nativeDropdown, ...props }: SelectProps) => (
	<select
		className={cn('select', { 'pointer-events-none bg-none': readOnly, 'appearance-none': nativeDropdown }, className)}
		tabIndex={readOnly ? -1 : tabIndex}
		{...props}
	/>
)

// TODO: options prop for simplification of children (make mutually exclusive of children, or no?)
// TODO: allowDeselect
// TODO: allowSearch
// TODO: generic/type inference from value/defaultValue
