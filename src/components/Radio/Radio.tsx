import { cn } from '@/utils'
import { BaseInput } from '../BaseInput/BaseInput'
import type { RadioProps } from './Radio.types'

export * from './Radio.types'

const VARIANT_CLASSES = {
	default: 'radio',
	btn: 'btn',
} as const

export const Radio = ({ variant = 'default', className, ...props }: RadioProps) => (
	<BaseInput type='radio' className={cn(VARIANT_CLASSES[variant], className)} {...props} />
)
