import type { ClassNames } from '@/types'
import type { HexOrientation } from '@/utils'
import type { ComponentProps } from 'react'

export type ColorFormat = 'hex' | 'hsl' | 'oklch' | 'rgb'

export const colorPickerSlots = ['root', 'svg', 'cell', 'cellSelected', 'lightness', 'preview', 'value'] as const
export type ColorPickerSlot = (typeof colorPickerSlots)[number]

export type ColorPickerProps = ClassNames<ColorPickerSlot> &
	Omit<ComponentProps<'div'>, 'onChange'> & {
		/** Controlled color value (any CSS color string). */
		value?: string
		/** Uncontrolled initial color. */
		defaultValue?: string
		onChange?: (color: string) => void
		/** Number of hex rings around the center cell. Default 6. */
		rings?: number
		/** Circumradius of each hex cell in px. Default 16. */
		size?: number
		/** OkLCH lightness 0–1. Default 0.65. */
		defaultLightness?: number
		/** Max OkLCH chroma for the outermost ring. Default 0.4. */
		maxChroma?: number
		orientation?: HexOrientation
		/** Output color format passed to onChange. Default 'oklch'. */
		format?: ColorFormat
	}
