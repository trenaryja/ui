'use client'

import { ThemeProvider, useTheme } from '@/lib/theme'
import type { DemoMeta } from '@demo/utils'
import { ThemePicker } from './ThemePicker'

export const meta: DemoMeta = { title: 'ThemePicker', category: 'components' }

export const Demo = () => {
	const { theme, resolvedTheme, systemTheme } = useTheme()

	return (
		<ThemeProvider>
			<div className='demo'>
				<div className='stats w-full grid-cols-3 *:place-items-center'>
					<div className='stat'>
						<div className='stat-title'>theme</div>
						<div className='stat-value'>{theme}</div>
					</div>
					<div className='stat'>
						<div className='stat-title'>resolved</div>
						<div className='stat-value'>{resolvedTheme}</div>
					</div>
					<div className='stat'>
						<div className='stat-title'>system</div>
						<div className='stat-value'>{systemTheme}</div>
					</div>
				</div>

				<div className='prose grid place-items-center grid-cols-2 gap-10 '>
					<article className='grid place-items-center'>
						<h2>
							toggle <span className='text-xs opacity-50'>(default)</span>
						</h2>
						<ThemePicker />
					</article>

					<article className='grid place-items-center'>
						<h2>toggle-3way</h2>
						<ThemePicker variant='toggle-3way' />
					</article>

					<article className='grid place-items-center'>
						<h2>modal</h2>
						<ThemePicker variant='modal' />
					</article>

					<article className='grid place-items-center'>
						<h2>popover</h2>
						<ThemePicker variant='popover' />
					</article>
				</div>
			</div>
		</ThemeProvider>
	)
}
