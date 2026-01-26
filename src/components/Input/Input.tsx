import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput className={cn('input', className)} {...props} />
)
