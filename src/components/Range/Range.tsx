import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { BaseInput } from '../BaseInput/BaseInput'

export const Range = ({ className, ...props }: ComponentProps<'input'>) => (
	<BaseInput type='range' className={cn('range', className)} {...props} />
)
