import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

export const Checkbox = ({ className, ...props }: CheckboxProps) => (
	<BaseInput type='checkbox' className={cn('checkbox', className)} {...props} />
)
