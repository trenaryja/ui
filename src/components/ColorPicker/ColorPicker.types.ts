import type { ClassNames } from '@/types'
import type {
	ColorFormat,
	FunctionalClassName,
	Gamut,
	HexOrientation,
	TailwindColor,
	TailwindColorName,
	TailwindShade,
} from '@/utils'
import type { ComponentProps, ComponentType } from 'react'

export type { ColorFormat, Gamut }

export const colorPickerPreviewSlots = ['preview', 'value'] as const
export type ColorPickerPreviewSlot = (typeof colorPickerPreviewSlots)[number]

export type ColorPickerPreviewProps = ClassNames<ColorPickerPreviewSlot> &
	ComponentProps<'div'> & {
		color: string
	}

type ColorPickerBaseProps = Omit<ComponentProps<'div'>, 'onChange'> & {
	value?: string
	defaultValue?: string
	onChange?: (color: string) => void
	format?: ColorFormat
}

// --- HexWheel ---

export type HexCellState = {
	q: number
	r: number
	isSelected: boolean
	color: string
}

export type ColorPickerHexWheelClassNames = {
	svg?: string
	cell?: FunctionalClassName<HexCellState>
	lightness?: string
}

export type ColorPickerHexWheelProps = ColorPickerBaseProps & {
	classNames?: ColorPickerHexWheelClassNames
	rings?: number
	defaultLightness?: number
	gamut?: Gamut
	orientation?: HexOrientation
}

// --- LCH ---

export type ColorPickerLCHClassNames = {
	lightness?: string
	chroma?: string
	hue?: string
}

export type ColorPickerLCHProps = ColorPickerBaseProps & {
	classNames?: ColorPickerLCHClassNames
	gamut?: Gamut
}

// --- Tailwind ---

export type TailwindSwatchState = {
	name: TailwindColorName
	shade: TailwindShade
	key: TailwindColor
	color: string
	isSelected: boolean
}

export type ColorPickerTailwindClassNames = {
	swatch?: FunctionalClassName<TailwindSwatchState>
	colorLabel?: string
	shadeLabel?: string
}

export type ColorPickerTailwindProps = ColorPickerBaseProps & {
	classNames?: ColorPickerTailwindClassNames
	showColorNames?: boolean
	showShadeLabels?: boolean
}

// --- Shared ---

type VariantProps = {
	'hex-wheel': ColorPickerHexWheelProps
	tailwind: ColorPickerTailwindProps
	lch: ColorPickerLCHProps
}

export type ColorPickerVariant = keyof VariantProps

export type ColorPickerProps =
	| (ColorPickerHexWheelProps & { variant?: 'hex-wheel' })
	| (ColorPickerLCHProps & { variant: 'lch' })
	| (ColorPickerTailwindProps & { variant: 'tailwind' })

export type ColorPickerComponentMap = { [K in ColorPickerVariant]: ComponentType<VariantProps[K]> }
