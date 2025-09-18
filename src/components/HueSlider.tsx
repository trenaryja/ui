'use client'

import chroma from 'chroma-js'
import { ChromaColor } from '../types'
import { GradientSlider, GradientSliderProps } from './GradientSlider'

const hueColors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00']

const getHue = (value: ChromaColor | undefined) => {
	if (value === undefined) return undefined
	if (typeof value === 'number') return value
	return chroma(value).get('hsl.h')
}

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
