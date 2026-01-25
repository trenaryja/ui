'use client'

import { useTheme } from '@/hooks'
import { cn } from '@/utils'
import { useState } from 'react'
import { Modal } from '../../Modal/Modal'
import { DefaultTrigger } from '../DefaultTrigger'
import type { ThemePickerModalProps } from '../ThemePicker.types'
import { filterThemes } from '../ThemePicker.utils'

export const ThemePickerModal = ({
	className,
	trigger,
	modalProps,
	showSearch = true,
	classNames,
}: ThemePickerModalProps) => {
	const { theme, systemTheme, setTheme, themes } = useTheme()
	const [search, setSearch] = useState('')
	const filteredThemes = filterThemes(themes, search)

	return (
		<Modal
			trigger={trigger || <DefaultTrigger className={classNames?.defaultTrigger} />}
			className={className}
			classNames={{ box: 'grid gap-2', ...modalProps?.classNames }}
			dismissOptions={['escapeKey', 'outsideClick']}
			{...modalProps}
		>
			{showSearch && (
				<input
					type='search'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={cn('input input-sm w-full', classNames?.search)}
				/>
			)}

			{filteredThemes.length > 0 && (
				<div className={cn('max-h-[50dvh] p-2 overflow-fade no-scrollbar grid grid-cols-3 gap-2', classNames?.list)}>
					{filteredThemes.map((themeName) => (
						<button
							key={themeName}
							type='button'
							data-theme={themeName === 'system' ? systemTheme : themeName}
							className={cn('surface cursor-pointer p-2', { outline: theme === themeName }, classNames?.button)}
							onClick={() => setTheme(themeName)}
						>
							<span>{themeName}</span>
							<div className='flex flex-wrap *:size-4 justify-center gap-1'>
								<p title='base-100' className='bg-base-100 rounded-box' />
								<p title='base-200' className='bg-base-200 rounded-box' />
								<p title='base-300' className='bg-base-300 rounded-box' />
								<p title='primary' className='bg-primary rounded-box' />
								<p title='secondary' className='bg-secondary rounded-box' />
								<p title='accent' className='bg-accent rounded-box' />
							</div>
						</button>
					))}
				</div>
			)}
		</Modal>
	)
}
