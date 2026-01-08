import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export const TextArea = ({ className, readOnly, tabIndex, ...props }: ComponentProps<'textarea'>) => (
	<textarea
		className={cn('textarea max-h-40 resize-none field-sizing-content', className)}
		readOnly={readOnly}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)

// TODO: add stories file
// TODO: fix width of parent growing even when Textarea isn't (problem with field-sizing-content?)
