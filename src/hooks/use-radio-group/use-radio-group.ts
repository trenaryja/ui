import { useUncontrolled } from '@mantine/hooks'
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react'
import { useId } from 'react'

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
	/** Allow clicking a selected radio to deselect it */
	allowDeselect?: boolean
}

const normalizeOption = (option: RadioOption): NormalizedRadioOption =>
	typeof option === 'string' ? { value: option, label: option } : { ...option, label: option.label ?? option.value }

export const useRadioGroup = ({
	name: nameProp,
	value: valueProp,
	defaultValue,
	options: optionsProp,
	onChange,
	allowDeselect,
}: UseRadioGroupParams) => {
	const fallbackId = useId()
	const name = nameProp ?? `radio-${fallbackId}`

	const [value, setValue] = useUncontrolled<string | undefined>({
		value: valueProp,
		defaultValue,
		finalValue: undefined,
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		onChange?.(e)
	}

	const handleClick = (e: MouseEvent<HTMLInputElement>) => {
		if (allowDeselect && e.currentTarget.value === value) {
			setValue(undefined)
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (allowDeselect && (e.key === ' ' || e.key === 'Enter') && e.currentTarget.value === value) {
			e.preventDefault()
			setValue(undefined)
		}
	}

	const options = optionsProp.map(normalizeOption)

	return { name, value, options, handleChange, handleClick, handleKeyDown }
}
