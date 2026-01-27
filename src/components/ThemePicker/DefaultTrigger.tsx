import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { LuPalette } from 'react-icons/lu'

export const DefaultTrigger = ({ className, ...props }: ComponentProps<'button'>) => (
	<button type='button' className={cn('btn btn-square btn-ghost', className)} {...props}>
		<LuPalette />
	</button>
)
