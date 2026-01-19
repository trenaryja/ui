import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export type ButtonProps = ComponentProps<'button'>

export const Button = ({ className, ...props }: ComponentProps<'button'>) => (
	<button type='button' className={cn('btn', className)} {...props} />
)

// TODO: add story file
