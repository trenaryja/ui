import type { RadioGroupComponentMap, RadioGroupProps } from './RadioGroup.types'
import { RadioGroupBtn, RadioGroupDefault } from './variants'

export * from './RadioGroup.types'

const VARIANT_COMPONENTS: RadioGroupComponentMap = {
	default: RadioGroupDefault,
	btn: RadioGroupBtn,
}

export const RadioGroup = ({ variant = 'default', ...rest }: RadioGroupProps) => {
	const Component = VARIANT_COMPONENTS[variant]
	return <Component {...rest} />
}
