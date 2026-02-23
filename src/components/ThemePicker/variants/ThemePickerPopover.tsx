'use client'

import { useNativePopover, useTheme } from '@/hooks'
import { cn } from '@/utils'
import { useState } from 'react'
import { LuPalette } from 'react-icons/lu'
import { Input } from '../..'
import type { ThemePickerPopoverProps } from '../ThemePicker.types'
import { filterThemes } from '../ThemePicker.utils'

export const ThemePickerPopover = ({
	className,
	trigger,
	showSearch = true,
	position = 'bottom center',
	classNames,
}: ThemePickerPopoverProps) => {
	const { theme, systemTheme, setTheme, themes } = useTheme()
	const [search, setSearch] = useState('')
	const { triggerProps, contentProps } = useNativePopover({ position })

	const filteredThemes = showSearch ? filterThemes(themes, search) : themes

	return (
		<>
			<button type='button' className={cn('btn btn-square btn-ghost', className)} {...triggerProps}>
				{trigger ?? <LuPalette />}
			</button>

			<div
				{...contentProps}
				className={cn('dropdown shadow p-2 border border-current/20 rounded-box frosted-glass', classNames?.popover)}
			>
				<div className={cn('grid gap-2 grid-rows-[auto_1fr] overflow-hidden content-start', classNames?.content)}>
					{showSearch && (
						<Input
							type='search'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={cn('input-sm min-w-32', classNames?.search)}
						/>
					)}

					{filteredThemes.length > 0 && (
						<div className={cn('grid gap-2 max-h-60 p-2 overflow-fade no-scrollbar', classNames?.list)}>
							{filteredThemes.map((themeName) => (
								<button
									key={themeName}
									type='button'
									data-theme={themeName === 'system' ? systemTheme : themeName}
									className={cn('btn btn-wide btn-sm', { outline: theme === themeName }, classNames?.button)}
									onClick={() => setTheme(themeName)}
								>
									{themeName}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
