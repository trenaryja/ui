import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export const Checkbox = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='checkbox' className={cn('checkbox', className)} {...props} />
)
