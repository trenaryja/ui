import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export type RangeProps = Omit<ComponentProps<'input'>, 'type'>

export const Range = ({ className, ...props }: RangeProps) => (
	<BaseInput type='range' className={cn('range', className)} {...props} />
)
