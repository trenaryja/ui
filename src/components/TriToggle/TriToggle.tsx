import { useMergedRef, useUncontrolled } from '@mantine/hooks'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import { Toggle } from '../Toggle/Toggle'
import { serializeTriToggleValue } from './TriToggle.utils'

export type TriToggleValue = boolean | null | undefined

export { parseTriToggleValue, serializeTriToggleValue } from './TriToggle.utils'

export type TriToggleProps = Omit<
	ComponentProps<'input'>,
	'checked' | 'defaultChecked' | 'defaultValue' | 'onChange' | 'type' | 'value'
> & {
	value?: TriToggleValue
	defaultValue?: TriToggleValue
	onChange?: (value: TriToggleValue) => void
	name?: string
	/** When true, prevents returning to null/indeterminate after first interaction */
	required?: boolean
}

export const TriToggle = ({
	value,
	defaultValue,
	onChange,
	name,
	ref,
	readOnly,
	required,
	...props
}: TriToggleProps) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const mergedRef = useMergedRef(inputRef, ref)
	const hasInteractedRef = useRef(false)

	const [currentValue, setValue, isControlled] = useUncontrolled<TriToggleValue>({
		value,
		defaultValue,
		finalValue: null,
		onChange,
	})

	const isEffectivelyReadOnly = readOnly || (isControlled && !onChange)

	const normalizedValue = currentValue === null || currentValue === undefined ? null : currentValue

	useEffect(() => {
		if (inputRef.current) inputRef.current.indeterminate = normalizedValue === null
	}, [normalizedValue])

	const handleChange = () => {
		if (isEffectivelyReadOnly) return
		hasInteractedRef.current = true
		const skipNull = required && hasInteractedRef.current
		const nextValue = normalizedValue === null ? true : normalizedValue === true ? false : skipNull ? true : null
		setValue(nextValue)
	}

	return (
		<>
			<Toggle
				{...props}
				ref={mergedRef}
				checked={normalizedValue === true}
				readOnly={isEffectivelyReadOnly}
				onChange={handleChange}
			/>
			{name && <input type='hidden' name={name} value={serializeTriToggleValue(normalizedValue)} />}
		</>
	)
}
