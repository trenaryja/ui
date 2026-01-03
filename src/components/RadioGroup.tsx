import { cn } from '@/utils'
import { useUncontrolled } from '@mantine/hooks'
import type { ChangeEvent } from 'react'
import { useId } from 'react'
import { Field, Radio } from '.'

export type RadioOption =
	| string
	| {
			label?: string
			disabled?: boolean
			value: string
	  }

export type RadioGroupProps = Omit<React.ComponentProps<'input'>, 'children' | 'defaultValue' | 'type' | 'value'> & {
	options: RadioOption[]
	value?: string
	defaultValue?: string
}

const normalizeOption = (option: RadioOption) =>
	typeof option === 'string' ? { value: option, label: option } : { ...option, label: option.label ?? option.value }

export const RadioGroup = ({
	name: nameProp,
	value: valueProp,
	defaultValue: defaultValueProp,
	options,
	className,
	disabled,
	readOnly,
	onChange,
	...inputProps
}: RadioGroupProps) => {
	const fallbackName = useId()
	const name = nameProp ?? `radio-${fallbackName}`
	const shouldControl = valueProp !== undefined
	const [value, setValue] = useUncontrolled<string | undefined>({
		value: valueProp,
		defaultValue: defaultValueProp,
		finalValue: undefined,
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setValue(newValue)
		onChange?.(e)
	}

	return (
		<fieldset disabled={disabled} className={cn('flex gap-2', className)}>
			{options.map((option) => {
				const { value: optValue, label, disabled: optDisabled } = normalizeOption(option)

				return (
					<Field key={optValue} label={label} labelPlacement='right-center'>
						<Radio
							name={name}
							value={optValue}
							onChange={handleChange}
							disabled={optDisabled}
							readOnly={readOnly}
							{...inputProps}
							{...(shouldControl && { checked: value === optValue })}
						/>
					</Field>
				)
			})}
		</fieldset>
	)
}

// TODO: add stories file (including join/btn.join-item example)
// TODO: allowDeselect prop
