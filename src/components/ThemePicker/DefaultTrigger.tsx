import type { ComponentProps } from 'react'
import { cn } from '@/utils'
import { FaPalette } from 'react-icons/fa6'

export const DefaultTrigger = ({ className, ...props }: ComponentProps<'button'>) => (
	<button type='button' className={cn('btn btn-square btn-ghost', className)} {...props}>
		<FaPalette />
	</button>
)
