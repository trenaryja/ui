import type { DaisyThemeColor, TailwindColor } from '@/utils'
import { cn, daisyThemeColors, daisyThemeMap, makeTypeGuard, tailwindPaletteMap } from '@/utils'
import * as React from 'react'
import { Button } from '../Button/Button'

type BaseButtonProps = Omit<React.ComponentProps<'button'>, 'color'>

type TailwindColorButtonProps = BaseButtonProps & { color: TailwindColor }

type DaisyColorButtonProps = BaseButtonProps & { color: DaisyThemeColor }

type DaisyButtonColor = Exclude<DaisyThemeColor, `${string}content` | `base${string}`>

export const isDaisyButtonColor = makeTypeGuard(
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

export const DaisyColorButton = ({ color, className, disabled, ...props }: DaisyColorButtonProps) => {
	if (isDaisyButtonColor(color))
		return <Button className={cn(daisyButtonColorMap[color], className)} disabled={disabled} {...props} />

	const isBaseContent = color === 'base-content'
	const isContentColor = color.endsWith('-content')
	const baseName = isContentColor ? color.replace('-content', '') : color

	const btnColor = isBaseContent ? 'var(--color-base-content)' : `var(--color-${color})`
	const btnFg = isBaseContent
		? 'var(--color-base-300)'
		: `var(--color-${isContentColor ? baseName : `${baseName}-content`})`
	return (
		<Button
			className={cn(className)}
			disabled={disabled}
			style={{ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg } as React.CSSProperties}
			{...props}
		/>
	)
}

export const TailwindColorButton = ({ color, className, disabled, ...props }: TailwindColorButtonProps) => {
	const twColor = tailwindPaletteMap[color]
	const btnColor = twColor.oklch
	const btnFg = twColor.isDark
		? daisyThemeMap.dark.theme['--color-base-content']
		: daisyThemeMap.light.theme['--color-base-content']
	return (
		<Button
			className={cn(className)}
			disabled={disabled}
			style={{ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg } as React.CSSProperties}
			{...props}
		/>
	)
}
