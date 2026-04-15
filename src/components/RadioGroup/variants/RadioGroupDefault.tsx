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
	classNames,
	disabled,
	readOnly,
	onChange,
	allowDeselect,
	...inputProps
}: RadioGroupDefaultProps) => {
	const { name, value, options, handleChange, handleClick, handleKeyDown } = useRadioGroup({
		name: nameProp,
		value: valueProp,
		defaultValue,
		options: optionsProp,
		onChange,
		allowDeselect,
	})

	return (
		<fieldset disabled={disabled} className={cn(classNames?.container ?? 'flex gap-2', className)}>
			{options.map((option) => (
				<Field key={option.value} label={option.label} labelPlacement='right-center' className={classNames?.item}>
					<Radio
						name={name}
						value={option.value}
						onChange={handleChange}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
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
