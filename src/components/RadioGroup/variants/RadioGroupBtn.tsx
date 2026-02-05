import { useRadioGroup } from '@/hooks'
import { cn } from '@/utils'
import { Radio } from '../../Radio/Radio'
import type { RadioGroupBtnProps } from '../RadioGroup.types'

export const RadioGroupBtn = ({
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
}: RadioGroupBtnProps) => {
	const { name, value, options, handleChange, handleClick, handleKeyDown } = useRadioGroup({
		name: nameProp,
		value: valueProp,
		defaultValue,
		options: optionsProp,
		onChange,
		allowDeselect,
	})

	return (
		<div className={cn(classNames?.container ?? 'flex gap-2', className)}>
			{options.map((option) => (
				<Radio
					key={option.value}
					variant='btn'
					name={name}
					value={option.value}
					aria-label={option.label}
					onChange={handleChange}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					disabled={disabled ?? option.disabled}
					readOnly={readOnly}
					checked={value === option.value}
					className={classNames?.item}
					{...inputProps}
				/>
			))}
		</div>
	)
}
