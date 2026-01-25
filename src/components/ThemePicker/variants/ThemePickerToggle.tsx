'use client'

import { useTheme } from '@/hooks'
import { cn } from '@/utils'
import { FaMoon, FaSun } from 'react-icons/fa6'
import type { ThemePickerToggleProps } from '../ThemePicker.types'
import { getNextToggleTheme, resolveThemeMode } from '../ThemePicker.utils'

const DEFAULT_ICON_LIGHT = <FaSun />
const DEFAULT_ICON_DARK = <FaMoon />

export const ThemePickerToggle = ({
	className,
	iconLight = DEFAULT_ICON_LIGHT,
	iconDark = DEFAULT_ICON_DARK,
	showLabel = false,
	classNames,
}: ThemePickerToggleProps) => {
	const { theme, setTheme, systemTheme, defaultLight, defaultDark } = useTheme()

	const mode = resolveThemeMode(theme, systemTheme)
	const isLight = mode === 'light'

	const handleToggle = () => {
		const nextTheme = getNextToggleTheme({
			currentTheme: theme,
			systemTheme,
			defaultLight,
			defaultDark,
		})
		setTheme(nextTheme)
	}

	return (
		<button
			type='button'
			onClick={handleToggle}
			className={cn('btn btn-ghost btn-square', className, classNames?.button)}
			aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
		>
			<span className={cn('swap-rotate swap', { 'swap-active': !isLight })}>
				<span className={cn('swap-on', classNames?.icon)}>{iconDark}</span>
				<span className={cn('swap-off', classNames?.icon)}>{iconLight}</span>
			</span>
			{showLabel && <span className={cn(classNames?.label)}>{isLight ? 'Light' : 'Dark'}</span>}
		</button>
	)
}
