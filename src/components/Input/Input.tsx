import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export type InputProps = ComponentProps<'input'>

export const Input = ({ className, ...props }: InputProps) => (
	<BaseInput className={cn('input', className)} {...props} />
)
