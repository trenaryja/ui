import { useRadioGroup } from '@/hooks'
import { cn } from '@/utils'
import { Field } from '../../Field/Field'
import { Radio } from '../../Radio/Radio'
import type { RadioGroupDefaultProps } from '../RadioGroup.types'

export const RadioGroupDefault = ({
	name: nameProp,
	value: valueProp,
	defaultValue,
	options: optionsProp,
	className,
	disabled,
	readOnly,
	onChange,
	...inputProps
}: RadioGroupDefaultProps) => {
	const { name, value, options, handleChange } = useRadioGroup({
		name: nameProp,
		value: valueProp,
		defaultValue,
		options: optionsProp,
		onChange,
	})

	return (
		<fieldset disabled={disabled} className={cn('flex gap-2', className)}>
			{options.map((option) => (
				<Field key={option.value} label={option.label} labelPlacement='right-center'>
					<Radio
						name={name}
						value={option.value}
						onChange={handleChange}
						disabled={option.disabled}
						readOnly={readOnly}
						checked={value === option.value}
						{...inputProps}
					/>
				</Field>
			))}
		</fieldset>
	)
}

// TODO: remove field wrapper in favor of readOnlyLabelWrapper
