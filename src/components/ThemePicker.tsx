'use client'

import { useTheme } from '@/hooks'
import { cn, daisyThemes } from '@/utils'
import { useMounted } from '@mantine/hooks'
import type { ReactNode } from 'react'
import { FaPalette } from 'react-icons/fa6'

export type ThemePickerProps = {
	className?: string
	trigger?: ReactNode
	classNames?: {
		defaultTrigger?: string
		dropdown?: string
		button?: string
		item?: string
	}
}

export const ThemePicker = ({ className, trigger, classNames }: ThemePickerProps) => {
	const mounted = useMounted()
	const { resolvedTheme, setTheme } = useTheme()

	if (!mounted) return <div className='loading' />

	return (
		<div className={cn('dropdown dropdown-end', className)}>
			{trigger || (
				<button type='button' className={cn('btn btn-square btn-ghost', classNames?.defaultTrigger)}>
					<FaPalette />
				</button>
			)}
			<ul
				tabIndex={0}
				className={cn(
					'dropdown-content overflow-auto max-h-[40dvh] menu grid p-2 gap-2 border border-current/25 rounded-box frosted-glass',
					classNames?.dropdown,
				)}
			>
				{daisyThemes.map((x) => (
					<li key={x.name} data-theme={x.name} className={cn('bg-transparent', classNames?.item)}>
						<button
							type='button'
							className={cn('btn', { 'before:content-["⦿"]': resolvedTheme === x.name }, classNames?.button)}
							onClick={() => setTheme(resolvedTheme === x.name ? 'system' : x.name)}
						>
							{x.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
