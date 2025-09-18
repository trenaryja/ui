'use client'

import { ChromaColor } from '@/types'
import * as Slider from '@radix-ui/react-slider'
import chroma, { Color } from 'chroma-js'
import { useState } from 'react'
import { getThumbColor, sliderGradient } from './GradientSlider.utils'

export type GradientSliderProps = {
	min?: number
	max?: number
	value?: number
	defaultValue?: number
	gradient: ChromaColor[]
	thumbColor?: ChromaColor
	onChange?: (value: number, color?: Color) => void
	includeColorOnChange?: boolean
}

export const GradientSlider = ({
	onChange,
	includeColorOnChange = false,
	min = 0,
	max = 100,
	value,
	defaultValue,
	gradient,
	thumbColor,
}: GradientSliderProps) => {
	const gradientColors = gradient.map((x) => chroma(x))
	const trackBackground = sliderGradient(gradientColors)
	const scale = thumbColor ? undefined : chroma.scale(gradientColors).domain([min, max])
	const [_thumbColor, setThumbColor] = useState(getThumbColor(thumbColor, scale, defaultValue ?? 0))
	const thumbHex = getThumbColor(thumbColor, scale, value, _thumbColor).hex()

	const handleChange = (newValue: number) => {
		if ((includeColorOnChange || thumbColor === undefined) && scale !== undefined) {
			const color = scale(newValue)
			if (thumbColor === undefined) setThumbColor(color)
			onChange?.(newValue, color)
			return
		}
		onChange?.(newValue)
	}

	return (
		<Slider.Root
			value={value === undefined ? value : [value]}
			defaultValue={defaultValue === undefined ? defaultValue : [defaultValue]}
			onValueChange={(x) => handleChange(x[0])}
			min={min}
			max={max}
			className='h-4 relative flex items-center select-none touch-none w-full'
		>
			<Slider.Track style={{ background: trackBackground }} className='relative grow rounded-full h-2' />
			<Slider.Thumb style={{ background: thumbHex }} className='block w-4 h-4 rounded-full focus:outline-none' />
		</Slider.Root>
	)
}
