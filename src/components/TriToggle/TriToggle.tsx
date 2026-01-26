'use client'

import { cn } from '@/utils'
import { useMergedRef, useUncontrolled } from '@mantine/hooks'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import { Toggle } from '../Toggle/Toggle'

export type TriToggleValue = boolean | null | undefined

export type TriToggleProps = Omit<
	ComponentProps<'input'>,
	'checked' | 'defaultChecked' | 'defaultValue' | 'onChange' | 'type' | 'value'
> & {
	value?: TriToggleValue
	defaultValue?: TriToggleValue
	onChange?: (value: TriToggleValue) => void
}

export const TriToggle = ({
	value,
	defaultValue,
	onChange,
	name,
	ref,
	readOnly,
	className,
	...props
}: TriToggleProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const mergedRef = useMergedRef(inputRef, ref)

	const [currentValue, setValue] = useUncontrolled<TriToggleValue>({ value, defaultValue, finalValue: null, onChange })

	const isIndeterminate = currentValue == null

	useEffect(() => {
		if (inputRef.current) inputRef.current.indeterminate = isIndeterminate
	}, [isIndeterminate])

	const handleChange = () => {
		if (readOnly) return
		setValue(isIndeterminate ? true : currentValue ? false : null)
	}

	return (
		<>
			<Toggle
				{...props}
				ref={mergedRef}
				name={isIndeterminate ? undefined : name}
				checked={currentValue === true}
				readOnly={readOnly}
				onChange={handleChange}
				className={cn(isIndeterminate && 'toggle-indeterminate', className)}
			/>
			{name && isIndeterminate && <input type='hidden' name={name} value='' />}
		</>
	)
}
