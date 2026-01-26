import { cn } from '@/utils'
import type { ComponentProps } from 'react'

export type TextAreaProps = ComponentProps<'textarea'>

export const TextArea = ({ className, readOnly, tabIndex, ...props }: ComponentProps<'textarea'>) => (
	<textarea
		className={cn(
			'textarea max-h-40 w-80 resize-none field-sizing-content',
			readOnly && 'caret-transparent outline-none',
			className,
		)}
		readOnly={readOnly}
		tabIndex={(tabIndex ?? readOnly) ? -1 : undefined}
		{...props}
	/>
)
