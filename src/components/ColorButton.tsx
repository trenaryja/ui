'use client'

import { useTheme } from '@/hooks'
import type { DaisyThemeColor, TailwindColor } from '@/utils'
import {
	cn,
	daisyThemeColors,
	daisyThemeMap,
	isDaisyThemeColor,
	isDaisyThemeName,
	makeTypeGuard,
	tailwindPaletteMap,
} from '@/utils'
import { useMounted } from '@mantine/hooks'
import * as React from 'react'

export type ColorButtonProps = React.ComponentProps<'button'> & {
	color?: DaisyThemeColor | TailwindColor
	darkModeColor?: DaisyThemeColor | TailwindColor
}

type BaseButtonProps = Omit<React.ComponentProps<'button'>, 'color'>

type TailwindColorButtonProps = BaseButtonProps & { color: TailwindColor }

type DaisyColorButtonProps = BaseButtonProps & { color: DaisyThemeColor }

type DaisyButtonColor = Exclude<DaisyThemeColor, `${string}content` | `base${string}`>

const isDaisyButtonColor = makeTypeGuard(
	daisyThemeColors.filter((c): c is DaisyButtonColor => !c.includes('base') && !c.endsWith('content')),
)
const daisyButtonColorMap: Record<DaisyButtonColor, `btn-${DaisyButtonColor}`> = {
	primary: 'btn-primary',
	secondary: 'btn-secondary',
	accent: 'btn-accent',
	neutral: 'btn-neutral',
	info: 'btn-info',
	success: 'btn-success',
	warning: 'btn-warning',
	error: 'btn-error',
}

const DaisyColorButton = ({ color, className, disabled, ...props }: DaisyColorButtonProps) => {
	if (isDaisyButtonColor(color))
		return (
			<button
				className={cn('btn', daisyButtonColorMap[color], className)}
				disabled={disabled}
				type='button'
				{...props}
			/>
		)

	const isBaseContent = color === 'base-content'
	const isContentColor = color.endsWith('-content')
	const baseName = isContentColor ? color.replace('-content', '') : color

	const btnColor = isBaseContent ? 'var(--color-base-content)' : `var(--color-${color})`
	const btnFg = isBaseContent
		? 'var(--color-base-300)'
		: `var(--color-${isContentColor ? baseName : `${baseName}-content`})`
	return (
		<button
			className={cn('btn', className)}
			disabled={disabled}
			style={{ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg } as React.CSSProperties}
			type='button'
			{...props}
		/>
	)
}

const TailwindColorButton = ({ color, className, disabled, ...props }: TailwindColorButtonProps) => {
	const twColor = tailwindPaletteMap.get(color)!
	const btnColor = twColor.oklch
	const btnFg = twColor.isDark
		? daisyThemeMap.get('dark')?.theme['--color-base-content']
		: daisyThemeMap.get('light')?.theme['--color-base-content']
	return (
		<button
			className={cn('btn', className)}
			disabled={disabled}
			style={{ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg } as React.CSSProperties}
			type='button'
			{...props}
		/>
	)
}

export const ColorButton = ({ color = 'base-content', darkModeColor, className, ...props }: ColorButtonProps) => {
	const { resolvedTheme, systemTheme } = useTheme()
	const isMounted = useMounted()

	if (!isMounted) return <div className={cn('btn skeleton', className)} />

	const currentTheme = isDaisyThemeName(resolvedTheme) ? daisyThemeMap.get(resolvedTheme) : undefined
	const colorScheme = currentTheme?.colorScheme ?? systemTheme ?? 'dark'
	const activeColor = colorScheme === 'dark' && darkModeColor ? darkModeColor : color

	return isDaisyThemeColor(activeColor) ? (
		<DaisyColorButton className={className} color={activeColor} {...props} />
	) : (
		<TailwindColorButton className={className} color={activeColor} {...props} />
	)
}
