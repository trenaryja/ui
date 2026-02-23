import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export type ToggleProps = Omit<ComponentProps<'input'>, 'type'>

export const Toggle = ({ className, ...props }: ToggleProps) => (
	<BaseInput type='checkbox' className={cn('toggle', className)} {...props} />
)
