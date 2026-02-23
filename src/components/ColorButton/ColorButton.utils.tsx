import type { DaisyThemeColor, TailwindColor } from '@/utils'
import { cn, css, daisyThemeColors, daisyThemeMap, makeTypeGuard, tailwindPaletteMap } from '@/utils'
import type { ComponentProps } from 'react'
import { Button } from '../Button/Button'

type BaseButtonProps = Omit<ComponentProps<'button'>, 'color'>

type TailwindColorButtonProps = BaseButtonProps & { color: TailwindColor }

type DaisyColorButtonProps = BaseButtonProps & { color: DaisyThemeColor }

type DaisyRootColor = Exclude<DaisyThemeColor, `${string}content` | `base${string}`>

export const isDaisyRootColor = makeTypeGuard(
	daisyThemeColors.filter((c): c is DaisyRootColor => !c.includes('base') && !c.endsWith('content')),
)

const daisyButtonColor = (color: DaisyRootColor) => `btn-${color}` as const

export const DaisyColorButton = ({ color, className, disabled, ...props }: DaisyColorButtonProps) => {
	if (isDaisyRootColor(color))
		return <Button className={cn(daisyButtonColor(color), className)} disabled={disabled} {...props} />

	const isBaseContent = color === 'base-content'
	const isContentColor = color.endsWith('-content')
	const baseName = isContentColor ? color.replace('-content', '') : color

	const btnColor = isBaseContent ? 'var(--color-base-content)' : `var(--color-${color})`
	const btnFg = isBaseContent
		? 'var(--color-base-300)'
		: `var(--color-${isContentColor ? baseName : `${baseName}-content`})`
	return (
		<Button
			className={className}
			disabled={disabled}
			style={css({ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg })}
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
			className={className}
			disabled={disabled}
			style={css({ '--btn-color': btnColor, '--btn-fg': disabled ? undefined : btnFg })}
			{...props}
		/>
	)
}
