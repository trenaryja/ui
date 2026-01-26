import { useUncontrolled } from '@mantine/hooks'
import type { ChangeEvent } from 'react'
import { useId, useMemo } from 'react'

export type RadioOption =
	| string
	| {
			label?: string
			disabled?: boolean
			value: string
	  }

export type NormalizedRadioOption = {
	value: string
	label: string
	disabled?: boolean
}

type UseRadioGroupParams = {
	name?: string
	value?: string
	defaultValue?: string
	options: RadioOption[]
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const normalizeOption = (option: RadioOption): NormalizedRadioOption =>
	typeof option === 'string' ? { value: option, label: option } : { ...option, label: option.label ?? option.value }

export const useRadioGroup = ({
	name: nameProp,
	value: valueProp,
	defaultValue,
	options: optionsProp,
	onChange,
}: UseRadioGroupParams) => {
	const fallbackName = useId()
	const name = nameProp ?? `radio-${fallbackName}`

	const [value, setValue] = useUncontrolled<string | undefined>({
		value: valueProp,
		defaultValue,
		finalValue: undefined,
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		onChange?.(e)
	}

	const options = useMemo(() => optionsProp.map(normalizeOption), [optionsProp])

	return { name, value, options, handleChange }
}
