'use client'

import { useCycle, useTheme } from '@/hooks'
import { cn } from '@/utils'
import { useEffect, useRef } from 'react'
import { FaCircleHalfStroke, FaMoon, FaSun } from 'react-icons/fa6'
import type { ThemePickerToggle3WayProps } from '../ThemePicker.types'

const DEFAULT_ICON_LIGHT = <FaSun />
const DEFAULT_ICON_DARK = <FaMoon />
const DEFAULT_ICON_SYSTEM = <FaCircleHalfStroke />

const THEME_CYCLE = ['light', 'system', 'dark'] as const

export const ThemePickerToggle3Way = ({
	className,
	iconLight = DEFAULT_ICON_LIGHT,
	iconDark = DEFAULT_ICON_DARK,
	iconSystem = DEFAULT_ICON_SYSTEM,
	classNames,
}: ThemePickerToggle3WayProps) => {
	const { theme, setTheme } = useTheme()
	const inputRef = useRef<HTMLInputElement>(null)

	const initialIndex = THEME_CYCLE.indexOf(theme as (typeof THEME_CYCLE)[number])
	const { value, next, increment, setIndex } = useCycle(THEME_CYCLE, {
		initialIndex: initialIndex === -1 ? 1 : initialIndex,
	})

	useEffect(() => {
		const idx = THEME_CYCLE.indexOf(theme as (typeof THEME_CYCLE)[number])
		if (idx !== -1) setIndex(idx)
	}, [theme, setIndex])

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.indeterminate = theme === 'system'
		}
	}, [theme])

	const handleChange = () => {
		increment()
		setTheme(next)
	}

	const icons = { dark: iconDark, light: iconLight, system: iconSystem }
	const currentIcon = icons[value]
	const isSystem = theme === 'system'

	return (
		<label
			className={cn('toggle text-base-content', isSystem && 'toggle-indeterminate', className, classNames?.toggle)}
			aria-label={`Theme: ${value}. Click to switch to ${next}`}
		>
			<input ref={inputRef} type='checkbox' checked={value === 'dark'} onChange={handleChange} />
			<span className='scale-75'>{currentIcon}</span>
			<span className='scale-75'>{currentIcon}</span>
		</label>
	)
}
