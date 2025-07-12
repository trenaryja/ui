'use client'

import { GradientSlider, GradientSliderProps } from '..'
import { ChromaColor } from '../utils'
import { getHue, hueColors } from './utils'

export type HueSliderProps = Omit<GradientSliderProps, 'value' | 'defaultValue' | 'gradient'> & {
	value?: ChromaColor
	defaultValue?: ChromaColor
}

export const HueSlider = ({ min = 0, max = 360, value, defaultValue, ...props }: HueSliderProps) => {
	const _value = getHue(value)
	const _defaultValue = getHue(defaultValue) ?? 0

	return (
		<GradientSlider gradient={hueColors} min={min} max={max} value={_value} defaultValue={_defaultValue} {...props} />
	)
}
