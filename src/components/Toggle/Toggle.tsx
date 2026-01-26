import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export const Toggle = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='checkbox' className={cn('toggle', className)} {...props} />
)
