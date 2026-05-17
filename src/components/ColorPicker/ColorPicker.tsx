'use client'

import { cn, css, isDark, isTailwindColor, tailwindPaletteMap } from '@/utils'
import type { ComponentType } from 'react'
import { ClipboardButton } from '../ClipboardButton/ClipboardButton'
import type { ColorPickerComponentMap, ColorPickerPreviewProps, ColorPickerProps } from './ColorPicker.types'
import { ColorPickerHexWheel, ColorPickerLCH, ColorPickerTailwind } from './variants'

export * from './ColorPicker.types'

const VARIANT_COMPONENTS: ColorPickerComponentMap = {
	'hex-wheel': ColorPickerHexWheel,
	tailwind: ColorPickerTailwind,
	lch: ColorPickerLCH,
}

export const ColorPickerPreview = ({ color, className, classNames, ...props }: ColorPickerPreviewProps) => {
	const resolvedColor = isTailwindColor(color) ? tailwindPaletteMap[color].oklch : color
	return (
		<div {...props} className={cn('flex w-full items-center gap-2', className, classNames?.preview)}>
			<ClipboardButton
				copy={color}
				className='btn-square'
				style={css({
					'--btn-color': resolvedColor,
					'--btn-fg': isDark(resolvedColor) ? '#fff' : '#000',
				})}
			/>
			<span className={cn('truncate font-mono', classNames?.value)}>{color}</span>
		</div>
	)
}

export const ColorPicker = ({ variant = 'hex-wheel', ...rest }: ColorPickerProps) => {
	const Component = VARIANT_COMPONENTS[variant] as ComponentType<object>
	return <Component {...rest} />
}
