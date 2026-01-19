'use client'

import { useTheme } from '@/hooks'
import type { DaisyThemeColor, TailwindColor } from '@/utils'
import { cn, daisyThemeMap, isDaisyThemeColor, isDaisyThemeName } from '@/utils'
import { useMounted } from '@mantine/hooks'
import * as React from 'react'
import { DaisyColorButton, TailwindColorButton } from './ColorButton.utils'

export type ColorButtonProps = React.ComponentProps<'button'> & {
	color?: DaisyThemeColor | TailwindColor
	darkModeColor?: DaisyThemeColor | TailwindColor
}

export const ColorButton = ({ color = 'base-content', darkModeColor, className, ...props }: ColorButtonProps) => {
	const { resolvedTheme, systemTheme } = useTheme()
	const isMounted = useMounted()

	if (!isMounted) return <div className={cn('btn skeleton', className)} />

	const currentTheme = isDaisyThemeName(resolvedTheme) ? daisyThemeMap[resolvedTheme] : undefined
	const colorScheme = currentTheme?.colorScheme ?? systemTheme ?? 'dark'
	const activeColor = colorScheme === 'dark' && darkModeColor ? darkModeColor : color

	return isDaisyThemeColor(activeColor) ? (
		<DaisyColorButton className={className} color={activeColor} {...props} />
	) : (
		<TailwindColorButton className={className} color={activeColor} {...props} />
	)
}
